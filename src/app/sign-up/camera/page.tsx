"use client";
import { GradientBackgroundFull } from "@/app/components/ui/backgrounds/GradientBackgroundFull";
import { HalfBackground } from "@/app/components/ui/backgrounds/HalfBackground";
import Image from "next/image";
import Link from "next/link";
import BackButton from "@/app/components/forms/backButton";

export default function CameraPage() {
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
                <div className='p-8'>
                    <h1 className='font-bold text-4xl font-alan'>
                        Scan the front of your ID
                    </h1>
                    {/* Camera Space here */}
                    <div className='pt-4'>
                        <svg
                            xmlns='http://www.w3.org/2000/svg'
                            width='340'
                            height='194'
                            viewBox='0 0 340 193'
                            fill='none'>
                            <path
                                opacity='0.65'
                                d='M312.917 0V1H317C318.471 1 319.907 1.14432 321.295 1.41895L321.487 0.438477C324.505 1.0353 327.31 2.22191 329.778 3.87402L329.223 4.70508C331.622 6.31154 333.688 8.37778 335.295 10.7773L336.125 10.2207C337.777 12.6886 338.964 15.494 339.561 18.5117L338.581 18.7051C338.856 20.0933 339 21.5294 339 23V27.083H340V35.25H339V43.417H340V51.583H339V59.75H340V67.917H339V76.083H340V84.25H339V92.417H340V100.583H339V108.75H340V116.917H339V125.083H340V133.25H339V141.417H340V149.583H339V157.75H340V165.917H339V170C339 171.471 338.856 172.907 338.581 174.295L339.561 174.487C338.964 177.505 337.777 180.31 336.125 182.778L335.295 182.223C333.688 184.622 331.622 186.688 329.223 188.295L329.778 189.125C327.31 190.777 324.505 191.964 321.487 192.561L321.295 191.581C319.907 191.856 318.471 192 317 192H312.917V193H304.75V192H296.583V193H288.417V192H280.25V193H272.083V192H263.917V193H255.75V192H247.583V193H239.417V192H231.25V193H223.083V192H214.917V193H206.75V192H198.583V193H190.417V192H182.25V193H174.083V192H165.917V193H157.75V192H149.583V193H141.417V192H133.25V193H125.083V192H116.917V193H108.75V192H100.583V193H92.417V192H84.25V193H76.083V192H67.917V193H59.75V192H51.583V193H43.417V192H35.25V193H27.083V192H23C21.5294 192 20.0933 191.856 18.7051 191.581L18.5117 192.561C15.494 191.964 12.6886 190.777 10.2207 189.125L10.7773 188.295C8.37778 186.688 6.31154 184.622 4.70508 182.223L3.87402 182.778C2.22191 180.31 1.0353 177.505 0.438477 174.487L1.41895 174.295C1.17865 173.08 1.03818 171.829 1.00684 170.55L1 170V165.917H0V157.75H1V149.583H0V141.417H1V133.25H0V125.083H1V116.917H0V108.75H1V100.583H0V92.417H1V84.25H0V76.083H1V67.917H0V59.75H1V51.583H0V43.417H1V35.25H0V27.083H1V23C1 21.5294 1.14432 20.0933 1.41895 18.7051L0.438477 18.5117C1.03541 15.4941 2.22184 12.6885 3.87402 10.2207L4.70508 10.7773C6.31154 8.37778 8.37778 6.31154 10.7773 4.70508L10.2207 3.87402C12.6885 2.22184 15.4941 1.03541 18.5117 0.438477L18.7051 1.41895C20.0933 1.14432 21.5294 1 23 1H27.083V0H35.25V1H43.417V0H51.583V1H59.75V0H67.917V1H76.083V0H84.25V1H92.417V0H100.583V1H108.75V0H116.917V1H125.083V0H133.25V1H141.417V0H149.583V1H157.75V0H165.917V1H174.083V0H182.25V1H190.417V0H198.583V1H206.75V0H214.917V1H223.083V0H231.25V1H239.417V0H247.583V1H255.75V0H263.917V1H272.083V0H280.25V1H288.417V0H296.583V1H304.75V0H312.917Z'
                                fill='white'
                                stroke='#3373CC'
                                strokeWidth='2'
                                strokeDasharray='8 8'
                            />
                        </svg>
                    </div>
                    <ul className='pt-8 pb-8 text-sm'>
                        <li>1. Place your ID inside the frame.</li>
                        <li>2. Make sure all corners are visible.</li>
                        <li>
                            3. Avoid reflections or shadows while capturing.
                        </li>
                        <li>4. Hold your phone steady while capturing.</li>
                    </ul>
                    {/* Camera Button */}
                    <Link href={"/sign-up/form"}>
                        <div className='flex justify-center'>
                            <div className='bg-neutral-50 p-1 rounded-full w-max'>
                                <div className='bg-white p-1 rounded-full w-max'>
                                    <div className='bg-primary-hover p-4 w-max rounded-full'>
                                        <svg
                                            xmlns='http://www.w3.org/2000/svg'
                                            width='23'
                                            height='21'
                                            viewBox='0 0 23 21'
                                            fill='none'>
                                            <path
                                                d='M14.5059 0C15.1276 0 15.4389 0.000723567 15.7168 0.0830078C16.0585 0.18418 16.3671 0.374424 16.6104 0.634766C16.8083 0.846565 16.9475 1.12455 17.2256 1.68066L18.2598 3.75C18.6556 4.54171 19.4654 5.04199 20.3506 5.04199C21.6411 5.04214 22.6875 6.08835 22.6875 7.37891V14.167C22.6875 16.9952 22.6872 18.4094 21.8086 19.2881C20.9299 20.1667 19.5157 20.167 16.6875 20.167H6C3.17173 20.167 1.7576 20.1666 0.878906 19.2881C0.000256248 18.4094 1.00079e-09 16.9952 0 14.167V7.37891C0 6.08826 1.04627 5.04199 2.33691 5.04199C3.22204 5.04199 4.03089 4.54166 4.42676 3.75L5.46191 1.68066C5.73994 1.12462 5.87924 0.846551 6.07715 0.634766C6.32042 0.374492 6.6291 0.184163 6.9707 0.0830078C7.24855 0.000806833 7.55926 1.37754e-09 8.18066 0H14.5059ZM11.3438 6.30273C8.55945 6.30285 6.30176 8.5604 6.30176 11.3447L6.30859 11.6035C6.43935 14.1813 8.50621 16.2482 11.084 16.3789L11.3438 16.3857C14.0409 16.3855 16.2428 14.2671 16.3779 11.6035L16.3848 11.3447C16.3848 8.64725 14.2665 6.44447 11.6025 6.30957L11.3438 6.30273ZM11.3438 8.30273C13.0234 8.30294 14.3848 9.66502 14.3848 11.3447C14.3843 13.0241 13.0231 14.3855 11.3438 14.3857C9.66429 14.3856 8.30221 13.0241 8.30176 11.3447C8.30176 9.66497 9.66402 8.30285 11.3438 8.30273Z'
                                                fill='white'
                                            />
                                        </svg>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Link>
                </div>
            </HalfBackground>
        </GradientBackgroundFull>
    );
}
