import { 
  FileText, 
  Download, 
  ArrowLeft,
  Info
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const PlagiarismReport = () => {
  const navigate = useNavigate();

  const reports = [
    {
      id: 1,
      document: "Chapter 2 - Literature Review (v1.0)",
      date: "2024-03-01",
      similarityScore: 24,
      status: "acceptable", // acceptable, review_required, high
      sources: [
        { name: "Wikipedia - Machine Learning", match: "5%" },
        { name: "Journal of AI Research 2022", match: "3%" },
        { name: "Student Paper (Unpublished)", match: "2%" }
      ]
    },
    {
      id: 2,
      document: "Chapter 1 - Introduction (v1.0)",
      date: "2024-02-05",
      similarityScore: 8,
      status: "acceptable",
      sources: [
        { name: "Various Internet Sources", match: "8%" }
      ]
    }
  ];

  const getStatusColor = (score: number) => {
    if (score < 15) return 'text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20';
    if (score < 30) return 'text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-900/20';
    return 'text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20';
  };

  const getStatusText = (score: number) => {
    if (score < 15) return 'Acceptable';
    if (score < 30) return 'Review Required';
    return 'High Similarity';
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-4">
        <button 
          onClick={() => navigate(-1)}
          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
        >
          <ArrowLeft size={20} className="text-gray-500 dark:text-gray-400" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Plagiarism & Similarity Report</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">View Turnitin/plagiarism check results</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {reports.map((report) => (
          <div key={report.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-blue-600 dark:text-blue-400">
                    <FileText size={24} />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 dark:text-white">{report.document}</h3>
                    <p className="text-xs text-gray-500">{report.date}</p>
                  </div>
                </div>
                <button className="text-gray-400 hover:text-blue-600 transition-colors">
                  <Download size={20} />
                </button>
              </div>

              <div className="flex items-center gap-4 mb-2">
                <div className="flex-1">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600 dark:text-gray-400">Similarity Score</span>
                    <span className="font-bold text-gray-900 dark:text-white">{report.similarityScore}%</span>
                  </div>
                  <div className="h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full ${
                        report.similarityScore < 15 ? 'bg-green-500' : 
                        report.similarityScore < 30 ? 'bg-orange-500' : 'bg-red-500'
                      }`}
                      style={{ width: `${report.similarityScore}%` }}
                    ></div>
                  </div>
                </div>
                <div className={`px-3 py-1 rounded-lg text-xs font-bold whitespace-nowrap ${getStatusColor(report.similarityScore)}`}>
                  {getStatusText(report.similarityScore)}
                </div>
              </div>
            </div>

            <div className="p-6 bg-gray-50/50 dark:bg-gray-900/10">
              <h4 className="text-sm font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                <Info size={16} className="text-gray-400" />
                Flagged Sources
              </h4>
              <div className="space-y-3">
                {report.sources.map((source, idx) => (
                  <div key={idx} className="flex justify-between items-center text-sm p-2 bg-white dark:bg-gray-800 rounded border border-gray-100 dark:border-gray-700">
                    <span className="text-gray-600 dark:text-gray-300 truncate max-w-[80%]">{source.name}</span>
                    <span className="font-bold text-red-500">{source.match}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PlagiarismReport;
