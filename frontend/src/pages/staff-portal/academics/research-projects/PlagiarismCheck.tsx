import { useState } from 'react';
import { 
  Upload, 
  CheckCircle, 
  AlertTriangle, 
  RefreshCw 
} from 'lucide-react';

const PlagiarismCheck = () => {
  const [checking, setChecking] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleCheck = () => {
    setChecking(true);
    setTimeout(() => {
      setChecking(false);
      setResult({
        similarity: 12,
        sources: [
          { name: 'Wikipedia', match: '5%' },
          { name: 'ResearchGate', match: '3%' },
          { name: 'University Archive', match: '4%' }
        ],
        status: 'Safe'
      });
    }, 2000);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 p-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Plagiarism Checker</h1>
        <p className="text-gray-500 dark:text-gray-400">
          Upload a document or select a submission to check for similarity against our academic database.
        </p>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-dashed border-gray-300 dark:border-gray-700 p-8 text-center hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors cursor-pointer group">
        <div className="w-16 h-16 bg-blue-50 dark:bg-blue-900/20 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
          <Upload size={32} className="text-blue-600 dark:text-blue-400" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 dark:text-white">Drag & Drop or Click to Upload</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Supported formats: PDF, DOCX, TXT</p>
      </div>

      <div className="flex items-center justify-center my-6">
        <span className="text-gray-400 text-sm uppercase font-semibold tracking-wider">OR</span>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Select Recent Submission</h3>
        <select className="w-full p-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none">
          <option>John Doe - AI in Healthcare (Chapter 2)</option>
          <option>Jane Smith - Sustainable Energy (Proposal)</option>
        </select>
        
        <button 
          onClick={handleCheck}
          disabled={checking}
          className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
        >
          {checking ? (
            <>
              <RefreshCw className="animate-spin" size={20} />
              Running Analysis...
            </>
          ) : (
            'Run Check'
          )}
        </button>
      </div>

      {result && (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-green-100 dark:border-green-900 p-6 animate-fade-in">
          <div className="flex items-center gap-4 mb-6">
            <div className={`p-3 rounded-full ${result.similarity < 15 ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
              {result.similarity < 15 ? <CheckCircle size={32} /> : <AlertTriangle size={32} />}
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">Analysis Complete</h3>
              <p className="text-gray-500 dark:text-gray-400">
                Similarity Score: <span className={`font-bold ${result.similarity < 15 ? 'text-green-600' : 'text-red-600'}`}>{result.similarity}%</span>
              </p>
            </div>
          </div>
          
          <div className="space-y-3">
            <h4 className="font-semibold text-sm text-gray-500 uppercase">Matched Sources</h4>
            {result.sources.map((source: any, idx: number) => (
              <div key={idx} className="flex justify-between p-3 bg-gray-50 dark:bg-gray-900/50 rounded-lg">
                <span className="text-gray-700 dark:text-gray-300">{source.name}</span>
                <span className="font-medium text-red-500">{source.match}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default PlagiarismCheck;
