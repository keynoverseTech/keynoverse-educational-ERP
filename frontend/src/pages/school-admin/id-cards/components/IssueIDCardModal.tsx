import React, { useState } from 'react';
import { 
  X, 
  Search, 
  CreditCard, 
  User, 
  Calendar,
  CheckCircle,
  AlertCircle
} from 'lucide-react';

interface IssueIDCardModalProps {
  type: 'Staff' | 'Student';
  isOpen: boolean;
  onClose: () => void;
  onIssue: (data: any) => void;
}

const IssueIDCardModal: React.FC<IssueIDCardModalProps> = ({ type, isOpen, onClose, onIssue }) => {
  const [step, setStep] = useState(1);
  const [selectedPerson, setSelectedPerson] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState('');

  if (!isOpen) return null;

  // Mock Search Results
  const mockResults = type === 'Staff' 
    ? [
        { id: 'STF/001', name: 'Dr. John Doe', role: 'Lecturer', dept: 'Computer Science' },
        { id: 'STF/002', name: 'Mrs. Jane Smith', role: 'Admin', dept: 'Registry' },
      ]
    : [
        { id: 'ENG/2023/001', name: 'Alice Brown', role: 'Student', dept: 'Civil Engineering' },
        { id: 'MED/2023/045', name: 'Bob White', role: 'Student', dept: 'Medicine' },
      ];

  const handleIssue = () => {
    onIssue({
      person: selectedPerson,
      issueDate: new Date().toISOString().split('T')[0],
      expiryDate: new Date(new Date().setFullYear(new Date().getFullYear() + 2)).toISOString().split('T')[0],
      cardId: Math.random().toString(36).substr(2, 9).toUpperCase()
    });
    setStep(3); // Success step
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white dark:bg-[#151e32] w-full max-w-lg rounded-2xl shadow-2xl border border-gray-100 dark:border-gray-800 overflow-hidden scale-100 animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-100 dark:border-gray-800">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <CreditCard className="text-blue-600" />
            Issue {type} ID Card
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors">
            <X size={20} className="text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {step === 1 && (
            <div className="space-y-6">
              <div>
                <label className="text-sm font-bold text-gray-500 uppercase mb-2 block">Search {type}</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                  <input 
                    type="text" 
                    placeholder={`Enter Name or ${type === 'Staff' ? 'Staff ID' : 'Matric No'}...`}
                    className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl outline-none focus:ring-2 focus:ring-blue-500/20"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>

              {searchQuery && (
                <div className="space-y-2">
                  <p className="text-xs font-bold text-gray-400 uppercase">Search Results</p>
                  {mockResults.map((person) => (
                    <div 
                      key={person.id}
                      onClick={() => {
                        setSelectedPerson(person);
                        setStep(2);
                      }}
                      className="flex items-center justify-between p-3 rounded-xl border border-gray-100 dark:border-gray-800 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:border-blue-200 cursor-pointer transition-all group"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                          <User size={18} className="text-gray-500 group-hover:text-blue-600" />
                        </div>
                        <div>
                          <h4 className="font-bold text-gray-900 dark:text-white text-sm">{person.name}</h4>
                          <p className="text-xs text-gray-500">{person.id} • {person.dept}</p>
                        </div>
                      </div>
                      <div className="w-6 h-6 rounded-full border-2 border-gray-200 dark:border-gray-700 group-hover:border-blue-500 group-hover:bg-blue-500 transition-all"></div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {step === 2 && selectedPerson && (
            <div className="space-y-6">
              <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-white dark:bg-gray-800 flex items-center justify-center shadow-sm">
                  <User size={32} className="text-blue-600" />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-gray-900 dark:text-white">{selectedPerson.name}</h3>
                  <p className="text-sm text-blue-600 font-medium">{selectedPerson.id}</p>
                  <p className="text-xs text-gray-500">{selectedPerson.dept}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">Issue Date</label>
                  <div className="flex items-center gap-2 p-3 bg-gray-50 dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700">
                    <Calendar size={16} className="text-gray-400" />
                    <span className="text-sm font-medium text-gray-900 dark:text-white">{new Date().toLocaleDateString()}</span>
                  </div>
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">Expiry Date</label>
                  <div className="flex items-center gap-2 p-3 bg-gray-50 dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700">
                    <AlertCircle size={16} className="text-orange-500" />
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      {new Date(new Date().setFullYear(new Date().getFullYear() + 2)).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex gap-3 mt-8">
                <button 
                  onClick={() => setStep(1)}
                  className="flex-1 py-3 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-xl font-bold hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                >
                  Back
                </button>
                <button 
                  onClick={handleIssue}
                  className="flex-1 py-3 bg-blue-600 text-white rounded-xl font-bold shadow-lg hover:bg-blue-700 transition-colors"
                >
                  Confirm Issuance
                </button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="text-center py-8">
              <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4 animate-in zoom-in duration-300">
                <CheckCircle size={40} />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">ID Card Issued!</h3>
              <p className="text-gray-500 dark:text-gray-400 mb-8">
                The ID card for <span className="font-bold text-gray-900 dark:text-white">{selectedPerson?.name}</span> has been successfully generated and queued for printing.
              </p>
              <button 
                onClick={onClose}
                className="px-8 py-3 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-xl font-bold hover:opacity-90 transition-opacity"
              >
                Close
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default IssueIDCardModal;