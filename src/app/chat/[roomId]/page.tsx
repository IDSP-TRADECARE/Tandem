'use client';

import React, { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@clerk/nextjs';
import { useSocket } from '@/lib/socket/SocketContext';

interface Message {
  id: string;
  senderId: string;
  senderName: string;
  content: string;
  timestamp: string;
}

export default function DirectMessagePage({ params }: { params: Promise<{ roomId: string }> }) {
  const router = useRouter();
  const { user } = useUser();
  const { socket, isConnected } = useSocket();

  const [roomId, setRoomId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [text, setText] = useState('');
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const userId = user?.id ?? 'anonymous';
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const userName = (user?.firstName || (user as any)?.username || 'Anonymous') as string;

  useEffect(() => {
    params.then(({ roomId }) => setRoomId(roomId));
  }, [params]);

  // join socket room: use share-style room naming but with dm- prefix for clarity
  useEffect(() => {
    if (!socket || !isConnected || !roomId) return;
    const shareRoomId = `dm-${roomId}`;
    socket.emit('join-share', shareRoomId);

    const onMessage = (message: Message) => {
      setMessages((prev) => [...prev, message]);
    };

    socket.on('message-received', onMessage);

    return () => {
      socket.emit('leave-share', shareRoomId);
      socket.off('message-received', onMessage);
    };
  }, [socket, isConnected, roomId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!text.trim() || !roomId || !socket) return;

    setIsSending(true);
    const shareRoomId = `dm-${roomId}`;

    const message: Message = {
      id: `${Date.now()}_${Math.floor(Math.random() * 10000)}`,
      senderId: userId,
      senderName: userName,
      content: text.trim(),
      timestamp: new Date().toISOString(),
    };

    try {
      // Emit via socket - server will broadcast to the room
      socket.emit('message-sent', { shareId: shareRoomId, message });

      // Optimistic add (server will also broadcast back)
      setMessages((prev) => [...prev, message]);
      setText('');
    } catch (err) {
      console.error('Failed to send DM', err);
      alert('Failed to send message');
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 via-white to-green-50 flex flex-col">
      <div className="bg-white shadow-sm border-b sticky top-0 z-10">
        <div className="px-6 py-4 flex items-center gap-3">
          <button onClick={() => router.back()} className="text-[#1e3a5f] hover:text-[#152d47]">←</button>
          <div className="flex-1">
            <h1 className="text-lg font-bold text-gray-900">Conversation</h1>
            {roomId && <p className="text-sm text-gray-600">room: {roomId}</p>}
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
        {messages.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">💬</div>
            <p className="text-gray-600">No messages yet. Say hi!</p>
          </div>
        ) : (
          messages.map((message) => {
            const isOwn = message.senderId === userId;
            const time = new Date(message.timestamp).toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' });
            return (
              <div key={message.id} className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-xs lg:max-w-md`}>
                  {!isOwn && <p className="text-xs font-semibold text-gray-600 mb-1 px-1">{message.senderName}</p>}
                  <div className={`rounded-2xl px-4 py-2 ${isOwn ? 'bg-[#1e3a5f] text-white rounded-br-sm' : 'bg-white text-gray-900 rounded-bl-sm shadow-sm'}`}>
                    <p className="text-sm">{message.content}</p>
                    <p className={`text-xs mt-1 ${isOwn ? 'text-blue-200' : 'text-gray-500'}`}>{time}</p>
                  </div>
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="bg-white border-t px-6 py-4 sticky bottom-0">
        <form onSubmit={handleSend} className="flex gap-3">
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-full focus:border-[#1e3a5f] focus:outline-none"
            disabled={isSending}
          />
          <button type="submit" disabled={!text.trim() || isSending} className="px-6 py-3 bg-[#1e3a5f] text-white rounded-full font-semibold disabled:opacity-50">
            {isSending ? '...' : 'Send'}
          </button>
        </form>
      </div>
    </div>
  );
}