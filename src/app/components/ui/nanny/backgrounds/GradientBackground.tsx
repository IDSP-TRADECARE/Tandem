import React from 'react';

export function GradientBackground({ children }: { children?: React.ReactNode }) {
  return (
    <div 
      className="min-h-screen"
      style={{
        background: 'linear-gradient(135deg, #3373CC 0%, #6DB6AE 46%, #9DEE95 100%)',
        backgroundSize: '100% 33.33%',
        backgroundRepeat: 'repeat-y',
      }}
    >
      {children}
    </div>
  );
}