'use client';

interface TimeRangeInputProps {
  timeFrom: string;
  timeTo: string;
  onTimeFromChange: (value: string) => void;
  onTimeToChange: (value: string) => void;
  disabled?: boolean;
  formatAs12Hour?: boolean;
}

// Helper to convert 24h time to 12h format
function formatTime12Hour(time24: string): string {
  if (!time24) return '';
  
  const [hours, minutes] = time24.split(':').map(Number);
  const period = hours >= 12 ? 'PM' : 'AM';
  const hours12 = hours === 0 ? 12 : hours > 12 ? hours - 12 : hours;
  
  return `${hours12} ${period}`;
}

export function TimeRangeInput({ 
  timeFrom, 
  timeTo, 
  onTimeFromChange, 
  onTimeToChange,
  disabled = false,
  formatAs12Hour = false
}: TimeRangeInputProps) {
  return (
    <div className="grid grid-cols-2 gap-4">
      <div>
        <label className="block text-lg font-bold text-gray-900 mb-2">
          From
        </label>
        {disabled ? (
          <div className="pb-2 border-b-2 border-gray-900 text-gray-900">
            {formatAs12Hour ? formatTime12Hour(timeFrom) : timeFrom}
          </div>
        ) : (
          <input
            type="time"
            value={timeFrom}
            onChange={(e) => onTimeFromChange(e.target.value)}
            className="w-full pb-2 border-b-2 border-gray-900 focus:outline-none text-gray-900 placeholder-gray-400 bg-transparent"
            placeholder="9:00 or 9am"
          />
        )}
      </div>
      <div>
        <label className="block text-lg font-bold text-gray-900 mb-2">
          To
        </label>
        {disabled ? (
          <div className="pb-2 border-b-2 border-gray-900 text-gray-900">
            {formatAs12Hour ? formatTime12Hour(timeTo) : timeTo}
          </div>
        ) : (
          <input
            type="time"
            value={timeTo}
            onChange={(e) => onTimeToChange(e.target.value)}
            className="w-full pb-2 border-b-2 border-gray-900 focus:outline-none text-gray-900 placeholder-gray-400 bg-transparent"
            placeholder="5:00 or 5pm"
          />
        )}
      </div>
    </div>
  );
}