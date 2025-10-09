import React from 'react';
import { cn } from '@/lib/utils';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export function Input({ label, error, className, ...props }: InputProps) {
  return (
    <div>
      {label && (
        <label className="block text-white text-sm mb-2">{label}</label>
      )}
      <input
        className={cn(
          'w-full px-4 py-3 bg-gray-600 text-white rounded-lg border focus:outline-none focus:border-gray-400',
          error ? 'border-red-500' : 'border-gray-500',
          className
        )}
        {...props}
      />
      {error && <p className="text-red-400 text-sm mt-1">{error}</p>}
    </div>
  );
}