'use client';

import { useState } from 'react';

interface FileUploadProps {
  onComplete: (data: any) => void;
  onBack: () => void;
  hideBackButton?: boolean;
}

export function FileUpload({ onComplete, onBack, hideBackButton }: FileUploadProps) {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [dragActive, setDragActive] = useState(false);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0];
      if (
        droppedFile.type === "application/pdf" ||
        droppedFile.type.startsWith("image/")
      ) {
        setFile(droppedFile);
      } else {
        alert("Please upload a PDF or image file");
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

const handleUpload = async () => {
  if (!file) return;

  setUploading(true);
  setUploadProgress(0);

  // Simulate upload progress
  const interval = setInterval(() => {
    setUploadProgress((prev) => {
      if (prev >= 90) {
        return 90;
      }
      return prev + 10;
    });
  }, 200);

  const formData = new FormData();
  formData.append("file", file);

  try {
    console.log('🚀 Starting upload:', file.name);
    
    // Step 1: Parse the PDF
    const response = await fetch("/api/schedule/parse-pdf", {
      method: "POST",
      body: formData,
    });

    console.log('📡 Response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Upload failed:', errorText);
      throw new Error(`Upload failed: ${errorText}`);
    }

    const result = await response.json();
    console.log('✅ Upload successful:', result);
    
    const scheduleData = result.schedule;
    console.log('📋 Schedule data:', scheduleData);
    
    // Step 2: Save to database
    const saveResponse = await fetch('/api/schedule/save', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(scheduleData),
});

if (!saveResponse.ok) {
  const errorData = await saveResponse.json();
  console.error('Save error:', errorData);
  throw new Error(errorData.error || 'Failed to save schedule to database');
}

    const saveResult = await saveResponse.json();
    console.log('✅ Saved to database:', saveResult);
    
    clearInterval(interval);
    setUploadProgress(100);
    
    setTimeout(() => {
      onComplete(scheduleData);
    }, 500);
  } catch (error) {
    console.error("❌ Upload error:", error);
    clearInterval(interval);
    
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    alert(`Failed to upload schedule: ${errorMessage}\n\nPlease check the console for details.`);
    
    setUploading(false);
    setUploadProgress(0);
    setFile(null);
  }
};

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + " " + sizes[i];
  };

  if (uploading) {
    return (
      <div className="w-full">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-3xl p-8 text-center relative overflow-hidden">
          {/* Animated spinner */}
          <div className="mb-6 relative">
            <div className="w-24 h-24 mx-auto">
              <svg className="w-full h-full animate-spin" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  fill="none"
                  stroke="rgba(255,255,255,0.2)"
                  strokeWidth="8"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  fill="none"
                  stroke="white"
                  strokeWidth="8"
                  strokeDasharray="283"
                  strokeDashoffset="70"
                  strokeLinecap="round"
                />
              </svg>
            </div>
          </div>

          <h3 className="text-xl font-bold text-white mb-2">
            Uploading Schedule
          </h3>
          <p className="text-white/90 text-sm mb-6">
            {file?.name}
          </p>

          {/* Progress bar */}
          {file && (
            <div className="mt-4">
              <div className="flex items-center gap-2 bg-white/20 rounded-lg p-3">
                <svg className="w-6 h-6 text-white flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" />
                </svg>
                <div className="flex-1">
                  <div className="flex justify-between text-xs text-white mb-1">
                    <span className="truncate max-w-[150px]">{file.name}</span>
                    <span>({formatFileSize(file.size)})</span>
                  </div>
                  <div className="w-full bg-white/30 rounded-full h-2">
                    <div 
                      className="bg-white h-2 rounded-full transition-all duration-300"
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  if (file && !uploading) {
    return (
      <div className="w-full space-y-4">
        <div className="border-3 border-gray-300 rounded-2xl p-4 bg-white">
          <div className="flex items-center gap-3">
            <svg className="w-10 h-10 text-red-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" />
            </svg>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-gray-900 truncate text-sm">
                {file.name} ({formatFileSize(file.size)})
              </p>
              <div className="w-full bg-blue-100 rounded-full h-2 mt-2">
                <div className="bg-blue-500 h-2 rounded-full" style={{ width: '100%' }} />
              </div>
            </div>
            <button
              onClick={() => setFile(null)}
              className="flex-shrink-0 text-gray-400 hover:text-red-600 ml-2"
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </div>
        </div>

        <button
          onClick={handleUpload}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 px-6 rounded-xl transition-colors text-lg"
        >
          Upload
        </button>
      </div>
    );
  }

  return (
    <div
      className={`border-3 border-dashed rounded-2xl p-12 text-center transition-colors ${
        dragActive
          ? "border-blue-500 bg-blue-50"
          : "border-gray-300 bg-white"
      }`}
      onDragEnter={handleDrag}
      onDragLeave={handleDrag}
      onDragOver={handleDrag}
      onDrop={handleDrop}
    >
      <div className="mb-6">
        <svg
          className="w-16 h-16 mx-auto text-blue-500"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
          />
        </svg>
      </div>

      <div className="mb-4">
        <p className="text-gray-900 font-medium mb-1">
          Choose a <span className="text-blue-600">file, image</span> to upload
        </p>
        <p className="text-sm text-gray-500">
          <span className="text-blue-600">png pdf jpg</span> accepted
        </p>
      </div>

      <label className="inline-block">
        <input
          type="file"
          accept=".pdf,.png,.jpg,.jpeg"
          onChange={handleFileChange}
          className="hidden"
        />
        <span className="px-8 py-3 bg-white border-2 border-blue-600 text-blue-600 rounded-full font-medium hover:bg-blue-50 transition-colors cursor-pointer inline-block">
          Browse
        </span>
      </label>
    </div>
  );
}