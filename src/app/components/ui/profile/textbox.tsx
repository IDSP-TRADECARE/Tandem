'use client';
import React, { useState, useEffect } from 'react';

interface TextBoxProps {
  label?: string;
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  className?: string;
}

export function TextBox({
  label,
  placeholder = 'To help us improve, please describe your feedback as detailed as possible',
  value,
  onChange,
  className = '',
}: TextBoxProps) {
  const [internalValue, setInternalValue] = useState<string>(value ?? '');

  // keep internal state in sync when used as a controlled component
  useEffect(() => {
    if (value !== undefined) {
      setInternalValue(value);
    }
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (onChange) {
      onChange(e);
    } else {
      setInternalValue(e.target.value);
    }
  };

  const displayedValue = value !== undefined ? value : internalValue;

  return (
    <div className={`w-full ${className}`}>
      {label && (
        <span
          style={{
            fontFamily: 'Alan Sans',
            fontSize: '20px',
            fontWeight: 500,
          }}
          className="text-black mb-2 block"
        >
          {label}
        </span>
      )}

      <textarea
        value={displayedValue ?? ''}
        onChange={handleChange}
        placeholder={placeholder}
        className="w-full min-h-[150px] p-5 rounded-lg bg-neutral-50 text-black placeholder-neutral-300 border-none resize-none focus:outline-none focus:ring-2 focus:ring-primary-light"
        style={{
          fontFamily: 'Alan Sans',
          fontSize: '14px',
          lineHeight: '20px',
          marginBottom: '10px',
        }}
        aria-label={label ?? 'textbox'}
      />
    </div>
  );
}

