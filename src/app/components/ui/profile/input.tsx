'use client';

interface ProfileInputProps {
  title: string; 
  input: string; 
}

export function ProfileInput({ title, input }: ProfileInputProps) {
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

      <span
        style={{
          fontFamily: 'Omnes',
          fontSize: '16px',
          fontWeight: 400,
        }}
        className="text-black mb-2"
      >
        {input}
      </span>


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

