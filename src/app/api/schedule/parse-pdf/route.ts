import { NextRequest, NextResponse } from 'next/server';
import Groq from 'groq-sdk';

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY!,
});

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    console.log('PDF file received:', file.name, file.size);

    // Extract text from PDF
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    
    let pdfText = '';
    
    try {
      // Try to parse PDF
      const pdf = require('pdf-parse/lib/pdf-parse.js');
      const data = await pdf(buffer);
      pdfText = data.text;
    } catch (parseError) {
      console.error('PDF parse error:', parseError);
      
      // Fallback: Try alternative method
      try {
        const pdfParse = require('pdf-parse');
        const data = await pdfParse(buffer);
        pdfText = data.text;
      } catch (fallbackError) {
        console.error('Fallback parse error:', fallbackError);
        throw new Error('Could not parse PDF. Please ensure it is a valid text-based PDF.');
      }
    }

    console.log('PDF text extracted, length:', pdfText.length);
    console.log('First 200 chars:', pdfText.substring(0, 200));

    // Check if PDF has readable text
    if (!pdfText || pdfText.trim().length === 0) {
      return NextResponse.json({ 
        error: 'Could not extract text from PDF. Make sure it is not a scanned image.' 
      }, { status: 400 });
    }

    // Use Groq to extract schedule information from PDF text
    console.log('Sending to Groq for parsing...');
    const completion = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [
        {
          role: 'system',
          content: 'You are a helpful assistant that extracts work schedule information from text. Always respond with valid JSON only.'
        },
        {
          role: 'user',
          content: `Extract the work schedule information from this PDF text and return it in the following JSON format:
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
- timeFrom and timeTo should be in 24-hour format (HH:MM)
- Extract any relevant location information
- Include any important notes or special instructions
- If weekdays or "Monday to Friday" is mentioned, use ["MON", "TUE", "WED", "THU", "FRI"]

Return ONLY the JSON object, no other text.

PDF Text:
${pdfText}`,
        },
      ],
      temperature: 0.1,
      max_tokens: 1024,
    });

    const responseText = completion.choices[0]?.message?.content || '';
    console.log('Groq response:', responseText);

    // Extract JSON from response
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      console.error('Could not find JSON in response');
      throw new Error('Could not extract schedule data from PDF');
    }

    const schedule = JSON.parse(jsonMatch[0]);
    console.log('Parsed schedule:', schedule);

    return NextResponse.json({ schedule });
  } catch (error) {
    console.error('Error parsing PDF:', error);
    return NextResponse.json(
      { 
        error: 'Failed to parse PDF schedule',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}