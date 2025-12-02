/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { db } from '@/db/index';
import { directMessages } from '@/db/schema';
import { sql } from 'drizzle-orm';

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

export async function GET(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const allShares = await db.query.nannyShares.findMany({
      orderBy: (shares, { desc }) => [desc(shares.createdAt)]
    });

    const userShares = allShares.filter(share => {
      const members = (share.members || []) as ShareMember[];
      return share.creatorId === userId || 
             members.some((m: ShareMember) => m.userId === userId);
    });

    const userDirectMessages = await db.query.directMessages.findMany({
      where: sql`${directMessages.roomId} LIKE ${`%${userId}%`}`,
      orderBy: (messages, { desc }) => [desc(messages.timestamp)],
    });

    const uniqueRoomIds = [...new Set(userDirectMessages.map(dm => dm.roomId))];

    const dmConversations = await Promise.all(
      uniqueRoomIds.map(async (roomId) => {
        const lastMsg = await db.query.directMessages.findFirst({
          where: sql`${directMessages.roomId} = ${roomId}`,
          orderBy: (messages, { desc }) => [desc(messages.timestamp)],
        });

        // Extract other user ID using regex pattern
        // Format: user_XXXXX_user_YYYYY or userId1_userId2
        const userPattern = /user_[A-Za-z0-9]+/g;
        const matches = roomId.match(userPattern);
        
        let otherUserId: string | undefined;
        
        if (matches && matches.length === 2) {
          // Clerk format: user_XXX_user_YYY
          otherUserId = matches.find(id => id !== userId);
        } else {
          // Simple format: userId1_userId2
          const parts = roomId.split('_');
          otherUserId = parts.find(id => id !== userId);
        }

        let otherUserName = 'User';
        let otherUserAvatar = null;
        
        if (otherUserId) {
          try {
            const response = await fetch(
              `${process.env.NEXT_PUBLIC_APP_URL}/api/users/${otherUserId}`
            );
            if (response.ok) {
              const userData = await response.json();
              otherUserName = `${userData.firstName || ''} ${userData.lastName || ''}`.trim() || userData.email || 'User';
              otherUserAvatar = userData.profilePicture || null;
            }
          } catch (error) {
            console.error('Failed to fetch user:', otherUserId, error);
          }
        }

        return {
          id: roomId,
          type: 'direct' as const,
          name: otherUserName,
          avatar: otherUserAvatar,
          lastMessage: lastMsg?.content || '',
          timestamp: lastMsg?.timestamp || new Date().toISOString(),
          unreadCount: 0,
        };
      })
    );

    const groupConversations = userShares.map(share => {
      const messages = (share.messages || []) as ShareMessage[];
      const sortedMessages = messages.sort((a, b) => 
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      );
      const lastMsg = sortedMessages[0];

      const dateLabel = new Date(share.date).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
      });

      return {
        id: share.id.toString(),
        type: 'group' as const,
        name: `${dateLabel}, ${share.startTime}`,
        avatar: null,
        lastMessage: lastMsg?.content || 'No messages yet',
        timestamp: lastMsg?.timestamp || share.createdAt || new Date().toISOString(),
        unreadCount: 0,
      };
    });

    const allConversations = [...groupConversations, ...dmConversations].sort(
      (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );

    return NextResponse.json({ conversations: allConversations });
  } catch (error) {
    console.error('Error fetching conversations:', error);
    return NextResponse.json(
      { error: 'Failed to fetch conversations' },
      { status: 500 }
    );
  }
}