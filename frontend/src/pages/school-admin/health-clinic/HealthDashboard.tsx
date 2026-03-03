import React, { useState } from 'react';
import { 
  Activity, 
  Calendar, 
  Pill, 
  FileText, 
  User
} from 'lucide-react';
import ClinicOverview from './components/ClinicOverview';
import PatientIntake from './components/PatientIntake';
import PatientHistory from './components/PatientHistory';
import PharmacyRequest from './components/PharmacyRequest';
import CreatePatientProfile from './components/CreatePatientProfile';

const HealthDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'intake' | 'history' | 'pharmacy' | 'my-records' | 'create-profile'>('overview');

  // Filter tabs based on role
  const getVisibleTabs = () => {
    // Simplified since we are focusing on Admin/Staff view for now
    return [
      { id: 'overview', label: 'Dashboard', icon: Activity },
      { id: 'intake', label: 'Patient Intake', icon: User },
      { id: 'history', label: 'Patient History', icon: FileText },
      { id: 'pharmacy', label: 'Pharmacy Requests', icon: Pill },
    ];
  };

  const renderMyRecords = () => (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl p-8 text-white shadow-xl">
        <h2 className="text-2xl font-bold mb-2">My Health Records</h2>
        <p className="text-blue-100 mb-6">View your medical history, upcoming appointments, and prescriptions.</p>
        <button className="bg-white text-blue-700 px-6 py-2.5 rounded-xl font-bold text-sm hover:bg-blue-50 transition-colors shadow-lg">
          Request Appointment
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-[#151e32] rounded-2xl border border-gray-100 dark:border-gray-800 p-6 shadow-sm">
          <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <Calendar className="text-blue-500" size={20} /> Past Visits
          </h3>
          <div className="space-y-4">
            {[1, 2].map((i) => (
              <div key={i} className="p-4 rounded-xl bg-gray-50 dark:bg-gray-900/50 border border-gray-100 dark:border-gray-800">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h4 className="font-bold text-gray-900 dark:text-white text-sm">General Checkup</h4>
                    <p className="text-xs text-gray-500">Dr. Sarah Wilson • 12 Oct 2023</p>
                  </div>
                  <span className="px-2 py-1 bg-green-100 text-green-700 text-[10px] font-bold uppercase rounded-lg">Completed</span>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-300">Routine health screening including BP and vision test.</p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white dark:bg-[#151e32] rounded-2xl border border-gray-100 dark:border-gray-800 p-6 shadow-sm">
          <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <Pill className="text-green-500" size={20} /> Active Prescriptions
          </h3>
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-green-50 dark:bg-green-900/10 border border-green-100 dark:border-green-900/30">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-bold text-gray-900 dark:text-white text-sm">Amoxicillin 500mg</h4>
                  <p className="text-xs text-gray-500">1 tablet every 8 hours</p>
                </div>
                <span className="text-xs font-bold text-green-600 bg-white dark:bg-gray-800 px-2 py-1 rounded border border-green-200 dark:border-green-800">5 Days left</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="p-6 max-w-[1600px] mx-auto space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
            <Activity className="text-red-500" />
            Health & Clinic Management
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Manage medical records, appointments, and dispensary for students and staff.</p>
        </div>
      </div>

      {/* Navigation Tabs */}
      {activeTab !== 'create-profile' && (
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex gap-1 bg-gray-100 dark:bg-gray-900/50 p-1.5 rounded-xl w-fit overflow-x-auto">
            {getVisibleTabs().map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 transition-all whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'bg-white dark:bg-[#151e32] text-gray-900 dark:text-white shadow-sm'
                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
                }`}
              >
                <tab.icon size={16} />
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Content Area */}
      <div className="min-h-[500px]">
        {activeTab === 'overview' && <ClinicOverview />}
        {activeTab === 'intake' && <PatientIntake />}
        {activeTab === 'history' && (
          <PatientHistory 
            onCreateProfile={() => setActiveTab('create-profile')} 
          />
        )}
        {activeTab === 'pharmacy' && <PharmacyRequest />}
        {activeTab === 'my-records' && renderMyRecords()}
        {activeTab === 'create-profile' && (
          <CreatePatientProfile 
            onCancel={() => setActiveTab('history')}
            onSave={(data) => {
              console.log('Saved:', data);
              setActiveTab('history');
            }}
          />
        )}
      </div>
    </div>
  );
};

export default HealthDashboard;
