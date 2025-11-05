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

    if (!formData.timeFrom || !formData.timeTo) {
      setError('Please enter both start and end times');
      return;
    }

    setIsSubmitting(true);

    try {
      // Save to database
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
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Title */}
        <div>
          <label className="block text-lg font-bold text-gray-900 mb-2">
            Title
          </label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
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
              type="time"
              value={formData.timeFrom}
              onChange={(e) => setFormData({ ...formData, timeFrom: e.target.value })}
              placeholder="Time Start"
              className="w-full pb-2 border-b-2 border-gray-900 focus:outline-none text-gray-900 placeholder-gray-400 bg-transparent"
            />
          </div>
          <div>
            <label className="block text-lg font-bold text-gray-900 mb-2">
              To
            </label>
            <input
              type="time"
              value={formData.timeTo}
              onChange={(e) => setFormData({ ...formData, timeTo: e.target.value })}
              placeholder="Time End"
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
            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
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
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
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