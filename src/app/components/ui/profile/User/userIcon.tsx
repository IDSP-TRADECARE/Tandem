'use client';
import Image from 'next/image';
import { EditButton } from '../editbutton';

interface UserIconProps {
  profileImage: string;
  name: string;
  username: string;
  onEdit?: () => void;
  uploadingImage?: boolean;
}

export function UserIcon({ 
  profileImage, 
  name = "Jane Doe", 
  username = "@JaneDoe", 
  onEdit,
  uploadingImage = false
}: UserIconProps) {
  return (
    <div className="w-full flex flex-col items-center justify-center relative z-20 mb-10">
      {/* Profile picture with edit icon overlay */}
      <div className="relative flex justify-center items-center mb-3">
        {/* Circular profile picture placeholder with gradient border */}
        <div
          className="w-24 h-24 rounded-full p-1"
          style={{
            background: 'linear-gradient(180deg, #3373CC 0%, #6DB6AE 100%)',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
          }}
        >
          <div
            className="w-full h-full rounded-full bg-neutral-200 overflow-hidden relative"
            style={{
              border: '3px solid white',
            }}
          >
            <Image
              src={profileImage}
              alt="Profile"
              width={96}
              height={96}
              className="w-full h-full rounded-full object-cover"
            />
            {uploadingImage && (
              <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                <span className="text-white text-xs">Uploading...</span>
              </div>
            )}
          </div>
        </div>
        
        {/* Edit icon overlay */}
        {onEdit && (
          <div 
            className="absolute rounded-full"
            style={{ 
              bottom: '0px',
              right: 'calc(50% - 40px)',
              border: '2px solid white',
              boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
              zIndex: 10,
            }}
          >
            <EditButton onClick={onEdit} size={32} />
          </div>
        )}
      </div>

      {/* Name */}
      <h2 
        className="text-center mb-1 font-bold font-alan"
        style={{
          fontSize: '20px',
          color: '#000000',
        }}
      >
        {name}
      </h2>

      {/* Username */}
      <p 
        className="text-center mb-0 font-alan"
        style={{
          fontSize: '14px',
          color: '#3373CC',
        }}
      >
        {username}
      </p>
    </div>
  );
}

