import { useState, useEffect, useCallback } from 'react';
import { useSocket } from './SocketContext';

type Message = {
  id: string;
  senderId: string;
  senderName: string;
  content: string;
  timestamp: string;
};

type UseChatOptions = {
  chatType: 'group' | 'direct';
  chatId: string;
  userId: string;
  userName: string;
};

export function useChat({ chatType, chatId, userId, userName }: UseChatOptions) {
  const { socket } = useSocket() ?? { socket: null };
  const [messages, setMessages] = useState<Message[]>([]);
  const [isSending, setIsSending] = useState(false);

  // Join room
  useEffect(() => {
    if (!socket || !chatId) return;

    if (chatType === 'direct') {
      // For direct messages, use join-dm with just the roomId
      socket.emit('join-dm', chatId);
      console.log('Joined DM room:', chatId);
    } else {
      // For group chats, use join-share with shareId
      socket.emit('join-share', chatId);
      console.log('Joined share room:', chatId);
    }

    return () => {
      if (chatType === 'direct') {
        socket.emit('leave-dm', chatId);
        console.log('Left DM room:', chatId);
      } else {
        socket.emit('leave-share', chatId);
        console.log('Left share room:', chatId);
      }
    };
  }, [socket, chatId, chatType]);

  // Listen for messages
  useEffect(() => {
    if (!socket) return;

    const onMessageReceived = (message: Message) => {
      setMessages((prev) => {
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
    if (!chatId) return;
    
    try {
      const response = await fetch(`/api/chat/${chatType}/${chatId}`);
      if (response.ok) {
        const data = await response.json();
        setMessages(data.messages || []);
      }
    } catch (error) {
      console.error('Failed to fetch messages:', error);
    }
  }, [chatType, chatId]);

  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);

  // Send message
  const sendMessage = useCallback(async (content: string) => {
    if (!socket || !chatId || !content.trim()) return;

    setIsSending(true);

    try {
      const response = await fetch(`/api/chat/${chatType}/${chatId}`, {
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

      // Emit socket event with proper room format
      const roomId = chatType === 'direct' ? `dm-${chatId}` : `share-${chatId}`;
      socket.emit('message-sent', {
        roomId,
        message: data.message,
      });
    } catch (error) {
      console.error('Failed to send message:', error);
      alert('Failed to send message');
    } finally {
      setIsSending(false);
    }
  }, [socket, chatType, chatId, userId, userName]);

  return {
    messages,
    isSending,
    sendMessage,
  };
}