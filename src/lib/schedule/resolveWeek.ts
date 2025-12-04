export function resolveWeek(forNextWeek: boolean): string {
  const today = new Date();

  // Get Monday of this week
  const day = today.getDay();
  const diff = (day === 0 ? -6 : 1) - day;
  const thisMonday = new Date(today);
  thisMonday.setDate(today.getDate() + diff);
  thisMonday.setHours(0, 0, 0, 0);

  if (!forNextWeek) {
    return thisMonday.toISOString().slice(0, 10); 
  }

  // NEXT WEEK Monday
  const nextMonday = new Date(thisMonday);
  nextMonday.setDate(thisMonday.getDate() + 7);

  return nextMonday.toISOString().slice(0, 10);
}
