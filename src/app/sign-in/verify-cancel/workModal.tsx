import { LowerBackground } from "@/app/components/ui/backgrounds/LowerBackground";
import Image from "next/image";

interface WorkModalProps {
    open: boolean;
    onClose: () => void;
}

export default function WorkModal({ open, onClose }: WorkModalProps) {
    if (!open) return null;
    return (
        <div className='fixed inset-0 z-50 flex items-end justify-center sm:items-center'>
            <div
                className='absolute inset-0 bg-black/60'
                onClick={onClose}
            />
            {/* Modal Panel */}
            <div className='z-10 w-full max-w-lg'>
                <div className='overflow-y-auto rounded-t-3xl sm:rounded-3xl bg-white'>
                    <LowerBackground>
                        {/* Drag handle */}
                        <div className='flex justify-center pt-4 mb-0'>
                            <div className='h-1.5 w-20 rounded-full bg-gray-400' />
                        </div>
                        <div className='relative z-10 flex flex-col items-center px-6 pt-8 sm:pt-12 lg:pt-15'>
                            <Image
                                src='/boarding/Authentication.svg'
                                alt='Authentication illustration'
                                width={300}
                                height={300}
                                priority
                                className='w-50 sm:w-56 md:w-64 lg:w-80 h-auto drop-shadow-xl'
                            />
                            <h1 className='font-bold text-2xl font-alan mb-1 text-center'>
                                Skip workplace verification?
                            </h1>
                            <p className='text-gray-600 my-3 max-w-lg text-center text-sm sm:text-base'>
                                You can add your company and employee ID later
                                from your profile. However, nanny sharing will
                                not be available until your workplace is
                                verified for safety and trust reasons.
                            </p>
                            <div className='flex flex-row gap-3 w-full max-w-md my-4'>
                                <button
                                    type='button' // usually "button" for a "Back" action, not submit
                                    className='flex-1 py-3 px-5 border-2 border-blue-600 text-blue-600 font-semibold rounded-xl hover:bg-blue-50 active:bg-blue-100 transition-colors text-sm sm:text-base shadow-md'>
                                    Back to add
                                </button>

                                <button
                                    type='button'
                                    className='flex-1 py-3 px-5 bg-[#C43535] text-white font-semibold rounded-xl hover:bg-[#a72e2e] active:bg-[#902828] transition-colors text-sm sm:text-base shadow-md'>
                                    Skip Anyways
                                </button>
                            </div>
                        </div>
                    </LowerBackground>
                </div>
            </div>
        </div>
    );
}
