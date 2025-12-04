import { NextRequest, NextResponse } from 'next/server';
import Groq from 'groq-sdk';
import { WatsonXAI } from '@ibm-cloud/watsonx-ai';
import { IamAuthenticator } from 'ibm-cloud-sdk-core';
import { detectNextWeek } from '@/lib/schedule/detectNextWeek';

export const runtime = 'nodejs';

// GROQ
const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY!,
});

// WATSONX
const authenticator = new IamAuthenticator({
  apikey: process.env.WATSONX_API_KEY!,
});

const watsonxAI = WatsonXAI.newInstance({
  version: '2024-05-31',
  authenticator,
  serviceUrl: process.env.WATSONX_URL || 'https://us-south.ml.cloud.ibm.com',
});

const WATSON_MODEL = 'ibm/granite-3-8b-instruct';

// PRESENTATION DEFAULT
const PRESENTATION_DEFAULT = {
  title: 'Work Schedule',
  workingDays: ['MON', 'WED', 'THU', 'FRI'],
  daySchedules: {
    MON: { timeFrom: '05:00', timeTo: '13:00' },
    WED: { timeFrom: '04:00', timeTo: '12:00' },
    THU: { timeFrom: '06:00', timeTo: '14:00' },
    FRI: { timeFrom: '06:00', timeTo: '14:00' },
  },
  location: 'Surrey',
  notes: 'Created via voice input',
};

// HELPERS
function normalizeDayName(name: string) {
  const map: Record<string, string> = {
    monday: 'MON',
    mon: 'MON',
    tuesday: 'TUE',
    tue: 'TUE',
    tues: 'TUE',
    wednesday: 'WED',
    wed: 'WED',
    thursday: 'THU',
    thu: 'THU',
    thurs: 'THU',
    friday: 'FRI',
    fri: 'FRI',
    saturday: 'SAT',
    sat: 'SAT',
    sunday: 'SUN',
    sun: 'SUN',
  };
  return map[name.toLowerCase()] || '';
}

function parseTime(text: string) {
  const m = text.match(/(\d{1,2})(:?(\d{2}))?\s*(am|pm)?/i);
  if (!m) return null;

  let hour = parseInt(m[1], 10);
  let min = parseInt(m[3] || '00');
  const ap = m[4]?.toLowerCase();

  if (ap === 'pm' && hour !== 12) hour += 12;
  if (ap === 'am' && hour === 12) hour = 0;

  return `${hour.toString().padStart(2, '0')}:${min
    .toString()
    .padStart(2, '0')}`;
}

function convertToTimeRange(text: string) {
  const m = text.match(
    /(\d{1,2}(:\d{2})?\s*(am|pm)?)\s*(to|-)\s*(\d{1,2}(:\d{2})?\s*(am|pm)?)/i
  );
  if (!m) return null;

  const start = parseTime(m[1]);
  const end = parseTime(m[5]);
  if (!start || !end) return null;

  const [sh, sm] = start.split(':').map(Number);
  const [eh, em] = end.split(':').map(Number);
  if (eh * 60 + em <= sh * 60 + sm) return null;

  return { timeFrom: start, timeTo: end };
}

