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
      // Start recording
      setStatus('recording');
    } else if (status === 'recording') {
      // Stop recording and process
      setStatus('processing');
      
      // Simulate processing
      setTimeout(() => {
        setTranscript('I work Monday to Friday from 9 AM to 5 PM at Vancouver Downtown');
        
        // Complete after processing
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
              {/* Microphone Button */}
              <button
                onClick={handleMicrophoneClick}
                className="w-40 h-40 rounded-full bg-white shadow-2xl flex items-center justify-center mx-auto mb-8 hover:scale-105 transition-transform relative group"
              >
                {/* Outer glow ring */}
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
              {/* Microphone Button with Gradient */}
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
              {/* Illustration */}
              <div className="mb-8 relative mx-auto w-64 h-64">
                {/* Large phone mockup */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <svg className="w-48 h-48" viewBox="0 0 200 300" fill="none">
                    {/* Phone body */}
                    <rect x="20" y="20" width="160" height="260" rx="20" fill="#1e293b" stroke="#334155" strokeWidth="2"/>
                    <rect x="30" y="40" width="140" height="220" rx="8" fill="white"/>
                    
                    {/* Screen content - microphone icon */}
                    <circle cx="100" cy="120" r="30" fill="#3b82f6"/>
                    <path d="M100 105 v20 M100 125 v5 M95 130 h10" stroke="white" strokeWidth="3" strokeLinecap="round"/>
                    
                    {/* Text lines */}
                    <rect x="50" y="170" width="100" height="4" rx="2" fill="#e5e7eb"/>
                    <rect x="60" y="180" width="80" height="4" rx="2" fill="#e5e7eb"/>
                  </svg>
                </div>

                {/* Person illustration */}
                <div className="absolute right-0 bottom-0">
                  <svg className="w-24 h-32" viewBox="0 0 100 120" fill="none">
                    {/* Person */}
                    <circle cx="50" cy="25" r="12" fill="#3b82f6"/>
                    <rect x="42" y="38" width="16" height="30" rx="4" fill="#3b82f6"/>
                    <rect x="42" y="68" width="7" height="25" rx="3" fill="#3b82f6"/>
                    <rect x="51" y="68" width="7" height="25" rx="3" fill="#3b82f6"/>
                    <rect x="35" y="40" width="12" height="4" rx="2" fill="#3b82f6"/>
                    <rect x="53" y="40" width="12" height="4" rx="2" fill="#3b82f6"/>
                  </svg>
                </div>

                {/* Sound waves */}
                <div className="absolute left-8 top-1/2 -translate-y-1/2">
                  <div className="flex gap-1">
                    <div className="w-1 h-8 bg-blue-400 rounded-full animate-pulse" style={{ animationDelay: '0ms' }}></div>
                    <div className="w-1 h-12 bg-blue-400 rounded-full animate-pulse" style={{ animationDelay: '150ms' }}></div>
                    <div className="w-1 h-6 bg-blue-400 rounded-full animate-pulse" style={{ animationDelay: '300ms' }}></div>
                  </div>
                </div>
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