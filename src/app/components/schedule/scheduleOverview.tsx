'use client';

import { ScheduleData } from '@/app/schedule/upload/page';

interface ScheduleOverviewProps {
  data: ScheduleData;
  onEdit: () => void;
  onBack: () => void;
}

const DAY_LABELS: Record<string, string> = {
  MON: 'Monday',
  TUE: 'Tuesday',
  WED: 'Wednesday',
  THU: 'Thursday',
  FRI: 'Friday',
  SAT: 'Saturday',
  SUN: 'Sunday',
};

const DAY_ABBREV: Record<string, string> = {
  MON: 'M',
  TUE: 'T',
  WED: 'W',
  THU: 'T',
  FRI: 'F',
  SAT: 'S',
  SUN: 'S',
};

export function ScheduleOverview({ data, onEdit, onBack }: ScheduleOverviewProps) {
  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
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

      <h2 className="text-2xl font-bold text-gray-900 mb-6">Overview</h2>

      <div className="space-y-6">
        {/* Title */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Title</label>
          <p className="text-gray-900">{data.title}</p>
        </div>

        {/* Working Days */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Working Days</label>
          <div className="flex gap-2">
            {Object.keys(DAY_ABBREV).map((day) => (
              <div
                key={day}
                className={`flex-1 h-10 rounded-lg flex items-center justify-center font-semibold ${
                  data.workingDays.includes(day)
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-400'
                }`}
              >
                {DAY_ABBREV[day]}
              </div>
            ))}
          </div>
          <p className="text-sm text-gray-600 mt-2">
            {data.workingDays.map((day) => DAY_LABELS[day]).join(', ')}
          </p>
        </div>

        {/* Time Range */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">From</label>
            <p className="text-gray-900">{formatTime(data.timeFrom)}</p>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">To</label>
            <p className="text-gray-900">{formatTime(data.timeTo)}</p>
          </div>
        </div>

        {/* Working Location */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Working Location</label>
          <p className="text-gray-900">{data.location || 'Not specified'}</p>
        </div>

        {/* Additional Note */}
        {data.notes && (
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Additional Note</label>
            <p className="text-gray-900">{data.notes}</p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-3 pt-4">
          <button
            onClick={onEdit}
            className="flex-1 py-3 px-4 border-2 border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors"
          >
            Edit
          </button>
          <button
            onClick={onBack}
            className="flex-1 py-3 px-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}