'use client';

interface ProfileHeaderProps {
  title: string; 
  onBack?: () => void;
  showBackButton?: boolean;
}

export function ProfileHeader({ title, onBack, showBackButton = true }: ProfileHeaderProps) {
  return (
    <div
      style={{
        width: '402px',
        display: 'flex',
        alignItems: 'center',
        position: 'relative',
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
        style={{
          position: 'absolute',
          left: '50%',
          transform: 'translateX(-50%)',
        }}
      >
        <span
          style={{
            fontFamily: 'Alan Sans',
            fontSize: '32px',
            fontWeight: 800, 
            color: '#FFFFFF',
          }}
        >
          {title}
        </span>
      </div>
    </div>
  );
}

