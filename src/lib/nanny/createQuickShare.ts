/* eslint-disable @typescript-eslint/no-explicit-any */
export type QuickShare = {
  date: string;
  startTime: string;
  endTime: string;
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

export async function createQuickShare(
  overrides?: Partial<QuickShare>
): Promise<{ id: string; [key: string]: any }> {
  const now = new Date();
  const startTime = formatHHMM(now);

  const sixHoursMs = 6 * 60 * 60 * 1000;
  const end = new Date(now.getTime() + sixHoursMs);
  const endTime = formatHHMM(end);

  const today = now.toISOString().slice(0, 10); // YYYY-MM-DD

  const payload: QuickShare = {
    date: today,
    startTime,
    endTime,
    price: 25,
    certificates: [],
    maxSpots: 8,
    location: 'Nearby',
    ...overrides,
  };

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