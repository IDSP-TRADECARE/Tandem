'use client';
import { ProfileCard } from './card';
import { useRouter } from 'next/navigation';

export function ProfileCardCarousel() {
  const router = useRouter();
  
  const cards = [
    {
      title: 'Nanny Sharing',
      description: 'Find nearby families who also need a nanny and share the cost together',
      image: '/profile/ComponentIcon/Nanny sharing.svg',
      href: '/profile/FeatureGuide',
    },
    {
      title: 'Scheduling',
      description: 'Manage your schedule and coordinate childcare with ease',
      image: '/profile/ComponentIcon/Scheduling.svg',
    },
    {
      title: 'Upload Scheduling',
      description: 'Upload your schedule files and let us organize them for you',
      image: '/profile/ComponentIcon/Upload scheduling.svg',
    },
  ];

  const handleWheel = (e: React.WheelEvent) => {
    const element = e.currentTarget;
    const { scrollLeft, scrollWidth, clientWidth } = element;
    const isScrollingHorizontally = Math.abs(e.deltaX) > Math.abs(e.deltaY);
    
    // Only prevent default when scrolling horizontally to avoid page layout shift
    if (isScrollingHorizontally) {
      e.preventDefault();
      e.stopPropagation();
    } else {
      // For vertical scrolling, allow it to pass through at boundaries
      const isAtTop = scrollLeft <= 0 && e.deltaY < 0;
      const isAtBottom = scrollLeft >= scrollWidth - clientWidth - 1 && e.deltaY > 0;
      
      // Only prevent if we're in the middle of the scroll area
      if (!isAtTop && !isAtBottom) {
        e.preventDefault();
        e.stopPropagation();
      }
    }
  };

  return (
    <div
      onWheel={handleWheel}
      className="w-full [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
      style={{
        width: '100%',
        overflowX: 'auto',
        overflowY: 'hidden',
        scrollSnapType: 'x mandatory',
        scrollBehavior: 'smooth',
        WebkitOverflowScrolling: 'touch',
        msOverflowStyle: 'none',
        scrollbarWidth: 'none',
        touchAction: 'pan-x pan-y',
        overscrollBehaviorX: 'contain',
        overscrollBehaviorY: 'auto',
        isolation: 'isolate',
      }}
    >
      <div
        style={{
          display: 'flex',
          gap: '16px',
          padding: '0 88px 0 0', 
          width: 'max-content',
        }}
      >
        {cards.map((card, index) => (
          <div
            key={index}
            style={{
              scrollSnapAlign: 'center',
              flexShrink: 0,
              cursor: card.href ? 'pointer' : 'default',
            }}
            onClick={() => card.href && router.push(card.href)}
          >
            <ProfileCard
              title={card.title}
              description={card.description}
              image={card.image}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

