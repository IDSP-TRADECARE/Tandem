export function detectNextWeek(transcript: string): boolean {
  if (!transcript) return false;

  const text = transcript.toLowerCase();

  // Direct statements that clearly mean next week
  const direct =
    text.includes("next week") ||
    text.includes("for next week") ||
    text.includes("starting next week") ||
    text.includes("this coming week") ||
    text.includes("following week");

  if (direct) return true;

  // If user says “Monday” and today is AFTER Monday → assume next week
  const weekdays = [
    "sunday",
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
  ];

  const today = new Date();
  const todayIndex = today.getDay(); // 0 = Sun, 1 = Mon...

  for (let i = 0; i < weekdays.length; i++) {
    if (text.includes(weekdays[i])) {
      const spokenIndex = i;

      // If today is later in the week than the spoken day → next week
      // Example: today=Thu (4), spoken=Mon (1) → 4 > 1 → next week
      if (todayIndex > spokenIndex) {
        return true;
      }
    }
  }

  return false;
}
