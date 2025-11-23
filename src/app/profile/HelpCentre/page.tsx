'use client';
import React from 'react'
import { GradientBackgroundFull } from '@/app/components/ui/backgrounds/GradientBackgroundFull'
import { ProfileHeader } from '@/app/components/ui/profile/header'
import {HalfBackground} from '@/app/components/ui/backgrounds/HalfBackground'
import {ProfileCardCarousel} from '@/app/components/ui/profile/cardCarousel'
import {ActionButton} from '@/app/components/ui/profile/actionbtn'
import {OptionButton} from '@/app/components/ui/profile/optionbtn'

function HelpCentre() {
  return (
    <GradientBackgroundFull>
        <div className="p-8 space-y-8 mt-8" >
            <ProfileHeader title="Help Centre" />
        </div> 
      <HalfBackground topPosition="140px">
        <div className="p-8 space-y-8">
          <h3 className="text-xl font-bold font-alan">Feature Guide</h3>
          <div className="ml-0.5 mr-0.5">
            <ProfileCardCarousel />
          </div>
          <OptionButton
            icon="/profile/ComponentIcon/Privacy.svg"
            text="Privacy & Security"
            onClick={() => console.log('Privacy & Security clicked')}
          />
          <ActionButton
          className="font-medium font-alan"
          text="Contact Us"
          icon="/profile/ComponentIcon/Text Bubble.svg"
          onClick={() => console.log('contact us clicked')}
        />
        </div>
    </HalfBackground>
  </GradientBackgroundFull>
);
}

export default HelpCentre;