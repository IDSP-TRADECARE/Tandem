// File: src/app/components/ui/nanny/NannyLayout.tsx
'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useUser } from '@clerk/nextjs';
import { FiMessageCircle } from 'react-icons/fi';
import { GradientBackgroundFull } from '@/app/components/ui/backgrounds/GradientBackgroundFull';
import { HalfBackground } from '@/app/components/ui/backgrounds/HalfBackground';
import { TabBar } from '@/app/components/ui/backgrounds/TabBar';
import { BottomNav } from '@/app/components/Layout/BottomNav';
import type { NannyShare } from '@/db/schema';

type Provided = {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  myShares: NannyShare[];
  availableShares: NannyShare[];
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
};

type Props = {
  initialTab?: string;
  children: React.ReactNode | ((props: Provided) => React.ReactNode);
  className?: string;
};

const DEFAULT_TABS = ['My requests', 'Available'];

export function NannyLayout({ initialTab, children, className = '' }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isSignedIn } = useUser();
  const qpTab = searchParams?.get('tab') ?? undefined;
  const [activeTab, setActiveTab] = useState<string>(initialTab ?? qpTab ?? DEFAULT_TABS[0]);
  const [myShares, setMyShares] = useState<NannyShare[]>([]);
  const [availableShares, setAvailableShares] = useState<NannyShare[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchMyShares = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/nanny/my-shares');
      if (!res.ok) {
        const d = await res.json().catch(() => ({}));
        throw new Error(d?.error ?? 'Failed to load my shares');
      }
      const data = await res.json();
      setMyShares(data.shares ?? []);
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchAvailable = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/nanny/join');
      if (!res.ok) {
        const d = await res.json().catch(() => ({}));
        throw new Error(d?.error ?? 'Failed to load available shares');
      }
      const data = await res.json();
      setAvailableShares(data.shares ?? []);
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  }, []);

  const refresh = useCallback(async () => {
    if (activeTab === 'My requests') await fetchMyShares();
    else await fetchAvailable();
  }, [activeTab, fetchMyShares, fetchAvailable]);

  useEffect(() => {
    refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab]);

  useEffect(() => {
    if (qpTab && qpTab !== activeTab) setActiveTab(qpTab);
  }, [qpTab, activeTab]);

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    // keep linkable
    router.push(`/nanny?tab=${encodeURIComponent(tab)}`);
  };

  const provided: Provided = {
    activeTab,
    setActiveTab: handleTabChange,
    myShares,
    availableShares,
    loading,
    error,
    refresh,
  };

  // Height calc: top header (approx 120px) + tabbar (approx 64px) + bottom nav (approx 88px) = ~272
  // Content height = viewport - chrome. Tweak the -260px if your chrome heights differ.
  const contentHeight = 'calc(100vh - 260px)';
  // Additional padding at bottom so items don't hide under BottomNav
  const contentBottomPadding = 120;

  const goToMessages = () => {
    // navigate to a messaging center; change to your route if different
    router.push('/messages');
  };

  return (
    <GradientBackgroundFull>
      {/* Static header sits above HalfBackground so it doesn't scroll */}
      <div className="px-6 pt-6 max-w-3xl mx-auto flex items-center justify-between">
        <h1 className="text-2xl font-extrabold text-white">Nanny Sharing</h1>
        <button
          onClick={goToMessages}
          aria-label="Messages"
          className="bg-white/10 hover:bg-white/20 p-2 rounded-full text-white"
        >
          <FiMessageCircle size={20} />
        </button>
      </div>

      <HalfBackground>
        {/* TabBar under the header, not fixed, matches original TabBar styling */}
        <div className={`px-4 pt-2 ${className}`}>
          <TabBar tabs={DEFAULT_TABS} activeTab={activeTab} onTabChange={handleTabChange} />
        </div>

        {/* Scrollable content area (only this scrolls) */}
        <div
          className="px-6 pb-4 max-w-3xl mx-auto overflow-y-auto"
          style={{ height: contentHeight, paddingBottom: contentBottomPadding }}
        >
          {typeof children === 'function' ? children(provided) : children}
        </div>

        {/* BottomNav visually lives inside HalfBackground */}
        <div className="px-6 pb-6">
          <BottomNav />
        </div>
      </HalfBackground>
    </GradientBackgroundFull>
  );
}

export default NannyLayout;