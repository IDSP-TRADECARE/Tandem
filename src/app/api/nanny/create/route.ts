import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { db } from '@/db';
import { nannyShares } from '@/db/schema';

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const creatorName = body.creatorName ?? 'Anonymous';

    const initialMembers = [
      {
        userId,
        name: creatorName,
        kidsCount: body.kidsCount ?? 1,
        joinedAt: new Date().toISOString(),
      },
    ];

    const [newShare] = await db
      .insert(nannyShares)
      .values({
        creatorId: userId,
        date: body.date ?? '',
        location: body.location ?? '',
        startTime: body.startTime ?? '',
        endTime: body.endTime ?? '',
        price: body.price ?? null,
        certificates: body.certificates ?? [],
        maxSpots: body.maxSpots ?? null,
        members: initialMembers,
        messages: [],
      })
      .returning();

    return NextResponse.json({ success: true, share: newShare }, { status: 201 });
  } catch (error) {
    console.error('Error creating share:', error);
    return NextResponse.json({ error: 'Failed to create share' }, { status: 500 });
  }
}