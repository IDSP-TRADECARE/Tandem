'use client';

import { useState, useEffect } from 'react';
import { BottomNav } from '../components/Layout/BottomNav';
import { useRouter } from 'next/navigation';
import { generateWeekSchedule, getMonthYearFromDate, DaySchedule } from '../../lib/scheduleToWeek';

type ViewMode = 'weekly' | 'calendar';

export default function HomePage() {
  const router = useRouter();
  const [viewMode, setViewMode] = useState<ViewMode>('weekly');
  const [currentWeekStart, setCurrentWeekStart] = useState<Date>(getStartOfWeek(new Date()));
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());
  const [weekDays, setWeekDays] = useState<DaySchedule[]>([]);
  const [loading, setLoading] = useState(true);
  const [allSchedules, setAllSchedules] = useState<any[]>([]);

  useEffect(() => {
    fetchSchedules();
  }, []);

  useEffect(() => {
    generateWeekView();
  }, [currentWeekStart, currentMonth, allSchedules, viewMode]);

  const fetchSchedules = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/schedule/week');
      
      if (!response.ok) {
        throw new Error('Failed to fetch schedule');
      }

      const data = await response.json();
      setAllSchedules(data.schedules);
    } catch (error) {
      console.error('Error fetching schedules:', error);
      setAllSchedules([]);
    } finally {
      setLoading(false);
    }
  };

  const generateWeekView = () => {
    // In calendar mode, show the week that includes the selected month
    const startDate = viewMode === 'calendar' 
      ? getStartOfWeek(new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 25)) // Show week of 25th
      : currentWeekStart;
    
    const weekSchedule = generateWeekSchedule(allSchedules, startDate);
    setWeekDays(weekSchedule);
  };

  const goToPreviousWeek = () => {
    const newDate = new Date(currentWeekStart);
    newDate.setDate(newDate.getDate() - 7);
    setCurrentWeekStart(newDate);
  };

  const goToNextWeek = () => {
    const newDate = new Date(currentWeekStart);
    newDate.setDate(newDate.getDate() + 7);
    setCurrentWeekStart(newDate);
  };

  const goToPreviousMonth = () => {
    const newDate = new Date(currentMonth);
    newDate.setMonth(newDate.getMonth() - 1);
    setCurrentMonth(newDate);
  };

  const goToNextMonth = () => {
    const newDate = new Date(currentMonth);
    newDate.setMonth(newDate.getMonth() + 1);
    setCurrentMonth(newDate);
  };

  const currentMonthYear = viewMode === 'weekly' && weekDays.length > 0 
    ? getMonthYearFromDate(weekDays[3]?.fullDate || new Date())
    : getMonthYearFromDate(currentMonth);

  // Generate calendar days
  const getCalendarDays = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    
    const startDay = firstDay.getDay(); // 0 = Sunday
    const daysInMonth = lastDay.getDate();
    
    const days: (Date | null)[] = [];
    
    // Add empty slots for days before month starts
    for (let i = 0; i < startDay; i++) {
      days.push(null);
    }
    
    // Add all days in month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }
    
    return days;
  };

  const hasWorkOnDate = (date: Date | null) => {
    if (!date) return false;
    
    const dayOfWeek = date.toLocaleDateString('en-US', { weekday: 'short' }).toUpperCase();
    const dayMap: Record<string, string> = {
      'SUN': 'SUN', 'MON': 'MON', 'TUE': 'TUE', 'WED': 'WED',
      'THU': 'THU', 'FRI': 'FRI', 'SAT': 'SAT',
    };
    const dayCode = dayMap[dayOfWeek];
    
    return allSchedules.some(schedule => schedule.workingDays.includes(dayCode));
  };

  const isInCurrentWeek = (date: Date | null) => {
    if (!date) return false;
    
    // Check if date is within the displayed week
    return weekDays.some(day => {
      return day.fullDate.toDateString() === date.toDateString();
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-[#1e3a5f] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your schedule...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-32">
      {/* Header with Toggle */}
      <div className="bg-white px-4 pt-8 pb-4">
        {/* View Mode Toggle */}
        <div className="flex gap-0 mb-6 bg-white border-2 border-[#1e3a5f] rounded-full p-1">
          <button
            onClick={() => setViewMode('weekly')}
            className={`flex-1 py-3 px-6 rounded-full font-semibold transition-all ${
              viewMode === 'weekly'
                ? 'bg-[#1e3a5f] text-white'
                : 'bg-white text-[#1e3a5f]'
            }`}
          >
            Weekly view
          </button>
          <button
            onClick={() => setViewMode('calendar')}
            className={`flex-1 py-3 px-6 rounded-full font-semibold transition-all ${
              viewMode === 'calendar'
                ? 'bg-[#1e3a5f] text-white'
                : 'bg-white text-[#1e3a5f]'
            }`}
          >
            Calendar
          </button>
        </div>

        {/* Month Navigation */}
        <div className="flex items-center justify-between bg-[#6fa8dc] rounded-xl px-6 py-4">
          <button 
            onClick={viewMode === 'weekly' ? goToPreviousWeek : goToPreviousMonth}
            className="p-1 hover:bg-white/20 rounded-lg transition-colors"
          >
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <div className="flex items-center gap-2">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span className="text-xl font-bold text-white">{currentMonthYear}</span>
          </div>
          <button 
            onClick={viewMode === 'weekly' ? goToNextWeek : goToNextMonth}
            className="p-1 hover:bg-white/20 rounded-lg transition-colors"
          >
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>

      {/* Calendar Month Grid - Only show in calendar view */}
      {viewMode === 'calendar' && (
        <div className="px-4 py-4">
          <div className="bg-white rounded-2xl p-4 mb-4">
            {/* Day Headers */}
            <div className="grid grid-cols-7 gap-2 mb-2">
              {['Sun', 'Mon', 'Tues', 'Wed', 'Thurs', 'Fri', 'Sat'].map((day) => (
                <div key={day} className="text-center text-xs font-semibold text-gray-600">
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar Days */}
            <div className="grid grid-cols-7 gap-2">
              {getCalendarDays().map((date, index) => (
                <div
                  key={index}
                  className={`aspect-square rounded-lg flex items-center justify-center text-sm font-semibold transition-all relative ${
                    !date
                      ? 'invisible'
                      : isInCurrentWeek(date)
                      ? 'bg-[#1e3a5f] text-white'
                      : hasWorkOnDate(date)
                      ? 'bg-gray-200 text-gray-900'
                      : 'text-gray-600'
                  }`}
                >
                  {date?.getDate()}
                  {date && hasWorkOnDate(date) && !isInCurrentWeek(date) && (
                    <div className="absolute bottom-1 w-1 h-1 bg-[#1e3a5f] rounded-full"></div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Empty State */}
      {weekDays.length === 0 && (
        <div className="px-4 py-12 text-center">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">No schedule yet</h3>
          <p className="text-gray-600 mb-6">Upload your work schedule to get started</p>
          <button
            onClick={() => router.push('/schedule/upload')}
            className="px-6 py-3 bg-[#1e3a5f] text-white font-semibold rounded-lg hover:bg-[#2d4a6f] transition-colors"
          >
            Upload Schedule
          </button>
        </div>
      )}

      {/* Week Schedule Cards - Show in both views */}
      {weekDays.length > 0 && (
        <div className="px-4 py-4 space-y-4">
          {weekDays.map((day, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl border-2 border-gray-900 overflow-hidden"
            >
              <div className="flex">
                {/* Date Section */}
                <div className="w-28 border-r-2 border-gray-900 p-4 flex flex-col items-center justify-center bg-white">
                  <p className="text-sm text-gray-600 font-medium">{day.day}</p>
                  <p className="text-4xl font-bold text-gray-900">{day.date}</p>
                  <p className="text-sm text-gray-600">{day.month}</p>
                </div>

                {/* Content Section */}
                <div className="flex-1 p-3 space-y-2">
                  {/* Childcare Status */}
                  {!day.hasChildcare && day.hasWork && (
                    <div className="flex items-center gap-2 bg-blue-50 border-2 border-blue-200 rounded-xl px-3 py-2">
                      <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-white text-sm font-bold">!</span>
                      </div>
                      <span className="text-sm font-semibold text-gray-800">Drop off kid at Alyssa's</span>
                      <span className="text-sm font-medium text-gray-600 ml-auto">{day.workTime}</span>
                    </div>
                  )}

                  {/* Work Schedule */}
                  {day.hasWork && (
                    <div className="flex items-center gap-2 bg-green-100 border-2 border-green-200 rounded-xl px-3 py-2">
                      <div className="w-6 h-6 bg-transparent border-2 border-green-600 rounded-full flex-shrink-0"></div>
                      <div className="flex-1 flex items-center justify-between">
                        <span className="text-sm font-semibold text-gray-800">
                          Work: {day.workLocation}
                        </span>
                        <span className="text-sm font-medium text-gray-600">{day.workTime}</span>
                      </div>
                    </div>
                  )}

                  {/* No Schedule */}
                  {!day.hasWork && !day.hasChildcare && (
                    <div className="flex items-center gap-2 bg-gray-100 rounded-xl px-3 py-3">
                      <div className="w-6 h-6 bg-transparent border-2 border-gray-400 rounded-full flex-shrink-0"></div>
                      <span className="text-sm text-gray-600">
                        Nothing yet! Want to add childcare or work?
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Book a Nanny Button */}
      <button
        onClick={() => router.push('/nanny/join')}
        className="fixed bottom-32 right-6 bg-[#a8d446] text-[#1e3a5f] px-6 py-3 rounded-xl font-bold shadow-xl hover:scale-105 transition-transform z-40"
      >
        Book a Nanny
      </button>

      {/* Bottom Navigation */}
      <BottomNav />
    </div>
  );
}

// Helper functions
function getStartOfWeek(date: Date): Date {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  return new Date(d.setDate(diff));
}