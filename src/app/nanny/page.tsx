'use client';

import Link from 'next/link';
import { NannyLayout } from '@/app/components/ui/nanny/NannyLayout';
import { ShareRequestCard } from '@/app/components/ui/nanny/cards/ShareRequestCard';
import type { NannyShare } from '@/db/schema';

export default function NannySharePage() {
  return (
    <NannyLayout>
      {({ activeTab, myShares, availableShares, loading, error }) => {
        const shares: NannyShare[] = activeTab === 'My requests' ? myShares : availableShares;

        const formatTime = (time: string) => {
          if (!time) return '';
          const [hours] = time.split(':');
          const hour = parseInt(hours);
          const ampm = hour >= 12 ? 'pm' : 'am';
          const displayHour = hour % 12 || 12;
          return `${displayHour}${ampm}`;
        };

        const formatDate = (dateStr: string) => {
          if (!dateStr) return '';
          const date = new Date(dateStr);
          return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }).toUpperCase();
        };

        return (
          <>
            <div className="mt-4">
              {error && <div className="bg-red-50 p-3 rounded">{error}</div>}
              {loading && <div className="text-center p-6">Loading...</div>}

              {!loading && shares.length === 0 && (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">📅</div>
                  <div className="text-lg font-semibold mb-2">{activeTab === 'My requests' ? 'No nanny sharing yet' : 'No shares available'}</div>
                  <div className="text-sm text-neutral-500 mb-4">Create a share to get started.</div>
                  <Link href="/nanny/create" className="inline-block px-6 py-2 bg-primary text-white rounded-full">Create a share</Link>
                </div>
              )}

              {!loading && shares.length > 0 && (
                <div className="space-y-4">
                  {shares.map((s) => (
                    <Link key={s.id} href={`/nanny/${s.id}`}>
                      <ShareRequestCard
                        date={formatDate(s.date)}
                        time={`${formatTime(s.startTime)}-${formatTime(s.endTime)}`}
                        nannyName={s.members?.[0]?.name || 'Organizer'}
                        availableSpots={s.maxSpots ? s.maxSpots - (s.members?.length ?? 0) : 0}
                        hasActivity={(s.members?.length ?? 0) > 0}
                      />
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </>
        );
      }}
    </NannyLayout>
  );
}