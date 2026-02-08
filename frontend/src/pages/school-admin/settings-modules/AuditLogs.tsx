import React, { useState } from 'react';
import { 
  Search, 
  Filter, 
  Eye, 
  X, 
  ShieldAlert, 
  CheckCircle, 
  XCircle, 
  MapPin, 
  Smartphone,
  AlertTriangle,
  FileText,
  Activity
} from 'lucide-react';

interface AuditLog {
  id: string;
  dateTime: string;
  user: {
    name: string;
    id: string;
    role: string;
  };
  module: string;
  action: string;
  target: string;
  ipAddress: string;
  status: 'success' | 'failed';
  details: {
    oldValue?: string;
    newValue?: string;
    device: string;
    location: string;
  };
}

const AuditLogs: React.FC = () => {
  const [selectedLog, setSelectedLog] = useState<AuditLog | null>(null);

  // Mock Data
  const logs: AuditLog[] = [
    {
      id: 'LOG-001',
      dateTime: '2024-03-15 14:30:22',
      user: { name: 'Dr. Sarah Johnson', id: 'STF/2021/001', role: 'Staff' },
      module: 'Result Processing',
      action: 'Changed Course Score',
      target: 'MAT2021/1234 (CSC 201)',
      ipAddress: '192.168.1.45',
      status: 'success',
      details: {
        oldValue: '45',
        newValue: '67',
        device: 'Chrome / Windows 11',
        location: 'Lagos, Nigeria'
      }
    },
    {
      id: 'LOG-002',
      dateTime: '2024-03-15 11:42:10',
      user: { name: 'Admin User', id: 'ADM/001', role: 'Institution Admin' },
      module: 'Admission',
      action: 'Approved Admission',
      target: 'APP/2024/5567',
      ipAddress: '10.0.0.5',
      status: 'success',
      details: {
        oldValue: 'Pending',
        newValue: 'Admitted',
        device: 'Firefox / MacOS',
        location: 'Abuja, Nigeria'
      }
    },
    {
      id: 'LOG-003',
      dateTime: '2024-03-15 09:15:00',
      user: { name: 'Unknown', id: 'N/A', role: 'Guest' },
      module: 'Authentication',
      action: 'Failed Login Attempt',
      target: 'System Access',
      ipAddress: '45.23.12.89',
      status: 'failed',
      details: {
        device: 'Unknown / Linux',
        location: 'Moscow, Russia'
      }
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header Warning */}
      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 p-4 rounded-lg flex items-center justify-between">
        <div className="flex items-center gap-3">
          <ShieldAlert className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          <div>
            <h3 className="font-semibold text-blue-900 dark:text-blue-100">System Protected Logs</h3>
            <p className="text-xs text-blue-700 dark:text-blue-300">Audit records cannot be modified or deleted.</p>
          </div>
        </div>
        <div className="px-3 py-1 bg-blue-100 dark:bg-blue-800 text-blue-700 dark:text-blue-200 text-xs font-medium rounded-full">
          Read Only
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-[#151e32] p-4 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <Activity className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            </div>
            <span className="text-sm text-gray-500 dark:text-gray-400">Total Activities</span>
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">1,245</p>
          <p className="text-xs text-green-600 mt-1">Today</p>
        </div>

        <div className="bg-white dark:bg-[#151e32] p-4 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
              <AlertTriangle className="w-4 h-4 text-orange-600 dark:text-orange-400" />
            </div>
            <span className="text-sm text-gray-500 dark:text-gray-400">Failed Logins</span>
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">12</p>
          <p className="text-xs text-orange-600 mt-1">Attention needed</p>
        </div>

        <div className="bg-white dark:bg-[#151e32] p-4 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
              <FileText className="w-4 h-4 text-purple-600 dark:text-purple-400" />
            </div>
            <span className="text-sm text-gray-500 dark:text-gray-400">Data Changes</span>
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">89</p>
          <p className="text-xs text-gray-500 mt-1">Normal volume</p>
        </div>

        <div className="bg-white dark:bg-[#151e32] p-4 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-red-50 dark:bg-red-900/20 rounded-lg">
              <ShieldAlert className="w-4 h-4 text-red-600 dark:text-red-400" />
            </div>
            <span className="text-sm text-gray-500 dark:text-gray-400">Suspicious</span>
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">2</p>
          <p className="text-xs text-red-600 mt-1">Requires review</p>
        </div>
      </div>

      {/* Filter Panel */}
      <div className="bg-white dark:bg-[#151e32] p-4 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800">
        <div className="flex items-center gap-2 mb-4 text-sm font-medium text-gray-700 dark:text-gray-300">
          <Filter className="w-4 h-4" />
          <span>Filter Logs</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-6 gap-3">
          <input type="date" className="px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-sm" />
          <input type="date" className="px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-sm" />
          <select className="px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-sm">
            <option value="">All Users</option>
          </select>
          <select className="px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-sm">
            <option value="">All Modules</option>
            <option value="results">Result Processing</option>
            <option value="admissions">Admissions</option>
          </select>
          <select className="px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-sm">
            <option value="">Status</option>
            <option value="success">Success</option>
            <option value="failed">Failed</option>
          </select>
          <button className="bg-blue-600 text-white rounded-lg px-4 py-2 text-sm font-medium hover:bg-blue-700 flex items-center justify-center gap-2">
            <Search className="w-4 h-4" />
            Search
          </button>
        </div>
      </div>

      {/* Activity Table */}
      <div className="bg-white dark:bg-[#151e32] rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50 dark:bg-gray-800 text-gray-500 dark:text-gray-400">
              <tr>
                <th className="px-6 py-3 font-medium">Date & Time</th>
                <th className="px-6 py-3 font-medium">User</th>
                <th className="px-6 py-3 font-medium">Role</th>
                <th className="px-6 py-3 font-medium">Module</th>
                <th className="px-6 py-3 font-medium">Action</th>
                <th className="px-6 py-3 font-medium">Target</th>
                <th className="px-6 py-3 font-medium">IP Address</th>
                <th className="px-6 py-3 font-medium">Status</th>
                <th className="px-6 py-3 font-medium">View</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {logs.map((log) => (
                <tr key={log.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                  <td className="px-6 py-4 text-gray-500 dark:text-gray-400 whitespace-nowrap">{log.dateTime}</td>
                  <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">{log.user.name}</td>
                  <td className="px-6 py-4 text-gray-500 dark:text-gray-400">{log.user.role}</td>
                  <td className="px-6 py-4 text-gray-500 dark:text-gray-400">{log.module}</td>
                  <td className="px-6 py-4 text-gray-900 dark:text-white">{log.action}</td>
                  <td className="px-6 py-4 text-gray-500 dark:text-gray-400">{log.target}</td>
                  <td className="px-6 py-4 text-gray-500 dark:text-gray-400 font-mono text-xs">{log.ipAddress}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      log.status === 'success' 
                        ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                        : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                    }`}>
                      {log.status === 'success' ? <CheckCircle className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                      {log.status === 'success' ? 'Success' : 'Failed'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <button 
                      onClick={() => setSelectedLog(log)}
                      className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Details Drawer */}
      {selectedLog && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" onClick={() => setSelectedLog(null)} />
          <div className="relative w-full max-w-md bg-white dark:bg-[#151e32] shadow-2xl h-full overflow-y-auto border-l border-gray-200 dark:border-gray-800">
            <div className="p-6">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">Log Details</h2>
                <button 
                  onClick={() => setSelectedLog(null)}
                  className="p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-6">
                <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Log ID</span>
                    <span className="text-sm font-mono font-medium text-gray-900 dark:text-white">{selectedLog.id}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Date & Time</span>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">{selectedLog.dateTime}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">Status</span>
                    <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium ${
                      selectedLog.status === 'success' 
                        ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                        : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                    }`}>
                      {selectedLog.status.toUpperCase()}
                    </span>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-3">User Information</h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 text-xs font-bold">
                        {selectedLog.user.name.charAt(0)}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">{selectedLog.user.name}</p>
                        <p className="text-xs text-gray-500">{selectedLog.user.id} • {selectedLog.user.role}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-3">Action Details</h3>
                  <div className="space-y-4 border-l-2 border-gray-200 dark:border-gray-800 pl-4">
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Action Type</p>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">{selectedLog.action}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Module Affected</p>
                      <p className="text-sm text-gray-900 dark:text-white">{selectedLog.module}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Target Record</p>
                      <p className="text-sm text-gray-900 dark:text-white">{selectedLog.target}</p>
                    </div>
                  </div>
                </div>

                {(selectedLog.details.oldValue || selectedLog.details.newValue) && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-3">Data Changes</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-3 bg-red-50 dark:bg-red-900/10 rounded-lg border border-red-100 dark:border-red-900/30">
                        <p className="text-xs text-red-600 dark:text-red-400 mb-1">Old Value</p>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">{selectedLog.details.oldValue}</p>
                      </div>
                      <div className="p-3 bg-green-50 dark:bg-green-900/10 rounded-lg border border-green-100 dark:border-green-900/30">
                        <p className="text-xs text-green-600 dark:text-green-400 mb-1">New Value</p>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">{selectedLog.details.newValue}</p>
                      </div>
                    </div>
                  </div>
                )}

                <div>
                  <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-3">Technical Details</h3>
                  <div className="grid grid-cols-1 gap-3">
                    <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400">
                      <MapPin className="w-4 h-4" />
                      <span>{selectedLog.details.location}</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400">
                      <Smartphone className="w-4 h-4" />
                      <span>{selectedLog.details.device}</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400">
                      <Globe className="w-4 h-4" />
                      <span className="font-mono text-xs">{selectedLog.ipAddress}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Helper icon
import { Globe } from 'lucide-react';

export default AuditLogs;