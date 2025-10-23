"use client";

import React, { useState, useEffect, use } from "react";
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
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { start } from "repl";
import { format } from "path";

export default function Calendar() {
  const [currentEvents, setCurrentEvents] = useState<EventApi[]>([]);
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);
  const [newEventTitle, setNewEventTitle] = useState<string>("");
  const [newEventStartTime, setNewEventStartTime] = useState<string>("");
  const [newEventEndTime, setNewEventEndTime] = useState<string>("");
  const [selectedDate, setSelectedDate] = useState<DateSelectArg | null>(null);
  const [newEventLocation, setNewEventLocation] = useState<string>("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedEvents = localStorage.getItem("savedEvents");
      if (savedEvents) {
        const parsedEvents = JSON.parse(savedEvents);
        // Convert date strings back to Date objects
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
  }, []); // load saved events on component mount

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("savedEvents", JSON.stringify(currentEvents));
    }
  }, [currentEvents]); // save events to localStorage whenever they change

  // Select date to create event
  const handleDateClick = (selectInfo: DateSelectArg) => {
    setSelectedDate(selectInfo);
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setNewEventTitle("");
    setNewEventStartTime("");
    setNewEventEndTime("");
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

  const handleAddEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedDate && newEventTitle) {
      const calendarApi = selectedDate.view.calendar;
      calendarApi.unselect(); // clear date selection

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

  return (
    <>
      <div className="flex w-full px-10 justify-start items-start gap-8">
        <div className="w-3/12">
          <div className="py-10 text-2xl font-extrabold px-7">
            Calendar Events
          </div>
          <ul className="space-y-4">
            {currentEvents.length <= 0 && (
              <div className="italic text-center text-gray-400">
                No Events Present
              </div>
            )}

            {currentEvents.length > 0 &&
              currentEvents.map((event: EventApi) => (
                <li
                  className="border border-gray-200 shadow px-4 py-2 rounded-md text-blue-800"
                  key={event.id}
                >
                  {event.title}
                  <br />
                  <label className="text-slate-950">
                    {formatDate(event.start!, {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </label>
                  <br />

                  <label className="text-slate-950">
                    {formatDate(event.start!, {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                    {" - "}
                    {formatDate(event.end!, {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </label>
                  {event.extendedProps?.location && (
                    <>
                      <br />
                      <label className="text-slate-600 text-sm">
                        📍 {event.extendedProps.location}
                      </label>
                    </>
                  )}
                </li>
              ))}
          </ul>
        </div>
        <div className="w-9/12 mt-8">
          <FullCalendar
            height={"85vh"}
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
            eventsSet={(events) => setCurrentEvents(events)} // update current events
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
            } // load initial events from localStorage - to save on the user computer to save and track events
          />
        </div>
      </div>
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Shift</DialogTitle>
          </DialogHeader>
          <form className="space-x-5 mb-4" onSubmit={handleAddEvent}>
            {selectedDate && (
              <div className="mb-4 p-3 bg-gray-100 rounded-md border border-gray-300">
                <span className="text-lg font-medium">
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
              <h2>Addition notes</h2>

              <input
                type="text"
                placeholder="Notes"
                value={newEventTitle}
                onChange={(e) => setNewEventTitle(e.target.value)}
                required
                className="border border-gray-200 p-3 rounded-md text-lg"
              />
            </div>
            <br />
            <div>
              <h2>Start</h2>

              <input
                type="time"
                placeholder="Start Time"
                value={newEventStartTime}
                onChange={(e) => setNewEventStartTime(e.target.value)}
                className="border border-gray-200 p-3 rounded-md text-lg"
              />
            </div>
            <br />
            <div>
              <h2>End</h2>

              <input
                type="time"
                placeholder="End Time"
                value={newEventEndTime}
                onChange={(e) => setNewEventEndTime(e.target.value)}
                className="border border-gray-200 p-3 rounded-md text-lg"
              />
            </div>
            <br />
            <div>
              <h2>Location</h2>
              <input
                type="text"
                placeholder="Location"
                value={newEventLocation}
                onChange={(e) => setNewEventLocation(e.target.value)}
                className="border border-gray-200 p-3 rounded-md text-lg"
              />
            </div>

            <button
              className="bg-green-500 text-white p-3 mt-5 rounded-md"
              type="submit"
            >
              Add Event
            </button>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
