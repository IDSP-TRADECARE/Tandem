import React from 'react';

export type HalfBackgroundProps = {
  children?: React.ReactNode;
  startFrom?: string;
  borderRadius?: string;
};

export function SmallBackground({ 
  children, 
  startFrom = '70vh', 
  borderRadius = '35px' 
}: HalfBackgroundProps) {
  return (
    <div
      className="fixed inset-x-0 bg-[#F5F5F5]"
      style={{
        top: startFrom,          
        bottom: 0,                
        borderTopLeftRadius: borderRadius,
        borderTopRightRadius: borderRadius,
      }}
    >
      {children}
    </div>
  );
}