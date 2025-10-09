'use client';

import React from 'react';
import { X, Copy, Check } from 'lucide-react';
import { useMessage } from '@/context/MessageContext';
import { Button } from '../ui/Button';
import { useCopyToClipboard } from '@/hooks/useCopyToClipboard';
import { useToast } from '@/hooks/useToast';
import { Toast } from '../ui/Toast';

export function PreviewStep() {
  const { editedMessage, messageData, setStep } = useMessage();
  const { copied, copyToClipboard } = useCopyToClipboard();
  const { toast, showToast, hideToast } = useToast();

  const handleCopy = async () => {
    const success = await copyToClipboard(editedMessage);
    if (success) {
      showToast('Message copied to clipboard!', 'success');
      await handleSaveMessage('copied');
    }
  };

  const handleSaveMessage = async (status: string = 'draft') => {
    try {
      const response = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userName: messageData.userName,
          userContact: messageData.contactInfo,
          childcareOrgName: messageData.childcareOrgName,
          messageBody: editedMessage,
          status,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to save message');
      }
    } catch (error) {
      console.error('Error saving message:', error);
    }
  };

  return (
    <>
      <div className="p-6 overflow-auto flex-1">
        <div className="bg-white rounded-lg shadow-lg max-w-2xl mx-auto">
          <div className="flex items-center justify-between p-4 border-b">
            <h2 className="text-xl font-bold">Message Template</h2>
            <button
              onClick={() => setStep('prompt')}
              className="text-gray-500 hover:text-gray-700"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="p-6">
            <div className="bg-gray-100 p-4 rounded-lg mb-6">
              <p className="font-semibold text-gray-900">
                Subject: Inquiry About Nanny Services
              </p>
            </div>

            <div className="bg-gray-50 p-6 rounded-lg mb-6 whitespace-pre-wrap text-gray-800">
              {editedMessage}
            </div>

            <div className="flex gap-4">
              <Button
                variant="outline"
                onClick={() => setStep('edit')}
                className="flex-1"
              >
                Edit
              </Button>
              <Button
                variant="primary"
                onClick={handleCopy}
                className="flex-1 bg-blue-600 hover:bg-blue-700 border-blue-600 flex items-center justify-center gap-2"
              >
                {copied ? (
                  <>
                    <Check className="w-5 h-5" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="w-5 h-5" />
                    Copy to Clipboard
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>

      <Toast
        message={toast.message}
        type={toast.type}
        isVisible={toast.isVisible}
        onClose={hideToast}
      />
    </>
  );
}