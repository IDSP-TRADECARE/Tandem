import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { nannyShares } from '@/db/schema';
import { eq } from 'drizzle-orm';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params; // Await params first
    const shareId = parseInt(id);

    if (isNaN(shareId)) {
      return NextResponse.json(
        { error: 'Invalid share ID' },
        { status: 400 }
      );
    }

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

    return NextResponse.json({ share });
  } catch (error) {
    console.error('Error fetching nanny share:', error);
    return NextResponse.json(
      { error: 'Failed to fetch nanny share' },
      { status: 500 }
    );
  }
}