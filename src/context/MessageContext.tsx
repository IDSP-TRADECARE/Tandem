'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';

export type MessageStep = 'prompt' | 'form' | 'preview' | 'edit';

interface MessageData {
  userName: string;
  childcareOrgName: string;
  contactInfo: string;
  customMessage: string;
  generatedMessage: string;
}

interface MessageContextType {
  step: MessageStep;
  setStep: (step: MessageStep) => void;
  messageData: MessageData;
  setMessageData: (data: Partial<MessageData>) => void;
  editedMessage: string;
  setEditedMessage: (message: string) => void;
  resetGenerator: () => void;
}

const MessageContext = createContext<MessageContextType | undefined>(undefined);

const initialMessageData: MessageData = {
  userName: '',
  childcareOrgName: '',
  contactInfo: '',
  customMessage: '',
  generatedMessage: '',
};

export function MessageProvider({ children }: { children: ReactNode }) {
  const [step, setStep] = useState<MessageStep>('prompt');
  const [messageData, setMessageDataState] = useState<MessageData>(initialMessageData);
  const [editedMessage, setEditedMessage] = useState('');

  const setMessageData = (data: Partial<MessageData>) => {
    setMessageDataState((prev) => ({ ...prev, ...data }));
  };

  const resetGenerator = () => {
    setStep('prompt');
    setMessageDataState(initialMessageData);
    setEditedMessage('');
  };

  return (
    <MessageContext.Provider
      value={{
        step,
        setStep,
        messageData,
        setMessageData,
        editedMessage,
        setEditedMessage,
        resetGenerator,
      }}
    >
      {children}
    </MessageContext.Provider>
  );
}

export function useMessage() {
  const context = useContext(MessageContext);
  if (context === undefined) {
    throw new Error('useMessage must be used within a MessageProvider');
  }
  return context;
}