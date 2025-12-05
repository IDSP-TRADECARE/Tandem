"use client";

import { useEffect, useState } from "react";
import { IoIosArrowBack } from "react-icons/io";
import { useRouter } from "next/navigation";
import { BottomNav } from "../Layout/BottomNav";
import { getStartOfWeek } from "@/lib/utils";

interface Schedule {
  id: string;
  title: string;
  workingDays: string[];
  timeFrom: string;
  timeTo: string;
  location: string;
  notes?: string;
  weekOf?: string;
  dailyTimes?: Record<string, { timeFrom: string; timeTo: string }>;
}

interface NotificationItem {
  id: string;
  date: string;
  fullDate: Date;
  message: string;
  time: string;
  icon: "hourglass" | "calendar";
}

const dayMap: Record<string, number> = {
  SUN: 0,
  MON: 1,
  TUE: 2,
  WED: 3,
  THU: 4,
  FRI: 5,
  SAT: 6,
};

const NotificationIcon = ({ type }: { type: "hourglass" | "calendar" }) => {
  return (
    <div className="w-12 h-12 rounded-full bg-blue-500 flex items-center justify-center">
      {type === "hourglass" ? (
        <svg
          className="w-6 h-6 text-white"
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path d="M6 2v6h.01L6 8.01 10 12l-4 4 .01.01H6V22h12v-5.99h-.01L18 16l-4-4 4-3.99-.01-.01H18V2H6zm10 14.5V20H8v-3.5l4-4 4 4zm-4-5l-4-4V4h8v3.5l-4 4z" />
        </svg>
      ) : (
        <svg
          className="w-6 h-6 text-white"
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path d="M19 4h-1V2h-2v2H8V2H6v2H5c-1.11 0-1.99.9-1.99 2L3 20c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V10h14v10zm0-12H5V6h14v2z" />
        </svg>
      )}
    </div>
  );
};

export function Notifications() {
  const router = useRouter();
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const scheduleRes = await fetch("/api/schedule/week");
      const scheduleData = await scheduleRes.json();
      const schedules: Schedule[] = scheduleData.schedules ?? [];

      const pendingRes = await fetch("/api/nanny/bookings/pending");
      const pendingData = await pendingRes.json();
      const pendingDates: string[] = pendingData.dates ?? [];

      const items: NotificationItem[] = [];
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      schedules.forEach((s) => {
        const base = s.weekOf ? new Date(s.weekOf) : getStartOfWeek(today);
        base.setHours(0, 0, 0, 0);

        s.workingDays.forEach((code) => {
          const target = new Date(base);
          target.setDate(base.getDate() + dayMap[code]);
          target.setHours(0, 0, 0, 0);

          if (target < today) return;

          const dateStr = target.toISOString().split("T")[0];
          const formattedDate = target.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
          });
          const dayTimes = s.dailyTimes?.[code] ?? {
            timeFrom: s.timeFrom,
            timeTo: s.timeTo,
          };

          // Work schedule notification
          items.push({
            id: `work-${s.id}-${dateStr}`,
            date: formattedDate,
            fullDate: target,
            message: `You have a work schedule on ${formattedDate} at ${
              s.location || "work"
            } from ${formatTime12(dayTimes.timeFrom)} to ${formatTime12(
              dayTimes.timeTo
            )} `,
            time: getRelativeTime(target),
            icon: "calendar",
          });

          // Pending nanny request on this date (if exists)
          if (pendingDates.includes(dateStr)) {
            items.push({
              id: `pending-${dateStr}`,
              date: formattedDate,
              fullDate: target,
              message: `You requested a nanny for ${formattedDate} from ${formatTime12(
                dayTimes.timeFrom
              )} to ${formatTime12(dayTimes.timeTo)}`,
              time: getRelativeTime(target),
              icon: "hourglass",
            });
          }
        });
      });

      // Also show pending requests without a matching schedule (fallback)
      pendingDates.forEach((dateStr) => {
        const target = new Date(dateStr);
        target.setHours(0, 0, 0, 0);
        if (target < today) return;
        const formattedDate = target.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        });
        const exists = items.some((i) => i.id === `pending-${dateStr}`);
        if (!exists) {
          items.push({
            id: `pending-${dateStr}`,
            date: formattedDate,
            fullDate: target,
            message: `You requested a nanny for ${formattedDate}`,
            time: getRelativeTime(target),
            icon: "hourglass",
          });
        }
      });

      items.sort((a, b) => a.fullDate.getTime() - b.fullDate.getTime());
      setNotifications(items);
    } catch (err) {
      console.error("Failed to load notifications", err);
      setNotifications([]);
    } finally {
      setLoading(false);
    }
  };

  const formatTime12 = (t: string) => {
    const [h, m] = t.split(":").map(Number);
    const period = h >= 12 ? "PM" : "AM";
    const hour = h % 12 || 12;
    return `${hour}:${m.toString().padStart(2, "0")}${period}`;
  };

  const getRelativeTime = (date: Date) => {
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    const diffMs = date.getTime() - now.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    if (diffHours >= 0 && diffHours < 24) return `${diffHours}h`;
    const diffDays = Math.floor(diffHours / 24);
    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Tomorrow";
    if (diffDays > 1 && diffDays <= 7) return `${diffDays}d`;
    return `${diffDays}d`;
  };

  return (
    <div className="min-h-screen bg-white pb-24">
      <div className="sticky top-0 z-10 bg-white border-b border-gray-200">
        <div className="flex items-center px-6 py-6">
          <button
            onClick={() => router.back()}
            className="p-2 -ml-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <IoIosArrowBack size={28} className="text-gray-900" />
          </button>
          <h1 className="flex-1 text-center text-[28px] font-alan font-[900] text-gray-900 pr-10">
            Notification
          </h1>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : notifications.length > 0 ? (
        <div className="divide-y divide-gray-200">
          {notifications.map((n) => (
            <button
              key={n.id}
              onClick={() => router.push("/calendar")}
              className="w-full flex items-center gap-4 px-6 py-5 hover:bg-gray-50 transition-colors text-left"
            >
              <NotificationIcon type={n.icon} />
              <div className="flex-1 min-w-0">
                <p className="font-alan text-[16px] leading-[24px] font-[500] text-gray-900">
                  {n.message}
                </p>
              </div>
              <div className="flex-shrink-0">
                <span className="font-alan text-[14px] font-[400] text-gray-500">
                  {n.time}
                </span>
              </div>
            </button>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 px-6">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <svg
              className="w-10 h-10 text-gray-400"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M19 4h-1V2h-2v2H8V2H6v2H5c-1.11 0-1.99.9-1.99 2L3 20c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V10h14v10z" />
            </svg>
          </div>
          <h3 className="font-alan text-[20px] font-[700] text-gray-900 mb-2">
            No notifications yet
          </h3>
          <p className="font-alan text-[16px] font-[400] text-gray-500 text-center">
            When you have pending nanny requests, they&apos;ll show up here
          </p>
        </div>
      )}

      <div className="fixed bottom-0 left-0 right-0">
        <BottomNav />
      </div>
    </div>
  );
}
