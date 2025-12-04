'use client';
import { GradientBackgroundFull } from '@/app/components/ui/backgrounds/GradientBackgroundFull'
import { ProfileHeader } from '@/app/components/ui/profile/header'
import {HalfBackground} from '@/app/components/ui/backgrounds/HalfBackground'
import { ScrollOption } from '@/app/components/ui/profile/scrollOption'
import { BottomNav } from '@/app/components/Layout/BottomNav'
import User from '@/app/components/ui/profile/User/user'

function MainProfile() {
    return (
        <div className="min-h-screen flex flex-col">
          <GradientBackgroundFull>
            <div className="p-8 space-y-8 flex justify-start">
                <ProfileHeader title="My Profile" showBackButton={false} />
            </div> 

            <div className="flex justify-start fixed top-0 left-0 right-0 z-30 px-8" style={{ marginTop: '80px' }}>
              <User />
            </div>
      
            <HalfBackground topPosition="140px">
              <div className="w-full flex justify-center px-4 sm:px-6 overflow-y-auto" style={{ maxHeight: 'calc(100vh - 260px)', paddingTop: '200px' }}>
                <ScrollOption />
              </div>
            </HalfBackground>

            <BottomNav />
          </GradientBackgroundFull>
        </div>
    );
}

export default MainProfile;