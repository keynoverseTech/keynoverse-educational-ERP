import { useState, useEffect } from 'react';
import { 
  Users, 
  BookOpen, 
  Clock, 
  FileText,
  Briefcase,
  Plus,
  Search,
  Filter,
  Download,
  UploadCloud,
  Archive,
  Edit,
  Trash2
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { courseMaterialService } from '../school-admin/academics/modules/CourseMaterials/service';
import type { CourseMaterial } from '../school-admin/academics/modules/CourseMaterials/types';
import UploadMaterial from '../school-admin/academics/modules/CourseMaterials/UploadMaterial';

const StaffPortal = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'materials'>('overview');
  const [materials, setMaterials] = useState<CourseMaterial[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMaterial, setEditingMaterial] = useState<CourseMaterial | undefined>(undefined);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadMaterials();
  }, []);

  const loadMaterials = () => {
    // Filter materials for the logged-in staff's assigned courses (mocking with CS101)
    setMaterials(courseMaterialService.getMaterials().filter(m => m.courseId === 'CS101' && m.status !== 'Archived'));
  };

  const handleSaveMaterial = (material: CourseMaterial) => {
    courseMaterialService.saveMaterial(material);
    loadMaterials();
    setIsModalOpen(false);
    setEditingMaterial(undefined);
  };

  const handleEditMaterial = (material: CourseMaterial) => {
    setEditingMaterial(material);
    setIsModalOpen(true);
  };

  const handleArchiveMaterial = (id: string) => {
    if (window.confirm('Are you sure you want to archive this material?')) {
      const material = materials.find(m => m.id === id);
      if (material) {
        courseMaterialService.saveMaterial({ ...material, status: 'Archived' });
        loadMaterials();
      }
    }
  };

  const handleDeleteMaterial = (id: string) => {
    if (window.confirm('Are you sure you want to delete this material?')) {
      courseMaterialService.deleteMaterial(id);
      loadMaterials();
    }
  };

  return (
    <div className="p-6 space-y-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Welcome, Dr. Sarah! 👋</h1>
          <p className="text-gray-500 dark:text-gray-400">Senior Lecturer • Computer Science Department</p>
        </div>
        <div className="flex items-center gap-3">
          <span className="px-3 py-1 bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 rounded-full text-sm font-medium border border-blue-200 dark:border-blue-800">
            Academic Staff
          </span>
          <div className="text-right">
            <p className="text-sm font-bold text-gray-900 dark:text-white">Oct 24, 2025</p>
            <p className="text-xs text-gray-500">Wednesday</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200 dark:border-gray-700">
        <button
          onClick={() => setActiveTab('overview')}
          className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
            activeTab === 'overview'
              ? 'border-blue-600 text-blue-600 dark:text-blue-400'
              : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
          }`}
        >
          Overview
        </button>
        <button
          onClick={() => setActiveTab('materials')}
          className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
            activeTab === 'materials'
              ? 'border-blue-600 text-blue-600 dark:text-blue-400'
              : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
          }`}
        >
          Course Materials
        </button>
      </div>

      {activeTab === 'overview' ? (
        <div className="space-y-6">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Students</p>
                  <h3 className="text-3xl font-bold text-gray-900 dark:text-white mt-2">142</h3>
                  <p className="text-xs text-gray-500 mt-1">Across 3 Courses</p>
                </div>
                <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
                  <Users className="text-blue-600 dark:text-blue-400" size={24} />
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Classes Today</p>
                  <h3 className="text-3xl font-bold text-gray-900 dark:text-white mt-2">2</h3>
                  <p className="text-xs text-gray-500 mt-1">Next: 10:00 AM</p>
                </div>
                <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-xl">
                  <BookOpen className="text-green-600 dark:text-green-400" size={24} />
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Pending Grading</p>
                  <h3 className="text-3xl font-bold text-gray-900 dark:text-white mt-2">24</h3>
                  <p className="text-xs text-orange-600 mt-1">Assignments</p>
                </div>
                <div className="p-3 bg-orange-50 dark:bg-orange-900/20 rounded-xl">
                  <FileText className="text-orange-600 dark:text-orange-400" size={24} />
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Leave Balance</p>
                  <h3 className="text-3xl font-bold text-gray-900 dark:text-white mt-2">12</h3>
                  <p className="text-xs text-gray-500 mt-1">Days Remaining</p>
                </div>
                <div className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-xl">
                  <Briefcase className="text-purple-600 dark:text-purple-400" size={24} />
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Assigned Courses */}
            <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
                <h2 className="text-lg font-bold text-gray-900 dark:text-white">Assigned Courses</h2>
                <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">View All</button>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {[
                    { code: 'CSC 401', title: 'Advanced Software Engineering', students: 45, schedule: 'Mon 10-12, Wed 2-4' },
                    { code: 'CSC 202', title: 'Introduction to Algorithms', students: 82, schedule: 'Tue 8-10, Thu 10-12' },
                    { code: 'CSC 499', title: 'Final Year Project Supervision', students: 15, schedule: 'By Appointment' },
                  ].map((course) => (
                    <div key={course.code} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-gray-50 dark:bg-gray-900/50 rounded-lg border border-gray-100 dark:border-gray-800 gap-4">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-sm font-bold text-blue-600 dark:text-blue-400">{course.code}</span>
                          <span className="text-sm font-medium text-gray-900 dark:text-white">{course.title}</span>
                        </div>
                        <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
                          <span className="flex items-center gap-1"><Users size={12} /> {course.students} Students</span>
                          <span className="flex items-center gap-1"><Clock size={12} /> {course.schedule}</span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Link to="/staff/grading" className="px-3 py-1 text-xs font-medium bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                          Grading
                        </Link>
                        <button 
                          onClick={() => {
                            setSearchTerm(course.code);
                            setActiveTab('materials');
                          }}
                          className="px-3 py-1 text-xs font-medium bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                        >
                          Materials
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Upcoming Classes */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
                <h2 className="text-lg font-bold text-gray-900 dark:text-white">Upcoming Classes</h2>
              </div>
              <div className="p-6">
                <div className="space-y-6">
                  {[
                    { time: '10:00 AM', course: 'CSC 401', room: 'Lecture Hall A', status: 'Next' },
                    { time: '02:00 PM', course: 'CSC 202', room: 'Lab 2', status: 'Upcoming' },
                  ].map((item, idx) => (
                    <div key={idx} className="relative pl-6 border-l-2 border-blue-500">
                      <div className="absolute -left-1.5 top-0 w-3 h-3 bg-blue-500 rounded-full border-2 border-white dark:border-gray-800" />
                      <p className="text-xs font-bold text-blue-600 dark:text-blue-400 mb-1">{item.time}</p>
                      <h4 className="text-sm font-bold text-gray-900 dark:text-white">{item.course}</h4>
                      <p className="text-xs text-gray-500">{item.room}</p>
                      {item.status === 'Next' && (
                        <span className="mt-2 inline-block px-2 py-0.5 bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 text-[10px] font-bold rounded uppercase tracking-wider">
                          In 15 Mins
                        </span>
                      )}
                    </div>
                  ))}
                </div>
                <button className="w-full mt-8 py-2 text-sm font-medium text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                  Full Timetable
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-6 animate-in fade-in duration-500">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Manage Course Materials</h2>
              <p className="text-gray-500 dark:text-gray-400 mt-1">Upload and organize lecture notes, slides, and handouts.</p>
            </div>
            <button 
              onClick={() => { setEditingMaterial(undefined); setIsModalOpen(true); }}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 shadow-sm transition-colors"
            >
              <Plus size={18} />
              <span>Upload New</span>
            </button>
          </div>

          {/* Filters & Search */}
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input 
                type="text"
                placeholder="Search by title, topic or course code..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg outline-none focus:ring-2 focus:ring-blue-500/20"
              />
            </div>
            <button className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700">
              <Filter size={18} />
              <span>Filters</span>
            </button>
          </div>

          {/* Materials Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {materials
              .filter(m => 
                m.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                m.courseId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                m.topicOrWeek.toLowerCase().includes(searchTerm.toLowerCase())
              )
              .map(material => (
              <div key={material.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden group">
                <div className="p-4 border-b border-gray-100 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-900/20">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-2">
                      <div className={`p-2 rounded-lg ${
                        material.fileType === 'PDF' ? 'bg-red-50 text-red-600' : 
                        material.fileType === 'PPTX' ? 'bg-orange-50 text-orange-600' :
                        'bg-blue-50 text-blue-600'
                      }`}>
                        <FileText size={20} />
                      </div>
                      <div>
                        <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">{material.courseId}</span>
                        <h4 className="text-sm font-bold text-gray-900 dark:text-white truncate max-w-[150px]">{material.title}</h4>
                      </div>
                    </div>
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={() => handleEditMaterial(material)}
                        className="p-1.5 text-gray-400 hover:text-blue-600 rounded"
                      >
                        <Edit size={14} />
                      </button>
                      <button 
                        onClick={() => handleArchiveMaterial(material.id)}
                        className="p-1.5 text-gray-400 hover:text-orange-600 rounded"
                      >
                        <Archive size={14} />
                      </button>
                      <button 
                        onClick={() => handleDeleteMaterial(material.id)}
                        className="p-1.5 text-gray-400 hover:text-red-600 rounded"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                </div>
                <div className="p-4 space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-500 font-medium">Topic/Week:</span>
                    <span className="text-gray-900 dark:text-white font-bold">{material.topicOrWeek}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-500 font-medium">Status:</span>
                    <span className={`px-2 py-0.5 rounded font-bold uppercase tracking-tighter text-[10px] ${
                      material.status === 'Published' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                    }`}>
                      {material.status}
                    </span>
                  </div>
                  <div className="pt-2 flex gap-2">
                    <a 
                      href={material.fileUrl} 
                      download 
                      className="flex-1 flex items-center justify-center gap-2 py-1.5 text-xs font-bold bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                    >
                      <Download size={14} />
                      Download
                    </a>
                  </div>
                </div>
              </div>
            ))}
            {materials.length === 0 && (
              <div className="col-span-full py-20 text-center bg-white dark:bg-gray-800 rounded-xl border-2 border-dashed border-gray-200 dark:border-gray-700">
                <UploadCloud className="mx-auto text-gray-300 mb-4" size={48} />
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">No Materials Uploaded</h3>
                <p className="text-gray-500 dark:text-gray-400">Start by uploading notes or slides for your students.</p>
                <button 
                  onClick={() => setIsModalOpen(true)}
                  className="mt-6 px-6 py-2 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 transition-colors"
                >
                  Upload First Material
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {isModalOpen && (
        <UploadMaterial 
          material={editingMaterial}
          onSave={handleSaveMaterial}
          onClose={() => { setIsModalOpen(false); setEditingMaterial(undefined); }}
        />
      )}
    </div>
  );
};

export default StaffPortal;
