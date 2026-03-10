import { useState } from 'react';
import { 
  FileText, 
  Download, 
  MessageSquare, 
  CheckCircle
} from 'lucide-react';

const ProjectReviews = () => {
  const [activeTab, setActiveTab] = useState('pending');

  const submissions = [
    {
      id: 1,
      student: 'John Doe',
      topic: 'AI in Healthcare',
      type: 'Chapter 2',
      date: '2024-03-15',
      status: 'pending',
      fileSize: '2.4 MB'
    },
    {
      id: 2,
      student: 'Jane Smith',
      topic: 'Sustainable Energy',
      type: 'Proposal',
      date: '2024-03-14',
      status: 'pending',
      fileSize: '1.1 MB'
    },
    {
      id: 3,
      student: 'Michael Brown',
      topic: 'Blockchain Voting',
      type: 'Chapter 1',
      date: '2024-03-10',
      status: 'reviewed',
      grade: 'A-',
      feedback: 'Good work, minor revisions needed.'
    }
  ];

  const filteredSubmissions = submissions.filter(s => 
    activeTab === 'pending' ? s.status === 'pending' : s.status === 'reviewed'
  );

  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Project Reviews</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">Review and grade student submissions</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 border-b border-gray-200 dark:border-gray-700">
        <button
          onClick={() => setActiveTab('pending')}
          className={`pb-3 px-4 text-sm font-medium transition-colors relative ${
            activeTab === 'pending' 
              ? 'text-blue-600 border-b-2 border-blue-600' 
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Pending Review
          <span className="ml-2 bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full text-xs">
            {submissions.filter(s => s.status === 'pending').length}
          </span>
        </button>
        <button
          onClick={() => setActiveTab('reviewed')}
          className={`pb-3 px-4 text-sm font-medium transition-colors relative ${
            activeTab === 'reviewed' 
              ? 'text-blue-600 border-b-2 border-blue-600' 
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Reviewed History
        </button>
      </div>

      <div className="space-y-4">
        {filteredSubmissions.map((sub) => (
          <div key={sub.id} className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex flex-col md:flex-row justify-between gap-4">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-blue-600">
                  <FileText size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-gray-900 dark:text-white">{sub.topic}</h3>
                  <p className="text-sm text-gray-500 mb-1">Student: <span className="font-medium text-gray-700 dark:text-gray-300">{sub.student}</span></p>
                  <div className="flex items-center gap-3 text-xs text-gray-400">
                    <span className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">{sub.type}</span>
                    <span>{sub.date}</span>
                    <span>{sub.fileSize}</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col items-end gap-3">
                {sub.status === 'pending' ? (
                  <div className="flex gap-2">
                    <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 text-sm font-medium transition-colors">
                      <Download size={16} />
                      Download
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium transition-colors shadow-sm">
                      <MessageSquare size={16} />
                      Give Feedback
                    </button>
                  </div>
                ) : (
                  <div className="text-right">
                    <div className="flex items-center gap-2 text-green-600 mb-1 justify-end">
                      <CheckCircle size={16} />
                      <span className="font-medium">Reviewed</span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Grade: <span className="font-bold">{sub.grade}</span></p>
                  </div>
                )}
              </div>
            </div>
            
            {sub.feedback && (
              <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
                <p className="text-sm text-gray-600 dark:text-gray-400 italic">"{sub.feedback}"</p>
              </div>
            )}
          </div>
        ))}

        {filteredSubmissions.length === 0 && (
          <div className="text-center py-12">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-800 mb-4">
              <CheckCircle size={32} className="text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">All caught up!</h3>
            <p className="text-gray-500 dark:text-gray-400">No submissions found in this category.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectReviews;
