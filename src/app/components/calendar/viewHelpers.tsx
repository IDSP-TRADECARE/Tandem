import { DateHeader } from '../ui/calendar/DateHeader';

type ViewType = 'Today' | 'Weekly' | 'Monthly';

// Get the appropriate header configuration based on active tab
export function getHeadersForView(view: ViewType, date: Date, month: Date, handlers: { onPrevMonth: () => void; onNextMonth: () => void; onPrevDay?: () => void; onNextDay?: () => void }) {
  switch (view) {
    case 'Today':
      return (
        <>
          <DateHeader type="date" date={date} />
          <DateHeader type="today" date={date} />
        </>
      );
    
    case 'Weekly':
      return (
        <>
          <DateHeader type="date" date={date} />
          <DateHeader 
            type="weekly" 
            date={month} 
            onPrevious={handlers.onPrevMonth}
            onNext={handlers.onNextMonth}
          />
        </>
      );
    
    case 'Monthly':
      return (
        <>
          <DateHeader type="date" date={date} />
          <DateHeader 
            type="weekly" 
            date={month}
            onPrevious={handlers.onPrevMonth}
            onNext={handlers.onNextMonth}
          />
          {/* Monthly header placeholder - will add when design is ready */}
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
      return 79; // Default 75%
    case 'Weekly':
      return 81; // Taller for weekly view
    case 'Monthly':
      return 50; // Shorter for monthly view
    default:
      return undefined;
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
export function createMonthHandlers(currentMonth: Date, setCurrentMonth: (date: Date) => void) {
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