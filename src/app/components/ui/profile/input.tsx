'use client';
import React from 'react';

interface InputProps {
  label: string;
  value: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type?: string;
  placeholder?: string;
  icon?: string;
}

export function Input({
  label,
  value,
  onChange,
  type = 'text',
  placeholder = '',
  icon,
}: InputProps) {
  return (
    <div className="flex flex-col w-full">
      <span
        style={{
          fontFamily: 'Alan Sans',
          fontSize: '20px',
          fontWeight: 500,
        }}
        className="text-black mb-2"
      >
        {label}
      </span>

      <div className="flex items-center gap-2 text-black mb-2">
        {icon && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={icon}
            alt=""
            width={20}
            height={20}
            className="shrink-0"
          />
        )}
        <input
          value={value}
          onChange={onChange}
          type={type}
          placeholder={placeholder}
          aria-label={label}
          className="flex-1 bg-transparent text-black placeholder-gray-400 outline-none"
          style={{
            fontFamily: 'Omnes',
            fontSize: '16px',
            fontWeight: 400,
          }}
        />
      </div>

      <div
        className="w-full"
        style={{
          width: '100%',
          height: '1px',
          backgroundColor: '#000000',
        }}
      />
    </div>
  );
}

/**
 * ProfileInput: read-only display component
 */
interface ProfileInputProps {
  title: string;
  input: string;
  icon?: string;
}

export function ProfileInput({ title, input, icon }: ProfileInputProps) {
  return (
    <div className="flex flex-col w-full">
      <span
        style={{
          fontFamily: 'Alan Sans',
          fontSize: '20px',
          fontWeight: 500,
        }}
        className="text-black mb-2"
      >
        {title}
      </span>

      <div className="flex items-center gap-2 text-black mb-2">
        {icon && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={icon}
            alt=""
            width={20}
            height={20}
            className="shrink-0"
          />
        )}
        <span
          style={{
            fontFamily: 'Omnes',
            fontSize: '16px',
            fontWeight: 400,
          }}
        >
          {input}
        </span>
      </div>

      <div
        className="w-full"
        style={{
          width: '100%',
          height: '1px',
          backgroundColor: '#000000',
        }}
      />
    </div>
  );
}

