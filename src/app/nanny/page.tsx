'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { BottomNav } from '@/app/components/Layout/BottomNav';
import type { NannyShare } from '@/db/schema';

type TabType = 'requests' | 'available';

export default function NannySharePage() {
  const [activeTab, setActiveTab] = useState<TabType>('requests');
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
    if (activeTab === 'requests') fetchMyShares();
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

  const shares = activeTab === 'requests' ? myShares : availableShares;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#4A90E2] via-[#5FA3E8] to-[#7BC8E2] pb-32">
      <div className="px-6 pt-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-white">Nanny Sharing</h1>
          <button className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
            </svg>
          </button>
        </div>

        {/* Tabs */}
        <div className="bg-white/90 backdrop-blur-sm rounded-t-3xl shadow-lg">
          <div className="flex border-b border-gray-200">
            <button
              onClick={() => setActiveTab('requests')}
              className={`flex-1 py-4 text-center font-semibold transition-colors relative ${
                activeTab === 'requests' ? 'text-[#4A90E2]' : 'text-gray-500'
              }`}
            >
              Requests
              {activeTab === 'requests' && (
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-[#4A90E2] to-[#7BC8E2] rounded-full" />
              )}
            </button>
            <button
              onClick={() => setActiveTab('available')}
              className={`flex-1 py-4 text-center font-semibold transition-colors relative ${
                activeTab === 'available' ? 'text-[#4A90E2]' : 'text-gray-500'
              }`}
            >
              Available
              {activeTab === 'available' && (
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-[#4A90E2] to-[#7BC8E2] rounded-full" />
              )}
            </button>
          </div>

          {/* Content */}
          <div className="p-6 min-h-[60vh] bg-white rounded-b-3xl">
            {/* Error State */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                <p className="text-red-600 text-sm">{error}</p>
              </div>
            )}

            {/* Loading State */}
            {isLoading && (
              <div className="text-center py-16">
                <div className="w-12 h-12 border-4 border-[#4A90E2] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-gray-600">Loading...</p>
              </div>
            )}

            {/* Empty State - Requests */}
            {!isLoading && activeTab === 'requests' && shares.length === 0 && (
              <div className="text-center py-16">
                <div className="mb-6">
                  <svg className="w-32 h-32 mx-auto text-[#4A90E2] opacity-50" viewBox="0 0 200 200" fill="none">
                    <circle cx="70" cy="70" r="30" fill="currentColor" opacity="0.3"/>
                    <circle cx="130" cy="70" r="30" fill="currentColor" opacity="0.3"/>
                    <path d="M50 120 Q100 150 150 120" stroke="currentColor" strokeWidth="8" strokeLinecap="round" opacity="0.3"/>
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">No nanny sharing yet</h3>
                <p className="text-gray-600 mb-6">Create your first share to get started</p>
                <Link
                  href="/nanny/create"
                  className="inline-block px-8 py-3 bg-gradient-to-r from-[#7BC8A0] to-[#6AB88F] text-white rounded-full font-semibold shadow-lg hover:shadow-xl transition-all"
                >
                  Book nanny
                </Link>
              </div>
            )}

            {/* Empty State - Available */}
            {!isLoading && activeTab === 'available' && shares.length === 0 && (
              <div className="text-center py-16">
                <div className="text-6xl mb-4">📅</div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">No shares available</h3>
                <p className="text-gray-600 mb-6">No shares found</p>
                <Link
                  href="/nanny/create"
                  className="inline-block px-8 py-3 bg-gradient-to-r from-[#4A90E2] to-[#7BC8E2] text-white rounded-full font-semibold shadow-lg hover:shadow-xl transition-all"
                >
                  Create a Share
                </Link>
              </div>
            )}

            {/* Requests List */}
            {!isLoading && activeTab === 'requests' && shares.length > 0 && (
              <div className="space-y-4">
                {shares.map((share) => (
                  <Link
                    key={share.id}
                    href={`/nanny/${share.id}`}
                    className="block bg-white rounded-2xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-bold flex-shrink-0 overflow-hidden">
                        <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                        </svg>
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h3 className="font-bold text-gray-900 text-lg">
                              {formatDate(share.date)} {formatTime(share.startTime)}-{formatTime(share.endTime)}
                            </h3>
                            <p className="text-sm text-[#4A90E2] font-medium">
                              Nanny: {share.members[0]?.name || 'You'}
                            </p>
                          </div>
                          <svg className="w-6 h-6 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </div>

                        <div className="flex items-center gap-2">
                          <span className="px-3 py-1 bg-gradient-to-r from-[#7BC8A0] to-[#6AB88F] text-white rounded-full text-xs font-semibold">
                            Available spots: {share.maxSpots ? share.maxSpots - share.members.length : '∞'}
                          </span>
                          {share.members.length > 0 && (
                            <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                          )}
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}

            {/* Available List */}
            {!isLoading && activeTab === 'available' && shares.length > 0 && (
              <div className="space-y-4">
                {shares.map((share) => {
                  const availableSpots = share.maxSpots ? share.maxSpots - share.members.length : null;

                  return (
                    <Link
                      key={share.id}
                      href={`/nanny/join/${share.id}`}
                      className="block bg-white rounded-2xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-start gap-4">
                        <div className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-bold flex-shrink-0 overflow-hidden">
                          <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                          </svg>
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <h3 className="font-bold text-gray-900 text-lg">
                                {formatDate(share.date)} {formatTime(share.startTime)}-{formatTime(share.endTime)}
                              </h3>
                              <p className="text-sm text-[#4A90E2] font-medium">
                                Nanny: {share.members[0]?.name || 'Anonymous'}
                              </p>
                            </div>
                            <svg className="w-6 h-6 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                          </div>

                          <div className="flex items-center gap-2">
                            <span className="px-3 py-1 bg-gradient-to-r from-[#7BC8A0] to-[#6AB88F] text-white rounded-full text-xs font-semibold">
                              Available spots: {availableSpots ?? '∞'}
                            </span>
                            <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}