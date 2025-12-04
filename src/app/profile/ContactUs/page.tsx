'use client';
import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { GradientBackgroundFull } from '@/app/components/ui/backgrounds/GradientBackgroundFull'
import { ProfileHeader } from '@/app/components/ui/profile/header'
import {HalfBackground} from '@/app/components/ui/backgrounds/HalfBackground'
import { BottomNav } from '@/app/components/Layout/BottomNav'
import { TextBox } from '@/app/components/ui/profile/textbox'
import { ActionButton } from '@/app/components/ui/profile/actionbtn'
import { FeedbackPop } from '@/app/components/ui/profile/feedbackpop'

function ContactUs() {
  const router = useRouter();
  const [feedback, setFeedback] = useState('');
  const [showFeedback, setShowFeedback] = useState(false);

  const handleSendFeedback = () => {
    setShowFeedback(true);
  };

  const handleFeedbackClose = (open) => {
    setShowFeedback(open);
    if (!open) {
      // Reset textbox after popup fades out
      setFeedback('');
    }
  };

  return (
    <GradientBackgroundFull>
        <div className="p-8 space-y-8 mt-0" >
        <ProfileHeader title="Help Centre" onBack={() => router.push('/profile/HelpCentre')} />
      </div> 
      <HalfBackground topPosition="140px">
        <div className="p-8 pb-24 space-y-6 flex flex-col items-center">
        <TextBox
          placeholder="To help us improve, please describe your feedback as detailed as possible"
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
        />
        <ActionButton
          text="Send Feedback"
          className="font-medium font-alan"
          fontSize="15px"
          onClick={handleSendFeedback}
        />
        </div>
    </HalfBackground>
    <BottomNav />
    <FeedbackPop 
      open={showFeedback} 
      onOpenChange={handleFeedbackClose}
    />
  </GradientBackgroundFull>
);
}

export default ContactUs;