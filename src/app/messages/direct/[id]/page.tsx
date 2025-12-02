'use client';

import { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import { ChatHeader } from '@/app/components/chat/ChatHeader';
import { ChatMessages } from '@/app/components/chat/ChatMessages';
import { ChatInput } from '@/app/components/chat/ChatInput';
import { useChat } from '@/lib/socket/useChat';

export default function DirectMessagePage({ params }: { params: Promise<{ id: string }> }) {
  const { user } = useUser();
  const [roomId, setRoomId] = useState<string | null>(null);
  const [otherUserName, setOtherUserName] = useState('User');

  useEffect(() => {
    params.then(({ id }) => setRoomId(id));
  }, [params]);

  useEffect(() => {
    if (!roomId || !user?.id) return;

    // Extract other user ID from room ID
    // Room ID format: user_XXX_user_YYY
    // We need to find which user ID is NOT the current user's ID
    
    const parts = roomId.split('_');
    let otherUserId: string | undefined;

    // Reconstruct user IDs from parts
    // Format: user_XXXXX_user_YYYYY where XXXXX and YYYYY can contain underscores
    const userPattern = /user_[A-Za-z0-9]+/g;
    const matches = roomId.match(userPattern);

    if (matches && matches.length === 2) {
      // We have two complete user IDs
      otherUserId = matches.find(id => id !== user.id);
    }

    if (!otherUserId) {
      console.error('Could not extract other user ID from room:', roomId);
      console.log('Room parts:', parts);
      console.log('Current user ID:', user.id);
      return;
    }

    const fetchOtherUser = async () => {
      try {
        const response = await fetch(`/api/users/${otherUserId}`);
        if (response.ok) {
          const data = await response.json();
          setOtherUserName(`${data.firstName || ''} ${data.lastName || ''}`.trim() || data.email || 'User');
        }
      } catch (error) {
        console.error('Failed to fetch user:', error);
      }
    };

    fetchOtherUser();
  }, [roomId, user?.id]);

  const userId = user?.id || '';
  const userName = `${user?.firstName || ''} ${user?.lastName || ''}`.trim() || 'User';

  const { messages, isSending, sendMessage } = useChat({
    chatType: 'direct',
    chatId: roomId || '',
    userId,
    userName,
  });

  if (!roomId) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <ChatHeader title={otherUserName} subtitle="Direct Message" />
      <ChatMessages 
        messages={messages} 
        currentUserId={userId}
        emptyMessage="No messages yet. Say hi!" 
      />
      <ChatInput onSend={sendMessage} isSending={isSending} />
    </div>
  );
}