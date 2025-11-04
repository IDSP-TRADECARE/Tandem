import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

export async function POST(request: NextRequest) {
  try {
    console.log('📥 Upload API called');
    
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      console.error('❌ No file provided');
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    console.log('📄 File received:', file.name, file.type, file.size);

    // Validate file type
    const allowedTypes = ['application/pdf', 'image/png', 'image/jpeg', 'image/jpg'];
    if (!allowedTypes.includes(file.type)) {
      console.error('❌ Invalid file type:', file.type);
      return NextResponse.json(
        { error: 'Invalid file type. Please upload PDF, PNG, or JPG files.' },
        { status: 400 }
      );
    }

    // Validate file size (10MB max)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      console.error('❌ File too large:', file.size);
      return NextResponse.json(
        { error: 'File too large. Maximum size is 10MB.' },
        { status: 400 }
      );
    }

    // Convert file to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Create uploads directory if it doesn't exist
    const uploadsDir = path.join(process.cwd(), 'uploads');
    try {
      await mkdir(uploadsDir, { recursive: true });
    } catch (error) {
      console.log('📁 Uploads directory already exists or created');
    }

    // Generate unique filename
    const fileExtension = path.extname(file.name);
    const uniqueFilename = `${uuidv4()}${fileExtension}`;
    const filepath = path.join(uploadsDir, uniqueFilename);

    // Write file to disk
    await writeFile(filepath, buffer);
    console.log('✅ File saved:', filepath);

    // TODO: Add your AI processing here
    // For now, return mock schedule data
    const mockScheduleData = {
      title: 'Work Schedule',
      workingDays: ['MON', 'TUE', 'WED', 'THU', 'FRI'],
      timeFrom: '09:00',
      timeTo: '17:00',
      location: 'Vancouver Downtown',
      notes: 'Extracted from uploaded file',
      filename: uniqueFilename,
      originalName: file.name,
    };

    console.log('✅ Returning schedule data:', mockScheduleData);

    return NextResponse.json({
      success: true,
      message: 'File uploaded successfully',
      data: mockScheduleData,
    });

  } catch (error) {
    console.error('❌ Upload API error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to upload file',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// Configure the API route
export const config = {
  api: {
    bodyParser: false,
  },
};