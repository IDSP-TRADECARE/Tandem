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
  chatId: string; // For group: "37", for direct: "user_XXX_user_YYY"
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
      // For direct messages, send the raw roomId (already includes user IDs)
      socket.emit('join-dm', chatId);
      console.log('✅ Joined DM room:', chatId);
    } else {
      // For group chats, send just the share ID number
      socket.emit('join-share', chatId);
      console.log('✅ Joined share room:', chatId);
    }

    return () => {
      if (chatType === 'direct') {
        socket.emit('leave-dm', chatId);
        console.log('👋 Left DM room:', chatId);
      } else {
        socket.emit('leave-share', chatId);
        console.log('👋 Left share room:', chatId);
      }
    };
  }, [socket, chatId, chatType]);

  // Listen for messages
  useEffect(() => {
    if (!socket) return;

    const onMessageReceived = (message: Message) => {
      console.log('📩 Message received:', message);
      setMessages((prev) => {
        if (prev.find((m) => m.id === message.id)) {
          console.log('⚠️ Duplicate message ignored:', message.id);
          return prev;
        }
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
      console.log(`📡 Fetching messages for ${chatType}/${chatId}`);
      const response = await fetch(`/api/chat/${chatType}/${chatId}`);
      if (response.ok) {
        const data = await response.json();
        console.log(`✅ Loaded ${data.messages?.length || 0} messages`);
        setMessages(data.messages || []);
      } else {
        console.error('❌ Failed to fetch messages:', response.status);
      }
    } catch (error) {
      console.error('❌ Failed to fetch messages:', error);
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
      console.log(`📤 Sending message to ${chatType}/${chatId}`);
      
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
      console.log('✅ Message saved to DB:', data.message.id);

      // Emit socket event with proper room format
      // Server expects: "share-37" or "dm-user_XXX_user_YYY"
      const roomId = chatType === 'direct' ? `dm-${chatId}` : `share-${chatId}`;
      
      console.log(`🔊 Emitting to room: ${roomId}`);
      socket.emit('message-sent', {
        roomId,
        message: data.message,
      });
    } catch (error) {
      console.error('❌ Failed to send message:', error);
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