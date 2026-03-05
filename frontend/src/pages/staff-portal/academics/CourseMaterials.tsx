import React, { useEffect, useMemo, useState } from 'react';
import { Book, Plus, Search, Filter, Edit, Trash2, Archive, Download, Clock, CheckCircle } from 'lucide-react';
import { courseMaterialService } from '../../school-admin/academics/modules/CourseMaterials/service';
import type { CourseMaterial, MaterialStatus } from '../../school-admin/academics/modules/CourseMaterials/types';
import UploadMaterialStaff from './materials/UploadMaterialStaff';
import { getAssignedCourses } from './assignedCourses';
import { useLocation } from 'react-router-dom';

const StatusBadge = ({ status, visibilityDate }: { status: MaterialStatus; visibilityDate: string }) => {
  const isVisible = status === 'Published' && new Date(visibilityDate) <= new Date();
  const statusInfo = {
    Published: { icon: isVisible ? CheckCircle : Clock, color: isVisible ? 'green' : 'orange', label: isVisible ? 'Visible' : 'Scheduled' },
    Draft: { icon: Edit, color: 'gray', label: 'Draft' },
    Archived: { icon: Archive, color: 'red', label: 'Archived' },
  };
  const { icon: Icon, color, label } = statusInfo[status];
  return (
    <span className={`inline-flex items-center gap-1.5 px-2 py-1 text-xs font-medium rounded-full bg-${color}-100 text-${color}-700`}>
      <Icon size={12} />
      {label}
    </span>
  );
};

const CourseMaterials: React.FC = () => {
  const location = useLocation();
  const assignedCourses = useMemo(() => getAssignedCourses(), []);
  const [materials, setMaterials] = useState<CourseMaterial[]>([]);
  const [filteredMaterials, setFilteredMaterials] = useState<CourseMaterial[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMaterial, setEditingMaterial] = useState<CourseMaterial | undefined>(undefined);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<MaterialStatus | 'All'>('All');
  const [courseFilter, setCourseFilter] = useState<string>(() => (location.state as any)?.courseId || 'All');

  useEffect(() => {
    courseMaterialService.seedData();
    loadMaterials();
  }, []);

  useEffect(() => {
    let result = materials;
    if (courseFilter !== 'All') {
      result = result.filter(m => m.courseId === courseFilter);
    } else {
      const allowed = new Set(assignedCourses.map(c => c.code));
      result = result.filter(m => allowed.has(m.courseId));
    }
    if (statusFilter !== 'All') {
      result = result.filter(m => m.status === statusFilter);
    }
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(m => 
        m.title.toLowerCase().includes(term) ||
        m.description.toLowerCase().includes(term) ||
        m.topicOrWeek.toLowerCase().includes(term)
      );
    }
    setFilteredMaterials(result);
  }, [materials, assignedCourses, courseFilter, searchTerm, statusFilter]);

  const loadMaterials = () => {
    const allowed = new Set(assignedCourses.map(c => c.code));
    setMaterials(courseMaterialService.getMaterials().filter(m => m.status !== 'Archived' && allowed.has(m.courseId)));
  };

  const handleSave = (material: CourseMaterial) => {
    courseMaterialService.saveMaterial(material);
    loadMaterials();
    setIsModalOpen(false);
    setEditingMaterial(undefined);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this material? This cannot be undone.')) {
      courseMaterialService.deleteMaterial(id);
      loadMaterials();
    }
  };

  const handleArchive = (id: string) => {
    if (window.confirm('Are you sure you want to archive this material?')) {
      const material = materials.find(m => m.id === id);
      if (material) {
        handleSave({ ...material, status: 'Archived' });
      }
    }
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <Book /> Course Materials
        </h1>
        <button onClick={() => { setEditingMaterial(undefined); setIsModalOpen(true); }} className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
          <Plus size={16} /> Upload Material
        </button>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700 flex flex-col lg:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search materials..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>
        <div className="flex gap-3">
          <div className="flex items-center gap-2">
            <Filter className="text-gray-400" size={18} />
            <select value={statusFilter} onChange={e => setStatusFilter(e.target.value as any)} className="px-3 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none">
              <option value="All">All Status</option>
              <option value="Published">Published</option>
              <option value="Draft">Draft</option>
            </select>
          </div>
          <select value={courseFilter} onChange={e => setCourseFilter(e.target.value)} className="px-3 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none">
            <option value="All">All My Courses</option>
            {assignedCourses.map(c => (
              <option key={c.id} value={c.code}>{c.code}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredMaterials.map(material => (
          <div key={material.id} className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm space-y-2">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-bold text-lg text-gray-900 dark:text-white">{material.title}</h3>
                <p className="text-xs text-gray-500 mt-0.5">{material.courseId} • {material.topicOrWeek}</p>
              </div>
              <StatusBadge status={material.status} visibilityDate={material.visibilityDate} />
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-300">{material.description}</p>
            <div className="flex justify-end items-center gap-2 pt-3 border-t border-gray-100 dark:border-gray-700">
              <button onClick={() => { setEditingMaterial(material); setIsModalOpen(true); }} className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg"><Edit size={16} /></button>
              <button onClick={() => handleArchive(material.id)} className="p-1.5 text-gray-500 hover:text-yellow-600 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg"><Archive size={16} /></button>
              <button onClick={() => handleDelete(material.id)} className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg"><Trash2 size={16} /></button>
              {material.allowDownload && <a href={material.fileUrl} download className="p-1.5 text-gray-500 hover:text-green-600 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg"><Download size={16} /></a>}
            </div>
          </div>
        ))}
        {filteredMaterials.length === 0 && (
          <div className="col-span-full text-center py-16 text-gray-500">
            No materials found for your assigned courses.
          </div>
        )}
      </div>

      {isModalOpen && 
        <UploadMaterialStaff 
          material={editingMaterial} 
          onSave={handleSave} 
          onClose={() => { setIsModalOpen(false); setEditingMaterial(undefined); }} 
        />
      }
    </div>
  );
};

export default CourseMaterials;

