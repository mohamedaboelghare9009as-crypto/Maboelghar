import React from 'react';
import { Heart } from 'lucide-react';

export default function LoadingSpinner() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="animate-pulse mb-4">
          <Heart className="h-12 w-12 text-blue-600 mx-auto" />
        </div>
        <p className="text-gray-600">Loading SmartClinic...</p>
      </div>
    </div>
  );
}