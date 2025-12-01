import { NextRequest, NextResponse } from 'next/server';
import Groq from 'groq-sdk';
import { WatsonXAI } from '@ibm-cloud/watsonx-ai';
import { IamAuthenticator } from 'ibm-cloud-sdk-core';

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

const WATSON_MODEL = 'ibm/granite-4-h-small';

export async function POST(request: NextRequest) {
  const t0 = Date.now();

  try {
    //  AUDIO INPUT 
    const formData = await request.formData();
    const audioFile = formData.get('audio') as File | null;
    if (!audioFile) {
      return NextResponse.json(
        { error: 'No audio file provided' },
        { status: 400 }
      );
    }

    //  GROQ WHISPER TRANSCRIBE 
    const transcription = await groq.audio.transcriptions.create({
      file: audioFile,
      model: 'whisper-large-v3-turbo',
    });

    const transcript = transcription.text;
    console.log('📝 Transcript:', transcript);

    //  WATSONX PROMPT 
    const prompt = `
Extract the work schedule from the transcript.
Return ONLY valid JSON in this format:

{
  "title": "Work Schedule",
  "workingDays": ["MON", "TUE"],
  "daySchedules": {
    "MON": { "timeFrom": "09:00", "timeTo": "17:00" }
  },
  "location": "",
  "notes": "Created via voice input"
}

RULES:
- workingDays MUST use: MON, TUE, WED, THU, FRI, SAT, SUN.
- Convert times to 24-hour "HH:MM" format.
- If "Monday to Friday" → ["MON","TUE","WED","THU","FRI"].
- If same time for all days, repeat it for each day.
- location = extracted location or empty string.
- notes MUST always be "Created via voice input".
- RETURN ONLY THE JSON. No explanation, no markdown.

Transcript: "${transcript}"
    `.trim();

    //  WATSONX CALL 
    const wxStart = Date.now();
    const response = await watsonxAI.generateText({
      input: prompt,
      modelId: WATSON_MODEL,
      projectId: process.env.WATSONX_PROJECT_ID!,
      parameters: {
        max_new_tokens: 350,
        min_new_tokens: 30,
        temperature: 0,
        top_p: 1,
        stop_sequences: [],
        repetition_penalty: 1.0,
      },
    });

    const wxEnd = Date.now();
    console.log('⏱ Watsonx generateText:', wxEnd - wxStart, 'ms');

    let output = response.result?.results?.[0]?.generated_text?.trim() || '';
    console.log('🤖 Raw Watsonx Output:', output);

    //  CLEAN & FIX ANY TRUNCATION 
    // Remove markdown fences
    output = output
      .replace(/```json/g, '')
      .replace(/```/g, '')
      .trim();

    // If JSON is truncated before the end
    if (output.endsWith('"notes": "Created via voice')) {
      console.warn('⚠️ Detected truncated notes. Fixing.');
      output = output.replace(
        /"notes": "Created via voice.*/g,
        `"notes": "Created via voice input"}`
      );
    }

    // Ensure JSON ends with }
    if (!output.endsWith('}')) {
      console.warn('⚠️ JSON ended early. Appending }.');
      output = output + '}';
    }

    // Try extracting the JSON block
    const jsonMatch = output.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('Watsonx returned no JSON');
    }

    const schedule = JSON.parse(jsonMatch[0]);

    //  SAFETY DEFAULTS 
    schedule.title ||= 'Work Schedule';
    schedule.notes = 'Created via voice input';
    schedule.location ||= '';

    if (!schedule.workingDays?.length) {
      schedule.workingDays = ['MON', 'TUE', 'WED', 'THU', 'FRI'];
    }

    schedule.daySchedules ||= {};
    schedule.workingDays.forEach((day: string) => {
      if (!schedule.daySchedules[day]) {
        schedule.daySchedules[day] = {
          timeFrom: '09:00',
          timeTo: '17:00',
        };
      }
    });

    console.log('✅ Final schedule:', schedule);

    return NextResponse.json({
      transcript,
      schedule,
    });
  } catch (error: any) {
    console.error('❌ Voice processing error:', error);
    return NextResponse.json(
      { error: 'Failed to process voice input', details: error.message },
      { status: 500 }
    );
  }
}
