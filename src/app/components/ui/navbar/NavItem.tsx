import Link from 'next/link';

interface NavItemProps {
  href: string;
  icon: React.ReactNode;
  isActive: boolean;
  onClick?: () => void;
}

export function NavItem({ href, icon, isActive, onClick }: NavItemProps) {
  const content = (
    <div className={`flex flex-col items-center transition-all`}>
      <div className={`rounded-full transition-all ${
        isActive 
          ? 'bg-primary-active p-4 -translate-y-8' 
          : 'bg-transparent'
      }`}>
        <div className="w-5 h-5 text-white">
          {icon}
        </div>
      </div>
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


// STEFAN NOTES

// make line 16 padding inline so it doesnt fuck the shit uo
// related to line 24
// make the cutout in navcontainer smoother, add another one