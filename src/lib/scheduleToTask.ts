import { Schedule } from '../db/schema';

export interface DaySchedule {
  date: number;
  day: string;
  month: string;
  fullDate: Date;
  hasWork: boolean;
  hasChildcare: boolean;
  workLocation?: string;
  workTime?: string;
  workTimeEnd?: string;
}

const DAY_MAP: Record<string, number> = {
  'SUN': 0,
  'MON': 1,
  'TUE': 2,
  'WED': 3,
  'THU': 4,
  'FRI': 5,
  'SAT': 6,
};

export function generateWeekSchedule(schedules: Schedule[], weekStartDate?: Date): DaySchedule[] {
  // Default to current week if no start date provided
  const startDate = weekStartDate || getStartOfWeek(new Date());
  
  const weekDays: DaySchedule[] = [];
  
  // Generate 7 days starting from startDate
  for (let i = 0; i < 7; i++) {
    const currentDate = new Date(startDate);
    currentDate.setDate(startDate.getDate() + i);
    
    const dayOfWeek = currentDate.getDay(); // 0-6
    const dayCode = Object.keys(DAY_MAP).find(key => DAY_MAP[key] === dayOfWeek) || 'SUN';
    
    // Check if any schedule has work on this day
    let hasWork = false;
    let workLocation = '';
    let workTime = '';
    let workTimeEnd = '';
    
    for (const schedule of schedules) {
      if (schedule.workingDays.includes(dayCode)) {
        hasWork = true;
        workLocation = schedule.location || 'Work site';
        workTime = formatTime(schedule.timeFrom);
        workTimeEnd = formatTime(schedule.timeTo);
        break; // Use first matching schedule
      }
    }
    
    // Check for childcare (you'll need to add childcare logic or table later)
    const hasChildcare = false; // TODO: Check childcare bookings
    
    weekDays.push({
      date: currentDate.getDate(),
      day: currentDate.toLocaleDateString('en-US', { weekday: 'short' }),
      month: currentDate.toLocaleDateString('en-US', { month: 'short' }),
      fullDate: currentDate,
      hasWork,
      hasChildcare,
      workLocation,
      workTime,
      workTimeEnd,
    });
  }
  
  return weekDays;
}

function getStartOfWeek(date: Date): Date {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1); // Adjust when day is Sunday
  return new Date(d.setDate(diff));
}

function formatTime(time: string): string {
  const [hours, minutes] = time.split(':');
  const hour = parseInt(hours);
  const ampm = hour >= 12 ? 'PM' : 'AM';
  const displayHour = hour % 12 || 12;
  return `${displayHour}:${minutes} ${ampm}`;
}

export function getMonthYearFromDate(date: Date): string {
  return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
}