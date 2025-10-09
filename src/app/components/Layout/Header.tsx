import React from 'react';

interface HeaderProps {
  title: string;
}

export function Header({ title }: HeaderProps) {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-white">{title}</h1>
    </div>
  );
}