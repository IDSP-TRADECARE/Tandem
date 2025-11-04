import Link from "next/link";
import { typography } from "@/app/styles/typography";
interface NavLabelProps {
  label: string;
  pos: number;
  href: string;
}

export function NavLabel(NavLabelProps: NavLabelProps) {
  return (
    <span className={`text-xs ${typography.body.label} whitespace-nowrap text-white select-none absolute`} style={{ left: `${NavLabelProps.pos}%`, bottom: '8px' }}>
        <Link href={NavLabelProps.href}>
      {NavLabelProps.label}
        </Link>
    </span>
  );
};
