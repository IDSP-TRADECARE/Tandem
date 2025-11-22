'use client';

interface UnderlineInputProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
}

export function UnderlineInput({ 
  label, 
  value, 
  onChange, 
  placeholder = '',
  disabled = false 
}: UnderlineInputProps) {
  return (
    <div>
      <label className="block text-lg font-bold text-gray-900 mb-2">
        {label}
      </label>
      {disabled ? (
        <div className="pb-2 border-b-2 border-gray-900 text-gray-900">
          {value || 'N/A'}
        </div>
      ) : (
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full pb-2 border-b-2 border-gray-900 focus:outline-none text-gray-900 placeholder-gray-400 bg-transparent"
        />
      )}
    </div>
  );
}