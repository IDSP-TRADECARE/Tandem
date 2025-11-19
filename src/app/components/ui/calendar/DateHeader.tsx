'use client';
import { typography } from '@/app/styles/typography';
import { useState } from 'react';
import { IoIosNotifications, IoIosArrowBack, IoIosArrowForward } from "react-icons/io";

type HeaderType = 'date' | 'today' | 'weekly' | 'monthly';

interface DateHeaderProps {
  type: HeaderType;
  date?: Date;
  onPrevious?: () => void;
  onNext?: () => void;
  onDateSelect?: (date: Date) => void;
}

export function DateHeader({ type, date = new Date(), onPrevious, onNext, onDateSelect }: DateHeaderProps) {
  const [selectedDay, setSelectedDay] = useState(date);

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

  // Handle day selection
  const handleDayClick = (day: Date) => {
    setSelectedDay(day);
    if (onDateSelect) {
      onDateSelect(day);
    }
  };

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
                onClick={() => handleDayClick(day)}
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

  // Weekly Header - Navigation with month and year
  if (type === 'weekly') {
    const monthYear = date.toLocaleDateString('en-US', { 
      month: 'short', 
      year: 'numeric' 
    });
    
    return (
      <div 
        className="px-6 py-2 flex items-center justify-between rounded-2xl mx-4"
        style={{
          background: 'rgba(255, 255, 255, 0.2)',
          backdropFilter: 'blur(10px)'
        }}
      >
        <button 
          onClick={onPrevious}
          className="p-2 hover:bg-white/20 rounded-full transition-all"
        >
          <IoIosArrowBack size={28} color="white" />
        </button>
        
        <div className={`text-white text-[24px] font-bold ${typography.display.h3}`}>
          {monthYear}
        </div>
        
        <button 
          onClick={onNext}
          className="p-2 hover:bg-white/20 rounded-full transition-all"
        >
          <IoIosArrowForward size={28} color="white" />
        </button>
      </div>
    );
  }

  // Placeholder for future types
  return null;
}