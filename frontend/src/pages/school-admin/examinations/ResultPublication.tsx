import React, { useState } from 'react';
import { Send, Eye, CheckCircle, FileText, BarChart2, Filter } from 'lucide-react';

interface ResultBatch {
  id: string;
  courseCode: string;
  courseTitle: string;
  department: string;
  faculty: string;
  level: string;
  studentsCount: number;
  passRate: number;
  status: 'Pending Moderation' | 'Moderated' | 'Approved' | 'Published';
  submittedBy: string;
  submissionDate: string;
}

const ResultPublication: React.FC = () => {
  const [selectedFaculty, setSelectedFaculty] = useState('All');
  const [selectedDepartment, setSelectedDepartment] = useState('All');

  const [batches, setBatches] = useState<ResultBatch[]>([
    {
      id: '1',
      courseCode: 'CSC 301',
      courseTitle: 'Operating Systems',
      department: 'Computer Science',
      faculty: 'Science',
      level: '300',
      studentsCount: 150,
      passRate: 85,
      status: 'Pending Moderation',
      submittedBy: 'Dr. Sarah Wilson',
      submissionDate: '2024-06-20'
    },
    {
      id: '2',
      courseCode: 'MTH 201',
      courseTitle: 'Linear Algebra',
      department: 'Mathematics',
      faculty: 'Science',
      level: '200',
      studentsCount: 85,
      passRate: 72,
      status: 'Moderated',
      submittedBy: 'Mr. James Okafor',
      submissionDate: '2024-06-18'
    },
    {
      id: '3',
      courseCode: 'PHY 101',
      courseTitle: 'General Physics I',
      department: 'Physics',
      faculty: 'Science',
      level: '100',
      studentsCount: 300,
      passRate: 60,
      status: 'Published',
      submittedBy: 'Prof. Wilson',
      submissionDate: '2024-06-15'
    }
  ]);

  const faculties = ['All', 'Science', 'Arts', 'Engineering'];
  const departments = ['All', 'Computer Science', 'Mathematics', 'Physics', 'History', 'English', 'Electrical Eng.'];

  const filteredBatches = batches.filter(batch => {
    if (selectedFaculty !== 'All' && batch.faculty !== selectedFaculty) return false;
    if (selectedDepartment !== 'All' && batch.department !== selectedDepartment) return false;
    return true;
  });

  const handleAction = (id: string, action: 'Approve' | 'Publish') => {
    setBatches(prev => prev.map(batch => {
      if (batch.id === id) {
        if (action === 'Approve') return { ...batch, status: 'Approved' };
        if (action === 'Publish') return { ...batch, status: 'Published' };
      }
      return batch;
    }));
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Result Publication</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Review, approve, and publish examination results.</p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 mb-6 bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 items-center">
        <div className="flex items-center gap-2 text-gray-500 min-w-fit">
          <Filter size={20} />
          <span className="font-medium">Filters:</span>
        </div>
        
        <select 
          value={selectedFaculty}
          onChange={(e) => setSelectedFaculty(e.target.value)}
          className="w-full sm:w-auto px-3 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-white"
        >
          {faculties.map(f => <option key={f} value={f}>{f} {f !== 'All' ? 'Faculty' : ''}</option>)}
        </select>

        <select 
          value={selectedDepartment}
          onChange={(e) => setSelectedDepartment(e.target.value)}
          className="w-full sm:w-auto px-3 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-white"
        >
          {departments.map(d => <option key={d} value={d}>{d} {d !== 'All' ? 'Dept.' : ''}</option>)}
        </select>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {filteredBatches.map((batch) => (
          <div key={batch.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex flex-col md:flex-row justify-between gap-6">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <span className="font-bold text-lg text-gray-900 dark:text-white">{batch.courseCode}</span>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium border ${
                    batch.status === 'Published' 
                      ? 'bg-green-100 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800'
                      : batch.status === 'Approved'
                      ? 'bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800'
                      : 'bg-yellow-100 text-yellow-700 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-400 dark:border-yellow-800'
                  }`}>
                    {batch.status}
                  </span>
                </div>
                <h3 className="text-gray-600 dark:text-gray-300 mb-4">{batch.courseTitle}</h3>
                
                <div className="flex flex-wrap gap-4 text-sm text-gray-500 dark:text-gray-400">
                  <div className="flex items-center gap-1">
                    <FileText size={14} />
                    {batch.department} ({batch.level}L)
                  </div>
                  <div className="flex items-center gap-1">
                    <Eye size={14} />
                    {batch.studentsCount} Students
                  </div>
                  <div className="flex items-center gap-1">
                    <BarChart2 size={14} />
                    {batch.passRate}% Pass Rate
                  </div>
                </div>
              </div>

              <div className="flex flex-col justify-between items-end gap-4">
                <div className="text-right text-sm text-gray-500 dark:text-gray-400">
                  <p>Submitted by <span className="font-medium text-gray-900 dark:text-white">{batch.submittedBy}</span></p>
                  <p>{batch.submissionDate}</p>
                </div>

                <div className="flex gap-2">
                  <button className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors">
                    View Details
                  </button>
                  
                  {batch.status === 'Pending Moderation' && (
                    <button 
                      onClick={() => handleAction(batch.id, 'Approve')}
                      className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors flex items-center gap-2"
                    >
                      <CheckCircle size={16} />
                      Approve
                    </button>
                  )}
                  
                  {batch.status === 'Approved' && (
                    <button 
                      onClick={() => handleAction(batch.id, 'Publish')}
                      className="px-4 py-2 text-sm font-medium text-white bg-green-600 hover:bg-green-700 rounded-lg transition-colors flex items-center gap-2"
                    >
                      <Send size={16} />
                      Publish Results
                    </button>
                  )}

                  {batch.status === 'Published' && (
                    <button 
                      disabled
                      className="px-4 py-2 text-sm font-medium text-green-700 dark:text-green-400 bg-green-100 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg flex items-center gap-2 cursor-default"
                    >
                      <CheckCircle size={16} />
                      Published
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ResultPublication;
