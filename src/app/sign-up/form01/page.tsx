"use client";
import { HalfBackground } from "@/app/components/ui/backgrounds/HalfBackground";
import { GradientBackgroundFull } from "@/app/components/ui/backgrounds/GradientBackgroundFull";
import { LabeledInput } from "@/app/components/forms/textInput";
import React, { useState } from "react";
import Image from "next/image";
import BackButton from "@/app/components/forms/backButton";
import { useRouter } from "next/navigation";

export default function Form() {
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [phone, setPhone] = useState("");

    const router = useRouter();

    const goBack = () => {
        router.back();
    };

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
                    <div className='flex flex-col gap-8'>
                        {/* Form Inputs */}
                        <LabeledInput
                            label='First Name'
                            placeholder='First Name'
                            value={firstName}
                            onChange={setFirstName}
                        />
                        <LabeledInput
                            label='Last Name'
                            placeholder='Last Name'
                            value={lastName}
                            onChange={setLastName}
                        />
                        <LabeledInput
                            label='Phone Number'
                            placeholder='+1 604-123-1234'
                            value={phone}
                            type='tel'
                            onChange={setPhone}
                        />
                        {/* Buttons */}
                        <div className='flex flex-row justify-between'>
                            <div
                                className='border-2 rounded-2xl p-2 pr-6 pl-6 border-primary-active  cursor-pointer'
                                onClick={goBack}>
                                <button className='flex items-center font-alan text-xl font-700 text-primary-active cursor-pointer'>
                                    <div className='pr-2'>
                                        <svg
                                            xmlns='http://www.w3.org/2000/svg'
                                            width='10'
                                            height='18'
                                            viewBox='0 0 10 18'
                                            fill='none'>
                                            <path
                                                d='M8.54166 15.8335L1.25 8.54183L8.54167 1.25016'
                                                stroke='#255495'
                                                strokeWidth='2.5'
                                                strokeLinecap='round'
                                                strokeLinejoin='round'
                                            />
                                        </svg>
                                    </div>
                                    Back
                                </button>
                            </div>
                            <div className='bg-primary-active rounded-2xl p-2 pr-6 pl-6  cursor-pointer'>
                                <button className='flex items-center font-alan text-xl font-700 text-white cursor-pointer'>
                                    Next
                                    <div className='pl-2'>
                                        <svg
                                            xmlns='http://www.w3.org/2000/svg'
                                            width='10'
                                            height='18'
                                            viewBox='0 0 10 18'
                                            fill='none'>
                                            <path
                                                d='M1.25 1.25L8.54167 8.54167L1.25 15.8333'
                                                stroke='white'
                                                strokeWidth='2.5'
                                                strokeLinecap='round'
                                                strokeLinejoin='round'
                                            />
                                        </svg>
                                    </div>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </HalfBackground>
        </GradientBackgroundFull>
    );
}
