import React, { useState } from 'react';
import { Eye, CheckCircle, XCircle, FileCode, Folder, Activity } from 'lucide-react';
import type { AcademicModule } from './types';

// Import Module Components
import { SessionsPage } from '../../../school-admin/academics/modules/SessionsPage';
import { SemestersPage } from '../../../school-admin/academics/modules/SemestersPage';
import { ProgrammesPage } from '../../../school-admin/academics/modules/ProgrammesPage';
import { FacultiesPage } from '../../../school-admin/academics/modules/FacultiesPage';
import { DepartmentsPage } from '../../../school-admin/academics/modules/DepartmentsPage';
import { LevelsPage } from '../../../school-admin/academics/modules/LevelsPage';
import { CoursesPage } from '../../../school-admin/academics/modules/CoursesPage';
import CourseRegistrationConfig from '../../../school-admin/academics/modules/CourseRegistrationConfig';

interface AcademicConfigurationProps {
  configurations: AcademicModule[];
}

const AcademicConfiguration: React.FC<AcademicConfigurationProps> = ({ configurations }) => {
  const [selectedModule, setSelectedModule] = useState<AcademicModule | null>(null);

  const handleViewDetails = (module: AcademicModule) => {
    setSelectedModule(module);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active': return 'text-green-600 bg-green-50';
      case 'Inactive': return 'text-gray-500 bg-gray-50';
      case 'Maintenance': return 'text-yellow-600 bg-yellow-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const renderModuleContent = (module: AcademicModule) => {
    switch (module.path) {
      case 'SessionsPage.tsx': return <SessionsPage />;
      case 'SemestersPage.tsx': return <SemestersPage />;
      case 'ProgrammesPage.tsx': return <ProgrammesPage />;
      case 'FacultiesPage.tsx': return <FacultiesPage />;
      case 'DepartmentsPage.tsx': return <DepartmentsPage />;
      case 'LevelsPage.tsx': return <LevelsPage />;
      case 'CoursesPage.tsx': return <CoursesPage />;
      case 'CourseRegistrationConfig.tsx': return <CourseRegistrationConfig />;
      default: return <div className="p-4 text-center text-gray-500">Module content not found.</div>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Academic Modules Oversight</h2>
          <p className="text-sm text-gray-500">Overview of all academic modules and their functional status.</p>
        </div>
        <div className="flex gap-2">
            <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-bold">Total: {configurations.length}</span>
            <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold">Active: {configurations.filter(m => m.status === 'Active').length}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {configurations.map(module => (
          <div key={module.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-5 hover:shadow-md transition-shadow group">
            <div className="flex justify-between items-start mb-4">
              <div className={`p-3 rounded-lg ${module.type === 'Core' ? 'bg-blue-50 text-blue-600' : 'bg-purple-50 text-purple-600'}`}>
                {module.path.endsWith('/') ? <Folder size={24} /> : <FileCode size={24} />}
              </div>
              <span className={`px-2 py-1 rounded text-xs font-bold flex items-center gap-1 ${getStatusColor(module.status)}`}>
                {module.status === 'Active' ? <CheckCircle size={12} /> : <Activity size={12} />}
                {module.status}
              </span>
            </div>
            
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 group-hover:text-blue-600 transition-colors">{module.name}</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4 line-clamp-2">{module.description}</p>
            
            <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-700">
              <div className="text-xs text-gray-400">
                Updated: {module.lastUpdated}
              </div>
              <button 
                onClick={() => handleViewDetails(module)}
                className="text-sm font-medium text-blue-600 hover:text-blue-700 flex items-center gap-1"
              >
                <Eye size={16} /> Details
              </button>
            </div>
          </div>
        ))}
      </div>

      {selectedModule && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-gray-800 w-full max-w-6xl h-[90vh] rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 flex flex-col">
            {/* Modal Header */}
            <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center bg-gray-50 dark:bg-gray-900/50 shrink-0">
              <div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                  {selectedModule.path.endsWith('/') ? <Folder size={20} className="text-blue-600" /> : <FileCode size={20} className="text-blue-600" />}
                  {selectedModule.name}
                </h3>
                <p className="text-xs text-gray-500 mt-1">Previewing Module: {selectedModule.path}</p>
              </div>
              <button onClick={() => setSelectedModule(null)} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors">
                <XCircle size={24} />
              </button>
            </div>

            {/* Modal Content - Render the actual component */}
            <div className="flex-1 overflow-y-auto bg-gray-50/50 dark:bg-gray-900/50 p-4">
               <div className="mb-4 bg-blue-50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-900/20 rounded-xl p-4">
                 <div className="text-sm font-bold text-blue-900 dark:text-blue-200">Read-only preview</div>
                 <div className="text-xs text-blue-700 dark:text-blue-400 mt-1">
                   Actions are disabled here. This does not change the school’s configuration.
                 </div>
               </div>

               <style>{`
                 .superadmin-readonly button,
                 .superadmin-readonly a,
                 .superadmin-readonly [role="button"] {
                   display: none !important;
                 }

                 .superadmin-readonly input,
                 .superadmin-readonly select,
                 .superadmin-readonly textarea,
                 .superadmin-readonly [contenteditable="true"] {
                   pointer-events: none !important;
                 }

                 .superadmin-readonly form {
                   pointer-events: none !important;
                 }
               `}</style>

               <div className="superadmin-readonly">
                 {renderModuleContent(selectedModule)}
               </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AcademicConfiguration;
