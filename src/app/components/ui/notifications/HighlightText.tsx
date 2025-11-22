'use client';

interface HighlightTextProps {
  children: React.ReactNode;
}

export function HighlightText({ children }: HighlightTextProps) {
  return <span className="text-success font-semibold">{children}</span>;
}