import React, { useMemo, useState } from 'react';
import { Users, Briefcase, Activity, Mail, Filter, Search } from 'lucide-react';
import type { Staff as StaffEntity } from '../../../state/hrAccessControl';
import { useHR } from '../../../state/hrAccessControl';

type StaffFilterType = 'All' | 'Academic' | 'Non-Academic';

interface EnrichedStaffRow {
  staff: StaffEntity;
  id: string;
  name: string;
  staffId: string;
  email: string;
  roleName: string;
  departmentName: string;
  statusLabel: 'Active' | 'Inactive';
  typeLabel: 'Academic' | 'Non-Academic';
}

const HRDashboard: React.FC = () => {
  const { staff, departments, roles } = useHR();
  const [filterType, setFilterType] = useState<StaffFilterType>('All');
  const [filterDepartment, setFilterDepartment] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');

  const enrichedStaff = useMemo<EnrichedStaffRow[]>(() => {
    return staff.map(s => {
      const dept = departments.find(d => d.id === s.departmentId);
      const role = roles.find(r => r.id === s.roleId);
      const name = `${s.firstName} ${s.lastName}`.trim();
      const typeLabel: 'Academic' | 'Non-Academic' =
        dept && dept.type === 'Academic' ? 'Academic' : 'Non-Academic';
      const statusLabel: 'Active' | 'Inactive' =
        s.status === 'active' ? 'Active' : 'Inactive';
      return {
        staff: s,
        id: s.id,
        name,
        staffId: s.staffId,
        email: s.email,
        roleName: role ? role.name : '',
        departmentName: dept ? dept.name : '',
        statusLabel,
        typeLabel
      };
    });
  }, [staff, departments, roles]);

  const totalStaff = enrichedStaff.length;
  const academicStaff = enrichedStaff.filter(
    row => row.typeLabel === 'Academic'
  ).length;
  const nonAcademicStaff = totalStaff - academicStaff;
  const activeStaff = enrichedStaff.filter(
    row => row.statusLabel === 'Active'
  ).length;

  const filteredStaff = enrichedStaff.filter(row => {
    const matchesSearch =
      row.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      row.staffId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType =
      filterType === 'All' || row.typeLabel === filterType;
    const matchesDept =
      filterDepartment === 'All' ||
      row.departmentName === filterDepartment;
    return matchesSearch && matchesType && matchesDept;
  });

  const getStatusColor = (statusLabel: 'Active' | 'Inactive') => {
    if (statusLabel === 'Active') {
      return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
    }
    return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400';
  };

  const chartData = [
    { label: 'Academic', value: academicStaff, color: 'bg-emerald-500' },
    { label: 'Non-Academic', value: nonAcademicStaff, color: 'bg-blue-500' },
    { label: 'Inactive', value: totalStaff - activeStaff, color: 'bg-amber-500' }
  ];

  const maxChartValue = Math.max(...chartData.map(d => d.value), 1);

  return (
    <div className="p-6 space-y-6">
      <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-emerald-500 rounded-2xl px-6 py-5 shadow-lg shadow-blue-600/20 border border-blue-500/20">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-xs font-semibold text-blue-50 mb-3">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              HR & Staff Overview
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-white flex items-center gap-2">
              <Briefcase className="w-7 h-7" />
              HR Dashboard
            </h1>
            <p className="text-blue-50/80 mt-2 text-sm md:text-base max-w-xl">
              Track staffing levels, activity and recent hires across academic and non-academic departments.
            </p>
          </div>
          <div className="flex flex-col items-start md:items-end gap-3 text-blue-50/90">
            <div className="text-right">
              <p className="text-xs uppercase tracking-wide">Total Staff</p>
              <p className="text-2xl font-bold">{totalStaff}</p>
            </div>
            <div className="flex items-center gap-3 text-xs">
              <span className="px-3 py-1 rounded-full bg-white/10">
                Active: <span className="font-semibold">{activeStaff}</span>
              </span>
              <span className="px-3 py-1 rounded-full bg-white/10">
                Academic: <span className="font-semibold">{academicStaff}</span>
              </span>
              <span className="px-3 py-1 rounded-full bg-white/10">
                Non-academic: <span className="font-semibold">{nonAcademicStaff}</span>
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="relative overflow-hidden bg-white dark:bg-gray-900 p-5 rounded-2xl shadow-sm border border-gray-200/80 dark:border-gray-700/80 hover:shadow-lg hover:shadow-blue-500/10 transition-all duration-300">
          <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-emerald-500" />
          <div className="flex items-center justify-between relative">
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Staff</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{totalStaff}</p>
            </div>
            <div className="p-2 rounded-xl bg-blue-50 dark:bg-blue-900/30">
              <Users className="w-5 h-5 text-blue-600 dark:text-blue-300" />
            </div>
          </div>
        </div>

        <div className="relative overflow-hidden bg-white dark:bg-gray-900 p-5 rounded-2xl shadow-sm border border-gray-200/80 dark:border-gray-700/80 hover:shadow-lg hover:shadow-emerald-500/10 transition-all duration-300">
          <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-emerald-500 via-emerald-400 to-teal-500" />
          <div className="flex items-center justify-between relative">
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Academic Staff</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{academicStaff}</p>
            </div>
            <div className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-900/30">
              <Briefcase className="w-5 h-5 text-emerald-600 dark:text-emerald-300" />
            </div>
          </div>
        </div>

        <div className="relative overflow-hidden bg-white dark:bg-gray-900 p-5 rounded-2xl shadow-sm border border-gray-200/80 dark:border-gray-700/80 hover:shadow-lg hover:shadow-purple-500/10 transition-all duration-300">
          <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-purple-500 via-indigo-500 to-blue-500" />
          <div className="flex items-center justify-between relative">
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Non-Academic Staff</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{nonAcademicStaff}</p>
            </div>
            <div className="p-2 rounded-xl bg-purple-50 dark:bg-purple-900/30">
              <Users className="w-5 h-5 text-purple-600 dark:text-purple-300" />
            </div>
          </div>
        </div>

        <div className="relative overflow-hidden bg-white dark:bg-gray-900 p-5 rounded-2xl shadow-sm border border-gray-200/80 dark:border-gray-700/80 hover:shadow-lg hover:shadow-amber-500/10 transition-all duration-300">
          <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500" />
          <div className="flex items-center justify-between relative">
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Active vs Inactive</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                {activeStaff}/{totalStaff}
              </p>
            </div>
            <div className="p-2 rounded-xl bg-amber-50 dark:bg-amber-900/30">
              <Activity className="w-5 h-5 text-amber-600 dark:text-amber-300" />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-200/80 dark:border-gray-700/80 p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center justify-between gap-3">
              <div>
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Staff Distribution</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Academic vs non-academic and inactive staff
                </p>
              </div>
            </div>
          </div>
          <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
            {chartData.map(item => (
              <div key={item.label} className="flex flex-col gap-2">
                <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mb-1">
                  <span className="font-semibold text-gray-700 dark:text-gray-300">
                    {item.label}
                  </span>
                  <span className="font-mono text-gray-700 dark:text-gray-200">
                    {item.value}
                  </span>
                </div>
                <div className="h-32 w-full rounded-xl bg-gray-50 dark:bg-gray-900/40 flex items-end justify-center">
                  <div
                    className={`w-8 rounded-t-xl ${item.color}`}
                    style={{
                      height: `${(item.value / maxChartValue) * 100}%`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 flex flex-wrap gap-3 text-xs text-gray-500 dark:text-gray-400">
            <span className="inline-flex items-center gap-1">
              <span className="w-3 h-3 rounded-full bg-emerald-500" /> Academic staff
            </span>
            <span className="inline-flex items-center gap-1">
              <span className="w-3 h-3 rounded-full bg-blue-500" /> Non-academic staff
            </span>
            <span className="inline-flex items-center gap-1">
              <span className="w-3 h-3 rounded-full bg-amber-500" /> Inactive staff
            </span>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-200/80 dark:border-gray-700/80 p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2 text-gray-700 dark:text-gray-200">
              <Filter className="w-4 h-4" />
              <h2 className="text-sm font-semibold">Staff Filters</h2>
            </div>
          </div>
          <div className="space-y-3">
            <div className="space-y-1">
              <label className="text-xs font-medium text-gray-500 dark:text-gray-400">
                Staff Type
              </label>
              <select
                value={filterType}
                onChange={e => setFilterType(e.target.value as StaffFilterType)}
                className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
              >
                <option value="All">All Types</option>
                <option value="Academic">Academic Staff</option>
                <option value="Non-Academic">Non-Academic Staff</option>
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium text-gray-500 dark:text-gray-400">
                Department
              </label>
              <select
                value={filterDepartment}
                onChange={e => setFilterDepartment(e.target.value)}
                className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
              >
                <option value="All">All Departments</option>
                {departments.map(dept => (
                  <option key={dept.id} value={dept.name}>
                    {dept.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium text-gray-500 dark:text-gray-400">
                Search
              </label>
              <div className="relative">
                <Search
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  size={16}
                />
                <input
                  type="text"
                  placeholder="Name or Staff ID"
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-200/80 dark:border-gray-700/80 overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Staff Directory
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {filteredStaff.length} of {totalStaff} staff members shown
            </p>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 dark:bg-gray-900/50 border-b border-gray-200 dark:border-gray-700">
              <tr>
                <th className="px-6 py-4 font-medium text-gray-500 dark:text-gray-400">
                  Staff Name
                </th>
                <th className="px-6 py-4 font-medium text-gray-500 dark:text-gray-400">
                  Staff ID
                </th>
                <th className="px-6 py-4 font-medium text-gray-500 dark:text-gray-400">
                  Role
                </th>
                <th className="px-6 py-4 font-medium text-gray-500 dark:text-gray-400">
                  Department
                </th>
                <th className="px-6 py-4 font-medium text-gray-500 dark:text-gray-400">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {filteredStaff.length > 0 ? (
                filteredStaff.map(row => (
                  <tr
                    key={row.id}
                    className="hover:bg-gray-50 dark:hover:bg-gray-900/30 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-xs font-bold text-gray-600 dark:text-gray-300">
                          {row.name
                            .split(' ')
                            .filter(Boolean)
                            .map(n => n[0])
                            .join('')}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">
                            {row.name}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
                            <Mail size={10} /> {row.email}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-600 dark:text-gray-300 font-mono text-xs">
                      {row.staffId}
                    </td>
                    <td className="px-6 py-4 text-gray-600 dark:text-gray-300">
                      <div className="flex flex-col">
                        <span>{row.roleName}</span>
                        <span className="text-xs text-gray-400">
                          {row.typeLabel}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-600 dark:text-gray-300">
                      {row.departmentName}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-2.5 py-1 rounded-full text-xs font-medium ${getStatusColor(
                          row.statusLabel
                        )}`}
                      >
                        {row.statusLabel}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={5}
                    className="px-6 py-12 text-center text-gray-500 dark:text-gray-400"
                  >
                    No staff found matching your filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default HRDashboard;
