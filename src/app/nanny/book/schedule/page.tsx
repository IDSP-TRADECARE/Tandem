"use client";

import { createQuickShare } from "@/lib/nanny/createQuickShare";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { IoIosArrowBack } from "react-icons/io";
import { BottomNav } from "@/app/components/Layout/BottomNav";
import { DaySelector } from "@/app/components/ui/schedule/DaySelector";

export default function NannySchedulePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [selectedDays, setSelectedDays] = useState<string[]>(["TUE"]);
  const [activeDay, setActiveDay] = useState<string>("TUE");
  const [needNanny, setNeedNanny] = useState(true);
  const [someoneElse, setSomeoneElse] = useState(false);
  const [nannySharing, setNannySharing] = useState(false);
  const [reason, setReason] = useState("");
  const [startTimeInput, setStartTimeInput] = useState("");
  const [endTimeInput, setEndTimeInput] = useState("");

  // Get URL params - simple and clean
  const date = searchParams.get('date'); // "2025-12-25"
  const startTime = searchParams.get('startTime'); // "2:30 PM"
  const endTime = searchParams.get('endTime'); // "8:30 PM"

  const handleDayToggle = (dayId: string, isDouble?: boolean) => {
    if (isDouble) {
      setSelectedDays((prev) => prev.filter((d) => d !== dayId));
      if (activeDay === dayId) {
        setActiveDay("");
      }
    } else {
      setSelectedDays((prev) =>
        prev.includes(dayId)
          ? prev.filter((d) => d !== dayId)
          : [...prev, dayId]
      );
      setActiveDay(dayId);
    }
  };

  const handleSave = async () => {
    // Use user input if provided, otherwise use URL params
    const finalStartTime = startTimeInput || startTime;
    const finalEndTime = endTimeInput || endTime;

    console.log('Creating quick share with:', {
      date,
      startTime: finalStartTime,
      endTime: finalEndTime,
    });

    // Create the quick share - createQuickShare will handle AM/PM conversion
    await createQuickShare({
      customDate: date || undefined,
      customStartTime: finalStartTime || undefined,
      customEndTime: finalEndTime || undefined,
    });

    router.push("/nanny");
  };

  return (
    <div className="min-h-screen bg-gradient-primary">
      {/* Header */}
      <div className="text-white p-6">
        <button onClick={() => router.back()} className="mb-6">
          <IoIosArrowBack size={28} />
        </button>
        <h1 className="font-alan text-[32px] leading-[40px] font-[900] text-center">
          Plan your nanny schedule
        </h1>
      </div>

      {/* Content Card */}
      <div className="bg-white rounded-t-[32px] px-6 pt-6 min-h-screen">
        <p className="font-alan text-[16px] leading-[24px] font-[500] text-black mb-6">
          Tap each date to check the booking and set reason for days not needed.
        </p>

        {/* Show selected date/time if available */}
        {date && (
          <div className="mb-4 p-4 bg-blue-50 rounded-lg">
            <p className="font-alan text-[14px] font-[600] text-blue-800">
              Selected: {date}
            </p>
            {startTime && endTime && (
              <p className="font-alan text-[14px] font-[600] text-blue-800">
                Time: {startTime} - {endTime}
              </p>
            )}
          </div>
        )}

        {/* Day Selector */}
        <div className="mb-6">
          <DaySelector
            selectedDays={selectedDays}
            onDayToggle={handleDayToggle}
            activeDay={activeDay}
            showHint={false}
          />
        </div>

        {/* Need Nanny Care */}
        <h3 className="font-alan text-[20px] leading-[28px] font-[700] text-black mb-4">
          Need nanny care today?
        </h3>

        <button
          onClick={() => {
            setNeedNanny(true);
            setSomeoneElse(false);
          }}
          className={`w-full p-4 mb-3 rounded-2xl border-2 flex items-center gap-3 transition-colors ${
            needNanny ? "bg-blue-100 border-blue-500" : "border-gray-300"
          }`}
        >
          <div
            className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
              needNanny ? "bg-blue-500 border-blue-500" : "border-gray-300"
            }`}
          >
            {needNanny && <span className="text-white text-sm">✓</span>}
          </div>
          <span className="font-alan text-[16px] font-[500] text-black">
            Yes. Book nanny
          </span>
        </button>

        <button
          onClick={() => {
            setNeedNanny(false);
            setSomeoneElse(true);
          }}
          className={`w-full p-4 mb-3 rounded-2xl border-2 flex items-center gap-3 transition-colors ${
            someoneElse ? "bg-blue-100 border-blue-500" : "border-gray-300"
          }`}
        >
          <div
            className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
              someoneElse ? "bg-blue-500 border-blue-500" : "border-gray-300"
            }`}
          >
            {someoneElse && <span className="text-white text-sm">✓</span>}
          </div>
          <span className="font-alan text-[16px] font-[500] text-black">
            No. Someone else is watching
          </span>
        </button>

        {someoneElse && (
          <div className="mb-6 pl-10">
            <label className="font-alan text-[14px] font-[600] text-gray-600 mb-2 block">
              *Reason:
            </label>
            <input
              type="text"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="A family member will watch them"
              className="w-full pb-2 border-b-2 border-gray-300 focus:border-blue-500 focus:outline-none font-alan text-[16px] placeholder:text-gray-400"
            />
          </div>
        )}

        {/* Nanny Sharing */}
        <h3 className="font-alan text-[20px] leading-[28px] font-[700] text-black mb-4 mt-6">
          Nanny Sharing
        </h3>

        <button
          onClick={() => setNannySharing(!nannySharing)}
          className={`w-full p-4 mb-6 rounded-2xl border-2 flex items-center gap-3 transition-colors ${
            nannySharing ? "bg-blue-100 border-blue-500" : "border-gray-300"
          }`}
        >
          <div
            className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
              nannySharing ? "bg-blue-500 border-blue-500" : "border-gray-300"
            }`}
          >
            {nannySharing && <span className="text-white text-sm">✓</span>}
          </div>
          <span className="font-alan text-[16px] font-[500] text-black">
            Yes, make available to nanny share
          </span>
        </button>

        {/* Start/End Time */}
        <div className="flex gap-4 mb-6">
          <div className="flex-1">
            <label className="font-alan text-[20px] leading-[28px] font-[700] text-black mb-2 block">
              Start
            </label>
            <input
              type="text"
              value={startTimeInput}
              onChange={(e) => setStartTimeInput(e.target.value)}
              placeholder={startTime || "E.g., 7:00 AM"}
              className="w-full pb-2 border-b-2 border-gray-300 focus:border-blue-500 focus:outline-none font-alan text-[16px] placeholder:text-gray-400"
            />
          </div>
          <div className="flex-1">
            <label className="font-alan text-[20px] leading-[28px] font-[700] text-black mb-2 block">
              End
            </label>
            <input
              type="text"
              value={endTimeInput}
              onChange={(e) => setEndTimeInput(e.target.value)}
              placeholder={endTime || "E.g., 6:00 PM"}
              className="w-full pb-2 border-b-2 border-gray-300 focus:border-blue-500 focus:outline-none font-alan text-[16px] placeholder:text-gray-400"
            />
          </div>
        </div>

        {/* Children */}
        <div className="mb-6">
          <h3 className="font-alan text-[20px] leading-[28px] font-[700] text-black mb-3">
            Children
          </h3>
          <div className="flex gap-4">
            <p className="flex-1 pb-2 border-b-2 border-gray-300 font-alan text-[16px]">
              Angie
            </p>
            <p className="flex-1 pb-2 border-b-2 border-gray-300 font-alan text-[16px]">
              Sandy
            </p>
          </div>
        </div>

        {/* Allergies */}
        <div className="mb-6">
          <h3 className="font-alan text-[20px] leading-[28px] font-[700] text-black mb-3">
            Allergies & Medical Conditions
          </h3>
          <p className="pb-2 border-b-2 border-gray-300 font-alan text-[16px] text-gray-400">
            None
          </p>
        </div>

        {/* Additional Notes */}
        <div className="mb-6">
          <h3 className="font-alan text-[20px] leading-[28px] font-[700] text-black mb-3">
            Additional Notes
          </h3>
          <textarea
            className="w-full p-4 border-2 border-gray-300 rounded-2xl focus:border-blue-500 focus:outline-none font-alan text-[16px] placeholder:text-gray-400 min-h-24 resize-none"
            placeholder="Add any additional information..."
          />
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 pb-32">
          <button
            onClick={() => router.back()}
            className="flex-1 py-3 border-2 border-gray-300 text-gray-700 rounded-full font-alan text-[16px] font-[700] hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>

          <button
            onClick={handleSave}
            className="flex-1 py-3 bg-[#4F7DF3] text-white rounded-full font-alan text-[16px] font-[700] shadow-md hover:bg-[#3D6AD6] transition-colors"
          >
            Save
          </button>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0">
        <BottomNav />
      </div>
    </div>
  );
}
