import React, { useState } from 'react';
import { 
  Search, 
  History, 
  FileText, 
  UserPlus,
  AlertTriangle
} from 'lucide-react';

interface PatientHistoryProps {
  onCreateProfile?: () => void;
}

const PatientHistory: React.FC<PatientHistoryProps> = ({ onCreateProfile }) => {
  const [searchTerm, setSearchQuery] = useState('');
  const [searchResult, setSearchResult] = useState<any>(null);

  // Mock Search
  const handleSearch = () => {
    // Simulate search logic
    if (searchTerm === '123') {
      setSearchResult({
        name: 'John Doe',
        id: '123',
        history: [
          { date: '2024-02-20', diagnosis: 'Malaria', doctor: 'Dr. Sarah' },
          { date: '2023-11-10', diagnosis: 'Headache', doctor: 'Dr. Mike' }
        ]
      });
    } else {
      setSearchResult('not-found');
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full max-w-xl">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <input 
            type="text" 
            placeholder="Search patient history by ID or Name..." 
            className="w-full pl-10 pr-4 py-3 bg-white dark:bg-[#151e32] border border-gray-200 dark:border-gray-800 rounded-xl outline-none focus:ring-2 focus:ring-blue-500/20 shadow-sm"
            value={searchTerm}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          />
        </div>
        <button 
          onClick={onCreateProfile}
          className="px-6 py-3 bg-white dark:bg-[#151e32] border border-gray-200 dark:border-gray-800 rounded-xl font-bold text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors flex items-center gap-2"
        >
          <UserPlus size={18} />
          Create New Profile
        </button>
      </div>

      {searchResult === 'not-found' && (
        <div className="flex flex-col items-center justify-center h-64 bg-white dark:bg-[#151e32] rounded-2xl border border-dashed border-gray-300 dark:border-gray-700">
          <AlertTriangle size={48} className="text-orange-400 mb-4" />
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">Patient Not Found</h3>
          <p className="text-gray-500 mb-4">No records found for "{searchTerm}"</p>
          <button 
            onClick={onCreateProfile}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 transition-colors"
          >
            Create Profile
          </button>
        </div>
      )}

      {searchResult && searchResult !== 'not-found' && (
        <div className="bg-white dark:bg-[#151e32] rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 p-6">
          <div className="flex justify-between items-start mb-6 border-b border-gray-100 dark:border-gray-800 pb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{searchResult.name}</h2>
              <p className="text-sm text-gray-500 font-mono">ID: {searchResult.id}</p>
            </div>
            <button className="px-4 py-2 bg-blue-50 dark:bg-blue-900/20 text-blue-600 rounded-lg text-sm font-bold">
              Edit Profile
            </button>
          </div>

          <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <History className="text-gray-400" /> Medical History
          </h3>
          <div className="space-y-4">
            {searchResult.history.map((record: any, idx: number) => (
              <div key={idx} className="p-4 rounded-xl bg-gray-50 dark:bg-gray-900/50 border border-gray-100 dark:border-gray-800 flex justify-between items-center">
                <div>
                  <h4 className="font-bold text-gray-900 dark:text-white">{record.diagnosis}</h4>
                  <p className="text-xs text-gray-500">{record.doctor} • {record.date}</p>
                </div>
                <button className="p-2 text-gray-400 hover:text-blue-600 transition-colors">
                  <FileText size={18} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default PatientHistory;
