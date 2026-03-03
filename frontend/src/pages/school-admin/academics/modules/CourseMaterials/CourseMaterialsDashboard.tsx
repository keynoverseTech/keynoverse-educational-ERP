import React, { useState, useEffect } from 'react';
import { Book, Plus, Search, Filter, Edit, Trash2, Archive, Download, Clock, CheckCircle } from 'lucide-react';
import { courseMaterialService } from './service';
import type { CourseMaterial, MaterialStatus } from './types';
import UploadMaterial from './UploadMaterial';

const CourseMaterialsDashboard: React.FC = () => {
  const [materials, setMaterials] = useState<CourseMaterial[]>([]);
  const [filteredMaterials, setFilteredMaterials] = useState<CourseMaterial[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMaterial, setEditingMaterial] = useState<CourseMaterial | undefined>(undefined);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<MaterialStatus | 'All'>('All');

  useEffect(() => {
    courseMaterialService.seedData();
    loadMaterials();
  }, []);

  useEffect(() => {
    let result = materials;
    if (statusFilter !== 'All') {
      result = result.filter(m => m.status === statusFilter);
    }
    if (searchTerm) {
      result = result.filter(m => 
        m.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        m.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        m.topicOrWeek.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    setFilteredMaterials(result);
  }, [materials, searchTerm, statusFilter]);

  const loadMaterials = () => {
    setMaterials(courseMaterialService.getMaterials().filter(m => m.status !== 'Archived'));
  };

  const handleSave = (material: CourseMaterial) => {
    courseMaterialService.saveMaterial(material);
    loadMaterials();
    setIsModalOpen(false);
    setEditingMaterial(undefined);
  };

  const handleEdit = (material: CourseMaterial) => {
    setEditingMaterial(material);
    setIsModalOpen(true);
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

  const StatusBadge = ({ status }: { status: MaterialStatus }) => {
    const isVisible = status === 'Published' && new Date(materials.find(m => m.status === status)?.visibilityDate || '') <= new Date();
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

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold flex items-center gap-2"><Book /> Course Materials</h1>
        <button onClick={() => { setEditingMaterial(undefined); setIsModalOpen(true); }} className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
          <Plus size={16} /> Upload Material
        </button>
      </div>

      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Search className="text-gray-400" />
          <input type="text" placeholder="Search materials..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="border-b-2" />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="text-gray-400" />
          <select value={statusFilter} onChange={e => setStatusFilter(e.target.value as any)} className="border-b-2">
            <option value="All">All Statuses</option>
            <option value="Published">Published</option>
            <option value="Draft">Draft</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredMaterials.map(material => (
          <div key={material.id} className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md space-y-2">
            <div className="flex justify-between items-start">
              <h3 className="font-bold text-lg">{material.title}</h3>
              <StatusBadge status={material.status} />
            </div>
            <p className="text-sm text-gray-500">{material.topicOrWeek}</p>
            <p className="text-sm">{material.description}</p>
            <div className="flex justify-end items-center gap-2 pt-2 border-t">
              <button onClick={() => handleEdit(material)} className="p-1 text-gray-500 hover:text-blue-600"><Edit size={16} /></button>
              <button onClick={() => handleArchive(material.id)} className="p-1 text-gray-500 hover:text-yellow-600"><Archive size={16} /></button>
              <button onClick={() => handleDelete(material.id)} className="p-1 text-gray-500 hover:text-red-600"><Trash2 size={16} /></button>
              {material.allowDownload && <a href={material.fileUrl} download className="p-1 text-gray-500 hover:text-green-600"><Download size={16} /></a>}
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && 
        <UploadMaterial 
          material={editingMaterial} 
          onSave={handleSave} 
          onClose={() => { setIsModalOpen(false); setEditingMaterial(undefined); }} 
        />
      }
    </div>
  );
};

export default CourseMaterialsDashboard;
