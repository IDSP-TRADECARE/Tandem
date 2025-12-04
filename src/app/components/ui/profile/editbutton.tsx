'use client';
import React from 'react';

interface EditButtonProps {
  onClick?: () => void;
  size?: number;
}

export function EditButton({ onClick, size = 40 }: EditButtonProps) {
  return (
    <button
      onClick={onClick}
      className="rounded-full flex items-center justify-center transition-opacity hover:opacity-80 cursor-pointer"
      style={{
        width: `${size}px`,
        height: `${size}px`,
        backgroundColor: '#3373CC',
        border: 'none',
      }}
    >
      <img
        src="/profile/ComponentIcon/Edit.svg"
        alt="Edit"
        width={size * 0.7}
        height={size * 0.7}
        style={{
          filter: 'brightness(0) invert(1)', // Makes the icon white
        }}
      />
    </button>
  );
}

