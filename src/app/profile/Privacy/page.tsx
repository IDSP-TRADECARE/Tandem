'use client';
import { useRouter } from 'next/navigation'
import { GradientBackgroundFull } from '@/app/components/ui/backgrounds/GradientBackgroundFull'
import { ProfileHeader } from '@/app/components/ui/profile/header'
import {HalfBackground} from '@/app/components/ui/backgrounds/HalfBackground'
import { BottomNav } from '@/app/components/Layout/BottomNav'

function Privacy() {
  const router = useRouter();

  return (
    <GradientBackgroundFull>
        <div className="p-8 space-y-8 mt-8" >
        <ProfileHeader title="Help Centre" onBack={() => router.push('/profile/HelpCentre')} />
      </div> 
      <HalfBackground topPosition="140px">
        <div className="p-8 pb-24 space-y-6">
          <h2 className="text-xl font-bold font-alan text-black text-center">Privacy & Security</h2>
          <p className="font-alan text-sm text-black leading-5">
            We take your privacy and security seriously. This section explains how we protect your personal information and keep your account safe.
          </p>

          <div className="space-y-3">
            <h3 className="text-base font-bold font-alan text-black">Your Privacy</h3>
            <p className="font-alan text-sm text-black leading-5">
              We only collect information that helps us improve your experience — such as your account details, usage patterns, and device information. We never sell your data to third parties. For more details, please review our Privacy Policy.
            </p>
          </div>

          <div className="space-y-3">
            <h3 className="text-base font-bold font-alan text-black">Data Protection</h3>
            <p className="font-alan text-sm text-black leading-5">
              All personal data is encrypted both in transit and at rest. We use secure servers and industry-standard practices to safeguard your information.
            </p>
          </div>

          <div className="space-y-3">
            <h3 className="text-base font-bold font-alan text-black">Account Security</h3>
            <p className="font-alan text-sm text-black leading-5">
              Keep your account protected by using a strong password and enabling two-factor authentication (2FA) when available. If you notice any suspicious activity, change your password immediately and contact our support team.
            </p>
          </div>

          <div className="space-y-3">
            <h3 className="text-base font-bold font-alan text-black">Permissions</h3>
            <p className="font-alan text-sm text-black leading-5">
              Our app may request access to your camera, location, or notifications to provide certain features. You can manage or revoke these permissions anytime in your device settings.
            </p>
          </div>

          <div className="space-y-3">
            <h3 className="text-base font-bold font-alan text-black">Report a Security Issue</h3>
            <p className="font-alan text-sm text-black leading-5 mb-12">
              If you believe your account has been compromised or you've found a potential security vulnerability, please contact us at{' '}
              <a href="tandemfortrades@gmail.com" className="underline" style={{ color: '#3373CC' }}>tandemfortrades@gmail.com</a>. We'll investigate as soon as possible.
            </p>
          </div>
        </div>
    </HalfBackground>
    <BottomNav />
  </GradientBackgroundFull>
);
}

export default Privacy;