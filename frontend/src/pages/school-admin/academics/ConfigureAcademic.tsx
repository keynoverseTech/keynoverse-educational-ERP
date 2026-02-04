import React, { useState, useEffect } from 'react';
import { Skeleton } from '../../../components/ui/Skeleton';

const ConfigureAcademic: React.FC = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="p-6">
        <Skeleton className="h-8 w-48 mb-4" />
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <Skeleton className="h-4 w-full max-w-md" />
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Configure Academic</h1>
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <p className="text-gray-600 dark:text-gray-300">Configure academic settings, sessions, and terms.</p>
      </div>
    </div>
  );
};

export default ConfigureAcademic;