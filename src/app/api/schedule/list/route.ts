import { NextRequest, NextResponse } from 'next/server';
import { db } from '../../../../db/index';
import { schedules } from '../../../../db/schema';
import { eq, desc } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    const userId = request.headers.get('x-user-id') || 'demo-user';

    const [latestSchedule] = await db
      .select()
      .from(schedules)
      .where(eq(schedules.userId, userId))
      .orderBy(desc(schedules.updatedAt))  
      .limit(1);

    return NextResponse.json({
      schedules: latestSchedule ? [latestSchedule] : [],
    });
  } catch (error) {
    console.error('Error fetching schedules:', error);
    return NextResponse.json(
      { error: 'Failed to fetch schedules' },
      { status: 500 }
    );
  }
}
