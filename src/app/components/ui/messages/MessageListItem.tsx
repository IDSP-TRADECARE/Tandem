import Image from 'next/image';
import { formatDistanceToNow } from 'date-fns';

type MessageListItemProps = {
  id: string;
  avatar?: string | null;
  name: string;
  lastMessage: string;
  timestamp: string;
  unreadCount?: number;
  isGroupChat?: boolean;
  onClick: (id: string) => void;
};

export function MessageListItem({
  id,
  avatar,
  name,
  lastMessage,
  timestamp,
  unreadCount = 0,
  isGroupChat = false,
  onClick,
}: MessageListItemProps) {
  const timeAgo = formatDistanceToNow(new Date(timestamp), { addSuffix: false });

  return (
    <button
      onClick={() => onClick(id)}
      className="w-full flex items-center gap-4 p-4 hover:bg-gray-50 transition-colors border-b border-gray-100"
    >
      <div className="relative flex-shrink-0">
        <div 
          className="w-14 h-14 rounded-full overflow-hidden flex items-center justify-center"
          style={{ background: isGroupChat ? '#A3C0E8' : '#E5E7EB' }}
        >
          {avatar ? (
            <Image
              src={avatar}
              alt={name}
              width={56}
              height={56}
              className="w-full h-full object-cover"
            />
          ) : isGroupChat ? (
            <svg className="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
            </svg>
          ) : (
            <svg className="w-7 h-7 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
            </svg>
          )}
        </div>
      </div>

      <div className="flex-1 min-w-0 text-left">
        <div className="flex items-baseline justify-between mb-1">
          <h3 className="text-lg font-semibold text-black truncate">{name}</h3>
          <span className="text-xs text-gray-500 ml-2 flex-shrink-0">{timeAgo}</span>
        </div>
        <p className="text-sm text-gray-600 truncate">{lastMessage}</p>
      </div>

      {unreadCount > 0 && (
        <div className="flex-shrink-0 w-6 h-6 rounded-full bg-[#92F189] flex items-center justify-center">
          <span className="text-xs font-semibold text-white">{unreadCount}</span>
        </div>
      )}
    </button>
  );
}