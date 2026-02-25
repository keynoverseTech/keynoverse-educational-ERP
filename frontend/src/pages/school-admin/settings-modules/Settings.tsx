import React, { useState } from 'react';
import { 
  Building2, 
  Shield, 
  Bell, 
  Globe, 
  Save,
  Mail,
  GraduationCap,
  School,
  Lock,
  Smartphone,
  Upload,
  Image as ImageIcon,
  ArrowLeft,
  ChevronRight,
  History,
  ShieldAlert
} from 'lucide-react';
import AuditLogs from './AuditLogs';
import RecordHistory from './RecordHistory';
import SecurityAlerts from './SecurityAlerts';
import PortalSettings from './PortalSettings';

const Settings: React.FC = () => {
  const [activeTab, setActiveTab] = useState('general');
  const [loading, setLoading] = useState(false);
  const [securityView, setSecurityView] = useState('overview'); // overview, audit, history, alerts

  const handleSave = () => {
    setLoading(true);
    setTimeout(() => setLoading(false), 1500);
  };

  const tabs = [
    { id: 'general', label: 'General Info', icon: Building2 },
    { id: 'academics', label: 'Academics', icon: GraduationCap },
    { id: 'security', label: 'Security & Compliance', icon: Shield },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'portal', label: 'Portal & Domain', icon: Globe },
  ];

  const renderGeneral = () => (
    <div className="space-y-8">
      {/* Logo Uploader */}
      <div className="space-y-4">
        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Institution Logo</label>
        <div className="flex flex-col md:flex-row gap-6 items-start">
          <div className="w-32 h-32 bg-gray-100 dark:bg-gray-800 rounded-xl flex items-center justify-center border-2 border-dashed border-gray-300 dark:border-gray-700 overflow-hidden relative group">
            <ImageIcon className="w-8 h-8 text-gray-400 group-hover:scale-110 transition-transform" />
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
              <span className="text-white text-xs font-medium">Change</span>
            </div>
          </div>
          <div className="flex-1 space-y-3">
            <div className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-xl p-6 flex flex-col items-center justify-center text-center hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/10 transition-all cursor-pointer">
              <Upload className="w-8 h-8 text-blue-500 mb-2" />
              <p className="text-sm font-medium text-gray-900 dark:text-white">Click to upload or drag and drop</p>
              <p className="text-xs text-gray-500 mt-1">SVG, PNG, JPG or GIF (max. 800x400px)</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border-t border-gray-200 dark:border-gray-800 pt-8">
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Institution Name</label>
          <input 
            type="text" 
            defaultValue="Keynoverse University"
            className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Official Email</label>
          <input 
            type="email" 
            defaultValue="admin@keynoverse.edu"
            className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Phone Number</label>
          <input 
            type="tel" 
            defaultValue="+234 800 123 4567"
            className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Website</label>
          <input 
            type="url" 
            defaultValue="https://keynoverse.edu"
            className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>
        <div className="col-span-1 md:col-span-2 space-y-2">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Address</label>
          <textarea 
            rows={3}
            defaultValue="123 Education Lane, Tech City, Lagos, Nigeria"
            className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none resize-none"
          />
        </div>
      </div>
    </div>
  );

  const renderAcademics = () => (
    <div className="space-y-6">
      <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-100 dark:border-blue-800">
        <div className="flex items-start gap-3">
          <School className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5" />
          <div>
            <h4 className="text-sm font-semibold text-blue-900 dark:text-blue-100">Academic Configuration</h4>
            <p className="text-xs text-blue-700 dark:text-blue-300 mt-1">
              Global defaults for academic sessions and semesters. These affect the entire institution.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Current Session</label>
          <select className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none">
            <option>2024/2025</option>
            <option>2023/2024</option>
          </select>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Current Semester</label>
          <select className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none">
            <option>First Semester</option>
            <option>Second Semester</option>
          </select>
        </div>
      </div>
    </div>
  );

  const renderSecurity = () => {
    if (securityView === 'audit') {
      return (
        <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
          <button 
            onClick={() => setSecurityView('overview')} 
            className="flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-blue-600 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> 
            Back to Security Overview
          </button>
          <div className="pt-2">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg text-blue-600 dark:text-blue-400">
                <Shield className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Audit Log Dashboard</h2>
                <p className="text-gray-500 dark:text-gray-400">Monitor system activities and track user actions</p>
              </div>
            </div>
            <AuditLogs />
          </div>
        </div>
      );
    }

    if (securityView === 'history') {
      return (
        <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
          <button 
            onClick={() => setSecurityView('overview')} 
            className="flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-blue-600 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> 
            Back to Security Overview
          </button>
          <div className="pt-2">
             <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg text-purple-600 dark:text-purple-400">
                <History className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Record History</h2>
                <p className="text-gray-500 dark:text-gray-400">View timeline of changes for specific records</p>
              </div>
            </div>
            <RecordHistory />
          </div>
        </div>
      );
    }

    if (securityView === 'alerts') {
      return (
        <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
          <button 
            onClick={() => setSecurityView('overview')} 
            className="flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-blue-600 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> 
            Back to Security Overview
          </button>
          <div className="pt-2">
             <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-lg text-red-600 dark:text-red-400">
                <ShieldAlert className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Security Alerts</h2>
                <p className="text-gray-500 dark:text-gray-400">Active system warnings and threat detection</p>
              </div>
            </div>
            <SecurityAlerts />
          </div>
        </div>
      );
    }

    return (
      <div className="space-y-8 animate-in fade-in duration-500">
        {/* Modules Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <button 
            onClick={() => setSecurityView('audit')}
            className="p-6 text-left bg-gradient-to-br from-blue-50 to-white dark:from-blue-900/10 dark:to-[#151e32] border border-blue-100 dark:border-blue-900/30 rounded-xl hover:shadow-md transition-all group"
          >
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center text-blue-600 dark:text-blue-400 mb-4 group-hover:scale-110 transition-transform">
              <Shield className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">Audit Logs</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Track who did what. View detailed logs of all system activities.
            </p>
            <div className="mt-4 flex items-center text-xs font-medium text-blue-600 dark:text-blue-400">
              View Dashboard <ChevronRight className="w-3 h-3 ml-1 group-hover:translate-x-1 transition-transform" />
            </div>
          </button>

          <button 
            onClick={() => setSecurityView('history')}
            className="p-6 text-left bg-gradient-to-br from-purple-50 to-white dark:from-purple-900/10 dark:to-[#151e32] border border-purple-100 dark:border-purple-900/30 rounded-xl hover:shadow-md transition-all group"
          >
            <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center text-purple-600 dark:text-purple-400 mb-4 group-hover:scale-110 transition-transform">
              <History className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">Record History</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              See what changed. Timeline view of changes for specific records.
            </p>
            <div className="mt-4 flex items-center text-xs font-medium text-purple-600 dark:text-purple-400">
              Find Record <ChevronRight className="w-3 h-3 ml-1 group-hover:translate-x-1 transition-transform" />
            </div>
          </button>

          <button 
            onClick={() => setSecurityView('alerts')}
            className="p-6 text-left bg-gradient-to-br from-red-50 to-white dark:from-red-900/10 dark:to-[#151e32] border border-red-100 dark:border-red-900/30 rounded-xl hover:shadow-md transition-all group"
          >
            <div className="w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-lg flex items-center justify-center text-red-600 dark:text-red-400 mb-4 group-hover:scale-110 transition-transform">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">Security Alerts</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Threat detection. Monitor failed logins and suspicious activities.
            </p>
            <div className="mt-4 flex items-center text-xs font-medium text-red-600 dark:text-red-400">
              View Alerts <ChevronRight className="w-3 h-3 ml-1 group-hover:translate-x-1 transition-transform" />
            </div>
          </button>
        </div>

        {/* Existing Controls */}
        <div className="space-y-4 pt-6 border-t border-gray-200 dark:border-gray-800">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Access Control & Policies</h3>
          
          <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white dark:bg-gray-700 rounded-lg shadow-sm">
                <Lock className="w-5 h-5 text-gray-600 dark:text-gray-300" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">Password Policy</p>
                <p className="text-xs text-gray-500">Require strong passwords for all users</p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" defaultChecked className="sr-only peer" />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
            </label>
          </div>

          <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white dark:bg-gray-700 rounded-lg shadow-sm">
                <Smartphone className="w-5 h-5 text-gray-600 dark:text-gray-300" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">Two-Factor Authentication</p>
                <p className="text-xs text-gray-500">Enable 2FA for administrative accounts</p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
            </label>
          </div>
        </div>
      </div>
    );
  };

  const renderNotifications = () => (
    <div className="space-y-6">
       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">SMTP Host</label>
          <input 
            type="text" 
            placeholder="smtp.example.com"
            className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">SMTP Port</label>
          <input 
            type="text" 
            placeholder="587"
            className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>
       </div>
       <div className="flex items-center gap-2 p-4 bg-yellow-50 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-200 rounded-lg text-sm">
          <Mail className="w-4 h-4" />
          <span>SMS Gateway configuration requires API keys from your provider.</span>
       </div>
    </div>
  );

  const renderPortal = () => <PortalSettings />;

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Settings</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Manage institution preferences and configurations</p>
        </div>
        <button 
          onClick={handleSave}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
        >
          {loading ? (
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <Save className="w-4 h-4" />
          )}
          <span>Save Changes</span>
        </button>
      </div>

      <div className="bg-white dark:bg-[#151e32] rounded-2xl shadow-sm border border-gray-200 dark:border-gray-800 overflow-hidden">
        <div className="border-b border-gray-200 dark:border-gray-800">
          <div className="flex overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  if (tab.id !== 'security') setSecurityView('overview');
                }}
                className={`flex items-center gap-2 px-6 py-4 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                    : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div className="p-6">
          {activeTab === 'general' && renderGeneral()}
          {activeTab === 'academics' && renderAcademics()}
          {activeTab === 'security' && renderSecurity()}
          {activeTab === 'notifications' && renderNotifications()}
          {activeTab === 'portal' && renderPortal()}
        </div>
      </div>
    </div>
  );
};

export default Settings;
