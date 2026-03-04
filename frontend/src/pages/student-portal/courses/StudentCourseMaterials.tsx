import React, { useState, useEffect } from 'react';
import { Book, Search, Filter, Download, FileText, Clock, AlertCircle, File, FileCode, FileSpreadsheet, Presentation } from 'lucide-react';
// Correct relative import path to the service
import { courseMaterialService } from '../../school-admin/academics/modules/CourseMaterials/service';
import type { CourseMaterial } from '../../school-admin/academics/modules/CourseMaterials/types';

const StudentCourseMaterials: React.FC = () => {
  const [materials, setMaterials] = useState<CourseMaterial[]>([]);
  const [filteredMaterials, setFilteredMaterials] = useState<CourseMaterial[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [courseFilter, setCourseFilter] = useState<string>('All');

  // Mock student info (in a real app, this would come from auth context)
  const currentStudent = {
    id: 'ST-2024-001',
    name: 'John Doe'
  };

  useEffect(() => {
    // Ensure data exists
    // Note: seedData might already have run in School Admin, but safe to call again as it checks length
    // However, since we are importing the service, it shares the localStorage keys
    const allMaterials = courseMaterialService.getMaterials();
    if (allMaterials.length === 0) {
       courseMaterialService.seedData();
    }
    loadMaterials();
  }, []);

  useEffect(() => {
    let result = materials;
    
    if (courseFilter !== 'All') {
      result = result.filter(m => m.courseId === courseFilter);
    }

    if (searchTerm) {
      const lower = searchTerm.toLowerCase();
      result = result.filter(m => 
        m.title.toLowerCase().includes(lower) ||
        m.description.toLowerCase().includes(lower) ||
        m.courseId.toLowerCase().includes(lower) ||
        m.topicOrWeek.toLowerCase().includes(lower)
      );
    }

    setFilteredMaterials(result);
  }, [materials, searchTerm, courseFilter]);

  const loadMaterials = () => {
    const allMaterials = courseMaterialService.getMaterials();
    const now = new Date();
    
    // Filter for published and visible materials
    // We only show materials that are 'Published' and whose visibility date has passed
    const availableMaterials = allMaterials.filter(m => 
      m.status === 'Published' && 
      (m.visibilityDate ? new Date(m.visibilityDate) <= now : true)
    );
    
    setMaterials(availableMaterials);
  };

  const handleDownload = (material: CourseMaterial) => {
    if (!material.allowDownload) return;

    // Log the download
    courseMaterialService.logDownload(material.id, currentStudent.id, currentStudent.name);

    // Simulate download
    // In a real app, this would trigger a file download from the server
    // For demo, we just alert
    alert(`Downloading ${material.title} (${material.fileType})...\n\n(This action is logged in the admin dashboard)`);
    
    // If it were a real URL, we'd do:
    // window.open(material.fileUrl, '_blank');
  };

  // Extract unique course IDs for filter
  const uniqueCourses = Array.from(new Set(materials.map(m => m.courseId))).sort();

  const getFileIcon = (type: string) => {
    const t = type.toLowerCase();
    if (t.includes('pdf')) return <FileText className="text-red-500" />;
    if (t.includes('ppt')) return <Presentation className="text-orange-500" />;
    if (t.includes('xls') || t.includes('sheet')) return <FileSpreadsheet className="text-green-500" />;
    if (t.includes('code') || t.includes('js') || t.includes('html')) return <FileCode className="text-blue-500" />;
    return <File className="text-gray-500" />;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <Book className="text-blue-600" /> Course Materials
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
            Access and download your course lectures, assignments, and notes.
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input 
            type="text" 
            placeholder="Search by title, course code, topic..." 
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white"
          />
        </div>
        <div className="flex items-center gap-2 min-w-[200px]">
          <Filter className="text-gray-400" size={20} />
          <select 
            value={courseFilter} 
            onChange={e => setCourseFilter(e.target.value)}
            className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white"
          >
            <option value="All">All Courses</option>
            {uniqueCourses.map(course => (
              <option key={course} value={course}>{course}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Materials Grid */}
      {filteredMaterials.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMaterials.map(material => (
            <div key={material.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-md transition-shadow flex flex-col h-full">
              <div className="p-5 flex-1">
                <div className="flex justify-between items-start mb-4">
                  <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    {getFileIcon(material.fileType)}
                  </div>
                  <span className="px-2 py-1 text-xs font-medium bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full border border-blue-100 dark:border-blue-800">
                    {material.fileType}
                  </span>
                </div>
                
                <div className="mb-2">
                   <span className="text-xs font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
                      {material.courseId} • {material.topicOrWeek}
                   </span>
                </div>

                <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-2 line-clamp-2" title={material.title}>
                  {material.title}
                </h3>
                
                <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-3 mb-4">
                  {material.description}
                </p>
                
                <div className="flex items-center gap-2 text-xs text-gray-400 mt-auto">
                  <Clock size={12} />
                  <span>Posted {formatDate(material.uploadedAt)}</span>
                </div>
              </div>

              <div className="p-4 bg-gray-50 dark:bg-gray-700/30 border-t border-gray-100 dark:border-gray-700">
                <button 
                  onClick={() => handleDownload(material)}
                  disabled={!material.allowDownload}
                  className={`w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                    material.allowDownload 
                      ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-sm' 
                      : 'bg-gray-200 dark:bg-gray-700 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  {material.allowDownload ? (
                    <>
                      <Download size={16} /> Download
                    </>
                  ) : (
                    <>
                      <AlertCircle size={16} /> View Only
                    </>
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-16 text-center bg-white dark:bg-gray-800 rounded-xl border border-dashed border-gray-300 dark:border-gray-700">
          <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-full mb-4">
            <Book className="text-gray-400" size={32} />
          </div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">No materials found</h3>
          <p className="text-gray-500 dark:text-gray-400 max-w-md mt-1">
            {searchTerm || courseFilter !== 'All' 
              ? "Try adjusting your search or filters to find what you're looking for." 
              : "There are no course materials available for you at the moment."}
          </p>
        </div>
      )}
    </div>
  );
};

export default StudentCourseMaterials;
