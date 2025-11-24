'use client';
import React, { useState } from 'react';

export function TextBox({ 
  placeholder = "To help us improve, please describe your feedback as detailed as possible",
  value: controlledValue,
  onChange,
  className = ""
}) {
  const [internalValue, setInternalValue] = useState('');
  
  // Use controlled value if provided, otherwise use internal state
  const isControlled = controlledValue !== undefined;
  const value = isControlled ? controlledValue : internalValue;
  
  const handleChange = (e) => {
    if (onChange) {
      onChange(e);
    } else {
      setInternalValue(e.target.value);
    }
  };

  return (
    <div className={`w-full ${className}`}>
      <textarea
        value={value || ''}
        onChange={handleChange}
        placeholder={placeholder}
        className="w-full min-h-[150px] p-5 rounded-lg bg-neutral-50 text-black placeholder-neutral-300 border-none resize-none focus:outline-none focus:ring-2 focus:ring-primary-light"
        style={{
          fontFamily: 'Alan Sans',
          fontSize: '14px',
          lineHeight: '20px',
          marginBottom: '10px',
        }}
      />
    </div>
  );
}

