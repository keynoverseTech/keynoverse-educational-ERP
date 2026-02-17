import React, { useState } from 'react';
import { 
  Search, 
  User, 
  CheckCircle, 
  XCircle, 
  Clock, 
  AlertTriangle,
  Plus,
  ArrowLeft,
  Save
} from 'lucide-react';

interface Applicant {
  id: string;
  name: string;
  programme: string;
  score: number;
  status: 'Pending' | 'Eligible' | 'Admitted' | 'Rejected';
  appNo: string;
  email: string;
  phone?: string;
}

const mockApplicants: Applicant[] = [
  { id: '1', name: 'John Doe', programme: 'Computer Science', score: 245, status: 'Eligible', appNo: '2024987654', email: 'john@example.com' },
  { id: '2', name: 'Jane Smith', programme: 'Accounting', score: 180, status: 'Pending', appNo: '2024123456', email: 'jane@example.com' },
  { id: '3', name: 'Michael Brown', programme: 'Medicine', score: 280, status: 'Admitted', appNo: '2024567890', email: 'michael@example.com' },
  { id: '4', name: 'Sarah Wilson', programme: 'Mass Communication', score: 150, status: 'Rejected', appNo: '2024234567', email: 'sarah@example.com' },
  { id: '5', name: 'David Lee', programme: 'Computer Engineering', score: 210, status: 'Eligible', appNo: 'DE2024001', email: 'david@example.com' },
];

