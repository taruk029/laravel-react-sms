import React from 'react';
import { Loader2 } from 'lucide-react';

const LoadingScreen: React.FC = () => {
  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-white z-[9999]">
      <div className="relative flex flex-col items-center">
        {/* Outer Ring */}
        <div className="w-16 h-16 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin"></div>
        
        {/* Inner Icon */}
        <div className="absolute inset-0 flex items-center justify-center">
          <Loader2 className="w-6 h-6 text-blue-600 animate-pulse" />
        </div>
        
        <p className="mt-4 text-gray-600 font-medium animate-pulse tracking-wide">
          Loading SMSHub...
        </p>
      </div>
    </div>
  );
};

export default LoadingScreen;
