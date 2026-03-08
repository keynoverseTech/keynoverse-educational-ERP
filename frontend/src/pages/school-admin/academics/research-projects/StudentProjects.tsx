import React, { useState } from 'react';
import { 
  Folder, 
  Search, 
  Filter, 
  FileText, 
  Download 
} from 'lucide-react';

const StudentProjects: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');

  // Mock Data
  const projects = [
    {
      id: 1,
      student: 'John Doe',
      title: 'AI in Healthcare Diagnostics',
      supervisor: 'Dr. Alan Smith',
      department: 'Computer Science',
      session: '2023/2024',
      status: 'Active',
      progress: 60,
    },
    {
      id: 2,
      student: 'Jane Smith',
      title: 'Sustainable Urban Planning',
      supervisor: 'Prof. Sarah Connor',
      department: 'Architecture',
      session: '2023/2024',
      status: 'Completed',
      progress: 100,
    },
    {
      id: 3,
      student: 'Michael Brown',
      title: 'Blockchain for Voting Systems',
      supervisor: 'Dr. Alan Smith',
      department: 'Computer Science',
      session: '2023/2024',
      status: 'Pending',
      progress: 10,
    },
  ];

  const filteredProjects = projects.filter(project => 
    project.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    project.student.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 p-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <Folder className="text-blue-600" />
            Student Projects
          </h1>
          <p className="text-gray-500 dark:text-gray-400">Manage ongoing and completed student research projects.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="Search projects..." 
              className="pl-10 pr-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-sm font-medium">
            <Filter size={16} />
            Filters
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProjects.map((project) => (
          <div key={project.id} className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-6 shadow-sm hover:shadow-md transition-shadow group relative overflow-hidden">
            <div className={`absolute top-0 right-0 px-3 py-1 rounded-bl-xl text-xs font-bold ${
              project.status === 'Completed' ? 'bg-green-100 text-green-700' :
              project.status === 'Active' ? 'bg-blue-100 text-blue-700' :
              'bg-amber-100 text-amber-700'
            }`}>
              {project.status}
            </div>
            
            <div className="mb-4">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white line-clamp-2" title={project.title}>{project.title}</h3>
              <p className="text-xs text-gray-500 mt-1">{project.department} • {project.session}</p>
            </div>

            <div className="space-y-3 mb-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500">Student:</span>
                <span className="font-medium text-gray-900 dark:text-white">{project.student}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500">Supervisor:</span>
                <span className="font-medium text-gray-900 dark:text-white">{project.supervisor}</span>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-xs font-medium text-gray-500">
                <span>Progress</span>
                <span>{project.progress}%</span>
              </div>
              <div className="w-full h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                <div 
                  className={`h-full rounded-full ${
                    project.status === 'Completed' ? 'bg-green-500' : 
                    project.progress > 50 ? 'bg-blue-500' : 'bg-amber-500'
                  }`} 
                  style={{ width: `${project.progress}%` }}
                />
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-gray-100 dark:border-gray-700 flex justify-between items-center opacity-0 group-hover:opacity-100 transition-opacity">
              <button className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1">
                <FileText size={14} /> View Details
              </button>
              {project.status === 'Completed' && (
                <button className="text-xs font-bold text-green-600 hover:text-green-700 flex items-center gap-1">
                  <Download size={14} /> Download
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StudentProjects;