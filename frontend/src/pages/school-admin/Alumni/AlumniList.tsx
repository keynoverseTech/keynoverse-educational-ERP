import React, { useState, useMemo } from 'react';
import { Search, Eye, MoreHorizontal, User } from 'lucide-react';
import { useAlumni } from '../../../state/alumniState';
import type { Alumni } from '../../../state/alumniState';
import { useNavigate } from 'react-router-dom';

const AlumniList: React.FC = () => {
  const { alumni } = useAlumni();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [yearFilter, setYearFilter] = useState('');
  const [programFilter, setProgramFilter] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('');

  const filteredAlumni = useMemo(() => {
    return alumni.filter(student => {
      const matchesSearch = 
        `${student.firstName} ${student.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.studentId.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesYear = yearFilter ? student.graduationYear.toString() === yearFilter : true;
      const matchesProgram = programFilter ? student.program === programFilter : true;
      const matchesDepartment = departmentFilter ? student.department === departmentFilter : true;

      return matchesSearch && matchesYear && matchesProgram && matchesDepartment;
    });
  }, [alumni, searchTerm, yearFilter, programFilter, departmentFilter]);

  const uniqueYears = useMemo(() => [...new Set(alumni.map(s => s.graduationYear))].sort((a, b) => b - a), [alumni]);
  const uniquePrograms = useMemo(() => [...new Set(alumni.map(s => s.program))].sort(), [alumni]);
  const uniqueDepartments = useMemo(() => [...new Set(alumni.map(s => s.department))].sort(), [alumni]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Alumni Directory</h1>
          <p className="text-gray-500 dark:text-gray-400">Manage and view all graduated students</p>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-4">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search by name or ID..."
              className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="flex flex-wrap gap-2">
            <select 
              className="px-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              value={yearFilter}
              onChange={(e) => setYearFilter(e.target.value)}
            >
              <option value="">All Years</option>
              {uniqueYears.map(year => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>

            <select 
              className="px-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              value={programFilter}
              onChange={(e) => setProgramFilter(e.target.value)}
            >
              <option value="">All Programs</option>
              {uniquePrograms.map(prog => (
                <option key={prog} value={prog}>{prog}</option>
              ))}
            </select>

            <select 
              className="px-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              value={departmentFilter}
              onChange={(e) => setDepartmentFilter(e.target.value)}
            >
              <option value="">All Departments</option>
              {uniqueDepartments.map(dept => (
                <option key={dept} value={dept}>{dept}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-gray-50 dark:bg-gray-900/50">
              <tr>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Student</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">ID</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Graduation</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">CGPA</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
              {filteredAlumni.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                    No alumni found matching your criteria.
                  </td>
                </tr>
              ) : (
                filteredAlumni.map((student) => (
                  <tr key={student.id} className="group hover:bg-gray-50 dark:hover:bg-gray-900/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center overflow-hidden">
                          {student.profilePicture ? (
                            <img src={student.profilePicture} alt="" className="w-full h-full object-cover" />
                          ) : (
                            <User className="text-gray-400" size={20} />
                          )}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900 dark:text-white">{student.firstName} {student.lastName}</p>
                          <p className="text-xs text-gray-500">{student.program}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-mono text-sm text-gray-600 dark:text-gray-300">
                      {student.studentId}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">
                      {student.graduationYear}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`font-bold ${
                        student.cgpa >= 4.5 ? 'text-emerald-600' : 
                        student.cgpa >= 3.5 ? 'text-blue-600' : 
                        'text-gray-600'
                      }`}>
                        {student.cgpa.toFixed(2)}
                      </span>
                      <span className="text-xs text-gray-400 block">{student.classOfDegree}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        student.employmentStatus === 'Employed' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' :
                        student.employmentStatus === 'Self-Employed' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' :
                        student.employmentStatus === 'Further Studies' ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400' :
                        'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
                      }`}>
                        {student.employmentStatus}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button 
                          onClick={() => navigate('/school-admin/alumni/profile', { state: { alumniId: student.id } })}
                          className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                          title="View Profile"
                        >
                          <Eye size={18} />
                        </button>
                        <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors">
                          <MoreHorizontal size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50 flex items-center justify-between text-sm text-gray-500">
          <span>Showing {filteredAlumni.length} of {alumni.length} alumni</span>
          <div className="flex gap-2">
            <button className="px-3 py-1 border border-gray-200 dark:border-gray-700 rounded hover:bg-white dark:hover:bg-gray-800 disabled:opacity-50">Previous</button>
            <button className="px-3 py-1 border border-gray-200 dark:border-gray-700 rounded hover:bg-white dark:hover:bg-gray-800 disabled:opacity-50">Next</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AlumniList;
