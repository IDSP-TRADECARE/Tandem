'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@clerk/nextjs';
import { GradientBackgroundFull } from '@/app/components/ui/backgrounds/GradientBackgroundFull';
import { HalfBackground } from '@/app/components/ui/backgrounds/HalfBackground';
import { ProfileHeader } from '@/app/components/ui/profile/header';
import { ProfileForm } from '@/app/components/ui/profile/profileForm';
import User from '@/app/components/ui/profile/User/user';

export default function EditProfilePage() {
  const router = useRouter();
  const { user } = useUser();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isPasswordHidden, setIsPasswordHidden] = useState(true);
  const [uploadingImage, setUploadingImage] = useState(false);
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    occupation: '',
    bio: '',
    profilePicture: '',
  });

  useEffect(() => {
    async function loadProfile() {
      if (!user?.id) return;
      
      try {
        const response = await fetch('/api/profile');
        if (response.ok) {
          const data = await response.json();
          setProfile(data);
          setFormData({
            firstName: data.firstName || '',
            lastName: data.lastName || '',
            email: data.email || user.primaryEmailAddress?.emailAddress || '',
            phone: data.phone || '',
            address: data.address || '',
            occupation: data.occupation || '',
            bio: data.bio || '',
            profilePicture: data.profilePicture || '',
          });
        }
      } catch (error) {
        console.error('Failed to load profile:', error);
      } finally {
        setLoading(false);
      }
    }

    loadProfile();
  }, [user]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }

    // Validate file size (e.g., 5MB max)
    if (file.size > 5 * 1024 * 1024) {
      alert('Image size should be less than 5MB');
      return;
    }

    setUploadingImage(true);

    try {
      // Convert image to base64
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setFormData((prev) => ({
          ...prev,
          profilePicture: base64String,
        }));
        setUploadingImage(false);
      };
      reader.onerror = () => {
        alert('Failed to read image file');
        setUploadingImage(false);
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Failed to upload image');
      setUploadingImage(false);
    }
  };

  const handleEditClick = () => {
    fileInputRef.current?.click();
  };

  const handleSave = async () => {
    setSaving(true);
    
    try {
      const response = await fetch('/api/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        router.push('/profile');
      } else {
        const data = await response.json();
        console.error('Failed to save profile:', data);
        alert(`Error: ${data.error || 'Failed to save profile'}`);
      }
    } catch (error) {
      console.error('Error saving profile:', error);
      alert('Network error. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  const displayName = formData.firstName && formData.lastName 
    ? `${formData.firstName} ${formData.lastName}` 
    : user?.fullName || 'User';
  
  const username = user?.username || user?.primaryEmailAddress?.emailAddress?.split('@')[0] || user?.id || 'user';
  const profileImage = formData.profilePicture || '/profile/placeholderAvatar.png';

  const passwordDisplay = isPasswordHidden ? '***********' : '12345678';
  const passwordIcon = isPasswordHidden
    ? '/profile/ComponentIcon/Hide.svg'
    : '/profile/ComponentIcon/Show.svg';

  return (
    <GradientBackgroundFull>
      <div className="w-full px-4 sm:px-8 pt-6 sm:mt-6 flex justify-center">
        <ProfileHeader title="Edit Profile" onBack={() => router.push('/profile')} />
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleImageUpload}
        style={{ display: 'none' }}
      />

      <div>
        <div>
          <User
            name={displayName}
            username={`@${username}`}
            bio={formData.bio}
            profileImage={profileImage}
            onEdit={handleEditClick}
            uploadingImage={uploadingImage}
          />
        </div>

        <HalfBackground topPosition="180px">
          <div className="mt-16 w-full h-full overflow-y-auto px-4 sm:px-6" style={{ maxHeight: 'calc(100vh - 230px)' }}>
            <ProfileForm
              formData={{
                firstName: formData.firstName,
                lastName: formData.lastName,
                email: formData.email,
                phone: formData.phone,
                bio: formData.bio,
              }}
              onInputChange={handleInputChange}
              passwordDisplay={passwordDisplay}
              passwordIcon={passwordIcon}
              onTogglePassword={() => setIsPasswordHidden((prev) => !prev)}
              onSave={handleSave}
              saving={saving}
            />
          </div>
        </HalfBackground>
      </div>
    </GradientBackgroundFull>
  );
}

