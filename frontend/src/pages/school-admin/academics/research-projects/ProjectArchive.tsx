import React, { useState } from 'react';
import { 
  Archive, 
  Search, 
  Filter, 
  Download, 
  Tag 
} from 'lucide-react';

const ProjectArchive: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');

  // Mock Data
  const archive = [
    {
      id: 1,
      title: 'Machine Learning in Agriculture',
      student: 'David Green',
      year: '2023',
      department: 'Computer Science',
      abstract: 'Optimizing crop yield using predictive analytics and IoT sensors.',
      keywords: ['ML', 'IoT', 'Agriculture'],
    },
    {
      id: 2,
      title: 'Renewable Energy Systems for Rural Areas',
      student: 'Emily White',
      year: '2022',
      department: 'Electrical Engineering',
      abstract: 'Design and implementation of cost-effective solar-wind hybrid systems.',
      keywords: ['Solar', 'Wind', 'Rural Electrification'],
    },
  ];

  return (
    <div className="space-y-6 p-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <Archive className="text-teal-600" />
            Project Archive
          </h1>
          <p className="text-gray-500 dark:text-gray-400">Repository of completed student research projects.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative w-full md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="Search archive..." 
              className="w-full pl-10 pr-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-sm font-medium">
            <Filter size={16} />
            Filter
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {archive.map((project) => (
          <div key={project.id} className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-6 shadow-sm hover:shadow-md transition-all group">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white hover:text-teal-600 transition-colors cursor-pointer">
                  {project.title}
                </h3>
                <p className="text-sm text-gray-500 mt-1">
                  By <span className="font-medium text-gray-900 dark:text-white">{project.student}</span> • {project.year} • {project.department}
                </p>
              </div>
              <button className="p-2 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-lg hover:bg-teal-50 dark:hover:bg-teal-900/30 hover:text-teal-600 transition-colors">
                <Download size={20} />
              </button>
            </div>
            
            <p className="text-gray-600 dark:text-gray-300 mt-4 text-sm leading-relaxed line-clamp-2">
              {project.abstract}
            </p>

            <div className="mt-4 flex flex-wrap gap-2">
              {project.keywords.map((keyword, idx) => (
                <span key={idx} className="inline-flex items-center gap-1 px-2.5 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-xs font-medium rounded-md">
                  <Tag size={12} /> {keyword}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProjectArchive;