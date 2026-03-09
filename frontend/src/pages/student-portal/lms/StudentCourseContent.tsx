import React, { useState } from 'react';
import { 
  Folder, 
  FileText, 
  Download, 
  Video, 
  Link as LinkIcon, 
  ChevronDown,
  ChevronRight,
  BookOpen
} from 'lucide-react';

const StudentCourseContent: React.FC = () => {
  const [expandedModules, setExpandedModules] = useState<number[]>([1]);
  const [selectedCourse, setSelectedCourse] = useState<string>('');

  // Mock Courses (Enrolled)
  const courses = [
    { code: 'CSC 401', title: 'Advanced Software Engineering' },
    { code: 'MTH 302', title: 'Linear Algebra' },
    { code: 'PHY 201', title: 'General Physics' }
  ];

  const toggleModule = (id: number) => {
    setExpandedModules(prev => 
      prev.includes(id) ? prev.filter(m => m !== id) : [...prev, id]
    );
  };

  // Mock Modules Data
  const allModules = [
    {
      id: 1,
      courseCode: 'CSC 401',
      title: 'Week 1: Introduction to Software Engineering',
      description: 'Overview of SDLC models and methodologies.',
      items: [
        { id: 1, title: 'Lecture Slides - Week 1', type: 'slide', size: '2.4 MB', date: '2024-03-10', allowDownload: true },
        { id: 2, title: 'Introduction Video', type: 'video', size: '15 mins', date: '2024-03-10', allowDownload: false },
        { id: 3, title: 'Reading List', type: 'doc', size: '150 KB', date: '2024-03-10', allowDownload: true },
      ]
    },
    {
      id: 2,
      courseCode: 'CSC 401',
      title: 'Week 2: Requirements Engineering',
      description: 'Techniques for gathering and analyzing requirements.',
      items: [
        { id: 4, title: 'Lecture Slides - Week 2', type: 'pdf', size: '1.8 MB', date: '2024-03-17', allowDownload: true },
        { id: 5, title: 'Case Study: Hospital System', type: 'link', size: 'External', date: '2024-03-17', allowDownload: true },
      ]
    },
    {
      id: 3,
      courseCode: 'MTH 302',
      title: 'Module 1: Vector Spaces',
      description: 'Introduction to vector spaces and subspaces.',
      items: [
        { id: 6, title: 'Chapter 1 Notes', type: 'pdf', size: '3.2 MB', date: '2024-03-12', allowDownload: true },
      ]
    }
  ];

  const filteredModules = selectedCourse 
    ? allModules.filter(m => m.courseCode === selectedCourse)
    : allModules;

  const getIcon = (type: string) => {
    switch (type) {
      case 'video': return <Video size={18} className="text-red-500" />;
      case 'link': return <LinkIcon size={18} className="text-blue-500" />;
      case 'slide': return <BookOpen size={18} className="text-orange-500" />;
      default: return <FileText size={18} className="text-gray-500" />;
    }
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <Folder className="text-orange-600" />
            Course Content
          </h1>
          <p className="text-gray-500 dark:text-gray-400">Access your learning materials and resources.</p>
        </div>
        
        {/* Course Filter */}
        <div className="relative min-w-[250px]">
          <BookOpen className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
          <select 
            value={selectedCourse}
            onChange={(e) => setSelectedCourse(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 shadow-sm"
          >
            <option value="">All My Courses</option>
            {courses.map(c => <option key={c.code} value={c.code}>{c.code} - {c.title}</option>)}
          </select>
        </div>
      </div>

      <div className="space-y-4">
        {filteredModules.length === 0 ? (
           <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-2xl border border-dashed border-gray-200 dark:border-gray-700">
             <Folder size={48} className="mx-auto text-gray-300 mb-4" />
             <p className="text-gray-500 dark:text-gray-400 font-medium">No content found for this selection.</p>
           </div>
        ) : (
          filteredModules.map((module) => (
            <div key={module.id} className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 overflow-hidden shadow-sm">
              <div 
                className="p-4 bg-gray-50 dark:bg-gray-900/50 flex items-center justify-between cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                onClick={() => toggleModule(module.id)}
              >
                <div className="flex items-center gap-3">
                  {expandedModules.includes(module.id) ? <ChevronDown size={20} className="text-gray-400" /> : <ChevronRight size={20} className="text-gray-400" />}
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400">
                        {module.courseCode}
                      </span>
                    </div>
                    <h3 className="font-bold text-gray-900 dark:text-white">{module.title}</h3>
                    <p className="text-xs text-gray-500">{module.description}</p>
                  </div>
                </div>
              </div>

              {expandedModules.includes(module.id) && (
                <div className="p-4 space-y-2">
                  {module.items.map((item) => (
                    <div key={item.id} className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors group">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-white dark:bg-gray-800 rounded-lg border border-gray-100 dark:border-gray-700">
                          {getIcon(item.type)}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900 dark:text-white group-hover:text-orange-600 transition-colors">{item.title}</p>
                          <p className="text-[10px] text-gray-400">{item.type.toUpperCase()} • {item.size} • {item.date}</p>
                        </div>
                      </div>
                      {item.allowDownload && (
                        <button 
                          title="Download"
                          className="p-2 text-gray-400 hover:text-orange-600 hover:bg-orange-50 dark:hover:bg-orange-900/20 rounded-lg transition-colors"
                        >
                          <Download size={18} />
                        </button>
                      )}
                    </div>
                  ))}
                  {module.items.length === 0 && (
                    <p className="text-sm text-gray-400 italic pl-4">No content items yet.</p>
                  )}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default StudentCourseContent;
