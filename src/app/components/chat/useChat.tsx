import { useState, useEffect, useCallback } from 'react';
import { useSocket } from '@/lib/socket/SocketContext';

type Message = {
  id: string;
  senderId: string;
  senderName: string;
  content: string;
  timestamp: string;
};

type UseChatOptions = {
  roomId: string;
  userId: string;
  userName: string;
  isDirectMessage?: boolean;
};

export function useChat({ roomId, userId, userName, isDirectMessage = false }: UseChatOptions) {
  const { socket } = useSocket() ?? { socket: null };
  const [messages, setMessages] = useState<Message[]>([]);
  const [isSending, setIsSending] = useState(false);

  // Join room
  useEffect(() => {
    if (!socket || !roomId) return;

    const actualRoomId = isDirectMessage ? `dm-${roomId}` : `share-${roomId}`;
    
    socket.emit('join-share', actualRoomId);
    console.log('Joined room:', actualRoomId);

    return () => {
      socket.emit('leave-share', actualRoomId);
      console.log('Left room:', actualRoomId);
    };
  }, [socket, roomId, isDirectMessage]);

  // Listen for messages
  useEffect(() => {
    if (!socket) return;

    const onMessageReceived = (message: Message) => {
      setMessages((prev) => {
        // Prevent duplicates
        if (prev.find((m) => m.id === message.id)) return prev;
        return [...prev, message];
      });
    };

    socket.on('message-received', onMessageReceived);

    return () => {
      socket.off('message-received', onMessageReceived);
    };
  }, [socket]);

  // Fetch initial messages
  const fetchMessages = useCallback(async () => {
    try {
      const endpoint = isDirectMessage
        ? `/api/chat/${roomId}`
        : `/api/nanny/${roomId}/chat`;
      
      const response = await fetch(endpoint);
      if (response.ok) {
        const data = await response.json();
        setMessages(data.messages || []);
      }
    } catch (error) {
      console.error('Failed to fetch messages:', error);
    }
  }, [roomId, isDirectMessage]);

  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);

  // Send message
  const sendMessage = useCallback(async (content: string) => {
    if (!socket || !roomId || !content.trim()) return;

    setIsSending(true);

    const message: Message = {
      id: `${Date.now()}_${Math.floor(Math.random() * 10000)}`,
      senderId: userId,
      senderName: userName,
      content: content.trim(),
      timestamp: new Date().toISOString(),
    };

    try {
      const endpoint = isDirectMessage
        ? `/api/chat/${roomId}`
        : `/api/nanny/${roomId}/chat`;

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          senderId: userId,
          senderName: userName,
          content: content.trim(),
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to send message');
      }

      const data = await response.json();

      // Emit socket event
      const actualRoomId = isDirectMessage ? `dm-${roomId}` : roomId;
      socket.emit('message-sent', {
        shareId: actualRoomId,
        message: data.message || message,
      });
    } catch (error) {
      console.error('Failed to send message:', error);
      alert('Failed to send message');
    } finally {
      setIsSending(false);
    }
  }, [socket, roomId, userId, userName, isDirectMessage]);

  return {
    messages,
    isSending,
    sendMessage,
  };
}