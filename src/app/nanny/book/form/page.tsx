'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { IoIosArrowBack } from 'react-icons/io';
import { BottomNav } from '@/app/components/Layout/BottomNav';

type BookingData = {
  children: Array<{ name: string; age: string }>;
  allergies: string;
  medicalConditions: string;
  learningBehavioral: string;
  additionalNotes: string;
  language: string;
  certifications: string[];
  budgetMin: string;
  budgetMax: string;
  experience: string;
  otherCertification: string;
};

export default function NannyBookingForm() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [showOtherCertInput, setShowOtherCertInput] = useState(false);
  const [bookingData, setBookingData] = useState<BookingData>({
    children: [{ name: '', age: '' }],
    allergies: '',
    medicalConditions: '',
    learningBehavioral: '',
    additionalNotes: '',
    language: 'English',
    certifications: [],
    budgetMin: '20',
    budgetMax: '40',
    experience: '',
    otherCertification: '',
  });

  const addChild = () => {
    setBookingData(prev => ({
      ...prev,
      children: [...prev.children, { name: '', age: '' }]
    }));
  };

  const updateChild = (index: number, field: 'name' | 'age', value: string) => {
    setBookingData(prev => ({
      ...prev,
      children: prev.children.map((child, i) => 
        i === index ? { ...child, [field]: value } : child
      )
    }));
  };

  const toggleCertification = (cert: string) => {
    if (cert === 'Others') {
      setShowOtherCertInput(!bookingData.certifications.includes(cert));
    }
    
    setBookingData(prev => ({
      ...prev,
      certifications: prev.certifications.includes(cert)
        ? prev.certifications.filter(c => c !== cert)
        : [...prev.certifications, cert]
    }));
  };

  const nextStep = () => {
    if (currentStep < 3) setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const handleSubmit = async () => {
    // TODO: Submit booking data
    console.log('Booking data:', bookingData);
    router.push('./schedule');
  };

  return (
    <div className="min-h-screen flex flex-col pb-24">
      {/* Header */}
      <div className="p-4 flex items-center justify-between">
        <button onClick={currentStep === 1 ? () => router.back() : prevStep}>
          <IoIosArrowBack size={24} />
        </button>
        <h1 className="text-xl font-bold">
          {currentStep === 1 && 'Basic info for booking nanny'}
          {currentStep === 2 && 'Help us keep your child safe'}
          {currentStep === 3 && 'Nanny preferences'}
        </h1>
        <div className="w-6"></div>
      </div>

      {/* Content */}
      <div className="flex-1 p-6">
        
        {/* Step 1: Family Info */}
        {currentStep === 1 && (
          <div>
            <h2 className="text-2xl font-bold mb-4">Tell us a little about your family</h2>
            <p className="text-gray-600 mb-6">How many kids do you have?</p>
            
            {bookingData.children.map((child, index) => (
              <div key={index} className="mb-6">
                <div className="flex gap-4 mb-2">
                  <div className="flex-1">
                    <label className="block mb-2">Child {index + 1}</label>
                    <input 
                      type="text"
                      placeholder="Child name"
                      value={child.name}
                      onChange={(e) => updateChild(index, 'name', e.target.value)}
                      className="w-full p-3 border rounded"
                    />
                  </div>
                  <div className="flex-1">
                    <label className="block mb-2">Age</label>
                    <input 
                      type="text"
                      placeholder="Child age"
                      value={child.age}
                      onChange={(e) => updateChild(index, 'age', e.target.value)}
                      className="w-full p-3 border rounded"
                    />
                  </div>
                </div>
              </div>
            ))}

            <button 
              onClick={addChild}
              className="text-green-600 flex items-center gap-2 mb-8"
            >
              <span className="text-2xl">+</span>
              Insert more child info
            </button>
          </div>
        )}

        {/* Step 2: Child Safety */}
        {currentStep === 2 && (
          <div>
            <h2 className="text-2xl font-bold mb-4">Help us keep your child safe</h2>
            <p className="text-gray-600 mb-6">Please share any important information about your child&apos;s needs</p>
            
            <div className="mb-4">
              <label className="block mb-2 font-bold">Allergies</label>
              <input 
                type="text"
                placeholder="e.g, food or environment"
                value={bookingData.allergies}
                onChange={(e) => setBookingData(prev => ({ ...prev, allergies: e.target.value }))}
                className="w-full p-3 border-b"
              />
            </div>

            <div className="mb-4">
              <label className="block mb-2 font-bold">Medical conditions</label>
              <input 
                type="text"
                placeholder="e.g, diagnoses or physical needs"
                value={bookingData.medicalConditions}
                onChange={(e) => setBookingData(prev => ({ ...prev, medicalConditions: e.target.value }))}
                className="w-full p-3 border-b"
              />
            </div>

            <div className="mb-4">
              <label className="block mb-2 font-bold">Learning & Behavioral</label>
              <input 
                type="text"
                placeholder="e.g, diagnoses or physical needs"
                value={bookingData.learningBehavioral}
                onChange={(e) => setBookingData(prev => ({ ...prev, learningBehavioral: e.target.value }))}
                className="w-full p-3 border-b"
              />
            </div>

            <div className="mb-4">
              <label className="block mb-2 font-bold">Additional Notes</label>
              <textarea 
                placeholder="Any other helpful info"
                value={bookingData.additionalNotes}
                onChange={(e) => setBookingData(prev => ({ ...prev, additionalNotes: e.target.value }))}
                className="w-full p-3 border rounded min-h-32"
              />
            </div>
          </div>
        )}

        {/* Step 3: Nanny Preferences */}
        {currentStep === 3 && (
          <div>
            <h2 className="text-2xl font-bold mb-2">Nanny preferences</h2>
            <p className="text-gray-600 mb-6">What are you looking for in a nanny?</p>
            
            <div className="mb-6">
              <label className="block mb-2 font-bold">Language</label>
              <div className="p-4 border rounded flex justify-between items-center">
                <span>{bookingData.language}</span>
                <span>›</span>
              </div>
            </div>

            <div className="mb-6">
              <div className="flex items-center gap-2 mb-3">
                <label className="font-bold">Certifications</label>
                <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm">
                  ?
                </div>
              </div>
              
              <div className="space-y-3">
                {['CPR & First-Aid Certified', 'Early Childhood Education (ECE)', 'Special Needs Experience', 'Others'].map(cert => (
                  <button
                    key={cert}
                    onClick={() => toggleCertification(cert)}
                    className={`w-full p-4 border-2 rounded-3xl flex items-center gap-3 ${
                      bookingData.certifications.includes(cert) ? 'bg-blue-100 border-blue-500' : 'border-gray-300'
                    }`}
                  >
                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                      bookingData.certifications.includes(cert) ? 'bg-blue-500 border-blue-500' : 'border-gray-300'
                    }`}>
                      {bookingData.certifications.includes(cert) && (
                        <span className="text-white text-sm">✓</span>
                      )}
                    </div>
                    <span>{cert}</span>
                  </button>
                ))}
              </div>

              {showOtherCertInput && bookingData.certifications.includes('Others') && (
                <div className="mt-4">
                  <label className="block mb-2">Write your own:</label>
                  <textarea 
                    value={bookingData.otherCertification}
                    onChange={(e) => setBookingData(prev => ({ ...prev, otherCertification: e.target.value }))}
                    className="w-full p-3 border rounded min-h-24"
                  />
                </div>
              )}
            </div>

            <div className="mb-6">
              <div className="flex items-center gap-2 mb-3">
                <label className="font-bold">Budget</label>
                <span className="bg-green-200 text-green-800 text-xs px-2 py-1 rounded">Recommend</span>
              </div>
              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="block text-sm mb-2">Minimum</label>
                  <input 
                    type="text"
                    value={`$${bookingData.budgetMin}`}
                    onChange={(e) => setBookingData(prev => ({ ...prev, budgetMin: e.target.value.replace('$', '') }))}
                    className="w-full p-3 border rounded text-center"
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-sm mb-2">Maximum</label>
                  <input 
                    type="text"
                    value={`$${bookingData.budgetMax}`}
                    onChange={(e) => setBookingData(prev => ({ ...prev, budgetMax: e.target.value.replace('$', '') }))}
                    className="w-full p-3 border rounded text-center"
                  />
                </div>
              </div>
            </div>

            <div className="mb-6">
              <label className="block mb-2 font-bold">Experience</label>
              <input 
                type="text"
                placeholder="e.g, 5 years"
                value={bookingData.experience}
                onChange={(e) => setBookingData(prev => ({ ...prev, experience: e.target.value }))}
                className="w-full p-3 border-b"
              />
            </div>
          </div>
        )}
      </div>

      {/* Navigation Buttons */}
      <div className="bottom-0 left-0 right-0 p-6 bg-white flex gap-4">
        {currentStep > 1 && (
          <button 
            onClick={prevStep}
            className="flex-1 py-3 border-2 border-blue-500 text-blue-500 rounded-full flex items-center justify-center gap-2"
          >
            <IoIosArrowBack />
            Back
          </button>
        )}
        <button 
          onClick={currentStep === 3 ? handleSubmit : nextStep}
          className="flex-1 py-3 bg-blue-500 text-white rounded-full flex items-center justify-center gap-2"
        >
          Next
          {currentStep < 3 && <span>›</span>}
        </button>
      </div>

      {/* Bottom Navigation */}
      <BottomNav />
    </div>
  );
}