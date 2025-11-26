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
  console.log('🏗️ === GENERATE WEEK SCHEDULE FUNCTION ===');
  console.log('📊 Number of schedules received:', schedules?.length || 0);
  console.log('📋 Schedules:', schedules);
  
  // Default to current week if no start date provided
  const startDate = weekStartDate || getStartOfWeek(new Date());
  console.log('📅 Week start date:', startDate.toDateString());
  
  const weekDays: DaySchedule[] = [];
  
  // Generate 7 days starting from startDate
  for (let i = 0; i < 7; i++) {
    const currentDate = new Date(startDate);
    currentDate.setDate(startDate.getDate() + i);
    
    const dayOfWeek = currentDate.getDay(); // 0-6 (0=Sunday, 1=Monday, etc.)
    
    // Map day number to day code
    const dayCode = Object.keys(DAY_MAP).find(key => DAY_MAP[key] === dayOfWeek) || 'SUN';
    
    console.log(`\n🔍 Checking ${dayCode} (${currentDate.toDateString()})...`);
    
    // Check if any schedule has work on this day
    let hasWork = false;
    let workLocation = '';
    let workTime = '';
    let workTimeEnd = '';
    
    for (const schedule of schedules) {
      console.log(`  📝 Schedule "${schedule.title}"`);
      console.log(`  📆 Working days:`, schedule.workingDays);
      console.log(`  ❓ Includes ${dayCode}?`, schedule.workingDays.includes(dayCode));
      
      // Check if this schedule includes the current day
      if (schedule.workingDays.includes(dayCode)) {
        hasWork = true;
        workLocation = schedule.location || 'Work site';
        workTime = formatTime(schedule.timeFrom);
        workTimeEnd = formatTime(schedule.timeTo);
        console.log(`  ✅ MATCH! Work found for ${dayCode}`);
        console.log(`  📍 Location: ${workLocation}`);
        console.log(`  ⏰ Time: ${workTime}`);
        break; // Use first matching schedule
      }
    }
    
    if (!hasWork) {
      console.log(`  ❌ No work scheduled for ${dayCode}`);
    }
    
    // Check for childcare (you'll need to add childcare logic or table later)
    const hasChildcare = false; // TODO: Check childcare bookings from database
    
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
  
  console.log('\n✨ === FINAL WEEK SCHEDULE ===');
  weekDays.forEach(day => {
    console.log(`${day.day} ${day.date}: ${day.hasWork ? '✅ Work at ' + day.workLocation : '❌ No work'}`);
  });
  
  return weekDays;
}

function getStartOfWeek(date: Date): Date {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1); // Adjust when day is Sunday
  return new Date(d.setDate(diff));
}

function formatTime(time: string): string {
  if (!time) {
    console.warn('⚠️ formatTime received empty time');
    return '';
  }
  
  console.log('🕐 Formatting time:', time);
  
  // Handle both "HH:MM:SS" and "HH:MM" formats
  const parts = time.split(':');
  const hours = parseInt(parts[0]);
  const minutes = parts[1] || '00';
  
  const ampm = hours >= 12 ? 'PM' : 'AM';
  const displayHour = hours % 12 || 12;
  const formatted = `${displayHour}:${minutes} ${ampm}`;
  
  console.log('🕐 Formatted result:', formatted);
  
  return formatted;
}

export function getMonthYearFromDate(date: Date): string {
  return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
}