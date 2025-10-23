import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { db } from '@/db';
import { surveyData } from '@/db/schema';
import { eq } from 'drizzle-orm';

export async function POST(request: Request) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const data = await request.json();

    // Check if user already has survey data
    const existing = await db.select().from(surveyData).where(eq(surveyData.userId, userId));

    if (existing.length > 0) {
      // Update existing data
      await db.update(surveyData)
        .set({ 
          ...data, 
          updatedAt: new Date() 
        })
        .where(eq(surveyData.userId, userId));
    } else {
      // Insert new data
      await db.insert(surveyData).values({
        userId,
        ...data
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error saving survey data:', error);
    return NextResponse.json({ error: 'Failed to save survey data' }, { status: 500 });
  }
}

export async function GET(request: Request) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const data = await db.select().from(surveyData).where(eq(surveyData.userId, userId));
    
    return NextResponse.json(data[0] || null);
  } catch (error) {
    console.error('Error fetching survey data:', error);
    return NextResponse.json({ error: 'Failed to fetch survey data' }, { status: 500 });
  }
}