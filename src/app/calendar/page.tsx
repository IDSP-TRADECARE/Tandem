"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  formatDate,
  DateSelectArg,
  EventClickArg,
  EventApi,
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
} from "@/app/components/ui/calendar/dialog";
import { BottomNav } from "../components/Layout/BottomNav";

export default function Calendar() {
  const [currentEvents, setCurrentEvents] = useState<EventApi[]>([]);
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);
  const [monthPickerOpen, setMonthPickerOpen] = useState<boolean>(false);
  const [newEventTitle, setNewEventTitle] = useState<string>("");
  const [newEventStartTime, setNewEventStartTime] = useState<string>("");
  const [newEventEndTime, setNewEventEndTime] = useState<string>("");
  const [selectedDate, setSelectedDate] = useState<DateSelectArg | null>(null);
  const [newEventLocation, setNewEventLocation] = useState<string>("");
  const [activeView, setActiveView] = useState<"weekly" | "calendar">(
    "calendar"
  );
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());
  const calendarRef = useRef<FullCalendar>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedEvents = localStorage.getItem("savedEvents");
      if (savedEvents) {
        const parsedEvents = JSON.parse(savedEvents);
        const eventsWithDates = parsedEvents.map(
          (event: {
            id: string;
            title: string;
            start: string | Date;
            end: string | Date;
            allDay: boolean;
          }) => ({
            ...event,
            start: event.start ? new Date(event.start) : null,
            end: event.end ? new Date(event.end) : null,
          })
        );
        setCurrentEvents(eventsWithDates);
      }
    }
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("savedEvents", JSON.stringify(currentEvents));
    }
  }, [currentEvents]);

  const handleDateClick = (selectInfo: DateSelectArg) => {
    setSelectedDate(selectInfo);
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setNewEventTitle("");
    setNewEventStartTime("");
    setNewEventEndTime("");
    setNewEventLocation("");
  };

  const handleEventClick = (clickInfo: EventClickArg) => {
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

      const newEvent = {
        id: `${startDate.toISOString()}-${newEventTitle}`,
        title: newEventTitle,
        start: startDate,
        end: endDate,
        allDay: isAllDay,
        extendedProps: { location: newEventLocation },
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

  const filterEventsForCurrentMonth = (events: EventApi[]) => {
    return events.filter((event) => {
      if (!event.start) return false;
      const eventDate = new Date(event.start);
      return (
        eventDate.getMonth() === currentMonth.getMonth() &&
        eventDate.getFullYear() === currentMonth.getFullYear()
      );
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

  const groupEventsByDate = () => {
    const filteredEvents = filterEventsForCurrentMonth(currentEvents);
    const grouped: { [key: string]: EventApi[] } = {};
    filteredEvents.forEach((event) => {
      const dateKey = formatDate(event.start!, {
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

  const groupedEvents = groupEventsByDate();
  const filteredEventsCount = filterEventsForCurrentMonth(currentEvents).length;
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

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 3000 - 2020 + 1 }, (_, i) => 2020 + i);

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
              datesSet={(dateInfo) => setCurrentMonth(dateInfo.start)}
              initialEvents={
                typeof window !== "undefined"
                  ? JSON.parse(localStorage.getItem("savedEvents") || "[]").map(
                      (event: {
                        id: string;
                        title: string;
                        start: string | Date;
                        end: string | Date;
                        allDay: boolean;
                      }) => ({
                        ...event,
                        start: event.start ? new Date(event.start) : null,
                        end: event.end ? new Date(event.end) : null,
                      })
                    )
                  : []
              }
            />

            <style jsx global>{`
              .fc .fc-toolbar.fc-header-toolbar {
                display: none;
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
                  const dateKey = formatDate(date, {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  });
                  const dayOfWeek = formatDate(date, { weekday: "short" });
                  const dayOfMonth = formatDate(date, { day: "numeric" });
                  const month = formatDate(date, { month: "short" });
                  const isToday =
                    date.toDateString() === new Date().toDateString();

                  const dayEvents = currentEvents.filter((event) => {
                    if (!event.start) return false;
                    const eventDate = new Date(event.start);
                    return eventDate.toDateString() === date.toDateString();
                  });

                  return (
                    <div
                      key={dateKey}
                      className={`rounded-3xl overflow-hidden bg-white ${
                        isToday
                          ? "border-4 border-purple-500"
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
                              {dayEvents.map((event, idx) => (
                                <div
                                  key={event.id}
                                  className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer"
                                  style={{
                                    backgroundColor:
                                      idx === 0 ? "#D4E4F7" : "#D5EDD8",
                                  }}
                                  onClick={() => {
                                    if (
                                      window.confirm(
                                        `Are you sure you want to delete the event '${event.title}'?`
                                      )
                                    ) {
                                      event.remove();
                                    }
                                  }}
                                >
                                  <div
                                    className="w-6 h-6 rounded-full flex-shrink-0"
                                    style={{
                                      backgroundColor:
                                        idx === 0 ? "#5C6BC0" : "#66BB6A",
                                      border: `3px solid ${
                                        idx === 0 ? "#3949AB" : "#43A047"
                                      }`,
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
                                    {formatDate(event.start!, {
                                      hour: "numeric",
                                      minute: "2-digit",
                                      hour12: true,
                                    })}
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : filteredEventsCount === 0 ? (
              <div className="text-center py-12">
                <div className="text-gray-400 text-lg mb-2">📅</div>
                <p className="text-gray-400 italic">
                  No Events in {formatMonthYear(currentMonth)}
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {Object.entries(groupedEvents).map(([date, events]) => {
                  const firstEvent = events[0];
                  const dayOfWeek = formatDate(firstEvent.start!, {
                    weekday: "short",
                  });
                  const dayOfMonth = formatDate(firstEvent.start!, {
                    day: "numeric",
                  });
                  const month = formatDate(firstEvent.start!, {
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
                          <div className="text-base text-gray-600">{month}</div>
                        </div>

                        <div className="flex-1 space-y-2 py-1">
                          {events.map((event, idx) => (
                            <div
                              key={event.id}
                              className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer group"
                              style={{
                                backgroundColor:
                                  idx === 0 ? "#E8EAF6" : "#E8F5E9",
                              }}
                              onClick={() => {
                                if (
                                  window.confirm(
                                    `Are you sure you want to delete the event '${event.title}'?`
                                  )
                                ) {
                                  event.remove();
                                }
                              }}
                            >
                              <div
                                className="w-4 h-4 rounded-full flex-shrink-0 border-3"
                                style={{
                                  backgroundColor:
                                    idx === 0 ? "#5C6BC0" : "#66BB6A",
                                  border: `3px solid ${
                                    idx === 0 ? "#3949AB" : "#43A047"
                                  }`,
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
                                {formatDate(event.start!, {
                                  hour: "numeric",
                                  minute: "2-digit",
                                  hour12: true,
                                })}
                              </div>
                            </div>
                          ))}
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

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">Add Event</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
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
                Event Title
              </label>
              <input
                type="text"
                placeholder="Enter event title"
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

            <button
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold p-4 rounded-xl transition-colors shadow-lg"
              onClick={handleAddEvent}
            >
              Add Event
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
