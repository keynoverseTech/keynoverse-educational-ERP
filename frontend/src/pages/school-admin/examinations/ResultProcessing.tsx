import React, { useState } from 'react';
import { FileText, UserCheck, Gavel, ArrowLeft, CheckCircle, XCircle } from 'lucide-react';
import Malpractice from './Malpractice';

// --- Types ---

interface ResultBatch {
  id: string;
  courseCode: string;
  courseTitle: string;
  department: string;
  submittedBy: string;
  submissionDate: string;
  status: 'Draft' | 'Submitted' | 'Dept. Approved' | 'Faculty Approved' | 'Senate Approved';
  currentHandler: string;
}

// --- Components ---

const ResultWorkflowContent = () => {
  const [batches, setBatches] = useState<ResultBatch[]>([
    {
      id: '1',
      courseCode: 'CSC 301',
      courseTitle: 'Operating Systems',
      department: 'Computer Science',
      submittedBy: 'Dr. Sarah Wilson',
      submissionDate: '2025-06-20',
      status: 'Dept. Approved',
      currentHandler: 'Dean, Faculty of Science'
    },
    {
      id: '2',
      courseCode: 'MTH 201',
      courseTitle: 'Linear Algebra',
      department: 'Mathematics',
      submittedBy: 'Mr. James Okafor',
      submissionDate: '2025-06-21',
      status: 'Submitted',
      currentHandler: 'HOD, Mathematics'
    },
    {
      id: '3',
      courseCode: 'PHY 101',
      courseTitle: 'General Physics I',
      department: 'Physics',
      submittedBy: 'Prof. Adeleke',
      submissionDate: '2025-06-22',
      status: 'Draft',
      currentHandler: 'Prof. Adeleke'
    }
  ]);
  const [selectedBatch, setSelectedBatch] = useState<ResultBatch | null>(null);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Draft': return 'bg-gray-100 text-gray-700 border-gray-200';
      case 'Submitted': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'Dept. Approved': return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'Faculty Approved': return 'bg-indigo-100 text-indigo-700 border-indigo-200';
      case 'Senate Approved': return 'bg-green-100 text-green-700 border-green-200';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getProgress = (status: string) => {
    const stages = ['Draft', 'Submitted', 'Dept. Approved', 'Faculty Approved', 'Senate Approved'];
    const index = stages.indexOf(status);
    return ((index + 1) / stages.length) * 100;
  };

  const handleApprove = (batchId: string) => {
    setBatches(prev => prev.map(b => {
      if (b.id === batchId) {
        let nextStatus = b.status;
        if (b.status === 'Submitted') nextStatus = 'Dept. Approved';
        else if (b.status === 'Dept. Approved') nextStatus = 'Faculty Approved';
        else if (b.status === 'Faculty Approved') nextStatus = 'Senate Approved';
        return { ...b, status: nextStatus as any };
      }
      return b;
    }));
    setSelectedBatch(null);
  };

  if (selectedBatch) {
    return (
      <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
        <button 
          onClick={() => setSelectedBatch(null)}
          className="flex items-center gap-2 text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors"
        >
          <ArrowLeft size={20} />
          Back to Workflow
        </button>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
           <div className="flex justify-between items-start mb-6">
             <div>
               <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
                 {selectedBatch.courseCode}
                 <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(selectedBatch.status)}`}>
                   {selectedBatch.status}
                 </span>
               </h2>
               <p className="text-gray-500 dark:text-gray-400">{selectedBatch.courseTitle}</p>
             </div>
             <div className="flex gap-3">
               <button 
                 className="px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors flex items-center gap-2"
                 onClick={() => setSelectedBatch(null)}
               >
                 <XCircle size={18} />
                 Return
               </button>
               {selectedBatch.status !== 'Senate Approved' && selectedBatch.status !== 'Draft' && (
                 <button 
                   className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
                   onClick={() => handleApprove(selectedBatch.id)}
                 >
                   <CheckCircle size={18} />
                   Approve & Forward
                 </button>
               )}
             </div>
           </div>
           
           <div className="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-12 text-center border-2 border-dashed border-gray-200 dark:border-gray-700">
             <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
             <h3 className="text-lg font-medium text-gray-900 dark:text-white">Detailed Result Sheet</h3>
             <p className="text-gray-500 dark:text-gray-400 mt-2">
               Full student list and scores would appear here for verification.
             </p>
           </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">Workflow Status</h2>
          <p className="text-gray-500 dark:text-gray-400">Track and approve results through the academic hierarchy.</p>
        </div>
      </div>

      <div className="flex gap-4 mb-6 overflow-x-auto pb-2">
        {['All', 'Draft', 'Submitted', 'Dept. Approved', 'Faculty Approved', 'Senate Approved'].map((tab) => (
          <button 
            key={tab}
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap ${
              tab === 'All' 
                ? 'bg-blue-600 text-white' 
                : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:bg-gray-50'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6">
        {batches.map((batch) => (
          <div key={batch.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex flex-col md:flex-row justify-between gap-6 mb-4">
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <h3 className="font-bold text-lg text-gray-900 dark:text-white">{batch.courseCode}</h3>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(batch.status)}`}>
                    {batch.status}
                  </span>
                </div>
                <p className="text-gray-600 dark:text-gray-300 font-medium">{batch.courseTitle}</p>
                <div className="flex items-center gap-2 text-sm text-gray-500 mt-2">
                  <UserCheck size={14} />
                  <span>Submitted by <strong>{batch.submittedBy}</strong> on {batch.submissionDate}</span>
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                 <div className="text-right hidden md:block">
                  <p className="text-xs text-gray-500 uppercase tracking-wide">Pending Action From</p>
                  <p className="font-medium text-gray-900 dark:text-white">{batch.currentHandler}</p>
                </div>
                <button 
                  onClick={() => setSelectedBatch(batch)}
                  className="px-4 py-2 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors"
                >
                  Review
                </button>
              </div>
            </div>

            <div className="relative pt-4">
              <div className="flex mb-2 items-center justify-between text-xs font-semibold text-gray-500 uppercase tracking-wide">
                <span>Workflow Progress</span>
                <span>{Math.round(getProgress(batch.status))}%</span>
              </div>
              <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-gray-100 dark:bg-gray-700">
                <div 
                  style={{ width: `${getProgress(batch.status)}%` }} 
                  className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-600 transition-all duration-500"
                ></div>
              </div>
              
              <div className="flex justify-between text-xs text-gray-400">
                <span className={['Draft', 'Submitted', 'Dept. Approved', 'Faculty Approved', 'Senate Approved'].indexOf(batch.status) >= 0 ? 'text-blue-600 font-medium' : ''}>Lecturer</span>
                <span className={['Submitted', 'Dept. Approved', 'Faculty Approved', 'Senate Approved'].indexOf(batch.status) >= 1 ? 'text-blue-600 font-medium' : ''}>HOD</span>
                <span className={['Dept. Approved', 'Faculty Approved', 'Senate Approved'].indexOf(batch.status) >= 2 ? 'text-blue-600 font-medium' : ''}>Faculty Board</span>
                <span className={['Faculty Approved', 'Senate Approved'].indexOf(batch.status) >= 3 ? 'text-blue-600 font-medium' : ''}>Senate</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const ResultProcessing: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'workflow' | 'malpractice'>('workflow');

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Result Processing</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Manage result approval workflows and malpractice cases.</p>
        </div>
      </div>

      <div className="border-b border-gray-200 dark:border-gray-700">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('workflow')}
            className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2 ${
              activeTab === 'workflow'
                ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
            }`}
          >
            <FileText size={18} />
            Processing Workflow
          </button>
          <button
            onClick={() => setActiveTab('malpractice')}
            className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2 ${
              activeTab === 'malpractice'
                ? 'border-red-500 text-red-600 dark:text-red-400'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
            }`}
          >
            <Gavel size={18} />
            Malpractice Cases
          </button>
        </nav>
      </div>

      <div className="mt-6">
        {activeTab === 'workflow' && <ResultWorkflowContent />}
        {activeTab === 'malpractice' && <Malpractice />}
      </div>
    </div>
  );
};

export default ResultProcessing;
