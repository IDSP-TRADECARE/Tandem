import React from 'react';
import { cn } from '@/lib/utils';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline';
  children: React.ReactNode;
}

export function Button({
  variant = 'primary',
  className,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        'px-8 py-3 rounded-lg font-semibold transition',
        {
          'bg-gray-500 text-white hover:bg-gray-400': variant === 'primary',
          'bg-gray-300 text-gray-700 hover:bg-gray-400': variant === 'secondary',
          'bg-white border-2 border-gray-300 text-gray-700 hover:bg-gray-50':
            variant === 'outline',
        },
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}