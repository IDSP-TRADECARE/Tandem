'use client';

import { detectNextWeek } from "@/lib/schedule/detectNextWeek";
import { useState, useRef } from 'react';

interface VoiceInputProps {
  onComplete: (data: any) => void;
  onBack: () => void;
}

export function VoiceInput({ onComplete, onBack }: VoiceInputProps) {
  const [status, setStatus] = useState<'idle' | 'recording' | 'processing'>('idle');
  const [error, setError] = useState<string | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const stopStreamTracks = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
  };

  const handleMicrophoneClick = async () => {
    if (status === 'idle') {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        streamRef.current = stream;
        const mediaRecorder = new MediaRecorder(stream);
        mediaRecorderRef.current = mediaRecorder;
        audioChunksRef.current = [];

        mediaRecorder.ondataavailable = (event) => {
          if (event.data && event.data.size > 0) {
            audioChunksRef.current.push(event.data);
          }
        };

        mediaRecorder.start();
        setStatus('recording');
        setError(null);
        console.log('🎤 Started recording...');
      } catch (err) {
        console.error('Failed to start recording:', err);
        setError('Failed to access microphone. Please allow microphone access.');
        setStatus('idle');
      }
      return;
    }

    if (status === 'recording') {
      if (!mediaRecorderRef.current) {
        setError('Recording error');
        setStatus('idle');
        stopStreamTracks();
        return;
      }

      mediaRecorderRef.current.onstop = async () => {
        setStatus('processing');

        try {
          const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
          console.log('🎵 Audio blob created:', audioBlob.size, 'bytes');

          const formData = new FormData();
          formData.append('audio', audioBlob, 'recording.webm');

          const response = await fetch('/api/schedule/transcribe-voice', {
            method: 'POST',
            body: formData,
          });

          if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.error || 'Failed to process voice input');
          }

          const { transcript, schedule } = await response.json();
          console.log('📝 Transcript:', transcript);
          console.log('📋 Parsed schedule:', schedule);

          // 🆕 DETECT NEXT WEEK
          const forNextWeek = detectNextWeek(transcript);
          console.log("📅 Next-week detected:", forNextWeek);

          // 🆕 MERGE FOR NEXT WEEK FLAG
          let enrichedSchedule = {
            ...schedule,
            forNextWeek,
          };

          // If voice parser created daySchedules, extract first time
          const days = Object.keys(schedule.daySchedules || {});
          if (days.length > 0) {
            const first = schedule.daySchedules[days[0]];
            enrichedSchedule = {
              ...enrichedSchedule,
              timeFrom: first?.timeFrom || '',
              timeTo: first?.timeTo || '',
            };
          }

          // SAVE schedule including next-week flag
          const saveResponse = await fetch('/api/schedule/save', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(enrichedSchedule),
            credentials: 'include',
          });

          if (!saveResponse.ok) {
            const errorData = await saveResponse.json().catch(() => ({}));
            console.error('Save error:', errorData);
            throw new Error(errorData.error || 'Failed to save schedule');
          }

          const saveResult = await saveResponse.json();
          console.log('✅ Schedule saved successfully:', saveResult);

          if (saveResult.scheduleId) {
            enrichedSchedule = { ...enrichedSchedule, scheduleId: saveResult.scheduleId };
          }

          // cleanup audio
          stopStreamTracks();
          mediaRecorderRef.current = null;
          audioChunksRef.current = [];

          // Return final enriched schedule to flow
          setTimeout(() => onComplete(enrichedSchedule), 500);

        } catch (err) {
          console.error('❌ Voice input error:', err);
          setError(err instanceof Error ? err.message : 'Failed to process voice input');
          setStatus('idle');

          stopStreamTracks();
          mediaRecorderRef.current = null;
          audioChunksRef.current = [];
        }
      };

      // STOP recording
      try {
        mediaRecorderRef.current.stop();
        console.log('🎤 Stopped recording');
      } catch (err) {
        console.error('Failed to stop recorder:', err);
        setError('Failed to stop recording');
        setStatus('idle');
        stopStreamTracks();
        mediaRecorderRef.current = null;
        audioChunksRef.current = [];
      }
    }
  };

  return (
    <div className="relative min-h-[600px] flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-6 pb-4 relative z-20 bg-white">
        <h2 className="text-2xl font-bold text-gray-900">Voice to Text Input</h2>

        <button
          onClick={onBack}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors relative z-30"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Content */}
      <div className="absolute inset-0 flex items-center justify-center pt-16 pb-8">
        <div className="w-full px-8">
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
                <p className="text-gray-700 text-lg leading-relaxed">Hi! Tell me about your schedule!</p>
                <p className="text-gray-700 text-lg leading-relaxed">I will help you to fill that in!</p>
              </div>

              {error && (
                <div className="mt-6 p-4 bg-red-50 border-2 border-red-200 rounded-xl max-w-md mx-auto">
                  <p className="text-sm text-red-600 font-semibold">{error}</p>
                </div>
              )}
            </div>
          )}

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
                <p className="text-gray-700 text-lg leading-relaxed">Voice recording...</p>
                <p className="text-gray-700 text-lg leading-relaxed">Click the button again when finished</p>
              </div>
            </div>
          )}

          {status === 'processing' && (
            <div className="text-center">
              <div className="mb-8 relative mx-auto w-80 h-64 flex items-center justify-center">
                <img src="/upload/voiceInput.svg" alt="Processing illustration" className="w-full h-full object-contain" />
              </div>

              <div className="max-w-md mx-auto">
                <p className="text-gray-700 text-lg leading-relaxed mb-2">Please wait...</p>
                <p className="text-gray-700 text-lg leading-relaxed flex items-center justify-center gap-2">
                  Processing your words
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
