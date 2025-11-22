"use client";
import { typography } from "@/app/styles/typography";
import { useState } from "react";
import {
  IoIosNotifications,
  IoIosArrowBack,
  IoIosArrowForward,
} from "react-icons/io";

type HeaderType = "date" | "today" | "weekly" | "monthly";

interface DateHeaderProps {
  type: HeaderType;
  date?: Date;
  onPrevious?: () => void;
  onNext?: () => void;
  onDateSelect?: (date: Date) => void;
  eventsByDate?: Record<string, Array<{ type: string }>>;
}

export function DateHeader({
  type,
  date = new Date(),
  onPrevious,
  onNext,
  onDateSelect,
  eventsByDate = {},
}: DateHeaderProps) {
  const [selectedDay, setSelectedDay] = useState(date);

  // Format date as "Aug 25, 2025"
  const formatDate = (d: Date) => {
    return d.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
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

  // Get calendar grid for monthly view
  const getCalendarGrid = (currentDate: Date) => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    // First day of the month
    const firstDay = new Date(year, month, 1);
    const startingDayOfWeek = firstDay.getDay(); // 0 = Sunday

    // Last day of the month
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();

    // Previous month's last day
    const prevMonthLastDay = new Date(year, month, 0).getDate();

    const weeks: Array<
      Array<{ date: number; isCurrentMonth: boolean; fullDate: Date }>
    > = [];
    let currentWeek: Array<{
      date: number;
      isCurrentMonth: boolean;
      fullDate: Date;
    }> = [];

    // Fill previous month days
    for (let i = startingDayOfWeek - 1; i >= 0; i--) {
      const prevMonthDate = prevMonthLastDay - i;
      currentWeek.push({
        date: prevMonthDate,
        isCurrentMonth: false,
        fullDate: new Date(year, month - 1, prevMonthDate),
      });
    }

    // Fill current month days
    for (let day = 1; day <= daysInMonth; day++) {
      currentWeek.push({
        date: day,
        isCurrentMonth: true,
        fullDate: new Date(year, month, day),
      });

      if (currentWeek.length === 7) {
        weeks.push(currentWeek);
        currentWeek = [];
      }
    }

    // Fill next month days
    if (currentWeek.length > 0) {
      const remainingDays = 7 - currentWeek.length;
      for (let day = 1; day <= remainingDays; day++) {
        currentWeek.push({
          date: day,
          isCurrentMonth: false,
          fullDate: new Date(year, month + 1, day),
        });
      }
      weeks.push(currentWeek);
    }

    return weeks;
  };

  // Check if a date has events
  const getEventIndicators = (fullDate: Date) => {
    const dateStr = fullDate.toISOString().split("T")[0];
    const events = eventsByDate[dateStr] || [];

    const hasShift = events.some((e) => e.type === "shift");
    const hasNanny = events.some((e) => e.type === "nanny");
    const hasWork = events.some((e) => e.type === "work");
    const hasChildcare = events.some((e) => e.type === "childcare");

    return { hasShift, hasNanny, hasWork, hasChildcare };
  };

  // Date Header - Just "Today" with date and notification
  if (type === "date") {
    return (
      <div className="flex items-center justify-between px-6 py-8">
        <div className="flex items-baseline gap-3">
          <h1 className={`text-white text-[32px] ${typography.display.h2}`}>
            Today
          </h1>
          <span
            className={`text-white text-[16px] font-light ${typography.body.body}`}
          >
            {formatDate(date)}
          </span>
        </div>

        <button className="relative">
          {/* Notification bell */}
          <IoIosNotifications color="white" size={32} />
        </button>
      </div>
    );
  }

  // Today Header - Date cards for 5 days
  if (type === "today") {
    return (
      <div className="px-6 pb-2">
        <div className="flex gap-3 justify-between">
          {fiveDays.map((day, index) => {
            const isSelected =
              day.toDateString() === selectedDay.toDateString();
            const dayNumber = day.getDate();
            const dayName = day
              .toLocaleDateString("en-US", { weekday: "short" })
              .toUpperCase();

            return (
              <button
                key={index}
                onClick={() => handleDayClick(day)}
                className={`flex flex-col items-center justify-center rounded-3xl transition-all p-2 px-1 drop-shadow-2xl ${
                  isSelected
                    ? "bg-primary-active text-white shadow-lg"
                    : "bg-white text-primary-dark"
                } w-14 h-18`}
              >
                <div
                  className={`font-bold text-[30px] ${typography.display.h2} leading-none mb-1`}
                >
                  {dayNumber}
                </div>
                <div
                  className={`text-[12px] font-light ${typography.body.label} tracking-wide`}
                >
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
  if (type === "weekly") {
    const monthYear = date.toLocaleDateString("en-US", {
      month: "short",
      year: "numeric",
    });

    return (
      <div
        className="px-6 py-2 flex items-center justify-between rounded-2xl mx-4"
        style={{
          background: "rgba(255, 255, 255, 0.2)",
          backdropFilter: "blur(10px)",
        }}
      >
        <button
          onClick={onPrevious}
          className="p-2 hover:bg-white/20 rounded-full transition-all"
        >
          <IoIosArrowBack size={28} color="white" />
        </button>

        <div
          className={`text-white text-[24px] font-bold ${typography.display.h3}`}
        >
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

  // Monthly Header - Full calendar grid
  if (type === "monthly") {
    const monthYear = date.toLocaleDateString("en-US", {
      month: "long",
      year: "numeric",
    });

    const calendarGrid = getCalendarGrid(date);
    const today = new Date();
    const todayStr = today.toDateString();

    return (
      <div className="px-4 pb-4">
        {/* Month/Year navigation */}
        <div
          className="px-4 py-3 flex items-center justify-between rounded-2xl mb-4"
          style={{
            background: "rgba(255, 255, 255, 0.2)",
            backdropFilter: "blur(10px)",
          }}
        >
          <button
            onClick={onPrevious}
            className="p-2 hover:bg-white/20 rounded-full transition-all"
          >
            <IoIosArrowBack size={24} color="white" />
          </button>

          <div
            className={`text-white text-[20px] font-bold ${typography.display.h3}`}
          >
            {monthYear}
          </div>

          <button
            onClick={onNext}
            className="p-2 hover:bg-white/20 rounded-full transition-all"
          >
            <IoIosArrowForward size={24} color="white" />
          </button>
        </div>

        {/* Calendar Grid */}
        <div className="bg-white/95 backdrop-blur-sm rounded-3xl p-4 shadow-lg">
          {/* Day headers */}
          <div className="grid grid-cols-7 gap-1 mb-2">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
              <div
                key={day}
                className="text-center text-xs font-bold text-gray-700 py-1"
              >
                {day}
              </div>
            ))}
          </div>

          {/* Calendar days */}
          <div className="space-y-1">
            {calendarGrid.map((week, weekIndex) => (
              <div key={weekIndex} className="grid grid-cols-7 gap-1">
                {week.map((day, dayIndex) => {
                  const isToday = day.fullDate.toDateString() === todayStr;
                  const isSelected =
                    day.fullDate.toDateString() === selectedDay.toDateString();
                  const { hasShift, hasNanny, hasWork, hasChildcare } =
                    getEventIndicators(day.fullDate);
                  const hasAnyEvent =
                    hasShift || hasNanny || hasWork || hasChildcare;

                  return (
                    <button
                      key={dayIndex}
                      onClick={() => {
                        if (day.isCurrentMonth) {
                          handleDayClick(day.fullDate);
                        }
                      }}
                      className={`
                        relative aspect-square rounded-xl flex items-center justify-center
                        transition-all text-sm font-semibold
                        ${
                          !day.isCurrentMonth
                            ? "text-gray-300 cursor-default"
                            : ""
                        }
                        ${
                          day.isCurrentMonth && !isSelected && !isToday
                            ? "text-gray-900 hover:bg-blue-50"
                            : ""
                        }
                        ${
                          isToday && !isSelected
                            ? "bg-blue-100 text-blue-600"
                            : ""
                        }
                        ${isSelected ? "bg-blue-600 text-white shadow-md" : ""}
                      `}
                    >
                      <span className="relative z-10">{day.date}</span>

                      {/* Event indicators */}
                      {day.isCurrentMonth && hasAnyEvent && (
                        <div className="absolute top-1 right-1 flex gap-0.5">
                          {(hasShift || hasNanny) && (
                            <div
                              className={`w-1.5 h-1.5 rounded-full ${
                                hasNanny ? "bg-green-500" : "bg-blue-500"
                              }`}
                            />
                          )}
                          {(hasWork || hasChildcare) && (
                            <div
                              className={`w-1.5 h-1.5 rounded-full ${
                                hasWork ? "bg-yellow-500" : "bg-pink-500"
                              }`}
                            />
                          )}
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return null;
}
