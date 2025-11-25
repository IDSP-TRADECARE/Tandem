'use client';
import { ReactNode } from 'react';

interface OptionButtonProps {
  icon: string;
  text: string;
  onClick?: () => void;
  rightComponent?: ReactNode;
}

export function OptionButton({ icon, text, onClick, rightComponent }: OptionButtonProps) {
  const handleRightClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  return (
    <button
      onClick={onClick}
      className="flex items-center justify-between px-4 py-3 w-full transition-opacity hover:opacity-80"
      style={{
        width: '100%',
        height: '52px',
        borderRadius: '12px',
        backgroundColor: 'rgba(163, 192, 232, 0.3)',
      }}
    >
      <div className="flex items-center gap-3">
        <img
          src={icon}
          alt=""
          width={27}
          height={27}
          className="shrink-0"
        />
        <span
         style={{fontFamily: 'Omnes',fontSize: '16px',}}
         className="font-normal text-black">
        {text}
        </span>
      </div>

      {rightComponent ? (
        <div onClick={handleRightClick}>
          {rightComponent}
        </div>
      ) : (
        <img
          src="/profile/ComponentIcon/Arrows.svg"
          alt=""
          width={25}
          height={25}
          className="shrink-0"
        />
      )}

    
    </button>
  );
}
