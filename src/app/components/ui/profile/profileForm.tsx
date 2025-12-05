/* eslint-disable @next/next/no-img-element */
'use client';
import { Input } from './input';
import { TextBox } from './textbox';
import { ActionButton } from './actionbtn';
import { BottomNav } from '@/app/components/Layout/BottomNav';
import React from 'react';

interface ProfileFormProps {
  formData: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    bio: string;
  };
  onInputChange: (field: string, value: string) => void;
  passwordDisplay: string;
  passwordIcon: string;
  onTogglePassword: () => void;
  onSave: () => void;
  saving?: boolean;
}

export function ProfileForm({
  formData,
  onInputChange,
  passwordDisplay,
  passwordIcon,
  onTogglePassword,
  onSave,
  saving = false,
}: ProfileFormProps) {
  return (
    <div className="w-full px-2 sm:px-4 pt-12 pb-24 space-y-6">
      <div className="flex flex-col space-y-5 w-full mx-auto px-2 sm:px-0">
        <Input
          label="First Name"
          value={formData.firstName}
          onChange={(e) => onInputChange('firstName', e.target.value)}
          placeholder="Enter first name"
        />

        <Input
          label="Last Name"
          value={formData.lastName}
          onChange={(e) => onInputChange('lastName', e.target.value)}
          placeholder="Enter last name"
        />

        <TextBox
          label="Bio"
          value={formData.bio}
          onChange={(e) => onInputChange('bio', e.target.value)}
          placeholder="Tell us about yourself"
        />

        <Input
          label="Email Address"
          type="email"
          value={formData.email}
          onChange={(e) => onInputChange('email', e.target.value)}
          placeholder="Enter email"
        />

        <div className="flex flex-col space-y-5">
          <span
            style={{
              fontFamily: 'Alan Sans',
              fontSize: '20px',
              fontWeight: 500,
            }}
            className="text-black mb-2"
          >
            Password
          </span>
          <div className="w-full border-b border-black flex items-center justify-between pb-2">
            <span className="text-black" style={{ fontFamily: 'Omnes', fontSize: '16px', fontWeight: 400 }}>
              {passwordDisplay}
            </span>
            <button
              onClick={onTogglePassword}
              className="p-1"
              aria-label="Toggle password visibility"
              type="button"
            >
              
              <img src={passwordIcon} alt="Toggle password" width={24} height={24} />
            </button>
          </div>

          <Input
            label="Phone Number"
            type="tel"
            value={formData.phone}
            onChange={(e) => onInputChange('phone', e.target.value)}
            placeholder="Enter phone number"
          />

          <div className="pt-4 flex justify-center">
            <ActionButton 
              text={saving ? "Saving..." : "Save"} 
              onClick={onSave}
            />
          </div>
        </div>

        <div className="mt-8">
          <BottomNav />
        </div>
      </div>
    </div>
  );
}

