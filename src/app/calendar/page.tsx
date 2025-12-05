'use client';

import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  formatDate,
  DateSelectArg,
  EventClickArg,
  EventApi,
  EventInput,
} from '@fullcalendar/core';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '../components/calendar/dialog';
import { BottomNav } from '../components/Layout/BottomNav';
import { GradientBackgroundFull } from '../components/ui/backgrounds/GradientBackgroundFull';
import { HalfBackground } from '../components/ui/backgrounds/HalfBackground';
import { TabBar } from '../components/ui/backgrounds/TabBar';
import {
  getHeadersForView,
  getTopPositionForView,
  createMonthHandlers as createMonthNavigationHandlers,
} from "../components/calendar/viewHelpers";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { IoIosArrowForward } from "react-icons/io";
import { NannyBookingPopup } from "../components/popup/AddNanny";
import { RequestPendingPopup } from "../components/popup/RequestPending";

interface DateCard {
  id: string;
  text: string;
  isEmpty: boolean;
  isWork: boolean;
  type: ViewType;
  timeRange?: string;
  onClick: () => void;
}

interface DateGroup {
  date: string;
  dayName: string;
  dateStr: string;
  month: string;
  isToday: boolean;
  cards: DateCard[];
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
  dailyTimes?: Record<string, { timeFrom: string; timeTo: string }>;
  weekOf?: string;
}

interface CustomEventInput extends EventInput {
  extendedProps?: {
    location?: string;
    notes?: string;
    type?: string;
    weekOf?: string;
  };
}

type ViewType = 'Weekly' | 'Monthly';

const tabs = ['Weekly', 'Monthly'];

