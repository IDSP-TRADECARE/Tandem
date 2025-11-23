'use client';

interface ProfileCardProps {
  title: string; 
  description: string; 
  image?: string; 
}

export function ProfileCard({ 
  title, 
  description, 
  image = '/profile/ComponentIcon/Nanny sharing.svg'
}: ProfileCardProps) {
  return (
    <div
      style={{
        width: '226px',
        height: '167px',
        borderRadius: '13px',
        backgroundColor: '#FFFFFF',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
      }}
    >
      
      <div
        style={{
          height: '105px', 
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '12px',
        }}
      >
        <img
          src={image}
          alt={title}
          style={{
            maxWidth: '100%',
            maxHeight: '100%',
            objectFit: 'contain',
          }}
        />
      </div>

    
      <div
        style={{
          width: '100%',
          flex: 1, 
          backgroundColor: 'rgba(206, 249, 202, 0.3)', 
          padding: '8px 12px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-start',
          gap: '6px',
          minHeight: '62px', 
        }}
      >
       
        <span
          style={{
            fontFamily: 'Omnes',
            fontSize: '12px',
            fontWeight: 700, 
            color: '#000000',
            lineHeight: '1.2',
          }}
        >
          {title}
        </span>

        
        <span
          style={{
            fontFamily: 'Omnes',
            fontSize: '10px',
            fontWeight: 400, 
            color: '#000000',
            lineHeight: '1.4',
          }}
        >
          {description}
        </span>
      </div>
    </div>
  );
}

