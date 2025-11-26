'use client';

interface DaySelectorProps {
  selectedDays: string[];
  onDayToggle: (day: string) => void;
  activeDay?: string | null;
  disabled?: boolean;
  showHint?: boolean;
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

export function DaySelector({ 
  selectedDays, 
  onDayToggle, 
  activeDay, 
  disabled = false,
  showHint = false 
}: DaySelectorProps) {
  return (
    <div>
      <label className="block text-lg font-bold text-gray-900 mb-3">
        Working Days
      </label>
      <div className="flex gap-2">
        {DAYS.map((day) => {
          const isSelected = (selectedDays ?? []).includes(day.id);
          const isActive = activeDay === day.id;
          
          return (
            <button
              key={day.id}
              type="button"
              onClick={() => !disabled && onDayToggle(day.id)}
              disabled={disabled && !isSelected}
              className={`w-12 h-12 rounded-full font-bold text-lg transition-all ${
                isSelected
                  ? isActive
                    ? 'bg-green-500 text-white ring-4 ring-green-300'
                    : 'bg-green-400 text-white hover:bg-green-500'
                  : disabled
                    ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    : 'bg-gray-200 text-gray-400 hover:bg-gray-300 cursor-pointer'
              }`}
            >
              {day.label}
            </button>
          );
        })}
      </div>
      {activeDay && (
        <p className="text-xs text-blue-600 mt-2 font-semibold">
          {disabled ? 'Viewing' : 'Editing'}: {DAYS.find(d => d.id === activeDay)?.fullName}
        </p>
      )}
      {showHint && (
        <p className="text-xs text-gray-500 mt-1">
          Click days to add or remove them
        </p>
      )}
    </div>
  );
}