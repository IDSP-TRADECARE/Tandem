import { Schedule } from '../db/schema';

export interface Task {
  id: string;
  title: string;
  subtitle: string;
  time: string;
  type: 'work' | 'childcare';
  completed: boolean;
  date: Date;
}

export function scheduleToTasks(schedule: Schedule): Task[] {
  const tasks: Task[] = [];
  const today = new Date();
  const dayOfWeek = today.toLocaleDateString('en-US', { weekday: 'short' }).toUpperCase();
  
  // Map day names to codes
  const dayMap: Record<string, string> = {
    'SUN': 'SUN',
    'MON': 'MON',
    'TUE': 'TUE',
    'WED': 'WED',
    'THU': 'THU',
    'FRI': 'FRI',
    'SAT': 'SAT',
  };

  const todayCode = dayMap[dayOfWeek];

  // Check if today is a working day
  if (schedule.workingDays.includes(todayCode)) {
    // Create work task
    tasks.push({
      id: `${schedule.id}-work`,
      title: `Work at: ${schedule.location || 'Work site'}`,
      subtitle: `Work from ${formatTime(schedule.timeFrom)} to ${formatTime(schedule.timeTo)}`,
      time: formatTime(schedule.timeFrom),
      type: 'work',
      completed: false,
      date: today,
    });

    // If there's childcare mentioned in notes, create a childcare task
    // This is a simple example - you might want to have a separate childcare table
    if (schedule.notes && (schedule.notes.toLowerCase().includes('childcare') || 
        schedule.notes.toLowerCase().includes('nanny') || 
        schedule.notes.toLowerCase().includes('kid'))) {
      tasks.push({
        id: `${schedule.id}-childcare`,
        title: 'Childcare arrangement',
        subtitle: schedule.notes,
        time: formatTime(schedule.timeFrom),
        type: 'childcare',
        completed: false,
        date: today,
      });
    }
  }

  return tasks;
}

function formatTime(time: string): string {
  // Convert 24-hour format to 12-hour format
  const [hours, minutes] = time.split(':');
  const hour = parseInt(hours);
  const ampm = hour >= 12 ? 'PM' : 'AM';
  const displayHour = hour % 12 || 12;
  return `${displayHour}:${minutes} ${ampm}`;
}