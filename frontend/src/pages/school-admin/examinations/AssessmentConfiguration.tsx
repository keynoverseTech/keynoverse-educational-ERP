import React, { useState, useEffect } from 'react';
import { Save, AlertCircle, Percent, Clock, FileCheck, Building2, Users, GraduationCap, Settings } from 'lucide-react';
import { Skeleton } from '../../../components/ui/Skeleton';
import HallManagement from './HallManagement';
import OfficerAssignment from './OfficerAssignment';
import GradingSystem from './GradingSystem';

// --- Types ---

interface AssessmentConfig {
  caWeight: number;
  examWeight: number;
  minAttendancePercentage: number;
  maxCAMarks: number;
  maxExamMarks: number;
  submissionDeadlineDays: number;
  allowMakeupExams: boolean;
  requireModeration: boolean;
  publishAutomatically: boolean;
}

const AssessmentPolicy: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [config, setConfig] = useState<AssessmentConfig>({
    caWeight: 30,
    examWeight: 70,
    minAttendancePercentage: 75,
    maxCAMarks: 30,
    maxExamMarks: 70,
    submissionDeadlineDays: 14,
    allowMakeupExams: true,
    requireModeration: true,
    publishAutomatically: false
  });

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  const handleWeightChange = (type: 'ca' | 'exam', value: number) => {
    if (type === 'ca') {
      setConfig(prev => ({
        ...prev,
        caWeight: value,
        examWeight: 100 - value,
        maxCAMarks: value,
        maxExamMarks: 100 - value
      }));
    } else {
      setConfig(prev => ({
        ...prev,
        examWeight: value,
        caWeight: 100 - value,
        maxExamMarks: value,
        maxCAMarks: 100 - value
      }));
    }
  };

  const handleSave = () => {
    setSaving(true);
    setTimeout(() => setSaving(false), 1500);
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-10 w-32" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Skeleton className="h-64 rounded-xl" />
          <Skeleton className="h-64 rounded-xl" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Assessment Policy</h2>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Manage global assessment policies and grade distribution (CA vs Exam).</p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors disabled:opacity-70"
        >
          <Save size={18} />
          {saving ? 'Saving...' : 'Save Configuration'}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                <Percent className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Score Distribution</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">Configure weight between Continuous Assessment and Final Exam.</p>
              </div>
            </div>

            <div className="space-y-8">
              <div>
                <div className="flex justify-between mb-2">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Continuous Assessment (CA)</label>
                  <span className="text-sm font-bold text-blue-600 dark:text-blue-400">{config.caWeight}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={config.caWeight}
                  onChange={(e) => handleWeightChange('ca', parseInt(e.target.value))}
                  className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-600"
                />
                <div className="flex justify-between mt-1">
                   <p className="text-xs text-gray-500">Includes tests, assignments, and practicals.</p>
                   <p className="text-xs font-medium text-gray-900 dark:text-white">Max Marks: {config.maxCAMarks}</p>
                </div>
              </div>

              <div>
                <div className="flex justify-between mb-2">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Final Examination</label>
                  <span className="text-sm font-bold text-purple-600 dark:text-purple-400">{config.examWeight}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={config.examWeight}
                  onChange={(e) => handleWeightChange('exam', parseInt(e.target.value))}
                  className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-purple-600"
                />
                <div className="flex justify-between mt-1">
                   <p className="text-xs text-gray-500">End of semester examination score.</p>
                   <p className="text-xs font-medium text-gray-900 dark:text-white">Max Marks: {config.maxExamMarks}</p>
                </div>
              </div>

              <div className="p-4 bg-yellow-50 dark:bg-yellow-900/10 border border-yellow-200 dark:border-yellow-800 rounded-lg flex gap-3">
                <AlertCircle className="w-5 h-5 text-yellow-600 dark:text-yellow-500 shrink-0" />
                <p className="text-sm text-yellow-700 dark:text-yellow-400">
                  <strong>Note:</strong> Changes to weight distribution will apply to the active examination cycle. Ensure this matches your university's Senate-approved policy.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                <FileCheck className="w-5 h-5 text-green-600 dark:text-green-400" />
              </div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">General Policies</h2>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Minimum Attendance (%)
                </label>
                <input
                  type="number"
                  value={config.minAttendancePercentage}
                  onChange={(e) => setConfig({ ...config, minAttendancePercentage: parseInt(e.target.value) })}
                  className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <p className="text-xs text-gray-500 mt-1">Required to sit for exams.</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Grade Submission Deadline (Days)
                </label>
                <div className="relative">
                  <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="number"
                    value={config.submissionDeadlineDays}
                    onChange={(e) => setConfig({ ...config, submissionDeadlineDays: parseInt(e.target.value) })}
                    className="w-full pl-10 pr-3 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-gray-100 dark:border-gray-700 space-y-3">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={config.allowMakeupExams}
                    onChange={(e) => setConfig({ ...config, allowMakeupExams: e.target.checked })}
                    className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">Allow Make-up Exams</span>
                </label>

                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={config.requireModeration}
                    onChange={(e) => setConfig({ ...config, requireModeration: e.target.checked })}
                    className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">Require Result Moderation</span>
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const AssessmentConfiguration: React.FC = () => {
  const [activeTab, setActiveTab] = useState('policy');

  const tabs = [
    { id: 'policy', label: 'Assessment Policy', icon: Settings },
    { id: 'grading', label: 'Grading System', icon: GraduationCap },
    { id: 'halls', label: 'Halls & Venues', icon: Building2 },
    { id: 'officers', label: 'Exam Officers', icon: Users },
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Examination Configuration</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Manage all examination related settings, venues, and personnel.</p>
        </div>
      </div>

      <div className="border-b border-gray-200 dark:border-gray-700 overflow-x-auto">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2 ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                }`}
              >
                <Icon size={18} />
                {tab.label}
              </button>
            );
          })}
        </nav>
      </div>

      <div className="mt-6">
        {activeTab === 'policy' && <AssessmentPolicy />}
        {activeTab === 'grading' && <GradingSystem />}
        {activeTab === 'halls' && <HallManagement />}
        {activeTab === 'officers' && <OfficerAssignment />}
      </div>
    </div>
  );
};

export default AssessmentConfiguration;
