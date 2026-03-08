import React, { useState } from 'react';
import { 
  FileText, 
  Calendar, 
  Clock, 
  CheckCircle, 
  MoreVertical,
  Upload
} from 'lucide-react';

const StudentAssignments: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'active' | 'past'>('active');

  const assignments = [
    {
      id: 1,
      title: 'Research Proposal Draft',
      course: 'CSC 401',
      dueDate: '2024-03-25',
      time: '11:59 PM',
      points: 20,
      status: 'Pending',
      statusColor: 'text-amber-600 bg-amber-50 dark:bg-amber-900/20'
    },
    {
      id: 2,
      title: 'Linear Transformations Problem Set',
      course: 'MTH 302',
      dueDate: '2024-03-28',
      time: '10:00 AM',
      points: 10,
      status: 'Submitted',
      statusColor: 'text-green-600 bg-green-50 dark:bg-green-900/20'
    },
  ];

  return (
    <div className="space-y-6 p-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <FileText className="text-purple-600" />
            Assignments
          </h1>
          <p className="text-gray-500 dark:text-gray-400">View and submit your coursework.</p>
        </div>
      </div>

      <div className="flex gap-4 border-b border-gray-200 dark:border-gray-700 pb-1">
        <button 
          onClick={() => setActiveTab('active')}
          className={`pb-3 text-sm font-bold px-2 relative ${
            activeTab === 'active' ? 'text-purple-600' : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
          }`}
        >
          Active
          {activeTab === 'active' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-purple-600 rounded-t-full" />}
        </button>
        <button 
          onClick={() => setActiveTab('past')}
          className={`pb-3 text-sm font-bold px-2 relative ${
            activeTab === 'past' ? 'text-purple-600' : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
          }`}
        >
          Past
          {activeTab === 'past' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-purple-600 rounded-t-full" />}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {assignments.map((assignment) => (
          <div key={assignment.id} className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-md transition-all group relative">
            <div className="flex justify-between items-start mb-4">
              <div>
                <span className="text-xs font-bold text-purple-600 bg-purple-50 dark:bg-purple-900/20 px-2 py-1 rounded-md mb-2 inline-block">
                  {assignment.course}
                </span>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">{assignment.title}</h3>
              </div>
              <button className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                <MoreVertical size={20} />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
              <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                <Calendar size={16} className="text-gray-400" />
                <span>{assignment.dueDate}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                <Clock size={16} className="text-gray-400" />
                <span>{assignment.time}</span>
              </div>
            </div>

            <div className="flex items-center justify-between mt-4">
              <span className={`px-3 py-1 rounded-full text-xs font-bold ${assignment.statusColor}`}>
                {assignment.status}
              </span>
              <span className="text-sm font-bold text-gray-900 dark:text-white">{assignment.points} Points</span>
            </div>

            <div className="mt-6 pt-4 border-t border-gray-100 dark:border-gray-700">
              {assignment.status === 'Pending' ? (
                <button className="w-full py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm font-bold flex items-center justify-center gap-2">
                  <Upload size={16} /> Submit Assignment
                </button>
              ) : (
                <button className="w-full py-2 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors text-sm font-bold flex items-center justify-center gap-2">
                  <CheckCircle size={16} /> View Submission
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StudentAssignments;