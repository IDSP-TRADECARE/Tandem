"use client";
import { SmallBackground } from "@/app/components/ui/backgrounds/SmallBackground";

interface HelpModalProps {
    open: boolean;
    onClose: () => void;
}

export default function Help() {
    return (
        <>
            <SmallBackground>
                <div className='absolute left-1/2 top-4 -translate-x-1/2 transform'>
                    <div className='h-2 w-20 rounded-full bg-black ' />
                </div>
                <div className='relative z-10 flex min-h-screen flex-col px-8 pt-12 sm:pt-12 lg:pt-15'>
                    <h1 className='font-bold text-3xl font-alan mb-1'>
                        Need help?
                    </h1>
                    <p className='text-gray-600 max-w-lg text-sm sm:text-base'>
                        Having trouble uploading your information or running
                        into another issue?
                    </p>
                    <p className='text-gray-600 max-w-lg text-sm sm:text-base'>
                        No worries - we're here to help!
                    </p>
                    <div className='mt-3 flex items-center gap-2'>
                        <svg
                            width='28'
                            height='28'
                            viewBox='0 0 24 24'
                            fill='none'
                            stroke='currentColor'
                            strokeWidth='2'
                            strokeLinecap='round'
                            strokeLinejoin='round'
                            className='text-black'>
                            <rect
                                width='20'
                                height='16'
                                x='2'
                                y='4'
                                rx='2'
                            />
                            <path d='m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7' />
                        </svg>
                        <h1 className='text-1xl font-alan mb-1'>
                            tandemfortrades@gmail.com
                        </h1>
                    </div>
                </div>
            </SmallBackground>
        </>
    );
}
