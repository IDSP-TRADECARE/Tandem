'use client';

import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { ScheduleData } from '@/app/schedule/upload/page';

interface FileUploadProps {
  onComplete: (data: ScheduleData) => void;
  onBack: () => void;
  hideBackButton?: boolean;
}

export function FileUpload({ onComplete, onBack, hideBackButton = false }: FileUploadProps) {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      setFile(acceptedFiles[0]);
      setError(null);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'image/png': ['.png'],
      'image/jpeg': ['.jpg', '.jpeg'],
    },
    maxFiles: 1,
  });

  const handleUpload = async () => {
    if (!file) return;

    setUploading(true);
    setProgress(0);
    setError(null);

    try {
      const progressInterval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 200);

      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/schedule/parse-pdf', {
        method: 'POST',
        body: formData,
      });

      clearInterval(progressInterval);
      setProgress(100);

      if (!response.ok) {
        throw new Error('Failed to parse file');
      }

      const data = await response.json();
      
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
      }, 500);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed');
      setUploading(false);
      setProgress(0);
    }
  };

  return (
    <div>
      {!hideBackButton && (
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
      )}

      {!file && !uploading && (
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer transition-colors ${
            isDragActive
              ? 'border-[#1e3a5f] bg-blue-50'
              : 'border-gray-300 hover:border-gray-400'
          }`}
        >
          <input {...getInputProps()} />
          <div className="flex flex-col items-center gap-4">
            <div className="w-20 h-20 bg-blue-50 rounded-2xl flex items-center justify-center">
              <svg className="w-10 h-10 text-[#1e3a5f]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
            </div>
            <div>
              <p className="text-xl font-bold text-[#0a1628] mb-2">Choose a file to upload</p>
              <p className="text-sm text-gray-500">png, pdf, jpg accepted</p>
            </div>
            <button className="px-8 py-3 bg-[#1e3a5f] text-[#c8ff00] font-bold rounded-xl hover:bg-[#2d4a6f] transition-colors">
              Browse
            </button>
          </div>
        </div>
      )}

      {file && !uploading && (
        <div className="space-y-4">
          <div className="border-2 border-gray-200 rounded-xl p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-[#1e3a5f]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <p className="font-semibold text-gray-900">{file.name}</p>
                <p className="text-sm text-gray-500">{(file.size / 1024).toFixed(2)} KB</p>
              </div>
            </div>
            <button
              onClick={() => setFile(null)}
              className="text-gray-400 hover:text-gray-600"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-xl">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          <button
            onClick={handleUpload}
            className="w-full py-4 px-4 bg-[#1e3a5f] text-white font-bold rounded-xl hover:bg-[#2d4a6f] transition-colors text-lg"
          >
            Upload Schedule
          </button>
        </div>
      )}

      {uploading && (
        <div className="space-y-6">
          <div className="flex flex-col items-center gap-4">
            <div className="w-20 h-20 bg-blue-50 rounded-2xl flex items-center justify-center">
              <svg className="w-10 h-10 text-[#1e3a5f] animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
            </div>
            <p className="text-xl font-bold text-gray-900">Uploading Schedule</p>
          </div>

          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Progress</span>
              <span className="text-gray-900 font-bold">{progress}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
              <div
                className="bg-[#1e3a5f] h-full rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}