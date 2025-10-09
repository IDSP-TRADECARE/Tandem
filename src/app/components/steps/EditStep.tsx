'use client';

import React, { useState } from 'react';
import { useMessage } from '@/context/MessageContext';
import { Header } from '../Layout/Header';
import { Button } from '../ui/Button';

export function EditStep() {
  const { editedMessage, setEditedMessage, setStep } = useMessage();
  const [localMessage, setLocalMessage] = useState(editedMessage);

  const handleConfirm = () => {
    setEditedMessage(localMessage);
    setStep('preview');
  };

  return (
    <>
      <Header title="Edit" />
      <div className="px-6 pb-6 overflow-auto flex-1">
        <div className="bg-white rounded-lg shadow-lg max-w-2xl mx-auto p-6">
          <h2 className="text-xl font-bold mb-4">Editing ...</h2>

          <div className="bg-gray-100 p-4 rounded-lg mb-4">
            <p className="font-semibold text-gray-900">
              Subject: Inquiry About Nanny Services
            </p>
          </div>

          <textarea
            value={localMessage}
            onChange={(e) => setLocalMessage(e.target.value)}
            rows={12}
            className="w-full px-4 py-3 bg-gray-50 text-gray-800 rounded-lg border border-gray-300 focus:outline-none focus:border-blue-500 mb-6"
          />

          <div className="flex gap-4">
            <Button
              variant="outline"
              onClick={() => setStep('preview')}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              variant="secondary"
              onClick={handleConfirm}
              className="flex-1"
            >
              Confirm
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}