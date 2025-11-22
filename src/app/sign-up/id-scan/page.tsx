import { GradientBackgroundFull } from "@/app/components/ui/backgrounds/GradientBackgroundFull";
import { HalfBackground } from "@/app/components/ui/backgrounds/HalfBackground";
import { colors } from "@/app/styles/colors";
import Image from "next/image";

export default function BeforeScan() {
    return (
        <GradientBackgroundFull>
            {/* Header */}
            <div className='flex justify-between pt-13 pl-4 pr-4'>
                {/* Left Arrow */}
                <svg
                    xmlns='http://www.w3.org/2000/svg'
                    width='17'
                    height='30'
                    viewBox='0 0 17 30'
                    fill='none'>
                    <path
                        d='M14.6575 27.1699L2.14497 14.6574L14.6575 2.14492'
                        stroke='white'
                        strokeWidth='4.29'
                        strokeLinecap='round'
                        strokeLinejoin='round'
                    />
                </svg>
                <h1 className='text-4xl font-bold text-white mb-2 flex justify-center'>
                    <Image
                        src='/brand/nameWhite.svg'
                        alt='Logo'
                        width={200}
                        height={200}
                    />
                </h1>
                {/* Info Icon */}
                <svg
                    xmlns='http://www.w3.org/2000/svg'
                    width='31'
                    height='31'
                    viewBox='0 0 31 31'
                    fill='none'>
                    <path
                        d='M15.125 15.125L15.125 22.0625M15.125 9.98285V9.92188M1.25 15.125C1.25 7.46205 7.46205 1.25 15.125 1.25C22.788 1.25 29 7.46205 29 15.125C29 22.788 22.788 29 15.125 29C7.46205 29 1.25 22.788 1.25 15.125Z'
                        stroke='white'
                        strokeWidth='2.5'
                        strokeLinecap='round'
                        strokeLinejoin='round'
                    />
                </svg>
            </div>
            <HalfBackground>
                <div></div>
            </HalfBackground>
        </GradientBackgroundFull>
    );
}
