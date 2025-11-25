'use client';

interface ProfileHeaderProps {
  title: string; 
  onBack?: () => void;
  showBackButton?: boolean;
}

export function ProfileHeader({ title, onBack, showBackButton = true }: ProfileHeaderProps) {
  return (
    <div
      className="w-full flex items-center relative"
      style={{
        width: '100%',
      }}
    >
      {showBackButton && (
        <button
          onClick={onBack}
          style={{
            marginLeft: '2px',
            background: 'none',
            border: 'none',
            padding: 0,
            cursor: onBack ? 'pointer' : 'default',
          }}
        >
          <img
            src="/profile/ComponentIcon/ReturnArrows.svg"
            alt="Back"
            width={48}
            height={48}
          />
        </button>
      )}

      <div
        className="flex flex-wrap justify-center items-center"
        style={{
          position: 'absolute',
          left: '50%',
          transform: 'translateX(-50%)',
          maxWidth: 'calc(100% - 100px)',
          textAlign: 'center',
        }}
      >
        <span
          className="break-words"
          style={{
            fontFamily: 'Alan Sans',
            fontSize: '26px',
            fontWeight: 800, 
            color: '#FFFFFF',
            wordWrap: 'break-word',
            overflowWrap: 'break-word',
          }}
        >
          {title}
        </span>
      </div>
    </div>
  );
}

