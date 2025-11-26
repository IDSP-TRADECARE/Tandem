/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@clerk/nextjs';
import NannyLayout from '@/app/components/ui/nanny/NannyLayout';
import GroupMemberCard from '@/app/components/ui/nanny/cards/GroupMemberCard';
import RequestMemberCard from '@/app/components/ui/nanny/cards/RequestMemberCard';
import { useSocket } from '@/lib/socket/SocketContext'; // adjust if your hook name/path differs

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

  // helper: fetch public profile rows for members that lack avatarUrl
  const fetchProfilesForMembers = useCallback(async (members: any[]) => {
    if (!members || members.length === 0) return;
    const toFetch = members
      .map((m, idx) => ({ m, idx }))
      .filter(({ m }) => {
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
            console.log(err);
            return null;
          }
        })
      );

      setShare((prev: { members: any[]; }) => {
        if (!prev) return prev;
        const updatedMembers = prev.members.map((mem: any) => {
          const found = results.find((r) => r && r.userId === (mem as any).userId);
          if (found && found.profilePicture) {
            return { ...mem, avatarUrl: found.profilePicture };
          }
          return mem;
        });
        return { ...prev, members: updatedMembers };
      });
    } catch (err) {
      console.error('fetchProfilesForMembers error', err);
    }
  }, []);

  // Fetch share from API (uses real data)
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

      // use real requests from API (no mock seeding)
      setJoinRequests(Array.isArray(data.share?.requests) ? data.share.requests : []);

      // fetch avatars for members if needed
      const members = data.share?.members ?? [];
      if (members && members.length > 0) {
        // kick off fetch for profile pictures
        fetchProfilesForMembers(members);
      }
    } catch (err) {
      console.error('Fetch share error', err);
      setError(err instanceof Error ? err.message : 'Failed to load');
    } finally {
      setLoading(false);
    }
  }, [fetchProfilesForMembers]);

  useEffect(() => {
    if (!shareId) return;
    fetchShare(shareId);
  }, [shareId, fetchShare]);

  // computed helpers
  const isCreator = useMemo(() => Boolean(share && isSignedIn && share.creatorId === (user as any)?.id), [share, isSignedIn, user]);
  const isMember = useMemo(() => Boolean(share && (share.members || []).some((m: any) => String(m?.userId) === String((user as any)?.id))), [share, user]);

  // socket listeners: host sees incoming requests; everyone listens for share-updated
  useEffect(() => {
    if (!socket || !shareId) return;

    const onNannyRequest = (payload: any) => {
      // payload expected: { shareId, request: { id, userId, name, kidsCount, createdAt, avatarUrl } }
      if (!payload || payload.shareId !== shareId) return;
      const req = payload.request;
      // only host should see incoming requests in their UI
      if (isCreator) {
        setJoinRequests((prev) => {
          // avoid duplicates
          if (prev.find((r) => r.id === req.id)) return prev;
          return [...prev, req];
        });
      }
    };

    const onShareUpdated = (updated: any) => {
      if (!updated || !updated.id) return;
      if (String(updated.id) === String(shareId)) {
        // re-fetch to get authoritative data
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

  // Join the share room so we receive room-targeted events (requests, share-updated, etc.)
  useEffect(() => {
    if (!socket || !shareId) return;
    (socket as any).emit('join-share', shareId);
    // optional: log for debugging
    console.log('socket emitting join-share', shareId);

    return () => {
      (socket as any).emit('leave-share', shareId);
      console.log('socket emitting leave-share', shareId);
    };
  }, [socket, shareId]);

  // Accept/reject handlers (host-only). Accept calls the join endpoint for the user (server must support host-accept)
  const handleAccept = async (requestId: string) => {
    if (!shareId) return;
    const req = joinRequests.find((r) => r.id === requestId);
    if (!req) return;

    // optimistic removal of request from local UI
    setJoinRequests((prev) => prev.filter((r) => r.id !== requestId));

    try {
      // Attempt to add the requester as a member by calling the join endpoint.
      // We're including userId so server can identify the user being added (server must accept this from host).
      const body: any = { userName: req.name, kidsCount: req.kidsCount };
      if (req.userId) body.userId = req.userId;

      const res = await fetch(`/api/nanny/${shareId}/join`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        // failure: restore request and inform
        setJoinRequests((prev) => [req, ...prev]);
        throw new Error(data?.error ?? 'Failed to accept request');
      }

      // success: refetch share (server should also emit 'share-updated')
      await fetchShare(shareId);
      // notify via socket that request accepted (optional)
      (socket as any)?.emit('nanny:request-accepted', { shareId, userId: req.userId ?? null, requestId });
    } catch (err) {
      console.error('Accept failed', err);
      alert(err instanceof Error ? err.message : 'Failed to accept request');
    }
  };

  const handleReject = async (requestId: string) => {
    // optimistic removal from UI only; server endpoint for rejecting could be added later
    setJoinRequests((prev) => prev.filter((r) => r.id !== requestId));
    // optionally notify host or requester via socket here
    (socket as any)?.emit('nanny:request-rejected', { shareId, requestId });
  };

  // Request-to-join flow for non-hosts: emit socket event so host sees it
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

    const userName = `${(user as any)?.firstName ?? ''} ${(user as any)?.lastName ?? ''}`.trim() || (user as any)?.username || 'Anonymous';
    const requestPayload: JoinRequest = {
      id: `req_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
      userId: (user as any)?.id,
      name: userName,
      kidsCount,
      createdAt: new Date().toISOString(),
      avatarUrl: (user as any)?.profilePicture ?? null,
    };

    try {
      // emit a socket event to notify the host in realtime
      (socket as any)?.emit('nanny:request', { shareId, request: requestPayload });

      // mark local requester state so the UI reflects "requested"
      setHasRequested(true);

      // Optionally, if you have a server endpoint for durable requests you could POST here:
      // await fetch(`/api/nanny/${shareId}/request`, { method: 'POST', body: JSON.stringify(requestPayload), headers:{ 'Content-Type': 'application/json' } });

      // notify the user
      alert('Request sent to the host. They will accept or reject it shortly.');
    } catch (err) {
      console.error('Request to join failed', err);
      alert('Failed to send request.');
    }
  };

  // message host or go to chat
  const handleMessageHost = () => {
    if (!shareId) return;
    if (!isSignedIn) {
      window.location.href = '/sign-in';
      return;
    }
    router.push(`/nanny/${shareId}/chat`);
  };

  const dateLabel = share?.date ? new Date(share.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '';

  return (
    <NannyLayout>
      {() => (
        <>
          {/* top white card with full members list inside */}
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden mt-4">
            <div className="p-6">
              <h2 className="text-2xl font-extrabold tracking-tight mb-2">{dateLabel} · {share?.startTime} - {share?.endTime}</h2>

              <ul className="mt-2 list-disc list-inside text-sm text-neutral-600 space-y-1">
                <li><strong>Location:</strong> {share?.location || 'TBD'}</li>
                <li><strong>Nanny Name:</strong> {share?.members?.[0]?.name ?? 'Beau'}</li>
                <li>
                  <strong>Host:</strong> {share?.creatorId === (user as any)?.id ? 'You' : (share?.members?.find((m: any) => m.userId === share?.creatorId)?.name ?? 'Host')}
                </li>
                {share?.price && <li><strong>Cost:</strong> ${share.price} / hr</li>}
                {share?.certificates && share.certificates.length > 0 && <li><strong>Certificate:</strong> {share.certificates.join(', ')}</li>}
              </ul>

              <hr className="my-4 border-gray-200" />

              {/* Current Group */}
              <div>
                <h3 className="text-sm font-semibold text-neutral-700 mb-3">Current Group:</h3>
                <div className="space-y-3">
                  {(share?.members || []).map((m: any, idx: number) => {
                    const memberId = m?.userId ?? `member_${idx}`;
                    return (
                      <GroupMemberCard
                        key={String(memberId)}
                        id={String(memberId)}
                        name={m?.name ?? 'Member'}
                        avatarUrl={m?.avatarUrl ?? '/profile/placeholderAvatar.png'}
                        kidsCount={m?.kidsCount ?? 1}
                        onSeeMore={(memberId) => router.push(`/nanny/user/${memberId}`)}
                        compact={false}
                      />
                    );
                  })}
                </div>

                {/* Chat button below the group - visible to host or accepted members */}
                {(isCreator || isMember) && (
                  <div className="mt-4">
                    <button
                      onClick={() => router.push(`/nanny/${shareId}/chat`)}
                      className="w-full py-3 bg-[#1e3a5f] text-white rounded-full font-semibold"
                    >
                      Chat
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Requests - only visible to the host */}
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
                      onAccept={(memberId) => handleAccept(memberId)}
                      onReject={(memberId) => handleReject(memberId)}
                      onSeeMore={(memberId) => router.push(`/nanny/user/${memberId}`)}
                    />
                  ))
                )}
              </div>
            </div>
          )}

          {/* Non-host actions: message host + request to join */}
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

          <div className="mt-6 text-sm text-neutral-400">
            <em>Pending requests & approvals will appear above. (Server integration point)</em>
          </div>

          <div style={{ height: 40 }} />
        </>
      )}
    </NannyLayout>
  );
}