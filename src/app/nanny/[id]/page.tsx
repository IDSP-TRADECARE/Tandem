'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { BottomNav } from '@/app/components/Layout/BottomNav';
import type { NannyShare } from '@/db/schema';

export default function NannyShareDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [share, setShare] = useState<NannyShare | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchShare() {
      try {
        // params.id contains the dynamic value from the URL
        const response = await fetch(`/api/nanny/${params.id}`);
        
        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.error || 'Failed to fetch share');
        }

        const data = await response.json();
        setShare(data.share);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setIsLoading(false);
      }
    }

    fetchShare();
  }, [params.id]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#1e3a5f] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading share details...</p>
        </div>
      </div>
    );
  }

  if (error || !share) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex items-center justify-center px-6">
        <div className="text-center">
          <div className="text-6xl mb-4">😔</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Share Not Found</h2>
          <p className="text-gray-600 mb-6">{error || 'This share may have been deleted'}</p>
          <button
            onClick={() => router.push('/nanny')}
            className="px-6 py-3 bg-[#1e3a5f] text-white rounded-lg font-semibold hover:bg-[#152d47] transition-colors"
          >
            Back to Shares
          </button>
        </div>
      </div>
    );
  }

  const dateObj = new Date(share.date);
  const dateLabel = dateObj.toLocaleDateString('en-US', { 
    weekday: 'short', 
    month: 'short', 
    day: 'numeric' 
  });

  const availableSpots = share.maxSpots ? share.maxSpots - share.members.length : null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 pb-32">
      <div className="px-6 pt-8 max-w-2xl mx-auto">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-[#1e3a5f] hover:text-[#152d47] mb-6"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back
        </button>

        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-[#1e3a5f] to-[#2d5a8a] text-white p-6">
            <h1 className="text-2xl font-bold mb-2">{dateLabel}</h1>
            <div className="flex items-center gap-4 text-sm">
              <span>🕐 {share.startTime} - {share.endTime}</span>
              <span>📍 {share.location}</span>
            </div>
          </div>

          {/* Details */}
          <div className="p-6 space-y-6">
            {/* Price */}
            {share.price && (
              <div>
                <h3 className="text-sm font-semibold text-gray-500 mb-1">Price</h3>
                <p className="text-2xl font-bold text-green-600">${share.price}/hour</p>
              </div>
            )}

            {/* Certificates */}
            {share.certificates && share.certificates.length > 0 && (
              <div>
                <h3 className="text-sm font-semibold text-gray-500 mb-2">Certificates</h3>
                <div className="flex flex-wrap gap-2">
                  {share.certificates.map((cert, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium"
                    >
                      {cert}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Spots */}
            <div>
              <h3 className="text-sm font-semibold text-gray-500 mb-2">Availability</h3>
              <div className="flex items-center gap-3">
                <div className={`px-4 py-2 rounded-lg font-semibold ${
                  availableSpots === null ? 'bg-gray-100 text-gray-700' :
                  availableSpots > 2 ? 'bg-green-100 text-green-700' :
                  availableSpots > 0 ? 'bg-yellow-100 text-yellow-700' :
                  'bg-red-100 text-red-700'
                }`}>
                  {availableSpots === null 
                    ? `${share.members.length} members (no limit)` 
                    : `${availableSpots} spots available`
                  }
                </div>
              </div>
            </div>

            {/* Members */}
            <div>
              <h3 className="text-sm font-semibold text-gray-500 mb-3">Current Members ({share.members.length})</h3>
              <div className="space-y-3">
                {share.members.map((member, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-bold text-lg">
                      {member.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900">{member.name}</p>
                      <p className="text-sm text-gray-600">{member.kidsCount} {member.kidsCount === 1 ? 'kid' : 'kids'}</p>
                    </div>
                    <div className="text-xs text-gray-500">
                      {new Date(member.joinedAt).toLocaleDateString()}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="pt-4 border-t">
              <button
                onClick={() => alert('Chat feature coming soon!')}
                className="w-full py-3 bg-green-500 text-white rounded-lg font-semibold hover:bg-green-600 transition-colors"
              >
                💬 Open Group Chat
              </button>
            </div>
          </div>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}