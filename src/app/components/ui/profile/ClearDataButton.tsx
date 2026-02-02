'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface ClearDataButtonProps {
  textColor?: string;
  iconColor?: string;
}

export function ClearDataButton({ textColor, iconColor }: ClearDataButtonProps) {
  const [isClearing, setIsClearing] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const router = useRouter();

  const handleClearData = async () => {
    setIsClearing(true);
    try {
      const response = await fetch('/api/auth/clear-data', {
        method: 'POST',
        credentials: 'include',
      });

      if (response.ok) {
        // Redirect to sign-in after clearing data
        router.push('/sign-in');
      } else {
        console.error('Failed to clear data');
        alert('Failed to clear data. Please try again.');
      }
    } catch (error) {
      console.error('Error clearing data:', error);
      alert('An error occurred. Please try again.');
    } finally {
      setIsClearing(false);
      setShowConfirm(false);
    }
  };

  if (showConfirm) {
    return (
      <div className="w-full rounded-xl p-4 bg-red-50 border-2 border-red-300">
        <p className="text-red-900 text-sm mb-3 font-medium">
          Are you sure you want to clear all your data? This will delete all schedules and nanny shares.
        </p>
        <div className="flex gap-2">
          <button
            onClick={handleClearData}
            disabled={isClearing}
            className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isClearing ? 'Clearing...' : 'Yes, Clear All Data'}
          </button>
          <button
            onClick={() => setShowConfirm(false)}
            disabled={isClearing}
            className="flex-1 px-4 py-2 bg-gray-200 text-gray-800 rounded-lg font-medium hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    );
  }

  return (
    <button
      onClick={() => setShowConfirm(true)}
      className="w-full flex items-center justify-between p-4 rounded-xl hover:bg-gray-50 transition-colors border border-red-200"
      style={{ color: textColor || '#dc2626' }}
    >
      <div className="flex items-center gap-4">
        <img
          src="/profile/ComponentIcon/Logout.svg"
          alt="Clear Data"
          className="w-6 h-6"
          style={{ filter: iconColor === 'white' ? 'brightness(0) invert(1)' : undefined }}
        />
        <span className="font-medium">Clear All Data & Logout</span>
      </div>
      <svg
        className="w-5 h-5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9 5l7 7-7 7"
        />
      </svg>
    </button>
  );
}
