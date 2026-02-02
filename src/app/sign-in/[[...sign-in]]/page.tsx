'use client';

import Image from "next/image";
import { SignIn } from "@clerk/nextjs";
import { GradientBackgroundFull } from "@/app/components/ui/backgrounds/GradientBackgroundFull";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function SignInPage() {
  const router = useRouter();
  const [isGuestLoading, setIsGuestLoading] = useState(false);

  const handleGuestLogin = async () => {
    setIsGuestLoading(true);
    try {
      const response = await fetch('/api/auth/guest', {
        method: 'POST',
        credentials: 'include', // Important for cookies
      });

      if (response.ok) {
        // Guest session created successfully, redirect to main app
        router.push('/');
      } else {
        console.error('Failed to create guest session');
        alert('Failed to continue as guest. Please try again.');
        setIsGuestLoading(false);
      }
    } catch (error) {
      console.error('Error creating guest session:', error);
      alert('An error occurred. Please try again.');
      setIsGuestLoading(false);
    }
  };

  return (
    <GradientBackgroundFull>
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8 flex flex-col items-center">
          <h1 className="text-4xl font-bold text-white mb-2 flex items-center gap-4">
            <Image
              src="brand/nameWhite.svg" 
              alt="Logo"
              width={200}      
              height={200}     
            />
          </h1>
        </div>
        
        <SignIn 
          routing="path" 
          path="/sign-in"
          signUpUrl="/sign-up"
        />

        {/* Guest Login Option */}
        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">Or</span>
            </div>
          </div>

          <button
            onClick={handleGuestLogin}
            disabled={isGuestLoading}
            className="mt-6 w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
          >
            {isGuestLoading ? (
              <div className="flex items-center gap-2">
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Loading...</span>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <span>Continue as Guest Preview</span>
              </div>
            )}
          </button>
          
          <p className="mt-3 text-center text-xs text-gray-500">
            Guest Preview provides temporary access. Create an account to save your data.
          </p>
        </div>
      </div>
    </div>
    </GradientBackgroundFull>
  );
}
