import React, { useState } from 'react';
import { 
  Search, 
  History, 
  User, 
  BookOpen, 
  Calendar,
  Clock,
  FileDigit
} from 'lucide-react';

const RecordHistory: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [hasSearched, setHasSearched] = useState(false);

  // Mock Timeline Data
  const timeline = [
    {
      id: 1,
      date: '2024-03-15',
      time: '14:30',
      action: 'Result Changed',
      changedBy: 'Dr. Sarah Johnson (Lecturer)',
      oldValue: '45 (D)',
      newValue: '67 (B)',
      details: 'Correction of CA score omission'
    },
    {
      id: 2,
      date: '2024-02-20',
      time: '09:15',
      action: 'Level Updated',
      changedBy: 'System Automation',
      oldValue: '100L',
      newValue: '200L',
      details: 'Annual session promotion'
    },
    {
      id: 3,
      date: '2023-11-10',
      time: '11:45',
      action: 'Course Registration',
      changedBy: 'Musa Abdullahi (Student)',
      oldValue: '-',
      newValue: 'Registered 8 Courses',
      details: 'First semester registration'
    },
    {
      id: 4,
      date: '2023-10-05',
      time: '10:00',
      action: 'Admission Status',
      changedBy: 'Admin User',
      oldValue: 'Pending',
      newValue: 'Admitted',
      details: 'Merit list batch 1'
    }
  ];

  const handleSearch = () => {
    if (searchQuery) setHasSearched(true);
  };

  return (
    <div className="space-y-6">
      {/* Search Bar */}
      <div className="bg-white dark:bg-[#151e32] p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Find Record History</h2>
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input 
              type="text" 
              placeholder="Enter Matric Number, Application ID, or Staff ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
            />
          </div>
          <button 
            onClick={handleSearch}
            className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
          >
            <History className="w-4 h-4" />
            Find Record
          </button>
        </div>
      </div>

      {hasSearched ? (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
          {/* Record Profile Header */}
          <div className="bg-blue-600 rounded-xl p-6 text-white shadow-lg relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/4 blur-3xl" />
            
            <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center gap-6">
              <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center text-2xl font-bold backdrop-blur-sm">
                MA
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-1">
                  <h1 className="text-2xl font-bold">Musa Abdullahi</h1>
                  <span className="px-3 py-1 bg-white/20 rounded-full text-xs font-medium backdrop-blur-sm">Active Student</span>
                </div>
                <div className="flex flex-wrap gap-4 text-blue-100 text-sm">
                  <div className="flex items-center gap-1.5">
                    <FileDigit className="w-4 h-4" />
                    <span>MAT2021/1234</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <BookOpen className="w-4 h-4" />
                    <span>Computer Science</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <User className="w-4 h-4" />
                    <span>200 Level</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Timeline */}
          <div className="bg-white dark:bg-[#151e32] p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Change Timeline</h3>
            
            <div className="relative pl-8 space-y-8 before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-[2px] before:bg-gray-200 dark:before:bg-gray-800">
              {timeline.map((item) => (
                <div key={item.id} className="relative">
                  {/* Timeline Dot */}
                  <div className="absolute -left-[29px] top-1.5 w-6 h-6 rounded-full border-4 border-white dark:border-[#151e32] bg-blue-600 shadow-sm z-10" />
                  
                  <div className="flex flex-col md:flex-row md:items-start gap-4 p-4 rounded-lg bg-gray-50 dark:bg-gray-800/50 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                    {/* Date/Time */}
                    <div className="md:w-32 flex-shrink-0">
                      <div className="flex items-center gap-2 text-sm font-medium text-gray-900 dark:text-white">
                        <Calendar className="w-4 h-4 text-blue-600" />
                        {item.date}
                      </div>
                      <div className="flex items-center gap-2 text-xs text-gray-500 mt-1 pl-6">
                        <Clock className="w-3 h-3" />
                        {item.time}
                      </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="text-base font-semibold text-gray-900 dark:text-white">{item.action}</h4>
                        <span className="text-xs text-gray-500 bg-white dark:bg-gray-700 px-2 py-1 rounded border border-gray-200 dark:border-gray-600">
                          {item.changedBy}
                        </span>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
                        <div className="p-3 bg-red-50 dark:bg-red-900/10 rounded-lg border-l-2 border-red-500">
                          <span className="text-xs text-red-600 dark:text-red-400 block mb-1 uppercase tracking-wider font-semibold">Old Value</span>
                          <span className="text-sm text-gray-700 dark:text-gray-300 font-mono">{item.oldValue}</span>
                        </div>
                        <div className="p-3 bg-green-50 dark:bg-green-900/10 rounded-lg border-l-2 border-green-500">
                          <span className="text-xs text-green-600 dark:text-green-400 block mb-1 uppercase tracking-wider font-semibold">New Value</span>
                          <span className="text-sm text-gray-700 dark:text-gray-300 font-mono">{item.newValue}</span>
                        </div>
                      </div>
                      
                      <p className="text-sm text-gray-500 mt-3 italic">
                        "{item.details}"
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        // Empty State
        <div className="text-center py-20">
          <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
            <Search className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">Search for a Record</h3>
          <p className="text-gray-500 max-w-sm mx-auto mt-2">
            Enter a student matric number, staff ID, or application ID to view the complete history of changes.
          </p>
        </div>
      )}
    </div>
  );
};

export default RecordHistory;