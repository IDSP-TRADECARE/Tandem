import { ReactNode } from 'react';
import { navPositions } from '@/app/components/Layout/BottomNav';

interface NavContainerProps {
  children: ReactNode;
}

export function NavContainer({ children }: NavContainerProps) {
  
  // Find the active href using imported mapping
  let activePositionPercent = 12.5; // default to first position
  
  if (Array.isArray(children)) {
    children.forEach((child: React.ReactElement<{ isActive?: boolean; href?: string }>) => {
      if (child?.props?.isActive && child?.props?.href) {
        const href = child.props.href;
        if (navPositions[href]) {
          activePositionPercent = navPositions[href];
          
          // Special offset for calendar
          if (href === '/calendar') {
            activePositionPercent += 3.2;
          }
          if (href === '/schedule/upload') {
            activePositionPercent += 1;
          }
          if (href === '/nanny') {
            activePositionPercent -= 1;
          }
          if (href === '/profile') {
            activePositionPercent -= 3.2;
          }
        }
      }
    });
  }
  
  // cutout with smooth edges
  const radiusPx = 40;
  const featherPx = 0.3;
  const cutoutStyle = `radial-gradient(circle ${radiusPx}px at ${activePositionPercent}% -10px, transparent 0, transparent ${radiusPx - featherPx}px, black ${radiusPx + featherPx}px)`;

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 px-8 pb-6">
      <div 
        className="absolute bottom-6 left-4 right-4 bg-primary-active rounded-4xl shadow-2xl h-[62px] transition-all duration-300"
        style={{
          WebkitMaskImage: cutoutStyle,
          maskImage: cutoutStyle,
          WebkitMaskComposite: 'source-out',
          WebkitBackfaceVisibility: 'hidden',
          transform: 'translateZ(0)',
        }}
      />
      
      <div className="relative flex items-center justify-around h-[62px]">
        {children}
      </div>
    </nav>
  );
}