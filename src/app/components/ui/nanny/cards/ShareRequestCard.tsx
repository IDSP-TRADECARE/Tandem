import Image from 'next/image';
import { typography } from '@/app/styles/typography';
import { colors } from '@/app/styles/colors';

interface ShareRequestCardProps {
  date: string;
  time: string;
  nannyName: string;
  availableSpots: number;
  imageUrl?: string;
  hasActivity?: boolean;
}

export function ShareRequestCard({  
  date,
  time,
  nannyName,
  availableSpots,
  imageUrl,
  hasActivity = false,
}: ShareRequestCardProps) {
  return (
    <div className="relative bg-white rounded-3xl p-4 shadow-sm">
      {/* Activity indicator */}
      {hasActivity && (
        <div className={`absolute top-4 right-4 w-3 h-3 ${colors.success.bg} rounded-full`} />
      )}

      <div className="flex items-start gap-4">
        {/* Avatar */}
        <div className={`w-16 h-16 rounded-full ${colors.neutral.bg100} shrink-0 overflow-hidden`}>
          {imageUrl ? (
            <Image src={imageUrl} alt={nannyName} width={64} height={64} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-linear-to-br from-neutral-200 to-neutral-300">
              <svg className={`w-8 h-8 ${colors.neutral[400]}`} fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
              </svg>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <h3 className={`${typography.body.h3} ${colors.neutral[900]} mb-1`}>
            {date} {time}
          </h3>
          <p className={`${typography.body.caption} ${colors.primary.hover} mb-3`}>
            Nanny: {nannyName}
          </p>
          <div className={`inline-block px-4 py-1.5 ${colors.secondary.bgActive} rounded-full`}>
            <span className={`${typography.body.label} font-semibold text-white`}>
              Available spots: {availableSpots}
            </span>
          </div>
        </div>

        {/* Arrow */}
        <svg className={`w-6 h-6 ${colors.primary.hover} shrink-0 mt-2`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
        </svg>
      </div>
    </div>
  );
}