'use client';

import React from 'react';
import { useMessage } from '@/context/MessageContext';
import { NavBar } from './Layout/NavBar';
import { PromptStep } from './steps/PromptStep';
import { FormStep } from './steps/FormStep';
import { PreviewStep } from './steps/PreviewStep';
import { EditStep } from './steps/EditStep';

export default function MessageGenerator() {
  const { step } = useMessage();

  const renderStep = () => {
    switch (step) {
      case 'prompt':
        return <PromptStep />;
      case 'form':
        return <FormStep />;
      case 'preview':
        return <PreviewStep />;
      case 'edit':
        return <EditStep />;
      default:
        return <PromptStep />;
    }
  };

  return (
    <div className="h-screen bg-gray-800 flex flex-col">
      {renderStep()}
      <NavBar />
    </div>
  );
}