/* eslint-disable @typescript-eslint/no-explicit-any */
export type QuickShare = {
  date: string; // YYYY-MM-DD format
  startTime: string; // HH:MM format (24-hour)
  endTime: string; // HH:MM format (24-hour)
  price: number;
  certificates: string[];
  maxSpots: number;
  location?: string;
  creatorName?: string;
};

function pad(n: number) {
  return n.toString().padStart(2, '0');
}

function formatHHMM(d: Date) {
  return `${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

// Helper to convert 12-hour time to 24-hour HH:MM format
function convertTo24Hour(time12h: string): string {
  const [time, modifier] = time12h.trim().split(/\s+/);
  // eslint-disable-next-line prefer-const
  let [hours, minutes] = time.split(':');

  if (hours === '12') {
    hours = '00';
  }

  if (modifier?.toUpperCase() === 'PM') {
    hours = String(parseInt(hours, 10) + 12);
  }

  return `${hours.padStart(2, '0')}:${minutes}`;
}

export async function createQuickShare(
  overrides?: Partial<QuickShare> & {
    customDate?: string; // YYYY-MM-DD
    customStartTime?: string; // HH:MM or "h:mm AM/PM"
    customEndTime?: string; // HH:MM or "h:mm AM/PM"
  }
): Promise<{ id: string; [key: string]: any }> {
  const now = new Date();

  // Use custom date or default to today
  const date = overrides?.customDate || now.toISOString().slice(0, 10);

  // Use custom start time or default to now
  let startTime: string;
  if (overrides?.customStartTime) {
    // Check if it's in 12-hour format (contains AM/PM)
    if (/AM|PM/i.test(overrides.customStartTime)) {
      startTime = convertTo24Hour(overrides.customStartTime);
    } else {
      startTime = overrides.customStartTime;
    }
  } else {
    startTime = formatHHMM(now);
  }

  // Use custom end time or default to 6 hours from start
  let endTime: string;
  if (overrides?.customEndTime) {
    // Check if it's in 12-hour format (contains AM/PM)
    if (/AM|PM/i.test(overrides.customEndTime)) {
      endTime = convertTo24Hour(overrides.customEndTime);
    } else {
      endTime = overrides.customEndTime;
    }
  } else {
    const sixHoursMs = 6 * 60 * 60 * 1000;
    const end = new Date(now.getTime() + sixHoursMs);
    endTime = formatHHMM(end);
  }

  const payload: QuickShare = {
    date,
    startTime,
    endTime,
    price: 25,
    certificates: [],
    maxSpots: 8,
    location: 'Nearby',
    ...overrides,
  };

  // Remove custom fields from payload if they exist
  delete (payload as any).customDate;
  delete (payload as any).customStartTime;
  delete (payload as any).customEndTime;

  const res = await fetch('/api/nanny/create', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
    cache: 'no-store',
  });

  if (!res.ok) {
    const text = await res.text().catch(() => res.statusText);
    throw new Error(`createQuickShare failed: ${text}`);
  }

  return (await res.json()) as { id: string; [key: string]: any };
}