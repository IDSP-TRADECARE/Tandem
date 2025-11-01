'use client';
import { GradientBackground } from '@/app/components/ui/nanny/backgrounds/GradientBackground';
import { ReactNode } from 'react';

interface NavContainerProps {
  children: ReactNode;
}

export function NavContainer({ children }: NavContainerProps) {
  // Calculate which item is active by checking children
  let activeIndex = 0;
  
  if (Array.isArray(children)) {
    children.forEach((child: React.ReactElement<{ isActive?: boolean }>, index: number) => {
      if (child?.props?.isActive) {
        activeIndex = index;
      }
    });
  }
  
  // Position percentages for 4 items
  const positions = [12.5, 37.5, 62.5, 87.5];
  const activePositionPercent = positions[activeIndex];
  
  const radiusPx = 40;
  const cutoutStyle = `radial-gradient(circle ${radiusPx}px at ${activePositionPercent}% -10px, transparent 0, transparent ${radiusPx}px, black ${radiusPx}px)`;
  
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 px-4 pb-6">
      {/* Background with cutout */}
      <div 
        className="absolute bottom-6 left-4 right-4 bg-primary-active rounded-4xl shadow-2xl h-[62px] transition-all duration-300"
        style={{
          WebkitMaskImage: cutoutStyle,
          maskImage: cutoutStyle
        }}
      />
      
      {/* Nav items on top (unaffected by mask) */}
      <div className="relative flex items-center justify-around h-[62px]">
        {children}
      </div>
    </nav>
  );
}


import Link from 'next/link';
interface NavItemProps {
  href: string;
  icon: React.ReactNode;
  label: string;
  isActive: boolean;
  onClick?: () => void;
}
export function NavItem({ href, icon, label, isActive, onClick }: NavItemProps) {
  const content = (
    <div className={`flex flex-col items-center transition-all ${
      isActive ? '-translate-y-8' : ''
    }`}>
      <div className={`rounded-full transition-all ${
        isActive 
          ? 'bg-primary-active' 
          : 'bg-transparent'
      }`}>
        <div className="w-5 h-5 text-white">
          {icon}
        </div>
      </div>
      <span className={`text-xs font-medium mt-1 text-white`}>
        {label}
      </span>
    </div>
  );

  if (onClick) {
    return (
        
      <button 
        onClick={onClick}
        className="flex flex-col items-center gap-1 flex-1 focus:outline-none relative"
      >
        {content}
      </button>
    );
  }

  return (
    <Link 
      href={href} 
      className="flex flex-col items-center gap-1 flex-1 focus:outline-none relative"
    >
      {content}
    </Link>
  );
}





