import React from 'react';
import { 
  AlertTriangle, 
  CheckCircle, 
  FileText, 
  RefreshCw
} from 'lucide-react';

const PlagiarismCheck: React.FC = () => {
  // Mock Data
  const reports = [
    {
      id: 1,
      student: 'John Doe',
      project: 'AI in Healthcare Diagnostics',
      document: 'Chapter_3_Analysis.pdf',
      similarity: 12,
      status: 'Acceptable',
      aiScore: 5,
      date: '2024-03-20',
    },
    {
      id: 2,
      student: 'Michael Brown',
      project: 'Blockchain Voting Systems',
      document: 'Literature_Review.docx',
      similarity: 45,
      status: 'High Similarity',
      aiScore: 85,
      date: '2024-03-18',
    },
    {
      id: 3,
      student: 'Sarah Jenkins',
      project: 'Impact of Climate Change',
      document: 'Methodology.pdf',
      similarity: 28,
      status: 'Review Required',
      aiScore: 15,
      date: '2024-03-19',
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Acceptable': return 'text-green-600 bg-green-50 border-green-200';
      case 'Review Required': return 'text-amber-600 bg-amber-50 border-amber-200';
      case 'High Similarity': return 'text-red-600 bg-red-50 border-red-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <AlertTriangle className="text-red-600" />
            Plagiarism & Similarity
          </h1>
          <p className="text-gray-500 dark:text-gray-400">Automated plagiarism detection and AI content analysis.</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-sm font-medium shadow-sm">
          <RefreshCw size={16} />
          Refresh Reports
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {reports.map((report) => (
          <div key={report.id} className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-6 shadow-sm hover:shadow-md transition-all">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white">{report.student}</h3>
                  <span className="text-xs text-gray-500">• {report.date}</span>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">{report.project}</p>
                <div className="flex items-center gap-2 text-xs font-medium text-gray-500 bg-gray-100 dark:bg-gray-700/50 px-3 py-1.5 rounded-lg w-fit">
                  <FileText size={14} />
                  {report.document}
                </div>
              </div>

              <div className="flex items-center gap-6 w-full md:w-auto">
                <div className="text-center">
                  <p className="text-xs font-bold text-gray-500 uppercase mb-1">Similarity</p>
                  <div className={`text-2xl font-black ${
                    report.similarity > 30 ? 'text-red-600' : report.similarity > 20 ? 'text-amber-500' : 'text-green-600'
                  }`}>
                    {report.similarity}%
                  </div>
                </div>
                
                <div className="w-px h-10 bg-gray-200 dark:bg-gray-700 hidden md:block"></div>

                <div className="text-center">
                  <p className="text-xs font-bold text-gray-500 uppercase mb-1">AI Probability</p>
                  <div className={`text-2xl font-black ${
                    report.aiScore > 50 ? 'text-purple-600' : 'text-blue-600'
                  }`}>
                    {report.aiScore}%
                  </div>
                </div>

                <div className="w-px h-10 bg-gray-200 dark:bg-gray-700 hidden md:block"></div>

                <div className={`px-4 py-2 rounded-xl border text-sm font-bold flex items-center gap-2 ${getStatusColor(report.status)}`}>
                  {report.status === 'Acceptable' && <CheckCircle size={16} />}
                  {report.status === 'High Similarity' && <AlertTriangle size={16} />}
                  {report.status}
                </div>
                
                <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg text-blue-600 font-bold text-xs">
                  View Report
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PlagiarismCheck;
