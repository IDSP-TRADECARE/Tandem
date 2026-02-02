'use client';

import { SignUp } from "@clerk/nextjs";
import Image from "next/image"; 
import { GradientBackgroundFull } from "@/app/components/ui/backgrounds/GradientBackgroundFull";
import { useState } from "react";
import { useRouter } from "next/navigation";


export default function SignUpPage() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleGuestSignUp = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/auth/guest', {
        method: 'POST',
      });

      if (!response.ok) {
        throw new Error('Failed to create guest account');
      }

      const data = await response.json();
      
      // Store guest user info in localStorage
      localStorage.setItem('guestUser', JSON.stringify(data.user));
      
      // Redirect to calendar
      router.push('/calendar');
    } catch (error) {
      console.error('Error creating guest account:', error);
      alert('Failed to create guest account. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <GradientBackgroundFull>
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-cyan-500 via-blue-400 light-blue-200 p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2 flex justify-center">
            <Image 
              src="brand/nameWhite.svg" 
              alt="Logo"
              width={200}      
              height={200}     
            />
          </h1>
        </div>
        <SignUp 
          routing="path" 
          path="/sign-up"
          signInUrl="/sign-in"
        />
        <div className="mt-6">
          <button
            onClick={handleGuestSignUp}
            disabled={isLoading}
            className="w-full py-3 px-6 bg-white/20 backdrop-blur-sm text-white font-semibold rounded-lg hover:bg-white/30 active:bg-white/40 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed border border-white/30"
          >
            {isLoading ? 'Creating guest account...' : 'Continue as Guest'}
          </button>
          <p className="text-center text-white/80 text-sm mt-2">
            Try the app without creating an account
          </p>
        </div>
      </div>
    </div>
    </GradientBackgroundFull>
  );
}
