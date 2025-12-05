/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@clerk/nextjs';
import NannyLayout from '@/app/components/ui/nanny/NannyLayout';
import GroupMemberCard from '@/app/components/ui/nanny/cards/GroupMemberCard';
import RequestMemberCard from '@/app/components/ui/nanny/cards/RequestMemberCard';
import { useSocket } from '@/lib/socket/SocketContext';

type JoinRequest = {
  id: string;
  userId?: string;
  name: string;
  kidsCount: number;
  note?: string;
  createdAt: string;
  avatarUrl?: string | null;
};

export default function NannyShareDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { user, isSignedIn } = useUser();
  const { socket } = useSocket() ?? { socket: null };

  const [shareId, setShareId] = useState<string | null>(null);
  const [share, setShare] = useState<any | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [joinRequests, setJoinRequests] = useState<JoinRequest[]>([]);
  const [hasRequested, setHasRequested] = useState(false);

  useEffect(() => {
    params.then(({ id }) => setShareId(id));
  }, [params]);

  const fetchProfilesForMembers = useCallback(async (members: any[]) => {
    if (!members || members.length === 0) return;
    const toFetch = members
      .filter((m) => m?.userId && !m.userId.startsWith('pending_'));

    if (toFetch.length === 0) return;

    try {
      const results = await Promise.all(
        toFetch.map(async (m) => {
          try {
            // Fetch Clerk user data (name and profile picture)
            const userRes = await fetch(`/api/users/${encodeURIComponent(m.userId)}`);
            if (!userRes.ok) return null;
            const userData = await userRes.json();

            // Fetch all nanny shares to get member info (like /nanny/user/[userId] does)
            const sharesRes = await fetch('/api/nanny');
            let kidsCount = m.kidsCount || 1; // default
            
            if (sharesRes.ok) {
              const sharesData = await sharesRes.json();
              const shares = sharesData.shares || [];
              
              // Find shares where this user is a member
              const userShares = shares.filter((share: any) => 
                share.members?.some((member: any) => member.userId === m.userId)
              );
              
              // Get member info from any share they're in
              for (const share of userShares) {
                const member = share.members?.find((mem: any) => mem.userId === m.userId);
                if (member?.kidsCount) {
                  kidsCount = member.kidsCount;
                  break;
                }
              }
            }

            return { 
              userId: m.userId, 
              profilePicture: userData.profilePicture ?? userData.profile_picture ?? null,
              name: userData.name || `${userData.firstName || ''} ${userData.lastName || ''}`.trim() || m.name,
              kidsCount,
            };
          } catch {
            return null;
          }
        })
      );

      setShare((prev: { members: any[] }) => {
        if (!prev) return prev;
        const updatedMembers = prev.members.map((mem: any) => {
          const found = results.find((r) => r && r.userId === mem.userId);
          if (found) {
            return { 
              ...mem, 
              avatarUrl: found.profilePicture,
              name: found.name,
              kidsCount: found.kidsCount,
            };
          }
          return mem;
        });
        return { ...prev, members: updatedMembers };
      });
    } catch (err) {
      console.error('Error fetching profiles:', err);
    }
  }, []);

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
      setJoinRequests(Array.isArray(data.share?.requests) ? data.share.requests : []);

      const members = data.share?.members ?? [];
      if (members.length > 0) fetchProfilesForMembers(members);
    } catch (err) {
      console.error('Fetch error:', err);
      setError(err instanceof Error ? err.message : 'Failed to load');
    } finally {
      setLoading(false);
    }
  }, [fetchProfilesForMembers]);

  useEffect(() => {
    if (shareId) fetchShare(shareId);
  }, [shareId, fetchShare]);

  const isCreator = useMemo(() => 
    Boolean(share && isSignedIn && share.creatorId === user?.id),
    [share, isSignedIn, user]
  );

  const isMember = useMemo(() =>
    Boolean(share && (share.members || []).some((m: any) => String(m?.userId) === String(user?.id))),
    [share, user]
  );

  useEffect(() => {
    if (!socket || !shareId) return;

    const onNannyRequest = (payload: any) => {
      if (!payload || payload.shareId !== shareId || !isCreator) return;
      const req = payload.request;
      setJoinRequests((prev) => {
        if (prev.find((r) => r.id === req.id)) return prev;
        return [...prev, req];
      });
    };

    const onShareUpdated = (updated: any) => {
      if (updated?.id && String(updated.id) === String(shareId)) {
        fetchShare(shareId);
      }
    };

    (socket as any).on('nanny:request', onNannyRequest);
    socket.on('share-updated', onShareUpdated);

    return () => {
      (socket as any).off('nanny:request', onNannyRequest);
      socket.off('share-updated', onShareUpdated);
    };
  }, [socket, shareId, isCreator, fetchShare]);

  useEffect(() => {
    if (!socket || !shareId) return;
    (socket as any).emit('join-share', shareId);
    return () => (socket as any).emit('leave-share', shareId);
  }, [socket, shareId]);

  const handleAccept = async (requestId: string) => {
    if (!shareId) return;
    const req = joinRequests.find((r) => r.id === requestId);
    if (!req) return;

    setJoinRequests((prev) => prev.filter((r) => r.id !== requestId));

    try {
      // Manually add the member to the database
      const res = await fetch(`/api/nanny/${shareId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          userName: req.name, 
          kidsCount: req.kidsCount,
          userId: req.userId // Pass the userId so it can be added directly
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setJoinRequests((prev) => [req, ...prev]);
        throw new Error(data?.error ?? 'Failed to accept request');
      }

      await fetchShare(shareId);
      (socket as any)?.emit('nanny:request-accepted', { shareId, userId: req.userId ?? null, requestId });
    } catch (err) {
      console.error('Accept failed:', err);
      alert(err instanceof Error ? err.message : 'Failed to accept request');
    }
  };

  const handleReject = async (requestId: string) => {
    setJoinRequests((prev) => prev.filter((r) => r.id !== requestId));
    (socket as any)?.emit('nanny:request-rejected', { shareId, requestId });
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

    const userName = `${user?.firstName ?? ''} ${user?.lastName ?? ''}`.trim() || user?.username || 'Anonymous';
    const requestPayload: JoinRequest = {
      id: `req_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
      userId: user?.id,
      name: userName,
      kidsCount,
      createdAt: new Date().toISOString(),
      avatarUrl: (user as any)?.profilePicture ?? null,
    };

    if (socket && shareId) {
      socket.emit('nanny:request', { shareId, request: requestPayload });
      setHasRequested(true);
      alert('Request sent to the host. They will accept or reject it shortly.');
    }
  };

  const handleMessageHost = () => {
    if (!shareId) return;
    if (!isSignedIn) {
      window.location.href = '/sign-in';
      return;
    }
    router.push(`/messages/group/${shareId}`);
  };

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
                  <strong>Host:</strong> {share?.creatorId === user?.id ? 'You' : (share?.members?.find((m: any) => m.userId === share?.creatorId)?.name ?? 'Host')}
                </li>
                {share?.price && <li><strong>Cost:</strong> ${share.price} / hr</li>}
                {share?.certificates && share.certificates.length > 0 && <li><strong>Certificate:</strong> {share.certificates.join(', ')}</li>}
              </ul>

              <hr className="my-4 border-gray-200" />

              <div>
                <h3 className="text-sm font-semibold text-neutral-700 mb-3">Current Group:</h3>
                <div className="space-y-3">
                  {(share?.members || []).map((m: any, idx: number) => (
                    <GroupMemberCard
                      key={m?.userId ?? `member_${idx}`}
                      id={String(m?.userId ?? `member_${idx}`)}
                      name={m?.name ?? 'Member'}
                      avatarUrl={m?.avatarUrl ?? '/profile/placeholderAvatar.png'}
                      kidsCount={m?.kidsCount ?? 1}
                      onSeeMore={(memberId) => router.push(`/nanny/user/${memberId}`)}
                      compact={false}
                    />
                  ))}
                </div>

                {(isCreator || isMember) && (
                  <div className="mt-4">
                    <button
                      onClick={() => router.push(`/messages/group/${shareId}`)}
                      className="w-full py-3 bg-[#1e3a5f] text-white rounded-full font-semibold"
                    >
                      Chat
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {isCreator && (
            <div className="mt-6">
              <h3 className="text-2xl font-bold mb-4">Requests to Join:</h3>
              <div className="space-y-3">
                {joinRequests.length === 0 ? (
                  <p className="text-sm text-gray-600">No requests yet.</p>
                ) : (
                  joinRequests.map((r) => (
                    <RequestMemberCard
                      key={r.id}
                      id={r.id}
                      name={r.name}
                      avatarUrl={r.avatarUrl ?? '/profile/placeholderAvatar.png'}
                      kidsCount={r.kidsCount}
                      note={r.note}
                      createdAt={r.createdAt}
                      onAccept={handleAccept}
                      onReject={handleReject}
                      onSeeMore={(memberId) => router.push(`/nanny/user/${memberId}`)}
                    />
                  ))
                )}
              </div>
            </div>
          )}

          {!isCreator && (
            <div className="mt-6 flex gap-4">
              <button onClick={handleMessageHost} className="flex-1 inline-flex items-center justify-center gap-3 border border-primary text-primary px-4 py-3 rounded-full font-semibold">
                <span>Message the host</span>
              </button>

              <button
                onClick={handleRequestToJoin}
                disabled={hasRequested}
                className={`flex-1 ${hasRequested ? 'bg-gray-300 text-gray-700 cursor-not-allowed' : 'bg-primary text-white'} px-4 py-3 rounded-full font-semibold`}
              >
                {hasRequested ? 'Requested' : 'Request to join'}
              </button>
            </div>
          )}

          <div style={{ height: 40 }} />
        </>
      )}
    </NannyLayout>
  );
}