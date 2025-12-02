'use client';

import { useState } from 'react';
import { IoIosArrowBack } from 'react-icons/io';
import { ScheduleData } from '@/app/schedule/upload/page';
import { DaySelector } from '../../components/ui/schedule/DaySelector';
import { UnderlineInput } from '../../components/ui/schedule/UnderlineInput';

interface ScheduleOverviewProps {
  data: ScheduleData;
  onEdit: () => void;
  onBack: () => void;
  onSave: (updatedData: ScheduleData) => Promise<void>;
}

// Convert 24h → 12h
function formatTime12Hour(time24: string): string {
  if (!time24) return '';
  const [hours] = time24.split(':').map(Number);
  const period = hours >= 12 ? 'PM' : 'AM';
  const hours12 = hours === 0 ? 12 : hours > 12 ? hours - 12 : hours;
  return `${hours12} ${period}`;
}

export function ScheduleOverview({
  data,
  onEdit,
  onBack,
}: ScheduleOverviewProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState<ScheduleData>(data);

  const workingDays = editedData.workingDays ?? [];

  const [selectedDay, setSelectedDay] = useState<string | null>(
    workingDays.length > 0 ? workingDays[0] : null
  );

  // -----------------------------
  // DAY TOGGLE + DOUBLE CLICK DELETE
  // -----------------------------
  const handleDayToggle = (dayCode: string, isDouble = false) => {
    const exists = editedData.workingDays.includes(dayCode);

    // VIEW MODE → always allow switching
    if (!isEditing) {
      if (exists) setSelectedDay(dayCode);
      return;
    }

    // EDIT MODE — DOUBLE CLICK → DELETE
    if (isDouble && exists) {
      const newWorkingDays = editedData.workingDays.filter(
        (d) => d !== dayCode
      );

      const newSchedules = { ...editedData.daySchedules };
      delete newSchedules[dayCode];

      setEditedData({
        ...editedData,
        workingDays: newWorkingDays,
        daySchedules: newSchedules,
      });

      setSelectedDay(newWorkingDays[0] ?? null);
      return;
    }

    // EDIT MODE — SINGLE CLICK ON EXISTING → JUST SELECT
    if (exists) {
      setSelectedDay(dayCode);
      return;
    }

    // ADD A NEW DAY
    setEditedData({
      ...editedData,
      workingDays: [...editedData.workingDays, dayCode],
      daySchedules: {
        ...editedData.daySchedules,
        [dayCode]: { timeFrom: '09:00', timeTo: '17:00' },
      },
    });

    setSelectedDay(dayCode);
  };

  // -----------------------------
  // TIME UPDATE (safe)
  // -----------------------------
  const updateDayTime = (field: 'timeFrom' | 'timeTo', value: string) => {
    if (!selectedDay || !isEditing) return;

    const prev = editedData.daySchedules?.[selectedDay] ?? {
      timeFrom: '09:00',
      timeTo: '17:00',
    };

    setEditedData({
      ...editedData,
      daySchedules: {
        ...editedData.daySchedules,
        [selectedDay]: {
          ...prev,
          [field]: value,
        },
      },
    });
  };

  // -----------------------------
  // BUTTON HANDLERS
  // -----------------------------
  const handleConfirm = () => {
    window.location.href = '/';
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setEditedData(data);
    setIsEditing(false);

    setSelectedDay(data.workingDays?.[0] ?? null);
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

      const { schedule } = await res.json();

      setEditedData(schedule);
      setIsEditing(false);
    } catch (error) {
      console.error('Error saving changes:', error);
      alert(error instanceof Error ? error.message : 'Failed to save changes');
    }
  };

  const currentDaySchedule =
    selectedDay && editedData.daySchedules?.[selectedDay];

  // -----------------------------
  // RENDER UI
  // -----------------------------
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
              : 'Review your schedule and click confirm when ready.'}
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

          {/* Times */}
          {currentDaySchedule && (
            <div className="mt-6 mb-6 grid grid-cols-2 gap-4">
              {/* From */}
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

              {/* To */}
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

          {/* Location */}
          <div className="mt-6">
            <UnderlineInput
              label="Working Location"
              value={editedData.location}
              onChange={(value) =>
                setEditedData({ ...editedData, location: value })
              }
              disabled={!isEditing}
            />
          </div>

          {/* Notes */}
          <div className="mt-6 mb-8">
            <UnderlineInput
              label="Additional Note"
              value={editedData.notes || ''}
              onChange={(value) =>
                setEditedData({ ...editedData, notes: value })
              }
              placeholder="N/A"
              disabled={!isEditing}
            />
          </div>

          {/* Buttons */}
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
