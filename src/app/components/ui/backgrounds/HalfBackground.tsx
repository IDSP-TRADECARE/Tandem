import React from 'react';

export function HalfBackground({ children }: { children?: React.ReactNode }) {
  return (
    <div 
      className="fixed bottom-0 left-0 right-0 bg-[#F5F5F5]"
      style={{
        height: '75%',
        borderTopLeftRadius: '35px',
        borderTopRightRadius: '35px',
      }}
    >
      {children}
    </div>
  );
}