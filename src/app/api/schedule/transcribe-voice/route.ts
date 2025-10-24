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

    const transcription = await groq.audio.transcriptions.create({
      file: audioFile,
      model: 'whisper-large-v3',
    });

    const transcript = transcription.text;

    const completion = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [
        {
          role: 'system',
          content: 'You are a helpful assistant that extracts work schedule information from voice transcripts. Always respond with valid JSON only.'
        },
        {
          role: 'user',
          content: `I have a voice transcript from a tradesperson describing their work schedule. Please extract the schedule information and return it in the following JSON format:

{
  "title": "Schedule title or period",
  "workingDays": ["MON", "TUE", "WED", "THU", "FRI"],
  "timeFrom": "08:00",
  "timeTo": "17:00",
  "location": "Work location",
  "notes": "Any additional notes"
}

Rules:
- workingDays should be an array of day codes: MON, TUE, WED, THU, FRI, SAT, SUN
- If they say "weekdays" or "Monday to Friday", use ["MON", "TUE", "WED", "THU", "FRI"]
- timeFrom and timeTo should be in 24-hour format (HH:MM)
- Convert times like "8am" to "08:00", "5pm" to "17:00"
- Extract any mentioned location
- Include any important notes they mention

Here's the transcript:
"${transcript}"

Return ONLY the JSON object, no other text.`,
        },
      ],
      temperature: 0.1,
      max_tokens: 1024,
    });

    const responseText = completion.choices[0]?.message?.content || '';

    // Extract JSON from response
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('Could not extract schedule data from transcript');
    }

    const schedule = JSON.parse(jsonMatch[0]);

    return NextResponse.json({ 
      transcript,
      schedule 
    });
  } catch (error) {
    console.error('Error processing voice input:', error);
    return NextResponse.json(
      { error: 'Failed to process voice input' },
      { status: 500 }
    );
  }
}