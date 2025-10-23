'use client';

import { useState } from 'react';
import { ScheduleData } from '@/app/schedule/upload/page';

interface ManualInputProps {
  onComplete: (data: ScheduleData) => void;
  onBack: () => void;
  hideBackButton?: boolean;
}

const DAYS = [
  { id: 'MON', label: 'M' },
  { id: 'TUE', label: 'T' },
  { id: 'WED', label: 'W' },
  { id: 'THU', label: 'T' },
  { id: 'FRI', label: 'F' },
  { id: 'SAT', label: 'S' },
  { id: 'SUN', label: 'S' },
];

export function ManualInput({ onComplete, onBack, hideBackButton = false }: ManualInputProps) {
  const [formData, setFormData] = useState<ScheduleData>({
    title: '',
    workingDays: ['MON'],
    timeFrom: '08:00',
    timeTo: '17:00',
    location: '',
    notes: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const toggleDay = (day: string) => {
    setFormData((prev) => ({
      ...prev,
      workingDays: prev.workingDays.includes(day)
        ? prev.workingDays.filter((d) => d !== day)
        : [...prev.workingDays, day],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!formData.title.trim()) {
      setError('Please enter a title');
      return;
    }

    if (formData.workingDays.length === 0) {
      setError('Please select at least one working day');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/schedule/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to save schedule');
      }

      setTimeout(() => {
        onComplete(formData);
      }, 500);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save schedule');
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      {!hideBackButton && (
        <div className="mb-4">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back
          </button>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Title */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Title
          </label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            placeholder="e.g., November 2025 Work Schedule"
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-[#1e3a5f] focus:border-[#1e3a5f] outline-none transition-all text-gray-900"
          />
        </div>

        {/* Working Days */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Working Days
          </label>
          <div className="flex gap-2">
            {DAYS.map((day) => (
              <button
                key={day.id}
                type="button"
                onClick={() => toggleDay(day.id)}
                className={`flex-1 h-12 rounded-xl font-bold transition-all ${
                  formData.workingDays.includes(day.id)
                    ? 'bg-[#1e3a5f] text-white shadow-md'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {day.label}
              </button>
            ))}
          </div>
          <p className="text-xs text-gray-500 mt-2">
            M = Monday, T = Tuesday, W = Wednesday, T = Thursday, F = Friday, S = Saturday, S = Sunday
          </p>
        </div>

        {/* Time Range */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              From
            </label>
            <input
              type="time"
              value={formData.timeFrom}
              onChange={(e) => setFormData({ ...formData, timeFrom: e.target.value })}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-[#1e3a5f] focus:border-[#1e3a5f] outline-none transition-all text-gray-900"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              To
            </label>
            <input
              type="time"
              value={formData.timeTo}
              onChange={(e) => setFormData({ ...formData, timeTo: e.target.value })}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-[#1e3a5f] focus:border-[#1e3a5f] outline-none transition-all text-gray-900"
            />
          </div>
        </div>

        {/* Working Location */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Working Location
          </label>
          <input
            type="text"
            value={formData.location}
            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
            placeholder="e.g., Surrey, Vancouver"
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-[#1e3a5f] focus:border-[#1e3a5f] outline-none transition-all text-gray-900"
          />
        </div>

        {/* Additional Note */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Additional Note
          </label>
          <textarea
            value={formData.notes}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            placeholder="Any special notes or requirements..."
            rows={4}
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-[#1e3a5f] focus:border-[#1e3a5f] outline-none transition-all resize-none text-gray-900"
          />
        </div>

        {error && (
          <div className="p-4 bg-red-50 border-2 border-red-200 rounded-xl">
            <p className="text-sm text-red-600 font-semibold">{error}</p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-3 pt-2">
          {!hideBackButton && (
            <button
              type="button"
              onClick={onBack}
              className="flex-1 py-4 px-4 border-2 border-gray-300 text-gray-700 font-bold rounded-xl hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
          )}
          <button
            type="submit"
            disabled={isSubmitting}
            className={`${hideBackButton ? 'w-full' : 'flex-1'} py-4 px-4 bg-[#1e3a5f] text-white font-bold rounded-xl hover:bg-[#2d4a6f] transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed shadow-md`}
          >
            {isSubmitting ? 'Saving...' : 'Confirm'}
          </button>
        </div>
      </form>
    </div>
  );
}