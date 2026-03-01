import React, { useState } from 'react';
import { Save, Calendar, Settings } from 'lucide-react';

interface CreditLimit {
  id: string;
  level: number;
  semester: string;
  minUnits: number;
  maxUnits: number;
  faculty?: string;
  department?: string;
  programme?: string;
}

interface RegistrationDeadline {
  semester: string;
  registrationEnd: string;
  addDropEnd: string;
}

const CourseRegistrationConfig: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'limits' | 'deadlines' | 'workflow'>('limits');
  
  // Scope Selection State
  const [selectedFaculty, setSelectedFaculty] = useState<string>('');
  const [selectedDepartment, setSelectedDepartment] = useState<string>('');
  const [selectedProgramme, setSelectedProgramme] = useState<string>('');

  const [creditLimits, setCreditLimits] = useState<CreditLimit[]>([
    { id: '1', level: 100, semester: '1', minUnits: 15, maxUnits: 24, faculty: 'all', department: 'all', programme: 'all' },
    { id: '2', level: 100, semester: '2', minUnits: 15, maxUnits: 24, faculty: 'all', department: 'all', programme: 'all' },
    { id: '3', level: 200, semester: '1', minUnits: 15, maxUnits: 24, faculty: 'all', department: 'all', programme: 'all' },
    { id: '4', level: 200, semester: '2', minUnits: 15, maxUnits: 24, faculty: 'all', department: 'all', programme: 'all' },
    { id: '5', level: 300, semester: '1', minUnits: 15, maxUnits: 24, faculty: 'all', department: 'all', programme: 'all' },
    { id: '6', level: 300, semester: '2', minUnits: 15, maxUnits: 24, faculty: 'all', department: 'all', programme: 'all' },
    { id: '7', level: 400, semester: '1', minUnits: 15, maxUnits: 24, faculty: 'all', department: 'all', programme: 'all' },
    { id: '8', level: 400, semester: '2', minUnits: 15, maxUnits: 24, faculty: 'all', department: 'all', programme: 'all' },
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

  // Mock Data for Scopes
  const faculties = ['Science', 'Arts', 'Engineering', 'Management'];
  const departments: Record<string, string[]> = {
    'Science': ['Computer Science', 'Mathematics', 'Physics', 'Chemistry'],
    'Arts': ['English', 'History', 'Philosophy'],
    'Engineering': ['Civil', 'Electrical', 'Mechanical'],
    'Management': ['Accounting', 'Business Admin']
  };
  const programmes: Record<string, string[]> = {
    'Computer Science': ['HND Computer Science', 'HND Info Tech'],
    'Mathematics': ['HND Mathematics', 'HND Statistics'],
    // Add others as needed
  };

  const handleLimitChange = (id: string, field: keyof CreditLimit, value: number) => {
    setCreditLimits(prev => prev.map(limit => 
      limit.id === id ? { ...limit, [field]: value } : limit
    ));
  };

  const getFilteredLimits = () => {
    // In a real app, you would filter based on the specific scope or fall back to defaults
    // For this UI demo, we'll just return the main list but labeled with the current scope
    return creditLimits;
  };

  const getCurrentScopeLabel = () => {
    if (selectedProgramme) return `Programme: ${selectedProgramme}`;
    if (selectedDepartment) return `Department: ${selectedDepartment}`;
    if (selectedFaculty) return `Faculty: ${selectedFaculty}`;
    return 'University Global Settings';
  };

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <Settings className="text-blue-600" />
            Course Registration Configuration
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Configure credit limits, deadlines, and registration rules.
          </p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm">
          <Save size={18} />
          Save Changes
        </button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200 dark:border-gray-700">
        <button
          onClick={() => setActiveTab('limits')}
          className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
            activeTab === 'limits'
              ? 'border-blue-600 text-blue-600 dark:text-blue-400'
              : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
          }`}
        >
          Credit Unit Limits
        </button>
        <button
          onClick={() => setActiveTab('deadlines')}
          className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
            activeTab === 'deadlines'
              ? 'border-blue-600 text-blue-600 dark:text-blue-400'
              : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
          }`}
        >
          Deadlines & Dates
        </button>
        <button
          onClick={() => setActiveTab('workflow')}
          className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
            activeTab === 'workflow'
              ? 'border-blue-600 text-blue-600 dark:text-blue-400'
              : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
          }`}
        >
          Workflow Rules
        </button>
      </div>

      {/* Content */}
      <div className="space-y-6">
        
        {/* Credit Limits Tab */}
        {activeTab === 'limits' && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2">
            {/* Scope Selectors */}
            <div className="bg-white dark:bg-gray-800 p-5 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wide mb-4">Configuration Scope</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1.5">Faculty</label>
                  <select 
                    value={selectedFaculty}
                    onChange={(e) => {
                      setSelectedFaculty(e.target.value);
                      setSelectedDepartment('');
                      setSelectedProgramme('');
                    }}
                    className="w-full p-2.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                  >
                    <option value="">All Faculties (Global)</option>
                    {faculties.map(f => <option key={f} value={f}>{f}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1.5">Department</label>
                  <select 
                    value={selectedDepartment}
                    onChange={(e) => {
                      setSelectedDepartment(e.target.value);
                      setSelectedProgramme('');
                    }}
                    disabled={!selectedFaculty}
                    className="w-full p-2.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 outline-none disabled:opacity-50"
                  >
                    <option value="">All Departments</option>
                    {selectedFaculty && departments[selectedFaculty]?.map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1.5">Programme</label>
                  <select 
                    value={selectedProgramme}
                    onChange={(e) => setSelectedProgramme(e.target.value)}
                    disabled={!selectedDepartment}
                    className="w-full p-2.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 outline-none disabled:opacity-50"
                  >
                    <option value="">All Programmes</option>
                    {selectedDepartment && programmes[selectedDepartment]?.map(p => <option key={p} value={p}>{p}</option>)}
                  </select>
                </div>
              </div>
            </div>

            {/* Limits Table */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
              <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center bg-gray-50/50 dark:bg-gray-900/20">
                <div>
                  <h2 className="text-lg font-bold text-gray-900 dark:text-white">{getCurrentScopeLabel()}</h2>
                  <p className="text-sm text-gray-500">Define minimum and maximum credit units for each level.</p>
                </div>
                {/* Badge showing inheritance status */}
                <div className="px-3 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 border border-blue-200 dark:border-blue-800">
                  {selectedFaculty ? 'Custom Scope' : 'Default Global Scope'}
                </div>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead className="bg-gray-50 dark:bg-gray-900/50">
                    <tr>
                      <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Level</th>
                      <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Semester</th>
                      <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider w-40">Min Units</th>
                      <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider w-40">Max Units</th>
                      <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                    {getFilteredLimits().map((limit) => (
                      <tr key={limit.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                        <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">
                          {limit.level} Level
                        </td>
                        <td className="px-6 py-4 text-gray-500 dark:text-gray-400">
                          {limit.semester === '1' ? 'First Semester' : 'Second Semester'}
                        </td>
                        <td className="px-6 py-4">
                          <input
                            type="number"
                            value={limit.minUnits}
                            onChange={(e) => handleLimitChange(limit.id, 'minUnits', parseInt(e.target.value) || 0)}
                            className="w-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                            min="0"
                          />
                        </td>
                        <td className="px-6 py-4">
                          <input
                            type="number"
                            value={limit.maxUnits}
                            onChange={(e) => handleLimitChange(limit.id, 'maxUnits', parseInt(e.target.value) || 0)}
                            className="w-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                            min="0"
                          />
                        </td>
                        <td className="px-6 py-4 text-right">
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400 border border-green-200 dark:border-green-800">
                            Active
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Deadlines Tab */}
        {activeTab === 'deadlines' && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                <h2 className="text-lg font-bold text-gray-900 dark:text-white">Registration Timelines</h2>
                <p className="text-sm text-gray-500">Set key dates for course registration and add/drop periods.</p>
              </div>
              <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Registration Closing Date</label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-2.5 text-gray-400" size={18} />
                    <input
                      type="date"
                      value={deadlines.registrationEnd}
                      onChange={(e) => setDeadlines({ ...deadlines, registrationEnd: e.target.value })}
                      className="w-full pl-10 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-2">Students cannot register new courses after this date.</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Add/Drop Window Ends</label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-2.5 text-gray-400" size={18} />
                    <input
                      type="date"
                      value={deadlines.addDropEnd}
                      onChange={(e) => setDeadlines({ ...deadlines, addDropEnd: e.target.value })}
                      className="w-full pl-10 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-2">Last day for modifying registered courses.</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Workflow Tab */}
        {activeTab === 'workflow' && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                <h2 className="text-lg font-bold text-gray-900 dark:text-white">Workflow & Policies</h2>
                <p className="text-sm text-gray-500">Define approval chains and academic policies.</p>
              </div>
              <div className="p-6 space-y-6">
                <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-900/50 rounded-lg border border-gray-100 dark:border-gray-800">
                  <div>
                    <div className="font-medium text-gray-900 dark:text-white">Coordinator Approval Required</div>
                    <div className="text-xs text-gray-500 mt-1">Students' registration must be approved by level coordinator.</div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={workflowSettings.requireCoordinatorApproval} 
                      onChange={(e) => setWorkflowSettings({ ...workflowSettings, requireCoordinatorApproval: e.target.checked })}
                      className="sr-only peer" 
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-900/50 rounded-lg border border-gray-100 dark:border-gray-800">
                  <div>
                    <div className="font-medium text-gray-900 dark:text-white">Allow Cross-Department Courses</div>
                    <div className="text-xs text-gray-500 mt-1">Enable students to register electives from other departments.</div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={workflowSettings.allowCrossDepartmentCourses} 
                      onChange={(e) => setWorkflowSettings({ ...workflowSettings, allowCrossDepartmentCourses: e.target.checked })}
                      className="sr-only peer" 
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>

                <div className="p-4 bg-gray-50 dark:bg-gray-900/50 rounded-lg border border-gray-100 dark:border-gray-800">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <div className="font-medium text-gray-900 dark:text-white">Carry-Over Policy</div>
                      <div className="text-xs text-gray-500 mt-1">Allow students to register outstanding courses.</div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={workflowSettings.allowCarryOverRegistration} 
                        onChange={(e) => setWorkflowSettings({ ...workflowSettings, allowCarryOverRegistration: e.target.checked })}
                        className="sr-only peer" 
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                  
                  {workflowSettings.allowCarryOverRegistration && (
                    <div className="animate-in fade-in slide-in-from-top-1 pt-2 border-t border-gray-200 dark:border-gray-700">
                      <label className="block text-xs font-medium text-gray-500 mb-1.5">Max Carry-Over Units Allowed</label>
                      <input
                        type="number"
                        value={workflowSettings.maxCarryOverUnits}
                        onChange={(e) => setWorkflowSettings({ ...workflowSettings, maxCarryOverUnits: parseInt(e.target.value) })}
                        className="w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CourseRegistrationConfig;