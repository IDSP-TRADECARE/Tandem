'use client';

import { ReactNode, useState, useEffect } from 'react';
import { navPositions } from '@/app/components/Layout/BottomNav';

interface NavContainerProps {
  children: ReactNode;
}

export function NavContainer({ children }: NavContainerProps) {
  const [isMobile, setIsMobile] = useState(true);
  
  // Check if we're on mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768); // md breakpoint
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);
  
  // Find the active href using imported mapping
  let activePositionPercent = 12.5; // default to first position
  let hasActiveRoute = false;
  
  if (Array.isArray(children)) {
    children.forEach((child: React.ReactElement<{ isActive?: boolean; href?: string }>) => {
      if (child?.props?.isActive && child?.props?.href) {
        const href = child.props.href;
        if (navPositions[href]) {
          hasActiveRoute = true;
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
  
  // Only show cutout on mobile and when on a navbar route
  const showCutout = isMobile && hasActiveRoute;
  
  // cutout with smooth edges
  const radiusPx = 40;
  const featherPx = 0.3;
  const cutoutStyle = showCutout 
    ? `radial-gradient(circle ${radiusPx}px at ${activePositionPercent}% -10px, transparent 0, transparent ${radiusPx - featherPx}px, black ${radiusPx + featherPx}px)`
    : 'none';

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 px-8 pb-6">
      <div 
        className="absolute bottom-6 left-4 right-4 bg-primary-active rounded-4xl shadow-2xl h-[62px] transition-all duration-300"
        style={{
          WebkitMaskImage: cutoutStyle,
          maskImage: cutoutStyle,
          WebkitMaskComposite: showCutout ? 'source-out' : 'none',
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