"use client";
import Image from "next/image";
import { GradientBackgroundFull } from "@/app/components/ui/backgrounds/GradientBackgroundFull";
import { HalfBackground } from "@/app/components/ui/backgrounds/HalfBackground";
import { LabeledInput } from "@/app/components/forms/textinput";
import React, { useState } from "react";
export default function SignInPage() {
    const [firstName, setFirstName] = useState("");
    return (
        <GradientBackgroundFull>
            <div className="flex min-h-screen flex-col items-center justify-start pt-15 px-4">
                <h1 className="text-4xl font-bold text-white mb-2 flex justify-center">
                    <Image
                        src="/brand/nameWhite.svg"
                        alt="Logo"
                        width={200}
                        height={200}
                    />
                </h1>
            </div>
            <HalfBackground>
                <div className="px-6 pt-8 pb-12">
                    <h1 className="font-bold text-3xl font-alan mb-8">
                        Log In
                    </h1>

                    <div className="flex justify-center">
                        <div className="w-full max-w-sm space-y-8">
                            <LabeledInput
                                label="Username"
                                placeholder="Enter your username"
                                value={firstName}
                                onChange={setFirstName}
                                type="text"
                                rightIcon={
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="24"
                                        height="24"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="black"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round">
                                        {/* Eye outline */}
                                        <path d="M1 12s3.364 -8 11 -8c7.636 0 11 8 11 8s-3.364 8 -11 8c-7.636 0 -11 -8 -11 -8z" />

                                        {/* Iris / pupil */}
                                        <circle
                                            cx="12"
                                            cy="12"
                                            r="3"
                                        />
                                    </svg>
                                }
                            />

                            <LabeledInput
                                label="Password"
                                placeholder="Enter your password"
                                value={firstName}
                                onChange={setFirstName}
                                type="password"
                            />

                            <button
                                type="submit"
                                className="w-full py-4 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 active:bg-blue-800 transition-colors text-lg shadow-lg">
                                Login
                            </button>

                            <button
                                type="button"
                                className="w-full py-4 border-2 border-gray-500 text-gray-700 font-bold rounded-xl hover:bg-gray-100 active:bg-gray-200 transition-colors text-lg">
                                New user? Sign up now
                            </button>
                        </div>
                    </div>
                </div>
            </HalfBackground>
        </GradientBackgroundFull>
    );
}
