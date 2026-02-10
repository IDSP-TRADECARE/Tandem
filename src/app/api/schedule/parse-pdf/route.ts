import { NextRequest, NextResponse } from 'next/server';
import Groq from 'groq-sdk';
import { detectNextWeek } from '@/lib/schedule/detectNextWeek';
import { resolveWeek } from '@/lib/schedule/resolveWeek';

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY!,
});

export async function POST(request: NextRequest) {
  try {
    // ENV VALIDATION
    if (!process.env.GROQ_API_KEY) {
      return NextResponse.json(
        { error: 'Missing GROQ_API_KEY' },
        { status: 500 }
      );
    }

    console.log('✅ Groq initialized');

    // FILE EXTRACTION
    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    console.log('📄 File received:', file.name, file.type, file.size);

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    let scheduleText = '';
    let extractionMethod: 'PDF' | 'IMAGE' | '' = '';

    // PDF PARSE
    if (file.type === 'application/pdf') {
      extractionMethod = 'PDF';
      console.log('📑 Parsing PDF...');

      try {
        const pdf = require('pdf-parse/lib/pdf-parse.js');
        const data = await pdf(buffer);
        scheduleText = data.text;
      } catch {
        const pdfParse = require('pdf-parse');
        const data = await pdfParse(buffer);
        scheduleText = data.text;
      }

      if (!scheduleText.trim()) {
        return NextResponse.json(
          { error: 'Could not extract text from PDF' },
          { status: 400 }
        );
      }

      console.log('📑 PDF text length:', scheduleText.length);

      // IMAGE OCR
    } else if (file.type.startsWith('image/')) {
      extractionMethod = 'IMAGE';
      console.log('🖼️ Processing OCR...');

      if (!process.env.OCR_SPACE_API_KEY) {
        return NextResponse.json(
          { error: 'OCR_SPACE_API_KEY missing' },
          { status: 500 }
        );
      }

      const form = new FormData();
      form.append(
        'base64Image',
        `data:${file.type};base64,${buffer.toString('base64')}`
      );
      form.append('apikey', process.env.OCR_SPACE_API_KEY);
      form.append('language', 'eng');
      form.append('scale', 'true');
      form.append('OCREngine', '2');

      const ocrResponse = await fetch('https://api.ocr.space/parse/image', {
        method: 'POST',
        body: form,
      });

      const result = await ocrResponse.json();

      if (result.IsErroredOnProcessing) {
        throw new Error(result.ErrorMessage || 'OCR failed');
      }

      scheduleText = result.ParsedResults?.[0]?.ParsedText || '';

      if (!scheduleText.trim()) {
        return NextResponse.json(
          { error: 'Could not extract text from image' },
          { status: 400 }
        );
      }
    } else {
      return NextResponse.json(
        { error: 'Unsupported file type' },
        { status: 400 }
      );
    }

    // GROQ PROMPT
    console.log('🤖 Sending to Groq...');

    const systemPrompt = `You are an extraction model.
Extract a work schedule from the given text and return ONLY valid JSON using this exact schema:

{
  "title": "string",
  "workingDays": ["MON","TUE"],
  "daySchedules": {
    "MON": { "timeFrom": "HH:MM", "timeTo": "HH:MM" }
  },
  "location": "string",
  "notes": "string"
}

RULES:
- Use day codes: MON TUE WED THU FRI SAT SUN.
- Convert AM/PM to 24h format (HH:MM).
- If "Monday to Friday" or "Weekdays" -> ["MON","TUE","WED","THU","FRI"].
- If no time is found -> use 09:00-17:00.
- If no location -> "".
- notes MUST be: "Extracted from uploaded ${extractionMethod.toLowerCase()}".
- Do NOT include explanation.
- Do NOT repeat the original text.
- Return ONLY JSON. No markdown. No prose.`;

    // GROQ CALL
    let responseText = '';
    try {
      const chatCompletion = await groq.chat.completions.create({
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: scheduleText },
        ],
        model: 'llama-3.3-70b-versatile',
        temperature: 0,
        max_tokens: 400,
        top_p: 1,
        response_format: { type: 'json_object' },
      });

      responseText = chatCompletion.choices?.[0]?.message?.content || '';

      // Clean
      responseText = responseText
        .replace(/```json/gi, '')
        .replace(/```/g, '')
        .replace(/^[^\{]*/, '')
        .trim();

      console.log('🤖 Groq output cleaned:', responseText);
    } catch (aiError: any) {
      console.error('❌ Groq error:', aiError);
      return NextResponse.json(
        {
          error: 'Groq API failure',
          details: aiError?.message,
        },
        { status: 500 }
      );
    }

    // JSON EXTRACTION
    if (!responseText.includes('{')) {
      return NextResponse.json(
        { error: 'Groq returned no JSON' },
        { status: 500 }
      );
    }

    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      return NextResponse.json(
        { error: 'Could not parse JSON from Groq output' },
        { status: 500 }
      );
    }

    let schedule = JSON.parse(jsonMatch[0]);

    // DEFAULTS
    schedule.title ||= 'Work Schedule';
    schedule.notes = `Extracted from uploaded ${extractionMethod.toLowerCase()}`;
    schedule.location ||= '';

    schedule.workingDays ||= ['MON', 'TUE', 'WED', 'THU', 'FRI'];

    schedule.daySchedules ||= {};
    schedule.workingDays.forEach((day: string) => {
      if (!schedule.daySchedules[day]) {
        schedule.daySchedules[day] = {
          timeFrom: '09:00',
          timeTo: '17:00',
        };
      }
    });

    console.log('✅ Final parsed schedule:', schedule);

    // Detect next-week automatically from extracted text
    const isNextWeek = detectNextWeek(scheduleText);

    // Compute the Monday of the correct week
    const weekStart = resolveWeek(isNextWeek);

    // Attach to schedule for frontend + backend consistency
    schedule.isNextWeek = isNextWeek;
    schedule.weekStart = weekStart;

    // TIME VALIDATION (CRITICAL)

    const days = Object.keys(schedule.daySchedules || {});

    // helper to convert HH:MM > minutes since midnight
    const toMinutes = (t: string) => {
      if (!t || !t.includes(':')) return NaN;
      const [h, m] = t.split(':').map(Number);
      return h * 60 + m;
    };

    for (const day of days) {
      const { timeFrom, timeTo } = schedule.daySchedules[day] || {};

      if (!timeFrom || !timeTo) {
        return NextResponse.json(
          { error: `Missing time range for ${day}` },
          { status: 400 }
        );
      }

      const start = toMinutes(timeFrom);
      const end = toMinutes(timeTo);

      if (isNaN(start) || isNaN(end)) {
        return NextResponse.json(
          { error: `Invalid time format on ${day}: ${timeFrom} > ${timeTo}` },
          { status: 400 }
        );
      }

      if (start === end) {
        return NextResponse.json(
          { error: `Start and end times cannot be the same for ${day}` },
          { status: 400 }
        );
      }

      if (end < start) {
        return NextResponse.json(
          { error: `End time must be AFTER start time for ${day}` },
          { status: 400 }
        );
      }
    }

    console.log('⏱️ Schedule passed PDF/IMAGE time validation');

    console.log('📅 Document upload resolved week:', { isNextWeek, weekStart });

    return NextResponse.json({ schedule });
  } catch (err: any) {
    console.error('❌ Unhandled error:', err);
    return NextResponse.json(
      {
        error: 'Failed to parse schedule',
        details: err?.message || 'Unknown error',
      },
      { status: 500 }
    );
  }
}
