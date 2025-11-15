import React from 'react';

export type HalfBackgroundProps = {
  children?: React.ReactNode;
  divHeight?: number;
};

export function HalfBackground({ children, divHeight }: HalfBackgroundProps) {
  return (
    <div 
      className="fixed bottom-0 left-0 right-0 bg-[#F5F5F5]"
      style={{
        height: divHeight != null ? `${divHeight}%` : '75%',
        borderTopLeftRadius: '35px',
        borderTopRightRadius: '35px',
      }}
    >
      {children}
    </div>
  );
}