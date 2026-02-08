import React, { useState } from 'react';
import { Save, Globe, Lock, Layout, ExternalLink, RefreshCw } from 'lucide-react';

const PortalSettings = () => {
  const [staffDomain, setStaffDomain] = useState('staff.university.edu');
  const [studentDomain, setStudentDomain] = useState('student.university.edu');
  const [isEditing, setIsEditing] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle');

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaveStatus('saving');
    // Simulate API call
    setTimeout(() => {
      setSaveStatus('saved');
      setIsEditing(false);
      setTimeout(() => setSaveStatus('idle'), 2000);
    }, 1500);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Portal Configuration</h1>
          <p className="text-gray-500 dark:text-gray-400">Manage custom domains and access settings for staff and student portals</p>
        </div>
        <button
          onClick={() => setIsEditing(!isEditing)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
        >
          {isEditing ? 'Cancel Editing' : 'Edit Configuration'}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Student Portal Settings */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg text-blue-600 dark:text-blue-400">
                <Layout size={20} />
              </div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Student Portal</h2>
            </div>
            <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-700 rounded-full dark:bg-green-900/30 dark:text-green-400">
              Active
            </span>
          </div>
          
          <div className="p-6 space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Custom Domain
              </label>
              <div className="flex rounded-lg shadow-sm">
                <span className="inline-flex items-center px-3 rounded-l-lg border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-gray-400">
                  https://
                </span>
                <input
                  type="text"
                  value={studentDomain}
                  onChange={(e) => setStudentDomain(e.target.value)}
                  disabled={!isEditing}
                  className="flex-1 block w-full min-w-0 rounded-none rounded-r-lg border-gray-300 px-3 py-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white disabled:bg-gray-100 dark:disabled:bg-gray-800 disabled:text-gray-500"
                />
              </div>
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                The primary URL where students will access their dashboard.
              </p>
            </div>

            <div className="flex items-center justify-between py-3 border-t border-gray-100 dark:border-gray-700">
              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                <Globe size={16} />
                <span>DNS Status</span>
              </div>
              <span className="flex items-center gap-1 text-sm text-green-600 dark:text-green-400">
                <div className="w-2 h-2 rounded-full bg-green-500"></div>
                Verified
              </span>
            </div>

            <div className="flex items-center justify-between py-3 border-t border-gray-100 dark:border-gray-700">
              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                <Lock size={16} />
                <span>SSL Certificate</span>
              </div>
              <span className="flex items-center gap-1 text-sm text-green-600 dark:text-green-400">
                <div className="w-2 h-2 rounded-full bg-green-500"></div>
                Active (Auto-renew)
              </span>
            </div>

            {isEditing && (
              <div className="pt-4">
                 <button className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 flex items-center gap-1">
                   <ExternalLink size={14} />
                   Advanced DNS Settings
                 </button>
              </div>
            )}
          </div>
        </div>

        {/* Staff Portal Settings */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg text-purple-600 dark:text-purple-400">
                <Layout size={20} />
              </div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Staff Portal</h2>
            </div>
            <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-700 rounded-full dark:bg-green-900/30 dark:text-green-400">
              Active
            </span>
          </div>
          
          <div className="p-6 space-y-6">
             <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Custom Domain
              </label>
              <div className="flex rounded-lg shadow-sm">
                <span className="inline-flex items-center px-3 rounded-l-lg border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-gray-400">
                  https://
                </span>
                <input
                  type="text"
                  value={staffDomain}
                  onChange={(e) => setStaffDomain(e.target.value)}
                  disabled={!isEditing}
                  className="flex-1 block w-full min-w-0 rounded-none rounded-r-lg border-gray-300 px-3 py-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white disabled:bg-gray-100 dark:disabled:bg-gray-800 disabled:text-gray-500"
                />
              </div>
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                The primary URL where staff will access their dashboard.
              </p>
            </div>

            <div className="flex items-center justify-between py-3 border-t border-gray-100 dark:border-gray-700">
              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                <Globe size={16} />
                <span>DNS Status</span>
              </div>
              <span className="flex items-center gap-1 text-sm text-green-600 dark:text-green-400">
                <div className="w-2 h-2 rounded-full bg-green-500"></div>
                Verified
              </span>
            </div>

            <div className="flex items-center justify-between py-3 border-t border-gray-100 dark:border-gray-700">
              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                <Lock size={16} />
                <span>SSL Certificate</span>
              </div>
              <span className="flex items-center gap-1 text-sm text-green-600 dark:text-green-400">
                <div className="w-2 h-2 rounded-full bg-green-500"></div>
                Active (Auto-renew)
              </span>
            </div>

            {isEditing && (
              <div className="pt-4">
                 <button className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 flex items-center gap-1">
                   <ExternalLink size={14} />
                   Advanced DNS Settings
                 </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {isEditing && (
        <div className="flex justify-end pt-6 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={handleSave}
            disabled={saveStatus === 'saving'}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saveStatus === 'saving' ? (
              <>
                <RefreshCw size={18} className="animate-spin" />
                Saving Changes...
              </>
            ) : (
              <>
                <Save size={18} />
                Save Configuration
              </>
            )}
          </button>
        </div>
      )}

      {saveStatus === 'saved' && (
        <div className="fixed bottom-6 right-6 bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-2 animate-bounce">
          <Save size={18} />
          Configuration Saved Successfully!
        </div>
      )}
    </div>
  );
};

export default PortalSettings;
