// src/app/components/ui/nanny/MemberCard.tsx
import React from "react";
import Image from "next/image";
import { FaTimesCircle, FaCheckCircle } from "react-icons/fa";
import { HiOutlineChevronRight } from "react-icons/hi";

type Variant = "group" | "request";

interface Props {
  id: string;
  name: string;
  avatarUrl?: string | null;
  kidsCount?: number;
  kidAges?: string; // e.g. "4 years old" or "2, 4"
  variant?: Variant;
  onAccept?: (id: string) => void;
  onReject?: (id: string) => void;
  onSeeMore?: (id: string) => void;
  compact?: boolean;
}

/**
 * MemberCard
 * - variant "request": shows avatar, name, See more link, accept/reject buttons on the right
 * - variant "group": shows avatar, name, kidsCount, kidAges, See more on the right
 */
export default function MemberCard({
  id,
  name,
  avatarUrl,
  kidsCount,
  kidAges,
  variant = "group",
  onAccept,
  onReject,
  onSeeMore,
  compact = false,
}: Props) {
  return (
    <div
      className={`w-full bg-white rounded-2xl shadow-sm flex items-center gap-4 p-4 ${
        compact ? "py-3" : ""
      }`}
      role="group"
      aria-label={`${name} ${variant === "request" ? "request" : "member"}`}
    >
      <div className="flex-none">
        <div className="w-12 h-12 md:w-14 md:h-14 rounded-full overflow-hidden bg-gray-100">
          {avatarUrl ? (
            // next/image keeps perf; fallback to img if you prefer
            <Image
              src={avatarUrl}
              alt={`${name} avatar`}
              width={56}
              height={56}
              className="object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gray-200" />
          )}
        </div>
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between">
          <div className="truncate">
            <div className="text-lg md:text-xl font-extrabold leading-tight text-black truncate">
              {name}
            </div>
            {variant === "group" && (
              <div className="mt-1 flex items-center gap-4 text-sm text-gray-700">
                <span>{kidsCount ?? 0} kids</span>
                {kidAges && <span>{kidAges}</span>}
              </div>
            )}
            {variant === "request" && (
              <div className="mt-2">
                <button
                  onClick={() => onSeeMore?.(id)}
                  className="text-sm text-blue-600 underline"
                  aria-label={`See more about ${name}`}
                >
                  See more
                </button>
              </div>
            )}
          </div>

          {variant === "group" && (
            <div className="ml-4 flex-none">
              <button
                onClick={() => onSeeMore?.(id)}
                className="flex items-center text-blue-600 hover:underline focus:outline-none"
                aria-label={`See more about ${name}`}
              >
                <span className="mr-1">See more</span>
                <HiOutlineChevronRight className="text-lg" />
              </button>
            </div>
          )}
        </div>
      </div>

      {variant === "request" && (
        <div className="flex-none flex items-center gap-3">
          <button
            onClick={() => onReject?.(id)}
            aria-label={`Reject ${name}`}
            className="p-2 rounded-full bg-red-100 text-red-600 hover:bg-red-200 focus:outline-none"
          >
            <FaTimesCircle className="w-5 h-5" />
          </button>

          <button
            onClick={() => onAccept?.(id)}
            aria-label={`Accept ${name}`}
            className="p-2 rounded-full bg-blue-100 text-blue-600 hover:bg-blue-200 focus:outline-none"
          >
            <FaCheckCircle className="w-5 h-5" />
          </button>
        </div>
      )}
    </div>
  );
}