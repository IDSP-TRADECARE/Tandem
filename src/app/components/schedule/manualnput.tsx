'use client';

import { useState } from 'react';
import { ScheduleData } from '@/app/schedule/upload/page';
import { MdCancel } from "react-icons/md";


interface ManualInputProps {
  onComplete: (data: ScheduleData) => void;
  onBack: () => void;
  hideBackButton?: boolean;
}

const DAYS = [
  { id: 'SUN', label: 'S', fullName: 'Sunday' },
  { id: 'MON', label: 'M', fullName: 'Monday' },
  { id: 'TUE', label: 'T', fullName: 'Tuesday' },
  { id: 'WED', label: 'W', fullName: 'Wednesday' },
  { id: 'THU', label: 'T', fullName: 'Thursday' },
  { id: 'FRI', label: 'F', fullName: 'Friday' },
  { id: 'SAT', label: 'S', fullName: 'Saturday' },
];

interface DaySchedule {
  timeFrom: string;
  timeTo: string;
}

function normalizeToHHMM(input: string): string | null {
  if (!input) return null;
  const s = input.trim().toLowerCase();

  // Match HH:MM or H:MM format
  const matchHM = s.match(/^(\d{1,2}):(\d{2})(?::\d{2})?$/);
  if (matchHM) {
    let h = Number(matchHM[1]);
    const m = Number(matchHM[2]);
    if (h >= 0 && h < 24 && m >= 0 && m < 60) {
      return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
    }
    return null;
  }

  // Match formats like "8am", "8:30am", "8 am", "8:30 am"
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
  const [title, setTitle] = useState('');
  const [location, setLocation] = useState('');
  const [notes, setNotes] = useState('');
  const [selectedDay, setSelectedDay] = useState<string | null>(null);
  const [daySchedules, setDaySchedules] = useState<Record<string, DaySchedule>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDayClick = (dayId: string) => {
    if (!daySchedules[dayId]) {
      // Add day with empty times
      setDaySchedules(prev => ({
        ...prev,
        [dayId]: { timeFrom: '', timeTo: '' }
      }));
    }
    setSelectedDay(dayId);
    setError(null); // Clear error when switching days
  };

  const updateCurrentDayTime = (field: 'timeFrom' | 'timeTo', value: string) => {
    if (!selectedDay) return;
    
    setDaySchedules(prev => ({
      ...prev,
      [selectedDay]: {
        ...prev[selectedDay],
        [field]: value
      }
    }));
  };

  const handleTimeBlur = (field: 'timeFrom' | 'timeTo') => {
    if (!selectedDay) return;
    
    const currentValue = daySchedules[selectedDay][field];
    const normalized = normalizeToHHMM(currentValue);
    
    if (currentValue && !normalized) {
      setError('Please enter a valid time (e.g., 9:00, 09:00, 9am, 5:30pm)');
    } else if (normalized) {
      setDaySchedules(prev => ({
        ...prev,
        [selectedDay]: {
          ...prev[selectedDay],
          [field]: normalized
        }
      }));
      setError(null);
    }
  };

  const removeDaySchedule = (dayId: string) => {
    const newSchedules = { ...daySchedules };
    delete newSchedules[dayId];
    setDaySchedules(newSchedules);
    if (selectedDay === dayId) {
      setSelectedDay(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!title.trim()) {
      setError('Please enter a title');
      return;
    }

    const workingDays = Object.keys(daySchedules);
    if (workingDays.length === 0) {
      setError('Please select at least one working day');
      return;
    }

    // Validate all day times
    for (const dayId of workingDays) {
      const schedule = daySchedules[dayId];
      
      if (!schedule.timeFrom || !schedule.timeTo) {
        const day = DAYS.find(d => d.id === dayId);
        setError(`Please enter times for ${day?.fullName}`);
        return;
      }

      const normalizedFrom = normalizeToHHMM(schedule.timeFrom);
      const normalizedTo = normalizeToHHMM(schedule.timeTo);

      if (!normalizedFrom || !normalizedTo) {
        const day = DAYS.find(d => d.id === dayId);
        setError(`Please enter valid times for ${day?.fullName}`);
        return;
      }
    }

    setIsSubmitting(true);

    try {
      // Save each day as a separate schedule entry
      const savePromises = workingDays.map(async (dayId) => {
        const schedule = daySchedules[dayId];
        const normalizedFrom = normalizeToHHMM(schedule.timeFrom)!;
        const normalizedTo = normalizeToHHMM(schedule.timeTo)!;
        
        const payload = {
          title: title,
          workingDays: [dayId],
          timeFrom: normalizedFrom,
          timeTo: normalizedTo,
          location: location || null,
          notes: notes || null,
        };

        const response = await fetch('/api/schedule/save', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });

        if (!response.ok) {
          throw new Error('Failed to save schedule');
        }

        return response.json();
      });

      await Promise.all(savePromises);

      setTimeout(() => {
        onComplete({
          title,
          workingDays,
          timeFrom: '',
          timeTo: '',
          location,
          notes,
          daySchedules,
        });
      }, 500);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save schedule');
      setIsSubmitting(false);
    }
  };

  const currentSchedule = selectedDay ? daySchedules[selectedDay] : null;

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
            value={title}
            onChange={(e) => setTitle(e.target.value)}
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
            {DAYS.map((day) => {
              const isSelected = daySchedules[day.id];
              const isActiveEdit = selectedDay === day.id;
              
              return (
                <div key={day.id} className="relative">
                  <button
                    type="button"
                    onClick={() => handleDayClick(day.id)}
                    className={`w-12 h-12 rounded-full font-bold text-lg transition-all ${
                      isSelected
                        ? isActiveEdit
                          ? 'bg-green-500 text-white ring-4 ring-green-300'
                          : 'bg-green-400 text-white'
                        : 'bg-gray-200 text-gray-400'
                    }`}
                  >
                    {day.label}
                  </button>
                  {isSelected && (
                   <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeDaySchedule(day.id);
                      }}
                      title={`Remove ${day.fullName}`}
                      aria-label={`Remove ${day.fullName} schedule`}
                      className="absolute -top-1 -right-1 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-xs hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-300"
                    >
                      <MdCancel size={14} />
                    </button>
                  )}
                </div>
              );
            })}
          </div>
          {selectedDay && (
            <p className="text-xs text-blue-600 mt-2 font-semibold">
              Editing: {DAYS.find(d => d.id === selectedDay)?.fullName}
            </p>
          )}
        </div>

        {/* Time Range - Only show when a day is selected */}
        {selectedDay && currentSchedule && (
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-lg font-bold text-gray-900 mb-2">
                From
              </label>
              <input
                type="text"
                inputMode="text"
                value={currentSchedule.timeFrom}
                onChange={(e) => updateCurrentDayTime('timeFrom', e.target.value)}
                onBlur={() => handleTimeBlur('timeFrom')}
                placeholder="9:00 or 9am"
                className="w-full pb-2 border-b-2 border-gray-900 focus:outline-none text-gray-900 placeholder-gray-400 bg-transparent"
              />
            </div>
            <div>
              <label className="block text-lg font-bold text-gray-900 mb-2">
                To
              </label>
              <input
                type="text"
                inputMode="text"
                value={currentSchedule.timeTo}
                onChange={(e) => updateCurrentDayTime('timeTo', e.target.value)}
                onBlur={() => handleTimeBlur('timeTo')}
                placeholder="5:00 or 5pm"
                className="w-full pb-2 border-b-2 border-gray-900 focus:outline-none text-gray-900 placeholder-gray-400 bg-transparent"
              />
            </div>
          </div>
        )}

        {/* Placeholder when no day selected */}
        {!selectedDay && (
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-lg font-bold text-gray-900 mb-2">
                From
              </label>
              <input
                type="text"
                disabled
                placeholder="Time Start"
                className="w-full pb-2 border-b-2 border-gray-300 focus:outline-none text-gray-400 placeholder-gray-400 bg-transparent cursor-not-allowed"
              />
            </div>
            <div>
              <label className="block text-lg font-bold text-gray-900 mb-2">
                To
              </label>
              <input
                type="text"
                disabled
                placeholder="Time End"
                className="w-full pb-2 border-b-2 border-gray-300 focus:outline-none text-gray-400 placeholder-gray-400 bg-transparent cursor-not-allowed"
              />
            </div>
          </div>
        )}

        {/* Working Location */}
        <div>
          <label className="block text-lg font-bold text-gray-900 mb-2">
            Working Location
          </label>
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
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
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
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