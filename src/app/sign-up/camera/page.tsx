"use client";
import { GradientBackgroundFull } from "@/app/components/ui/backgrounds/GradientBackgroundFull";
import { HalfBackground } from "@/app/components/ui/backgrounds/HalfBackground";
import Image from "next/image";
import Link from "next/link";
import BackButton from "@/app/components/forms/backButton";
import styles from "@/app/sign-up/camera/page.module.css";
import Camera from "@/app/components/forms/camera";

export default function CameraPage() {
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
                <div className='p-8'>
                    <h1 className='font-bold text-4xl font-alan'>
                        Scan the front of your ID
                    </h1>
                    {/* Camera Space here */}
                    <div className='pt-4'>
                        <Camera />
                    </div>
                    <ul className='pt-8 pb-8 text-sm'>
                        <li>1. Place your ID inside the frame.</li>
                        <li>2. Make sure all corners are visible.</li>
                        <li>
                            3. Avoid reflections or shadows while capturing.
                        </li>
                        <li>4. Hold your phone steady while capturing.</li>
                    </ul>
                    {/* Camera Button */}
                    <Link href={"/sign-up/form01"}>
                        <div className='flex justify-center'>
                            <div className='bg-neutral-50 p-1 rounded-full w-max'>
                                <div className='bg-white p-1 rounded-full w-max'>
                                    <div className='bg-primary-hover p-4 w-max rounded-full'>
                                        <svg
                                            xmlns='http://www.w3.org/2000/svg'
                                            width='23'
                                            height='21'
                                            viewBox='0 0 23 21'
                                            fill='none'>
                                            <path
                                                d='M14.5059 0C15.1276 0 15.4389 0.000723567 15.7168 0.0830078C16.0585 0.18418 16.3671 0.374424 16.6104 0.634766C16.8083 0.846565 16.9475 1.12455 17.2256 1.68066L18.2598 3.75C18.6556 4.54171 19.4654 5.04199 20.3506 5.04199C21.6411 5.04214 22.6875 6.08835 22.6875 7.37891V14.167C22.6875 16.9952 22.6872 18.4094 21.8086 19.2881C20.9299 20.1667 19.5157 20.167 16.6875 20.167H6C3.17173 20.167 1.7576 20.1666 0.878906 19.2881C0.000256248 18.4094 1.00079e-09 16.9952 0 14.167V7.37891C0 6.08826 1.04627 5.04199 2.33691 5.04199C3.22204 5.04199 4.03089 4.54166 4.42676 3.75L5.46191 1.68066C5.73994 1.12462 5.87924 0.846551 6.07715 0.634766C6.32042 0.374492 6.6291 0.184163 6.9707 0.0830078C7.24855 0.000806833 7.55926 1.37754e-09 8.18066 0H14.5059ZM11.3438 6.30273C8.55945 6.30285 6.30176 8.5604 6.30176 11.3447L6.30859 11.6035C6.43935 14.1813 8.50621 16.2482 11.084 16.3789L11.3438 16.3857C14.0409 16.3855 16.2428 14.2671 16.3779 11.6035L16.3848 11.3447C16.3848 8.64725 14.2665 6.44447 11.6025 6.30957L11.3438 6.30273ZM11.3438 8.30273C13.0234 8.30294 14.3848 9.66502 14.3848 11.3447C14.3843 13.0241 13.0231 14.3855 11.3438 14.3857C9.66429 14.3856 8.30221 13.0241 8.30176 11.3447C8.30176 9.66497 9.66402 8.30285 11.3438 8.30273Z'
                                                fill='white'
                                            />
                                        </svg>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Link>
                </div>
            </HalfBackground>
        </GradientBackgroundFull>
    );
}
