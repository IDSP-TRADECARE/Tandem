'use client';

import { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import { ChatHeader } from '@/app/components/chat/ChatHeader';
import { ChatMessages } from '@/app/components/chat/ChatMessages';
import { ChatInput } from '@/app/components/chat/ChatInput';
import { useChat } from '@/app/components/chat/useChat';

export default function DirectMessagePage({ params }: { params: Promise<{ roomId: string }> }) {
  const { user } = useUser();
  const [roomId, setRoomId] = useState<string | null>(null);
  const [otherUserName, setOtherUserName] = useState('User');

  useEffect(() => {
    params.then(({ roomId }) => setRoomId(roomId));
  }, [params]);

  useEffect(() => {
    if (!roomId || !user?.id) return;

    // Extract other user ID from room ID (format: userId1_userId2)
    const [id1, id2] = roomId.split('_');
    const otherUserId = id1 === user.id ? id2 : id1;

    const fetchOtherUser = async () => {
      try {
        const response = await fetch(`/api/users/${otherUserId}`);
        if (response.ok) {
          const data = await response.json();
          setOtherUserName(data.name || 'User');
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
    roomId: roomId || '',
    userId,
    userName,
    isDirectMessage: true,
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