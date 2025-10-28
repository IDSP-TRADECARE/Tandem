import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { db } from '@/db';
import { nannyShares } from '@/db/schema';
import { eq } from 'drizzle-orm';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const shareId = parseInt(id, 10);
    if (isNaN(shareId)) {
      return NextResponse.json({ error: 'Invalid share ID' }, { status: 400 });
    }

    const body = await request.json();
    const { userName, kidsCount } = body;
    if (!userName || !kidsCount) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
    }

    const [share] = await db
      .select()
      .from(nannyShares)
      .where(eq(nannyShares.id, shareId))
      .limit(1);

    if (!share) {
      return NextResponse.json({ error: 'Share not found' }, { status: 404 });
    }

    type Member = {
      userId: string;
      name: string;
      kidsCount: number;
      joinedAt: string;
    };

    const members: Member[] = share.members || [];
    if (members.some((m: Member) => m.userId === userId)) {
      return NextResponse.json({ error: 'You already joined' }, { status: 400 });
    }

    // Check max spots
    if (share.maxSpots && members.length >= share.maxSpots) {
      return NextResponse.json({ error: 'No spots available' }, { status: 400 });
    }

    const newMember = {
      userId,
      name: userName,
      kidsCount: Number(kidsCount),
      joinedAt: new Date().toISOString(),
    };

    const updatedMembers = [...members, newMember];

    const [updatedShare] = await db
      .update(nannyShares)
      .set({ members: updatedMembers })
      .where(eq(nannyShares.id, shareId))
      .returning();

    return NextResponse.json({ success: true, share: updatedShare });
  } catch (error) {
    console.error('Error joining share:', error);
    return NextResponse.json({ error: 'Failed to join share' }, { status: 500 });
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