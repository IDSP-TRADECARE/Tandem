import { SmallBackground } from "@/app/components/ui/backgrounds/SmallBackground";

interface HelpModalProps {
    open: boolean;
    onClose: () => void;
}

export default function HelpModal({ open, onClose }: HelpModalProps) {
    if (!open) return null;

    return (
        <div className='fixed inset-0 z-50 flex items-end justify-center sm:items-center'>
            {/* Backdrop */}
            <div
                className='absolute inset-0 bg-black/60'
                onClick={onClose}
            />

            {/* Modal Panel */}
            <div className='z-10 w-full max-w-lg'>
                <div className='overflow-y-auto rounded-t-3xl sm:rounded-3xl bg-white'>
                    <SmallBackground>
                        {/* Drag handle */}
                        <div className='flex justify-center pt-4 pb-0'>
                            <div className='h-1.5 w-20 rounded-full bg-gray-400' />
                        </div>

                        <div className='relative z-10 flex flex-col px-8 pt-8 pb-12 sm:pt-12'>
                            <h1 className='font-bold text-3xl font-alan mb-1 text-black'>
                                Need help?
                            </h1>
                            <p className='text-gray-600 max-w-lg text-sm sm:text-base'>
                                Having trouble uploading your information or
                                running into another issue?
                            </p>
                            <p className='text-gray-600 max-w-lg text-sm sm:text-base'>
                                No worries - we're here to help!
                            </p>

                            <div className='mt-2 flex items-center gap-3'>
                                <svg
                                    width='32'
                                    height='32'
                                    viewBox='0 0 24 24'
                                    fill='none'
                                    stroke='black'
                                    strokeWidth='2'>
                                    <rect
                                        width='20'
                                        height='16'
                                        x='2'
                                        y='4'
                                        rx='2'
                                    />
                                    <path d='m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7' />
                                </svg>
                                <span className='text-lg font-alan text-black'>
                                    tandemfortrades@gmail.com
                                </span>
                            </div>
                        </div>
                    </SmallBackground>
                </div>
            </div>
        </div>
    );
}
