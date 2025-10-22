'use client';

import { useState, useRef, useEffect } from 'react';
import { ScheduleData } from '@/app/schedule/upload/page';

interface VoiceInputProps {
  onComplete: (data: ScheduleData) => void;
  onBack: () => void;
}

export function VoiceInput({ onComplete, onBack }: VoiceInputProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  useEffect(() => {
    return () => {
      if (mediaRecorderRef.current && isRecording) {
        mediaRecorderRef.current.stop();
      }
    };
  }, [isRecording]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      // Try to use supported MIME types
      const mimeType = MediaRecorder.isTypeSupported('audio/webm;codecs=opus')
        ? 'audio/webm;codecs=opus'
        : MediaRecorder.isTypeSupported('audio/webm')
        ? 'audio/webm'
        : '';

      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: mimeType || undefined,
      });
      
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(chunksRef.current, { type: mimeType || 'audio/webm' });
        await processAudio(audioBlob);
        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
      setError(null);
    } catch (err) {
      setError('Could not access microphone. Please check permissions.');
      console.error('Error accessing microphone:', err);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const processAudio = async (audioBlob: Blob) => {
    setIsProcessing(true);
    setError(null);

    try {
      const formData = new FormData();
      
      // Create a file with .webm extension (Groq accepts webm)
      const audioFile = new File([audioBlob], 'recording.webm', { 
        type: 'audio/webm' 
      });
      
      formData.append('audio', audioFile);

      const response = await fetch('/api/schedule/transcribe-voice', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.details || 'Failed to process voice input');
      }

      const data = await response.json();
      setTranscript(data.transcript);

      // Save to database
      const saveResponse = await fetch('/api/schedule/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data.schedule),
      });

      if (!saveResponse.ok) {
        throw new Error('Failed to save schedule');
      }

      setTimeout(() => {
        onComplete(data.schedule);
      }, 1000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to process audio');
      setIsProcessing(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="mb-4">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back
        </button>
      </div>

      <h2 className="text-2xl font-bold text-gray-900 mb-2">Voice Input</h2>
      <p className="text-gray-600 mb-6">
        Tell us about your schedule! We'll help you fill it in.
      </p>

      <div className="flex flex-col items-center gap-6">
        {!isRecording && !isProcessing && !transcript && (
          <>
            <div className="w-32 h-32 bg-blue-100 rounded-full flex items-center justify-center">
              <svg className="w-16 h-16 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
              </svg>
            </div>
            <p className="text-center text-gray-600 max-w-sm">
              Tell us about your schedule! We'll help you fill it in.
            </p>
            <button
              onClick={startRecording}
              className="px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
            >
              Start Recording
            </button>
          </>
        )}

        {isRecording && (
          <>
            <div className="relative">
              <div className="w-32 h-32 bg-red-100 rounded-full flex items-center justify-center animate-pulse">
                <svg className="w-16 h-16 text-red-600" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z"/>
                  <path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z"/>
                </svg>
              </div>
              <div className="absolute inset-0 rounded-full border-4 border-red-400 animate-ping"></div>
            </div>
            <p className="text-center font-semibold text-gray-900">Recording...</p>
            <p className="text-sm text-gray-600 text-center max-w-sm">
              Speak clearly about your work schedule
            </p>
            <button
              onClick={stopRecording}
              className="px-8 py-3 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition-colors"
            >
              Stop Recording
            </button>
          </>
        )}

        {isProcessing && (
          <>
            <div className="w-32 h-32 bg-blue-100 rounded-full flex items-center justify-center">
              <svg className="w-16 h-16 text-blue-600 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </div>
            <p className="text-center font-semibold text-gray-900">Processing your schedule...</p>
            <p className="text-sm text-gray-600">This may take a moment</p>
          </>
        )}

        {transcript && !isProcessing && (
          <div className="w-full space-y-4">
            <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
              <p className="text-sm font-semibold text-gray-700 mb-2">Transcript:</p>
              <p className="text-gray-900">{transcript}</p>
            </div>
          </div>
        )}

        {error && (
          <div className="w-full p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-600">{error}</p>
            <button
              onClick={() => {
                setError(null);
                setTranscript('');
              }}
              className="mt-2 text-sm text-red-700 underline"
            >
              Try again
            </button>
          </div>
        )}
      </div>
    </div>
  );
}