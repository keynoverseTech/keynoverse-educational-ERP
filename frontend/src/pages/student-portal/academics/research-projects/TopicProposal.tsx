import { useState } from 'react';
import { 
  Upload, 
  CheckCircle, 
  AlertCircle, 
  Clock,
  ArrowLeft
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const TopicProposal = () => {
  const navigate = useNavigate();
  const [file, setFile] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const status = 'pending'; // 'pending', 'approved', 'rejected', 'revision_required'

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return (
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 flex items-center gap-1">
            <CheckCircle size={12} /> Approved
          </span>
        );
      case 'rejected':
        return (
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 flex items-center gap-1">
            <AlertCircle size={12} /> Rejected
          </span>
        );
      case 'revision_required':
        return (
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400 flex items-center gap-1">
            <Clock size={12} /> Revision Required
          </span>
        );
      default:
        return (
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 flex items-center gap-1">
            <Clock size={12} /> Pending Review
          </span>
        );
    }
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
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Topic Proposal</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">Submit your research topic for approval</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6">Proposal Form</h3>
            <form className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Project Title
                </label>
                <input 
                  type="text" 
                  placeholder="Enter your proposed project title"
                  className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Research Area
                </label>
                <select className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all">
                  <option value="">Select Research Area</option>
                  <option value="ai">Artificial Intelligence</option>
                  <option value="cybersecurity">Cybersecurity</option>
                  <option value="software_engineering">Software Engineering</option>
                  <option value="data_science">Data Science</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Abstract
                </label>
                <textarea 
                  rows={6}
                  placeholder="Brief summary of your proposed research..."
                  className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Keywords
                </label>
                <input 
                  type="text" 
                  placeholder="e.g. Machine Learning, Healthcare, Python (comma separated)"
                  className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Proposal Document (PDF)
                </label>
                <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl p-8 text-center hover:border-blue-500 dark:hover:border-blue-400 transition-colors cursor-pointer bg-gray-50 dark:bg-gray-900/50">
                  <input 
                    type="file" 
                    id="proposal-upload" 
                    className="hidden" 
                    accept=".pdf"
                    onChange={handleFileChange}
                  />
                  <label htmlFor="proposal-upload" className="cursor-pointer">
                    <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Upload size={24} />
                    </div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white mb-1">
                      {file ? file.name : 'Click to upload or drag and drop'}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      PDF only (Max. 5MB)
                    </p>
                  </label>
                </div>
              </div>

              <div className="flex justify-end pt-4">
                <button 
                  type="button"
                  className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
                >
                  Submit Proposal
                </button>
              </div>
            </form>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Submission Status</h3>
            <div className="flex justify-between items-center mb-4">
              <span className="text-sm text-gray-500 dark:text-gray-400">Current Status</span>
              {getStatusBadge(status)}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-300 bg-gray-50 dark:bg-gray-900 p-4 rounded-lg border border-gray-100 dark:border-gray-800">
              <p className="font-medium mb-1">Reviewer Comments:</p>
              <p className="italic text-gray-500">
                "Please expand on the methodology section. The current proposal lacks specific details on data collection methods."
              </p>
            </div>
          </div>

          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-6 border border-blue-100 dark:border-blue-800">
            <h4 className="font-bold text-blue-900 dark:text-blue-100 mb-2 flex items-center gap-2">
              <AlertCircle size={18} />
              Guidelines
            </h4>
            <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-2 list-disc list-inside">
              <li>Abstract should not exceed 300 words.</li>
              <li>Include at least 5 relevant keywords.</li>
              <li>Ensure your topic aligns with your department's research focus.</li>
              <li>Upload only PDF format.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopicProposal;
