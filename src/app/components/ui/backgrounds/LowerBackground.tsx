import React from 'react';

export type HalfBackgroundProps = {
  children?: React.ReactNode;
  startFrom?: string;
  borderRadius?: string;
};

export function LowerBackground({ 
  children, 
  startFrom = '50vh', 
  borderRadius = '35px' 
}: HalfBackgroundProps) {
  return (
    <div
      className="fixed inset-x-0 bg-[#F5F5F5]"
      style={{
        top: startFrom,           // Start from halfway down (or custom value)
        bottom: 0,                // Go all the way to the bottom
        borderTopLeftRadius: borderRadius,
        borderTopRightRadius: borderRadius,
      }}
    >
      {children}
    </div>
  );
}