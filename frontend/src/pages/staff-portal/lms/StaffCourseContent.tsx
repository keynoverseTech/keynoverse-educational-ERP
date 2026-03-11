import { useEffect, useMemo, useState } from 'react';
import { 
  Folder, 
  FileText, 
  Download,
  MoreVertical,
  Plus,
  ChevronDown,
  ChevronRight,
  X,
  Upload,
  Calendar,
  BookOpen
} from 'lucide-react';
import { getAssignedCourses } from '../academics/assignedCourses';

interface ContentItem {
  id: number;
  title: string;
  type: 'pdf' | 'doc' | 'slide';
  size: string;
  date: string;
  allowDownload: boolean;
  url?: string;
}

interface Module {
  id: number;
  title: string; // Topic/Week
  description: string;
  items: ContentItem[];
}

type ModulesByCourse = Record<string, Module[]>;

const STORAGE_KEY = 'staff_lms_course_content';

const loadModulesByCourse = (): ModulesByCourse => {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return {};
  try {
    return JSON.parse(raw) as ModulesByCourse;
  } catch {
    return {};
  }
};

const saveModulesByCourse = (data: ModulesByCourse) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
  }
};

const inferDocType = (fileName: string): ContentItem['type'] => {
  const ext = fileName.split('.').pop()?.toLowerCase();
  if (ext === 'ppt' || ext === 'pptx') return 'slide';
  if (ext === 'doc' || ext === 'docx') return 'doc';
  return 'pdf';
};

