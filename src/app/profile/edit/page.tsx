'use client';

import { useState, useEffect, useRef } from 'react';
import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { IoIosArrowBack } from 'react-icons/io';
import { GradientBackgroundFull } from '@/app/components/ui/backgrounds/GradientBackgroundFull';
import { HalfBackground } from '@/app/components/ui/backgrounds/HalfBackground';
import { BottomNav } from '@/app/components/Layout/BottomNav';

export default function EditProfilePage() {
  const { user } = useUser();
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [name, setName] = useState('');
  const [bio, setBio] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [profilePicture, setProfilePicture] = useState('');
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    async function loadProfile() {
      if (!user?.id) return;
      
      try {
        const response = await fetch('/api/profile');
        if (response.ok) {
          const data = await response.json();
          setName(data.firstName && data.lastName ? `${data.firstName} ${data.lastName}` : user.fullName || '');
          setBio(data.bio || '');
          setEmail(data.email || user.primaryEmailAddress?.emailAddress || '');
          setPhone(data.phone || '');
          setProfilePicture(data.profilePicture || user.imageUrl || '/profile/placeholderAvatar.png');
        } else {
          setName(user.fullName || '');
          setEmail(user.primaryEmailAddress?.emailAddress || '');
          setProfilePicture(user.imageUrl || '/profile/placeholderAvatar.png');
        }
      } catch (error) {
        console.error('Failed to load profile:', error);
      } finally {
        setLoading(false);
      }
    }

    loadProfile();
  }, [user]);

  const validateEmail = (email: string) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const validatePhone = (phone: string) => {
    const regex = /^\+?[1-9]\d{1,14}$/;
    return regex.test(phone.replace(/[\s-()]/g, ''));
  };

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setErrors({ ...errors, image: 'Please select an image file' });
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setErrors({ ...errors, image: 'Image size must be less than 5MB' });
      return;
    }

    setUploading(true);
    setErrors({ ...errors, image: '' });

    try {
      // Convert to base64
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setProfilePicture(base64String);
        setUploading(false);
      };
      reader.onerror = () => {
        setErrors({ ...errors, image: 'Failed to read image' });
        setUploading(false);
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error('Error uploading image:', error);
      setErrors({ ...errors, image: 'Failed to upload image' });
      setUploading(false);
    }
  };

  const handleSave = async () => {
    if (!user?.id) return;

    const newErrors: { [key: string]: string } = {};

    if (!validateEmail(email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (phone && !validatePhone(phone)) {
      newErrors.phone = 'Please enter a valid phone number';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});

    try {
      const [firstName, ...lastNameParts] = name.split(' ');
      const lastName = lastNameParts.join(' ');

      const response = await fetch('/api/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName,
          lastName,
          bio,
          email,
          phone,
          profilePicture,
        }),
      });

      if (response.ok) {
        router.push('/profile');
      } else {
        const data = await response.json();
        setErrors({ general: data.error || 'Failed to save profile' });
      }
    } catch (error) {
      console.error('Error saving profile:', error);
      setErrors({ general: 'Failed to save profile' });
    }
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <GradientBackgroundFull>
      <div className="p-6 flex items-center">
        <button onClick={() => router.back()}>
          <IoIosArrowBack size={24} color="white" />
        </button>
        <h1 className="text-white text-2xl font-bold flex-1 text-center mr-6">Edit Profile</h1>
      </div>

      <HalfBackground>
        <div className="absolute inset-0 overflow-y-auto">
          <div className="p-6 pt-20 pb-24">
            {/* Profile Picture */}
            <div className="relative -mt-36 mb-4 text-center">
              <Image
                src={profilePicture}
                alt="Profile"
                width={128}
                height={128}
                className="w-32 h-32 rounded-full mx-auto border-4 border-white object-cover"
              />
              <button 
                onClick={handleImageClick}
                disabled={uploading}
                className="absolute bottom-0 right-1/2 translate-x-16 bg-blue-500 text-white rounded-full w-10 h-10 flex items-center justify-center hover:bg-blue-600 disabled:bg-gray-400"
              >
                {uploading ? '⏳' : '✏️'}
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
            </div>

            {errors.image && (
              <p className="text-red-500 text-sm text-center mb-4">{errors.image}</p>
            )}

            <div className="text-center mb-6">
              <h2 className="text-xl font-bold">{name || 'User'}</h2>
              <p className="text-gray-500 text-sm">@{user?.id || 'username'}</p>
            </div>

            {errors.general && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                {errors.general}
              </div>
            )}

            {/* Form Fields */}
            <div className="space-y-6">
              <div>
                <label className="block font-bold mb-2">Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full p-2 border-b border-gray-300"
                />
              </div>

              <div>
                <label className="block font-bold mb-2">Bio</label>
                <textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  className="w-full p-2 border-b border-gray-300 min-h-20"
                  placeholder="Tell us about yourself..."
                />
              </div>

              <div>
                <label className="block font-bold mb-2">Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (errors.email) setErrors({ ...errors, email: '' });
                  }}
                  className={`w-full p-2 border-b ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
                />
                {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
              </div>

              <div>
                <label className="block font-bold mb-2">Phone Number</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => {
                    setPhone(e.target.value);
                    if (errors.phone) setErrors({ ...errors, phone: '' });
                  }}
                  placeholder="+1 234 567 8900"
                  className={`w-full p-2 border-b ${errors.phone ? 'border-red-500' : 'border-gray-300'}`}
                />
                {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
              </div>
            </div>

            {/* Save Button */}
            <button
              onClick={handleSave}
              className="w-full mt-8 py-3 bg-blue-500 text-white rounded-full font-semibold hover:bg-blue-600"
            >
              Save Changes
            </button>
          </div>
        </div>
        <BottomNav />
      </HalfBackground>
    </GradientBackgroundFull>
  );
}