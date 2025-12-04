'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@clerk/nextjs';
import { useSocket } from '@/lib/socket/SocketContext';
import type { NannyShare } from '@/db/schema';

interface Message {
  id: string;
  senderId: string;
  senderName: string;
  content: string;
  timestamp: string;
}

export default function ChatPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { user } = useUser();
  const { socket, isConnected } = useSocket();
  const [shareId, setShareId] = useState<string | null>(null);
  const [share, setShare] = useState<NannyShare | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Get user info from Clerk
  const userId = user?.id || '';
  const userName = user?.firstName || user?.username || 'Anonymous';

  // Unwrap params
  useEffect(() => {
    params.then(({ id }) => setShareId(id));
  }, [params]);

  // Fetch chat data
  useEffect(() => {
    if (!shareId || !userId) return;

    async function fetchChat() {
      try {
        const response = await fetch(`/api/nanny/${shareId}/chat`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch chat');
        }

        const data = await response.json();
        setMessages(data.messages || []);
        setShare(data.share);
      } catch (error) {
        console.error('Error fetching chat:', error);
        alert('Failed to load chat');
        router.back();
      } finally {
        setIsLoading(false);
      }
    }

    fetchChat();
  }, [shareId, userId, router]);

  // Socket.IO real-time message updates
  useEffect(() => {
    if (!socket || !isConnected || !shareId) return;

    socket.emit('join-share', shareId);

    socket.on('message-received', (message: Message) => {
      setMessages(prev => [...prev, message]);
    });

    return () => {
      socket.emit('leave-share', shareId);
      socket.off('message-received');
    };
  }, [socket, isConnected, shareId]);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newMessage.trim() || !shareId || !userName || !userId) return;

    setIsSending(true);

    try {
      const response = await fetch(`/api/nanny/${shareId}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          senderId: userId,
          senderName: userName,
          content: newMessage.trim(),
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to send message');
      }

      const data = await response.json();

      // Emit socket event
      if (socket) {
        socket.emit('message-sent', {
          shareId,
          message: data.message,
        });
      }

      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
      alert('Failed to send message');
    } finally {
      setIsSending(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-linear-to-br from-blue-50 via-white to-green-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#1e3a5f] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading chat...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 via-white to-green-50 flex flex-col">
      {/* Header */}
      <div className="bg-white shadow-sm border-b sticky top-0 z-10">
        <div className="px-6 py-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.back()}
              className="text-[#1e3a5f] hover:text-[#152d47]"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <div className="flex-1">
              <h1 className="text-lg font-bold text-gray-900">Group Chat</h1>
              {share && (
                <p className="text-sm text-gray-600">
                  {share.members.length} {share.members.length === 1 ? 'member' : 'members'}
                  {isConnected && <span className="ml-2 text-green-600">● Live</span>}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
        {messages.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">💬</div>
            <p className="text-gray-600">No messages yet. Start the conversation!</p>
          </div>
        ) : (
          messages.map((message) => {
            const isOwn = message.senderId === userId;
            const time = new Date(message.timestamp).toLocaleTimeString('en-US', {
              hour: 'numeric',
              minute: '2-digit',
            });

            return (
              <div
                key={message.id}
                className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-xs lg:max-w-md ${isOwn ? 'order-2' : 'order-1'}`}>
                  {!isOwn && (
                    <p className="text-xs font-semibold text-gray-600 mb-1 px-1">
                      {message.senderName}
                    </p>
                  )}
                  <div
                    className={`rounded-2xl px-4 py-2 ${
                      isOwn
                        ? 'bg-[#1e3a5f] text-white rounded-br-sm'
                        : 'bg-white text-gray-900 rounded-bl-sm shadow-sm'
                    }`}
                  >
                    <p className="text-sm">{message.content}</p>
                    <p
                      className={`text-xs mt-1 ${
                        isOwn ? 'text-blue-200' : 'text-gray-500'
                      }`}
                    >
                      {time}
                    </p>
                  </div>
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <div className="bg-white border-t px-6 py-4 sticky bottom-0">
        <form onSubmit={handleSendMessage} className="flex gap-3">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-full focus:border-[#1e3a5f] focus:outline-none"
            disabled={isSending}
          />
          <button
            type="submit"
            disabled={!newMessage.trim() || isSending}
            className="px-6 py-3 bg-[#1e3a5f] text-white rounded-full font-semibold hover:bg-[#152d47] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSending ? '...' : 'Send'}
          </button>
        </form>
      </div>
    </div>
  );
}