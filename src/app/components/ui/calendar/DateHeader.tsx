'use client';
import { typography } from '@/app/styles/typography';
import { useState } from 'react';
import { IoIosNotifications } from "react-icons/io";

type HeaderType = 'date' | 'today' | 'weekly' | 'monthly';

interface DateHeaderProps {
  type: HeaderType;
  date?: Date;
}

export function DateHeader({ type, date = new Date()}: DateHeaderProps) {
  const [selectedDay, setSelectedDay] = useState(new Date());

  // Format date as "Aug 25, 2025"
  const formatDate = (d: Date) => {
    return d.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  // Get array of 5 days starting from a base date
  const getFiveDays = (baseDate: Date) => {
    const days = [];
    for (let i = 0; i < 5; i++) {
      const day = new Date(baseDate);
      day.setDate(baseDate.getDate() + i);
      days.push(day);
    }
    return days;
  };

  const fiveDays = getFiveDays(date);

  // Date Header - Just "Today" with date and notification
  if (type === 'date') {
    return (
      <div className="flex items-center justify-between px-6 py-8">
        <div className="flex items-baseline gap-3">
          <h1 className={`text-white text-[32px] ${typography.display.h2}`}>Today</h1>
          <span className={`text-white text-[16px] font-light ${typography.body.body}`}>{formatDate(date)}</span>
        </div>
        
        <button className="relative">
          {/* Notification bell */}
          <IoIosNotifications color='white' size={32}/>
        </button>
      </div>
    );
  }

  // Today Header - Date cards for 5 days
  if (type === 'today') {
    return (
      <div className="px-6 pb-2">
        <div className="flex gap-3 justify-between">
          {fiveDays.map((day, index) => {
            const isSelected = day.toDateString() === selectedDay.toDateString();
            const dayNumber = day.getDate();
            const dayName = day.toLocaleDateString('en-US', { weekday: 'short' }).toUpperCase();
            
            return (
              <button
                key={index}
                onClick={() => setSelectedDay(day)}
                className={`flex flex-col items-center justify-center rounded-3xl transition-all p-2 px-1 drop-shadow-2xl ${
                  isSelected 
                    ? 'bg-primary-active text-white shadow-lg' 
                    : 'bg-white text-primary-dark'
                } w-14 h-18`}
              >
                <div className={`font-bold text-[30px] ${typography.display.h2} leading-none mb-1`}>
                  {dayNumber}
                </div>
                <div className={`text-[12px] font-light ${typography.body.label} tracking-wide`}>
                  {dayName}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  // Placeholder for future types
  return null;
}