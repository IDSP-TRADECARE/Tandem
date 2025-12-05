'use client';
import { useState, useEffect } from 'react';

interface ToggleButtonProps {
  defaultChecked?: boolean; 
  onChange?: () => void; 
}

export function ToggleButton({ defaultChecked = false, onChange }: ToggleButtonProps) {
  const [isChecked, setIsChecked] = useState(defaultChecked);

  useEffect(() => {
    setIsChecked(defaultChecked);
  }, [defaultChecked]);

  const handleToggle = () => {
    setIsChecked(!isChecked);
    onChange?.();
  };

  return (
    <button
      onClick={handleToggle}
      style={{
        width: '60px',
        height: '32px',
        borderRadius: '16px',
        backgroundColor: isChecked ? '#6BB064' : '#3373CC',
        border: '1px solid #FFFFFF',
        padding: '2px',
        cursor: 'pointer',
        position: 'relative',
        transition: 'background-color 0.3s ease',
      }}
    >
      <div
        style={{
          width: '24px',
          height: '24px',
          borderRadius: '50%',
          backgroundColor: '#FFFFFF',
          border: '1px solid #FFFFFF',
          position: 'absolute',
          top: '3px',
          left: isChecked ? '33px' : '3px',
          transition: 'left 0.3s ease',
          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
        }}
      />
    </button>
  );
}

