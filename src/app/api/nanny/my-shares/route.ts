import { NextResponse } from 'next/server';
import { db } from '@/db';
import { nannyShares } from '@/db/schema';
import { getCurrentUser } from '@/lib/auth/getCurrentUser';

export async function GET() {
  try {
    const user = await getCurrentUser();

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
      return s.creatorId === user.userId || members.some((m) => m.userId === user.userId);
    });

    return NextResponse.json({ shares: myShares, total: myShares.length });
  } catch (error) {
    console.error('Error fetching my shares:', error);
    return NextResponse.json({ error: 'Failed to fetch your shares' }, { status: 500 });
  }
}