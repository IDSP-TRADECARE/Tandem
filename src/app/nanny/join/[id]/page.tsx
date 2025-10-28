'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSocket } from '@/lib/socket/SocketContext';
import { useUser } from '@clerk/nextjs';

export default function JoinSharePage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { socket } = useSocket();
  useUser();
  const [shareId, setShareId] = useState<string | null>(null);
  const [isJoining, setIsJoining] = useState(false);
  const [joinForm, setJoinForm] = useState({ userName: '', kidsCount: '1' });

  // Unwrap params
  useEffect(() => {
    params.then(({ id }) => setShareId(id));
  }, [params]);

  const handleJoinShare = async () => {
    if (!joinForm.userName || !joinForm.kidsCount || !shareId) {
      alert('Please fill in all fields');
      return;
    }

    setIsJoining(true);

    try {
      const response = await fetch(`/api/nanny/${shareId}/join`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(joinForm),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.error || 'Failed to join share');
        setIsJoining(false);
        return;
      }

      // Emit socket event to notify other clients
      if (socket && data.share) {
        socket.emit('member-joined', {
          shareId: shareId,
          member: data.share.members[data.share.members.length - 1],
        });
      }

      // Success! Redirect to the share detail page
      router.push(`/nanny/${shareId}`);
    } catch (error) {
      console.error('Error joining share:', error);
      alert('An error occurred. Please try again.');
      setIsJoining(false);
    }
  };

  if (!shareId) {
    return (
      <div className="min-h-screen bg-linear-to-br from-blue-50 via-white to-green-50 flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-[#1e3a5f] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 via-white to-green-50 flex items-center justify-center p-6">
      <div className="bg-white rounded-xl max-w-md w-full p-8 shadow-lg">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-[#1e3a5f] hover:text-[#152d47] mb-6"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back
        </button>

        <h1 className="text-3xl font-bold text-gray-900 mb-2">Join Nanny Share</h1>
        <p className="text-gray-600 mb-6">Enter your details to join this share</p>

        <div className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Your Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={joinForm.userName}
              onChange={(e) => setJoinForm(prev => ({ ...prev, userName: e.target.value }))}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[#1e3a5f] focus:outline-none"
              placeholder="Enter your name"
              disabled={isJoining}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Number of Kids <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              min="1"
              value={joinForm.kidsCount}
              onChange={(e) => setJoinForm(prev => ({ ...prev, kidsCount: e.target.value }))}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[#1e3a5f] focus:outline-none"
              disabled={isJoining}
            />
          </div>
        </div>

        <div className="flex gap-3 mt-8">
          <button
            onClick={() => router.back()}
            disabled={isJoining}
            className="flex-1 py-3 border-2 border-gray-300 rounded-lg font-semibold hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleJoinShare}
            disabled={isJoining}
            className="flex-1 py-3 bg-[#1e3a5f] text-white rounded-lg font-semibold hover:bg-[#152d47] transition-colors disabled:opacity-50"
          >
            {isJoining ? 'Joining...' : 'Join Share'}
          </button>
        </div>
      </div>
    </div>
  );
}