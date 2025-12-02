"use client";
import { GradientBackgroundFull } from "@/app/components/ui/backgrounds/GradientBackgroundFull";
import { HalfBackground } from "@/app/components/ui/backgrounds/HalfBackground";
import Image from "next/image";
import Link from "next/link";
import BackButton from "@/app/components/forms/backButton";

export default function BeforeScan() {
    return (
        <GradientBackgroundFull>
            {/* Header */}
            <div className='flex justify-between pt-20 pl-4 pr-4'>
                {/* Left Arrow */}
                <BackButton />
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
                <div className='justify-center p-8 animate-in fade-in slide-in-from-right-10 duration-300'>
                    <h1 className='font-bold text-4xl font-alan'>
                        Before you scan your ID
                    </h1>
                    <ul className='pt-8 pb-16 text-sm'>
                        <li>1. Scan your driver's license or services card.</li>
                        <li>
                            2. Ensure all details are visible and easy to read.
                        </li>
                    </ul>
                    <Link href={"/sign-up-process/camera"}>
                        <button className='cursor-pointer p-2 text-white flex justify-center rounded-3xl bg-primary-normal justify-self-stretch font-semibold px-4 ml-6 mr-6 mt-4'>
                            Ready to Scan
                        </button>
                    </Link>
                </div>
            </HalfBackground>
        </GradientBackgroundFull>
    );
}
