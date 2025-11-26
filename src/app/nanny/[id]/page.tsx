/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@clerk/nextjs';
import { NannyLayout } from '@/app/components/ui/nanny/NannyLayout';
import type { NannyShare } from '@/db/schema';
import MemberCard from "@/app/components/ui/nanny/cards/MemberCard";

type JoinRequest = {
  id: string;
  name: string;
  kidsCount: number;
  note?: string;
  createdAt: string;
  avatarUrl?: string | null;
};

export default function NannyShareDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { user, isSignedIn } = useUser();
  const [shareId, setShareId] = useState<string | null>(null);
  const [share, setShare] = useState<NannyShare | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [joinRequests, setJoinRequests] = useState<JoinRequest[]>([]);

  useEffect(() => {
    params.then(({ id }) => setShareId(id));
  }, [params]);

  // Fetch share from API
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

      // seed mock requests if none provided by API
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

      // fetch profile avatars for members if missing (calls /api/users/[clerkId])
      const members = data.share?.members ?? [];
      if (members && members.length > 0) {
        // kick off but don't await here (we'll await in helper)
        fetchProfilesForMembers(members);
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

  const isCreator = Boolean(share && isSignedIn && share.creatorId === user?.id);

  // Accept/reject handlers (optimistic)
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
  };

  const handleReject = async (requestId: string) => {
    setJoinRequests((prev) => prev.filter((r) => r.id !== requestId));
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
      const userName = `${user?.firstName ?? ''} ${user?.lastName ?? ''}`.trim() || (user as any)?.username || 'Anonymous';
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

  // helper: fetch public profile rows for members that lack avatarUrl
  const fetchProfilesForMembers = useCallback(async (members: any[]) => {
    if (!members || members.length === 0) return;
    const toFetch = members
      .map((m, idx) => ({ m, idx }))
      .filter(({ m }) => {
        // only fetch if there's a userId and no avatarUrl yet and not a pending fake id
        const uid = m?.userId;
        return uid && !m.avatarUrl && typeof uid === 'string' && !uid.startsWith('pending_');
      });

    if (toFetch.length === 0) return;

    try {
      const results = await Promise.all(
        toFetch.map(async ({ m }) => {
          try {
            const uid = encodeURIComponent(m.userId);
            const res = await fetch(`/api/users/${uid}`);
            if (!res.ok) return null;
            const data = await res.json();
            return { userId: m.userId, profilePicture: data.profilePicture ?? data.profile_picture ?? null };
          } catch (err) {
            return null;
          }
        })
      );

      // apply results into the share state
      setShare((prev) => {
        if (!prev) return prev;
        const updatedMembers = prev.members.map((mem) => {
          const found = results.find((r) => r && r.userId === (mem as any).userId);
          if (found && found.profilePicture) {
            return { ...mem, avatarUrl: found.profilePicture };
          }
          return mem;
        });
        return { ...prev, members: updatedMembers };
      });
    } catch (err) {
      // silent fail - avatars are optional
      console.error('fetchProfilesForMembers error', err);
    }
  }, []);

  // compute a nice human date label
  const dateLabel = share?.date ? new Date(share.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '';

  return (
    <NannyLayout>
      {() => (
        <>
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden mt-4">
            <div className="p-6">
              <h2 className="text-2xl font-extrabold tracking-tight mb-2">{dateLabel} · {share?.startTime} - {share?.endTime}</h2>

              <ul className="mt-2 list-disc list-inside text-sm text-neutral-600 space-y-1">
                <li><strong>Location:</strong> {share?.location || 'TBD'}</li>
                <li><strong>Nanny Name:</strong> {share?.members?.[0]?.name ?? 'Beau'}</li>
                <li>
                  <strong>Host:</strong> {share?.creatorId === user?.id ? 'You' : (share?.members?.find(m => m.userId === share?.creatorId)?.name ?? 'Host')}
                </li>
                {share?.price && <li><strong>Cost:</strong> ${share.price} / hr</li>}
                {share?.certificates && share.certificates.length > 0 && <li><strong>Certificate:</strong> {share.certificates.join(', ')}</li>}
              </ul>

              <hr className="my-4 border-gray-200" />

              {/* Replace the heavy inline "current group" list here with a concise summary
                  so we don't render the full members list twice. The full list is shown below. */}
              <div>
                <h3 className="text-sm font-semibold text-neutral-700 mb-3">Current Group</h3>
                <div className="text-sm text-neutral-600">
                  {(share?.members || []).length} {(share?.members || []).length === 1 ? 'member' : 'members'} joined
                </div>
              </div>
            </div>
          </div>

          {/* Requests */}
          <div className="mt-6">
            <h3 className="text-2xl font-bold mb-4">Requests to Join:</h3>
            <div className="space-y-3">
              {joinRequests.length === 0 ? (
                <p className="text-sm text-gray-600">No requests yet.</p>
              ) : (
                joinRequests.map((r) => (
                  <MemberCard
                    key={r.id}
                    id={r.id}
                    name={r.name}
                    avatarUrl={r.avatarUrl ?? null}
                    variant="request"
                    onAccept={async (memberId) => {
                      handleAccept(memberId);
                    }}
                    onReject={async (memberId) => {
                      handleReject(memberId);
                    }}
                    onSeeMore={(memberId) => {
                      router.push(`/nanny/user/${memberId}`);
                    }}
                  />
                ))
              )}
            </div>
          </div>

          {/* Current Group (full list; single source of truth) */}
          <div className="mt-8">
            <h3 className="text-2xl font-bold mb-4">Current Group:</h3>
            <div className="space-y-4">
              {(share?.members || []).map((m: any, idx: number) => {
                const memberId = m?.userId ?? `member_${idx}`;
                // show joinedAt as the small subtitle (reuse kidAges prop for compact date)
                const joinedLabel = m?.joinedAt ? new Date(m.joinedAt).toLocaleDateString() : undefined;
                return (
                  <MemberCard
                    key={String(memberId)}
                    id={String(memberId)}
                    name={m?.name ?? 'Member'}
                    avatarUrl={m?.avatarUrl ?? null}
                    kidsCount={m?.kidsCount ?? 1}
                    kidAges={joinedLabel}
                    variant="group"
                    onSeeMore={(memberId) => {
                      router.push(`/nanny/user/${memberId}`);
                    }}
                  />
                );
              })}
            </div>
          </div>

          {!isCreator && (
            <div className="mt-6 flex gap-4">
              <button onClick={handleMessageHost} className="flex-1 inline-flex items-center justify-center gap-3 border border-primary text-primary px-4 py-3 rounded-full font-semibold">
                <span>Message the host</span>
              </button>

              <button onClick={handleRequestToJoin} className="flex-1 bg-primary text-white px-4 py-3 rounded-full font-semibold">Request to join</button>
            </div>
          )}

          <div className="mt-6 text-sm text-neutral-400">
            <em>Pending requests & approvals will appear above. (Server integration point)</em>
          </div>

          <div style={{ height: 40 }} />
        </>
      )}
    </NannyLayout>
  );
}