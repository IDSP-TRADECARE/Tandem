"use client";
import { HalfBackground } from "@/app/components/ui/backgrounds/HalfBackground";
import { GradientBackgroundFull } from "@/app/components/ui/backgrounds/GradientBackgroundFull";
import { LabeledInput } from "@/app/components/forms/textInput";
import React, { useState } from "react";
import Image from "next/image";
import BackButton from "@/app/components/forms/backButton";
import { useRouter } from "next/navigation";

export default function Form() {
    const [step, setStep] = useState(1);
    // User Info Storage
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        phone: "",
        address: "",
        city: "",
        zipCode: "",
        company: "",
        workID: "",
    });

    const updateData = (field: keyof typeof formData, value: string) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    const next = () => setStep((prev) => Math.min(prev + 1, 4));
    const back = () => setStep((prev) => Math.max(prev - 1, 1));

    // Routing for back button
    const router = useRouter();

    const onSubmit = async () => {
        console.log("Final data →", formData);
        // await fetch('/api/submit', { method: 'POST', body: JSON.stringify(formData) })
        alert("Submitted! Check console.");
    };

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
                    <h1 className='font-bold font-alan text-xl pt-2 pb-4 text-start'>
                        {step === 1 && `Let's set up your account information!`}
                        {step === 2 &&
                            `Share your location for personalized
                            recommendations.`}
                        {step === 3 && "Add your workplace details."}
                    </h1>
                    <div className='flex flex-col gap-8'>
                        {/* Form Step 01 */}
                        {step === 1 && (
                            <>
                                {/* Form Inputs */}
                                <LabeledInput
                                    label='First Name'
                                    placeholder='First Name'
                                    value={formData.firstName}
                                    onChange={(e) =>
                                        updateData("firstName", e.target.value)
                                    }
                                />
                                <LabeledInput
                                    label='Last Name'
                                    placeholder='Last Name'
                                    value={formData.lastName}
                                    onChange={(e) =>
                                        updateData("lastName", e.target.value)
                                    }
                                />
                                <LabeledInput
                                    label='Phone Number'
                                    placeholder='+1 604-123-1234'
                                    type='tel'
                                    value={formData.phone}
                                    onChange={(e) =>
                                        updateData("phone", e.target.value)
                                    }
                                />
                            </>
                        )}

                        {/* Form Step 02 */}
                        {step === 2 && (
                            <>
                                {/* Form Inputs */}
                                <LabeledInput
                                    label='Street Address'
                                    placeholder='Street Address'
                                    value={formData.address}
                                    onChange={(e) =>
                                        updateData("address", e.target.value)
                                    }
                                />
                                <LabeledInput
                                    label='City'
                                    placeholder='City'
                                    value={formData.city}
                                    onChange={(e) =>
                                        updateData("city", e.target.value)
                                    }
                                />
                                <LabeledInput
                                    label='Zip Code'
                                    placeholder='Zip Code'
                                    value={formData.zipCode}
                                    onChange={(e) =>
                                        updateData("zipCode", e.target.value)
                                    }
                                />
                            </>
                        )}

                        {/* Form Step 03 */}
                        {step === 3 && (
                            <>
                                {/* Form Inputs */}
                                <LabeledInput
                                    label='Company Name'
                                    placeholder='Company name'
                                    value={formData.company}
                                    onChange={(e) =>
                                        updateData("company", e.target.value)
                                    }
                                    leftIcon={
                                        <svg
                                            xmlns='http://www.w3.org/2000/svg'
                                            width='22'
                                            height='22'
                                            viewBox='0 0 22 22'
                                            fill='none'>
                                            <path
                                                d='M14.3333 14.3333L21 21M8.77778 16.5556C7.75639 16.5556 6.74499 16.3544 5.80135 15.9635C4.85771 15.5726 4.00029 14.9997 3.27806 14.2775C2.55582 13.5553 1.98292 12.6978 1.59205 11.7542C1.20118 10.8106 1 9.79917 1 8.77778C1 7.75639 1.20118 6.74499 1.59205 5.80135C1.98292 4.85771 2.55582 4.00029 3.27806 3.27806C4.00029 2.55582 4.85771 1.98292 5.80135 1.59205C6.74499 1.20118 7.75639 1 8.77778 1C10.8406 1 12.8189 1.81944 14.2775 3.27806C15.7361 4.73667 16.5556 6.71498 16.5556 8.77778C16.5556 10.8406 15.7361 12.8189 14.2775 14.2775C12.8189 15.7361 10.8406 16.5556 8.77778 16.5556Z'
                                                stroke='black'
                                                strokeWidth='2'
                                                strokeLinecap='round'
                                                strokeLinejoin='round'
                                            />
                                        </svg>
                                    }
                                />
                                <LabeledInput
                                    label='Employee ID'
                                    placeholder='Employee ID'
                                    value={formData.workID}
                                    onChange={(e) =>
                                        updateData("workID", e.target.value)
                                    }
                                />
                            </>
                        )}
                    </div>
                    {/* Buttons */}
                    <div className='flex flex-row justify-between pt-8'>
                        <div
                            className='border-2 rounded-2xl p-2 pr-6 pl-6 border-primary-active  cursor-pointer'
                            onClick={step === 1 ? goBack : back}>
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
                            <button
                                className='flex items-center font-alan text-xl font-700 text-white cursor-pointer'
                                onClick={step === 3 ? onSubmit : next}
                                disabled={
                                    (step === 1 &&
                                        (!formData.firstName ||
                                            !formData.lastName)) ||
                                    (step === 2 &&
                                        (!formData.address || !formData.city))
                                }>
                                {step === 3 ? "Submit" : "Next"}
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
            </HalfBackground>
        </GradientBackgroundFull>
    );
}
