import { NextRequest, NextResponse } from 'next/server';
import Groq from 'groq-sdk';
import { WatsonXAI } from '@ibm-cloud/watsonx-ai';
import { IamAuthenticator } from 'ibm-cloud-sdk-core';

import { detectNextWeek } from '@/lib/schedule/detectNextWeek';

export const runtime = 'nodejs';

// ---- GROQ ----
const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY!,
});

// ---- WATSONX ----
const authenticator = new IamAuthenticator({
  apikey: process.env.WATSONX_API_KEY!,
});

const watsonxAI = WatsonXAI.newInstance({
  version: '2024-05-31',
  authenticator,
  serviceUrl: process.env.WATSONX_URL || 'https://us-south.ml.cloud.ibm.com',
});

const WATSON_MODEL = 'ibm/granite-3-8b-instruct';

export async function POST(request: NextRequest) {
  try {
    // ---- AUDIO INPUT ----
    const formData = await request.formData();
    const audioFile = formData.get('audio') as File | null;

    if (!audioFile) {
      return NextResponse.json(
        { error: 'No audio file provided' },
        { status: 400 }
      );
    }

    // ---- GROQ WHISPER ----
    const transcription = await groq.audio.transcriptions.create({
      file: audioFile,
      model: 'whisper-large-v3-turbo',
    });

    const transcript = transcription.text?.trim() || '';
    console.log('📝 Transcript:', transcript);

    // ---- WATSONX PROMPT ----
    const prompt = `
You MUST extract a detailed weekly schedule from the transcript and return ONLY valid JSON.

Follow EXACTLY this schema:

{
  "title": "Work Schedule",
  "workingDays": ["MON","WED","THU","FRI"],
  "daySchedules": {
    "MON": { "timeFrom": "05:00", "timeTo": "15:00" },
    "WED": { "timeFrom": "03:00", "timeTo": "16:00" },
    "THU": { "timeFrom": "07:00", "timeTo": "15:00" },
    "FRI": { "timeFrom": "07:00", "timeTo": "15:00" }
  },
  "location": "",
  "notes": "Created via voice input"
}

STRICT RULES:
- Extract EVERY day mentioned.
- Extract EXACT times for each day.
- Convert times to 24-hour HH:MM.
- If one time range applies to multiple days (e.g. Thursday and Friday), apply it to EACH day separately.
- If a day is mentioned with NO time, SKIP it completely.
- NEVER infer times.
- NEVER output comments, notes, or explanations.
- NEVER output parentheses.
- NEVER output text outside the JSON.
- ONLY return the final JSON object.

Transcript:
"${transcript}"
`.trim();

    const wx = await watsonxAI.generateText({
      input: prompt,
      modelId: WATSON_MODEL,
      projectId: process.env.WATSONX_PROJECT_ID!,
      parameters: {
        max_new_tokens: 300,
        temperature: 0,
        top_p: 1,
      },
    });

    let raw = wx.result?.results?.[0]?.generated_text?.trim() || '';
    console.log('🤖 Raw WatsonX:', raw);

    raw = raw.replace(/```json|```/g, '').trim();

    const jsonMatch = raw.match(/\{[\s\S]*\}/);

    if (!jsonMatch) {
      console.warn(
        '⚠️ WatsonX returned NO JSON. Falling back to default schedule.'
      );
      return NextResponse.json({
        transcript,
        schedule: {
          title: 'Work Schedule',
          workingDays: ['MON'],
          daySchedules: {
            MON: { timeFrom: '09:00', timeTo: '17:00' },
          },
          location: '',
          notes: 'Created via voice input',
          weekOffset: detectNextWeek(transcript) ? 'next' : 'current',
        },
      });
    }

    // --- SAFE JSON PARSE ---
    let schedule = JSON.parse(jsonMatch[0]);

    // ---- NORMALIZATION ----
    schedule.title ||= 'Work Schedule';
    schedule.notes = 'Created via voice input';
    schedule.location ||= '';

    if (!schedule.workingDays || !schedule.workingDays.length) {
      throw new Error('Invalid AI output: missing workingDays');
    }

    if (!schedule.daySchedules) {
      throw new Error('Invalid AI output: missing daySchedules');
    }

    // ---- ADD NEXT-WEEK FLAG ----
    schedule.weekOffset = detectNextWeek(transcript) ? 'next' : 'current';
    console.log('📆 Week offset:', schedule.weekOffset);

    console.log('✅ Final schedule sent to client:', schedule);

    return NextResponse.json({
      transcript,
      schedule,
    });
  } catch (err: any) {
    console.error('❌ Voice processing error:', err);

    return NextResponse.json(
      {
        error: 'Failed to process voice input',
        details: err.message,
      },
      { status: 500 }
    );
  }
}
