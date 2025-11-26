/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useUser } from '@clerk/nextjs';
import { BottomNav } from '@/app/components/Layout/BottomNav';
import { GradientBackgroundFull } from '@/app/components/ui/backgrounds/GradientBackgroundFull';
import { HalfBackground } from '@/app/components/ui/backgrounds/HalfBackground';
import { TabBar } from '@/app/components/ui/backgrounds/TabBar';
import { PageHeader } from '@/app/components/ui/nanny/PageHeader';
import type { NannyShare } from '@/db/schema';

type JoinRequest = {
  id: string;
  name: string;
  kidsCount: number;
  note?: string;
  createdAt: string;
  avatarUrl?: string | null;
};

const TABS = ['My requests', 'Available'];

export default function NannyShareDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, isSignedIn } = useUser();
  const [shareId, setShareId] = useState<string | null>(null);
  const [share, setShare] = useState<NannyShare | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<string>(TABS[0]);

  // Local join-requests state (mocked for now)
  const [joinRequests, setJoinRequests] = useState<JoinRequest[]>([]);

  useEffect(() => {
    params.then(({ id }) => setShareId(id));
  }, [params]);

  // Fetch share details
  const fetchShare = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/nanny/${id}`);
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data?.error ?? 'Failed to fetch share');
      }
      const data = await res.json();
      setShare(data.share ?? null);

      // seed two mock requests only if server doesn't provide requests
      if (!data.share?.requests || (Array.isArray(data.share.requests) && data.share.requests.length === 0)) {
        setJoinRequests([
          {
            id: `req_${Date.now()}_1`,
            name: 'Stefan Demeis',
            kidsCount: 1,
            note: 'Hi — I can help with pickup.',
            createdAt: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
            avatarUrl: null,
          },
          {
            id: `req_${Date.now()}_2`,
            name: 'Matheus Walkma',
            kidsCount: 2,
            note: 'We are flexible with time and can share snacks.',
            createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
            avatarUrl: null,
          },
        ]);
      } else {
        setJoinRequests(data.share.requests);
      }
    } catch (err) {
      console.error('Fetch share error', err);
      setError(err instanceof Error ? err.message : 'Failed to load');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!shareId) return;
    fetchShare(shareId);
  }, [shareId, fetchShare]);

  // keep tab selection synced with search params (so clicking from list preserves intent)
  useEffect(() => {
    const qp = searchParams?.get('tab');
    if (qp && TABS.includes(qp)) setActiveTab(qp);
  }, [searchParams]);

  const isCreator = Boolean(share && isSignedIn && share.creatorId === user?.id);

  // Accept / Reject handlers (optimistic UI). TODO: wire to server endpoints.
  const handleAccept = async (requestId: string) => {
    const req = joinRequests.find((r) => r.id === requestId);
    if (!req || !share) return;

    setJoinRequests((prev) => prev.filter((r) => r.id !== requestId));

    const newMember = {
      userId: `pending_${req.id}`,
      name: req.name,
      kidsCount: req.kidsCount,
      joinedAt: new Date().toISOString(),
      avatarUrl: req.avatarUrl ?? null,
    };

    setShare((prev) => (prev ? { ...prev, members: [...(prev.members || []), (newMember as any)] } : prev));

    // TODO: POST /api/nanny/[id]/requests/[requestId]/accept
  };

  const handleReject = async (requestId: string) => {
    setJoinRequests((prev) => prev.filter((r) => r.id !== requestId));
    // TODO: POST /api/nanny/[id]/requests/[requestId]/reject
  };

  const handleMessageHost = () => {
    if (!shareId) return;
    if (!isSignedIn) {
      window.location.href = '/sign-in';
      return;
    }
    router.push(`/nanny/${shareId}/chat`);
  };

  const handleRequestToJoin = async () => {
    if (!shareId) return;
    if (!isSignedIn) {
      window.location.href = '/sign-in';
      return;
    }

    const kidsCountStr = window.prompt('How many kids will attend?', '1');
    const kidsCount = kidsCountStr ? Number(kidsCountStr) : 1;
    if (!kidsCount || kidsCount <= 0) {
      alert('Please enter a valid number of kids.');
      return;
    }

    try {
      const userName = `${user?.firstName ?? ''} ${user?.lastName ?? ''}`.trim() || user?.username || 'Anonymous';
      const res = await fetch(`/api/nanny/${shareId}/join`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userName, kidsCount }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data?.error ?? 'Failed to request/join');

      // refresh share
      await fetchShare(shareId);
    } catch (err) {
      console.error('Request to join failed', err);
      alert(err instanceof Error ? err.message : 'Failed to request to join');
    }
  };

  // Tab click: route back to list page and preserve tab selection
  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    router.push(`/nanny?tab=${encodeURIComponent(tab)}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-blue-50 via-white to-green-50">
        <div className="text-center">
          <div className="w-14 h-14 rounded-full border-4 border-primary border-t-transparent animate-spin mx-auto mb-4" />
          <div className="text-sm text-neutral-500">Loading share...</div>
        </div>
      </div>
    );
  }

  if (error || !share) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 bg-linear-to-br from-blue-50 via-white to-green-50">
        <div className="text-center">
          <div className="text-6xl mb-4">😔</div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Share not found</h2>
          <p className="text-neutral-500 mb-6">{error ?? 'This share may have been removed.'}</p>
          <button onClick={() => router.push('/nanny')} className="px-5 py-3 rounded-full bg-primary text-white">
            Back to shares
          </button>
        </div>
      </div>
    );
  }

  // Avatar helper
  const Avatar: React.FC<{ name?: string; src?: string | null; size?: number }> = ({ name, src, size = 48 }) => {
    const initials = (name || 'U').split(' ').map(n => n[0]).slice(0,2).join('').toUpperCase();
    if (src) {
      return <img src={src} alt={name} className="rounded-full object-cover" style={{ width: size, height: size }} />;
    }
    return <div style={{ width: size, height: size }} className="rounded-full bg-linear-to-br from-blue-400 to-green-400 text-white flex items-center justify-center font-semibold">{initials}</div>;
  };

  const dateLabel = share.date ? new Date(share.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '';

  return (
    <GradientBackgroundFull>
      <div className="pt-6">
        <PageHeader title="Nanny Sharing" />
      </div>

      <HalfBackground>
        {/* Tab bar (keeps same component used in the list page) */}
        <div className="px-4 pt-2">
          <TabBar tabs={TABS} activeTab={activeTab} onTabChange={handleTabChange} />
        </div>

        {/* Make interior scrollable: overflow-y-auto with a calc height to avoid parent overflow issues.
            The exact calc may be tuned to match your app chrome; adjust '140px' if header/nav sizes differ. */}
        <div className="px-6 pb-8 max-w-3xl mx-auto overflow-y-auto" style={{ height: 'calc(85.7vh - 140px)' }}>
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden mt-4">
            <div className="p-6">
              <h2 className="text-2xl font-extrabold tracking-tight mb-2">{dateLabel} · {share.startTime} - {share.endTime}</h2>

              <ul className="mt-2 list-disc list-inside text-sm text-neutral-600 space-y-1">
                <li><strong>Location:</strong> {share.location || 'TBD'}</li>
                <li><strong>Nanny Name:</strong> {share.members?.[0]?.name ?? 'Beau'}</li>
                <li><strong>Host:</strong> {share.creatorId === user?.id ? 'You' : (share.members?.find(m => m.userId === share.creatorId)?.name ?? 'Host')}</li>
                {share.price && <li><strong>Cost:</strong> ${share.price} / hr</li>}
                {share.certificates && share.certificates.length > 0 && <li><strong>Certificate:</strong> {share.certificates.join(', ')}</li>}
              </ul>

              <hr className="my-4 border-gray-200" />

              <div>
                <h3 className="text-sm font-semibold text-neutral-700 mb-3">Current Group</h3>
                <div className="space-y-3">
                  {(share.members || []).map((member, idx) => (
                    <div key={idx} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                      <div><Avatar name={member.name} src={(member as any).avatarUrl ?? null} size={48} /></div>
                      <div className="flex-1">
                        <div className="font-semibold text-neutral-900">{member.name}</div>
                        <div className="text-sm text-neutral-500">{member.kidsCount ?? 1} {member.kidsCount === 1 ? 'kid' : 'kids'} · {new Date(member.joinedAt).toLocaleDateString()}</div>
                      </div>
                      <div className="text-sm text-primary underline">See more</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Requests */}
          <div className="mt-6">
            <h3 className="text-lg font-semibold text-neutral-900 mb-3">Requests to Join</h3>

            {joinRequests.length === 0 ? (
              <div className="bg-white rounded-xl p-6 text-center text-neutral-500">No requests yet</div>
            ) : (
              <div className="space-y-3">
                {joinRequests.map((r) => (
                  <div key={r.id} className="bg-white rounded-xl p-3 flex items-center gap-4 shadow-sm">
                    <div><Avatar name={r.name} src={r.avatarUrl ?? null} size={56} /></div>

                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-semibold text-neutral-900">{r.name}</div>
                          <div className="text-sm text-neutral-500">{r.kidsCount} {r.kidsCount === 1 ? 'kid' : 'kids'}</div>
                        </div>
                        <div className="text-xs text-neutral-400">{new Date(r.createdAt).toLocaleDateString()}</div>
                      </div>
                      {r.note && <div className="text-sm text-neutral-600 mt-2">{r.note}</div>}
                    </div>

                    {isCreator ? (
                      <div className="flex flex-col gap-2 ml-2">
                        <button onClick={() => handleReject(r.id)} className="w-10 h-10 rounded-full bg-red-50 text-red-600 flex items-center justify-center" aria-label="Reject">✕</button>
                        <button onClick={() => handleAccept(r.id)} className="w-10 h-10 rounded-full bg-green-50 text-green-600 flex items-center justify-center" aria-label="Accept">✓</button>
                      </div>
                    ) : null}
                  </div>
                ))}
              </div>
            )}
          </div>

          {!isCreator && (
            <div className="mt-6 flex gap-4">
              <button onClick={handleMessageHost} className="flex-1 inline-flex items-center justify-center gap-3 border border-primary text-primary px-4 py-3 rounded-full font-semibold">
                <span>Message the host</span>
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none"><path d="M22 2L11 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M22 2L15 22L11 13L2 9L22 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </button>

              <button onClick={handleRequestToJoin} className="flex-1 bg-primary text-white px-4 py-3 rounded-full font-semibold">Request to join</button>
            </div>
          )}

          <div className="mt-6 text-sm text-neutral-400">
            <em>Pending requests & approvals will appear above. (Server integration point)</em>
          </div>

          <div style={{ height: 40 }} /> {/* bottom spacer so last item isn't hidden under nav */}
        </div>
      </HalfBackground>

      <BottomNav />
    </GradientBackgroundFull>
  );
}