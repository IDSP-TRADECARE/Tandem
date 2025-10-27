'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { BottomNav } from '@/app/components/Layout/BottomNav';

export default function CreateNannySharePage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    date: '',
    location: '',
    startTime: '',
    endTime: '',
    price: '',
    certificates: '',
    maxSpots: '',
    creatorName: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Parse certificates (comma-separated)
      const certificatesArray = formData.certificates
        ? formData.certificates.split(',').map(c => c.trim()).filter(Boolean)
        : null;

      const payload = {
        date: formData.date,
        location: formData.location,
        startTime: formData.startTime,
        endTime: formData.endTime,
        price: formData.price ? parseFloat(formData.price) : null,
        certificates: certificatesArray,
        maxSpots: formData.maxSpots ? parseInt(formData.maxSpots) : null,
        creatorName: formData.creatorName || 'Anonymous',
      };

      const response = await fetch('/api/nanny/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.error || 'Failed to create share');
        setIsSubmitting(false);
        return;
      }

      // Navigate to the newly created share
      router.push(`/nanny/${data.share.id}`);

    } catch (error) {
      console.error('Error submitting form:', error);
      alert('An error occurred. Please try again.');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 pb-32">
      <div className="px-6 pt-8 max-w-2xl mx-auto">
        <div className="mb-6">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-[#1e3a5f] hover:text-[#152d47] mb-4"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back
          </button>
          <h1 className="text-3xl font-bold text-[#0a1628]">Create Nanny Share</h1>
          <p className="text-gray-600 mt-2">Fill in the details to start a new nanny share group</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 bg-white rounded-xl p-6 shadow-sm">
          {/* Your Name */}
          <div>
            <label htmlFor="creatorName" className="block text-sm font-medium text-gray-700 mb-2">
              Your Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="creatorName"
              name="creatorName"
              value={formData.creatorName}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[#1e3a5f] focus:outline-none"
              placeholder="Enter your name"
            />
          </div>

          {/* Date */}
          <div>
            <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-2">
              Date <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              id="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              required
              min={new Date().toISOString().split('T')[0]}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[#1e3a5f] focus:outline-none"
            />
          </div>

          {/* Location */}
          <div>
            <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-2">
              Location <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="location"
              name="location"
              value={formData.location}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[#1e3a5f] focus:outline-none"
              placeholder="e.g., Burnaby, BC"
            />
          </div>

          {/* Time Range */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="startTime" className="block text-sm font-medium text-gray-700 mb-2">
                Start Time <span className="text-red-500">*</span>
              </label>
              <input
                type="time"
                id="startTime"
                name="startTime"
                value={formData.startTime}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[#1e3a5f] focus:outline-none"
              />
            </div>
            <div>
              <label htmlFor="endTime" className="block text-sm font-medium text-gray-700 mb-2">
                End Time <span className="text-red-500">*</span>
              </label>
              <input
                type="time"
                id="endTime"
                name="endTime"
                value={formData.endTime}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[#1e3a5f] focus:outline-none"
              />
            </div>
          </div>

          {/* Price (Optional) */}
          <div>
            <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-2">
              Price per Hour (Optional)
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">$</span>
              <input
                type="number"
                id="price"
                name="price"
                value={formData.price}
                onChange={handleChange}
                min="0"
                step="0.01"
                className="w-full pl-8 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[#1e3a5f] focus:outline-none"
                placeholder="25.00"
              />
            </div>
          </div>

          {/* Certificates (Optional) */}
          <div>
            <label htmlFor="certificates" className="block text-sm font-medium text-gray-700 mb-2">
              Certificates (Optional)
            </label>
            <input
              type="text"
              id="certificates"
              name="certificates"
              value={formData.certificates}
              onChange={handleChange}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[#1e3a5f] focus:outline-none"
              placeholder="e.g., ECE, First Aid, CPR (comma-separated)"
            />
            <p className="text-xs text-gray-500 mt-1">Separate multiple certificates with commas</p>
          </div>

          {/* Max Spots (Optional) */}
          <div>
            <label htmlFor="maxSpots" className="block text-sm font-medium text-gray-700 mb-2">
              Max Spots (Optional)
            </label>
            <select
              id="maxSpots"
              name="maxSpots"
              value={formData.maxSpots}
              onChange={(e) => setFormData(prev => ({ ...prev, maxSpots: e.target.value }))}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[#1e3a5f] focus:outline-none"
            >
              <option value="">No limit</option>
              <option value="4">4 spots</option>
              <option value="8">8 spots</option>
              <option value="12">12 spots</option>
              <option value="16">16 spots</option>
            </select>
            <p className="text-xs text-gray-500 mt-1">Must be a multiple of 4</p>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-4 bg-[#1e3a5f] text-white rounded-lg font-semibold hover:bg-[#152d47] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Creating...' : 'Create Nanny Share'}
          </button>
        </form>
      </div>

      <BottomNav />
    </div>
  );
}