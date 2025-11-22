"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
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
} from "../components/calendar/dialog";
import { BottomNav } from "../components/Layout/BottomNav";
import { GradientBackgroundFull } from "../components/ui/backgrounds/GradientBackgroundFull";
import { HalfBackground } from "../components/ui/backgrounds/HalfBackground";
import { TabBar } from "../components/ui/backgrounds/TabBar";
import {
  getHeadersForView,
  getTopPositionForView,
  createMonthHandlers as createMonthNavigationHandlers,
} from "../components/calendar/viewHelpers";
import { DateCardContainer } from "../components/ui/calendar/DateCard";

// Update the DateCard interface to include timeRange
interface DateCard {
  id: string;
  text: string;
  isEmpty: boolean;
  isWork: boolean;
  type: ViewType;
  date?: string;
  timeRange?: string; // Add this property
  onClick: () => void;
}

interface Schedule {
  id: string;
  title: string;
  workingDays: string[];
  timeFrom: string;
  timeTo: string;
  location: string;
  notes?: string;
  deletedDates?: string[];
  editedDates?: Record<
    string,
    Record<
      string,
      {
        title?: string;
        timeFrom?: string;
        timeTo?: string;
        location?: string;
        notes?: string;
        updatedAt: string;
      }
    >
  >;
}

interface CustomEventInput extends EventInput {
  extendedProps?: {
    location?: string;
    notes?: string;
    type?: string;
  };
}

type ViewType = "Weekly" | "Monthly";

