import { NextResponse } from 'next/server';
import { db } from '@/db';
import { nannyShares } from '@/db/schema';

export async function GET() {
  try {
    // Fetch all shares, no date filter
    const allShares = await db
      .select()
      .from(nannyShares)
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