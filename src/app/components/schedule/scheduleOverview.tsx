'use client';

import { useState } from 'react';
import { IoIosArrowBack } from "react-icons/io";
import { ScheduleData } from '@/app/schedule/upload/page';
import { DaySelector } from '../../components/ui/schedule/DaySelector';
import { UnderlineInput } from '../../components/ui/schedule/UnderlineInput';

interface ScheduleOverviewProps {
  data: ScheduleData;
  onEdit: () => void;
  onBack: () => void;
  onSave: (updatedData: ScheduleData) => Promise<void>; 
}

// Helper to convert 24h time to 12h format
function formatTime12Hour(time24: string): string {
  if (!time24) return '';
  
  const [hours, minutes] = time24.split(':').map(Number);
  const period = hours >= 12 ? 'PM' : 'AM';
  const hours12 = hours === 0 ? 12 : hours > 12 ? hours - 12 : hours;
  
  return `${hours12} ${period}`;
}

export function ScheduleOverview({ data, onEdit, onBack }: ScheduleOverviewProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState<ScheduleData>(data);
  const [selectedDay, setSelectedDay] = useState<string | null>(
    data.workingDays.length > 0 ? data.workingDays[0] : null
  );

  const daysOfWeek = [
    { code: 'SUN', label: 'S', fullName: 'Sunday' },
    { code: 'MON', label: 'M', fullName: 'Monday' },
    { code: 'TUE', label: 'T', fullName: 'Tuesday' },
    { code: 'WED', label: 'W', fullName: 'Wednesday' },
    { code: 'THU', label: 'T', fullName: 'Thursday' },
    { code: 'FRI', label: 'F', fullName: 'Friday' },
    { code: 'SAT', label: 'S', fullName: 'Saturday' },
  ];

  const handleDayToggle = (dayCode: string) => {
    if (isEditing) {
      // In edit mode: toggle days on/off
      const isCurrentlySelected = editedData.workingDays.includes(dayCode);
      
      if (isCurrentlySelected) {
        // Remove day
        const newWorkingDays = editedData.workingDays.filter(d => d !== dayCode);
        const newDaySchedules = { ...editedData.daySchedules };
        delete newDaySchedules[dayCode];
        
        setEditedData({
          ...editedData,
          workingDays: newWorkingDays,
          daySchedules: newDaySchedules
        });
        
        // Update selected day if we removed it
        if (selectedDay === dayCode) {
          setSelectedDay(newWorkingDays.length > 0 ? newWorkingDays[0] : null);
        }
      } else {
        // Add day
        const newDaySchedules = {
          ...editedData.daySchedules,
          [dayCode]: { timeFrom: '09:00', timeTo: '17:00' }
        };
        
        setEditedData({
          ...editedData,
          workingDays: [...editedData.workingDays, dayCode],
          daySchedules: newDaySchedules
        });
        
        setSelectedDay(dayCode);
      }
    } else {
      // In view mode: just switch selected day
      if (editedData.workingDays.includes(dayCode)) {
        setSelectedDay(dayCode);
      }
    }
  };

  const updateDayTime = (field: 'timeFrom' | 'timeTo', value: string) => {
    if (!selectedDay || !isEditing) return;
    
    setEditedData({
      ...editedData,
      daySchedules: {
        ...editedData.daySchedules,
        [selectedDay]: {
          ...editedData.daySchedules![selectedDay],
          [field]: value
        }
      }
    });
  };

  const handleConfirm = async () => {
    window.location.href = '/';
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setEditedData(data);
    setIsEditing(false);
    setSelectedDay(data.workingDays.length > 0 ? data.workingDays[0] : null);
  };

  const handleSaveChanges = async () => {
    try {
      const res = await fetch('/api/schedule/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editedData),
        credentials: 'include',
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || 'Failed to save schedule');
      }

      const result = await res.json();
      const saved = result.schedule || result.created || result;

      // Merge server fields (id, dailyTimes, etc.) back into state
      setEditedData((prev) => ({ ...prev, ...saved }));
      setIsEditing(false);
    } catch (error) {
      console.error('Error saving changes:', error);
      alert(error instanceof Error ? error.message : 'Failed to save changes. Please try again.');
    }
  };


  // Get the schedule for the currently selected day
  const currentDaySchedule = selectedDay && editedData.daySchedules?.[selectedDay];

  return (
    <div className="fixed inset-0 bg-gradient-primary">
      <div className="h-full overflow-y-auto flex flex-col p-6 pt-8 pb-32">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={onBack}
            className="mt-2 text-white hover:opacity-80 transition-opacity"
          >
            <IoIosArrowBack className="w-8 h-8" />
          </button>
          
          <h1 className="text-4xl font-bold text-white mb-3 text-center">
            Overview
          </h1>
          <p className="text-white text-center text-sm px-4">
            {isEditing 
              ? 'Edit your schedule details below'
              : 'Please review your schedule, and if everything looks correct, click the upload button to proceed.'}
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-3xl p-6 shadow-xl mb-4">
          {/* Title */}
          <UnderlineInput 
            label="Title"
            value={editedData.title}
            onChange={(value) => setEditedData({ ...editedData, title: value })}
            disabled={!isEditing}
          />

          {/* Working Days */}
          <div className="mt-6">
            <DaySelector 
              selectedDays={editedData.workingDays}
              onDayToggle={handleDayToggle}
              activeDay={selectedDay}
              disabled={!isEditing}
              showHint={isEditing}
            />
          </div>

          {/* Working Hours - Side by Side for Selected Day */}
          {currentDaySchedule && (
            <div className="mt-6 mb-6 grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xl font-bold text-gray-900 mb-3">
                  From
                </label>
                {isEditing ? (
                  <input
                    type="time"
                    value={currentDaySchedule.timeFrom}
                    onChange={(e) => updateDayTime('timeFrom', e.target.value)}
                    className="w-full pb-2 border-b-2 border-gray-900 focus:outline-none text-gray-900"
                  />
                ) : (
                  <div className="pb-2 border-b-2 border-gray-900 text-gray-900">
                    {formatTime12Hour(currentDaySchedule.timeFrom)}
                  </div>
                )}
              </div>
              <div>
                <label className="block text-xl font-bold text-gray-900 mb-3">
                  To
                </label>
                {isEditing ? (
                  <input
                    type="time"
                    value={currentDaySchedule.timeTo}
                    onChange={(e) => updateDayTime('timeTo', e.target.value)}
                    className="w-full pb-2 border-b-2 border-gray-900 focus:outline-none text-gray-900"
                  />
                ) : (
                  <div className="pb-2 border-b-2 border-gray-900 text-gray-900">
                    {formatTime12Hour(currentDaySchedule.timeTo)}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Working Location */}
          <div className="mt-6">
            <UnderlineInput 
              label="Working Location"
              value={editedData.location}
              onChange={(value) => setEditedData({ ...editedData, location: value })}
              disabled={!isEditing}
            />
          </div>

          {/* Additional Note */}
          <div className="mt-6 mb-8">
            <UnderlineInput 
              label="Additional Note"
              value={editedData.notes || ''}
              onChange={(value) => setEditedData({ ...editedData, notes: value })}
              placeholder="N/A"
              disabled={!isEditing}
            />
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
                  onClick={handleSaveChanges}
                  className="flex-1 py-4 px-4 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-colors text-lg"
                >
                  Save Changes
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