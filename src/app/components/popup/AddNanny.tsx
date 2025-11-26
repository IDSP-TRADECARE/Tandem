"use client";

interface NannyBookingPopupProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  workDetails?: {
    time: string;
    location: string;
  };
}

export function NannyBookingPopup({
  isOpen,
  onClose,
  onConfirm,
  workDetails,
}: NannyBookingPopupProps) {
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

          <h2 className="text-2xl font-bold text-[#1e3a5f] mb-6">
            No Nanny booked yet!
          </h2>

          <div className="bg-gray-50 rounded-2xl p-4 mb-6">
            <p className="text-gray-900 leading-relaxed">
              {workDetails ? (
                <>
                  Book soon for your{" "}
                  <span className="font-semibold">{workDetails.time}</span>!
                  <br />
                  Working at:{" "}
                  <span className="font-semibold">{workDetails.location}</span>
                </>
              ) : (
                "Book a nanny for your upcoming work schedule."
              )}
            </p>
          </div>

          <button
            onClick={onConfirm}
            className="w-full py-4 bg-[#1e3a5f] hover:bg-[#152d47] text-white font-semibold rounded-2xl transition-colors text-lg"
          >
            Book Nanny
          </button>
        </div>
      </div>
    </>
  );
}