export default function Calendar() {
  const router = useRouter();
  const [currentEvents, setCurrentEvents] = useState<EventApi[]>([]);
  const [allEvents, setAllEvents] = useState<CustomEventInput[]>([]);
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [loading, setLoading] = useState(true);
  const [monthPickerOpen, setMonthPickerOpen] = useState<boolean>(false);
  const [activeView, setActiveView] = useState<ViewType>('Weekly');
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());
  const [selectedMonthDate, setSelectedMonthDate] = useState<Date | null>(null);
  const [weekStartDate, setWeekStartDate] = useState<Date>(
    getStartOfCurrentWeek()
  );
  const [eventDetailOpen, setEventDetailOpen] = useState<boolean>(false);
  const [selectedEvent, setSelectedEvent] = useState<CustomEventInput | null>(
    null
  );
  const [editMode, setEditMode] = useState<boolean>(false);
  const [editEventTitle, setEditEventTitle] = useState<string>('');
  const [editEventStartTime, setEditEventStartTime] = useState<string>('');
  const [editEventEndTime, setEditEventEndTime] = useState<string>('');
  const [editEventLocation, setEditEventLocation] = useState<string>('');
  const [editEventNotes, setEditEventNotes] = useState<string>('');
  const calendarRef = useRef<FullCalendar>(null);

  // ⬇️ Jump calendar to the correct schedule week
  useEffect(() => {
    if (calendarRef.current && allEvents.length > 0) {
      const firstEvent = allEvents.find((e) => e.weekOf);

      if (firstEvent?.weekOf) {
        console.log('📆 Jumping to week:', firstEvent.weekOf);
        calendarRef.current.getApi().gotoDate(firstEvent.weekOf);
      }
    }
  }, [allEvents]);

  // Add new state for the nanny booking popup
  const [nannyPopupOpen, setNannyPopupOpen] = useState<boolean>(false);
  const [selectedWorkDetails, setSelectedWorkDetails] = useState<
    { time: string; location: string; dateKey: string } | undefined
  >(undefined);
  const [requestPendingPopupOpen, setRequestPendingPopupOpen] = useState(false);
  const [requestPendingDetails, setRequestPendingDetails] = useState<{
    title: string;
    dateLabel: string;
    timeRange: string;
    location: string;
  } | null>(null);
  const [pendingNannyRequests, setPendingNannyRequests] = useState<Set<string>>(
    new Set()
  );

  const fetchPendingNannyRequests = useCallback(async () => {
    try {
      const res = await fetch("/api/nanny/bookings/pending");
      if (!res.ok) throw new Error("Failed to load pending nanny requests");
      const data = await res.json();
      setPendingNannyRequests(new Set(data.dates ?? []));
    } catch (error) {
      console.error("❌ pending nanny requests:", error);
    }
  }, []);

  const openRequestPendingPopup = useCallback(
    (dateStr: string, timeRange: string, location: string) => {
      const dateLabel = new Date(dateStr).toLocaleDateString("en-US", {
        weekday: "long",
        month: "long",
        day: "numeric",
      });
      setRequestPendingDetails({
        title: "Nanny",
        dateLabel,
        timeRange,
        location,
      });
      setRequestPendingPopupOpen(true);
    },
    []
  );

  const { handlePreviousMonth, handleNextMonth } =
    createMonthNavigationHandlers(currentMonth, setCurrentMonth);
  const topPosition = getTopPositionForView(activeView);

  useEffect(() => {
    fetchSchedules();
    fetchPendingNannyRequests();
  }, [fetchPendingNannyRequests]);

  const fetchSchedules = async () => {
    try {
      setLoading(true);
      console.log('🔍 Fetching schedules from API...');

      const response = await fetch('/api/schedule/week');

      if (!response.ok) {
        throw new Error('Failed to fetch schedules');
      }

      const data = await response.json();
      console.log('✅ Schedules received:', data.schedules);

      setSchedules(data.schedules || []);

      const calendarEvents = generateCalendarEvents(data.schedules || []);
      console.log('📅 Generated calendar events:', calendarEvents);

      const savedCustomEvents = localStorage.getItem('customEvents');
      if (savedCustomEvents) {
        const parsedCustomEvents = JSON.parse(savedCustomEvents);
        const customEventsWithDates = parsedCustomEvents.map(
          (event: CustomEventInput) => ({
            ...event,
            start: new Date(event.start as string),
            end: new Date(event.end as string),
            weekOf: event.weekOf || event.extendedProps?.weekOf,
            extendedProps: {
              ...event.extendedProps,
              weekOf: event.weekOf || event.extendedProps?.weekOf,
            },
          })
        );

        const combined = [...calendarEvents, ...customEventsWithDates];
        setAllEvents(combined);
      } else {
        setAllEvents(calendarEvents);
      }
    } catch (error) {
      console.error('❌ Error fetching schedules:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateCalendarEvents = (
    schedules: Schedule[]
  ): CustomEventInput[] => {
    const events: CustomEventInput[] = [];
    const today = new Date();
    today.setHours(0, 0, 0, 0);

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
      date.setHours(0, 0, 0, 0);

      const dayOfWeek = date.getDay();
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      const dateStr = `${year}-${month}-${day}`;

      const dayCode = Object.keys(dayMap).find(
        (key) => dayMap[key] === dayOfWeek
      );
      if (!dayCode) continue;

      const generatedDayWeek = getStartOfWeek(date).toISOString().slice(0, 10);

      // 🔥 LOOP OVER SCHEDULES
      for (const schedule of schedules) {
        let eventWeek = schedule.weekOf;

        // safety fallback (should not happen once API returns weekOf)
        if (!eventWeek) {
          console.warn(
            '⚠️ Missing schedule.weekOf — using CURRENT week',
            schedule
          );
          eventWeek = getStartOfWeek(new Date()).toISOString().slice(0, 10);
        }

        // only generate events inside the schedule's assigned week
        if (generatedDayWeek !== eventWeek) continue;

        if (!schedule.workingDays.includes(dayCode)) continue;

        if (schedule.deletedDates?.includes(dateStr)) {
          console.log(`⏭️ Skipping deleted date: ${dateStr}`);
          continue;
        }

        const dailyTimes = schedule.dailyTimes || {};
        const dayTimes = dailyTimes[dayCode] || {
          timeFrom: schedule.timeFrom,
          timeTo: schedule.timeTo,
        };

        const edited = schedule.editedDates?.[dateStr];
        const workEdits = edited?.work;
        const childcareEdits = edited?.childcare;

        // WORK
        const workTitle =
          workEdits?.title || `Work: ${schedule.location || schedule.title}`;
        const workTimeFrom = workEdits?.timeFrom || dayTimes.timeFrom;
        const workTimeTo = workEdits?.timeTo || dayTimes.timeTo;

        events.push({
          id: `work-${schedule.id}-${dateStr}`,
          title: workTitle,
          start: `${dateStr}T${workTimeFrom}`,
          end: `${dateStr}T${workTimeTo}`,
          allDay: false,
          backgroundColor: '#D4E3F0',
          borderColor: '#D4E3F0',
          weekOf: eventWeek,
          extendedProps: {
            location: schedule.location || '',
            notes: schedule.notes || '',
            type: 'work',
            weekOf: eventWeek,
          },
        });

        // CHILDCARE
        const childcareTitle = childcareEdits?.title || 'No Childcare';
        const childcareTimeFrom = childcareEdits?.timeFrom || dayTimes.timeFrom;
        const childcareTimeTo = childcareEdits?.timeTo || dayTimes.timeFrom;

        events.push({
          id: `childcare-${schedule.id}-${dateStr}`,
          title: childcareTitle,
          start: `${dateStr}T${childcareTimeFrom}`,
          end: `${dateStr}T${childcareTimeTo}`,
          allDay: false,
          backgroundColor: '#C8D3BC',
          borderColor: '#C8D3BC',
          weekOf: eventWeek,
          extendedProps: {
            location: childcareEdits?.location || '',
            notes: childcareEdits?.notes || '',
            type: 'childcare',
            weekOf: eventWeek,
          },
        });
      }
    }

    console.log('📅 Generated calendar events:', events);
    return events;
  };

  const saveCustomEvents = useCallback(() => {
    const customEvents = currentEvents
      .filter(
        (event) =>
          event.extendedProps?.type === 'shift' ||
          event.extendedProps?.type === 'nanny'
      )
      .map((event) => ({
        id: event.id,
        title: event.title,
        start: event.start?.toISOString(),
        end: event.end?.toISOString(),
        allDay: event.allDay,
        backgroundColor: event.backgroundColor,
        borderColor: event.borderColor,
        weekOf: event.extendedProps?.weekOf ?? currentWeekStart,
        extendedProps: {
          ...event.extendedProps,
          weekOf: event.extendedProps?.weekOf ?? currentWeekStart,
        },
      }));

    localStorage.setItem('customEvents', JSON.stringify(customEvents));
  }, [currentEvents]);

  useEffect(() => {
    if (currentEvents.length > 0) {
      saveCustomEvents();
    }
  }, [currentEvents, saveCustomEvents]);

  function getStartOfCurrentWeek(): Date {
    const today = new Date();
    const dayOfWeek = today.getDay();
    const daysToMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - daysToMonday);
    startOfWeek.setHours(0, 0, 0, 0);
    return startOfWeek;
  }

  const currentWeekStart = getStartOfCurrentWeek().toISOString().slice(0, 10);

  const getEventsForDate = (date: Date) => {
    const selectedWeekStart = weekStartDate.toISOString().slice(0, 10);

    const filtered = allEvents.filter((event) => {
      if (!event.start) return false;

      const eventWeek = event.weekOf || event.extendedProps?.weekOf;
      if (eventWeek !== selectedWeekStart) return false;

      const eventStart =
        event.start instanceof Date
          ? event.start
          : new Date(event.start as string);

      return eventStart.toDateString() === date.toDateString();
    });

    return filtered;
  };

  function getStartOfWeek(date: Date): Date {
    const dayOfWeek = date.getDay();
    const daysToMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
    const startOfWeek = new Date(date);
    startOfWeek.setDate(date.getDate() - daysToMonday);
    startOfWeek.setHours(0, 0, 0, 0);
    return startOfWeek;
  }

  const getCurrentWeekDates = () => {
    const weekDates = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(weekStartDate);
      date.setDate(weekStartDate.getDate() + i);
      weekDates.push(date);
    }
    return weekDates;
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

  const groupEventsByDate = (events: CustomEventInput[]) => {
    const grouped: { [key: string]: CustomEventInput[] } = {};

    events.forEach((event) => {
      if (!event.start) return;
      const eventStart =
        event.start instanceof Date
          ? event.start
          : new Date(event.start as string);

      const year = eventStart.getFullYear();
      const month = String(eventStart.getMonth() + 1).padStart(2, '0');
      const day = String(eventStart.getDate()).padStart(2, '0');
      const dateKey = `${year}-${month}-${day}`;

      if (!grouped[dateKey]) {
        grouped[dateKey] = [];
      }

      grouped[dateKey].push(event);
    });

    return grouped;
  };

  const generateDateGroups = (): DateGroup[] => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const groups: DateGroup[] = [];

    switch (activeView) {
      case 'Weekly': {
        const weekDates = getCurrentWeekDates();

        weekDates.forEach((date) => {
          const dayEvents = getEventsForDate(date);

          if (dayEvents.length === 0) return;

          const normalizedDate = new Date(date);
          normalizedDate.setHours(0, 0, 0, 0);
          const isToday = normalizedDate.getTime() === today.getTime();

          const dayName = date
            .toLocaleDateString('en-US', {
              weekday: 'short',
            })
            .toUpperCase();

          const dateNum = date.getDate().toString();

          const month = date
            .toLocaleDateString('en-US', {
              month: 'short',
            })
            .toUpperCase();

          const dateStr = `${date.getFullYear()}-${String(
            date.getMonth() + 1
          ).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;

          const cards: DateCard[] = [];

          // Get all work events
          const workEvents = dayEvents.filter(
            (event) => event.extendedProps?.type === 'work'
          );

          // Check if this date has any childcare bookings (not "No Childcare")
          const hasChildcareBooking = dayEvents.some(
            (event) =>
              event.extendedProps?.type === 'childcare' &&
              event.title !== 'No Childcare'
          );

          // Add a separate card for EACH work event
          workEvents.forEach((workEvent) => {
            const start =
              workEvent.start instanceof Date
                ? workEvent.start
                : new Date(workEvent.start as string);
            const end =
              workEvent.end instanceof Date
                ? workEvent.end
                : new Date(workEvent.end as string);

            const timeRange = `${start.toLocaleTimeString('en-US', {
              hour: 'numeric',
              minute: '2-digit',
              hour12: true,
            })} - ${end.toLocaleTimeString('en-US', {
              hour: 'numeric',
              minute: '2-digit',
              hour12: true,
            })}`;

            cards.push({
              id: `${workEvent.id}`,
              text: workEvent.title || 'Work',
              timeRange: timeRange,
              isEmpty: false,
              isWork: true,
              type: 'Weekly',
              onClick: () => {
                setSelectedEvent(workEvent);
                setEventDetailOpen(true);
              },
            });
          });

          // Add "No Childcare Booked!" card once if there's work but no childcare
          if (workEvents.length > 0 && !hasChildcareBooking) {
            const firstWork = workEvents[0];
            const start =
              firstWork.start instanceof Date
                ? firstWork.start
                : new Date(firstWork.start as string);

            const timeRange = `${start.toLocaleTimeString('en-US', {
              hour: 'numeric',
              minute: '2-digit',
              hour12: true,
            })} shift`;

            // Check if this date has a pending request
            const hasPendingRequest = pendingNannyRequests.has(dateStr);

            cards.push({
              id: `${dateStr}-childcare-reminder`,
              text: hasPendingRequest
                ? 'Request Pending'
                : 'No Childcare Booked!',
              timeRange: undefined,
              isEmpty: !hasPendingRequest,
              isWork: false,
              type: "Weekly",
              onClick: () => {
                if (hasPendingRequest) {
                  openRequestPendingPopup(
                    dateStr,
                    timeRange,
                    firstWork.extendedProps?.location || "work"
                  );
                } else {
                  setSelectedWorkDetails({
                    time: timeRange,
                    location: firstWork.extendedProps?.location || 'work',
                    dateKey: dateStr,
                  });
                  setNannyPopupOpen(true);
                }
              },
            });
          }

          if (cards.length > 0) {
            groups.push({
              date: dateNum,
              dayName,
              dateStr: `${dayName}, ${dateNum} ${month}`,
              month,
              isToday,
              cards,
            });
          }
        });

        return groups;
      }

      case 'Monthly': {
        const monthEvents = getEventsForCurrentMonth();

        if (monthEvents.length === 0) {
          return [];
        }

        const groupedByDate = groupEventsByDate(monthEvents);

        Object.entries(groupedByDate)
          .sort()
          .forEach(([dateStr, dayEvents]) => {
            const [year, month, day] = dateStr.split('-').map(Number);
            const date = new Date(year, month - 1, day);
            date.setHours(0, 0, 0, 0);
            const isToday = date.getTime() === today.getTime();

            const dayName = date
              .toLocaleDateString('en-US', {
                weekday: 'short',
              })
              .toUpperCase();

            const dateNum = date.getDate().toString();

            const monthStr = date
              .toLocaleDateString('en-US', {
                month: 'short',
              })
              .toUpperCase();

            const cards: DateCard[] = [];

            // Get all work events
            const workEvents = dayEvents.filter(
              (event) => event.extendedProps?.type === 'work'
            );

            // Check if this date has any childcare bookings (not "No Childcare")
            const hasChildcareBooking = dayEvents.some(
              (event) =>
                event.extendedProps?.type === 'childcare' &&
                event.title !== 'No Childcare'
            );

            // Add a separate card for EACH work event
            workEvents.forEach((workEvent) => {
              const start =
                workEvent.start instanceof Date
                  ? workEvent.start
                  : new Date(workEvent.start as string);
              const end =
                workEvent.end instanceof Date
                  ? workEvent.end
                  : new Date(workEvent.end as string);

              const timeRange = `${start.toLocaleTimeString('en-US', {
                hour: 'numeric',
                minute: '2-digit',
                hour12: true,
              })} - ${end.toLocaleTimeString('en-US', {
                hour: 'numeric',
                minute: '2-digit',
                hour12: true,
              })}`;

              cards.push({
                id: `${workEvent.id}`,
                text: workEvent.title || 'Work',
                timeRange: timeRange,
                isEmpty: false,
                isWork: true,
                type: 'Monthly',
                onClick: () => {
                  setSelectedEvent(workEvent);
                  setEventDetailOpen(true);
                },
              });
            });

            // Add "No Childcare Booked!" card once if there's work but no childcare
            if (workEvents.length > 0 && !hasChildcareBooking) {
              const firstWork = workEvents[0];
              const start =
                firstWork.start instanceof Date
                  ? firstWork.start
                  : new Date(firstWork.start as string);

              const timeRange = `${start.toLocaleTimeString('en-US', {
                hour: 'numeric',
                minute: '2-digit',
                hour12: true,
              })} shift`;

              const hasPendingRequest = pendingNannyRequests.has(dateStr);

              cards.push({
                id: `${dateStr}-childcare-reminder`,
                text: hasPendingRequest
                  ? 'Request Pending'
                  : 'No Childcare Booked!',
                timeRange: undefined,
                isEmpty: !hasPendingRequest,
                isWork: false,
                type: 'Monthly',
                onClick: () => {
                  if (hasPendingRequest) {
                    openRequestPendingPopup(
                      dateStr,
                      timeRange,
                      firstWork.extendedProps?.location || "work"
                    );
                  } else {
                    setSelectedWorkDetails({
                      time: timeRange,
                      location: firstWork.extendedProps?.location || 'work',
                      dateKey: dateStr,
                    });
                    setNannyPopupOpen(true);
                  }
                },
              });
            }

            if (cards.length > 0) {
              groups.push({
                date: dateNum,
                dayName,
                dateStr: `${dayName}, ${dateNum} ${monthStr}`,
                month: monthStr,
                isToday,
                cards,
              });
            }
          });

        return groups;
      }

      default:
        return [];
    }
  };

  // Handler for confirming nanny booking
  const handleConfirmNannyBooking = () => {
    setNannyPopupOpen(false);
    // Pass the dateKey through URL params so we can mark it as pending when returning
    if (selectedWorkDetails?.dateKey) {
      router.push(`/nanny/book/form?returnDate=${selectedWorkDetails.dateKey}`);
    } else {
      router.push('/nanny/book/form');
    }
  };

  const parseScheduleEventId = (
    eventId: string
  ): { scheduleId: string; date: string } | null => {
    const parts = eventId?.split('-') ?? [];
    if (parts.length < 5) return null;

    const date = parts.slice(-3).join('-');
    const scheduleId = parts.slice(1, -3).join('-');
    return scheduleId && date ? { scheduleId, date } : null;
  };

  const handleMonthDateSelect = (date: Date) => {
    setSelectedMonthDate(date);

    const weekStart = getStartOfWeek(date);
    setWeekStartDate(weekStart);
  };

  const getEventsForSelectedDate = () => {
    if (!selectedMonthDate) return [];
    return getEventsForDate(selectedMonthDate);
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

    calEvent.setProp('title', editEventTitle);

    if (editEventStartTime && editEventEndTime && calEvent.start) {
      const dateString = calEvent.start.toISOString().split('T')[0];
      const newStart = new Date(`${dateString}T${editEventStartTime}`);
      const newEnd = new Date(`${dateString}T${editEventEndTime}`);
      calEvent.setStart(newStart);
      calEvent.setEnd(newEnd);
      calEvent.setAllDay(false);
    }

    calEvent.setExtendedProp('location', editEventLocation);
    calEvent.setExtendedProp('notes', editEventNotes);

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
      selectedEvent.extendedProps?.type === 'work' ||
      selectedEvent.extendedProps?.type === 'childcare'
    ) {
      try {
        const eventId = selectedEvent.id as string;
        const meta = parseScheduleEventId(eventId);
        if (meta && calEvent.start && calEvent.end) {
          const response = await fetch('/api/schedule/event', {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
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
            console.error('Failed to update schedule event');
          }
        }
      } catch (error) {
        console.error('Error updating schedule event:', error);
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
      case 'shift':
        return {
          bg: '#dcfce7',
          border: '#16a34a',
          circle: '#16a34a',
        };
      case 'nanny':
        return {
          bg: '#dbeafe',
          border: '#2563eb',
          circle: '#2563eb',
        };
      case 'work':
        return {
          bg: '#fef3c7',
          border: '#f59e0b',
          circle: '#f59e0b',
        };
      case 'childcare':
        return {
          bg: '#fce7f3',
          border: '#ec4899',
          circle: '#ec4899',
        };
      default:
        return {
          bg: '#f3f4f6',
          border: '#6b7280',
          circle: '#6b7280',
        };
    }
  };

  const getEventsByDate = () => {
    const eventsByDate: Record<
      string,
      Array<{ type: string; weekOf: string | null }>
    > = {};

    allEvents.forEach((event) => {
      if (!event.start) return;

      const eventStart =
        event.start instanceof Date
          ? event.start
          : new Date(event.start as string);

      const year = eventStart.getFullYear();
      const month = String(eventStart.getMonth() + 1).padStart(2, '0');
      const day = String(eventStart.getDate()).padStart(2, '0');
      const dateKey = `${year}-${month}-${day}`;

      if (!eventsByDate[dateKey]) {
        eventsByDate[dateKey] = [];
      }

      if (event.extendedProps?.type) {
        eventsByDate[dateKey].push({
          type: event.extendedProps.type,
          weekOf: event.extendedProps.weekOf ?? null, // ⬅️ REQUIRED FIX
        });
      }
    });

    return eventsByDate;
  };

  useEffect(() => {
    if (activeView === 'Weekly' && !selectedMonthDate) {
      setWeekStartDate(getStartOfCurrentWeek());
    }
  }, [activeView, selectedMonthDate]);

  useEffect(() => {
    if (pendingNannyRequests.size === 0 || allEvents.length === 0) return;

    const workDates = new Set(
      allEvents
        .filter((event) => event.extendedProps?.type === "work" && event.start)
        .map((event) => {
          const start =
            event.start instanceof Date
              ? event.start
              : new Date(event.start as string);
          return start.toISOString().split("T")[0];
        })
    );

    const staleDates = [...pendingNannyRequests].filter(
      (date) => !workDates.has(date)
    );

    if (staleDates.length === 0) return;

    staleDates.forEach((date) => {
      fetch("/api/nanny/bookings/pending", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ date }),
      }).catch((err) =>
        console.error("Failed to delete stale pending request", date, err)
      );
    });

    setPendingNannyRequests((prev) => {
      const updated = new Set(prev);
      staleDates.forEach((date) => updated.delete(date));
      return updated;
    });
  }, [allEvents, pendingNannyRequests]);

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
      <div style={{ display: 'none' }}>
        <FullCalendar
          ref={calendarRef}
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          editable={true}
          selectable={true}
          events={allEvents}
          eventsSet={(events) => setCurrentEvents(events)}
        />
      </div>

      {getHeadersForView(activeView, weekStartDate, currentMonth, {
        onPrevMonth: handlePreviousMonth,
        onNextMonth: handleNextMonth,
        eventsByDate: getEventsByDate(),
        onDateSelect: handleMonthDateSelect,
        currentWeekStart: weekStartDate.toISOString().slice(0, 10), // FIX
      })}

      <HalfBackground topPosition={topPosition}>
        <TabBar
          tabs={tabs}
          activeTab={activeView}
          onTabChange={(tab) => setActiveView(tab as ViewType)}
        />
        <div
          className="overflow-y-auto overflow-x-hidden overscroll-contain pb-4"
          style={{
            height:
              activeView === 'Monthly'
                ? 'calc(100vh - 500px)'
                : 'calc(100vh - 280px)',
            WebkitOverflowScrolling: 'touch',
            scrollbarWidth: 'thin',
          }}
        >
          {generateDateGroups().length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 px-4">
              <div className="mb-4">
                <Image
                  src="/schedule/noTasks.svg"
                  alt="No tasks"
                  width={200}
                  height={200}
                  priority
                />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                No Events Yet
              </h3>
              <p className="text-gray-600 text-center mb-6">
                You don&apos;t have any scheduled events. Start by adding your
                work schedule or booking a nanny.
              </p>
              <button
                onClick={() => (window.location.href = '/schedule/upload')}
                className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-colors shadow-lg hover:shadow-xl"
              >
                Upload Schedule
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-6 px-4 py-4">
              {generateDateGroups().map((group) => (
                <div
                  key={group.dateStr}
                  className={`flex gap-4 ${
                    group.isToday ? 'bg-blue-50 rounded-3xl p-3' : ''
                  }`}
                >
                  {/* Date Label */}
                  <div className="flex flex-col items-center min-w-[60px] flex-shrink-0">
                    <p
                      className={`text-xs uppercase font-semibold ${
                        group.isToday ? 'text-blue-600' : 'text-gray-500'
                      }`}
                    >
                      {group.dayName}
                    </p>
                    <p
                      className={`text-4xl font-bold leading-none ${
                        group.isToday ? 'text-blue-600' : 'text-black'
                      }`}
                    >
                      {group.date}
                    </p>
                    <p
                      className={`text-xs uppercase ${
                        group.isToday ? 'text-blue-600' : 'text-gray-500'
                      }`}
                    >
                      {group.month}
                    </p>
                  </div>

                  {/* Cards for this date */}
                  <div className="flex-1 flex flex-col gap-3">
                    {group.cards.map((card) => {
                      // Determine bar color: orange for pending, gray for no childcare, green for work, blue for childcare
                      const barColor =
                        card.text === 'Request Pending'
                          ? '#f97316' // Orange for pending requests
                          : card.isEmpty
                          ? '#b0b0b8' // Gray for no childcare
                          : card.isWork
                          ? '#6bb064' // Green for work
                          : '#255495'; // Blue for childcare

                      return (
                        <button
                          key={card.id}
                          onClick={card.onClick}
                          className="relative bg-white rounded-3xl shadow-lg px-6 py-4 flex items-center justify-between w-full min-h-[80px] hover:shadow-xl transition-shadow overflow-hidden"
                        >
                          <div
                            className="absolute left-0 top-0 bottom-0 w-3 rounded-l-3xl"
                            style={{ backgroundColor: barColor }}
                          />
                          {card.isEmpty || card.text === 'Request Pending' ? (
                            <h2 className="text-[16px] font-medium text-black">
                              {card.text}
                            </h2>
                          ) : (
                            <div className="flex flex-col items-start gap-1">
                              {card.timeRange && (
                                <p className="text-sm text-gray-600 font-normal">
                                  {card.timeRange}
                                </p>
                              )}
                              <h2 className="text-[16px] font-medium text-black">
                                {card.text}
                              </h2>
                            </div>
                          )}
                          <IoIosArrowForward
                            size={28}
                            color="#b0b0b8"
                            className="z-10"
                          />
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </HalfBackground>

      {/* Event Detail Dialog - Keep existing code */}
      <Dialog open={eventDetailOpen} onOpenChange={handleEventDetailClose}>
        <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">
              {editMode ? 'Edit Event' : 'Event Details'}
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
                          selectedEvent.extendedProps?.type || ''
                        ).circle,
                      }}
                    ></div>
                    <span className="text-sm font-medium text-gray-500 uppercase">
                      {selectedEvent.extendedProps?.type === 'shift'
                        ? 'Shift'
                        : selectedEvent.extendedProps?.type === 'nanny'
                        ? 'Nanny'
                        : selectedEvent.extendedProps?.type === 'work'
                        ? 'Work Schedule'
                        : selectedEvent.extendedProps?.type === 'childcare'
                        ? 'Childcare Reminder'
                        : 'Event'}
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
                              📅{' '}
                              {formatDate(eventStart, {
                                weekday: 'long',
                                month: 'long',
                                day: 'numeric',
                                year: 'numeric',
                              })}
                            </p>
                            <p className="text-gray-900">
                              🕐{' '}
                              {formatDate(eventStart, {
                                hour: 'numeric',
                                minute: '2-digit',
                                hour12: true,
                              })}
                              {eventEnd &&
                                ` - ${formatDate(eventEnd, {
                                  hour: 'numeric',
                                  minute: '2-digit',
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
                        setEditEventTitle(selectedEvent.title || '');
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
                          selectedEvent.extendedProps?.location || ''
                        );
                        setEditEventNotes(
                          selectedEvent.extendedProps?.notes || ''
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
                              selectedEvent.extendedProps?.type === 'work' ||
                              selectedEvent.extendedProps?.type === 'childcare'
                            ) {
                              const eventId = selectedEvent.id as string;
                              const meta = parseScheduleEventId(eventId);
                              if (meta) {
                                await fetch('/api/schedule/event', {
                                  method: 'DELETE',
                                  headers: {
                                    'Content-Type': 'application/json',
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

      {/* Nanny Booking Popup */}
      <NannyBookingPopup
        isOpen={nannyPopupOpen}
        onClose={() => setNannyPopupOpen(false)}
        onConfirm={handleConfirmNannyBooking}
        workDetails={selectedWorkDetails}
      />

      {/* Request Pending Popup */}
      <RequestPendingPopup
        isOpen={requestPendingPopupOpen}
        onClose={() => setRequestPendingPopupOpen(false)}
        details={requestPendingDetails ?? undefined}
      />

      <BottomNav />
    </GradientBackgroundFull>
  );
}
