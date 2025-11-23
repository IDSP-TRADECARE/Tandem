'use client';

interface OptionButtonProps {
  icon: string;
  text: string;
  onClick?: () => void;
}

export function OptionButton({ icon, text, onClick }: OptionButtonProps) {
  return (
    <button
      onClick={onClick}
      className="flex items-center justify-between px-4 py-3 w-full transition-opacity hover:opacity-80"
      style={{
        width: '368px',
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

      <img
        src="/profile/ComponentIcon/Arrows.svg"
        alt=""
        width={25}
        height={25}
        className="shrink-0"
      />
    </button>
  );
}
