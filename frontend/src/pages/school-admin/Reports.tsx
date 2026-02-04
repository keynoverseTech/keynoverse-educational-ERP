import React, { useState, useEffect } from 'react';
import { Skeleton } from '../../components/ui/Skeleton';

const Reports: React.FC = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div>
        <Skeleton className="h-8 w-48 mb-6" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
            <Skeleton className="h-6 w-48 mb-4" />
            <Skeleton className="h-40 w-full rounded" />
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
            <Skeleton className="h-6 w-48 mb-4" />
            <Skeleton className="h-40 w-full rounded" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">Reports</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
          <h2 className="font-semibold mb-4 dark:text-white">Academic Performance</h2>
          <div className="h-40 bg-gray-100 dark:bg-gray-700 rounded flex items-center justify-center text-gray-400 dark:text-gray-500">
            Chart Placeholder
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
          <h2 className="font-semibold mb-4 dark:text-white">Attendance Stats</h2>
          <div className="h-40 bg-gray-100 dark:bg-gray-700 rounded flex items-center justify-center text-gray-400 dark:text-gray-500">
            Chart Placeholder
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;
