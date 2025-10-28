import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { nannyShares } from '@/db/schema';
import { eq } from 'drizzle-orm';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const shareId = parseInt(id);
    const body = await request.json();
    const { userName, kidsCount } = body;

    if (!userName || !kidsCount) {
      return NextResponse.json(
        { error: 'Missing required fields: userName, kidsCount' },
        { status: 400 }
      );
    }

    if (isNaN(shareId)) {
      return NextResponse.json(
        { error: 'Invalid share ID' },
        { status: 400 }
      );
    }

    // Fetch the share
    const [share] = await db
      .select()
      .from(nannyShares)
      .where(eq(nannyShares.id, shareId))
      .limit(1);

    if (!share) {
      return NextResponse.json(
        { error: 'Share not found' },
        { status: 404 }
      );
    }

    // Check if spots available
    if (share.maxSpots && share.members.length >= share.maxSpots) {
      return NextResponse.json(
        { error: 'No spots available' },
        { status: 400 }
      );
    }

    // Check if user already joined
    const alreadyJoined = share.members.some(
      (member) => member.name.toLowerCase() === userName.toLowerCase()
    );

    if (alreadyJoined) {
      return NextResponse.json(
        { error: 'You have already joined this share' },
        { status: 400 }
      );
    }

    // Add new member
    const newMember = {
      userId: `user_${Date.now()}`,
      name: userName,
      kidsCount: parseInt(kidsCount),
      joinedAt: new Date().toISOString(),
    };

    const updatedMembers = [...share.members, newMember];

    // Update the share
    const [updatedShare] = await db
      .update(nannyShares)
      .set({ members: updatedMembers })
      .where(eq(nannyShares.id, shareId))
      .returning();

    return NextResponse.json({
      success: true,
      share: updatedShare,
      message: 'Successfully joined the share!',
    });

  } catch (error) {
    console.error('Error joining share:', error);
    return NextResponse.json(
      { error: 'Failed to join share' },
      { status: 500 }
    );
  }
}

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