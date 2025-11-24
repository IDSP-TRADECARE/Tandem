'use client';
import React, { useEffect } from 'react';
import { Dialog, DialogContent } from '@/app/components/calendar/dialog';

interface FeedbackPopProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function FeedbackPop({ open, onOpenChange }: FeedbackPopProps) {
  useEffect(() => {
    if (open) {
      // Auto-close after 3 seconds
      const timer = setTimeout(() => {
        onOpenChange(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [open, onOpenChange]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent 
        showCloseButton={false}
        className="sm:max-w-xs text-center !fixed !bottom-8 !left-1/2 !top-auto !translate-x-[-50%] !translate-y-0 data-[state=open]:slide-in-from-bottom-4 data-[state=closed]:slide-out-to-bottom-4 p-4 !rounded-2xl"
      >
        <div className="py-3 space-y-2">
          <h2 
            className="text-lg font-bold font-alan"
            style={{ color: '#3373CC' }}
          >
            We've received your feedback
          </h2>
          <p className="text-sm font-normal font-alan text-black">
            Thank you for your feedback, it helps us improve.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}

