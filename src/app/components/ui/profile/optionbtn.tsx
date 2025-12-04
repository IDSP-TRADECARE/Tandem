/* eslint-disable @next/next/no-img-element */
'use client';
import { ReactNode } from 'react';
import { IoChevronForwardOutline } from 'react-icons/io5';

interface OptionButtonProps {
  icon: string;
  text: string;
  onClick?: () => void;
  rightComponent?: ReactNode;
  textColor?: string;
  iconColor?: string;
}

export function OptionButton({ icon, text, onClick, rightComponent, textColor = '#000000', iconColor = '#000000' }: OptionButtonProps) {
  const handleRightClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  return (
    <div
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick?.();
        }
      }}
      className="flex items-center justify-between px-4 py-3 w-full transition-opacity hover:opacity-80 cursor-pointer"
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
         style={{
           fontFamily: 'Omnes',
           fontSize: '16px',
           color: textColor,
         }}
         className="font-normal">
        {text}
        </span>
      </div>

      {rightComponent ? (
        <div onClick={handleRightClick}>
          {rightComponent}
        </div>
      ) : (
        <IoChevronForwardOutline size={25} color={iconColor} />
      )}
    </div>
  );
}
