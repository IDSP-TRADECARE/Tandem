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

export async function createQuickShare(
  overrides?: Partial<QuickShare>
): Promise<{ id: string; [key: string]: any }> {
  const today = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
  const payload: QuickShare = {
    date: today,
    startTime: '06:00',
    endTime: '20:00',
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