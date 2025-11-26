'use client';


// shorthand for now using the createqucikshare in lib
import { createQuickShare } from '@/lib/nanny/createQuickShare';


// SHORTHAND END --------------------

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { IoIosArrowBack } from 'react-icons/io';
import { BottomNav } from '@/app/components/Layout/BottomNav';

const DAYS = ['S', 'M', 'T', 'W', 'F'];

export default function NannySchedulePage() {
  const router = useRouter();
  const [selectedDay, setSelectedDay] = useState<string | null>('M');
  const [needNanny, setNeedNanny] = useState(true);
  const [someoneElse, setSomeoneElse] = useState(false);
  const [reason, setReason] = useState('');

  return (
    <div className="min-h-screen flex flex-col pb-24">
      {/* Header */}
      <div className="bg-blue-500 text-white p-6">
        <button onClick={() => router.back()} className="mb-4">
          <IoIosArrowBack size={24} />
        </button>
        <h1 className="text-2xl font-bold">Plan your nanny schedule</h1>
      </div>

      {/* Content */}
      <div className="flex-1 bg-white rounded-t-3xl -mt-4 p-6">
        <p className="mb-4">Tap each date to check the booking and set reason for days not needed.</p>
        
        {/* Day Selector */}
        <div className="flex gap-2 mb-6">
          {DAYS.map(day => (
            <button
              key={day}
              onClick={() => setSelectedDay(day)}
              className={`flex-1 w-12 h-12 rounded-full font-bold ${
                day === 'M' || day === 'W' ? 'bg-green-200' : 'bg-gray-200'
              } ${selectedDay === day ? 'ring-2 ring-green-600' : ''}`}
            >
              {day}
            </button>
          ))}
        </div>

        {/* Need Nanny Care */}
        <h3 className="font-bold mb-3">Need nanny care today?</h3>
        
        <button
          onClick={() => { setNeedNanny(true); setSomeoneElse(false); }}
          className={`w-full p-4 mb-3 rounded-2xl border-2 flex items-center gap-3 ${
            needNanny ? 'bg-blue-100 border-blue-500' : 'border-gray-300'
          }`}
        >
          <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
            needNanny ? 'bg-blue-500 border-blue-500' : 'border-gray-300'
          }`}>
            {needNanny && <span className="text-white text-sm">✓</span>}
          </div>
          <span>Yes. Book nanny</span>
        </button>

        <button
          onClick={() => { setNeedNanny(false); setSomeoneElse(true); }}
          className={`w-full p-4 mb-3 rounded-2xl border-2 flex items-center gap-3 ${
            someoneElse ? 'bg-blue-100 border-blue-500' : 'border-gray-300'
          }`}
        >
          <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
            someoneElse ? 'bg-blue-500 border-blue-500' : 'border-gray-300'
          }`}>
            {someoneElse && <span className="text-white text-sm">✓</span>}
          </div>
          <span>No. Someone else is watching</span>
        </button>

        {someoneElse && (
          <div className="mb-4">
            <label className="text-sm text-gray-600">*Reason:</label>
            <input
              type="text"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="A family member will watch them"
              className="w-full p-2 border-b mt-1"
            />
          </div>
        )}

        {/* Start/End Time */}
        <div className="flex gap-4 mb-6">
          <div className="flex-1">
            <label className="block font-bold mb-2">Start</label>
            <input type="text" placeholder="E.g., 7:00 AM" className="w-full p-2 border-b" />
          </div>
          <div className="flex-1">
            <label className="block font-bold mb-2">End</label>
            <input type="text" placeholder="E.g., 6:00 PM" className="w-full p-2 border-b" />
          </div>
        </div>

        {/* Children */}
        <div className="mb-6">
          <h3 className="font-bold mb-3">Children</h3>
          <div className="flex gap-4">
            <p className="flex-1 p-2 border-b">Angie</p>
            <p className="flex-1 p-2 border-b">Sandy</p>
          </div>
        </div>

        {/* Allergies */}
        <div className="mb-6">
          <h3 className="font-bold mb-3">Allergies & Medical Conditions</h3>
          <p className="p-2 border-b">None</p>
        </div>

        {/* Additional Notes */}
        <div className="mb-6">
          <h3 className="font-bold mb-3">Additional Notes</h3>
          <textarea 
            className="w-full p-3 border rounded min-h-24"
            placeholder="Add any additional information..."
          />
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 mb-6">
          <button className="flex-1 py-3 border-2 border-blue-500 text-blue-500 rounded-full">
            Cancel
          </button>

          <button
          // SHORT HAND FOR NOW --------------------
            onClick={async () => {
              await createQuickShare();
              router.push('/nanny');
            }}
            // SHORT HAND FOR NOW END ----------------
            className="flex-1 py-3 bg-blue-500 text-white rounded-full"
          >
            Save
          </button>
        </div>
      </div>

      {/* Bottom Navigation */}
      <BottomNav />
    </div>
  );
}