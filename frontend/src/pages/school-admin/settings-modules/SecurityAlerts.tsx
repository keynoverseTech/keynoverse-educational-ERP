import React from 'react';
import { 
  AlertTriangle, 
  ShieldAlert, 
  Lock, 
  UserX, 
  RefreshCw,
  Globe,
  Clock
} from 'lucide-react';

const SecurityAlerts: React.FC = () => {
  const alerts = [
    {
      id: 1,
      severity: 'critical',
      title: 'Massive Result Modification Detected',
      description: 'User "Lecturer A" modified 300 result records within 5 minutes. This is highly unusual behavior.',
      time: '10 minutes ago',
      user: 'Dr. Sarah Johnson',
      location: 'Lagos, Nigeria'
    },
    {
      id: 2,
      severity: 'high',
      title: 'Multiple Failed Login Attempts',
      description: '15 failed login attempts detected from IP 45.23.12.89 within 2 minutes.',
      time: '25 minutes ago',
      user: 'Unknown (Target: Admin)',
      location: 'Moscow, Russia'
    },
    {
      id: 3,
      severity: 'medium',
      title: 'Login from New Country',
      description: 'User logged in from a new location (London, UK) for the first time.',
      time: '1 hour ago',
      user: 'Bursar',
      location: 'London, UK'
    },
    {
      id: 4,
      severity: 'medium',
      title: 'Midnight Result Upload',
      description: 'Results uploaded outside of normal working hours (2:30 AM).',
      time: '5 hours ago',
      user: 'Exam Officer',
      location: 'Lagos, Nigeria'
    }
  ];

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300 border-red-200 dark:border-red-800';
      case 'high': return 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300 border-orange-200 dark:border-orange-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300 border-yellow-200 dark:border-yellow-800';
      default: return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 border-blue-200 dark:border-blue-800';
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'critical': return <ShieldAlert className="w-5 h-5" />;
      case 'high': return <AlertTriangle className="w-5 h-5" />;
      default: return <AlertTriangle className="w-5 h-5" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Active Security Alerts</h2>
          <p className="text-sm text-gray-500">Real-time monitoring of suspicious system activities.</p>
        </div>
        <div className="flex gap-2">
          <span className="flex items-center gap-2 px-3 py-1 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 rounded-full text-xs font-medium">
            <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
            1 Critical
          </span>
          <span className="flex items-center gap-2 px-3 py-1 bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400 rounded-full text-xs font-medium">
            <span className="w-2 h-2 bg-orange-500 rounded-full" />
            1 High
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {alerts.map((alert) => (
          <div key={alert.id} className={`p-6 rounded-xl border-l-4 shadow-sm bg-white dark:bg-[#151e32] ${
            alert.severity === 'critical' ? 'border-l-red-500' : 
            alert.severity === 'high' ? 'border-l-orange-500' : 
            'border-l-yellow-500'
          }`}>
            <div className="flex flex-col md:flex-row gap-6">
              <div className="flex-1">
                <div className="flex items-start gap-3">
                  <div className={`p-2 rounded-lg ${getSeverityColor(alert.severity)}`}>
                    {getSeverityIcon(alert.severity)}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white text-base">{alert.title}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">{alert.description}</p>
                    
                    <div className="flex flex-wrap gap-4 mt-3 text-xs text-gray-500">
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5" />
                        {alert.time}
                      </div>
                      <div className="flex items-center gap-1.5">
                        <UserX className="w-3.5 h-3.5" />
                        {alert.user}
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Globe className="w-3.5 h-3.5" />
                        {alert.location}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex md:flex-col gap-2 justify-center border-t md:border-t-0 md:border-l border-gray-100 dark:border-gray-800 pt-4 md:pt-0 md:pl-6">
                <button className="flex items-center justify-center gap-2 px-4 py-2 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg text-sm font-medium hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors">
                  <UserX className="w-4 h-4" />
                  Suspend User
                </button>
                <button className="flex items-center justify-center gap-2 px-4 py-2 bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg text-sm font-medium hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                  <Lock className="w-4 h-4" />
                  Lock Account
                </button>
                <button className="flex items-center justify-center gap-2 px-4 py-2 bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg text-sm font-medium hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                  <RefreshCw className="w-4 h-4" />
                  Force Reset
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SecurityAlerts;