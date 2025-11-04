import { ReactNode } from 'react';

interface NavContainerProps {
  children: ReactNode;
}

export function NavContainer({ children }: NavContainerProps) {
  
  //select item if active
  let activeIndex = 0;
  if (Array.isArray(children)) {
    children.forEach((child: React.ReactElement<{ isActive?: boolean }>, index: number) => {
      if (child?.props?.isActive) {
        activeIndex = index;
      }
    });
  }
  
  // cutout
  const positions = [12.5, 37.5, 62.5, 87.5];
  const activePositionPercent = positions[activeIndex];
  
  const radiusPx = 40;
  const cutoutStyle = `radial-gradient(circle ${radiusPx}px at ${activePositionPercent}% -10px, transparent 0, transparent ${radiusPx}px, black ${radiusPx}px)`;
  // cutout end ---------

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 px-8 pb-6">
    
    {/* Cutout */}
      <div 
        className="absolute bottom-6 left-4 right-4 bg-primary-active rounded-4xl shadow-2xl h-[62px] transition-all duration-300"
        style={{
          WebkitMaskImage: cutoutStyle,
          maskImage: cutoutStyle
        }}
      />
      
      {/* NavItems */}
      <div className="relative flex items-center justify-around h-[62px]">
        {children}
      </div>
    </nav>
  );
}