export async function POST(request: NextRequest) {
  try {
    // AUDIO EXTRACTION
    const formData = await request.formData();
    const audioFile = formData.get('audio') as File | null;
    if (!audioFile) {
      return NextResponse.json(
        { error: 'No audio file provided' },
        { status: 400 }
      );
    }

    // GROQ TRANSCRIBE
    const transcription = await groq.audio.transcriptions.create({
      file: audioFile,
      model: 'whisper-large-v3-turbo',
    });
    const transcript = transcription.text?.trim() || '';
    console.log('📝 Transcript:', transcript);

    //friday mode **BOOM
    const weekOffset: 'current' | 'next' = 'next';
    //const weekOffset = detectNextWeek(transcript) ? 'next' : 'current';


    if (transcript.length < 6) {
      return NextResponse.json({
        transcript,
        schedule: { ...PRESENTATION_DEFAULT, weekOffset },
      });
    }

    // WATSONX PROMPT
    const prompt = `
Extract a weekly work schedule. Output ONLY valid JSON using:

{
  "title": "Work Schedule",
  "workingDays": ["MON"],
  "daySchedules": { "MON": { "timeFrom": "05:00", "timeTo": "13:00" } },
  "location": "",
  "notes": "Created via voice input"
}

Rules:
- Use day codes (MON–SUN)
- Convert AM/PM → 24h
- NEVER output arrays
- NEVER output long names
- Skip days with invalid times

Transcript:
"${transcript}"
`.trim();

    // WATSONX CALL
    const wx = await watsonxAI.generateText({
      input: prompt,
      modelId: WATSON_MODEL,
      projectId: process.env.WATSONX_PROJECT_ID!,
      parameters: { max_new_tokens: 400, temperature: 0, top_p: 1 },
    });

    // RAW OUTPUT CLEAN
    let raw = wx.result?.results?.[0]?.generated_text?.trim() || '';
    raw = raw
      .replace(/```json|```/g, '')
      .replace(/[\u0000-\u001F]+/g, '')
      .trim();
    const jsonMatch = raw.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      return NextResponse.json({
        transcript,
        schedule: { ...PRESENTATION_DEFAULT, weekOffset },
      });
    }

    // PARSE
    let ai: any;
    try {
      ai = JSON.parse(jsonMatch[0]);
    } catch {
      return NextResponse.json({
        transcript,
        schedule: { ...PRESENTATION_DEFAULT, weekOffset },
      });
    }

    // NORMALIZE DAYS
    const fixed: any = {};
    for (const key of Object.keys(ai.daySchedules || {})) {
      const norm = normalizeDayName(key);
      if (!norm) continue;

      const val = ai.daySchedules[key];
      let range = null;

      if (typeof val === 'string') range = convertToTimeRange(val);
      else if (Array.isArray(val) && typeof val[0] === 'string')
        range = convertToTimeRange(val[0]);
      else if (val?.timeFrom && val?.timeTo) range = val;

      if (range) fixed[norm] = range;
    }

    const workingDays = Object.keys(fixed);

    // NEW RULE: If transcript does NOT contain ANY weekday > fallback immediately
    const transcriptLC = transcript.toLowerCase();
    const weekdayWords = [
      'mon',
      'monday',
      'tue',
      'tues',
      'tuesday',
      'wed',
      'weds',
      'wednesday',
      'thu',
      'thurs',
      'thursday',
      'fri',
      'friday',
      'sat',
      'saturday',
      'sun',
      'sunday',
    ];

    const transcriptContainsDay = weekdayWords.some((w) =>
      transcriptLC.includes(w)
    );

    if (!transcriptContainsDay) {
      console.warn(
        '⚠️ Transcript contains NO real weekdays > using presentation default'
      );
      return NextResponse.json({
        transcript,
        schedule: { ...PRESENTATION_DEFAULT, weekOffset },
      });
    }

    // FINAL VALIDATION > fallback if needed
    const valid =
      workingDays.length > 0 &&
      workingDays.every((d) => {
        const r = fixed[d];
        return r?.timeFrom && r?.timeTo && r.timeFrom !== r.timeTo;
      });

    if (!valid) {
      return NextResponse.json({
        transcript,
        schedule: { ...PRESENTATION_DEFAULT, weekOffset },
      });
    }

    // FINAL SCHEDULE (ONLY user days)
    const finalSchedule = {
      title: 'Work Schedule',
      workingDays,
      daySchedules: fixed,
      location: ai.location || '',
      notes: 'Created via voice input',
      weekOffset,
    };

    console.log('✅ Final schedule:', finalSchedule);

    return NextResponse.json({
      transcript,
      schedule: finalSchedule,
    });
  } catch (err: any) {
    console.error('❌ Voice processing error:', err);
    return NextResponse.json(
      { error: 'Failed to process voice input', details: err.message },
      { status: 500 }
    );
  }
}
