'use client';

import React, { useState } from 'react';
import { useMessage } from '@/context/MessageContext';
import { useFormData } from '@/hooks/useFormData';
import { Header } from '../Layout/Header';
import { Input } from '../ui/Input';
import { TextArea } from '../ui/TextArea';
import { Button } from '../ui/Button';

export function FormStep() {
  const { setStep, setMessageData, setEditedMessage } = useMessage();
  const { formData, errors, updateField, validate } = useFormData();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validate()) {
      return;
    }

    setLoading(true);

    try {
      let messageBody: string;

      // If user typed a custom message, use that
      if (formData.customMessage.trim()) {
        messageBody = formData.customMessage;
      } 
      // otherwise generate message using AI
      else {
        const response = await fetch('/api/generate-message', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userName: formData.userName,
            childcareOrgName: formData.childcareOrgName,
            contactInfo: formData.contactInfo,
            additionalDetails: '',
          }),
        });

        if (!response.ok) {
          throw new Error('Failed to generate message');
        }

        const data = await response.json();
        messageBody = data.message;
      }

      setMessageData({
        userName: formData.userName,
        childcareOrgName: formData.childcareOrgName,
        contactInfo: formData.contactInfo,
        customMessage: formData.customMessage,
        generatedMessage: messageBody,
      });

      setEditedMessage(messageBody);
      setStep('preview');
    } catch (error) {
      console.error('Error generating message:', error);
      alert('Failed to generate AI message. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Header title="AI Message Generator" />
      <div className="px-6 pb-6 overflow-auto flex-1">
        <form onSubmit={handleSubmit} className="bg-gray-700 rounded-lg p-6 space-y-4">
          <Input
            label="Your Name *"
            value={formData.userName}
            onChange={(e) => updateField('userName', e.target.value)}
            placeholder="Enter your name"
            error={errors.userName}
          />

          <Input
            label="Nanny Organization Name *"
            value={formData.childcareOrgName}
            onChange={(e) => updateField('childcareOrgName', e.target.value)}
            placeholder="Enter organization name"
            error={errors.childcareOrgName}
          />

          <Input
            label="Your Contact Information *"
            value={formData.contactInfo}
            onChange={(e) => updateField('contactInfo', e.target.value)}
            placeholder="Email or phone number"
            error={errors.contactInfo}
          />

          <TextArea
            label="Write Your Own Message (Optional)"
            value={formData.customMessage}
            onChange={(e) => updateField('customMessage', e.target.value)}
            placeholder="Leave blank to let AI generate a personalized message for you"
            rows={6}
          />

          <Button 
            type="submit" 
            variant="primary" 
            className="w-full bg-blue-600 hover:bg-blue-700"
            disabled={loading}
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <span className="animate-spin">⏳</span>
                Generating with AI...
              </span>
            ) : (
              '✨ Generate AI Message'
            )}
          </Button>

          {!formData.customMessage.trim() && (
            <div className="bg-blue-900/30 border border-blue-500/50 rounded-lg p-3 mt-4">
              <p className="text-blue-200 text-xs text-center flex items-center justify-center gap-2">
                <span>🤖</span>
                AI will create a unique, personalized message based on your information
              </p>
            </div>
          )}
        </form>
      </div>
    </>
  );
}