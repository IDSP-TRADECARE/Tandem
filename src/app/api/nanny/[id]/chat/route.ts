import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { nannyShares } from '@/db/schema';
import { eq } from 'drizzle-orm';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
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

    // Return messages (from share.messages or empty array)
    const messages = share.messages || [];

    return NextResponse.json({ messages, share });
  } catch (error) {
    console.error('Error fetching messages:', error);
    return NextResponse.json(
      { error: 'Failed to fetch messages' },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const shareId = parseInt(id);
    const body = await request.json();
    const { senderId, senderName, content } = body;

    if (!senderId || !senderName || !content) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

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

    // Create new message
    const newMessage = {
      id: `msg_${Date.now()}`,
      senderId,
      senderName,
      content,
      timestamp: new Date().toISOString(),
    };

    // Update messages array
    const updatedMessages = [...(share.messages || []), newMessage];

    // Update share with new message
    await db
      .update(nannyShares)
      .set({ messages: updatedMessages })
      .where(eq(nannyShares.id, shareId));

    return NextResponse.json({ 
      message: newMessage,
      success: true 
    });

  } catch (error) {
    console.error('Error sending message:', error);
    return NextResponse.json(
      { error: 'Failed to send message' },
      { status: 500 }
    );
  }
}