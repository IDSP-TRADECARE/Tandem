import React from 'react';

export function GradientBackgroundFull({ children }: { children?: React.ReactNode }) {
  return (
    <div 
      className="min-h-screen"
      style={{
        background: 'linear-gradient(135deg, #3373CC 0%, #6DB6AE 46%, #9DEE95 100%)',
        backgroundSize: '100%'
      }}
    >
      {children}
    </div>
  );
}