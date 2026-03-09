import React, { useState } from 'react';
import { 
  Users, 
  Search, 
  MoreVertical, 
  UserPlus, 
  UserMinus, 
  BarChart 
} from 'lucide-react';

const SupervisorManagement: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');

  // Mock Data
  const supervisors = [
    {
      id: 1,
      name: 'Dr. Alan Smith',
      department: 'Computer Science',
      capacity: 5,
      assigned: 3,
      specialization: 'Artificial Intelligence',
      status: 'Active',
    },
    {
      id: 2,
      name: 'Prof. Sarah Connor',
      department: 'Architecture',
      capacity: 4,
      assigned: 4,
      specialization: 'Sustainable Design',
      status: 'Full',
    },
    {
      id: 3,
      name: 'Dr. Emily Blunt',
      department: 'Biology',
      capacity: 6,
      assigned: 2,
      specialization: 'Genetics',
      status: 'Active',
    },
  ];

  const filteredSupervisors = supervisors.filter(supervisor => 
    supervisor.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    supervisor.department.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 p-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <Users className="text-purple-600" />
            Supervisor Management
          </h1>
          <p className="text-gray-500 dark:text-gray-400">Manage supervisor workload and assignments.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="Search supervisors..." 
              className="pl-10 pr-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm font-bold shadow-lg shadow-purple-500/20">
            <UserPlus size={16} />
            Add Supervisor
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredSupervisors.map((supervisor) => {
          const workloadPercentage = (supervisor.assigned / supervisor.capacity) * 100;
          let workloadColor = 'bg-green-500';
          if (workloadPercentage >= 100) workloadColor = 'bg-red-500';
          else if (workloadPercentage >= 75) workloadColor = 'bg-amber-500';

          return (
            <div key={supervisor.id} className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-6 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center font-bold text-lg">
                    {supervisor.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">{supervisor.name}</h3>
                    <p className="text-xs text-gray-500">{supervisor.department}</p>
                  </div>
                </div>
                <button className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                  <MoreVertical size={20} />
                </button>
              </div>

              <div className="space-y-4">
                <div className="bg-gray-50 dark:bg-gray-900/50 p-3 rounded-xl">
                  <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">Specialization</p>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">{supervisor.specialization}</p>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs font-bold text-gray-500 uppercase">Workload</span>
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                      workloadPercentage >= 100 ? 'bg-red-100 text-red-600' : 
                      workloadPercentage >= 75 ? 'bg-amber-100 text-amber-600' : 
                      'bg-green-100 text-green-600'
                    }`}>
                      {supervisor.assigned} / {supervisor.capacity} Students
                    </span>
                  </div>
                  <div className="w-full h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full transition-all duration-500 ${workloadColor}`} 
                      style={{ width: `${workloadPercentage}%` }}
                    />
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-gray-100 dark:border-gray-700 flex justify-between items-center opacity-0 group-hover:opacity-100 transition-opacity">
                <button className="text-xs font-bold text-purple-600 hover:text-purple-700 flex items-center gap-1">
                  <BarChart size={14} /> View Progress
                </button>
                <button className="text-xs font-bold text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-white flex items-center gap-1">
                  <UserMinus size={14} /> Reassign
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SupervisorManagement;