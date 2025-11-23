"use client";
import { HalfBackground } from "@/app/components/ui/backgrounds/HalfBackground";
import { GradientBackgroundFull } from "@/app/components/ui/backgrounds/GradientBackgroundFull";
import { LabeledInput } from "@/app/components/forms/textInput";
import React, { useState } from "react";
import Image from "next/image";
import BackButton from "@/app/components/forms/backButton";

export default function Form() {
    const [firstName, setFirstName] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);

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
                <div className=' p-6'>
                    <h1 className='font-bold font-alan text-xl text-center pt-2 pb-6'>
                        We've filled in details from your ID. Please review and
                        edit as needed.
                    </h1>
                    {/* Form Inputs */}
                    <div>
                        <LabeledInput
                            label='Password'
                            placeholder='Password'
                            value={password}
                            onChange={setPassword}
                            type={showPassword ? "text" : "password"}
                            rightIcon={
                                <svg
                                    width='20'
                                    height='20'
                                    viewBox='0 0 24 24'
                                    fill='none'
                                    stroke='currentColor'
                                    strokeWidth='2'>
                                    {showPassword ? (
                                        // Eye open
                                        <>
                                            <path d='M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z' />
                                            <circle
                                                cx='12'
                                                cy='12'
                                                r='3'
                                            />
                                        </>
                                    ) : (
                                        // Eye closed
                                        <>
                                            <path d='M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a21.94 21.94 0 0 1 5.94-5.94' />
                                            <path d='M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a21.94 21.94 0 0 1-2.06 3.76' />
                                            <path d='m1 1 22 22' />
                                        </>
                                    )}
                                </svg>
                            }
                            onRightIconClick={() =>
                                setShowPassword(!showPassword)
                            }
                        />
                    </div>
                </div>
            </HalfBackground>
        </GradientBackgroundFull>
    );
}
