import React, { useState } from 'react';
import { Save, Calendar } from 'lucide-react';

interface CreditLimit {
  level: number;
  semester: string;
  minUnits: number;
  maxUnits: number;
}

interface RegistrationDeadline {
  semester: string;
  registrationEnd: string;
  addDropEnd: string;
}

const CourseRegistrationConfig: React.FC = () => {
  const [creditLimits, setCreditLimits] = useState<CreditLimit[]>([
    { level: 100, semester: '1', minUnits: 15, maxUnits: 24 },
    { level: 100, semester: '2', minUnits: 15, maxUnits: 24 },
    { level: 200, semester: '1', minUnits: 15, maxUnits: 24 },
    { level: 200, semester: '2', minUnits: 15, maxUnits: 24 },
  ]);

  const [deadlines, setDeadlines] = useState<RegistrationDeadline>({
    semester: '1',
    registrationEnd: '2025-02-28',
    addDropEnd: '2025-03-15',
  });

  const [workflowSettings, setWorkflowSettings] = useState({
    requireCoordinatorApproval: true,
    allowCarryOverRegistration: true,
    maxCarryOverUnits: 10,
    allowCrossDepartmentCourses: false
  });

  const handleLimitChange = (index: number, field: keyof CreditLimit, value: number | string) => {
    const newLimits = [...creditLimits];
    newLimits[index] = { ...newLimits[index], [field]: value };
    setCreditLimits(newLimits);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Course Registration Configuration</h1>
          <p className="text-gray-500 dark:text-gray-400">Manage credit limits, deadlines, and approval workflows</p>
        </div>
        <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
          <Save size={20} />
          <span>Save Configuration</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Credit Limits */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">Credit Unit Limits</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">Set minimum and maximum units per level</p>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {creditLimits.map((limit, index) => (
                <div key={index} className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-900/50 rounded-lg">
                  <div className="w-20 font-medium text-gray-700 dark:text-gray-300">{limit.level} Lvl</div>
                  <div className="flex-1 grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs text-gray-500 mb-1 block">Min Units</label>
                      <input
                        type="number"
                        value={limit.minUnits}
                        onChange={(e) => handleLimitChange(index, 'minUnits', parseInt(e.target.value))}
                        className="w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded px-2 py-1 text-sm"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-gray-500 mb-1 block">Max Units</label>
                      <input
                        type="number"
                        value={limit.maxUnits}
                        onChange={(e) => handleLimitChange(index, 'maxUnits', parseInt(e.target.value))}
                        className="w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded px-2 py-1 text-sm"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Deadlines & Workflow */}
        <div className="space-y-6">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">Deadlines & Windows</h2>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Registration Closing Date</label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-2.5 text-gray-400" size={16} />
                  <input
                    type="date"
                    value={deadlines.registrationEnd}
                    onChange={(e) => setDeadlines({ ...deadlines, registrationEnd: e.target.value })}
                    className="w-full pl-10 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg p-2.5"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Add/Drop Window Ends</label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-2.5 text-gray-400" size={16} />
                  <input
                    type="date"
                    value={deadlines.addDropEnd}
                    onChange={(e) => setDeadlines({ ...deadlines, addDropEnd: e.target.value })}
                    className="w-full pl-10 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg p-2.5"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">Workflow Settings</h2>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium text-gray-900 dark:text-white">Coordinator Approval</div>
                  <div className="text-xs text-gray-500">Require level coordinator approval</div>
                </div>
                <input
                  type="checkbox"
                  checked={workflowSettings.requireCoordinatorApproval}
                  onChange={(e) => setWorkflowSettings({ ...workflowSettings, requireCoordinatorApproval: e.target.checked })}
                  className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium text-gray-900 dark:text-white">Allow Carry-Over</div>
                  <div className="text-xs text-gray-500">Enable registration of failed courses</div>
                </div>
                <input
                  type="checkbox"
                  checked={workflowSettings.allowCarryOverRegistration}
                  onChange={(e) => setWorkflowSettings({ ...workflowSettings, allowCarryOverRegistration: e.target.checked })}
                  className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
              </div>
               {workflowSettings.allowCarryOverRegistration && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Max Carry-Over Units</label>
                  <input
                    type="number"
                    value={workflowSettings.maxCarryOverUnits}
                    onChange={(e) => setWorkflowSettings({ ...workflowSettings, maxCarryOverUnits: parseInt(e.target.value) })}
                    className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg p-2.5"
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseRegistrationConfig;
