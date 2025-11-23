'use client';

interface ActionButtonProps {
  text: string;
  onClick?: () => void;
}

export function ActionButton({ text, onClick }: ActionButtonProps) {
  return (
    <button
      onClick={onClick}
      className="flex items-center justify-center transition-opacity hover:opacity-80 cursor-pointer"
      style={{
        width: '368px',
        height: '50px',
        borderRadius: '444px',
        backgroundColor: '#92F189',
        fontFamily: 'Alan Sans', 
        fontSize: '20px',
        fontWeight: 'medium',
        color: '#000000',
        border: 'none',
      }}>
      {text}
    </button>
  );
}