const CreateAdmission: React.FC = () => {
  const [selectedApplicant, setSelectedApplicant] = useState<Applicant | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showConfirmModal, setShowConfirmModal] = useState<{ show: boolean, action: 'admit' | 'reject' | 'hold' | null }>({ show: false, action: null });
  const [toast, setToast] = useState<{ show: boolean, message: string, type: 'success' | 'error' } | null>(null);
  
  // New Application State
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [newApplicant, setNewApplicant] = useState({
    name: '',
    email: '',
    phone: '',
    jambNo: '',
    score: '',
    course: ''
  });

  const filteredApplicants = mockApplicants.filter(app => 
    app.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    app.appNo.includes(searchQuery)
  );

  const handleDecision = (action: 'admit' | 'reject' | 'hold') => {
    // Simulate API call
    setTimeout(() => {
      // In a real app, you would update the backend here
      setToast({ show: true, message: `Applicant successfully ${action === 'admit' ? 'admitted' : action === 'reject' ? 'rejected' : 'held'}!`, type: 'success' });
      setShowConfirmModal({ show: false, action: null });
      
      // Auto-hide toast
      setTimeout(() => setToast(null), 3000);
    }, 500);
  };

  const handleCreateApplication = () => {
    // Validate form
    if (!newApplicant.name || !newApplicant.jambNo || !newApplicant.score || !newApplicant.course) {
      setToast({ show: true, message: 'Please fill in all required fields', type: 'error' });
      setTimeout(() => setToast(null), 3000);
      return;
    }

    // Simulate API call
    setTimeout(() => {
      setToast({ show: true, message: 'New application created successfully!', type: 'success' });
      setIsAddingNew(false);
      setNewApplicant({ name: '', email: '', phone: '', jambNo: '', score: '', course: '' });
      setTimeout(() => setToast(null), 3000);
    }, 1000);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Admitted': return 'text-green-600 bg-green-50 dark:bg-green-900/20 dark:text-green-400';
      case 'Eligible': return 'text-blue-600 bg-blue-50 dark:bg-blue-900/20 dark:text-blue-400';
      case 'Pending': return 'text-yellow-600 bg-yellow-50 dark:bg-yellow-900/20 dark:text-yellow-400';
      case 'Rejected': return 'text-red-600 bg-red-50 dark:bg-red-900/20 dark:text-red-400';
      default: return 'text-gray-600 bg-gray-50 dark:bg-gray-800 dark:text-gray-400';
    }
  };

  return (
    <div className="h-[calc(100vh-100px)] flex gap-6 p-6">
      {/* Left Column: Applicant List */}
      <div className="w-1/3 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 flex flex-col">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">Applicants</h2>
            <button 
              onClick={() => { setIsAddingNew(true); setSelectedApplicant(null); }}
              className="p-2 bg-blue-50 text-blue-600 hover:bg-blue-100 dark:bg-blue-900/20 dark:text-blue-400 rounded-lg transition-colors"
              title="Add New Applicant"
            >
              <Plus size={20} />
            </button>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
            <input 
              type="text" 
              placeholder="Search applicants..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          {filteredApplicants.map(app => (
            <div 
              key={app.id}
              onClick={() => { setSelectedApplicant(app); setIsAddingNew(false); }}
              className={`p-3 rounded-lg cursor-pointer transition-colors flex items-center justify-between group ${
                selectedApplicant?.id === app.id 
                  ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800' 
                  : 'hover:bg-gray-50 dark:hover:bg-gray-900/50 border border-transparent'
              }`}
            >
              <div>
                <h3 className={`font-medium text-sm ${selectedApplicant?.id === app.id ? 'text-blue-900 dark:text-blue-300' : 'text-gray-900 dark:text-white'}`}>{app.name}</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400">{app.programme}</p>
              </div>
              <div className="text-right">
                <span className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${getStatusColor(app.status)}`}>
                  {app.status}
                </span>
                <p className="text-xs font-bold text-gray-700 dark:text-gray-300 mt-1">{app.score}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Right Column: Details or Create Form */}
      <div className="flex-1 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 flex flex-col overflow-hidden">
        {isAddingNew ? (
          // Create New Application Form
          <div className="flex flex-col h-full">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex items-center gap-4">
              <button 
                onClick={() => setIsAddingNew(false)}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                <ArrowLeft size={24} />
              </button>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">New Manual Application</h2>
            </div>
            
            <div className="flex-1 overflow-y-auto p-8">
              <div className="max-w-2xl mx-auto space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Full Name *</label>
                    <input 
                      type="text" 
                      value={newApplicant.name}
                      onChange={(e) => setNewApplicant({...newApplicant, name: e.target.value})}
                      className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                      placeholder="e.g. John Doe"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">JAMB Reg Number *</label>
                    <input 
                      type="text" 
                      value={newApplicant.jambNo}
                      onChange={(e) => setNewApplicant({...newApplicant, jambNo: e.target.value})}
                      className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                      placeholder="e.g. 2024987654"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Email Address</label>
                    <input 
                      type="email" 
                      value={newApplicant.email}
                      onChange={(e) => setNewApplicant({...newApplicant, email: e.target.value})}
                      className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                      placeholder="john@example.com"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Phone Number</label>
                    <input 
                      type="tel" 
                      value={newApplicant.phone}
                      onChange={(e) => setNewApplicant({...newApplicant, phone: e.target.value})}
                      className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                      placeholder="+234..."
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">UTME Score *</label>
                    <input 
                      type="number" 
                      value={newApplicant.score}
                      onChange={(e) => setNewApplicant({...newApplicant, score: e.target.value})}
                      className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                      placeholder="0-400"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Course of Study *</label>
                    <input 
                      type="text" 
                      value={newApplicant.course}
                      onChange={(e) => setNewApplicant({...newApplicant, course: e.target.value})}
                      className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                      placeholder="e.g. Computer Science"
                    />
                  </div>
                </div>

                <div className="pt-6 border-t border-gray-200 dark:border-gray-700 flex justify-end gap-3">
                  <button 
                    onClick={() => setIsAddingNew(false)}
                    className="px-6 py-2.5 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors font-medium"
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={handleCreateApplication}
                    className="px-6 py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors shadow-sm flex items-center"
                  >
                    <Save size={18} className="mr-2" />
                    Create Application
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : selectedApplicant ? (
          // Applicant Details
          <>
            <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex justify-between items-start">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{selectedApplicant.name}</h2>
                <div className="flex items-center gap-3 mt-1 text-sm text-gray-500 dark:text-gray-400">
                  <span className="font-mono">{selectedApplicant.appNo}</span>
                  <span>•</span>
                  <span>{selectedApplicant.email}</span>
                </div>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${getStatusColor(selectedApplicant.status)}`}>
                {selectedApplicant.status}
              </span>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-8">
              {/* Applicant Summary */}
              <div className="grid grid-cols-2 gap-6">
                <div className="p-4 bg-gray-50 dark:bg-gray-900/50 rounded-lg border border-gray-100 dark:border-gray-800">
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Programme Applied</p>
                  <p className="font-medium text-gray-900 dark:text-white">{selectedApplicant.programme}</p>
                </div>
                <div className="p-4 bg-gray-50 dark:bg-gray-900/50 rounded-lg border border-gray-100 dark:border-gray-800">
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">UTME Score</p>
                  <p className="font-bold text-xl text-gray-900 dark:text-white">{selectedApplicant.score}</p>
                </div>
              </div>

              {/* Cut-off Comparison */}
              <div>
                <h3 className="font-bold text-gray-900 dark:text-white mb-4">Programme Cut-Off Comparison</h3>
                <div className="flex items-center gap-4 p-4 rounded-lg bg-yellow-50 dark:bg-yellow-900/10 border border-yellow-100 dark:border-yellow-800/30">
                  <AlertTriangle className="text-yellow-600 dark:text-yellow-400 shrink-0" />
                  <div>
                    <p className="text-sm text-gray-700 dark:text-gray-300">
                      The cut-off for <span className="font-medium">{selectedApplicant.programme}</span> is <span className="font-bold">220</span>.
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      Applicant score: <span className={`font-bold ${selectedApplicant.score >= 220 ? 'text-green-600' : 'text-red-600'}`}>{selectedApplicant.score}</span>
                    </p>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="pt-6 border-t border-gray-100 dark:border-gray-800">
                <h3 className="font-bold text-gray-900 dark:text-white mb-4">Actions</h3>
                <div className="grid grid-cols-3 gap-4">
                  <button 
                    onClick={() => setShowConfirmModal({ show: true, action: 'admit' })}
                    disabled={selectedApplicant.status === 'Admitted'}
                    className="flex flex-col items-center justify-center gap-2 p-4 rounded-xl border-2 border-green-100 dark:border-green-900/30 hover:bg-green-50 dark:hover:bg-green-900/20 text-green-700 dark:text-green-400 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <CheckCircle size={24} />
                    <span className="font-bold">Admit</span>
                  </button>
                  <button 
                    onClick={() => setShowConfirmModal({ show: true, action: 'reject' })}
                    disabled={selectedApplicant.status === 'Rejected'}
                    className="flex flex-col items-center justify-center gap-2 p-4 rounded-xl border-2 border-red-100 dark:border-red-900/30 hover:bg-red-50 dark:hover:bg-red-900/20 text-red-700 dark:text-red-400 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <XCircle size={24} />
                    <span className="font-bold">Reject</span>
                  </button>
                  <button 
                    onClick={() => setShowConfirmModal({ show: true, action: 'hold' })}
                    className="flex flex-col items-center justify-center gap-2 p-4 rounded-xl border-2 border-yellow-100 dark:border-yellow-900/30 hover:bg-yellow-50 dark:hover:bg-yellow-900/20 text-yellow-700 dark:text-yellow-400 transition-all"
                  >
                    <Clock size={24} />
                    <span className="font-bold">Hold</span>
                  </button>
                </div>
                <textarea 
                  placeholder="Add optional notes for this decision..."
                  className="w-full mt-4 px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                  rows={3}
                />
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-gray-400">
            <User size={64} className="mb-4 opacity-20" />
            <p className="text-lg font-medium text-gray-500">Select an applicant to review</p>
            <p className="text-sm text-gray-400 mb-6">or</p>
            <button 
              onClick={() => setIsAddingNew(true)}
              className="px-6 py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors shadow-sm flex items-center gap-2"
            >
              <Plus size={18} /> Create New Application
            </button>
          </div>
        )}
      </div>

      {/* Confirmation Modal */}
      {showConfirmModal.show && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-sm w-full p-6">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Confirm Action</h3>
            <p className="text-gray-500 dark:text-gray-400 mb-6">
              Are you sure you want to <span className="font-bold">{showConfirmModal.action}</span> {selectedApplicant?.name}?
            </p>
            <div className="flex gap-3">
              <button 
                onClick={() => setShowConfirmModal({ show: false, action: null })}
                className="flex-1 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 rounded-lg font-medium transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={() => handleDecision(showConfirmModal.action!)}
                className="flex-1 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {toast && toast.show && (
        <div className={`fixed bottom-6 right-6 px-6 py-3 rounded-lg shadow-lg text-white font-medium animate-in slide-in-from-bottom-5 fade-in duration-300 ${
          toast.type === 'success' ? 'bg-green-600' : 'bg-red-600'
        }`}>
          {toast.message}
        </div>
      )}
    </div>
  );
};

export default CreateAdmission;
