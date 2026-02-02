import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { nannyShares } from '@/db/schema';
import { getCurrentUser } from '@/lib/auth/getCurrentUser';

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();

    const body = await request.json();
    const creatorName = body.creatorName ?? 'Anonymous';

    const initialMembers = [
      {
        userId: user.userId,
        name: creatorName,
        kidsCount: body.kidsCount ?? 1,
        joinedAt: new Date().toISOString(),
      },
    ];

    const [newShare] = await db
      .insert(nannyShares)
      .values({
        creatorId: user.userId,
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