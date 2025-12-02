'use client';

import { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import { ChatHeader } from '@/app/components/chat/ChatHeader';
import { ChatMessages } from '@/app/components/chat/ChatMessages';
import { ChatInput } from '@/app/components/chat/ChatInput';
import { useChat } from '@/app/components/chat/useChat';

export default function GroupChatPage({ params }: { params: Promise<{ id: string }> }) {
  const { user } = useUser();
  const [shareId, setShareId] = useState<string | null>(null);
  const [chatTitle, setChatTitle] = useState('Group Chat');

  useEffect(() => {
    params.then(({ id }) => setShareId(id));
  }, [params]);

  useEffect(() => {
    if (!shareId) return;

    const fetchShareDetails = async () => {
      try {
        const response = await fetch(`/api/nanny/${shareId}`);
        if (response.ok) {
          const data = await response.json();
          const share = data.share;
          const dateLabel = new Date(share.date).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
          });
          setChatTitle(`${dateLabel}, ${share.startTime}`);
        }
      } catch (error) {
        console.error('Failed to fetch share:', error);
      }
    };

    fetchShareDetails();
  }, [shareId]);

  const userId = user?.id || '';
  const userName = `${user?.firstName || ''} ${user?.lastName || ''}`.trim() || 'User';

  const { messages, isSending, sendMessage } = useChat({
    roomId: shareId || '',
    userId,
    userName,
    isDirectMessage: false,
  });

  if (!shareId) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <ChatHeader title={chatTitle} subtitle="Group Chat" />
      <ChatMessages 
        messages={messages} 
        currentUserId={userId}
        emptyMessage="No messages yet. Start the conversation!" 
      />
      <ChatInput onSend={sendMessage} isSending={isSending} />
    </div>
  );
}