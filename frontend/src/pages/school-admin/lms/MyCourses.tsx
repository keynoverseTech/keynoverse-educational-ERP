import React, { useState } from 'react';
import { 
  Search, 
  Filter, 
  BookOpen, 
  MoreVertical, 
  FileText, 
  MessageSquare,
  Clock
} from 'lucide-react';

const MyCourses: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');

  // Mock Data
  const courses = [
    {
      id: 1,
      code: 'CSC 401',
      title: 'Advanced Software Engineering',
      lecturer: 'Dr. A. Bello',
      semester: 'First Semester',
      materials: 12,
      assignments: 3,
      color: 'bg-blue-600'
    },
    {
      id: 2,
      code: 'MTH 302',
      title: 'Linear Algebra II',
      lecturer: 'Prof. S. Okon',
      semester: 'First Semester',
      materials: 8,
      assignments: 2,
      color: 'bg-purple-600'
    },
    {
      id: 3,
      code: 'PHY 201',
      title: 'General Physics III',
      lecturer: 'Dr. J. Doe',
      semester: 'First Semester',
      materials: 15,
      assignments: 4,
      color: 'bg-emerald-600'
    },
  ];

  return (
    <div className="space-y-6 p-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <BookOpen className="text-blue-600" />
            My Courses
          </h1>
          <p className="text-gray-500 dark:text-gray-400">Access your enrolled courses and learning materials.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="Search courses..." 
              className="pl-10 pr-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-sm font-medium">
            <Filter size={16} /> Filter
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map((course) => (
          <div key={course.id} className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 overflow-hidden shadow-sm hover:shadow-md transition-all group cursor-pointer">
            <div className={`h-32 ${course.color} p-6 relative`}>
              <div className="absolute top-4 right-4">
                <button className="text-white/80 hover:text-white">
                  <MoreVertical size={20} />
                </button>
              </div>
              <div className="absolute bottom-6 left-6">
                <span className="bg-white/20 backdrop-blur-sm text-white px-2 py-1 rounded text-xs font-bold uppercase tracking-wider">
                  {course.code}
                </span>
                <h3 className="text-white font-bold text-lg mt-2 line-clamp-1">{course.title}</h3>
              </div>
            </div>
            
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-xs font-bold text-gray-600 dark:text-gray-300">
                    {course.lecturer.charAt(0)}
                  </div>
                  <span className="text-sm text-gray-600 dark:text-gray-300">{course.lecturer}</span>
                </div>
                <span className="text-xs text-gray-400">{course.semester}</span>
              </div>

              <div className="grid grid-cols-3 gap-2 border-t border-gray-100 dark:border-gray-700 pt-4">
                <div className="text-center">
                  <FileText size={16} className="mx-auto text-gray-400 mb-1" />
                  <span className="text-xs font-bold text-gray-700 dark:text-gray-300">{course.materials}</span>
                  <p className="text-[10px] text-gray-400">Materials</p>
                </div>
                <div className="text-center border-l border-gray-100 dark:border-gray-700">
                  <Clock size={16} className="mx-auto text-gray-400 mb-1" />
                  <span className="text-xs font-bold text-gray-700 dark:text-gray-300">{course.assignments}</span>
                  <p className="text-[10px] text-gray-400">Tasks</p>
                </div>
                <div className="text-center border-l border-gray-100 dark:border-gray-700">
                  <MessageSquare size={16} className="mx-auto text-gray-400 mb-1" />
                  <span className="text-xs font-bold text-gray-700 dark:text-gray-300">5</span>
                  <p className="text-[10px] text-gray-400">Discussions</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyCourses;