"use client";
import Image from "next/image";
import { GradientBackgroundFull } from "@/app/components/ui/backgrounds/GradientBackgroundFull";
import { HalfBackground } from "@/app/components/ui/backgrounds/HalfBackground";
import { LabeledInput } from "@/app/components/forms/textinput";
import React, { useState } from "react";
import Link from "next/link";

export default function SignInPage() {
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });

    const updateData = (field: keyof typeof formData, value: string) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };
    return (
        <GradientBackgroundFull>
            <div className='flex min-h-screen flex-col items-center justify-start pt-15 px-4'>
                <h1 className='text-4xl font-bold text-white mb-2 flex justify-center'>
                    <Image
                        src='/brand/nameWhite.svg'
                        alt='Logo'
                        width={200}
                        height={200}
                    />
                </h1>
            </div>
            <HalfBackground>
                <div className='px-6 pt-8 pb-12'>
                    <h1 className='font-bold text-3xl font-alan'>Sign Up</h1>

                    <div className='flex justify-center'>
                        <div className='w-full max-w-sm space-y-4'>
                            <LabeledInput
                                label='Email'
                                placeholder='Enter your email'
                                value={formData.email}
                                onChange={(e) =>
                                    updateData("email", e.target.value)
                                }
                                type='text'
                            />
                            <div>
                                <LabeledInput
                                    label='Password'
                                    placeholder='Password'
                                    value={formData.password}
                                    onChange={(e) =>
                                        updateData("password", e.target.value)
                                    }
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
                            <div>
                                <LabeledInput
                                    label='Re-enter Password'
                                    placeholder='Password'
                                    value={formData.password}
                                    onChange={(e) =>
                                        updateData("password", e.target.value)
                                    }
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
                            <Link href={"/sign-up/id-scan"}>
                                <button
                                    type='submit'
                                    className='mb-6 mt-4 w-full py-4 bg-primary-normal text-white font-bold rounded-4xl hover:bg-blue-700 active:bg-blue-800 transition-colors text-lg'>
                                    Login
                                </button>
                            </Link>
                            <Link href={"/sign-in/log-in"}>
                                <button
                                    type='button'
                                    className='w-full py-4 border-2 border-gray-500 text-gray-700 font-bold rounded-4xl hover:bg-gray-100 active:bg-gray-200 transition-colors text-lg'>
                                    Already a user? Login
                                </button>
                            </Link>
                        </div>
                    </div>
                </div>
            </HalfBackground>
        </GradientBackgroundFull>
    );
}
