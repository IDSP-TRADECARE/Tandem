'use client';

interface ProfileInputProps {
  title: string; 
  input: string; 
  icon?: string;
}

export function ProfileInput({ title, input, icon }: ProfileInputProps) {
  return (
    <div className="flex flex-col">
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
        style={{
          width: '335px',
          height: '1px',
          backgroundColor: '#000000',
        }}
      />
    </div>
  );
}

