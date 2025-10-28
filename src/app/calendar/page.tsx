"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  formatDate,
  DateSelectArg,
  EventClickArg,
  EventApi,
  EventInput,
} from "@fullcalendar/core";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../components/ui/calendar/dialog";
import { BottomNav } from "../components/Layout/BottomNav";

interface Schedule {
  id: string;
  title: string;
  workingDays: string[];
  timeFrom: string;
  timeTo: string;
  location: string;
}

interface CustomEventInput extends EventInput {
  extendedProps?: {
    location?: string;
    notes?: string;
    type?: string;
  };
}

export default function Calendar() {
  const [currentEvents, setCurrentEvents] = useState<EventApi[]>([]);
  const [allEvents, setAllEvents] = useState<CustomEventInput[]>([]);
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);
  const [monthPickerOpen, setMonthPickerOpen] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<"shift" | "nanny">("shift");
  const [newEventTitle, setNewEventTitle] = useState<string>("");
  const [newEventStartTime, setNewEventStartTime] = useState<string>("");
  const [newEventEndTime, setNewEventEndTime] = useState<string>("");
  const [selectedDate, setSelectedDate] = useState<DateSelectArg | null>(null);
  const [newEventLocation, setNewEventLocation] = useState<string>("");
  const [newEventNotes, setNewEventNotes] = useState<string>("");
  const [activeView, setActiveView] = useState<"weekly" | "calendar">(
    "calendar"
  );
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());
  const [eventDetailOpen, setEventDetailOpen] = useState<boolean>(false);
  const [selectedEvent, setSelectedEvent] = useState<CustomEventInput | null>(null);
  const calendarRef = useRef<FullCalendar>(null);

  useEffect(() => {
    fetchSchedules();
  }, []);

  const fetchSchedules = async () => {
    try {
      setLoading(true);
      console.log("🔍 Fetching schedules from API...");

      const response = await fetch("/api/schedule/week");

      if (!response.ok) {
        throw new Error("Failed to fetch schedules");
      }

      const data = await response.json();
      console.log("✅ Schedules received:", data.schedules);

      setSchedules(data.schedules || []);

      const calendarEvents = generateCalendarEvents(data.schedules || []);
      console.log("📅 Generated calendar events:", calendarEvents);

      const savedCustomEvents = localStorage.getItem("customEvents");
      if (savedCustomEvents) {
        const parsedCustomEvents = JSON.parse(savedCustomEvents);
        const customEventsWithDates = parsedCustomEvents.map((event: CustomEventInput) => ({
          ...event,
          start: new Date(event.start as string),
          end: new Date(event.end as string),
        }));

        const combined = [...calendarEvents, ...customEventsWithDates];
        setAllEvents(combined);
      } else {
        setAllEvents(calendarEvents);
      }
    } catch (error) {
      console.error("❌ Error fetching schedules:", error);
    } finally {
      setLoading(false);
    }
  };

  const generateCalendarEvents = (schedules: Schedule[]): CustomEventInput[] => {
    const events: CustomEventInput[] = [];
    const today = new Date();

    const dayMap: Record<string, number> = {
      SUN: 0,
      MON: 1,
      TUE: 2,
      WED: 3,
      THU: 4,
      FRI: 5,
      SAT: 6,
    };

    for (let i = 0; i < 90; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);

      const dayOfWeek = date.getDay();

      for (const schedule of schedules) {
        const dayCode = Object.keys(dayMap).find(
          (key) => dayMap[key] === dayOfWeek
        );

        if (dayCode && schedule.workingDays.includes(dayCode)) {
          const dateStr = date.toISOString().split("T")[0];

          events.push({
            id: `work-${schedule.id}-${dateStr}`,
            title: `Work: ${schedule.location || "Work"}`,
            start: `${dateStr}T${schedule.timeFrom}`,
            end: `${dateStr}T${schedule.timeTo}`,
            allDay: false,
            backgroundColor: "#c6efce",
            borderColor: "#5f9f6f",
            extendedProps: {
              location: schedule.location,
              type: "work",
            },
          });

          events.push({
            id: `childcare-${schedule.id}-${dateStr}`,
            title: "No Childcare",
            start: `${dateStr}T${schedule.timeFrom}`,
            end: `${dateStr}T${schedule.timeFrom}`,
            allDay: false,
            backgroundColor: "#fff4e6",
            borderColor: "#ffa726",
            extendedProps: {
              type: "childcare",
            },
          });
        }
      }
    }

    return events;
  };

  const saveCustomEvents = () => {
    const customEvents = currentEvents
      .filter(
        (event) =>
          event.extendedProps?.type === "shift" ||
          event.extendedProps?.type === "nanny"
      )
      .map((event) => ({
        id: event.id,
        title: event.title,
        start: event.start?.toISOString(),
        end: event.end?.toISOString(),
        allDay: event.allDay,
        backgroundColor: event.backgroundColor,
        borderColor: event.borderColor,
        extendedProps: event.extendedProps,
      }));

    localStorage.setItem("customEvents", JSON.stringify(customEvents));
  };

  useEffect(() => {
    if (currentEvents.length > 0) {
      saveCustomEvents();
    }
  }, [currentEvents]);

  const getEventsForDate = (date: Date) => {
    const filtered = allEvents.filter((event) => {
      if (!event.start) return false;
      const eventStart =
        event.start instanceof Date
          ? event.start
          : new Date(event.start as string);
      return eventStart.toDateString() === date.toDateString();
    });
    return filtered;
  };

  const getEventsForCurrentMonth = () => {
    const filtered = allEvents.filter((event) => {
      if (!event.start) return false;
      const eventStart =
        event.start instanceof Date
          ? event.start
          : new Date(event.start as string);
      return (
        eventStart.getMonth() === currentMonth.getMonth() &&
        eventStart.getFullYear() === currentMonth.getFullYear()
      );
    });
    return filtered;
  };

  const groupEventsByDateFromAll = () => {
    const filteredEvents = getEventsForCurrentMonth();
    const grouped: { [key: string]: CustomEventInput[] } = {};

    filteredEvents.forEach((event) => {
      if (!event.start) return;
      const eventStart =
        event.start instanceof Date
          ? event.start
          : new Date(event.start as string);

      const dateKey = formatDate(eventStart, {
        year: "numeric",
        month: "short",
        day: "numeric",
      });

      if (!grouped[dateKey]) {
        grouped[dateKey] = [];
      }
      grouped[dateKey].push(event);
    });

    return grouped;
  };

  const handleDateClick = (selectInfo: DateSelectArg) => {
    setSelectedDate(selectInfo);
    setActiveTab("shift");
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setNewEventTitle("");
    setNewEventStartTime("");
    setNewEventEndTime("");
    setNewEventLocation("");
    setNewEventNotes("");
    setActiveTab("shift");
  };

  const handleEventClick = (clickInfo: EventClickArg) => {
    if (
      clickInfo.event.extendedProps?.type === "work" ||
      clickInfo.event.extendedProps?.type === "childcare"
    ) {
      alert(
        "Schedule events cannot be deleted. Please update your schedule in the schedule page."
      );
      return;
    }

    if (
      window.confirm(
        `Are you sure you want to delete the event '${clickInfo.event.title}'?`
      )
    ) {
      clickInfo.event.remove();
    }
  };

  const handleAddEvent = () => {
    if (selectedDate && newEventTitle) {
      const calendarApi = selectedDate.view.calendar;
      calendarApi.unselect();

      let startDate = selectedDate.start;
      let endDate = selectedDate.start;
      let isAllDay = selectedDate.allDay;

      if (newEventStartTime && newEventEndTime) {
        const dateString = startDate.toISOString().split("T")[0];
        startDate = new Date(`${dateString}T${newEventStartTime}`);
        endDate = new Date(`${dateString}T${newEventEndTime}`);
        isAllDay = false;
      } else {
        endDate = startDate;
        isAllDay = true;
      }

      const eventType = activeTab;
      const backgroundColor = eventType === "shift" ? "#c8e6c9" : "#bbdefb";
      const borderColor = eventType === "shift" ? "#4caf50" : "#2196f3";

      const newEvent: CustomEventInput = {
        id: `${eventType}-${Date.now()}-${newEventTitle}`,
        title: newEventTitle,
        start: startDate,
        end: endDate,
        allDay: isAllDay,
        backgroundColor: backgroundColor,
        borderColor: borderColor,
        extendedProps: {
          location: newEventLocation,
          notes: newEventNotes,
          type: eventType,
        },
      };
      calendarApi.addEvent(newEvent);
      handleCloseDialog();
    }
  };

  const handlePrevMonth = () => {
    const calendarApi = calendarRef.current?.getApi();
    if (calendarApi) {
      calendarApi.prev();
      setCurrentMonth(calendarApi.getDate());
    }
  };

  const handleNextMonth = () => {
    const calendarApi = calendarRef.current?.getApi();
    if (calendarApi) {
      calendarApi.next();
      setCurrentMonth(calendarApi.getDate());
    }
  };

  const handleMonthSelect = (month: number, year: number) => {
    const calendarApi = calendarRef.current?.getApi();
    if (calendarApi) {
      const newDate = new Date(year, month, 1);
      calendarApi.gotoDate(newDate);
      setCurrentMonth(newDate);
      setMonthPickerOpen(false);
    }
  };

  useEffect(() => {
    const calendarApi = calendarRef.current?.getApi();
    if (calendarApi) {
      const today = new Date();
      calendarApi.gotoDate(today);
      setCurrentMonth(today);
    }
  }, []);

  const formatMonthYear = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      month: "short",
      year: "numeric",
    });
  };

  const getCurrentWeekDates = () => {
    const today = new Date();
    const dayOfWeek = today.getDay();
    const daysToMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - daysToMonday);

    const weekDates = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(startOfWeek);
      date.setDate(startOfWeek.getDate() + i);
      weekDates.push(date);
    }
    return weekDates;
  };

  const weekDates = getCurrentWeekDates();

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const years = Array.from({ length: 3000 - 2020 + 1 }, (_, i) => 2020 + i);

  const getEventColor = (eventType: string) => {
    switch (eventType) {
      case "shift":
        return { bg: "#E8F5E9", circle: "#4CAF50", border: "#2E7D32" };
      case "nanny":
        return { bg: "#E3F2FD", circle: "#2196F3", border: "#1565C0" };
      case "work":
        return { bg: "#D4E4F7", circle: "#5C6BC0", border: "#3949AB" };
      case "childcare":
        return { bg: "#FFE4B5", circle: "#FFA726", border: "#F57C00" };
      default:
        return { bg: "#F5F5F5", circle: "#9E9E9E", border: "#616161" };
    }
  };

  const CalendarHeader = () => (
    <div className="mb-6 bg-gradient-to-r from-blue-300 via-blue-200 to-blue-300 rounded-3xl p-6 flex items-center justify-between">
      <button
        onClick={handlePrevMonth}
        className="text-gray-800 hover:text-gray-600 transition-colors"
      >
        <svg
          className="w-10 h-10"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={3}
            d="M15 19l-7-7 7-7"
          />
        </svg>
      </button>

      <button
        onClick={() => setMonthPickerOpen(true)}
        className="flex items-center gap-4 hover:opacity-80 transition-opacity"
      >
        <div className="bg-gray-700 p-3 rounded-xl">
          <svg
            className="w-8 h-8 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
            <circle cx="9" cy="12" r="1" fill="currentColor" />
            <circle cx="12" cy="12" r="1" fill="currentColor" />
            <circle cx="15" cy="12" r="1" fill="currentColor" />
            <circle cx="9" cy="15" r="1" fill="currentColor" />
            <circle cx="12" cy="15" r="1" fill="currentColor" />
            <circle cx="15" cy="15" r="1" fill="currentColor" />
          </svg>
        </div>
        <h2 className="text-4xl lg:text-5xl font-bold text-gray-800">
          {formatMonthYear(currentMonth)}
        </h2>
      </button>

      <button
        onClick={handleNextMonth}
        className="text-gray-800 hover:text-gray-600 transition-colors"
      >
        <svg
          className="w-10 h-10"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={3}
            d="M9 5l7 7-7 7"
          />
        </svg>
      </button>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your schedule...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="lg:hidden flex gap-2 p-4 bg-white sticky top-0 z-10 shadow-sm">
        <button
          className={`flex-1 py-3 px-4 rounded-full font-medium transition-colors ${
            activeView === "weekly"
              ? "bg-blue-900 text-white"
              : "border-2 border-gray-300 bg-white text-gray-700"
          }`}
          onClick={() => setActiveView("weekly")}
        >
          Weekly view
        </button>
        <button
          className={`flex-1 py-3 px-4 rounded-full font-medium transition-colors ${
            activeView === "calendar"
              ? "bg-blue-900 text-white"
              : "border-2 border-gray-300 bg-white text-gray-700"
          }`}
          onClick={() => setActiveView("calendar")}
        >
          Calendar
        </button>
      </div>

      <div className="flex flex-col lg:flex-row w-full gap-6 p-4 lg:p-8">
        <div
          className={`w-full order-1 lg:order-2 lg:w-2/3 ${
            activeView === "weekly" ? "hidden lg:block" : ""
          }`}
        >
          <div className="bg-white rounded-2xl shadow-lg p-4 lg:p-6">
            <CalendarHeader />

            <FullCalendar
              ref={calendarRef}
              height={"auto"}
              plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
              headerToolbar={false}
              initialView="dayGridMonth"
              editable={true}
              selectable={true}
              selectMirror={true}
              dayMaxEvents={true}
              select={handleDateClick}
              eventClick={handleEventClick}
              eventsSet={(events) => setCurrentEvents(events)}
              datesSet={(dateInfo) => {
                const centerDate = new Date(
                  dateInfo.view.currentStart.getFullYear(),
                  dateInfo.view.currentStart.getMonth(),
                  15
                );
                setCurrentMonth(centerDate);
              }}
              events={allEvents}
              eventDisplay="block"
              displayEventTime={false}
            />

            <style jsx global>{`
              .fc .fc-toolbar.fc-header-toolbar {
                display: none;
              }

              @media (min-width: 1025px) {
                .fc .fc-event {
                  margin-bottom: 2px;
                  padding: 2px 4px;
                  font-size: 11px;
                  border-radius: 4px;
                }

                .fc .fc-event-title {
                  font-weight: 500;
                }

                .fc .fc-daygrid-day-frame {
                  min-height: 100px;
                }
              }

              @media (max-width: 1024px) {
                .fc .fc-scrollgrid {
                  border: none !important;
                }

                .fc .fc-scrollgrid td,
                .fc .fc-scrollgrid th {
                  border: none !important;
                }

                .fc .fc-daygrid-day {
                  height: 60px !important;
                  border: none !important;
                  position: relative !important;
                }

                .fc .fc-daygrid-day-number {
                  font-size: 20px !important;
                  font-weight: 600 !important;
                  color: #1e293b !important;
                  padding: 10px !important;
                  width: 100%;
                  text-align: center;
                  cursor: pointer !important;
                }

                .fc .fc-col-header-cell {
                  padding: 12px 0 !important;
                  font-weight: 600 !important;
                  font-size: 13px !important;
                  color: #1e293b !important;
                  border: none !important;
                }

                .fc .fc-daygrid-day.fc-day-today {
                  background-color: transparent !important;
                }

                .fc .fc-daygrid-day.fc-day-today .fc-daygrid-day-number {
                  background-color: #1e293b !important;
                  color: white !important;
                  border-radius: 10px !important;
                  padding: 8px 14px !important;
                  display: inline-block !important;
                  min-width: 40px;
                }

                .fc .fc-daygrid-day-frame {
                  min-height: 60px !important;
                  display: flex;
                  flex-direction: column;
                  align-items: center;
                  justify-content: flex-start;
                  padding-top: 4px;
                  border: none !important;
                  position: relative !important;
                }

                .fc .fc-daygrid-day-top {
                  flex-direction: column;
                  width: 100%;
                  position: relative;
                }

                .fc .fc-daygrid-day-events {
                  position: absolute !important;
                  top: 4px !important;
                  right: 4px !important;
                  display: flex !important;
                  gap: 3px !important;
                  margin: 0 !important;
                  flex-direction: row-reverse !important;
                }

                .fc .fc-daygrid-event-dot {
                  display: none !important;
                }

                .fc .fc-daygrid-event {
                  margin: 0 !important;
                  padding: 0 !important;
                  border: none !important;
                  background: none !important;
                  display: inline-block !important;
                  width: 10px !important;
                  height: 10px !important;
                }

                .fc .fc-event-main {
                  display: none !important;
                }

                .fc .fc-event-title {
                  display: none !important;
                }

                .fc .fc-event-time {
                  display: none !important;
                }

                .fc .fc-daygrid-event-harness {
                  margin: 0 !important;
                }

                .fc .fc-daygrid-event::before {
                  content: "";
                  width: 10px;
                  height: 10px;
                  background-color: #64748b;
                  border-radius: 50%;
                  display: block;
                }

                .fc .fc-daygrid-event:nth-child(1)::before {
                  background-color: #5c6bc0;
                }

                .fc .fc-daygrid-event:nth-child(2)::before {
                  background-color: #66bb6a;
                }

                .fc .fc-daygrid-event:nth-child(3)::before {
                  background-color: #ffa726;
                }

                .fc .fc-daygrid-event:nth-child(n + 4)::before {
                  background-color: #ef5350;
                }

                .fc .fc-daygrid-day-top {
                  cursor: pointer !important;
                }

                .fc .fc-highlight {
                  background: transparent !important;
                }

                .fc .fc-daygrid-event {
                  pointer-events: none !important;
                }
              }
            `}</style>
          </div>
        </div>

        <div className="w-full order-2 lg:order-1 lg:w-1/3">
          {activeView === "weekly" && (
            <div className="lg:hidden bg-white rounded-2xl shadow-lg p-4 mb-6">
              <CalendarHeader />
            </div>
          )}

          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">
              {activeView === "weekly" ? "This Week" : "Upcoming Events"}
            </h2>

            {activeView === "weekly" ? (
              <div className="space-y-4">
                {weekDates.map((date) => {
                  const dayOfWeek = formatDate(date, { weekday: "short" });
                  const dayOfMonth = formatDate(date, { day: "numeric" });
                  const month = formatDate(date, { month: "short" });
                  const isToday =
                    date.toDateString() === new Date().toDateString();

                  const dayEvents = getEventsForDate(date);

                  return (
                    <div
                      key={date.toISOString()}
                      className={`rounded-3xl overflow-hidden bg-white ${
                        isToday
                          ? "border-4 border-blue-500"
                          : "border-4 border-black"
                      }`}
                    >
                      <div className="p-5 flex gap-4">
                        <div className="text-center border-r-2 border-gray-200 pr-5 py-2">
                          <div className="text-base text-gray-700 font-medium">
                            {dayOfWeek}
                          </div>
                          <div className="text-5xl font-bold text-gray-900 my-1">
                            {dayOfMonth}
                          </div>
                          <div className="text-base text-gray-600">{month}</div>
                        </div>

                        <div className="flex-1 py-1">
                          {dayEvents.length === 0 ? (
                            <div className="flex items-center gap-3 p-3 rounded-xl bg-gray-100">
                              <div className="w-6 h-6 rounded-full border-2 border-gray-400 flex-shrink-0"></div>
                              <div className="text-gray-500">
                                Nothing yet! Want to add childcare or work?
                              </div>
                            </div>
                          ) : (
                            <div className="space-y-2">
                              {dayEvents.map((event) => {
                                const eventStart =
                                  typeof event.start === "string"
                                    ? new Date(event.start)
                                    : event.start;
                                const colors = getEventColor(
                                  event.extendedProps?.type || ""
                                );
                                return (
                                  <div
                                    key={event.id}
                                    className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer"
                                    style={{ backgroundColor: colors.bg }}
                                    onClick={() => {
                                      setSelectedEvent(event);
                                      setEventDetailOpen(true);
                                    }}
                                  >
                                    <div
                                      className="w-6 h-6 rounded-full flex-shrink-0"
                                      style={{
                                        backgroundColor: colors.circle,
                                        border: `3px solid ${colors.border}`,
                                      }}
                                    ></div>
                                    <div className="flex-1 min-w-0">
                                      <div className="font-medium text-gray-900 text-base truncate">
                                        {event.title}
                                      </div>
                                      {event.extendedProps?.location && (
                                        <div className="text-sm text-gray-600 truncate mt-0.5">
                                          {event.extendedProps.location}
                                        </div>
                                      )}
                                    </div>
                                    <div className="text-sm text-gray-600 font-medium flex-shrink-0">
                                      {eventStart &&
                                        formatDate(eventStart, {
                                          hour: "numeric",
                                          minute: "2-digit",
                                          hour12: true,
                                        })}
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : getEventsForCurrentMonth().length === 0 ? (
              <div className="text-center py-12">
                <div className="text-gray-400 text-lg mb-2">📅</div>
                <p className="text-gray-400 italic">
                  No Events in {formatMonthYear(currentMonth)}
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {Object.entries(groupEventsByDateFromAll())
                  .sort((a, b) => {
                    const dateA = new Date(a[0]);
                    const dateB = new Date(b[0]);
                    return dateA.getTime() - dateB.getTime();
                  })
                  .map(([date, events]) => {
                    const firstEvent = events[0];
                    const firstEventStart =
                      typeof firstEvent.start === "string"
                        ? new Date(firstEvent.start)
                        : firstEvent.start;
                    if (!firstEventStart) return null;

                    const dayOfWeek = formatDate(firstEventStart, {
                      weekday: "short",
                    });
                    const dayOfMonth = formatDate(firstEventStart, {
                      day: "numeric",
                    });
                    const month = formatDate(firstEventStart, {
                      month: "short",
                    });

                    return (
                      <div
                        key={date}
                        className="border-5 border-black rounded-3xl overflow-hidden bg-white"
                      >
                        <div className="p-5 flex gap-4">
                          <div className="text-center border-r-2 border-gray-200 pr-5 py-2">
                            <div className="text-base text-gray-700 font-medium">
                              {dayOfWeek}
                            </div>
                            <div className="text-5xl font-bold text-gray-900 my-1">
                              {dayOfMonth}
                            </div>
                            <div className="text-base text-gray-600">
                              {month}
                            </div>
                          </div>

                          <div className="flex-1 space-y-2 py-1">
                            {events.map((event) => {
                              const eventStart =
                                typeof event.start === "string"
                                  ? new Date(event.start)
                                  : event.start;
                              const colors = getEventColor(
                                event.extendedProps?.type || ""
                              );
                              return (
                                <div
                                  key={event.id}
                                  className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer group"
                                  style={{ backgroundColor: colors.bg }}
                                  onClick={() => {
                                    setSelectedEvent(event);
                                    setEventDetailOpen(true);
                                  }}
                                >
                                  <div
                                    className="w-4 h-4 rounded-full flex-shrink-0 border-3"
                                    style={{
                                      backgroundColor: colors.circle,
                                      border: `3px solid ${colors.border}`,
                                    }}
                                  ></div>
                                  <div className="flex-1 min-w-0">
                                    <div className="font-medium text-gray-900 text-base truncate">
                                      {event.title}
                                    </div>
                                    {event.extendedProps?.location && (
                                      <div className="text-sm text-gray-600 truncate mt-0.5">
                                        {event.extendedProps.location}
                                      </div>
                                    )}
                                  </div>
                                  <div className="text-sm text-gray-600 font-medium flex-shrink-0">
                                    {eventStart &&
                                      formatDate(eventStart, {
                                        hour: "numeric",
                                        minute: "2-digit",
                                        hour12: true,
                                      })}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    );
                  })}
              </div>
            )}
          </div>
        </div>
      </div>

      <BottomNav />

      {/* Month Picker Dialog */}
      <Dialog open={monthPickerOpen} onOpenChange={setMonthPickerOpen}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">
              Select Month & Year
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-6">
            <button
              onClick={() => {
                const today = new Date();
                handleMonthSelect(today.getMonth(), today.getFullYear());
              }}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-xl transition-colors shadow-md flex items-center justify-center gap-2"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              Go to Today
            </button>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Year
              </label>
              <div className="grid grid-cols-5 gap-2 max-h-48 overflow-y-auto p-2 border border-gray-200 rounded-xl">
                {years.map((year) => (
                  <button
                    key={year}
                    onClick={() =>
                      handleMonthSelect(currentMonth.getMonth(), year)
                    }
                    className={`p-3 rounded-xl font-medium transition-colors ${
                      year === currentMonth.getFullYear()
                        ? "bg-blue-600 text-white"
                        : "bg-gray-100 hover:bg-gray-200 text-gray-700"
                    }`}
                  >
                    {year}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Month
              </label>
              <div className="grid grid-cols-3 gap-2">
                {months.map((month, index) => (
                  <button
                    key={month}
                    onClick={() =>
                      handleMonthSelect(index, currentMonth.getFullYear())
                    }
                    className={`p-3 rounded-xl font-medium transition-colors ${
                      index === currentMonth.getMonth() &&
                      currentMonth.getFullYear() === new Date().getFullYear()
                        ? "bg-blue-600 text-white"
                        : "bg-gray-100 hover:bg-gray-200 text-gray-700"
                    }`}
                  >
                    {month}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Add Event Dialog with Tabs */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">Add Event</DialogTitle>
          </DialogHeader>

          {/* Tabs */}
          <div className="flex gap-2 border-b border-gray-200">
            <button
              onClick={() => setActiveTab("shift")}
              className={`flex-1 py-3 px-4 font-semibold transition-colors relative ${
                activeTab === "shift"
                  ? "text-green-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Add Shift
              {activeTab === "shift" && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-green-600"></div>
              )}
            </button>
            <button
              onClick={() => setActiveTab("nanny")}
              className={`flex-1 py-3 px-4 font-semibold transition-colors relative ${
                activeTab === "nanny"
                  ? "text-blue-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Add Nanny
              {activeTab === "nanny" && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600"></div>
              )}
            </button>
          </div>

          <div className="space-y-4 mt-4">
            {selectedDate && (
              <div className="p-4 bg-blue-50 rounded-xl border border-blue-200">
                <span className="text-lg font-semibold text-blue-900">
                  {formatDate(selectedDate.start, {
                    weekday: "long",
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </span>
              </div>
            )}

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                {activeTab === "shift" ? "Shift Title" : "Nanny Name"}
              </label>
              <input
                type="text"
                placeholder={
                  activeTab === "shift"
                    ? "Enter shift title"
                    : "Enter nanny name"
                }
                value={newEventTitle}
                onChange={(e) => setNewEventTitle(e.target.value)}
                className="w-full border-2 border-gray-200 p-3 rounded-xl text-base focus:border-blue-500 focus:outline-none transition-colors"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Start Time
                </label>
                <input
                  type="time"
                  value={newEventStartTime}
                  onChange={(e) => setNewEventStartTime(e.target.value)}
                  className="w-full border-2 border-gray-200 p-3 rounded-xl text-base focus:border-blue-500 focus:outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  End Time
                </label>
                <input
                  type="time"
                  value={newEventEndTime}
                  onChange={(e) => setNewEventEndTime(e.target.value)}
                  className="w-full border-2 border-gray-200 p-3 rounded-xl text-base focus:border-blue-500 focus:outline-none transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Location
              </label>
              <input
                type="text"
                placeholder="Add location"
                value={newEventLocation}
                onChange={(e) => setNewEventLocation(e.target.value)}
                className="w-full border-2 border-gray-200 p-3 rounded-xl text-base focus:border-blue-500 focus:outline-none transition-colors"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Additional Notes
              </label>
              <textarea
                placeholder="Add any additional notes here..."
                value={newEventNotes}
                onChange={(e) => setNewEventNotes(e.target.value)}
                rows={4}
                className="w-full border-2 border-gray-200 p-3 rounded-xl text-base focus:border-blue-500 focus:outline-none transition-colors resize-none"
              />
            </div>

            <div className="flex gap-2">
              <button
                className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-900 font-semibold p-4 rounded-xl transition-colors"
                onClick={handleCloseDialog}
              >
                Cancel
              </button>
              <button
                className={`flex-1 text-white font-semibold p-4 rounded-xl transition-colors shadow-lg ${
                  activeTab === "shift"
                    ? "bg-green-600 hover:bg-green-700"
                    : "bg-blue-600 hover:bg-blue-700"
                }`}
                onClick={handleAddEvent}
              >
                Save
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Event Detail Dialog */}
      <Dialog open={eventDetailOpen} onOpenChange={setEventDetailOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">
              Event Details
            </DialogTitle>
          </DialogHeader>

          {selectedEvent && (
            <div className="space-y-4">
              {/* Event Type Badge */}
              <div className="flex items-center gap-2">
                <div
                  className="w-4 h-4 rounded-full flex-shrink-0"
                  style={{
                    backgroundColor: getEventColor(
                      selectedEvent.extendedProps?.type || ""
                    ).circle,
                  }}
                ></div>
                <span className="text-sm font-medium text-gray-500 uppercase">
                  {selectedEvent.extendedProps?.type === "shift"
                    ? "Shift"
                    : selectedEvent.extendedProps?.type === "nanny"
                    ? "Nanny"
                    : selectedEvent.extendedProps?.type === "work"
                    ? "Work Schedule"
                    : selectedEvent.extendedProps?.type === "childcare"
                    ? "Childcare Reminder"
                    : "Event"}
                </span>
              </div>

              {/* Event Title */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Title
                </label>
                <p className="text-lg font-medium text-gray-900">
                  {selectedEvent.title}
                </p>
              </div>

              {/* Date & Time */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Date & Time
                </label>
                <div className="space-y-1">
                  {(() => {
                    const eventStart =
                      selectedEvent.start instanceof Date
                        ? selectedEvent.start
                        : new Date(selectedEvent.start as string);
                    const eventEnd =
                      selectedEvent.end instanceof Date
                        ? selectedEvent.end
                        : selectedEvent.end
                        ? new Date(selectedEvent.end as string)
                        : null;

                    return (
                      <>
                        <p className="text-gray-900">
                          📅{" "}
                          {formatDate(eventStart, {
                            weekday: "long",
                            month: "long",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </p>
                        <p className="text-gray-900">
                          🕐{" "}
                          {formatDate(eventStart, {
                            hour: "numeric",
                            minute: "2-digit",
                            hour12: true,
                          })}
                          {eventEnd &&
                            ` - ${formatDate(eventEnd, {
                              hour: "numeric",
                              minute: "2-digit",
                              hour12: true,
                            })}`}
                        </p>
                      </>
                    );
                  })()}
                </div>
              </div>

              {/* Location */}
              {selectedEvent.extendedProps?.location && (
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Location
                  </label>
                  <p className="text-gray-900">
                    📍 {selectedEvent.extendedProps.location}
                  </p>
                </div>
              )}

              {/* Notes */}
              {selectedEvent.extendedProps?.notes && (
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Additional Notes
                  </label>
                  <p className="text-gray-900 whitespace-pre-wrap">
                    {selectedEvent.extendedProps.notes}
                  </p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-2 pt-4">
                {(selectedEvent.extendedProps?.type === "shift" ||
                  selectedEvent.extendedProps?.type === "nanny") && (
                  <button
                    onClick={() => {
                      if (
                        window.confirm(
                          `Are you sure you want to delete "${selectedEvent.title}"?`
                        )
                      ) {
                        const calendarApi = calendarRef.current?.getApi();
                        if (calendarApi && selectedEvent.id) {
                          const calEvent = calendarApi.getEventById(
                            selectedEvent.id as string
                          );
                          if (calEvent) calEvent.remove();
                        }
                        setEventDetailOpen(false);
                      }
                    }}
                    className="flex-1 bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-4 rounded-xl transition-colors"
                  >
                    Delete Event
                  </button>
                )}

                <button
                  onClick={() => setEventDetailOpen(false)}
                  className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-900 font-semibold py-3 px-4 rounded-xl transition-colors"
                >
                  Close
                </button>
              </div>

              {/* Note for schedule events */}
              {(selectedEvent.extendedProps?.type === "work" ||
                selectedEvent.extendedProps?.type === "childcare") && (
                <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-xl">
                  <p className="text-sm text-blue-900">
                    ℹ️ This is a schedule event and cannot be deleted here.
                    Please update your schedule in the Schedule page.
                  </p>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
