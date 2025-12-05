/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { typography } from "@/app/styles/typography";
import { useState, useRef, useEffect } from "react";
import {
  IoIosNotifications,
  IoIosArrowBack,
  IoIosArrowForward,
} from "react-icons/io";
import { useRouter } from "next/navigation";

import { getStartOfWeek } from "@/lib/utils";

type HeaderType = "date" | "today" | "weekly" | "monthly";

interface DateHeaderProps {
  type: HeaderType;
  date?: Date;
  onPrevious?: () => void;
  onNext?: () => void;
  onDateSelect?: (date: Date) => void;
  eventsByDate?: Record<string, Array<{ type: string }>>;
  currentWeekStart: string;
}

export function DateHeader({
  type,
  date = new Date(),
  onPrevious,
  onNext,
  onDateSelect,
  eventsByDate = {},
  currentWeekStart,
}: DateHeaderProps) {
  const router = useRouter();
  // Initialize selectedDay with today's date instead of the date prop
  const [selectedDay, setSelectedDay] = useState(new Date());
  const [visibleRange, setVisibleRange] = useState<{
    start: number;
    end: number;
  }>({ start: 0, end: 4 });
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const dateButtonRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const hasInitialScrolled = useRef(false);

  // Format date as "Aug 25, 2025"
  const formatDate = (d: Date) => {
    return d.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  // Get all days in the current month
  const getAllDaysInMonth = (baseDate: Date) => {
    const year = baseDate.getFullYear();
    const month = baseDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);

    const days = [];
    for (let day = firstDay.getDate(); day <= lastDay.getDate(); day++) {
      days.push(new Date(year, month, day));
    }
    return days;
  };

  const allDays = getAllDaysInMonth(date);

  // Calculate visible dates based on scroll position
  const updateVisibleRange = () => {
    if (!scrollContainerRef.current) return;

    const container = scrollContainerRef.current;
    const scrollLeft = container.scrollLeft;
    const containerWidth = container.clientWidth;
    const itemWidth = 68; // 56px button + 12px gap

    // Calculate first and last visible index
    const firstVisible = Math.floor(scrollLeft / itemWidth);
    const lastVisible = Math.floor((scrollLeft + containerWidth) / itemWidth);

    setVisibleRange({ start: firstVisible, end: lastVisible });
  };

  // Update visible range on scroll
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    container.addEventListener("scroll", updateVisibleRange);
    // Initial calculation
    updateVisibleRange();

    return () => {
      container.removeEventListener("scroll", updateVisibleRange);
    };
  }, []);

  // Auto-scroll to current day on mount for "today" header type
  useEffect(() => {
    if (
      type === "today" &&
      scrollContainerRef.current &&
      !hasInitialScrolled.current
    ) {
      const today = new Date();
      const todayIndex = allDays.findIndex(
        (day) => day.toDateString() === today.toDateString()
      );

      if (todayIndex !== -1) {
        hasInitialScrolled.current = true;
        // Small delay to ensure DOM is fully rendered
        setTimeout(() => {
          const container = scrollContainerRef.current;
          if (container) {
            // Button width (56px) + gap (12px) = 68px per item
            const itemWidth = 68;
            // Position today's date as the second item (index - 1)
            const scrollPosition = Math.max(
              0,
              todayIndex * itemWidth - itemWidth
            );

            container.scrollTo({
              left: scrollPosition,
              behavior: "smooth",
            });

            // Update visible range after scroll
            setTimeout(updateVisibleRange, 150);
          }
        }, 100);
      }
    }
  }, [type, allDays]);

  // Handle day selection and scroll to position
  const handleDayClick = (day: Date, index: number) => {
    setSelectedDay(day);
    if (onDateSelect) {
      onDateSelect(day);
    }

    // Scroll to second position for "today" type
    if (type === "today" && scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      // Button width (56px) + gap (12px) = 68px per item
      const itemWidth = 68;
      // Position selected date as the second item (index - 1)
      const scrollPosition = Math.max(0, index * itemWidth - itemWidth);

      container.scrollTo({
        left: scrollPosition,
        behavior: "smooth",
      });

      // Update visible range after scroll
      setTimeout(updateVisibleRange, 150);
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

    const currentWeekStart = getStartOfWeek(selectedDay)
      .toISOString()
      .slice(0, 10);

    const eventsThisWeek = events.filter(
      (ev: any) => ev.weekOf === currentWeekStart
    );

    return {
      hasWork: eventsThisWeek.some((e) => e.type === "work"),
      hasNanny: eventsThisWeek.some((e) => e.type === "nanny"),
      hasChildcare: eventsThisWeek.some((e) => e.type === "childcare"),
    };
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

        <button
          onClick={() => router.push("/notifications")}
          className="relative"
          aria-label="View notifications"
        >
          {/* Notification bell */}
          <IoIosNotifications color="white" size={32} />
        </button>
      </div>
    );
  }

  // Today Header - Scrollable date cards showing all days in month
  if (type === "today") {
    return (
      <div className="px-6 pb-2 relative">
        <div
          ref={scrollContainerRef}
          className="flex gap-3 overflow-x-auto scrollbar-hide scroll-smooth"
          style={{
            scrollSnapType: "x mandatory",
          }}
        >
          {allDays.map((day, index) => {
            const isSelected =
              day.toDateString() === selectedDay.toDateString();
            const dayNumber = day.getDate();
            const dayName = day
              .toLocaleDateString("en-US", { weekday: "short" })
              .toUpperCase();

            // Apply blur to first and last visible dates
            const isFirstVisible = index === visibleRange.start;
            const isLastVisible = index === visibleRange.end;
            const shouldBlur = isFirstVisible || isLastVisible;

            return (
              <button
                key={index}
                ref={(el) => {
                  dateButtonRefs.current[index] = el;
                }}
                onClick={() => handleDayClick(day, index)}
                style={{
                  scrollSnapAlign: "center",
                  filter: shouldBlur ? "blur(2px)" : "none",
                  opacity: shouldBlur ? 0.6 : 1,
                  transition: "filter 0.2s ease, opacity 0.2s ease",
                }}
                className={`flex flex-col items-center justify-center rounded-3xl transition-all p-2 px-1 drop-shadow-2xl flex-shrink-0 ${
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

  // Monthly Header - Full calendar grid (UNCHANGED)
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
        {/* Month/Year navigation - Keep as is */}
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

        {/* Calendar Grid - Reduced cell size */}
        <div className="px-2">
          {/* Day headers */}
          <div className="grid grid-cols-7 gap-1 mb-1.5">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
              <div
                key={day}
                className="text-center text-xs font-bold text-black py-0.5"
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
                  const { hasNanny, hasWork, hasChildcare } =
                    getEventIndicators(day.fullDate);

                  return (
                    <button
                      key={dayIndex}
                      onClick={() => {
                        if (day.isCurrentMonth) {
                          handleDayClick(day.fullDate, dayIndex);
                        }
                      }}
                      disabled={!day.isCurrentMonth}
                      className={`
                        relative w-8 h-8 mx-auto rounded-xl flex flex-col items-center justify-center
                        transition-all text-base font-bold
                        ${
                          !day.isCurrentMonth
                            ? "text-white opacity-20 cursor-default pointer-events-none"
                            : ""
                        }
                        ${
                          day.isCurrentMonth && !isSelected && !isToday
                            ? "text-white hover:bg-white/20"
                            : ""
                        }
                        ${
                          isToday && !isSelected && day.isCurrentMonth
                            ? "bg-white/30 text-white ring-2 ring-white/50"
                            : ""
                        }
                        ${
                          isSelected && day.isCurrentMonth
                            ? "bg-white text-blue-600 shadow-lg scale-105"
                            : ""
                        }
                      `}
                    >
                      {/* Event indicators - top right corner - only show for current month */}
                      {day.isCurrentMonth && (
                        <div className="absolute top-0.5 right-0.5 flex gap-0.5">
                          {hasWork && (
                            <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                          )}
                          {hasNanny && (
                            <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                          )}
                        </div>
                      )}

                      <span className="relative z-10">{day.date}</span>
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
