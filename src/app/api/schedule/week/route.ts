import { NextRequest, NextResponse } from 'next/server';
import { db } from '../../../../db/index';
import { schedules } from '../../../../db/schema';
import { eq } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    const userId = request.headers.get('x-user-id') || 'demo-user';
    
    console.log('🔍 API: Fetching schedules for user:', userId);

    const userSchedules = await db
      .select()
      .from(schedules)
      .where(eq(schedules.userId, userId));

    console.log('✅ API: Found schedules:', userSchedules.length);

    return NextResponse.json({ schedules: userSchedules });
  } catch (error) {
    console.error('❌ API Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch schedule' },
      { status: 500 }
    );
  }
}