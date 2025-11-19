'use client';

import { useState } from 'react';
import { ScheduleData } from '@/app/schedule/upload/page';

interface ScheduleOverviewProps {
  data: ScheduleData;
  onEdit: () => void;
  onBack: () => void;
}

export function ScheduleOverview({ data, onEdit, onBack }: ScheduleOverviewProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState<ScheduleData>(data);

  const daysOfWeek = [
    { code: 'SUN', label: 'S' },
    { code: 'MON', label: 'M' },
    { code: 'TUE', label: 'T' },
    { code: 'WED', label: 'W' },
    { code: 'THU', label: 'T' },
    { code: 'FRI', label: 'F' },
    { code: 'SAT', label: 'S' },
  ];

  const handleDayToggle = (dayCode: string) => {
    if (!isEditing) return;
    
    const newDays = editedData.workingDays.includes(dayCode)
      ? editedData.workingDays.filter(d => d !== dayCode)
      : [...editedData.workingDays, dayCode];
    
    setEditedData({ ...editedData, workingDays: newDays });
  };

  const handleConfirm = async () => {
    // TODO: Save to database
    console.log('Saving schedule:', editedData);
    
    // Navigate to calendar
    window.location.href = '/calendar';
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setEditedData(data);
    setIsEditing(false);
  };

  return (
    <div className="fixed inset-0 bg-gradient-primary">
      <div className="h-full overflow-y-auto flex flex-col p-4 pt-6 pb-32">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={onBack}
            className="mb-4 text-white hover:opacity-80 transition-opacity"
          >
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          
          <h1 className="text-3xl font-bold text-white mb-3">
            {isEditing ? 'Schedule Editing' : 'Overview'}
          </h1>
          <p className="text-white text-sm">
            {isEditing 
              ? 'If everything looks correct, please click the upload button to proceed.'
              : 'Please review your schedule, and if everything looks correct, click the upload button to proceed.'}
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-3xl p-6 shadow-xl mb-4">
          {/* Title */}
          <div className="mb-6">
            <label className="block text-lg font-bold text-gray-900 mb-2">
              Title
            </label>
            {isEditing ? (
              <input
                type="text"
                value={editedData.title}
                onChange={(e) => setEditedData({ ...editedData, title: e.target.value })}
                className="w-full pb-2 border-b-2 border-gray-900 focus:outline-none text-gray-900"
              />
            ) : (
              <div className="pb-2 border-b-2 border-gray-900 text-gray-900">
                {editedData.title}
              </div>
            )}
          </div>

          {/* Working Days */}
          <div className="mb-6">
            <label className="block text-lg font-bold text-gray-900 mb-3">
              Working Days
            </label>
            <div className="flex gap-2">
              {daysOfWeek.map((day) => {
                const isSelected = editedData.workingDays.includes(day.code);
                return (
                  <button
                    key={day.code}
                    onClick={() => handleDayToggle(day.code)}
                    disabled={!isEditing}
                    className={`w-12 h-12 rounded-full font-bold text-lg transition-colors ${
                      isSelected
                        ? 'bg-green-400 text-white'
                        : 'bg-gray-200 text-gray-400'
                    } ${isEditing ? 'cursor-pointer hover:opacity-80' : 'cursor-default'}`}
                  >
                    {day.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Label Section */}
          <div className="mb-6 flex items-center gap-4">
            <div className="flex-1">
              <label className="block text-lg font-bold text-gray-900 mb-2">
                Label
              </label>
              <div className="flex items-center gap-2 pb-2 border-b-2 border-gray-900">
                <svg className="w-5 h-5 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {isEditing ? (
                  <input
                    type="text"
                    placeholder="Content"
                    className="flex-1 focus:outline-none text-gray-500"
                  />
                ) : (
                  <span className="text-gray-500">Content</span>
                )}
              </div>
            </div>
            <div className="flex-1">
              <label className="block text-lg font-bold text-gray-900 mb-2">
                &nbsp;
              </label>
              <div className="flex items-center gap-2 pb-2 border-b-2 border-gray-900">
                <svg className="w-5 h-5 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                {isEditing ? (
                  <input
                    type="text"
                    placeholder="Content"
                    className="flex-1 focus:outline-none text-gray-500"
                  />
                ) : (
                  <span className="text-gray-500">Content</span>
                )}
              </div>
            </div>
          </div>

          {/* Working Location */}
          <div className="mb-6">
            <label className="block text-lg font-bold text-gray-900 mb-2">
              Working Location
            </label>
            {isEditing ? (
              <input
                type="text"
                value={editedData.location}
                onChange={(e) => setEditedData({ ...editedData, location: e.target.value })}
                className="w-full pb-2 border-b-2 border-gray-900 focus:outline-none text-gray-900"
              />
            ) : (
              <div className="pb-2 border-b-2 border-gray-900 text-gray-900">
                {editedData.location}
              </div>
            )}
          </div>

          {/* Working Hours */}
<div className="mb-6">
  <label className="block text-lg font-bold text-gray-900 mb-2">
    Working Hours
  </label>
  {isEditing ? (
    <div className="flex gap-4">
      <input
        type="time"
        value={editedData.timeFrom}
        onChange={(e) => setEditedData({ ...editedData, timeFrom: e.target.value })}
        className="pb-2 border-b-2 border-gray-900 focus:outline-none text-gray-900"
      />
      <span className="text-gray-900 font-bold">to</span>
      <input
        type="time"
        value={editedData.timeTo}
        onChange={(e) => setEditedData({ ...editedData, timeTo: e.target.value })}
        className="pb-2 border-b-2 border-gray-900 focus:outline-none text-gray-900"
      />
    </div>
  ) : (
    <div className="pb-2 border-b-2 border-gray-900 text-gray-900">
      {editedData.timeFrom} &ndash; {editedData.timeTo}
    </div>
  )}
</div>


          {/* Additional Note */}
          <div className="mb-8">
            <label className="block text-lg font-bold text-gray-900 mb-2">
              Additional Note
            </label>
            {isEditing ? (
              <input
                type="text"
                value={editedData.notes || 'N/A'}
                onChange={(e) => setEditedData({ ...editedData, notes: e.target.value })}
                className="w-full pb-2 border-b-2 border-gray-900 focus:outline-none text-gray-900"
              />
            ) : (
              <div className="pb-2 border-b-2 border-gray-900 text-gray-900">
                {editedData.notes || 'N/A'}
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            {isEditing ? (
              <>
                <button
                  onClick={handleCancel}
                  className="flex-1 py-4 px-4 border-2 border-blue-600 text-blue-600 font-bold rounded-xl hover:bg-blue-50 transition-colors text-lg"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirm}
                  className="flex-1 py-4 px-4 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-colors text-lg"
                >
                  Confirm
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={handleEdit}
                  className="flex-1 py-4 px-4 border-2 border-blue-600 text-blue-600 font-bold rounded-xl hover:bg-blue-50 transition-colors text-lg"
                >
                  Edit
                </button>
                <button
                  onClick={handleConfirm}
                  className="flex-1 py-4 px-4 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-colors text-lg"
                >
                  Confirm
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}