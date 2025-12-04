"use client";

interface RequestPendingPopupProps {
  isOpen: boolean;
  onClose: () => void;
  details?: {
    title: string;
    dateLabel: string;
    timeRange: string;
    location: string;
  };
}

export function RequestPendingPopup({
  isOpen,
  onClose,
  details,
}: RequestPendingPopupProps) {
  if (!isOpen || !details) return null;

  return (
    <>
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
      <div
        className="fixed inset-x-0 bottom-0 animate-slide-up"
        style={{ zIndex: 9999 }}
      >
        <div className="bg-white rounded-t-[32px] px-6 pt-6 pb-32 shadow-2xl">
          <div className="w-12 h-1.5 bg-gray-300 rounded-full mx-auto mb-6" />
          <h2 className="text-2xl font-bold text-[#1e3a5f] mb-6">
            Your request is pending
          </h2>

          <div className="bg-white border border-gray-200 rounded-2xl p-4 mb-4 shadow-sm">
            <p className="text-lg font-semibold text-gray-900 mb-1">
              {details.title}
            </p>
            <p className="text-gray-700">{details.dateLabel}</p>
            <p className="text-gray-700">{details.timeRange}</p>
            <p className="text-gray-700">Location: {details.location}</p>
          </div>

          <p className="text-gray-600 text-sm mb-4">
            Wait for their reply or cancel if you found an alternative.
          </p>

          <button className="flex items-center gap-2 text-blue-700 font-semibold">
            <span role="img" aria-label="bell">
              🔔
            </span>
            Set reminder to check in!
          </button>
        </div>
      </div>
    </>
  );
}
