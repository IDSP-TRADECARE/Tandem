'use client';

import React, { useState } from 'react';
import { X, Mail, MessageSquare } from 'lucide-react';
import { useMessage } from '@/context/MessageContext';
import { useToast } from '@/hooks/useToast';
import { Toast } from '../ui/Toast';

export function SendOptionsStep() {
  const { setStep, editedMessage, messageData } = useMessage();
  const { toast, showToast, hideToast } = useToast();
  const [sending, setSending] = useState(false);

  const handleSendEmail = async () => {
    setSending(true);
    try {
      const response = await fetch('/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: messageData.contactInfo,
          subject: 'Inquiry About Childcare Services',
          body: editedMessage,
          userName: messageData.userName,
          childcareOrgName: messageData.childcareOrgName,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        showToast('Email sent successfully!', 'success');
        setTimeout(() => setStep('prompt'), 2000);
      } else {
        showToast(data.error || 'Failed to send email', 'error');
      }
    } catch (error) {
      showToast('Failed to send email. Please try again.', 'error');
    } finally {
      setSending(false);
    }
  };

  const handleSendSMS = async () => {
    setSending(true);
    try {
      const response = await fetch('/api/send-sms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: messageData.contactInfo,
          message: editedMessage,
          userName: messageData.userName,
          childcareOrgName: messageData.childcareOrgName,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        showToast('Text message sent successfully!', 'success');
        setTimeout(() => setStep('prompt'), 2000);
      } else {
        showToast(data.error || 'Failed to send SMS', 'error');
      }
    } catch (error) {
      showToast('Failed to send SMS. Please try again.', 'error');
    } finally {
      setSending(false);
    }
  };

  const handleSaveDraft = async () => {
    try {
      const response = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userName: messageData.userName,
          userContact: messageData.contactInfo,
          childcareOrgName: messageData.childcareOrgName,
          messageBody: editedMessage,
        }),
      });

      if (response.ok) {
        showToast('Draft saved!', 'success');
      }
    } catch (error) {
      showToast('Failed to save draft', 'error');
    }
  };

  return (
    <>
      <div className="p-6 overflow-auto flex-1">
        <div className="bg-white rounded-lg shadow-lg max-w-2xl mx-auto">
          <div className="flex items-center justify-between p-4 border-b">
            <h2 className="text-xl font-bold">Message Method</h2>
            <button
              onClick={() => setStep('preview')}
              className="text-gray-500 hover:text-gray-700"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="p-6">
            <div className="bg-gray-100 p-4 rounded-lg mb-6">
              <p className="font-semibold text-gray-900 mb-2">
                Subject: Inquiry About Childcare Services
              </p>
              <button
                onClick={() => setStep('preview')}
                className="text-blue-600 text-sm hover:underline"
              >
                [Click to preview message]
              </button>
            </div>

            <div className="space-y-4">
              <button
                onClick={handleSendSMS}
                disabled={sending}
                className="w-full py-4 bg-white border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition text-left px-6 flex items-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <MessageSquare className="w-5 h-5" />
                <span>Send through text message</span>
              </button>
              
              <button
                onClick={handleSendEmail}
                disabled={sending}
                className="w-full py-4 bg-white border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition text-left px-6 flex items-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Mail className="w-5 h-5" />
                <span>Send through email</span>
              </button>

              <button
                onClick={handleSaveDraft}
                className="w-full py-3 bg-gray-100 text-gray-600 rounded-lg font-semibold hover:bg-gray-200 transition"
              >
                Save as Draft
              </button>
            </div>

            {sending && (
              <p className="text-center text-gray-600 mt-4">Sending...</p>
            )}
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