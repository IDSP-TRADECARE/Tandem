import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getStartOfWeek(date: Date) {
  const d = new Date(date);
  const day = d.getDay();        // 0 = Sun … 6 = Sat
  const diff = (day === 0 ? -6 : 1) - day; 
  d.setDate(d.getDate() + diff);
  d.setHours(0, 0, 0, 0);
  return d;
}
