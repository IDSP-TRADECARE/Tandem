import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { db } from '@/db';
import { nannyShares } from '@/db/schema';

export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const allShares = await db
      .select()
      .from(nannyShares)
      .orderBy(nannyShares.createdAt);

    interface NannyShare {
      creatorId: string;
      members?: { userId: string }[];
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      [key: string]: any; // Adjust this based on the actual structure of nannyShares
    }

    const myShares = allShares.filter((s: NannyShare) => {
      const members = s.members || [];
      return s.creatorId === userId || members.some((m) => m.userId === userId);
    });

    return NextResponse.json({ shares: myShares, total: myShares.length });
  } catch (error) {
    console.error('Error fetching my shares:', error);
    return NextResponse.json({ error: 'Failed to fetch your shares' }, { status: 500 });
  }
}