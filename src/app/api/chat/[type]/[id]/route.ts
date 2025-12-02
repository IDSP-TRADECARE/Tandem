/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server'; // ✅ Changed from getAuth
import { db } from '@/db/index';
import { nannyShares, directMessages } from '@/db/schema';
import { eq } from 'drizzle-orm';

type ShareMember = {
  userId: string;
  name: string;
  kidsCount: number;
  joinedAt: string;
};

type ShareMessage = {
  id: string;
  senderId: string;
  senderName: string;
  content: string;
  timestamp: string;
};

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ type: string; id: string }> }
) {
  try {
    const { userId } = await auth(); // ✅ Changed
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { type, id } = await params;

    if (type === 'group') {
      const shareId = parseInt(id);
      
      const share = await db.query.nannyShares.findFirst({
        where: eq(nannyShares.id, shareId),
      });

      if (!share) {
        return NextResponse.json({ error: 'Share not found' }, { status: 404 });
      }

      const members = (share.members || []) as ShareMember[];
      const isMember = members.some((m: ShareMember) => m.userId === userId);
      const isCreator = share.creatorId === userId;

      if (!isMember && !isCreator) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
      }

      const messages = (share.messages || []) as ShareMessage[];
      const sortedMessages = messages.sort((a, b) => 
        new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
      );

      return NextResponse.json({ messages: sortedMessages });

    } else if (type === 'direct') {
      const roomId = id;
      
      // Verify user is part of this DM - check if userId is in the roomId
      if (!roomId.includes(userId)) {
        console.log('Unauthorized DM access:', { userId, roomId });
        return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
      }

      const messages = await db.query.directMessages.findMany({
        where: eq(directMessages.roomId, roomId),
        orderBy: (messages, { asc }) => [asc(messages.timestamp)],
      });

      return NextResponse.json({ messages });

    } else {
      return NextResponse.json({ error: 'Invalid chat type' }, { status: 400 });
    }
  } catch (error) {
    console.error('Error fetching messages:', error);
    return NextResponse.json(
      { error: 'Failed to fetch messages' },
      { status: 500 }
    );
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ type: string; id: string }> }
) {
  try {
    const { userId } = await auth(); // ✅ Changed
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { type, id } = await params;
    const body = await req.json();
    const { senderId, senderName, content } = body;

    if (!content?.trim()) {
      return NextResponse.json(
        { error: 'Message content is required' },
        { status: 400 }
      );
    }

    if (type === 'group') {
      const shareId = parseInt(id);
      
      const share = await db.query.nannyShares.findFirst({
        where: eq(nannyShares.id, shareId),
      });

      if (!share) {
        return NextResponse.json({ error: 'Share not found' }, { status: 404 });
      }

      const members = (share.members || []) as ShareMember[];
      const isMember = members.some((m: ShareMember) => m.userId === userId);
      const isCreator = share.creatorId === userId;

      if (!isMember && !isCreator) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
      }

      const newMessage: ShareMessage = {
        id: `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        senderId,
        senderName,
        content: content.trim(),
        timestamp: new Date().toISOString(),
      };

      const existingMessages = (share.messages || []) as ShareMessage[];
      const updatedMessages = [...existingMessages, newMessage];

      await db.update(nannyShares)
        .set({ messages: updatedMessages as any })
        .where(eq(nannyShares.id, shareId));

      return NextResponse.json({ message: newMessage }, { status: 201 });

    } else if (type === 'direct') {
      const roomId = id;
      
      // Verify user is part of this DM
      if (!roomId.includes(userId)) {
        console.log('Unauthorized DM send:', { userId, roomId });
        return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
      }

      const [message] = await db.insert(directMessages).values({
        roomId,
        senderId,
        senderName,
        content: content.trim(),
        timestamp: new Date().toISOString(),
      }).returning();

      return NextResponse.json({ message }, { status: 201 });

    } else {
      return NextResponse.json({ error: 'Invalid chat type' }, { status: 400 });
    }
  } catch (error) {
    console.error('Error creating message:', error);
    return NextResponse.json(
      { error: 'Failed to send message' },
      { status: 500 }
    );
  }
}