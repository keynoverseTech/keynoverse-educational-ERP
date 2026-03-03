import React, { useState, useEffect } from 'react';
import { Archive, RotateCcw, Trash2 } from 'lucide-react';
import { courseMaterialService } from './service';
import type { CourseMaterial } from './types';

const ArchivedMaterials: React.FC = () => {
  const [archived, setArchived] = useState<CourseMaterial[]>([]);

  useEffect(() => {
    loadArchived();
  }, []);

  const loadArchived = () => {
    setArchived(courseMaterialService.getMaterials().filter(m => m.status === 'Archived'));
  };

  const handleRestore = (id: string) => {
    const material = courseMaterialService.getMaterials().find(m => m.id === id);
    if (material) {
      courseMaterialService.saveMaterial({ ...material, status: 'Draft' });
      loadArchived();
    }
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Permanently delete this material? This cannot be undone.')) {
      courseMaterialService.deleteMaterial(id);
      loadArchived();
    }
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold flex items-center gap-2"><Archive /> Archived Materials</h1>
      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md">
        <table className="w-full">
          <thead>
            <tr className="border-b">
              <th className="text-left p-2">Title</th>
              <th className="text-left p-2">Course</th>
              <th className="text-left p-2">Archived On</th>
              <th className="text-right p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {archived.map(material => (
              <tr key={material.id} className="border-b hover:bg-gray-50">
                <td className="p-2">{material.title}</td>
                <td className="p-2">{material.courseId}</td>
                <td className="p-2">{new Date(material.uploadedAt).toLocaleDateString()}</td>
                <td className="p-2 text-right">
                  <button onClick={() => handleRestore(material.id)} className="p-1 text-gray-500 hover:text-green-600"><RotateCcw size={16} /></button>
                  <button onClick={() => handleDelete(material.id)} className="p-1 text-gray-500 hover:text-red-600"><Trash2 size={16} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ArchivedMaterials;
