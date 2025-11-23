"use client";
import { HalfBackground } from "@/app/components/ui/backgrounds/HalfBackground";
import { GradientBackgroundFull } from "@/app/components/ui/backgrounds/GradientBackgroundFull";
import { LabeledInput } from "@/app/components/forms/textInput";
import React, { useState } from "react";
import Image from "next/image";
import BackButton from "@/app/components/forms/backButton";

export default function Form() {
    const [firstName, setFirstName] = useState("");

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
                            label='First Name'
                            placeholder='John'
                            value={firstName}
                            onChange={setFirstName}
                            type='text'
                            rightIcon={
                                <svg
                                    xmlns='http://www.w3.org/2000/svg'
                                    width='24'
                                    height='24'
                                    viewBox='0 0 24 24'
                                    fill='none'>
                                    <path
                                        d='M15.3333 15.3333L22 22M9.77778 17.5556C8.75639 17.5556 7.74499 17.3544 6.80135 16.9635C5.85771 16.5726 5.00029 15.9997 4.27806 15.2775C3.55582 14.5553 2.98292 13.6978 2.59205 12.7542C2.20118 11.8106 2 10.7992 2 9.77778C2 8.75639 2.20118 7.74499 2.59205 6.80135C2.98292 5.85771 3.55582 5.00029 4.27806 4.27806C5.00029 3.55582 5.85771 2.98292 6.80135 2.59205C7.74499 2.20118 8.75639 2 9.77778 2C11.8406 2 13.8189 2.81944 15.2775 4.27806C16.7361 5.73667 17.5556 7.71498 17.5556 9.77778C17.5556 11.8406 16.7361 13.8189 15.2775 15.2775C13.8189 16.7361 11.8406 17.5556 9.77778 17.5556Z'
                                        stroke='black'
                                        strokeWidth='2'
                                        strokeLinecap='round'
                                        strokeLinejoin='round'
                                    />
                                </svg>
                            }
                            leftIcon={
                                <svg
                                    xmlns='http://www.w3.org/2000/svg'
                                    width='24'
                                    height='24'
                                    viewBox='0 0 24 24'
                                    fill='none'>
                                    <path
                                        d='M15.3333 15.3333L22 22M9.77778 17.5556C8.75639 17.5556 7.74499 17.3544 6.80135 16.9635C5.85771 16.5726 5.00029 15.9997 4.27806 15.2775C3.55582 14.5553 2.98292 13.6978 2.59205 12.7542C2.20118 11.8106 2 10.7992 2 9.77778C2 8.75639 2.20118 7.74499 2.59205 6.80135C2.98292 5.85771 3.55582 5.00029 4.27806 4.27806C5.00029 3.55582 5.85771 2.98292 6.80135 2.59205C7.74499 2.20118 8.75639 2 9.77778 2C11.8406 2 13.8189 2.81944 15.2775 4.27806C16.7361 5.73667 17.5556 7.71498 17.5556 9.77778C17.5556 11.8406 16.7361 13.8189 15.2775 15.2775C13.8189 16.7361 11.8406 17.5556 9.77778 17.5556Z'
                                        stroke='black'
                                        strokeWidth='2'
                                        strokeLinecap='round'
                                        strokeLinejoin='round'
                                    />
                                </svg>
                            }
                        />
                    </div>
                </div>
            </HalfBackground>
        </GradientBackgroundFull>
    );
}
