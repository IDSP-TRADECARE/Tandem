'use client';

interface ActionButtonProps {
  text: string;
  onClick?: () => void;
  className?: string;
  icon?: string;
}

export function ActionButton({ text, onClick, className, icon }: ActionButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center justify-center ${icon ? 'gap-2' : ''} transition-opacity hover:opacity-80 cursor-pointer ${className || ''}`}
      style={{
        width: '368px',
        height: '50px',
        borderRadius: '444px',
        backgroundColor: '#92F189',
        fontFamily: 'Alan Sans', 
        fontSize: '20px',
        color: '#000000',
        border: 'none',
      }}>
      {text}
      {icon && <img src={icon} alt="icon" width={20} height={20} />}
    </button>
  );
}
