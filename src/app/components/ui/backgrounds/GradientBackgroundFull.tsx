import React from 'react';

export function GradientBackgroundFull({ children }: { children?: React.ReactNode }) {
  return (
    <div 
      className="fixed inset-0"
      style={{
        background: 'linear-gradient(125deg, #3373CC 0%, #6DB6AE 40%, #9DEE95 80%)',
        backgroundSize: '100%'
      }}
    >
      {children}
    </div>
  );
}