const StaffCourseContent = () => {
  const assignedCourses = useMemo(() => getAssignedCourses(), []);
  const [expandedModules, setExpandedModules] = useState<number[]>([1]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Filters State
  const [selectedCourse, setSelectedCourse] = useState('');

  // Form State
  const [formData, setFormData] = useState({
    courseTitle: '',
    courseCode: '',
    topic: '',
    description: '',
    uploadDate: new Date().toISOString().split('T')[0],
    allowDownload: true,
    files: null as FileList | null
  });

  const myCourses = useMemo(() => assignedCourses.map(c => ({ code: c.code, title: c.title })), [assignedCourses]);

  const [modulesByCourse, setModulesByCourse] = useState<ModulesByCourse>(() => loadModulesByCourse());
  const modules = modulesByCourse[selectedCourse] ?? [];

  const toggleModule = (id: number) => {
    setExpandedModules(prev => 
      prev.includes(id) ? prev.filter(m => m !== id) : [...prev, id]
    );
  };

  const getIcon = (type: ContentItem['type']) => {
    switch (type) {
      case 'slide': return <BookOpen size={18} className="text-orange-500" />;
      default: return <FileText size={18} className="text-gray-500" />;
    }
  };

  useEffect(() => {
    if (!selectedCourse) {
      setExpandedModules([1]);
      return;
    }
    const firstId = modulesByCourse[selectedCourse]?.[0]?.id;
    setExpandedModules(firstId ? [firstId] : []);
  }, [modulesByCourse, selectedCourse]);

  const handleOpenModal = () => {
    // Pre-fill course info if selected
    const course = myCourses.find(c => c.code === selectedCourse);
    setFormData(prev => ({
      ...prev,
      courseTitle: course ? course.title : '',
      courseCode: selectedCourse || '',
      topic: '',
      description: '',
      uploadDate: new Date().toISOString().split('T')[0],
      allowDownload: true,
      files: null
    }));
    setIsModalOpen(true);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, allowDownload: e.target.checked }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFormData(prev => ({ ...prev, files: e.target.files }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const files = formData.files ? Array.from(formData.files) : [];
    if (!selectedCourse || files.length === 0) return;

    const newItems: ContentItem[] = files.map((file) => ({
      id: Date.now() + Math.floor(Math.random() * 1000),
      title: file.name,
      type: inferDocType(file.name),
      size: `${(file.size / 1024 / 1024).toFixed(1)} MB`,
      date: formData.uploadDate,
      allowDownload: formData.allowDownload
    }));

    setModulesByCourse(prev => {
      const current = prev[selectedCourse] ?? [];
      const existingModuleIndex = current.findIndex(m => m.title === formData.topic);
      let next: Module[];

      if (existingModuleIndex >= 0) {
        const updatedModules = [...current];
        updatedModules[existingModuleIndex] = {
          ...updatedModules[existingModuleIndex],
          items: [...updatedModules[existingModuleIndex].items, ...newItems]
        };
        next = updatedModules;
      } else {
        const newModule: Module = {
          id: Date.now() + 1,
          title: formData.topic || 'New Week/Topic',
          description: formData.description,
          items: newItems
        };
        next = [...current, newModule];
      }

      const updated = { ...prev, [selectedCourse]: next };
      saveModulesByCourse(updated);
      return updated;
    });

    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6 p-6">
      {/* Header & Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <Folder className="text-orange-600" />
            Course Content
          </h1>
          <p className="text-gray-500 dark:text-gray-400">Upload and manage documents for your assigned courses</p>
        </div>
        <button 
          onClick={handleOpenModal}
          disabled={!selectedCourse}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors text-sm font-bold shadow-lg ${
            selectedCourse 
              ? 'bg-orange-600 text-white hover:bg-orange-700 shadow-orange-500/20' 
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          <Plus size={16} /> Add Content
        </button>
      </div>

      {/* Course Selection */}
      <div className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
        <div className="max-w-md">
          <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Select Course</label>
          <div className="relative">
            <BookOpen className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <select 
              value={selectedCourse}
              onChange={(e) => setSelectedCourse(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              <option value="">-- Select One of Your Courses --</option>
              {myCourses.map(c => <option key={c.code} value={c.code}>{c.code} - {c.title}</option>)}
            </select>
          </div>
        </div>
      </div>

      {/* Content Area */}
      {!selectedCourse ? (
        <div className="flex flex-col items-center justify-center py-20 bg-gray-50 dark:bg-gray-900/50 rounded-2xl border-2 border-dashed border-gray-200 dark:border-gray-700">
          <Folder size={48} className="text-gray-300 mb-4" />
          <h3 className="text-lg font-bold text-gray-500 dark:text-gray-400">Select a course to view content</h3>
          <p className="text-sm text-gray-400">Choose a course from the dropdown above to manage its materials.</p>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">
              {myCourses.find(c => c.code === selectedCourse)?.title} ({selectedCourse})
            </h2>
            <span className="text-sm text-gray-500">{modules.length} Modules Available</span>
          </div>

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
                      {item.allowDownload && (
                        <button className="p-2 text-gray-400 hover:text-orange-600 hover:bg-orange-50 dark:hover:bg-orange-900/20 rounded-lg transition-colors">
                          <Download size={18} />
                        </button>
                      )}
                    </div>
                  ))}
                  {module.items.length === 0 && (
                    <p className="text-sm text-gray-400 italic pl-4">No content items yet.</p>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Add Content Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-xl border border-gray-200 dark:border-gray-700">
            <div className="sticky top-0 bg-white dark:bg-gray-800 p-6 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center z-10">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Upload Course Content</h2>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
              >
                <X size={20} className="text-gray-500" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Course Code</label>
                  <input 
                    type="text" 
                    name="courseCode"
                    value={formData.courseCode}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-700 text-gray-500 cursor-not-allowed"
                    readOnly
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Course Title</label>
                  <input 
                    type="text" 
                    name="courseTitle"
                    value={formData.courseTitle}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-700 text-gray-500 cursor-not-allowed"
                    readOnly
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Topic / Week Title</label>
                <input 
                  type="text" 
                  name="topic"
                  value={formData.topic}
                  onChange={handleInputChange}
                  placeholder="e.g. Week 3: Data Structures"
                  className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 focus:ring-2 focus:ring-orange-500 outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Description</label>
                <textarea 
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={3}
                  placeholder="Brief description of the content..."
                  className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 focus:ring-2 focus:ring-orange-500 outline-none resize-none"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Upload Date</label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input 
                      type="date" 
                      name="uploadDate"
                      value={formData.uploadDate}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 focus:ring-2 focus:ring-orange-500 outline-none"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Upload Documents</label>
                <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl p-8 text-center hover:border-orange-500 dark:hover:border-orange-400 transition-colors cursor-pointer bg-gray-50 dark:bg-gray-900/50">
                  <input 
                    type="file" 
                    id="content-upload" 
                    className="hidden"
                    multiple
                    accept=".pdf,.doc,.docx,.ppt,.pptx"
                    onChange={handleFileChange}
                  />
                  <label htmlFor="content-upload" className="cursor-pointer">
                    <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Upload size={24} />
                    </div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white mb-1">
                      {formData.files && formData.files.length > 0 
                        ? `${formData.files.length} file(s) selected` 
                        : 'Click to upload files or drag and drop'}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      PDF, PPTX, DOCX (Max. 50MB)
                    </p>
                  </label>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <input 
                  type="checkbox" 
                  id="allowDownload"
                  name="allowDownload"
                  checked={formData.allowDownload}
                  onChange={handleCheckboxChange}
                  className="w-4 h-4 text-orange-600 rounded border-gray-300 focus:ring-orange-500"
                />
                <label htmlFor="allowDownload" className="text-sm text-gray-700 dark:text-gray-300 cursor-pointer select-none">
                  Allow students to download this content
                </label>
              </div>

              <div className="flex justify-end pt-4 border-t border-gray-200 dark:border-gray-700">
                <button 
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-6 py-2 mr-3 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-lg font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="px-6 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg font-medium transition-colors shadow-lg shadow-orange-500/20"
                >
                  Upload Content
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default StaffCourseContent;
