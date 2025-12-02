'use client';

import { useState, useRef } from 'react';
import { ScheduleData } from '@/app/schedule/upload/page';
import { MdCancel } from 'react-icons/md';
import { DaySelector } from '../../components/ui/schedule/DaySelector';
import { TimeRangeInput } from '../../components/ui/schedule/TimeRangeInput';
import { UnderlineInput } from '../../components/ui/schedule/UnderlineInput';

interface ManualInputProps {
  onComplete: (data: ScheduleData) => void;
  onBack: () => void;
  hideBackButton?: boolean;
}

interface DaySchedule {
  timeFrom: string;
  timeTo: string;
  location?: string;
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

export function ManualInput({
  onComplete,
  onBack,
  hideBackButton = false,
}: ManualInputProps) {
  const [title, setTitle] = useState('');
  const [location, setLocation] = useState('');
  const [notes, setNotes] = useState('');
  const [selectedDay, setSelectedDay] = useState<string | null>(null);
  const [daySchedules, setDaySchedules] = useState<Record<string, DaySchedule>>(
    {}
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const doubleClickRef = useRef(false);
  const lastClickRef = useRef<{ id: string; time: number } | null>(null);

  const handleDayToggle = (dayId: string) => {
    const now = Date.now();
    const last = lastClickRef.current;

    // 🚀 Detect double-click (within 250ms on the same button)
    if (last && last.id === dayId && now - last.time < 250) {
      const exists = !!daySchedules[dayId];
      if (exists) {
        const newSchedules = { ...daySchedules };
        delete newSchedules[dayId];
        setDaySchedules(newSchedules);
        if (selectedDay === dayId) setSelectedDay(null);
      }
      lastClickRef.current = null;
      return;
    }

    // Save the click
    lastClickRef.current = { id: dayId, time: now };

    // SINGLE CLICK — select or add new day
    const exists = !!daySchedules[dayId];

    if (exists) {
      setSelectedDay(dayId);
      return;
    }

    setDaySchedules((prev) => ({
      ...prev,
      [dayId]: { timeFrom: '', timeTo: '' },
    }));
    setSelectedDay(dayId);
  };

  const updateCurrentDayTime = (
    field: 'timeFrom' | 'timeTo',
    value: string
  ) => {
    if (!selectedDay) return;

    setDaySchedules((prev) => ({
      ...prev,
      [selectedDay]: {
        ...prev[selectedDay],
        [field]: value,
      },
    }));
  };

  const handleTimeBlur = (field: 'timeFrom' | 'timeTo') => {
    if (!selectedDay) return;

    const currentValue = daySchedules[selectedDay][field];
    const normalized = normalizeToHHMM(currentValue);

    if (currentValue && !normalized) {
      setError('Please enter a valid time (e.g., 9:00, 09:00, 9am, 5:30pm)');
    } else if (normalized) {
      setDaySchedules((prev) => ({
        ...prev,
        [selectedDay]: {
          ...prev[selectedDay],
          [field]: normalized,
        },
      }));
      setError(null);
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
        const DAYS = [
          { id: 'SUN', fullName: 'Sunday' },
          { id: 'MON', fullName: 'Monday' },
          { id: 'TUE', fullName: 'Tuesday' },
          { id: 'WED', fullName: 'Wednesday' },
          { id: 'THU', fullName: 'Thursday' },
          { id: 'FRI', fullName: 'Friday' },
          { id: 'SAT', fullName: 'Saturday' },
        ];
        const day = DAYS.find((d) => d.id === dayId);
        setError(`Please enter times for ${day?.fullName}`);
        return;
      }

      const normalizedFrom = normalizeToHHMM(schedule.timeFrom);
      const normalizedTo = normalizeToHHMM(schedule.timeTo);

      if (!normalizedFrom || !normalizedTo) {
        const DAYS = [
          { id: 'SUN', fullName: 'Sunday' },
          { id: 'MON', fullName: 'Monday' },
          { id: 'TUE', fullName: 'Tuesday' },
          { id: 'WED', fullName: 'Wednesday' },
          { id: 'THU', fullName: 'Thursday' },
          { id: 'FRI', fullName: 'Friday' },
          { id: 'SAT', fullName: 'Saturday' },
        ];
        const day = DAYS.find((d) => d.id === dayId);
        setError(`Please enter valid times for ${day?.fullName}`);
        return;
      }
    }

    setIsSubmitting(true);

    try {
      setIsSubmitting(true);

      try {
        // Build final unified schedule
        const payload = {
          title,
          workingDays: Object.keys(daySchedules),
          daySchedules: Object.fromEntries(
            Object.entries(daySchedules).map(([day, sched]) => [
              day,
              {
                timeFrom: normalizeToHHMM(sched.timeFrom)!,
                timeTo: normalizeToHHMM(sched.timeTo)!,
              },
            ])
          ),
          location: location || null,
          notes: notes || null,
        };

        console.log('📤 Final payload:', payload);

        const response = await fetch('/api/schedule/save', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });

        if (!response.ok) {
          throw new Error('Failed to save schedule');
        }

        const { schedule } = await response.json();

        onComplete(schedule);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : 'Failed to save schedule'
        );
        setIsSubmitting(false);
      }

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
        <UnderlineInput
          label="Title"
          value={title}
          onChange={setTitle}
          placeholder="Content"
        />

        {/* Working Days */}
        <DaySelector
          selectedDays={Object.keys(daySchedules)}
          onDayToggle={handleDayToggle}
          activeDay={selectedDay}
          showHint={Object.keys(daySchedules).length > 0}
        />

        {/* Time Range - Only show when a day is selected */}
        {selectedDay && currentSchedule ? (
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-lg font-bold text-gray-900 mb-2">
                From
              </label>
              <input
                type="text"
                inputMode="text"
                value={currentSchedule.timeFrom}
                onChange={(e) =>
                  updateCurrentDayTime('timeFrom', e.target.value)
                }
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
        ) : (
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
        <UnderlineInput
          label="Working Location"
          value={location}
          onChange={setLocation}
          placeholder="Location"
        />

        {/* Additional Note */}
        <UnderlineInput
          label="Additional Note"
          value={notes}
          onChange={setNotes}
          placeholder="N/A"
        />

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
