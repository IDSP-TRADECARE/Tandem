import { DateHeader } from '../ui/calendar/DateHeader';

type ViewType = 'Today' | 'Weekly' | 'Monthly';

// Get the appropriate header configuration based on active tab
export function getHeadersForView(
  view: ViewType,
  date: Date,
  month: Date,
  handlers: {
    onPrevMonth: () => void;
    onNextMonth: () => void;
    onPrevDay?: () => void;
    onNextDay?: () => void;
    eventsByDate?: Record<string, Array<{ type: string }>>;
    onDateSelect?: (date: Date) => void;
    currentWeekStart: string;
  }
) {
  switch (view) {
    case 'Today':
      return (
        <>
          <DateHeader type="date" date={date} currentWeekStart={handlers.currentWeekStart} />
        </>
      );

    case 'Weekly':
      return (
        <>
          <DateHeader type="date" date={date} currentWeekStart={handlers.currentWeekStart} />
          <DateHeader
            type="today"
            date={date}
            onDateSelect={handlers.onDateSelect}
            currentWeekStart={handlers.currentWeekStart}
          />
        </>
      );
    case 'Monthly':
      return (
        <>
          <DateHeader type="date" date={date} currentWeekStart={handlers.currentWeekStart} />
          <DateHeader
            type="monthly"
            date={month}
            onPrevious={handlers.onPrevMonth}
            onNext={handlers.onNextMonth}
            eventsByDate={handlers.eventsByDate}
            onDateSelect={handlers.onDateSelect}
            currentWeekStart={handlers.currentWeekStart} 
          />
        </>
      );

    default:
      return null;
  }
}

// Get the appropriate HalfBackground height based on view
export function getHeightForView(view: ViewType): number | undefined {
  switch (view) {
    case 'Today':
      return undefined; // Will calculate dynamically
    case 'Weekly':
      return undefined; // Will calculate dynamically
    case 'Monthly':
      return undefined; // Will calculate dynamically
    default:
      return undefined;
  }
}

// Calculate top position for HalfBackground based on view
export function getTopPositionForView(view: ViewType): string {
  switch (view) {
    case 'Weekly':
      return '220px'; // After date + today headers
    case 'Monthly':
      // return '450px'; // After date + weekly headers (no today selector)
      return '400px'; // After date + weekly headers (no today selector)
    default:
      return '140px';
  }
}

// Navigate to next month
export function getNextMonth(currentDate: Date): Date {
  const next = new Date(currentDate);
  next.setMonth(next.getMonth() + 1);
  return next;
}

// Navigate to previous month
export function getPreviousMonth(currentDate: Date): Date {
  const prev = new Date(currentDate);
  prev.setMonth(prev.getMonth() - 1);
  return prev;
}

// Navigate to next day
export function getNextDay(currentDate: Date): Date {
  const next = new Date(currentDate);
  next.setDate(next.getDate() + 1);
  return next;
}

// Navigate to previous day
export function getPreviousDay(currentDate: Date): Date {
  const prev = new Date(currentDate);
  prev.setDate(prev.getDate() - 1);
  return prev;
}

// Month navigation handler creator
export function createMonthHandlers(
  currentMonth: Date,
  setCurrentMonth: (date: Date) => void
) {
  return {
    handlePreviousMonth: () => {
      setCurrentMonth(getPreviousMonth(currentMonth));
    },
    handleNextMonth: () => {
      setCurrentMonth(getNextMonth(currentMonth));
    },
  };
}

// TODO: Add function to get events/content for specific date/month
// This will be used to populate the HalfBackground content area
export function getContentForView(view: ViewType, date: Date, month: Date) {
  return {
    view,
    date,
    month,
  };
}
