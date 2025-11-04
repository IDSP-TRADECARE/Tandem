'use client';

import { ScheduleData } from '../../schedule/upload/page';

interface ScheduleOverviewProps {
  data: ScheduleData;
  onEdit: () => void;
  onBack: () => void;
}

export function ScheduleOverview({ data, onEdit, onBack }: ScheduleOverviewProps) {
  const daysOfWeek = [
    { code: 'MON', label: 'Monday' },
    { code: 'TUE', label: 'Tuesday' },
    { code: 'WED', label: 'Wednesday' },
    { code: 'THU', label: 'Thursday' },
    { code: 'FRI', label: 'Friday' },
    { code: 'SAT', label: 'Saturday' },
    { code: 'SUN', label: 'Sunday' },
  ];

  // Safely handle workingDays with default empty array
  const workingDays = data?.workingDays || [];

  return (
    <div className="max-w-2xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <button
          onClick={onBack}
          className="mb-4 p-2 hover:bg-gray-100 rounded-full transition-colors inline-flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back
        </button>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Schedule Overview</h1>
        <p className="text-gray-600">Review your schedule details</p>
      </div>

      {/* Schedule Card */}
      <div className="bg-white rounded-2xl border-2 border-gray-200 p-6 mb-6">
        {/* Title */}
        <div className="mb-6">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Schedule Title
          </label>
          <p className="text-lg font-medium text-gray-900">
            {data?.title || 'Untitled Schedule'}
          </p>
        </div>

        {/* Working Days */}
        <div className="mb-6">
          <label className="block text-sm font-semibold text-gray-700 mb-3">
            Working Days
          </label>
          <div className="grid grid-cols-7 gap-2">
            {daysOfWeek.map((day) => {
              const isSelected = workingDays.includes(day.code);
              return (
                <div
                  key={day.code}
                  className={`p-3 rounded-xl text-center transition-colors ${
                    isSelected
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-400'
                  }`}
                >
                  <div className="font-semibold text-sm">{day.code}</div>
                </div>
              );
            })}
          </div>
          <div className="mt-2 text-sm text-gray-600">
            {workingDays.length > 0 
              ? `${workingDays.length} day${workingDays.length > 1 ? 's' : ''} selected`
              : 'No days selected'}
          </div>
        </div>

        {/* Time */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Start Time
            </label>
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-lg font-medium text-gray-900">
                {data?.timeFrom || 'Not set'}
              </p>
            </div>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              End Time
            </label>
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-lg font-medium text-gray-900">
                {data?.timeTo || 'Not set'}
              </p>
            </div>
          </div>
        </div>

        {/* Location */}
        <div className="mb-6">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Location
          </label>
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <p className="text-lg font-medium text-gray-900">
              {data?.location || 'Not specified'}
            </p>
          </div>
        </div>

        {/* Notes */}
        {data?.notes && (
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Notes
            </label>
            <p className="text-gray-700 bg-gray-50 rounded-xl p-4">
              {data.notes}
            </p>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3">
        <button
          onClick={onEdit}
          className="flex-1 py-3 px-4 border-2 border-blue-600 text-blue-600 font-semibold rounded-xl hover:bg-blue-50 transition-colors"
        >
          Edit Schedule
        </button>
        <button
          onClick={() => {
            // Save schedule and navigate to calendar
            window.location.href = '/calendar';
          }}
          className="flex-1 py-3 px-4 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-colors"
        >
          Save & View Calendar
        </button>
      </div>
    </div>
  );
}