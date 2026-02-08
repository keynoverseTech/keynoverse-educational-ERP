import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  User, 
  BookOpen, 
  Award, 
  CheckCircle, 
  XCircle, 
  Clock, 
  FileText,
  AlertTriangle,
  ChevronLeft,
  Mail,
  Phone,
  Calendar,
  MapPin
} from 'lucide-react';

interface Applicant {
  id: string;
  name: string;
  applicationNo: string;
  status: 'Pending' | 'Eligible' | 'Admitted' | 'Rejected';
  photoUrl?: string;
  personalInfo: {
    dob: string;
    gender: string;
    email: string;
    phone: string;
    address: string;
    stateOfOrigin: string;
    lga: string;
  };
  academicInfo: {
    utmeScore: number;
    utmeSubjects: string[];
    programmeApplied: string;
    faculty: string;
    entryLevel: number;
    previousSchool: string;
  };
  evaluation: {
    cutoff: number;
    isEligible: boolean;
  };
  admissionDetails?: {
    faculty: string;
    department: string;
    programme: string;
    level: number;
    year: string;
    matricNo?: string;
  };
}

// Mock data generator
const getMockApplicant = (id: string): Applicant => ({
  id,
  name: 'John Doe',
  applicationNo: '2024987654',
  status: 'Eligible',
  personalInfo: {
    dob: '2005-04-15',
    gender: 'Male',
    email: 'john.doe@example.com',
    phone: '+234 801 234 5678',
    address: '123 Lagos Street, Ikeja, Lagos',
    stateOfOrigin: 'Lagos',
    lga: 'Ikeja'
  },
  academicInfo: {
    utmeScore: 245,
    utmeSubjects: ['Use of English', 'Mathematics', 'Physics', 'Chemistry'],
    programmeApplied: 'Computer Science',
    faculty: 'Engineering',
    entryLevel: 100,
    previousSchool: 'Federal Government College, Lagos'
  },
  evaluation: {
    cutoff: 220,
    isEligible: true
  }
});

