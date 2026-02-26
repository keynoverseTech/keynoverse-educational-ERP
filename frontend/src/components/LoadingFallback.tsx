import React from 'react';
import { Loader2 } from 'lucide-react';

const LoadingFallback: React.FC = () => (
  <div className="flex items-center justify-center h-screen w-full bg-gray-50 dark:bg-gray-900">
    <div className="flex flex-col items-center gap-2">
      <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
      <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">Loading...</p>
    </div>
  </div>
);

export default LoadingFallback;
