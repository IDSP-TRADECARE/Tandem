import React from 'react';

export type HalfBackgroundProps = {
  children?: React.ReactNode;
  divHeight?: number;
  topPosition?: string;
  background?: string;
};

export function HalfBackground({ children, divHeight, topPosition, background }: HalfBackgroundProps) {
  return (
    <div 
      className="fixed left-0 right-0"
      style={{
        background: background || '#F5F5F5',
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