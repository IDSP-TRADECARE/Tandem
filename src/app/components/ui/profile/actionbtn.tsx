'use client';

interface ActionButtonProps {
  text: string;
  onClick?: () => void;
  className?: string;
  icon?: string;
  fontSize?: string;
}

export function ActionButton({ text, onClick, className, icon, fontSize }: ActionButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center justify-center w-full ${icon ? 'gap-2' : ''} transition-opacity hover:opacity-80 cursor-pointer ${className || ''}`}
      style={{
        width: '100%',
        height: '50px',
        borderRadius: '444px',
        backgroundColor: '#92F189',
        fontFamily: 'Alan Sans', 
        fontSize: fontSize || '20px',
        color: '#000000',
        border: 'none',
        padding: '0 24px',
      }}>
      {text}
      {icon && <img src={icon} alt="icon" width={20} height={20} />}
    </button>
  );
}
