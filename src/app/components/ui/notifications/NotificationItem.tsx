'use client';

import { ReactNode } from 'react';

interface NotificationItemProps {
  icon: ReactNode;
  message: string | ReactNode;
  time: string;
  onClick?: () => void;
}

export function NotificationItem({ icon, message, time, onClick }: NotificationItemProps) {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center gap-5 py-4 px-4 hover:bg-gray-50 transition-colors text-left border-b border-gray-200 last:border-0"
    >
      {/* Icon */}
      <div className="flex-shrink-0 w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white">
        {icon}
      </div>

      {/* Message */}
      <div className="flex-1 min-w-0">
        <p className="text-gray-900 text-base leading-relaxed">
          {message}
        </p>
      </div>

      {/* Time */}
      <div className="flex-shrink-0 text-gray-500 text-sm">
        {time}
      </div>
    </button>
  );
}