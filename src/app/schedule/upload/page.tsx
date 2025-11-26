'use client';

import { useState } from 'react';
import { FileUpload } from '../../components/schedule/fileUpload';
import { ManualInput } from '../../components/schedule/manualnput';
import { VoiceInput } from '../../components/schedule/voiceInput';
import { ScheduleOverview } from '../../components/schedule/scheduleOverview';
import { BottomNav } from '../../components/Layout/BottomNav';
import {auth} from "@clerk/nextjs/server";
import { redirect } from 'next/navigation';

export type InputMethod = 'file' | 'voice' | 'manual';
export type UploadStep = 'select' | 'uploading' | 'complete' | 'overview';

export interface ScheduleData {
  id?: string;
  title: string;
  workingDays: string[];
  timeFrom: string;
  timeTo: string;
  location: string;
  notes: string;
  daySchedules?: Record<string, { timeFrom: string; timeTo: string }>; 
}

export default function ScheduleUploadPage() {
  const [inputMethod, setInputMethod] = useState<InputMethod>('file');
  const [step, setStep] = useState<UploadStep>('select');
  const [scheduleData, setScheduleData] = useState<ScheduleData | null>(null);
  const [showVoiceInput, setShowVoiceInput] = useState(false);

  const handleMethodSelect = (method: InputMethod) => {
    setInputMethod(method);
    if (method === 'voice') {
      setShowVoiceInput(true);
    } else {
      setStep('uploading');
    }
  };

  const handleScheduleComplete = (data: ScheduleData) => {
    setScheduleData(data);
    setStep('complete');
    setShowVoiceInput(false);
  };

  const handleViewOverview = () => {
    setStep('overview');
  };

  const handleEdit = () => {
    setStep('uploading');
  };

  const handleReset = () => {
    setInputMethod('file');
    setStep('select');
    setScheduleData(null);
    setShowVoiceInput(false);
  };

  const handleUploadClick = () => {
    if (step !== 'select') {
      handleReset();
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Main Content */}
      <div className="flex-1 pb-32">
        {step === 'select' && (
          <div className="px-4 pt-6">
            {/* Tab Navigation */}
            <div className="flex gap-0 mb-8 bg-white border-2 border-gray-300 rounded-full p-1">
              <button
                onClick={() => setInputMethod('file')}
                className={`flex-1 py-3 px-6 rounded-full font-semibold transition-all ${
                  inputMethod === 'file'
                    ? 'bg-gradient-primary text-white'
                    : 'bg-white text-blue-600'
                }`}
              >
                File Upload
              </button>
              <button
                onClick={() => setInputMethod('manual')}
                className={`flex-1 py-3 px-6 rounded-full font-semibold transition-all ${
                  inputMethod === 'manual'
                    ? 'bg-gradient-primary text-white'
                    : 'bg-white text-blue-600'
                }`}
              >
                Manual Input
              </button>
            </div>

            {/* Content based on selected tab */}
            {inputMethod === 'file' && (
              <div>
                <h1 className="text-3xl font-bold text-black mb-3">
                  Upload your schedule
                </h1>
                <p className="text-gray-600 mb-8">
                  Share your schedule with us for more flexibility
                </p>
                <FileUpload onComplete={handleScheduleComplete} onBack={handleReset} hideBackButton />
              </div>
            )}

            {inputMethod === 'manual' && (
              <div>
                <h1 className="text-3xl font-bold text-black mb-3">
                  Input your schedule
                </h1>
                <p className="text-gray-600 mb-8">
                  Fill in your work schedule details below
                </p>
                <ManualInput onComplete={handleScheduleComplete} onBack={handleReset} hideBackButton />
              </div>
            )}

            {/* Voice Input Button - Only show on File Upload tab */}
            {inputMethod === 'file' && (
              <div className="fixed bottom-32 right-5 flex flex-col items-center z-40">
                <button
                  onClick={() => handleMethodSelect('voice')}
                  className="w-16 h-16 bg-gradient-primary text-white rounded-full shadow-xl flex items-center justify-center hover:scale-105 transition-transform mb-2"
                >
                  <svg className="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z"/>
                    <path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z"/>
                  </svg>
                </button>
                <span className="text-sm font-bold text-black mb-3">Voice Input</span>
              </div>
            )}
          </div>
        )}

        {step === 'uploading' && inputMethod === 'file' && (
          <div className="px-4 pt-6">
            <FileUpload onComplete={handleScheduleComplete} onBack={handleReset} />
          </div>
        )}

        {step === 'uploading' && inputMethod === 'manual' && (
          <div className="px-4 pt-6">
            <ManualInput onComplete={handleScheduleComplete} onBack={handleReset} />
          </div>
        )}

        {step === 'complete' && scheduleData && (
          <div className="px-4 pt-6">
            <div className="bg-white rounded-lg p-6">
              <div className="text-center mb-6">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-4">
                  <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Upload Complete</h2>
                <p className="text-gray-600">Your schedule has been successfully uploaded</p>
              </div>

              <div className="space-y-3">
                <button
                  onClick={handleViewOverview}
                  className="w-full py-3 px-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
                >
                  View Overview
                </button>
                <button
                  onClick={handleReset}
                  className="w-full py-3 px-4 border-2 border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Upload Another
                </button>
              </div>
            </div>
          </div>
        )}

        {step === 'overview' && scheduleData && (
          <div className="px-4 pt-6">
            <ScheduleOverview 
              data={scheduleData}
              onEdit={handleEdit}
              onBack={handleReset} 
              onSave={function (updatedData: ScheduleData): Promise<void> {
                throw new Error('Function not implemented.');
              } }            />
          </div>
        )}
      </div>

      {/* Bottom Navigation */}
      <BottomNav/>

      {/* Voice Input Modal */}
      {showVoiceInput && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-md w-full">
            <VoiceInput 
              onComplete={handleScheduleComplete} 
              onBack={() => {
                setShowVoiceInput(false);
                setInputMethod('file');
              }} 
            />
          </div>
        </div>
      )}
    </div>
  );
}