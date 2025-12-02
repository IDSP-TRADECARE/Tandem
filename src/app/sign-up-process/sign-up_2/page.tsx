"use client";
import Image from "next/image";
import { GradientBackgroundFull } from "@/app/components/ui/backgrounds/GradientBackgroundFull";
import { HalfBackground } from "@/app/components/ui/backgrounds/HalfBackground";
import { LabeledInput } from "@/app/components/forms/textinput";
import React, { useState } from "react";
import Link from "next/link";

export default function SignInPage() {
    const [firstName, setFirstName] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    return (
        <GradientBackgroundFull>
            <div className='flex min-h-screen flex-col items-center justify-start pt-15 px-4'>
                {/* Header: Logo centered + Info icon on the right */}
                <div className='flex items-center justify-center gap-6 mb-8 w-full max-w-3xl'>
                    <div className='flex-1 flex justify-cente ml-24'>
                        <Image
                            src='/brand/nameWhite.svg'
                            alt='Logo'
                            width={200}
                            height={200}
                            className='object-contain'
                        />
                    </div>

                    <div className='flex-shrink-0'>
                        <svg
                            xmlns='http://www.w3.org/2000/svg'
                            width='31'
                            height='31'
                            viewBox='0 0 31 31'
                            fill='none'
                            className='text-white cursor-pointer hover:opacity-80 transition-opacity'>
                            <path
                                d='M15.125 15.125L15.125 22.0625M15.125 9.98285V9.92188M1.25 15.125C1.25 7.46205 7.46205 1.25 15.125 1.25C22.788 1.25 29 7.46205 29 15.125C29 22.788 22.788 29 15.125 29C7.46205 29 1.25 22.788 1.25 15.125Z'
                                stroke='currentColor'
                                strokeWidth='2.5'
                                strokeLinecap='round'
                                strokeLinejoin='round'
                            />
                        </svg>
                    </div>
                </div>
            </div>
            <HalfBackground>
                <div className='px-6 pt-8 pb-12 animate-in fade-in slide-in-from-right-10 duration-300'>
                    <h1 className='font-bold text-3xl font-alan mb-8'>
                        Welcome! Let's set up your account
                    </h1>
                    <p className='text-gray-600 my-4'>
                        You can fill in your personal information manually, or
                        scan your ID to auto-fill it.
                    </p>

                    <div className='flex justify-center'>
                        <div className='flex flex-col gap-4 mt-8 max-w-md mx-auto w-full'>
                            <Link href={"/sign-up-process/id-scan"}>
                                <button
                                    type='submit'
                                    className='w-full cursor-pointer py-4 bg-primary-normal text-white font-bold rounded-4xl hover:bg-blue-700 active:bg-blue-800 transition-colors text-lg'>
                                    Scan my ID
                                </button>
                            </Link>
                            <Link href={"/sign-up-process/form"}>
                                <button
                                    type='button'
                                    className='w-full cursor-pointer py-4 bg-[#92F189] text-gray-900 font-bold rounded-4xl hover:bg-[#7FE876] active:bg-[#6DD464] transition-colors text-lg  '>
                                    Enter info manually
                                </button>
                            </Link>
                        </div>
                    </div>
                </div>
            </HalfBackground>
        </GradientBackgroundFull>
    );
}
