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

  return (
    <div
      style={{
        width: '402px',
        overflowX: 'auto',
        overflowY: 'hidden',
        scrollSnapType: 'x mandatory',
        scrollBehavior: 'smooth',
        WebkitOverflowScrolling: 'touch',
        msOverflowStyle: 'none',
        scrollbarWidth: 'none',
      }}
      className="[&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
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

