"use client";

import React, { useState, useEffect } from "react";
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
} from "@/components/ui/dialog";

export default function Calendar() {
  const [currentEvents, setCurrentEvents] = useState<EventApi[]>([]);
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);
  const [newEventTitle, setNewEventTitle] = useState<string>("");
  const [newEventStartTime, setNewEventStartTime] = useState<string>("");
  const [newEventEndTime, setNewEventEndTime] = useState<string>("");
  const [selectedDate, setSelectedDate] = useState<DateSelectArg | null>(null);
  const [newEventLocation, setNewEventLocation] = useState<string>("");
  const [activeView, setActiveView] = useState<"weekly" | "calendar">(
    "calendar"
  );

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
      let endDate = selectedDate.end;
      let isAllDay = selectedDate.allDay;

      if (newEventStartTime && newEventEndTime) {
        const dateString = startDate.toISOString().split("T")[0];
        startDate = new Date(`${dateString}T${newEventStartTime}`);
        endDate = new Date(`${dateString}T${newEventEndTime}`);
        isAllDay = false;
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

  // Group events by date
  const groupEventsByDate = () => {
    const grouped: { [key: string]: EventApi[] } = {};
    currentEvents.forEach((event) => {
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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Toggle Buttons */}
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
        {/* Calendar Section - Always show on desktop, conditional on mobile */}
        <div
          className={`w-full order-1 lg:order-2 lg:w-2/3 ${
            activeView === "weekly" ? "hidden lg:block" : ""
          }`}
        >
          <div className="bg-white rounded-2xl shadow-lg p-4 lg:p-6">
            <FullCalendar
              height={"auto"}
              plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
              headerToolbar={{
                left: "prev,next today",
                center: "title",
                right: "dayGridMonth,timeGridWeek,timeGridDay",
              }}
              initialView="dayGridMonth"
              editable={true}
              selectable={true}
              selectMirror={true}
              dayMaxEvents={true}
              select={handleDateClick}
              eventClick={handleEventClick}
              eventsSet={(events) => setCurrentEvents(events)}
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
          </div>
        </div>

        {/* Events List Section - Always visible */}
        <div className="w-full order-2 lg:order-1 lg:w-1/3">
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">
              Upcoming Events
            </h2>

            {currentEvents.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-gray-400 text-lg mb-2">📅</div>
                <p className="text-gray-400 italic">No Events Present</p>
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
                      className="border-2 border-black rounded-3xl overflow-hidden bg-white"
                    >
                      {/* Date Header and Events Combined */}
                      <div className="p-5 flex gap-4">
                        {/* Left: Date Section */}
                        <div className="text-center border-r-2 border-gray-200 pr-5 py-2">
                          <div className="text-base text-gray-700 font-medium">
                            {dayOfWeek}
                          </div>
                          <div className="text-5xl font-bold text-gray-900 my-1">
                            {dayOfMonth}
                          </div>
                          <div className="text-base text-gray-600">{month}</div>
                        </div>

                        {/* Right: Events Section */}
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

      {/* Dialog */}
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
