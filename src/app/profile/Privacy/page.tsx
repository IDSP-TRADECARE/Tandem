'use client';
import React from 'react'
import { GradientBackgroundFull } from '@/app/components/ui/backgrounds/GradientBackgroundFull'
import { ProfileHeader } from '@/app/components/ui/profile/header'
import {HalfBackground} from '@/app/components/ui/backgrounds/HalfBackground'
import {ProfileCardCarousel} from '@/app/components/ui/profile/cardCarousel'
import {ActionButton} from '@/app/components/ui/profile/actionbtn'
import {OptionButton} from '@/app/components/ui/profile/optionbtn'

function Privacy() {
  return (
    <GradientBackgroundFull>
        <div className="p-8 space-y-8 mt-8" >
        <ProfileHeader title="Help Centre" />
      </div> 
      <HalfBackground topPosition="140px">
        <div className="p-8 space-y-8">
          <h2 className="text-2xl font-bold">Privacy & Security</h2>
          <p>We take your privacy and security seriously. This section explains how we protect your personal information and keep your account safe. </p>

            <h3>Your Privacy</h3>
            <p>We only collect information that helps us improve your experience — such as your account details, usage patterns, and device information. We never sell your data to third parties. For more details, please review our [Privacy Policy].</p>

            <h3>Data Protection</h3>
            <p>All personal data is encrypted both in transit and at rest. We use secure servers and industry-standard practices to safeguard your information.</p>

            <h3>Account Security</h3>
            <p>Keep your account protected by using a strong password and enabling two-factor authentication (2FA) when available. If you notice any suspicious activity, change your password immediately and contact our support team.</p>

            <h3>Permissions</h3>
            <p>Our app may request access to your camera, location, or notifications to provide certain features. You can manage or revoke these permissions anytime in your device settings.</p>

            <h3>Report a Security Issue</h3>
            <p>If you believe your account has been compromised or you’ve found a potential security vulnerability, please contact us at security@Tandem.com. We’ll investigate as soon as possible.</p>
        
        </div>
    </HalfBackground>
  </GradientBackgroundFull>
);
}

export default Privacy;