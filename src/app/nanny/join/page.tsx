'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { BottomNav } from '@/app/components/Layout/BottomNav';
import type { NannyShare } from '@/db/schema';

export default function JoinNannySharePage() {
  const router = useRouter();
  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  );
  const [shares, setShares] = useState<NannyShare[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAvailableShares = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/nanny/join?date=${selectedDate}`);
      
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to fetch shares');
      }

      const data = await response.json();
      setShares(data.shares);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  }, [selectedDate]);

  useEffect(() => {
    fetchAvailableShares();
  }, [fetchAvailableShares]);

  const getAvailableSpots = (share: NannyShare) => {
    if (!share.maxSpots) return null;
    return share.maxSpots - share.members.length;
  };

  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 pb-32">
      <div className="px-6 pt-8 max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-[#1e3a5f] hover:text-[#152d47] mb-4"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back
          </button>
          <h1 className="text-3xl font-bold text-[#0a1628]">Join Nanny Share</h1>
          <p className="text-gray-600 mt-2">Find and join available nanny shares in your area</p>
        </div>

        {/* Date Picker */}
        <div className="bg-white rounded-xl p-6 shadow-sm mb-6">
          <label htmlFor="date" className="block text-sm font-semibold text-gray-700 mb-3">
            Select Date
          </label>
          <div className="flex gap-3">
            <input
              type="date"
              id="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              min={new Date().toISOString().split('T')[0]}
              className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[#1e3a5f] focus:outline-none text-lg"
            />
            <button
              onClick={fetchAvailableShares}
              className="px-6 py-3 bg-[#1e3a5f] text-white rounded-lg font-semibold hover:bg-[#152d47] transition-colors"
            >
              Search
            </button>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            Showing shares for {new Date(selectedDate).toLocaleDateString('en-US', { 
              weekday: 'long',
              month: 'long', 
              day: 'numeric',
              year: 'numeric'
            })}
          </p>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="text-center py-12">
            <div className="w-16 h-16 border-4 border-[#1e3a5f] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Loading available shares...</p>
          </div>
        )}

        {/* Error State */}
        {error && !isLoading && (
          <div className="bg-red-50 border-2 border-red-200 rounded-xl p-6 text-center">
            <div className="text-4xl mb-3">⚠️</div>
            <p className="text-red-700 font-medium">{error}</p>
            <button
              onClick={fetchAvailableShares}
              className="mt-4 px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Shares List */}
        {!isLoading && !error && (
          <>
            {shares.length === 0 ? (
              <div className="text-center py-16">
                <div className="text-6xl mb-4">📅</div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">No Shares Available</h3>
                <p className="text-gray-600 mb-6">
                  There are no available nanny shares for this date.
                </p>
                <Link
                  href="/nanny/create"
                  className="inline-block px-6 py-3 bg-[#1e3a5f] text-white rounded-lg font-semibold hover:bg-[#152d47] transition-colors"
                >
                  Create a Share
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-gray-900">
                    {shares.length} {shares.length === 1 ? 'Share' : 'Shares'} Available
                  </h2>
                </div>

                {shares.map((share) => {
                  const availableSpots = getAvailableSpots(share);
                  const hasSpots = availableSpots === null || availableSpots > 0;

                  return (
                    <div
                      key={share.id}
                      className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          {/* Time */}
                          <div className="flex items-center gap-3 mb-3">
                            <div className="text-2xl">🕐</div>
                            <div>
                              <p className="text-xl font-bold text-[#1e3a5f]">
                                {formatTime(share.startTime)} - {formatTime(share.endTime)}
                              </p>
                              <p className="text-sm text-gray-600">{share.location}</p>
                            </div>
                          </div>

                          {/* Details */}
                          <div className="space-y-2 mb-4">
                            {share.price && (
                              <div className="flex items-center gap-2">
                                <span className="text-sm text-gray-500">Price:</span>
                                <span className="text-sm font-semibold text-green-600">
                                  ${share.price}/hour
                                </span>
                              </div>
                            )}

                            {share.certificates && share.certificates.length > 0 && (
                              <div className="flex items-start gap-2">
                                <span className="text-sm text-gray-500">Certificates:</span>
                                <div className="flex flex-wrap gap-1">
                                  {share.certificates.map((cert, idx) => (
                                    <span
                                      key={idx}
                                      className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded text-xs font-medium"
                                    >
                                      {cert}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            )}

                            <div className="flex items-center gap-2">
                              <span className="text-sm text-gray-500">Members:</span>
                              <span className="text-sm font-medium text-gray-900">
                                {share.members.length} {share.members.length === 1 ? 'person' : 'people'} joined
                              </span>
                            </div>
                          </div>

                          {/* Availability Badge */}
                          <div className="inline-block">
                            <div
                              className={`px-3 py-1.5 rounded-full text-sm font-semibold ${
                                availableSpots === null
                                  ? 'bg-gray-100 text-gray-700'
                                  : availableSpots > 2
                                  ? 'bg-green-100 text-green-700'
                                  : availableSpots > 0
                                  ? 'bg-yellow-100 text-yellow-700'
                                  : 'bg-red-100 text-red-700'
                              }`}
                            >
                              {availableSpots === null
                                ? 'No limit'
                                : availableSpots === 0
                                ? 'Full'
                                : `${availableSpots} ${availableSpots === 1 ? 'spot' : 'spots'} left`}
                            </div>
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="ml-6 flex flex-col gap-2">
                          <Link
                            href={`/nanny/${share.id}`}
                            className="px-6 py-2 border-2 border-[#1e3a5f] text-[#1e3a5f] rounded-lg font-semibold hover:bg-[#1e3a5f] hover:text-white transition-colors text-center"
                          >
                            View Details
                          </Link>
                          {hasSpots && (
                            <Link
                              href={`/nanny/join/${share.id}`}
                              className="px-6 py-2 bg-[#1e3a5f] text-white rounded-lg font-semibold hover:bg-[#152d47] transition-colors text-center"
                            >
                              Join Now
                            </Link>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </>
        )}
      </div>

      <BottomNav />
    </div>
  );
}