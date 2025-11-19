'use client';

import { useState } from 'react';
import { ScheduleData } from '@/app/schedule/upload/page';

interface ManualInputProps {
  onComplete: (data: ScheduleData) => void;
  onBack: () => void;
  hideBackButton?: boolean;
}

const DAYS = [
  { id: 'SUN', label: 'S' },
  { id: 'MON', label: 'M' },
  { id: 'TUE', label: 'T' },
  { id: 'WED', label: 'W' },
  { id: 'THU', label: 'T' },
  { id: 'FRI', label: 'F' },
  { id: 'SAT', label: 'S' },
];

// helper: parse common time strings into "HH:MM" (24h) or return null
function normalizeToHHMM(input: string): string | null {
  if (!input) return null;
  const s = input.trim().toLowerCase();

  // already in HH:MM or H:MM or HH:MM:SS
  const matchHM = s.match(/^(\d{1,2}):(\d{2})(?::\d{2})?$/);
  if (matchHM) {
    let h = Number(matchHM[1]);
    const m = Number(matchHM[2]);
    if (h >= 0 && h < 24 && m >= 0 && m < 60) {
      return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
    }
    return null;
  }

  // formats like "8am", "8:30am", "8 am", "8:30 am"
  const matchAmPm = s.match(/^(\d{1,2})(?::(\d{2}))?\s*(am|pm)$/);
  if (matchAmPm) {
    let h = Number(matchAmPm[1]);
    const m = Number(matchAmPm[2] ?? '0');
    const ampm = matchAmPm[3];
    if (h === 12 && ampm === 'am') h = 0;
    if (h < 12 && ampm === 'pm') h += 12;
    if (h >= 0 && h < 24 && m >= 0 && m < 60) {
      return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
    }
    return null;
  }

  return null;
}

export function ManualInput({ onComplete, onBack, hideBackButton = false }: ManualInputProps) {
  const [formData, setFormData] = useState<ScheduleData>({
    title: '',
    workingDays: [],
    timeFrom: '',
    timeTo: '',
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

    // normalize/validate times
    const normalizedFrom = normalizeToHHMM(formData.timeFrom);
    const normalizedTo = normalizeToHHMM(formData.timeTo);

    if (!normalizedFrom || !normalizedTo) {
      setError('Please enter start and end times in a valid format (e.g. 08:30 or 8:30 AM).');
      return;
    }

    setIsSubmitting(true);

    try {
      const payload = { ...formData, timeFrom: normalizedFrom, timeTo: normalizedTo };

      // Save to database
      const response = await fetch('/api/schedule/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error('Failed to save schedule');
      }

      setTimeout(() => {
        onComplete(payload);
      }, 500);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save schedule');
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Title */}
        <div>
          <label className="block text-lg font-bold text-gray-900 mb-2">
            Title
          </label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
            placeholder="Content"
            className="w-full pb-2 border-b-2 border-gray-900 focus:outline-none text-gray-900 placeholder-gray-400 bg-transparent"
          />
        </div>

        {/* Working Days */}
        <div>
          <label className="block text-lg font-bold text-gray-900 mb-3">
            Working Days
          </label>
          <div className="flex gap-2">
            {DAYS.map((day) => (
              <button
                key={day.id}
                type="button"
                onClick={() => toggleDay(day.id)}
                className={`w-12 h-12 rounded-full font-bold text-lg transition-colors ${
                  formData.workingDays.includes(day.id)
                    ? 'bg-green-400 text-white'
                    : 'bg-gray-200 text-gray-400'
                }`}
              >
                {day.label}
              </button>
            ))}
          </div>
        </div>

        {/* Time Range */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-lg font-bold text-gray-900 mb-2">
              From
            </label>
            <input
              type="text"
              inputMode="numeric"
              value={formData.timeFrom}
              onChange={(e) => setFormData(prev => ({ ...prev, timeFrom: e.target.value }))}
              onBlur={(e) => {
                const n = normalizeToHHMM(e.target.value);
                if (n) {
                  setFormData(prev => ({ ...prev, timeFrom: n }));
                  setError(null);
                } else {
                  setError('Please enter a valid start time (e.g. 08:30 or 8:30 AM).');
                }
              }}
              placeholder="08:30 or 8:30 AM"
              className="w-full pb-2 border-b-2 border-gray-900 focus:outline-none text-gray-900 placeholder-gray-400 bg-transparent"
            />
          </div>
          <div>
            <label className="block text-lg font-bold text-gray-900 mb-2">
              To
            </label>
            <input
              type="text"
              inputMode="numeric"
              value={formData.timeTo}
              onChange={(e) => setFormData(prev => ({ ...prev, timeTo: e.target.value }))}
              onBlur={(e) => {
                const n = normalizeToHHMM(e.target.value);
                if (n) {
                  setFormData(prev => ({ ...prev, timeTo: n }));
                  setError(null);
                } else {
                  setError('Please enter a valid end time (e.g. 17:00 or 5:00 PM).');
                }
              }}
              placeholder="17:00 or 5:00 PM"
              className="w-full pb-2 border-b-2 border-gray-900 focus:outline-none text-gray-900 placeholder-gray-400 bg-transparent"
            />
          </div>
        </div>

        {/* Working Location */}
        <div>
          <label className="block text-lg font-bold text-gray-900 mb-2">
            Working Location
          </label>
          <input
            type="text"
            value={formData.location}
            onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
            placeholder="Location"
            className="w-full pb-2 border-b-2 border-gray-900 focus:outline-none text-gray-900 placeholder-gray-400 bg-transparent"
          />
        </div>

        {/* Additional Note */}
        <div>
          <label className="block text-lg font-bold text-gray-900 mb-2">
            Additional Note
          </label>
          <input
            type="text"
            value={formData.notes}
            onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
            placeholder="N/A"
            className="w-full pb-2 border-b-2 border-gray-900 focus:outline-none text-gray-900 placeholder-gray-400 bg-transparent"
          />
        </div>

        {error && (
          <div className="p-4 bg-red-50 border-2 border-red-200 rounded-xl">
            <p className="text-sm text-red-600 font-semibold">{error}</p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-3 pt-4 pb-24">
          <button
            type="button"
            onClick={onBack}
            className="flex-1 py-4 px-4 border-2 border-blue-600 text-blue-600 font-bold rounded-xl hover:bg-blue-50 transition-colors text-lg"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex-1 py-4 px-4 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed text-lg"
          >
            {isSubmitting ? 'Saving...' : 'Confirm'}
          </button>
        </div>
      </form>
    </div>
  );
}