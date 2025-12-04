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

    console.log('📄 File received:', file.name, file.type, file.size);

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    
    let scheduleText = '';
    let extractionMethod = '';

    // Handle different file types
    if (file.type === 'application/pdf') {
      // PDF Processing
      console.log('📑 Processing PDF...');
      extractionMethod = 'PDF';
      
      try {
        const pdf = require('pdf-parse/lib/pdf-parse.js');
        const data = await pdf(buffer);
        scheduleText = data.text;
      } catch (parseError) {
        console.error('PDF parse error:', parseError);
        
        try {
          const pdfParse = require('pdf-parse');
          const data = await pdfParse(buffer);
          scheduleText = data.text;
        } catch (fallbackError) {
          console.error('Fallback parse error:', fallbackError);
          throw new Error('Could not parse PDF. Please ensure it is a valid text-based PDF.');
        }
      }

      console.log('PDF text extracted, length:', scheduleText.length);

      if (!scheduleText || scheduleText.trim().length === 0) {
        return NextResponse.json({ 
          error: 'Could not extract text from PDF. Make sure it is not a scanned image.' 
        }, { status: 400 });
      }

    } else if (file.type.startsWith('image/')) {
      // Image Processing using OCR Space API
      console.log('🖼️ Processing image with OCR Space API...');
      extractionMethod = 'IMAGE';
      
      if (!process.env.OCR_SPACE_API_KEY) {
        throw new Error('OCR_SPACE_API_KEY is not configured');
      }

      // Convert buffer to base64
      const base64Image = buffer.toString('base64');
      
      // Create form data for OCR Space API
      const ocrFormData = new FormData();
      ocrFormData.append('base64Image', `data:${file.type};base64,${base64Image}`);
      ocrFormData.append('apikey', process.env.OCR_SPACE_API_KEY);
      ocrFormData.append('language', 'eng');
      ocrFormData.append('isOverlayRequired', 'false');
      ocrFormData.append('detectOrientation', 'true');
      ocrFormData.append('scale', 'true');
      ocrFormData.append('OCREngine', '2'); // Use OCR Engine 2 for better accuracy

      // Call OCR Space API
      const ocrResponse = await fetch('https://api.ocr.space/parse/image', {
        method: 'POST',
        body: ocrFormData,
      });

      if (!ocrResponse.ok) {
        throw new Error(`OCR API request failed: ${ocrResponse.statusText}`);
      }

      const ocrResult = await ocrResponse.json();
      console.log('📝 OCR result:', ocrResult);

      if (ocrResult.IsErroredOnProcessing) {
        throw new Error(`OCR processing failed: ${ocrResult.ErrorMessage || 'Unknown error'}`);
      }

      if (!ocrResult.ParsedResults || ocrResult.ParsedResults.length === 0) {
        throw new Error('No text found in image');
      }

      scheduleText = ocrResult.ParsedResults[0].ParsedText;
      console.log('📝 Extracted text from image:', scheduleText.substring(0, 200));

      if (!scheduleText || scheduleText.trim().length === 0) {
        return NextResponse.json({ 
          error: 'Could not extract text from image. Please ensure the image is clear and readable.' 
        }, { status: 400 });
      }

    } else {
      return NextResponse.json({ 
        error: 'Unsupported file type. Please upload a PDF or image (PNG, JPG, JPEG).' 
      }, { status: 400 });
    }

    // Parse the extracted text using Groq
    console.log('🤖 Parsing schedule information...');
    const completion = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [
        {
          role: 'system',
          content: 'You are a helpful assistant that extracts work schedule information from text. Always respond with valid JSON only.'
        },
        {
          role: 'user',
          content: `Extract the work schedule information from this ${extractionMethod.toLowerCase()} and return it in the following JSON format:
{
  "title": "Schedule title or period",
  "workingDays": ["MON", "TUE", "WED", "THU", "FRI"],
  "daySchedules": {
    "MON": { "timeFrom": "09:00", "timeTo": "17:00" },
    "TUE": { "timeFrom": "09:00", "timeTo": "17:00" },
    "WED": { "timeFrom": "09:00", "timeTo": "17:00" },
    "THU": { "timeFrom": "09:00", "timeTo": "17:00" },
    "FRI": { "timeFrom": "09:00", "timeTo": "17:00" }
  },
  "location": "Work location",
  "notes": "Extracted from uploaded ${extractionMethod.toLowerCase()}"
}

CRITICAL RULES:
- workingDays MUST be an array of day codes: MON, TUE, WED, THU, FRI, SAT, SUN (never empty)
- daySchedules MUST have an entry for EACH day in workingDays
- If different days have different times, extract them separately
- If all days have the same time, use that time for all days in daySchedules
- timeFrom and timeTo MUST be in 24-hour format (HH:MM) and NEVER empty
- If NO time is mentioned, use "09:00" for timeFrom and "17:00" for timeTo
- Extract any relevant location information
- notes should say "Extracted from uploaded ${extractionMethod.toLowerCase()}"

Return ONLY the JSON object, no other text.

Extracted Text:
${scheduleText}`,
        },
      ],
      temperature: 0.1,
      max_tokens: 1024,
    });

    const responseText = completion.choices[0]?.message?.content || '';
    console.log('🤖 Groq response:', responseText);

    // Extract JSON from response
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      console.error('Could not find JSON in response');
      throw new Error('Could not extract schedule data from file');
    }

    const schedule = JSON.parse(jsonMatch[0]);

    // Validate and provide defaults
    if (!schedule.workingDays || schedule.workingDays.length === 0) {
      schedule.workingDays = ['MON', 'TUE', 'WED', 'THU', 'FRI'];
    }
    if (!schedule.title || schedule.title === '') {
      schedule.title = 'Work Schedule';
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

    console.log('✅ Parsed schedule:', schedule);

    return NextResponse.json({ schedule });
  } catch (error) {
    console.error('❌ Error parsing file:', error);
    return NextResponse.json(
      { 
        error: 'Failed to parse schedule',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}