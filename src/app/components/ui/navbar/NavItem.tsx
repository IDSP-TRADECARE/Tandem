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
        <div className={`w-7 h-7 transition-colors ${
          isActive ? 'text-[#3d5a80]' : 'text-white'
        }`}>
          {icon}
        </div>
      </div>
      <span className={`text-xs font-medium mt-1 ${
        isActive ? 'text-white' : 'text-white/70'
      }`}>
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