const tabs = ["Weekly", "Monthly"];

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
  const [activeView, setActiveView] = useState<ViewType>("Weekly");
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());
  const [eventDetailOpen, setEventDetailOpen] = useState<boolean>(false);
  const [selectedEvent, setSelectedEvent] = useState<CustomEventInput | null>(
    null
  );
  const [editMode, setEditMode] = useState<boolean>(false);
  const [editEventTitle, setEditEventTitle] = useState<string>("");
  const [editEventStartTime, setEditEventStartTime] = useState<string>("");
  const [editEventEndTime, setEditEventEndTime] = useState<string>("");
  const [editEventLocation, setEditEventLocation] = useState<string>("");
  const [editEventNotes, setEditEventNotes] = useState<string>("");
  const calendarRef = useRef<FullCalendar>(null);

  // Create month navigation handlers
  const { handlePreviousMonth, handleNextMonth } =
    createMonthNavigationHandlers(currentMonth, setCurrentMonth);
  const topPosition = getTopPositionForView(activeView);

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
        const customEventsWithDates = parsedCustomEvents.map(
          (event: CustomEventInput) => ({
            ...event,
            start: new Date(event.start as string),
            end: new Date(event.end as string),
          })
        );

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

  const generateCalendarEvents = (
    schedules: Schedule[]
  ): CustomEventInput[] => {
    const events: CustomEventInput[] = [];
    const today = new Date();

    console.log("📋 Generating events from schedules:", schedules);

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

          // Skip deleted dates
          if (schedule.deletedDates?.includes(dateStr)) {
            console.log(`⏭️ Skipping deleted date: ${dateStr}`);
            continue;
          }

          // Check for edits - IMPORTANT: Log to debug
          const editedDatesForDate = schedule.editedDates?.[dateStr];
          const workEdits = editedDatesForDate?.work;
          const childcareEdits = editedDatesForDate?.childcare;

          if (workEdits) {
            console.log(`✏️ Applying work edits for ${dateStr}:`, workEdits);
          }
          if (childcareEdits) {
            console.log(
              `✏️ Applying childcare edits for ${dateStr}:`,
              childcareEdits
            );
          }

          // Create work event with edits applied
          const workTitle =
            workEdits?.title || `Work: ${schedule.location || "Work"}`;
          const workTimeFrom = workEdits?.timeFrom || schedule.timeFrom;
          const workTimeTo = workEdits?.timeTo || schedule.timeTo;
          const workLocation = workEdits?.location || schedule.location || "";
          const workNotes = workEdits?.notes || schedule.notes || "";

          events.push({
            id: `work-${schedule.id}-${dateStr}`,
            title: workTitle,
            start: `${dateStr}T${workTimeFrom}`,
            end: `${dateStr}T${workTimeTo}`,
            allDay: false,
            backgroundColor: "#D4E3F0",
            borderColor: "#D4E3F0",
            extendedProps: {
              location: workLocation,
              notes: workNotes,
              type: "work",
            },
          });

          // Create childcare event with edits applied
          const childcareTitle = childcareEdits?.title || "No Childcare";
          const childcareTimeFrom =
            childcareEdits?.timeFrom || schedule.timeFrom;
          const childcareTimeTo = childcareEdits?.timeTo || schedule.timeFrom;
          const childcareLocation = childcareEdits?.location || "";
          const childcareNotes = childcareEdits?.notes || "";

          events.push({
            id: `childcare-${schedule.id}-${dateStr}`,
            title: childcareTitle,
            start: `${dateStr}T${childcareTimeFrom}`,
            end: `${dateStr}T${childcareTimeTo}`,
            allDay: false,
            backgroundColor: "#C8D3BC",
            borderColor: "#C8D3BC",
            extendedProps: {
              location: childcareLocation,
              notes: childcareNotes,
              type: "childcare",
            },
          });
        }
      }
    }

    console.log(`✅ Generated ${events.length} events`);
    return events;
  };

  const saveCustomEvents = useCallback(() => {
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
  }, [currentEvents]);

  useEffect(() => {
    if (currentEvents.length > 0) {
      saveCustomEvents();
    }
  }, [currentEvents, saveCustomEvents]);

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

  // Get events for the current week (for Weekly view)
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

  // Get events for the current month (for Monthly view)
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

  const groupEventsByDate = (events: CustomEventInput[]) => {
    const grouped: { [key: string]: CustomEventInput[] } = {};

    events.forEach((event) => {
      if (!event.start) return;
      const eventStart =
        event.start instanceof Date
          ? event.start
          : new Date(event.start as string);

      const dateKey = eventStart.toISOString().split("T")[0];

      // Initialize array if it doesn't exist
      if (!grouped[dateKey]) {
        grouped[dateKey] = [];
      }

      grouped[dateKey].push(event);
    });

    return grouped;
  };

  // Generate date cards based on active view
  const generateDateCards = (): DateCard[] => {
    const today = new Date();

    switch (activeView) {
      case "Weekly": {
        const weekDates = getCurrentWeekDates();
        const cards: DateCard[] = [];

        weekDates.forEach((date) => {
          const dayEvents = getEventsForDate(date);
          const workEvents = dayEvents.filter(
            (e) => e.extendedProps?.type === "work"
          );
          const childcareEvents = dayEvents.filter(
            (e) => e.extendedProps?.type === "childcare"
          );
          const otherEvents = dayEvents.filter(
            (e) =>
              e.extendedProps?.type !== "work" &&
              e.extendedProps?.type !== "childcare"
          );

          const dayName = date.toLocaleDateString("en-US", {
            weekday: "short",
          });
          const dateStr = date.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
          });

          // Add childcare card
          if (childcareEvents.length === 0) {
            cards.push({
              id: `${date.toISOString()}-childcare`,
              text: "No Childcare booked!",
              date: `${dayName}, ${dateStr}`,
              isEmpty: true,
              isWork: false,
              type: "Weekly",
              onClick: () => {
                setSelectedDate({
                  startStr: date.toISOString().split("T")[0],
                } as DateSelectArg);
                setDialogOpen(true);
              },
            });
          } else {
            childcareEvents.forEach((event, idx) => {
              cards.push({
                id: `${date.toISOString()}-childcare-${idx}`,
                text: event.title || "Childcare",
                date: `${dayName}, ${dateStr}`,
                isEmpty: false,
                isWork: false,
                type: "Weekly",
                onClick: () => {
                  setSelectedEvent(event);
                  setEventDetailOpen(true);
                },
              });
            });
          }

          // Add other events card if any
          if (otherEvents.length > 0) {
            cards.push({
              id: `${date.toISOString()}-other`,
              text: `${otherEvents.length} appointment${
                otherEvents.length > 1 ? "s" : ""
              }`,
              date: `${dayName}, ${dateStr}`,
              isEmpty: false,
              isWork: false,
              type: "Weekly",
              onClick: () => {
                if (otherEvents[0]) {
                  setSelectedEvent(otherEvents[0]);
                  setEventDetailOpen(true);
                }
              },
            });
          }

          // Add work card if exists
          if (workEvents.length > 0) {
            const workEvent = workEvents[0];
            const start =
              workEvent.start instanceof Date
                ? workEvent.start
                : new Date(workEvent.start as string);
            const end =
              workEvent.end instanceof Date
                ? workEvent.end
                : new Date(workEvent.end as string);
            const startTime = start.toLocaleTimeString("en-US", {
              hour: "numeric",
              minute: "2-digit",
              hour12: true,
            });
            const endTime = end.toLocaleTimeString("en-US", {
              hour: "numeric",
              minute: "2-digit",
              hour12: true,
            });

            cards.push({
              id: `${date.toISOString()}-work`,
              text: `Work from ${startTime} to ${endTime}`,
              date: `${dayName}, ${dateStr}`,
              isEmpty: false,
              isWork: true,
              type: "Weekly",
              onClick: () => {
                setSelectedEvent(workEvent);
                setEventDetailOpen(true);
              },
            });
          }

          // New: Add shift/nanny events with time details
          const shiftEvents = dayEvents.filter(
            (e) => e.extendedProps?.type === "shift"
          );
          const nannyEvents = dayEvents.filter(
            (e) => e.extendedProps?.type === "nanny"
          );

          // Add shift events with time details
          shiftEvents.forEach((event, idx) => {
            const start =
              event.start instanceof Date
                ? event.start
                : new Date(event.start as string);
            const end =
              event.end instanceof Date
                ? event.end
                : new Date(event.end as string);

            const timeRange = `${start.toLocaleTimeString("en-US", {
              hour: "numeric",
              minute: "2-digit",
              hour12: true,
            })} - ${end.toLocaleTimeString("en-US", {
              hour: "numeric",
              minute: "2-digit",
              hour12: true,
            })}`;

            cards.push({
              id: `${date.toISOString()}-shift-${idx}`,
              text: event.title || "Shift",
              date: `${dayName}, ${dateStr}`,
              timeRange: timeRange,
              isEmpty: false,
              isWork: false,
              type: "Weekly",
              onClick: () => {
                setSelectedEvent(event);
                setEventDetailOpen(true);
              },
            });
          });

          // Add nanny events with time details
          nannyEvents.forEach((event, idx) => {
            const start =
              event.start instanceof Date
                ? event.start
                : new Date(event.start as string);
            const end =
              event.end instanceof Date
                ? event.end
                : new Date(event.end as string);

            const timeRange = `${start.toLocaleTimeString("en-US", {
              hour: "numeric",
              minute: "2-digit",
              hour12: true,
            })} - ${end.toLocaleTimeString("en-US", {
              hour: "numeric",
              minute: "2-digit",
              hour12: true,
            })}`;

            cards.push({
              id: `${date.toISOString()}-nanny-${idx}`,
              text: event.title || "Nanny",
              date: `${dayName}, ${dateStr}`,
              timeRange: timeRange,
              isEmpty: false,
              isWork: false,
              type: "Weekly",
              onClick: () => {
                setSelectedEvent(event);
                setEventDetailOpen(true);
              },
            });
          });
        });

        return cards;
      }

      case "Monthly": {
        // Always show the month overview, regardless of date selection
        const monthEvents = getEventsForCurrentMonth();
        const groupedByDate = groupEventsByDate(monthEvents);
        const cards: DateCard[] = [];

        Object.entries(groupedByDate)
          .sort()
          .forEach(([dateStr, dayEvents]) => {
            const date = new Date(dateStr);
            const dayName = date.toLocaleDateString("en-US", {
              weekday: "short",
            });
            const dateDisplay = date.toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
            });

            // Create separate cards for each event
            dayEvents.forEach((event, index) => {
              // Skip "No Childcare" events in overview
              if (event.title === "No Childcare") return;

              const start =
                event.start instanceof Date
                  ? event.start
                  : new Date(event.start as string);
              const end =
                event.end instanceof Date
                  ? event.end
                  : new Date(event.end as string);

              const timeRange = `${start.toLocaleTimeString("en-US", {
                hour: "numeric",
                minute: "2-digit",
                hour12: true,
              })} - ${end.toLocaleTimeString("en-US", {
                hour: "numeric",
                minute: "2-digit",
                hour12: true,
              })}`;

              cards.push({
                id: `${dateStr}-${event.extendedProps?.type}-${index}`,
                text: event.title || "Event",
                date: `${dayName}, ${dateDisplay}`,
                timeRange: timeRange,
                isEmpty: false,
                isWork: event.extendedProps?.type === "work",
                type: "Monthly",
                onClick: () => {
                  // Keep the original onClick behavior to open details
                  setSelectedEvent(event);
                  setEventDetailOpen(true);
                },
              });
            });
          });

        return cards;
      }

      default:
        return [];
    }
  };

  const parseScheduleEventId = (
    eventId: string
  ): { scheduleId: string; date: string } | null => {
    const parts = eventId?.split("-") ?? [];
    if (parts.length < 5) return null;

    const date = parts.slice(-3).join("-");
    const scheduleId = parts.slice(1, -3).join("-");
    return scheduleId && date ? { scheduleId, date } : null;
  };

  const handleDateClick = (selectInfo: DateSelectArg) => {
    setSelectedDate(selectInfo);
    setActiveTab("shift");
    setDialogOpen(true);
  };

  // Add selected date state for monthly view
  const [selectedMonthDate, setSelectedMonthDate] = useState<Date | null>(null);
  const handleMonthDateSelect = (date: Date) => {
    setSelectedMonthDate(date);

    const calendarApi = calendarRef.current?.getApi();
    if (!calendarApi) return;

    // Extract the date components directly to avoid timezone issues
    const year = date.getFullYear();
    const month = date.getMonth();
    const day = date.getDate();

    // Create a new date using the local date constructor to ensure no timezone shift
    const localDate = new Date(year, month, day, 0, 0, 0, 0);

    const monthStr = (month + 1).toString().padStart(2, "0");
    const dayStr = day.toString().padStart(2, "0");
    const dateString = `${year}-${monthStr}-${dayStr}`;

    // Create a DateSelectArg-like object for consistency
    const selectInfo: DateSelectArg = {
      start: localDate,
      end: localDate,
      startStr: dateString,
      endStr: dateString,
      allDay: true,
      view: calendarApi.view,
      jsEvent: new MouseEvent("click"),
    };

    handleDateClick(selectInfo);
  };

  // Get events for selected date in monthly view
  const getEventsForSelectedDate = () => {
    if (!selectedMonthDate) return [];
    return getEventsForDate(selectedMonthDate);
  };

  const handleAddEvent = () => {
    if (
      !selectedDate ||
      !newEventTitle ||
      !newEventStartTime ||
      !newEventEndTime
    ) {
      alert("Please fill in all required fields");
      return;
    }

    const calendarApi = calendarRef.current?.getApi();
    if (!calendarApi) return;

    const dateString = selectedDate.startStr;
    const startDateTime = new Date(`${dateString}T${newEventStartTime}`);
    const endDateTime = new Date(`${dateString}T${newEventEndTime}`);

    const eventType = activeTab === "shift" ? "shift" : "nanny";
    const eventColor = getEventColor(eventType);

    const newEvent: CustomEventInput = {
      id: `${eventType}-${Date.now()}`,
      title: newEventTitle,
      start: startDateTime,
      end: endDateTime,
      allDay: false,
      backgroundColor: eventColor.bg,
      borderColor: eventColor.border,
      extendedProps: {
        location: newEventLocation,
        notes: newEventNotes,
        type: eventType,
      },
    };

    calendarApi.addEvent(newEvent);
    setAllEvents((prev) => [...prev, newEvent]);
    handleCloseDialog();
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setNewEventTitle("");
    setNewEventStartTime("");
    setNewEventEndTime("");
    setNewEventLocation("");
    setNewEventNotes("");
    setActiveTab("shift");
    setSelectedDate(null);
  };

  const handleEventDetailClose = (open: boolean) => {
    setEventDetailOpen(open);
    if (!open) {
      setEditMode(false);
      setSelectedEvent(null);
    }
  };

  const handleSaveEdit = async () => {
    if (!selectedEvent || !editEventTitle) return;

    const calendarApi = calendarRef.current?.getApi();
    if (!calendarApi) return;

    const calEvent = calendarApi.getEventById(selectedEvent.id as string);
    if (!calEvent) return;

    calEvent.setProp("title", editEventTitle);

    if (editEventStartTime && editEventEndTime && calEvent.start) {
      const dateString = calEvent.start.toISOString().split("T")[0];
      const newStart = new Date(`${dateString}T${editEventStartTime}`);
      const newEnd = new Date(`${dateString}T${editEventEndTime}`);
      calEvent.setStart(newStart);
      calEvent.setEnd(newEnd);
      calEvent.setAllDay(false);
    }

    calEvent.setExtendedProp("location", editEventLocation);
    calEvent.setExtendedProp("notes", editEventNotes);

    setAllEvents((prevEvents) =>
      prevEvents.map((event) =>
        event.id === selectedEvent.id
          ? {
              ...event,
              title: editEventTitle,
              start: calEvent.start || event.start,
              end: calEvent.end || event.end,
              extendedProps: {
                ...event.extendedProps,
                location: editEventLocation,
                notes: editEventNotes,
              },
            }
          : event
      )
    );

    if (
      selectedEvent.extendedProps?.type === "work" ||
      selectedEvent.extendedProps?.type === "childcare"
    ) {
      try {
        const eventId = selectedEvent.id as string;
        const meta = parseScheduleEventId(eventId);
        if (meta && calEvent.start && calEvent.end) {
          const response = await fetch("/api/schedule/event", {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              scheduleId: meta.scheduleId,
              date: meta.date,
              type: selectedEvent.extendedProps?.type,
              updates: {
                title: editEventTitle,
                timeFrom: editEventStartTime,
                timeTo: editEventEndTime,
                location: editEventLocation,
                notes: editEventNotes,
              },
            }),
          });

          if (!response.ok) {
            console.error("Failed to update schedule event");
          }
        }
      } catch (error) {
        console.error("Error updating schedule event:", error);
      }
    }

    setSelectedEvent({
      ...selectedEvent,
      title: editEventTitle,
      start: calEvent.start || selectedEvent.start,
      end: calEvent.end || selectedEvent.end,
      extendedProps: {
        ...selectedEvent.extendedProps,
        location: editEventLocation,
        notes: editEventNotes,
      },
    });

    setEditMode(false);
  };

  const getEventColor = (eventType: string) => {
    switch (eventType) {
      case "shift":
        return {
          bg: "#dcfce7",
          border: "#16a34a",
          circle: "#16a34a",
        };
      case "nanny":
        return {
          bg: "#dbeafe",
          border: "#2563eb",
          circle: "#2563eb",
        };
      case "work":
        return {
          bg: "#fef3c7",
          border: "#f59e0b",
          circle: "#f59e0b",
        };
      case "childcare":
        return {
          bg: "#fce7f3",
          border: "#ec4899",
          circle: "#ec4899",
        };
      default:
        return {
          bg: "#f3f4f6",
          border: "#6b7280",
          circle: "#6b7280",
        };
    }
  };

  // Add function to format events by date for the calendar
  const getEventsByDate = () => {
    const eventsByDate: Record<string, Array<{ type: string }>> = {};

    allEvents.forEach((event) => {
      if (!event.start) return;
      const eventStart =
        event.start instanceof Date
          ? event.start
          : new Date(event.start as string);
      const dateKey = eventStart.toISOString().split("T")[0];

      if (!eventsByDate[dateKey]) {
        eventsByDate[dateKey] = [];
      }

      if (event.extendedProps?.type) {
        eventsByDate[dateKey].push({ type: event.extendedProps.type });
      }
    });

    return eventsByDate;
  };

  // Reset selected date when switching views
  useEffect(() => {
    if (activeView !== "Monthly") {
      setSelectedMonthDate(null);
    }
  }, [activeView]);

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
    <GradientBackgroundFull>
      {/* Hidden FullCalendar for event management */}
      <div style={{ display: "none" }}>
        <FullCalendar
          ref={calendarRef}
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          editable={true}
          selectable={true}
          select={handleDateClick}
          events={allEvents}
          eventsSet={(events) => setCurrentEvents(events)}
        />
      </div>

      {/* Render headers based on active tab */}
      {getHeadersForView(activeView, new Date(), currentMonth, {
        onPrevMonth: handlePreviousMonth,
        onNextMonth: handleNextMonth,
        eventsByDate: getEventsByDate(),
        onDateSelect: handleMonthDateSelect,
      })}

      <HalfBackground topPosition={topPosition}>
        <TabBar
          tabs={tabs}
          activeTab={activeView}
          onTabChange={(tab) => setActiveView(tab as ViewType)}
        />
        <div className="">
          <DateCardContainer cards={generateDateCards()} />
        </div>
      </HalfBackground>

      {/* Add Event Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">
              Add New Event
            </DialogTitle>
          </DialogHeader>

          {selectedDate && (
            <div className="space-y-4">
              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="text-sm text-gray-600">Date</p>
                <p className="text-lg font-semibold text-gray-900">
                  {formatDate(new Date(selectedDate.startStr), {
                    weekday: "long",
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })}
                </p>
              </div>

              <div className="flex border-b-2 border-gray-200">
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

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Event Title <span className="text-red-500">*</span>
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
                    Start Time <span className="text-red-500">*</span>
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
                    End Time <span className="text-red-500">*</span>
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

              <div className="flex gap-2 pt-4">
                <button
                  onClick={handleCloseDialog}
                  className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-900 font-semibold py-3 px-4 rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddEvent}
                  className={`flex-1 text-white font-semibold py-3 px-4 rounded-xl transition-colors ${
                    activeTab === "shift"
                      ? "bg-green-600 hover:bg-green-700"
                      : "bg-blue-600 hover:bg-blue-700"
                  }`}
                >
                  Add Event
                </button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Event Detail Dialog */}
      <Dialog open={eventDetailOpen} onOpenChange={handleEventDetailClose}>
        <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">
              {editMode ? "Edit Event" : "Event Details"}
            </DialogTitle>
          </DialogHeader>

          {selectedEvent && (
            <div className="space-y-4">
              {!editMode ? (
                <>
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

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Title
                    </label>
                    <p className="text-lg font-medium text-gray-900">
                      {selectedEvent.title}
                    </p>
                  </div>

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

                  <div className="flex gap-2 pt-4">
                    <button
                      onClick={() => {
                        setEditEventTitle(selectedEvent.title || "");
                        if (selectedEvent.start && selectedEvent.end) {
                          const start =
                            selectedEvent.start instanceof Date
                              ? selectedEvent.start
                              : new Date(selectedEvent.start as string);
                          const end =
                            selectedEvent.end instanceof Date
                              ? selectedEvent.end
                              : new Date(selectedEvent.end as string);
                          setEditEventStartTime(
                            start.toTimeString().slice(0, 5)
                          );
                          setEditEventEndTime(end.toTimeString().slice(0, 5));
                        }
                        setEditEventLocation(
                          selectedEvent.extendedProps?.location || ""
                        );
                        setEditEventNotes(
                          selectedEvent.extendedProps?.notes || ""
                        );
                        setEditMode(true);
                      }}
                      className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-xl transition-colors"
                    >
                      Edit Event
                    </button>

                    <button
                      onClick={async () => {
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

                            setAllEvents((prevEvents) =>
                              prevEvents.filter(
                                (event) => event.id !== selectedEvent.id
                              )
                            );

                            if (
                              selectedEvent.extendedProps?.type === "work" ||
                              selectedEvent.extendedProps?.type === "childcare"
                            ) {
                              const eventId = selectedEvent.id as string;
                              const meta = parseScheduleEventId(eventId);
                              if (meta) {
                                await fetch("/api/schedule/event", {
                                  method: "DELETE",
                                  headers: {
                                    "Content-Type": "application/json",
                                  },
                                  body: JSON.stringify({
                                    scheduleId: meta.scheduleId,
                                    date: meta.date,
                                    type: selectedEvent.extendedProps?.type,
                                  }),
                                });
                              }
                            }
                          }
                          setEventDetailOpen(false);
                          setEditMode(false);
                          setSelectedEvent(null);
                        }
                      }}
                      className="flex-1 bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-4 rounded-xl transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Event Title
                    </label>
                    <input
                      type="text"
                      placeholder="Enter event title"
                      value={editEventTitle}
                      onChange={(e) => setEditEventTitle(e.target.value)}
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
                        value={editEventStartTime}
                        onChange={(e) => setEditEventStartTime(e.target.value)}
                        className="w-full border-2 border-gray-200 p-3 rounded-xl text-base focus:border-blue-500 focus:outline-none transition-colors"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        End Time
                      </label>
                      <input
                        type="time"
                        value={editEventEndTime}
                        onChange={(e) => setEditEventEndTime(e.target.value)}
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
                      value={editEventLocation}
                      onChange={(e) => setEditEventLocation(e.target.value)}
                      className="w-full border-2 border-gray-200 p-3 rounded-xl text-base focus:border-blue-500 focus:outline-none transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Additional Notes
                    </label>
                    <textarea
                      placeholder="Add any additional notes here..."
                      value={editEventNotes}
                      onChange={(e) => setEditEventNotes(e.target.value)}
                      rows={4}
                      className="w-full border-2 border-gray-200 p-3 rounded-xl text-base focus:border-blue-500 focus:outline-none transition-colors resize-none"
                    />
                  </div>

                  <div className="flex gap-2 pt-4">
                    <button
                      onClick={() => setEditMode(false)}
                      className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-900 font-semibold py-3 px-4 rounded-xl transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSaveEdit}
                      className="flex-1 bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-4 rounded-xl transition-colors"
                    >
                      Save Changes
                    </button>
                  </div>
                </>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      <BottomNav />
    </GradientBackgroundFull>
  );
}
