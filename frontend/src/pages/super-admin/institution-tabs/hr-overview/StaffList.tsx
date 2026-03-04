import React, { useState } from 'react';
import { Search, Eye, Mail } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import type { StaffSummary } from './types';

interface StaffListProps {
  staff: StaffSummary[];
}

const StaffList: React.FC<StaffListProps> = ({ staff }) => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  const filteredStaff = staff.filter(s => {
    const matchesSearch = s.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         s.role.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All' || s.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="bg-white dark:bg-[#151e32] rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden">
      <div className="p-6 border-b border-gray-200 dark:border-gray-800 flex flex-col md:flex-row justify-between gap-4">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white">Staff Directory</h3>
        
        <div className="flex gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="Search staff..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <select 
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="All">All Status</option>
            <option value="Active">Active</option>
            <option value="On Leave">On Leave</option>
            <option value="Inactive">Inactive</option>
          </select>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-50 dark:bg-gray-900/50">
            <tr>
              <th className="px-6 py-3 font-medium text-gray-500">Name</th>
              <th className="px-6 py-3 font-medium text-gray-500">Role</th>
              <th className="px-6 py-3 font-medium text-gray-500">Department</th>
              <th className="px-6 py-3 font-medium text-gray-500">Join Date</th>
              <th className="px-6 py-3 font-medium text-gray-500">Status</th>
              <th className="px-6 py-3 font-medium text-gray-500 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
            {filteredStaff.map((person) => (
              <tr key={person.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 font-bold text-xs">
                      {person.name.split(' ').map(n => n[0]).join('').substring(0, 2)}
                    </div>
                    <div>
                      <div className="font-medium text-gray-900 dark:text-white">{person.name}</div>
                      <div className="text-xs text-gray-500">ID: {person.id}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 text-gray-600 dark:text-gray-300">{person.role}</td>
                <td className="px-6 py-4 text-gray-600 dark:text-gray-300">{person.department}</td>
                <td className="px-6 py-4 text-gray-600 dark:text-gray-300">{new Date(person.joinDate).toLocaleDateString()}</td>
                <td className="px-6 py-4">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                    person.status === 'Active' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
                    person.status === 'On Leave' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400' :
                    'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400'
                  }`}>
                    {person.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded text-gray-500 hover:text-blue-600 transition-colors">
                      <Mail size={16} />
                    </button>
                    <button 
                      onClick={() => navigate('/super-admin/hr-overview/staff-profile', { state: { staff: person } })}
                      className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded text-gray-500 hover:text-blue-600 transition-colors"
                    >
                      <Eye size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default StaffList;
