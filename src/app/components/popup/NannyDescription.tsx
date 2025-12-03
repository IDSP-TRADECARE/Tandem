"use client";

type NannyDescriptionProps = {
  isOpen: boolean;
  onClose: () => void;
  details?: {
    dayLabel: string;
    reminderTime: string;
    taskTitle: string;
    bookingWindow: string;
    certifications: string[];
    phone: string;
    email: string;
    location: string;
  };
};

export function NannyDescriptionPopup({
  isOpen,
  onClose,
  details,
}: NannyDescriptionProps) {
  if (!isOpen || !details) return null;

  return (
    <>
      <div
        className="fixed inset-0 z-[9998]"
        style={{
          backgroundColor: "rgba(0,0,0,0.1)",
          backdropFilter: "blur(8px)",
          WebkitBackdropFilter: "blur(8px)",
        }}
        onClick={onClose}
      />
      <div className="fixed inset-x-0 bottom-0 z-[9999] animate-slide-up px-4 pb-10">
        <div className="mx-auto max-w-md rounded-[32px] bg-white shadow-[0_24px_60px_rgba(0,0,0,0.15)] p-6">
          <div className="mx-auto mb-6 h-1.5 w-12 rounded-full bg-gray-300" />
          <div className="flex items-center justify-between text-[#1e3a5f]">
            <div>
              <p className="text-lg font-bold">{details.dayLabel}</p>
            </div>
            <div className="flex items-center gap-2 text-sm font-semibold">
              <span role="img" aria-label="bell">
                🔔
              </span>
              {details.reminderTime}
            </div>
          </div>

          <div className="mt-4 rounded-3xl border border-gray-200 p-4">
            <p className="text-lg font-semibold text-gray-900">
              {details.taskTitle}
            </p>
            <p className="text-sm text-gray-600">
              Nanny booked for {details.bookingWindow}
            </p>
          </div>

          <div className="mt-4 rounded-3xl border border-gray-200 p-4 text-sm text-gray-800">
            <p className="font-semibold mb-1">Certifications:</p>
            {details.certifications.map((cert) => (
              <p key={cert}>{cert}</p>
            ))}
            <div className="mt-4 space-y-1">
              <p>Phone: {details.phone}</p>
              <p>Email: {details.email}</p>
              <p>Location: {details.location}</p>
            </div>
          </div>

          <div className="mt-6 flex justify-end">
            <button
              type="button"
              onClick={onClose}
              className="flex items-center gap-2 rounded-full border border-blue-200 px-4 py-2 text-sm font-semibold text-blue-700"
            >
              ✏️ Edit
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
