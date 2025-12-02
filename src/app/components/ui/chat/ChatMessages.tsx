import { useEffect, useRef } from 'react';
import { formatDistanceToNow } from 'date-fns';

type Message = {
  id: string;
  senderId: string;
  senderName: string;
  content: string;
  timestamp: string;
};

type ChatMessagesProps = {
  messages: Message[];
  currentUserId: string;
  emptyMessage?: string;
};

export function ChatMessages({ messages, currentUserId, emptyMessage = 'No messages yet' }: ChatMessagesProps) {
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  if (messages.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="text-center">
          <div className="text-6xl mb-4">💬</div>
          <p className="text-gray-500">{emptyMessage}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
      {messages.map((msg) => {
        const isOwn = msg.senderId === currentUserId;
        const timeAgo = formatDistanceToNow(new Date(msg.timestamp), { addSuffix: true });

        return (
          <div key={msg.id} className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}>
            <div className="max-w-[75%]">
              {!isOwn && (
                <p className="text-xs font-semibold text-gray-600 mb-1 px-3">
                  {msg.senderName}
                </p>
              )}
              <div
                className={`rounded-2xl px-4 py-2 ${
                  isOwn
                    ? 'bg-[#3373CC] text-white rounded-br-sm'
                    : 'bg-white text-gray-900 rounded-bl-sm shadow-sm border border-gray-200'
                }`}
              >
                <p className="text-sm wrap-break-word">{msg.content}</p>
                <p className={`text-xs mt-1 ${isOwn ? 'text-blue-200' : 'text-gray-500'}`}>
                  {timeAgo}
                </p>
              </div>
            </div>
          </div>
        );
      })}
      <div ref={messagesEndRef} />
    </div>
  );
}