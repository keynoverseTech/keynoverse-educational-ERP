import React, { useState } from 'react';
import { Search, BookOpen, Users, MoreHorizontal, Download } from 'lucide-react';
import type { Course } from './types';

interface Props {
  courses: Course[];
}

const CoursesList: React.FC<Props> = ({ courses }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('All');
  const [selectedLevel, setSelectedLevel] = useState('All');

  const departments = ['All', ...Array.from(new Set(courses.map(c => c.department)))];
  const levels = ['All', ...Array.from(new Set(courses.map(c => c.level)))];

  const filteredCourses = courses.filter(course => {
    const matchesSearch = 
      course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.lecturer.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDept = selectedDepartment === 'All' || course.department === selectedDepartment;
    const matchesLevel = selectedLevel === 'All' || course.level === selectedLevel;
    
    return matchesSearch && matchesDept && matchesLevel;
  });

  return (
    <div className="space-y-6">
      {/* Header & Controls */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <BookOpen className="text-blue-600" size={24} /> 
            Course Catalog
          </h2>
          <p className="text-sm text-gray-500 mt-1">Manage and view all institutional courses across departments.</p>
        </div>
        <div className="flex items-center gap-2">
           <button className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
            <Download size={16} /> Export
          </button>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input 
            type="text" 
            placeholder="Search by code, title, or lecturer..." 
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
          />
        </div>
        <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0">
          <select 
            value={selectedDepartment}
            onChange={e => setSelectedDepartment(e.target.value)}
            className="px-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
          >
            {departments.map(d => <option key={d} value={d}>{d === 'All' ? 'All Departments' : d}</option>)}
          </select>
          <select 
            value={selectedLevel}
            onChange={e => setSelectedLevel(e.target.value)}
            className="px-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
          >
            {levels.map(l => <option key={l} value={l}>{l === 'All' ? 'All Levels' : `${l} Level`}</option>)}
          </select>
        </div>
      </div>

      {/* Courses Grid/Table */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 dark:bg-gray-900/50 border-b border-gray-200 dark:border-gray-700">
                <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Course Info</th>
                <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Department</th>
                <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Level / Semester</th>
                <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Lecturer</th>
                <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Enrollment</th>
                <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {filteredCourses.map(course => (
                <tr key={course.id} className="hover:bg-blue-50/30 dark:hover:bg-blue-900/10 transition-colors group">
                  <td className="p-4">
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg text-blue-600 font-bold text-xs">
                        {course.code}
                      </div>
                      <div>
                        <div className="font-bold text-gray-900 dark:text-white">{course.title}</div>
                        <div className="text-xs text-gray-500">{course.unit} Units</div>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className="text-sm text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded text-xs font-medium">
                      {course.department}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="text-sm font-medium text-gray-900 dark:text-white">{course.level}L</div>
                    <div className="text-xs text-gray-500">{course.semester} Semester</div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center text-xs font-bold">
                        {course.lecturer.charAt(0)}
                      </div>
                      <span className="text-sm text-gray-600 dark:text-gray-300">{course.lecturer}</span>
                    </div>
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex flex-col items-end gap-1">
                      <div className="flex items-center gap-1 font-bold text-gray-900 dark:text-white">
                        <Users size={14} className="text-gray-400" />
                        {course.studentsEnrolled}
                      </div>
                      {/* Simple progress bar simulating capacity (assuming 150 max for demo) */}
                      <div className="w-24 h-1.5 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-green-500 rounded-full" 
                          style={{ width: `${Math.min((course.studentsEnrolled / 150) * 100, 100)}%` }}
                        ></div>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 text-center">
                    <button className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg text-gray-400 hover:text-gray-600 transition-colors">
                      <MoreHorizontal size={18} />
                    </button>
                  </td>
                </tr>
              ))}
              {filteredCourses.length === 0 && (
                <tr>
                  <td colSpan={6} className="p-12 text-center">
                    <div className="flex flex-col items-center justify-center text-gray-400">
                      <Search size={48} className="mb-4 opacity-20" />
                      <p className="text-lg font-medium">No courses found</p>
                      <p className="text-sm">Try adjusting your search or filters.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50 flex justify-between items-center text-xs text-gray-500">
          <span>Showing {filteredCourses.length} of {courses.length} courses</span>
          <div className="flex gap-2">
            <button className="px-3 py-1 border rounded hover:bg-white disabled:opacity-50">Previous</button>
            <button className="px-3 py-1 border rounded hover:bg-white disabled:opacity-50">Next</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CoursesList;
