"use client";

import { FaPencilAlt } from "react-icons/fa";
import { IoNotificationsOutline } from "react-icons/io5";

interface NannyCardProps {
  isOpen: boolean;
  onClose: () => void;
  onEdit?: () => void;
  date: string;
  time: string;
  title: string;
  subtitle: string;
  certifications: string[];
  phone: string;
  email: string;
  location: string;
}

export function NannyCard({
  isOpen,
  onClose,
  onEdit,
  date,
  time,
  title,
  subtitle,
  certifications,
  phone,
  email,
  location,
}: NannyCardProps) {
  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop with blur effect */}
      <div
        className="fixed inset-0 transition-all"
        style={{
          backdropFilter: "blur(8px)",
          WebkitBackdropFilter: "blur(8px)",
          backgroundColor: "rgba(0, 0, 0, 0.1)",
          zIndex: 9998,
        }}
        onClick={onClose}
      />

      {/* Popup from bottom */}
      <div
        className="fixed inset-x-0 bottom-0 animate-slide-up"
        style={{ zIndex: 9999 }}
      >
        <div className="bg-white rounded-t-[32px] px-6 pt-6 pb-32 shadow-2xl">
          {/* Handle bar */}
          <div className="w-12 h-1.5 bg-gray-300 rounded-full mx-auto mb-6" />

          {/* Header with date and time */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-[#1e3a5f]">{date}</h2>
            <div className="flex items-center gap-2 text-[#1e3a5f]">
              <IoNotificationsOutline size={20} />
              <span className="font-semibold">{time}</span>
            </div>
          </div>

          {/* Main Card */}
          <div className="bg-gray-50 rounded-2xl p-4 mb-4">
            <h3 className="text-lg font-bold text-gray-900 mb-1">{title}</h3>
            <p className="text-sm text-gray-600 mb-4">{subtitle}</p>
          </div>

          {/* Details Card with Edit Button */}
          <div className="bg-gray-50 rounded-2xl p-4 relative">
            {/* Edit Button */}
            {onEdit && (
              <button
                onClick={onEdit}
                className="absolute bottom-4 right-4 w-12 h-12 bg-[#1e3a5f] hover:bg-[#152d47] text-white rounded-full flex items-center justify-center shadow-lg transition-colors"
                aria-label="Edit details"
              >
                <FaPencilAlt size={18} />
              </button>
            )}

            <div className="space-y-3 pr-16">
              {/* Certifications */}
              <div>
                <p className="text-sm font-semibold text-gray-900 mb-1">
                  Certifications:
                </p>
                {certifications.map((cert, index) => (
                  <p key={index} className="text-sm text-gray-700">
                    {cert}
                  </p>
                ))}
              </div>

              {/* Contact Info */}
              <div className="pt-2 space-y-1">
                <p className="text-sm text-gray-700">
                  <span className="font-semibold">Phone:</span> {phone}
                </p>
                <p className="text-sm text-gray-700">
                  <span className="font-semibold">Email:</span> {email}
                </p>
                <p className="text-sm text-gray-700">
                  <span className="font-semibold">Location:</span> {location}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