const ApplicantProfile: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [applicant, setApplicant] = useState<Applicant>(getMockApplicant(id || '1'));
  const [activeTab, setActiveTab] = useState<'personal' | 'academic' | 'evaluation'>('personal');
  const [isProcessing, setIsProcessing] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState<{ show: boolean, action: 'admit' | 'reject' | 'hold' | null }>({ show: false, action: null });
  const [decisionNotes, setDecisionNotes] = useState('');

  const handleDecision = (action: 'admit' | 'reject' | 'hold') => {
    setIsProcessing(true);
    // Simulate API call
    setTimeout(() => {
      let newStatus: Applicant['status'] = 'Pending';
      if (action === 'admit') newStatus = 'Admitted';
      else if (action === 'reject') newStatus = 'Rejected';
      else if (action === 'hold') newStatus = 'Pending';

      const updatedApplicant = { ...applicant, status: newStatus };
      
      if (action === 'admit') {
        updatedApplicant.admissionDetails = {
          faculty: applicant.academicInfo.faculty,
          department: 'Computer Science', // Simplified
          programme: applicant.academicInfo.programmeApplied,
          level: applicant.academicInfo.entryLevel,
          year: '2024/2025'
        };
      }

      setApplicant(updatedApplicant);
      setIsProcessing(false);
      setShowConfirmModal({ show: false, action: null });
    }, 1500);
  };

  const StatusBadge = ({ status }: { status: string }) => {
    const styles = {
      Admitted: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
      Eligible: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
      Pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
      Rejected: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
    };
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${styles[status as keyof typeof styles] || 'bg-gray-100 text-gray-800'}`}>
        {status}
      </span>
    );
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Back Button */}
      <button 
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
      >
        <ChevronLeft size={16} /> Back to Dashboard
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Profile Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Header Card */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex flex-col md:flex-row gap-6 items-start">
              <div className="w-24 h-24 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-gray-400 dark:text-gray-500 text-2xl font-bold border-4 border-white dark:border-gray-800 shadow-lg">
                {applicant.name.charAt(0)}
              </div>
              <div className="flex-1 space-y-2">
                <div className="flex items-start justify-between">
                  <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{applicant.name}</h1>
                    <p className="text-gray-500 dark:text-gray-400 font-mono text-sm">App No: {applicant.applicationNo}</p>
                  </div>
                  <StatusBadge status={applicant.status} />
                </div>
                
                {applicant.status === 'Admitted' && applicant.admissionDetails && (
                  <div className="mt-4 p-4 bg-green-50 dark:bg-green-900/10 rounded-lg border border-green-100 dark:border-green-800/30">
                    <h3 className="text-sm font-bold text-green-900 dark:text-green-300 mb-2 flex items-center gap-2">
                      <CheckCircle size={16} /> Admission Details
                    </h3>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-500 dark:text-gray-400">Faculty:</span>
                        <p className="font-medium text-gray-900 dark:text-white">{applicant.admissionDetails.faculty}</p>
                      </div>
                      <div>
                        <span className="text-gray-500 dark:text-gray-400">Department:</span>
                        <p className="font-medium text-gray-900 dark:text-white">{applicant.admissionDetails.department}</p>
                      </div>
                      <div>
                        <span className="text-gray-500 dark:text-gray-400">Programme:</span>
                        <p className="font-medium text-gray-900 dark:text-white">{applicant.admissionDetails.programme}</p>
                      </div>
                      <div>
                        <span className="text-gray-500 dark:text-gray-400">Level:</span>
                        <p className="font-medium text-gray-900 dark:text-white">{applicant.admissionDetails.level}</p>
                      </div>
                    </div>
                    <button className="mt-4 w-full py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-medium transition-colors shadow-sm">
                      Generate Admission Letter
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Profile Sections */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div className="border-b border-gray-200 dark:border-gray-700">
              <div className="flex space-x-1 p-1">
                <button 
                  onClick={() => setActiveTab('personal')}
                  className={`px-4 py-2.5 text-sm font-medium rounded-lg flex items-center gap-2 transition-colors ${
                    activeTab === 'personal' ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400' : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
                  }`}
                >
                  <User size={16} /> Personal Info
                </button>
                <button 
                  onClick={() => setActiveTab('academic')}
                  className={`px-4 py-2.5 text-sm font-medium rounded-lg flex items-center gap-2 transition-colors ${
                    activeTab === 'academic' ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400' : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
                  }`}
                >
                  <BookOpen size={16} /> Academic Info
                </button>
                <button 
                  onClick={() => setActiveTab('evaluation')}
                  className={`px-4 py-2.5 text-sm font-medium rounded-lg flex items-center gap-2 transition-colors ${
                    activeTab === 'evaluation' ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400' : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
                  }`}
                >
                  <Award size={16} /> Cut-Off Evaluation
                </button>
              </div>
            </div>

            <div className="p-6 min-h-[300px]">
              {activeTab === 'personal' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="font-medium text-gray-900 dark:text-white border-b border-gray-100 dark:border-gray-700 pb-2">Basic Details</h3>
                    <div className="space-y-3">
                      <div>
                        <span className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">Date of Birth</span>
                        <p className="text-gray-900 dark:text-white flex items-center gap-2"><Calendar size={14} className="text-gray-400" /> {applicant.personalInfo.dob}</p>
                      </div>
                      <div>
                        <span className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">Gender</span>
                        <p className="text-gray-900 dark:text-white">{applicant.personalInfo.gender}</p>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <h3 className="font-medium text-gray-900 dark:text-white border-b border-gray-100 dark:border-gray-700 pb-2">Contact</h3>
                    <div className="space-y-3">
                      <div>
                        <span className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">Email</span>
                        <p className="text-gray-900 dark:text-white flex items-center gap-2"><Mail size={14} className="text-gray-400" /> {applicant.personalInfo.email}</p>
                      </div>
                      <div>
                        <span className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">Phone</span>
                        <p className="text-gray-900 dark:text-white flex items-center gap-2"><Phone size={14} className="text-gray-400" /> {applicant.personalInfo.phone}</p>
                      </div>
                      <div>
                        <span className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">Address</span>
                        <p className="text-gray-900 dark:text-white flex items-center gap-2"><MapPin size={14} className="text-gray-400" /> {applicant.personalInfo.address}</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'academic' && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-gray-50 dark:bg-gray-900/50 p-4 rounded-lg border border-gray-100 dark:border-gray-800">
                      <span className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">UTME Score</span>
                      <p className="text-3xl font-bold text-gray-900 dark:text-white mt-1">{applicant.academicInfo.utmeScore}</p>
                    </div>
                    <div className="bg-gray-50 dark:bg-gray-900/50 p-4 rounded-lg border border-gray-100 dark:border-gray-800">
                      <span className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">Entry Level</span>
                      <p className="text-3xl font-bold text-gray-900 dark:text-white mt-1">{applicant.academicInfo.entryLevel}</p>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="font-medium text-gray-900 dark:text-white mb-3">UTME Subject Combination</h3>
                    <div className="flex flex-wrap gap-2">
                      {applicant.academicInfo.utmeSubjects.map((subject, index) => (
                        <span key={index} className="px-3 py-1 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-full text-sm text-gray-700 dark:text-gray-300">
                          {subject}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="font-medium text-gray-900 dark:text-white mb-2">Previous Education</h3>
                    <p className="text-gray-700 dark:text-gray-300">{applicant.academicInfo.previousSchool}</p>
                  </div>
                </div>
              )}

              {activeTab === 'evaluation' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-900/50 rounded-lg border border-gray-100 dark:border-gray-800">
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Programme Cut-Off</p>
                      <p className="text-xl font-bold text-gray-900 dark:text-white">{applicant.evaluation.cutoff}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-500 dark:text-gray-400">Applicant Score</p>
                      <p className={`text-xl font-bold ${applicant.academicInfo.utmeScore >= applicant.evaluation.cutoff ? 'text-green-600' : 'text-red-600'}`}>
                        {applicant.academicInfo.utmeScore}
                      </p>
                    </div>
                  </div>

                  <div className={`p-4 rounded-lg flex items-start gap-3 ${applicant.evaluation.isEligible ? 'bg-green-50 text-green-800 dark:bg-green-900/20 dark:text-green-300' : 'bg-red-50 text-red-800 dark:bg-red-900/20 dark:text-red-300'}`}>
                    {applicant.evaluation.isEligible ? <CheckCircle className="mt-0.5" /> : <AlertTriangle className="mt-0.5" />}
                    <div>
                      <h4 className="font-bold">Eligibility Result: {applicant.evaluation.isEligible ? 'Meets Requirement' : 'Below Cut-Off'}</h4>
                      <p className="text-sm mt-1 opacity-90">
                        {applicant.evaluation.isEligible 
                          ? 'Applicant has met the minimum UTME score requirement for this programme.' 
                          : 'Applicant score is below the required cut-off mark. Admission may require special approval.'}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Decision Panel */}
        <div className="lg:col-span-1">
          <div className="sticky top-6 space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <h3 className="font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <FileText size={18} /> Decision Panel
              </h3>
              
              <div className="space-y-4">
                <textarea 
                  placeholder="Add decision notes (optional)..."
                  value={decisionNotes}
                  onChange={(e) => setDecisionNotes(e.target.value)}
                  disabled={applicant.status === 'Admitted' || applicant.status === 'Rejected'}
                  rows={4}
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none resize-none disabled:opacity-50"
                />

                {applicant.status !== 'Admitted' && applicant.status !== 'Rejected' ? (
                  <div className="space-y-3">
                    <button 
                      onClick={() => setShowConfirmModal({ show: true, action: 'admit' })}
                      className="w-full py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors shadow-sm flex items-center justify-center gap-2"
                    >
                      <CheckCircle size={18} /> Admit Student
                    </button>
                    <button 
                      onClick={() => setShowConfirmModal({ show: true, action: 'reject' })}
                      className="w-full py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors shadow-sm flex items-center justify-center gap-2"
                    >
                      <XCircle size={18} /> Reject Application
                    </button>
                    <button 
                      onClick={() => setShowConfirmModal({ show: true, action: 'hold' })}
                      className="w-full py-2.5 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg font-medium transition-colors shadow-sm flex items-center justify-center gap-2"
                    >
                      <Clock size={18} /> Hold for Review
                    </button>
                  </div>
                ) : (
                  <div className="text-center p-4 bg-gray-50 dark:bg-gray-900/50 rounded-lg border border-gray-100 dark:border-gray-800">
                    <p className="text-gray-500 dark:text-gray-400">Decision has been finalized.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      {showConfirmModal.show && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-sm w-full p-6 animate-in fade-in zoom-in duration-200">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Confirm Action</h3>
            <p className="text-gray-500 dark:text-gray-400 mb-6">
              Are you sure you want to <span className="font-bold">{showConfirmModal.action}</span> this applicant?
              {showConfirmModal.action === 'admit' && ' This will generate an admission record.'}
              {showConfirmModal.action === 'reject' && ' This action cannot be easily undone.'}
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
                className={`flex-1 py-2 text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2 ${
                  showConfirmModal.action === 'admit' ? 'bg-green-600 hover:bg-green-700' :
                  showConfirmModal.action === 'reject' ? 'bg-red-600 hover:bg-red-700' :
                  'bg-yellow-500 hover:bg-yellow-600'
                }`}
              >
                {isProcessing ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : 'Confirm'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ApplicantProfile;
