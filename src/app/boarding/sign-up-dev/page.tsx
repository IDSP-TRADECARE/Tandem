'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { IoIosArrowBack } from "react-icons/io";
import { GradientBackgroundFull } from '@/app/components/ui/backgrounds/GradientBackgroundFull';
import { HalfBackground } from '@/app/components/ui/backgrounds/HalfBackground';

type Step = 'intro' | 'scan' | 'processing' | 'details' | 'address';

interface UserData {
  firstName: string;
  lastName: string;
  phoneNumber: string;
  streetAddress: string;
  city: string;
  zipCode: string;
}

export default function SignUpPage() {
  const [step, setStep] = useState<Step>('intro');
  const [userData, setUserData] = useState<UserData>({
    firstName: '',
    lastName: '',
    phoneNumber: '',
    streetAddress: '',
    city: '',
    zipCode: '',
  });
  const router = useRouter();

  const handleScan = () => {
    setStep('scan');
  };

  const handleCapture = () => {
    setStep('processing');
    // Simulate processing
    setTimeout(() => {
      // Mock data from scan
      setUserData({
        ...userData,
        firstName: 'Daniel',
        lastName: 'Liu',
      });
      setStep('details');
    }, 2000);
  };

  const handleDetailsNext = () => {
    setStep('address');
  };

  const handleAddressNext = () => {
    // Complete sign up
    router.push('/calendar'); 
  };

  const handleBack = () => {
    if (step === 'scan') setStep('intro');
    if (step === 'details') setStep('intro');
    if (step === 'address') setStep('details');
  };

  return (
    <GradientBackgroundFull>
      {/* Header */}
      <div className="p-4 flex items-center justify-between">
        {step !== 'intro' && (
          <button onClick={handleBack}>
            <IoIosArrowBack size={24} />
          </button>
        )}
        <h1 className="text-xl font-bold">Tandem</h1>
        <div className="w-6"></div>
      </div>
        <HalfBackground>
    <div className="min-h-screen flex flex-col">


      {/* Content */}
      <div className="flex-1 flex flex-col items-center justify-center p-8">
        
        {/* Step 1: Intro */}
        {step === 'intro' && (
          <div className="max-w-md w-full">
            <h2 className="text-2xl font-bold mb-4">Before you scan your ID</h2>
            <div className="mb-8">
              <p>1. Scan your drivers license or services card.</p>
              <p>2. Ensure all details are visible and easy to read.</p>
            </div>
            <button 
              onClick={handleScan}
              className="w-full py-3 bg-blue-500 text-white rounded"
            >
              Ready to scan
            </button>
          </div>
        )}

        {/* Step 2: Scan */}
        {step === 'scan' && (
          <div className="max-w-md w-full">
            <h2 className="text-2xl font-bold mb-4">Scan the front of your ID</h2>
            
            <div className="border-2 border-dashed border-gray-400 h-64 mb-8 flex items-center justify-center">
              <p>Camera viewfinder placeholder</p>
            </div>

            <div className="mb-8">
              <p>1. Place your ID inside the frame.</p>
              <p>2. Make sure all corners are visible.</p>
              <p>3. Avoid reflections or shadows while scanning.</p>
              <p>4. Hold your phone steady while capturing.</p>
            </div>

            <button 
              onClick={handleCapture}
              className="w-full py-3 bg-blue-500 text-white rounded"
            >
              Capture
            </button>
          </div>
        )}

        {/* Step 3: Processing */}
        {step === 'processing' && (
          <div className="max-w-md w-full text-center">
            <h2 className="text-2xl font-bold mb-4">Were reading your info...</h2>
            <div className="h-64 flex items-center justify-center mb-4">
              <p>Loading spinner placeholder</p>
            </div>
            <p>This may take a few seconds</p>
          </div>
        )}

        {/* Step 4: Details */}
        {step === 'details' && (
          <div className="max-w-md w-full">
            <h2 className="text-2xl font-bold mb-4">Weve filled in your details from your ID. Please review and edit if needed.</h2>
            
            <div className="mb-4">
              <label className="block mb-2">First Name</label>
              <input 
                type="text"
                value={userData.firstName}
                onChange={(e) => setUserData({...userData, firstName: e.target.value})}
                className="w-full p-2 border border-gray-300 rounded"
              />
            </div>

            <div className="mb-4">
              <label className="block mb-2">Last Name</label>
              <input 
                type="text"
                value={userData.lastName}
                onChange={(e) => setUserData({...userData, lastName: e.target.value})}
                className="w-full p-2 border border-gray-300 rounded"
              />
            </div>

            <div className="mb-8">
              <label className="block mb-2">Phone Number</label>
              <input 
                type="tel"
                placeholder="Enter your phone number"
                value={userData.phoneNumber}
                onChange={(e) => setUserData({...userData, phoneNumber: e.target.value})}
                className="w-full p-2 border border-gray-300 rounded"
              />
            </div>

            <div className="flex gap-4">
              <button onClick={handleBack} className="flex-1 py-3 border border-gray-300 rounded">
                Back
              </button>
              <button onClick={handleDetailsNext} className="flex-1 py-3 bg-blue-500 text-white rounded">
                Next
              </button>
            </div>
          </div>
        )}

        {/* Step 5: Address */}
        {step === 'address' && (
          <div className="max-w-md w-full">
            <h2 className="text-2xl font-bold mb-4">Please update it if you live somewhere else</h2>
            <p className="mb-8">This address helps us provide recommendations and services based on your area</p>
            
            <div className="mb-4">
              <label className="block mb-2">Street Address</label>
              <input 
                type="text"
                placeholder="234 Haha Street"
                value={userData.streetAddress}
                onChange={(e) => setUserData({...userData, streetAddress: e.target.value})}
                className="w-full p-2 border border-gray-300 rounded"
              />
            </div>

            <div className="mb-4">
              <label className="block mb-2">City</label>
              <input 
                type="text"
                placeholder="Vancouver"
                value={userData.city}
                onChange={(e) => setUserData({...userData, city: e.target.value})}
                className="w-full p-2 border border-gray-300 rounded"
              />
            </div>

            <div className="mb-8">
              <label className="block mb-2">Zip Code</label>
              <input 
                type="text"
                placeholder="L0L M4O"
                value={userData.zipCode}
                onChange={(e) => setUserData({...userData, zipCode: e.target.value})}
                className="w-full p-2 border border-gray-300 rounded"
              />
            </div>

            <div className="flex gap-4">
              <button onClick={handleBack} className="flex-1 py-3 border border-gray-300 rounded">
                Back
              </button>
              <button onClick={handleAddressNext} className="flex-1 py-3 bg-blue-500 text-white rounded">
                Next
              </button>
            </div>
          </div>
        )}

      </div>
    </div>     
        </HalfBackground>
    </GradientBackgroundFull>
  );
}