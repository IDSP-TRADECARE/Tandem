import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { nannyShares } from '@/db/schema';
import { eq } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const date = searchParams.get('date');

    if (!date) {
      return NextResponse.json(
        { error: 'Date parameter is required' },
        { status: 400 }
      );
    }

    // Fetch all shares for the given date
    const allShares = await db
      .select()
      .from(nannyShares)
      .where(eq(nannyShares.date, date))
      .orderBy(nannyShares.startTime);

    // Filter shares that have available spots or no limit
    const availableShares = allShares.filter(share => {
      if (!share.maxSpots) return true; // No limit
      return share.members.length < share.maxSpots;
    });

    return NextResponse.json({ 
      shares: availableShares,
      total: availableShares.length 
    });

  } catch (error) {
    console.error('Error fetching available shares:', error);
    return NextResponse.json(
      { error: 'Failed to fetch available shares' },
      { status: 500 }
    );
  }
}