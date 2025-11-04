'use client';

import { useState } from 'react';

interface VoiceInputProps {
  onComplete: (data: any) => void;
  onBack: () => void;
}

export function VoiceInput({ onComplete, onBack }: VoiceInputProps) {
  const [status, setStatus] = useState<'idle' | 'recording' | 'processing'>('idle');
  const [transcript, setTranscript] = useState('');

  const handleMicrophoneClick = () => {
    if (status === 'idle') {
      setStatus('recording');
    } else if (status === 'recording') {
      setStatus('processing');
      
      setTimeout(() => {
        setTranscript('I work Monday to Friday from 9 AM to 5 PM at Vancouver Downtown');
        
        setTimeout(() => {
          onComplete({
            title: 'Work Schedule',
            workingDays: ['MON', 'TUE', 'WED', 'THU', 'FRI'],
            timeFrom: '09:00',
            timeTo: '17:00',
            location: 'Vancouver Downtown',
            notes: 'Created via voice input',
          });
        }, 2000);
      }, 2000);
    }
  };

  return (
    <div className="relative min-h-[600px] flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-6 pb-4">
        <h2 className="text-2xl font-bold text-gray-900">Voice to Text Input</h2>
        <button
          onClick={onBack}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Content - Absolutely Centered */}
      <div className="absolute inset-0 flex items-center justify-center pt-16 pb-8">
        <div className="w-full px-8">
          
          {/* Idle State */}
          {status === 'idle' && (
            <div className="text-center">
              <button
                onClick={handleMicrophoneClick}
                className="w-40 h-40 rounded-full bg-white shadow-2xl flex items-center justify-center mx-auto mb-8 hover:scale-105 transition-transform relative group"
              >
                <div className="absolute inset-0 rounded-full bg-blue-100 opacity-0 group-hover:opacity-100 transition-opacity animate-pulse"></div>
                
                <svg className="w-20 h-20 text-blue-500 relative z-10" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z"/>
                  <path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z"/>
                </svg>
              </button>

              <p className="text-xl font-semibold text-gray-900 mb-6">Voice Input</p>

              <div className="max-w-md mx-auto">
                <p className="text-gray-700 text-lg leading-relaxed">
                  Hi! Tell me about your schedule!
                </p>
                <p className="text-gray-700 text-lg leading-relaxed">
                  I will help you to fill that in!
                </p>
              </div>
            </div>
          )}

          {/* Recording State */}
          {status === 'recording' && (
            <div className="text-center">
              <button
                onClick={handleMicrophoneClick}
                className="w-40 h-40 rounded-full shadow-2xl flex items-center justify-center mx-auto mb-8 relative overflow-hidden bg-gradient-to-br from-blue-500 to-teal-400 animate-pulse"
              >
                <svg className="w-20 h-20 text-white relative z-10" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z"/>
                  <path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z"/>
                </svg>
              </button>

              <p className="text-xl font-semibold text-gray-900 mb-6">Voice Input</p>

              <div className="max-w-md mx-auto">
                <p className="text-gray-700 text-lg leading-relaxed">
                  Voice recording...
                </p>
                <p className="text-gray-700 text-lg leading-relaxed">
                  Please click at the voice input button again
                </p>
                <p className="text-gray-700 text-lg leading-relaxed">
                  when you have finished recording
                </p>
              </div>
            </div>
          )}

          {/* Processing State */}
          {status === 'processing' && (
            <div className="text-center">
              <div className="mb-8 relative mx-auto w-80 h-64 flex items-center justify-center">
                <img 
                  src="/voiceInputPerson.png" 
                  alt="Processing illustration" 
                  className="w-full h-full object-contain"
                />
              </div>

              <div className="max-w-md mx-auto">
                <p className="text-gray-700 text-lg leading-relaxed mb-2">
                  Please wait a moment...
                </p>
                <p className="text-gray-700 text-lg leading-relaxed flex items-center justify-center gap-2">
                  Our system is processing your words
                  <svg className="w-5 h-5 text-gray-600 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                </p>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}