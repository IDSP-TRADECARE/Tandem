'use client';

import React from 'react';
import { useMessage } from '@/context/MessageContext';
import { Button } from '../ui/Button';

export function PromptStep() {
  const { setStep } = useMessage();

  return (
    <div className="flex items-center justify-center p-6 flex-1">
      <div className="max-w-md">
        <div className="bg-gray-700 rounded-t-3xl p-8 text-center">
          <h2 className="text-white text-lg mb-6">
            Do you want a message template to help you apply for the nanny services?
          </h2>
          <div className="flex gap-4 justify-center">
            <Button
              variant="outline"
              onClick={() => setStep('prompt')}
              className="bg-gray-600 border-gray-600 hover:bg-gray-500"
            >
              No, I am good
            </Button>
            <Button variant="primary" onClick={() => setStep('form')}>
              Yes, please do
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}