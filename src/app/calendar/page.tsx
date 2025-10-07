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
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { start } from "repl";

export default function Calendar() {
  const [currentEvents, setCurrentEvents] = useState<EventApi[]>([]);
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);
  const [newEventTitle, setNewEventTitle] = useState<string>("");
  const [selectedDate, setSelectedDate] = useState<DateSelectArg | null>(null);

  // Select date to create event
  const handleDateClick = (selectInfo: DateSelectArg) => {
    setSelectedDate(selectInfo);
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setNewEventTitle("");
  };

  const handleEventClick = (clickInfo: EventClickArg) => {
    if (
      window.confirm(
        `Are you sure you want to delete the event '${clickInfo.event.title}'?`
      )
    ) {
      clickInfo.event.remove();
    }

    const handleAddEvent = (e: React.FormEvent) => {
      e.preventDefault();
      if (selectedDate && newEventTitle) {
        const calendarApi = selectedDate.view.calendar;
        calendarApi.unselect(); // clear date selection

        const newEvent = {
          id: `${selectedDate?.start.toISOString()}-${newEventTitle}`,
          title: newEventTitle,
          start: selectedDate?.start,
          end: selectedDate?.end,
          allDay: selectedDate?.allDay,
        };
        calendarApi.addEvent(newEvent);
        handleCloseDialog();
      }
    };

    return (
      <div className="flex w-full px-10 justify-start items-start gap-8">
        <div className="w-3/12">
          <div className="py-10 text-2xl font-extrabold px-7">
            Calendar Events
          </div>
        </div>
      </div>
    );
  };
}
