import React, { useState } from 'react';
import { 
  Folder, 
  FileText, 
  Download, 
  Video, 
  Link as LinkIcon, 
  MoreVertical,
  Plus,
  ChevronDown,
  ChevronRight
} from 'lucide-react';

const CourseContent: React.FC = () => {
  const [expandedModules, setExpandedModules] = useState<number[]>([1]);

  const toggleModule = (id: number) => {
    setExpandedModules(prev => 
      prev.includes(id) ? prev.filter(m => m !== id) : [...prev, id]
    );
  };

  const modules = [
    {
      id: 1,
      title: 'Week 1: Introduction to Software Engineering',
      description: 'Overview of SDLC models and methodologies.',
      items: [
        { id: 1, title: 'Lecture Slides - Week 1', type: 'pdf', size: '2.4 MB', date: '2024-03-10' },
        { id: 2, title: 'Introduction Video', type: 'video', size: '15 mins', date: '2024-03-10' },
        { id: 3, title: 'Reading List', type: 'doc', size: '150 KB', date: '2024-03-10' },
      ]
    },
    {
      id: 2,
      title: 'Week 2: Requirements Engineering',
      description: 'Techniques for gathering and analyzing requirements.',
      items: [
        { id: 4, title: 'Lecture Slides - Week 2', type: 'pdf', size: '1.8 MB', date: '2024-03-17' },
        { id: 5, title: 'Case Study: Hospital System', type: 'link', size: 'External', date: '2024-03-17' },
      ]
    },
  ];

  const getIcon = (type: string) => {
    switch (type) {
      case 'video': return <Video size={18} className="text-red-500" />;
      case 'link': return <LinkIcon size={18} className="text-blue-500" />;
      default: return <FileText size={18} className="text-orange-500" />;
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
          <p className="text-gray-500 dark:text-gray-400">CSC 401 - Advanced Software Engineering</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors text-sm font-bold shadow-lg shadow-orange-500/20">
          <Plus size={16} /> Add Module
        </button>
      </div>

      <div className="space-y-4">
        {modules.map((module) => (
          <div key={module.id} className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 overflow-hidden shadow-sm">
            <div 
              className="p-4 bg-gray-50 dark:bg-gray-900/50 flex items-center justify-between cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              onClick={() => toggleModule(module.id)}
            >
              <div className="flex items-center gap-3">
                {expandedModules.includes(module.id) ? <ChevronDown size={20} className="text-gray-400" /> : <ChevronRight size={20} className="text-gray-400" />}
                <div>
                  <h3 className="font-bold text-gray-900 dark:text-white">{module.title}</h3>
                  <p className="text-xs text-gray-500">{module.description}</p>
                </div>
              </div>
              <button className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full text-gray-400">
                <MoreVertical size={18} />
              </button>
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
                    <button className="p-2 text-gray-400 hover:text-orange-600 hover:bg-orange-50 dark:hover:bg-orange-900/20 rounded-lg transition-colors">
                      <Download size={18} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CourseContent;