export const NavIcons = {
  Schedule: () => {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 15 18"
        fill="none"
        className="w-full h-[98%]"
      >
        <path
          d="M0.825001 6.60001H14.025M0.825001 6.60001V13.86C0.825001 14.784 0.825001 15.246 1.00485 15.5991C1.16304 15.9096 1.41545 16.162 1.7259 16.3202C2.07818 16.5 2.54018 16.5 3.46253 16.5H11.3875C12.3098 16.5 12.771 16.5 13.1233 16.3202C13.4343 16.1618 13.6868 15.9093 13.8452 15.5991C14.025 15.246 14.025 14.7857 14.025 13.8633V6.60001M0.825001 6.60001V5.94001C0.825001 5.01601 0.825001 4.55401 1.00485 4.20091C1.16325 3.88989 1.41488 3.63826 1.7259 3.47986C2.079 3.30001 2.541 3.30001 3.465 3.30001H4.125M14.025 6.60001V5.93754C14.025 5.01519 14.025 4.55319 13.8452 4.20091C13.6867 3.89033 13.434 3.63791 13.1233 3.47986C12.771 3.30001 12.309 3.30001 11.385 3.30001H10.725M4.125 3.30001H10.725M4.125 3.30001V0.825012M10.725 3.30001V0.825012M9.9 11.9625H7.425H4.95"
          stroke="currentColor"
          strokeWidth="1.65"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  },

  Upload: () => {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 17 17"
        fill="none"
        className="w-[90%] h-[90%]"
      >
        <path
          d="M0.825005 5.77501V14.355C0.825005 14.817 0.825005 15.048 0.91493 15.2246C0.994024 15.3798 1.12023 15.506 1.27545 15.5851C1.452 15.675 1.683 15.675 2.14335 15.675H10.725M9.90001 9.07501V6.60001M9.90001 6.60001V4.12501M9.90001 6.60001H7.425M9.90001 6.60001H12.375M4.125 9.73501V3.46501C4.125 2.54101 4.125 2.07901 4.30485 1.72591C4.46325 1.41489 4.71488 1.16326 5.0259 1.00486C5.379 0.825012 5.841 0.825012 6.765 0.825012H13.035C13.959 0.825012 14.421 0.825012 14.7741 1.00486C15.0846 1.16305 15.337 1.41546 15.4952 1.72591C15.675 2.07901 15.675 2.54101 15.675 3.46501V9.73501C15.675 10.659 15.675 11.121 15.4952 11.4741C15.337 11.7846 15.0846 12.037 14.7741 12.1952C14.421 12.375 13.9607 12.375 13.0383 12.375H6.76253C5.84018 12.375 5.37818 12.375 5.0259 12.1952C4.71545 12.037 4.46304 11.7846 4.30485 11.4741C4.125 11.121 4.125 10.659 4.125 9.73501Z"
          stroke="currentColor"
          strokeWidth="1.65"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  },

  NannyShare: () => {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 20 20"
        fill="none"
        className="w-[108%] h-[110%]"
      >
        <path
          d="M5.96602 9.62872C6.19825 9.59591 6.43504 9.60922 6.66231 9.66681C6.88949 9.72441 7.10348 9.82541 7.29121 9.96466C7.47893 10.1039 7.63738 10.2785 7.75703 10.4783C7.87668 10.6782 7.95522 10.8997 7.98848 11.1297C8.0217 11.3597 8.00862 11.5941 7.95039 11.8192C7.89207 12.0443 7.78954 12.2564 7.64864 12.4422L6.2043 14.3455C6.03774 14.5652 5.82248 14.7443 5.57442 14.867C5.32629 14.9897 5.05192 15.0535 4.77461 15.0535H2.60957C2.13586 15.0535 1.68121 14.8666 1.3459 14.535C1.01067 14.2033 0.821487 13.7534 0.821487 13.284C0.821528 12.8145 1.01061 12.3646 1.3459 12.033C1.68121 11.7014 2.13586 11.5154 2.60957 11.5154H3.88203L4.78926 10.3182C4.93015 10.1325 5.10694 9.97642 5.30879 9.85822C5.5107 9.73999 5.73384 9.66153 5.96602 9.62872ZM11.3772 8.78497C11.8907 8.78231 12.396 8.91238 12.843 9.1629L13.0725 9.30548C13.5894 9.66049 13.982 10.1596 14.3068 10.5711L14.3811 10.6649C14.7691 11.1549 15.0745 11.5057 15.4338 11.6912H16.6809C17.6271 11.6912 18.3526 12.4832 18.3527 13.3719C18.3527 14.1744 17.7073 15.0535 16.7385 15.0535H14.3322C13.7879 15.0535 13.4438 14.6359 13.2824 14.4246V14.4236C13.253 14.3849 13.2248 14.3442 13.1965 14.3045C12.6725 14.7305 12.0357 15.0521 11.2316 15.0535H9.01485V14.4803L9.01387 14.4676C9.00495 14.2255 8.99486 13.9831 8.9836 13.741C8.95185 13.063 8.88897 11.7867 8.76289 9.39337L8.7375 8.89337L8.73164 8.78497H11.3772ZM6.13106 10.7752C5.96829 10.7982 5.82213 10.8849 5.72383 11.0145L4.49629 12.6326L4.46504 12.6736H2.60957C2.44511 12.6736 2.28705 12.7377 2.1711 12.8524C2.05524 12.967 1.99047 13.1224 1.99043 13.284C1.99043 13.4455 2.0553 13.601 2.1711 13.7156C2.28705 13.8303 2.44511 13.8953 2.60957 13.8953H4.77461C4.87086 13.8953 4.96596 13.8724 5.05196 13.8299C5.13794 13.7874 5.21317 13.7261 5.27071 13.6502L6.71407 11.7459C6.81219 11.6164 6.85435 11.4537 6.83125 11.2938C6.80807 11.1339 6.72122 10.9897 6.59004 10.8924C6.45876 10.795 6.29383 10.7522 6.13106 10.7752ZM10.1604 13.8953H11.2297C11.8422 13.8944 12.336 13.5833 12.8518 13.0418L13.1965 12.6805L13.2697 12.6033L13.3449 12.6795L13.6955 13.035C13.7534 13.0938 13.8074 13.1586 13.8566 13.2225L13.9895 13.4061L14.0539 13.4998L14.2141 13.7254L14.2932 13.8221C14.3153 13.8467 14.3339 13.8641 14.3479 13.8768C14.3575 13.8855 14.3656 13.891 14.3713 13.8953H16.7385C16.8333 13.8953 16.945 13.842 17.0354 13.744C17.1244 13.6472 17.1848 13.515 17.1848 13.3719C17.1846 13.0836 16.9426 12.8494 16.6809 12.8494H15.1828L15.1633 12.8416L15.0734 12.8035C14.3508 12.4999 13.8542 11.8753 13.4611 11.3797L13.4289 11.3387C13.0133 10.8133 12.6885 10.4048 12.2707 10.1717H12.2697C12.0331 10.0388 11.769 9.96196 11.4982 9.94611L11.382 9.94318H9.96309C10.0327 11.2604 10.0982 12.5778 10.1604 13.8953ZM15.1223 2.4715C15.9787 2.4716 16.8005 2.80871 17.4064 3.40802C18.0124 4.00745 18.3527 4.8206 18.3527 5.66876C18.3527 6.51692 18.0124 7.33008 17.4064 7.9295C16.8005 8.52882 15.9787 8.86593 15.1223 8.86603C14.2657 8.86603 13.4432 8.52891 12.8371 7.9295C12.2312 7.33009 11.8908 6.51687 11.8908 5.66876C11.8908 4.82065 12.2312 4.00744 12.8371 3.40802C13.4432 2.80862 14.2657 2.4715 15.1223 2.4715ZM15.1223 3.6297C14.575 3.6297 14.05 3.84504 13.6633 4.22736C13.2766 4.60978 13.0598 5.12843 13.0598 5.66876C13.0598 6.20909 13.2766 6.72775 13.6633 7.11017C14.05 7.49249 14.575 7.70782 15.1223 7.70782C15.6693 7.70772 16.1937 7.49234 16.5803 7.11017C16.9669 6.72775 17.1848 6.20909 17.1848 5.66876C17.1848 5.12843 16.9669 4.60978 16.5803 4.22736C16.1937 3.84519 15.6693 3.6298 15.1223 3.6297Z"
          fill="currentColor"
          stroke="currentColor"
          strokeWidth="0.20625"
        />
      </svg>
    );
  },

  Profile: () => {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 20 20"
        fill="none"
        className="w-[120%] h-[120%]"
      >
        <path
          d="M14.85 15.675C14.85 13.8517 12.634 12.375 9.9 12.375C7.16595 12.375 4.95 13.8517 4.95 15.675M9.9 9.89999C9.02478 9.89999 8.18541 9.55231 7.56654 8.93344C6.94767 8.31457 6.6 7.4752 6.6 6.59999C6.6 5.72477 6.94767 4.88541 7.56654 4.26654C8.18541 3.64767 9.02478 3.29999 9.9 3.29999C10.7752 3.29999 11.6146 3.64767 12.2334 4.26654C12.8523 4.88541 13.2 5.72477 13.2 6.59999C13.2 7.4752 12.8523 8.31457 12.2334 8.93344C11.6146 9.55231 10.7752 9.89999 9.9 9.89999Z"
          stroke="currentColor"
          strokeWidth="1.65"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  },
};






export default function TestPage() {

  return (
    <GradientBackground>
      <NavContainer>
        <NavItem
          href="/test"
          icon={<NavIcons.Schedule />}
          label="Schedule"
          isActive={false}
        />
        
        <NavItem
          href="/test"
          icon={<NavIcons.Upload />}
          label="Upload"
          isActive={false}
        />

        <NavItem
          href="/nanny"
          icon={<NavIcons.NannyShare />}
          label="Nanny Share"
          isActive={true}
        />

        <NavItem
          href="/profile"
          icon={<NavIcons.Profile />}
          label="Profile"
          isActive={false}
        />
      </NavContainer>
    </GradientBackground>
  );
}