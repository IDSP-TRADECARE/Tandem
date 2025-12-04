'use client';
import { useRouter } from 'next/navigation'
import { GradientBackgroundFull } from '@/app/components/ui/backgrounds/GradientBackgroundFull'
import { ProfileHeader } from '@/app/components/ui/profile/header'
import {HalfBackground} from '@/app/components/ui/backgrounds/HalfBackground'
import { BottomNav } from '@/app/components/Layout/BottomNav'

const sharingIcon = '/profile/Sharing.svg';


function FeatureGuide() {
  const router = useRouter();

  return (
    <GradientBackgroundFull>
        <div className="p-8 space-y-8 mt-0" >
        <ProfileHeader title="Feature Guide" onBack={() => router.push('/profile')} />
      </div> 
      <HalfBackground topPosition="140px">
        <div className="flex flex-col h-full">
          <div className="flex-1 p-8 pb-24 space-y-6 overflow-y-auto" style={{ maxHeight: 'calc(100vh - 220px)' }}>
            <h2 className="text-xl font-bold font-alan text-black text-center">Nanny Sharing</h2>

            <img src={sharingIcon} alt="Sharing" className="w-100 h-100 mt-[-40px] mb-[-20px] scale-120" />

            <p className="font-alan text-sm text-black leading-5">
            Nanny Sharing helps you connect with nearby parents who need nanny support on the same day. Through this feature, you can easily manage your own nanny-sharing requests, review incoming invitations from other parents, and decide whether to accept or decline. Each parent’s profile gives you helpful information—such as their introduction and chat access—so you can communicate and get to know them before confirming a match.
            </p>

            <p className="font-alan text-sm text-black leading-5">You’ll also find an Available section, where you can browse and join nanny-sharing requests created by other parents. This makes it simple to coordinate schedules, share costs, and build a supportive childcare network within your community</p>
          </div>
          <div className="pt-4">
            <BottomNav />
          </div>
        </div>
    </HalfBackground>
  </GradientBackgroundFull>
);
}

export default FeatureGuide;