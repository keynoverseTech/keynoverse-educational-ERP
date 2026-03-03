import React, { useState } from 'react';
import { X, UploadCloud } from 'lucide-react';
import type { CourseMaterial } from './types';

interface Props {
  material?: CourseMaterial;
  onSave: (material: CourseMaterial) => void;
  onClose: () => void;
}

const UploadMaterial: React.FC<Props> = ({ material, onSave, onClose }) => {
  const [formData, setFormData] = useState<CourseMaterial>({
    id: material?.id || `mat-${Date.now()}`,
    courseId: material?.courseId || 'CS101', // Auto-filled in a real app
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
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">{material ? 'Edit' : 'Upload'} Material</h2>
          <button onClick={onClose} className="p-1"><X /></button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* File Upload Area */}
          <div className="p-4 border-2 border-dashed rounded-lg text-center">
            <UploadCloud className="mx-auto text-gray-400" size={48} />
            <p className="mt-2">Drag & drop a file or click to upload</p>
            <input type="file" className="opacity-0 absolute inset-0" onChange={handleFileChange} />
            {formData.fileUrl && <p className="text-sm text-green-600">File selected: {formData.fileType}</p>}
          </div>

          {/* Form Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input type="text" name="title" value={formData.title} onChange={handleChange} placeholder="Title" required className="p-2 border rounded" />
            <input type="text" name="courseId" value={formData.courseId} disabled className="p-2 border rounded bg-gray-100" />
          </div>
          <textarea name="description" value={formData.description} onChange={handleChange} placeholder="Description" className="w-full p-2 border rounded"></textarea>
          <input type="text" name="topicOrWeek" value={formData.topicOrWeek} onChange={handleChange} placeholder="Topic / Week" required className="p-2 border rounded" />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label>Visibility Date</label>
              <input type="date" name="visibilityDate" value={formData.visibilityDate} onChange={handleChange} className="w-full p-2 border rounded" />
            </div>
            <div>
              <label>Expiry Date (Optional)</label>
              <input type="date" name="expiryDate" value={formData.expiryDate} onChange={handleChange} className="w-full p-2 border rounded" />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <input type="checkbox" name="allowDownload" checked={formData.allowDownload} onChange={handleChange} id="allowDownload" />
              <label htmlFor="allowDownload">Allow Download</label>
            </div>
            <select name="status" value={formData.status} onChange={handleChange} className="p-2 border rounded">
              <option value="Draft">Draft</option>
              <option value="Published">Published</option>
            </select>
          </div>

          <div className="flex justify-end gap-4 mt-6">
            <button type="button" onClick={onClose} className="px-4 py-2 rounded bg-gray-200">Cancel</button>
            <button type="submit" className="px-4 py-2 rounded bg-blue-600 text-white">Save Material</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UploadMaterial;
