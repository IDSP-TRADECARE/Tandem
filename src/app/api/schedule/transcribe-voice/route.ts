import { NextRequest, NextResponse } from 'next/server';
import Groq from 'groq-sdk';

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY!,
});

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const audioFile = formData.get('audio') as File;

    if (!audioFile) {
      return NextResponse.json({ error: 'No audio file provided' }, { status: 400 });
    }

    console.log('🎤 Received audio file:', audioFile.name, audioFile.size, 'bytes');

    // Transcribe audio using Groq Whisper
    console.log('🔄 Transcribing audio...');
    const transcription = await groq.audio.transcriptions.create({
      file: audioFile,
      model: 'whisper-large-v3',
    });

    const transcript = transcription.text;
    console.log('📝 Transcript:', transcript);

    // Initialize Watsonx AI (same as PDF route)
    let watsonxAI;
    try {
      const { WatsonXAI } = require('@ibm-cloud/watsonx-ai');
      const { IamAuthenticator } = require('ibm-cloud-sdk-core');
      
      const authenticator = new IamAuthenticator({
        apikey: process.env.WATSONX_API_KEY!,
      });
      
      watsonxAI = WatsonXAI.newInstance({
        version: '2024-05-31',
        authenticator: authenticator,
        serviceUrl: process.env.WATSONX_URL || 'https://us-south.ml.cloud.ibm.com',
      });
      
      console.log('✅ Watsonx AI initialized');
    } catch (sdkError) {
      console.error('❌ Failed to initialize Watsonx AI:', sdkError);
      return NextResponse.json({ 
        error: 'Failed to initialize Watsonx AI',
        details: sdkError instanceof Error ? sdkError.message : 'Unknown error'
      }, { status: 500 });
    }

    // Parse using Watsonx AI (same model as PDF route)
    console.log('🤖 Parsing schedule from transcript...');
    
    const prompt = `Extract the work schedule information from this transcript and return it in the following JSON format:

{
  "title": "Work Schedule",
  "workingDays": ["MON", "TUE", "WED", "THU", "FRI"],
  "daySchedules": {
    "MON": { "timeFrom": "09:00", "timeTo": "17:00" },
    "TUE": { "timeFrom": "09:00", "timeTo": "17:00" },
    "WED": { "timeFrom": "09:00", "timeTo": "17:00" },
    "THU": { "timeFrom": "09:00", "timeTo": "17:00" },
    "FRI": { "timeFrom": "09:00", "timeTo": "17:00" }
  },
  "location": "Work location",
  "notes": "Created via voice input"
}

CRITICAL RULES:
- workingDays MUST be an array of day codes: MON, TUE, WED, THU, FRI, SAT, SUN (never empty)
- daySchedules MUST have an entry for EACH day in workingDays
- If "weekdays" or "Monday to Friday" or "Monday through Friday" is mentioned, use ["MON", "TUE", "WED", "THU", "FRI"]
- If different days have different times, extract them separately
- If all days have the same time, use that time for all days in daySchedules
- timeFrom and timeTo MUST be in 24-hour format (HH:MM) and NEVER empty
- Convert times like "8am" to "08:00", "5pm" to "17:00"
- If no time is mentioned, use "09:00" to "17:00" as default for all days
- Extract any location mentioned, if none use empty string
- notes should always be "Created via voice input"

Return ONLY the JSON object with all required fields filled, no other text.

Transcript: "${transcript}"`;

    let responseText;
    try {
      const response = await watsonxAI.generateText({
        input: prompt,
        modelId: 'meta-llama/llama-3-3-70b-instruct', // Same as PDF route
        projectId: process.env.WATSONX_PROJECT_ID!,
        parameters: {
          max_new_tokens: 512,
          temperature: 0.1,
          decoding_method: 'greedy',
        },
      });

      console.log('🤖 Watsonx AI response:', JSON.stringify(response.result, null, 2));
      
      responseText = response.result?.results?.[0]?.generated_text || '';
      responseText = responseText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      
      console.log('🤖 Response text (cleaned):', responseText);
    } catch (aiError) {
      console.error('❌ Watsonx AI API call failed:', aiError);
      return NextResponse.json({ 
        error: 'Failed to process with Watsonx AI',
        details: aiError instanceof Error ? aiError.message : 'Unknown error'
      }, { status: 500 });
    }

    // Extract JSON from response
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      console.error('Could not find JSON in response:', responseText);
      throw new Error('Could not extract schedule data from transcript');
    }

    const schedule = JSON.parse(jsonMatch[0]);

    // Validate and provide defaults
    if (!schedule.workingDays || schedule.workingDays.length === 0) {
      schedule.workingDays = ['MON', 'TUE', 'WED', 'THU', 'FRI'];
    }
    if (!schedule.title || schedule.title === '') {
      schedule.title = 'Work Schedule';
    }
    if (!schedule.notes) {
      schedule.notes = 'Created via voice input';
    }

    // Ensure daySchedules exists and has entries for all working days
    if (!schedule.daySchedules) {
      schedule.daySchedules = {};
    }

    schedule.workingDays.forEach((day: string) => {
      if (!schedule.daySchedules[day]) {
        schedule.daySchedules[day] = {
          timeFrom: '09:00',
          timeTo: '17:00'
        };
      }
    });

    console.log('✅ Parsed schedule (with defaults):', schedule);

    return NextResponse.json({ 
      transcript,
      schedule 
    });
  } catch (error) {
    console.error('❌ Error processing voice input:', error);
    return NextResponse.json(
      { 
        error: 'Failed to process voice input',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}