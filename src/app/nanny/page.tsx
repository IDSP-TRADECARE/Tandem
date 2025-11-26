'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { BottomNav } from '@/app/components/Layout/BottomNav';
import { GradientBackgroundFull } from '../components/ui/backgrounds/GradientBackgroundFull';
import { HalfBackground } from '@/app/components/ui/backgrounds/HalfBackground';
import { PageHeader } from '@/app/components/ui/nanny/PageHeader';
import { TabBar } from '@/app/components/ui/backgrounds/TabBar';
import { ShareRequestCard } from '@/app/components/ui/nanny/cards/ShareRequestCard';
import type { NannyShare } from '@/db/schema';

export default function NannySharePage() {
  const [activeTab, setActiveTab] = useState('My Requests');
  const [myShares, setMyShares] = useState<NannyShare[]>([]);
  const [availableShares, setAvailableShares] = useState<NannyShare[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchMyShares = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/nanny/my-shares');
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data?.error || 'Failed to fetch my shares');
      }
      const data = await res.json();
      setMyShares(data.shares || []);
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : 'Error loading shares');
      setMyShares([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchAvailable = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/nanny/join');
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data?.error || 'Failed to fetch available shares');
      }
      const data = await res.json();
      setAvailableShares(data.shares || []);
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : 'Error loading shares');
      setAvailableShares([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (activeTab === 'My Requests') fetchMyShares();
    else fetchAvailable();
  }, [activeTab, fetchMyShares, fetchAvailable]);

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

  const shares = activeTab === 'My Requests' ? myShares : availableShares;

  // Define tabs
  const tabs = ['My Requests', 'Available'];

  return (
    <GradientBackgroundFull>
      <div className="pt-8">
        <PageHeader title="Nanny Sharing" />
      </div>

      <HalfBackground>
        <TabBar 
          tabs={tabs} 
          activeTab={activeTab} 
          onTabChange={setActiveTab} 
        />

        <div className="p-4 space-y-4 overflow-y-auto pb-32" style={{ height: 'calc(85.7vh - 120px)' }}>
          {/* Error State */}
          {error && (
            <div className="bg-error/10 border border-error/30 rounded-2xl p-4">
              <p className="text-error text-sm">{error}</p>
            </div>
          )}

          {/* Loading State */}
          {isLoading && (
            <div className="text-center py-16">
              <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-neutral-300">Loading...</p>
            </div>
          )}

          {/* Empty State - My Requests */}
          {!isLoading && activeTab === 'My Requests' && shares.length === 0 && (
            <div className="text-center py-16">
              <div className="mb-6">
                <svg className="w-32 h-32 mx-auto text-primary opacity-50" viewBox="0 0 200 200" fill="none">
                  <circle cx="70" cy="70" r="30" fill="currentColor" opacity="0.3"/>
                  <circle cx="130" cy="70" r="30" fill="currentColor" opacity="0.3"/>
                  <path d="M50 120 Q100 150 150 120" stroke="currentColor" strokeWidth="8" strokeLinecap="round" opacity="0.3"/>
                </svg>
              </div>
              <h3 className="text-xl font-bold text-neutral-900 mb-2">No nanny sharing yet</h3>
              <p className="text-neutral-300 mb-6">Create your first share to get started</p>
              <Link
                href="/nanny/create"
                className="inline-block px-8 py-3 bg-secondary hover:bg-secondary-hover text-neutral-900 rounded-full font-semibold shadow-lg hover:shadow-xl transition-all"
              >
                Book nanny
              </Link>
            </div>
          )}

          {/* Empty State - Available */}
          {!isLoading && activeTab === 'Available' && shares.length === 0 && (
            <div className="text-center py-16">
              <div className="text-6xl mb-4">📅</div>
              <h3 className="text-xl font-bold text-neutral-900 mb-2">No shares available</h3>
              <p className="text-neutral-300 mb-6">No shares found</p>
              <Link
                href="/nanny/create"
                className="inline-block px-8 py-3 bg-primary hover:bg-primary-hover text-white rounded-full font-semibold shadow-lg hover:shadow-xl transition-all"
              >
                Create a Share
              </Link>
            </div>
          )}

          {/* My Requests List */}
          {!isLoading && activeTab === 'My Requests' && shares.length > 0 && (
            <div className="space-y-4">
              {shares.map((share) => (
                <Link key={share.id} href={`/nanny/${share.id}`}>
                  <ShareRequestCard
                    date={formatDate(share.date)}
                    time={`${formatTime(share.startTime)}-${formatTime(share.endTime)}`}
                    nannyName={share.members[0]?.name || 'You'}
                    availableSpots={share.maxSpots ? share.maxSpots - share.members.length : 0}
                    hasActivity={share.members.length > 0}
                  />
                </Link>
              ))}
            </div>
          )}

          {/* Available List */}
          {!isLoading && activeTab === 'Available' && shares.length > 0 && (
            <div className="space-y-4">
              {shares.map((share) => {
                const availableSpots = share.maxSpots ? share.maxSpots - share.members.length : 0;

                return (
                  <Link key={share.id} href={`/nanny/join/${share.id}`}>
                    <ShareRequestCard
                      date={formatDate(share.date)}
                      time={`${formatTime(share.startTime)}-${formatTime(share.endTime)}`}
                      nannyName={share.members[0]?.name || 'Anonymous'}
                      availableSpots={availableSpots}
                      hasActivity={true}
                    />
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </HalfBackground>

      <BottomNav />
    </GradientBackgroundFull>
  );
}