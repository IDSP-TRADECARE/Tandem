"use client";

import Verify from "@/../d3-routes/sign-in/verify-cancel/workModal"; // Correct path!
import { useState } from "react";

export default function CompanyInfoIcon() {
    const [compOpen, setCompOpen] = useState(false);

    return (
        <>
            <button
                className='cursor-pointer z-50' // z-50 so it appears above everything
                onClick={() => setCompOpen(true)}>
                <svg
                    xmlns='http://www.w3.org/2000/svg'
                    width='31'
                    height='31'
                    viewBox='0 0 31 31'
                    fill='none'
                    className='text-white cursor-pointer hover:opacity-80 transition-opacity'>
                    <path
                        d='M15.125 15.125L15.125 22.0625M15.125 9.98285V9.92188M1.25 15.125C1.25 7.46205 7.46205 1.25 15.125 1.25C22.788 1.25 29 7.46205 29 15.125C29 22.788 22.788 29 15.125 29C7.46205 29 1.25 22.788 1.25 15.125Z'
                        stroke='currentColor'
                        strokeWidth='2.5'
                        strokeLinecap='round'
                        strokeLinejoin='round'
                    />
                </svg>
            </button>

            <Verify
                open={compOpen}
                onClose={() => setCompOpen(false)}
            />
        </>
    );
}
