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
  ChevronRight,
  Filter,
  X,
  Upload,
  Calendar,
  BookOpen
} from 'lucide-react';

interface ContentItem {
  id: number;
  title: string;
  type: 'pdf' | 'video' | 'doc' | 'slide' | 'link';
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

const CourseContent: React.FC = () => {
  const [expandedModules, setExpandedModules] = useState<number[]>([1]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Filters State
  const [selectedFaculty, setSelectedFaculty] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [selectedProgramme, setSelectedProgramme] = useState('');
  const [selectedCourse, setSelectedCourse] = useState('');

  // Form State
  const [formData, setFormData] = useState({
    courseTitle: '',
    courseCode: '',
    topic: '',
    description: '',
    uploadDate: new Date().toISOString().split('T')[0],
    contentType: 'file', // file or link
    linkUrl: '',
    allowDownload: true,
    files: null as FileList | null
  });

  // Mock Data for Dropdowns
  const faculties = ['Faculty of Science', 'Faculty of Engineering', 'Faculty of Arts'];
  const departments = ['Computer Science', 'Electrical Engineering', 'English'];
  const programmes = ['HND Computer Science', 'B.Eng. Electrical', 'B.A. English'];
  const courses = [
    { code: 'CSC 401', title: 'Advanced Software Engineering' },
    { code: 'CSC 402', title: 'Artificial Intelligence' },
    { code: 'ENG 301', title: 'Digital Logic Design' }
  ];

  // Mock Modules Data (would be filtered by course in real app)
  const [modules, setModules] = useState<Module[]>([
    {
      id: 1,
      title: 'Week 1: Introduction to Software Engineering',
      description: 'Overview of SDLC models and methodologies.',
      items: [
        { id: 1, title: 'Lecture Slides - Week 1', type: 'slide', size: '2.4 MB', date: '2024-03-10', allowDownload: true },
        { id: 2, title: 'Introduction Video', type: 'video', size: '15 mins', date: '2024-03-10', allowDownload: false },
        { id: 3, title: 'Reading List', type: 'doc', size: '150 KB', date: '2024-03-10', allowDownload: true },
      ]
    },
    {
      id: 2,
      title: 'Week 2: Requirements Engineering',
      description: 'Techniques for gathering and analyzing requirements.',
      items: [
        { id: 4, title: 'Lecture Slides - Week 2', type: 'pdf', size: '1.8 MB', date: '2024-03-17', allowDownload: true },
        { id: 5, title: 'Case Study: Hospital System', type: 'link', size: 'External', date: '2024-03-17', allowDownload: true },
      ]
    },
  ]);

  const toggleModule = (id: number) => {
    setExpandedModules(prev => 
      prev.includes(id) ? prev.filter(m => m !== id) : [...prev, id]
    );
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'video': return <Video size={18} className="text-red-500" />;
      case 'link': return <LinkIcon size={18} className="text-blue-500" />;
      case 'slide': return <BookOpen size={18} className="text-orange-500" />;
      default: return <FileText size={18} className="text-gray-500" />;
    }
  };

  const handleOpenModal = () => {
    // Pre-fill course info if selected
    const course = courses.find(c => c.code === selectedCourse);
    setFormData(prev => ({
      ...prev,
      courseTitle: course ? course.title : '',
      courseCode: selectedCourse || '',
      topic: '',
      description: '',
      uploadDate: new Date().toISOString().split('T')[0],
      contentType: 'file',
      linkUrl: '',
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
    // In a real app, this would send data to backend
    
    // Mock adding a new module/item for demonstration
    const newItem: ContentItem = {
      id: Date.now(),
      title: formData.files && formData.files[0] ? formData.files[0].name : (formData.linkUrl || 'New Content'),
      type: formData.contentType === 'link' ? 'link' : 'pdf', // Mock type
      size: formData.files && formData.files[0] ? `${(formData.files[0].size / 1024 / 1024).toFixed(1)} MB` : 'External',
      date: formData.uploadDate,
      allowDownload: formData.allowDownload
    };

    setModules(prev => {
      const existingModuleIndex = prev.findIndex(m => m.title === formData.topic);
      
      if (existingModuleIndex >= 0) {
        // Add to existing module
        const updatedModules = [...prev];
        updatedModules[existingModuleIndex] = {
          ...updatedModules[existingModuleIndex],
          items: [...updatedModules[existingModuleIndex].items, newItem]
        };
        return updatedModules;
      } else {
        // Create new module
        const newModule: Module = {
          id: Date.now() + 1,
          title: formData.topic || 'New Week/Topic',
          description: formData.description,
          items: [newItem]
        };
        return [...prev, newModule];
      }
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
          <p className="text-gray-500 dark:text-gray-400">Manage learning materials and resources</p>
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

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm grid grid-cols-1 md:grid-cols-4 gap-4">
        <div>
          <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Faculty</label>
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <select 
              value={selectedFaculty}
              onChange={(e) => setSelectedFaculty(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              <option value="">Select Faculty</option>
              {faculties.map(f => <option key={f} value={f}>{f}</option>)}
            </select>
          </div>
        </div>
        <div>
          <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Department</label>
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <select 
              value={selectedDepartment}
              onChange={(e) => setSelectedDepartment(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              <option value="">Select Department</option>
              {departments.map(d => <option key={d} value={d}>{d}</option>)}
            </select>
          </div>
        </div>
        <div>
          <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Programme</label>
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <select 
              value={selectedProgramme}
              onChange={(e) => setSelectedProgramme(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              <option value="">Select Programme</option>
              {programmes.map(p => <option key={p} value={p}>{p}</option>)}
            </select>
          </div>
        </div>
        <div>
          <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Course</label>
          <div className="relative">
            <BookOpen className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <select 
              value={selectedCourse}
              onChange={(e) => setSelectedCourse(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              <option value="">Select Course</option>
              {courses.map(c => <option key={c.code} value={c.code}>{c.code} - {c.title}</option>)}
            </select>
          </div>
        </div>
      </div>

      {/* Content Area */}
      {!selectedCourse ? (
        <div className="flex flex-col items-center justify-center py-20 bg-gray-50 dark:bg-gray-900/50 rounded-2xl border-2 border-dashed border-gray-200 dark:border-gray-700">
          <Folder size={48} className="text-gray-300 mb-4" />
          <h3 className="text-lg font-bold text-gray-500 dark:text-gray-400">Select a course to view content</h3>
          <p className="text-sm text-gray-400">Use the filters above to navigate to a specific course.</p>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">
              {courses.find(c => c.code === selectedCourse)?.title} ({selectedCourse})
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
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Content Type</label>
                  <select 
                    name="contentType"
                    value={formData.contentType}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 focus:ring-2 focus:ring-orange-500 outline-none"
                  >
                    <option value="file">File Upload (PDF, Slides, Video)</option>
                    <option value="link">External Link</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {formData.contentType === 'file' ? 'Upload Files' : 'External Link URL'}
                </label>
                
                {formData.contentType === 'file' ? (
                  <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl p-8 text-center hover:border-orange-500 dark:hover:border-orange-400 transition-colors cursor-pointer bg-gray-50 dark:bg-gray-900/50">
                    <input 
                      type="file" 
                      id="content-upload" 
                      className="hidden" 
                      multiple
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
                        PDF, MP4, PPTX, DOCX (Max. 50MB)
                      </p>
                    </label>
                  </div>
                ) : (
                  <div className="relative">
                     <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                     <input 
                      type="url" 
                      name="linkUrl"
                      value={formData.linkUrl}
                      onChange={handleInputChange}
                      placeholder="https://..."
                      className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 focus:ring-2 focus:ring-orange-500 outline-none"
                    />
                  </div>
                )}
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

export default CourseContent;
