import React, { useMemo, useState } from 'react';
import { X, UploadCloud } from 'lucide-react';
import type { CourseMaterial } from '../../../school-admin/academics/modules/CourseMaterials/types';
import { getAssignedCourses } from '../assignedCourses';

interface Props {
  material?: CourseMaterial;
  onSave: (material: CourseMaterial) => void;
  onClose: () => void;
}

const UploadMaterialStaff: React.FC<Props> = ({ material, onSave, onClose }) => {
  const assigned = useMemo(() => getAssignedCourses(), []);
  const [formData, setFormData] = useState<CourseMaterial>({
    id: material?.id || `mat-${Date.now()}`,
    courseId: material?.courseId || (assigned[0]?.code || ''),
    title: material?.title || '',
    description: material?.description || '',
    topicOrWeek: material?.topicOrWeek || '',
    fileUrl: material?.fileUrl || '',
    fileType: material?.fileType || '',
    visibilityDate: material?.visibilityDate || new Date().toISOString().split('T')[0],
    allowDownload: material?.allowDownload ?? true,
    expiryDate: material?.expiryDate || '',
    status: material?.status || 'Draft',
    uploadedAt: material?.uploadedAt || new Date().toISOString(),
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      setFormData(prev => ({ ...prev, [name]: (e.target as HTMLInputElement).checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setFormData(prev => ({
        ...prev,
        fileUrl: URL.createObjectURL(file),
        fileType: file.type.split('/').pop()?.toUpperCase() || 'FILE',
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.courseId) return;
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">{material ? 'Edit' : 'Upload'} Material</h2>
          <button onClick={onClose} className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
            <X />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="p-4 border-2 border-dashed rounded-lg text-center relative">
            <UploadCloud className="mx-auto text-gray-400" size={40} />
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">Drag & drop a file or click to upload</p>
            <input type="file" className="opacity-0 absolute inset-0" onChange={handleFileChange} />
            {formData.fileUrl && <p className="text-xs text-green-600 mt-2">File selected: {formData.fileType}</p>}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Title</label>
              <input type="text" name="title" value={formData.title} onChange={handleChange} required className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 dark:text-white" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Course</label>
              <select name="courseId" value={formData.courseId} onChange={handleChange} required className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 dark:text-white">
                <option value="">Select course...</option>
                {assigned.map(c => (
                  <option key={c.id} value={c.code}>{c.code} - {c.title}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description</label>
            <textarea name="description" value={formData.description} onChange={handleChange} className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 dark:text-white" rows={3}></textarea>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Topic / Week</label>
            <input type="text" name="topicOrWeek" value={formData.topicOrWeek} onChange={handleChange} required className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 dark:text-white" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Visibility Date</label>
              <input type="date" name="visibilityDate" value={formData.visibilityDate} onChange={handleChange} className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 dark:text-white" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Expiry Date (Optional)</label>
              <input type="date" name="expiryDate" value={formData.expiryDate} onChange={handleChange} className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 dark:text-white" />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <input type="checkbox" name="allowDownload" checked={formData.allowDownload} onChange={handleChange} id="allowDownload" />
              <label htmlFor="allowDownload" className="text-sm text-gray-700 dark:text-gray-300">Allow Download</label>
            </div>
            <select name="status" value={formData.status} onChange={handleChange} className="p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 dark:text-white">
              <option value="Draft">Draft</option>
              <option value="Published">Published</option>
            </select>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button type="button" onClick={onClose} className="px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200">
              Cancel
            </button>
            <button type="submit" className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors">
              Save Material
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UploadMaterialStaff;

