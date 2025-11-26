import Link from "next/link";
import { typography } from "@/app/styles/typography";
import { navPositions } from '@/app/components/Layout/BottomNav';

interface NavLabelProps {
  label: string;
  href: string;
}

export function NavLabel({ label, href }: NavLabelProps) {
  const pos = navPositions[href] || 12.5; // Get position from mapping
  
  return (
    <span 
      className={`text-xs ${typography.body.label} whitespace-nowrap text-white select-none absolute`} 
      style={{ left: `${pos}%`, bottom: '8px', transform: 'translateX(-50%)' }}
    >
      <Link href={href}>
        {label}
      </Link>
    </span>
  );
}
