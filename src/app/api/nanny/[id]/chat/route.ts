import { auth } from '@clerk/nextjs/server';
import { db } from '@/db';
import { nannyShares } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const shareId = parseInt(id);

    if (isNaN(shareId)) {
      return NextResponse.json({ error: 'Invalid share ID' }, { status: 400 });
    }

    const [share] = await db
      .select()
      .from(nannyShares)
      .where(eq(nannyShares.id, shareId))
      .limit(1);

    if (!share) {
      return NextResponse.json({ error: 'Share not found' }, { status: 404 });
    }

    const messages = share.messages || [];

    return NextResponse.json({ messages, share });
  } catch (error) {
    console.error('Error fetching messages:', error);
    return NextResponse.json({ error: 'Failed to fetch messages' }, { status: 500 });
  }
}

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
    const shareId = parseInt(id);
    const body = await request.json();
    const { senderId, senderName, content } = body;

    if (!senderId || !senderName || !content) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    if (isNaN(shareId)) {
      return NextResponse.json({ error: 'Invalid share ID' }, { status: 400 });
    }

    const [share] = await db
      .select()
      .from(nannyShares)
      .where(eq(nannyShares.id, shareId))
      .limit(1);

    if (!share) {
      return NextResponse.json({ error: 'Share not found' }, { status: 404 });
    }

    const newMessage = {
      id: `msg_${Date.now()}`,
      senderId,
      senderName,
      content,
      timestamp: new Date().toISOString(),
    };

    const updatedMessages = [...(share.messages || []), newMessage];

    await db
      .update(nannyShares)
      .set({ messages: updatedMessages })
      .where(eq(nannyShares.id, shareId));

    return NextResponse.json({ message: newMessage, success: true });
  } catch (error) {
    console.error('Error sending message:', error);
    return NextResponse.json({ error: 'Failed to send message' }, { status: 500 });
  }
}