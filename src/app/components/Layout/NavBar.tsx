'use client';

import React from 'react';
import { Home, Calendar, Upload, MapPin, User } from 'lucide-react';

export function NavBar() {
  return (
    <div className="flex justify-around items-center py-3 bg-gray-800 border-t border-gray-700">
      <button className="flex flex-col items-center gap-1 text-gray-400 hover:text-white transition">
        <Home className="w-6 h-6" />
        <span className="text-xs">Home</span>
      </button>
      <button className="flex flex-col items-center gap-1 text-gray-400 hover:text-white transition">
        <Calendar className="w-6 h-6" />
        <span className="text-xs">Schedule</span>
      </button>
      <button className="flex flex-col items-center gap-1 text-gray-400 hover:text-white transition">
        <Upload className="w-6 h-6" />
        <span className="text-xs">Upload</span>
      </button>
      <button className="flex flex-col items-center gap-1 text-gray-400 hover:text-white transition">
        <MapPin className="w-6 h-6" />
        <span className="text-xs">Map</span>
      </button>
      <button className="flex flex-col items-center gap-1 text-gray-400 hover:text-white transition">
        <User className="w-6 h-6" />
        <span className="text-xs">Profile</span>
      </button>
    </div>
  );
}