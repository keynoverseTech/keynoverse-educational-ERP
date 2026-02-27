import React, { useState, useEffect } from 'react';
import { 
  Building2, 
  IdCard, 
  Shield, 
  Settings,
  LayoutGrid,
  Calendar,
  DollarSign
} from 'lucide-react';
import { useLocation } from 'react-router-dom';
import RolesManagement from './RolesManagement';
import PermissionsManagement from './PermissionsManagement';
import HRDesignations from './HRDesignations';
import HRDepartments from './HRDepartments';
import LeaveTypes from './LeaveTypes';
import PayrollManagement from './PayrollManagement';

type HRTab = 'roles' | 'permissions' | 'designations' | 'departments' | 'leave-types' | 'payroll';

const HRConfig: React.FC = () => {
  const [activeTab, setActiveTab] = useState<HRTab>('roles');
  const location = useLocation();

  useEffect(() => {
    const tab = (location.state as { tab?: HRTab } | null | undefined)?.tab;
    if (!tab) return;
    queueMicrotask(() => setActiveTab(tab));
  }, [location.state]);

  const tabs = [
    { id: 'roles', label: 'Roles', icon: Shield },
    { id: 'permissions', label: 'Permissions', icon: Settings },
    { id: 'designations', label: 'Designations', icon: IdCard },
    { id: 'departments', label: 'Departments', icon: Building2 },
    { id: 'leave-types', label: 'Leave Types', icon: Calendar },
    { id: 'payroll', label: 'Payroll', icon: DollarSign },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'roles':
        return <RolesManagement />;
      case 'permissions':
        return <PermissionsManagement />;
      case 'designations':
        return <HRDesignations />;
      case 'departments':
        return <HRDepartments />;
      case 'leave-types':
        return <LeaveTypes />;
      case 'payroll':
        return <PayrollManagement />;
      default:
        return <RolesManagement />;
    }
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <LayoutGrid className="w-7 h-7 text-blue-600" />
            HR Configuration
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Manage system roles, permissions, designations, and departmental structures.
          </p>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="border-b border-gray-200 dark:border-gray-700">
          <nav className="flex space-x-1 p-2 overflow-x-auto" aria-label="Tabs">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id as HRTab);
                    // Update URL without navigation to keep state clean if needed, 
                    // or just manage local state. For deep linking, we could update the URL hash or query param.
                  }}
                  className={`
                    flex items-center gap-2 px-4 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 whitespace-nowrap
                    ${isActive 
                      ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 shadow-sm' 
                      : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700/50'}
                  `}
                >
                  <Icon size={18} className={isActive ? 'text-blue-600 dark:text-blue-400' : 'text-gray-400 dark:text-gray-500'} />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>

        <div className="bg-gray-50 dark:bg-gray-900/50 min-h-[600px]">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default HRConfig;
