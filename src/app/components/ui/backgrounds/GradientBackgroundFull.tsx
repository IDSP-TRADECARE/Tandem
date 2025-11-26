import React from 'react';

export type GradientBackgroundFullProps = {
  children?: React.ReactNode;
  background?: string;
};

export function GradientBackgroundFull({ children, background }: GradientBackgroundFullProps) {
  return (
    <div 
      className="min-h-screen"
      style={{
        background: background || 'linear-gradient(125deg, #3373CC 0%, #6DB6AE 40%, #9DEE95 80%)',
        backgroundSize: '100%'
      }}
    >
      {children}
    </div>
  );
}