import React from 'react';

export type HalfBackgroundProps = {
  children?: React.ReactNode;
  divHeight?: number;
  topPosition?: string;
};

export function HalfBackground({ children, divHeight, topPosition }: HalfBackgroundProps) {
  return (
    <div 
      className="fixed left-0 right-0 bg-[#F5F5F5]"
      style={{
        top: topPosition || '140px',
        bottom: 0,
        height: divHeight != null ? `${divHeight}%` : 'auto',
        borderTopLeftRadius: '35px',
        borderTopRightRadius: '35px',
      }}
    >
      {children}
    </div>
  );
}