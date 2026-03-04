import React, { useState, useMemo } from 'react';
import { Link, ArrowRight, Search, Plus, Trash2 } from 'lucide-react';

// --- Interfaces ---

interface Course {
  id: string;
  code: string;
  title: string;
  type: 'core' | 'elective' | 'general';
  level: string; // e.g. "100 Level"
  programmeId: string;
}

interface Prerequisite {
  id: string;
  courseId: string; // The course that has a prerequisite
  prerequisiteCourseId: string; // The required course
  minGrade?: string; // Optional min grade
}

interface Programme {
  id: string;
  name: string;
}

// --- Mock Data ---

const programmes: Programme[] = [
  { id: 'prog-1', name: 'HND Computer Science' },
  { id: 'prog-2', name: 'HND Mathematics' },
];

const courses: Course[] = [
  { id: 'crs-1', code: 'CSC101', title: 'Introduction to Computer Science', type: 'core', level: '100 Level', programmeId: 'prog-1' },
  { id: 'crs-2', code: 'CSC102', title: 'Introduction to Programming', type: 'core', level: '100 Level', programmeId: 'prog-1' },
  { id: 'crs-3', code: 'MTH101', title: 'General Mathematics I', type: 'general', level: '100 Level', programmeId: 'prog-1' },
  { id: 'crs-4', code: 'CSC201', title: 'Data Structures', type: 'core', level: '200 Level', programmeId: 'prog-1' },
  { id: 'crs-5', code: 'CSC202', title: 'Object Oriented Programming', type: 'core', level: '200 Level', programmeId: 'prog-1' },
];

const initialPrerequisites: Prerequisite[] = [
  { id: 'pre-1', courseId: 'crs-2', prerequisiteCourseId: 'crs-1', minGrade: 'C' },
  { id: 'pre-2', courseId: 'crs-5', prerequisiteCourseId: 'crs-2', minGrade: 'C' },
];

const CoursePrerequisites: React.FC = () => {
  const [selectedProgramme, setSelectedProgramme] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState('');
  const [prerequisites, setPrerequisites] = useState<Prerequisite[]>(initialPrerequisites);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // New Prerequisite Form State
  const [targetCourseId, setTargetCourseId] = useState('');
  const [requiredCourseId, setRequiredCourseId] = useState('');
  const [minGrade, setMinGrade] = useState('C');

  // Filter courses by programme
  const filteredCourses = useMemo(() => {
    return selectedProgramme 
      ? courses.filter(c => c.programmeId === selectedProgramme)
      : [];
  }, [selectedProgramme]);

  // Filter prerequisites display
  const displayedPrerequisites = useMemo(() => {
    return prerequisites.filter(p => {
      const course = courses.find(c => c.id === p.courseId);
      const reqCourse = courses.find(c => c.id === p.prerequisiteCourseId);
      
      // Filter by programme
      if (selectedProgramme && course?.programmeId !== selectedProgramme) return false;

      // Search filter
      if (searchTerm) {
        const term = searchTerm.toLowerCase();
        return (
          course?.code.toLowerCase().includes(term) ||
          course?.title.toLowerCase().includes(term) ||
          reqCourse?.code.toLowerCase().includes(term) ||
          reqCourse?.title.toLowerCase().includes(term)
        );
      }
      
      return true;
    });
  }, [prerequisites, selectedProgramme, searchTerm]);

  const handleAddPrerequisite = (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetCourseId || !requiredCourseId) return;

    if (targetCourseId === requiredCourseId) {
      alert("A course cannot be a prerequisite for itself.");
      return;
    }

    const newPrereq: Prerequisite = {
      id: Math.random().toString(36).substr(2, 9),
      courseId: targetCourseId,
      prerequisiteCourseId: requiredCourseId,
      minGrade
    };

    setPrerequisites([...prerequisites, newPrereq]);
    setIsModalOpen(false);
    setTargetCourseId('');
    setRequiredCourseId('');
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to remove this prerequisite?')) {
      setPrerequisites(prerequisites.filter(p => p.id !== id));
    }
  };

  const getCourse = (id: string) => courses.find(c => c.id === id);

  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
            <Link className="text-teal-600" />
            Course Pre-requisites
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Map dependencies between courses to enforce academic progression.
          </p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors flex items-center gap-2"
        >
          <Plus size={20} />
          Add Mapping
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Filter by Programme</label>
          <select 
            className="w-full p-2.5 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white text-sm"
            value={selectedProgramme}
            onChange={(e) => setSelectedProgramme(e.target.value)}
          >
            <option value="">All Programmes</option>
            {programmes.map(p => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>
        </div>
        <div className="flex-1">
          <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Search Courses</label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input 
              type="text" 
              placeholder="Search course code or title..." 
              className="w-full pl-9 p-2.5 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white text-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Mapping List */}
      <div className="grid grid-cols-1 gap-4">
        {displayedPrerequisites.length > 0 ? (
          displayedPrerequisites.map(p => {
            const target = getCourse(p.courseId);
            const required = getCourse(p.prerequisiteCourseId);
            return (
              <div key={p.id} className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4 group">
                <div className="flex items-center gap-6 flex-1 w-full">
                  {/* Target Course */}
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-mono font-bold text-lg text-gray-900 dark:text-white">{target?.code}</span>
                      <span className={`px-2 py-0.5 text-[10px] font-bold uppercase rounded ${
                        target?.type === 'core' ? 'bg-blue-50 text-blue-600' : 'bg-amber-50 text-amber-600'
                      }`}>{target?.type}</span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{target?.title}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{target?.level}</p>
                  </div>

                  {/* Arrow Indicator */}
                  <div className="flex flex-col items-center justify-center text-gray-400 px-4">
                    <span className="text-[10px] font-bold uppercase mb-1 text-teal-600">Requires</span>
                    <ArrowRight size={24} />
                    {p.minGrade && <span className="text-[10px] bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded mt-1">Min Grade: {p.minGrade}</span>}
                  </div>

                  {/* Prerequisite Course */}
                  <div className="flex-1 text-right md:text-left">
                    <div className="flex items-center gap-2 mb-1 md:justify-start justify-end">
                      <span className="font-mono font-bold text-lg text-gray-900 dark:text-white">{required?.code}</span>
                      <span className={`px-2 py-0.5 text-[10px] font-bold uppercase rounded ${
                        required?.type === 'core' ? 'bg-blue-50 text-blue-600' : 'bg-amber-50 text-amber-600'
                      }`}>{required?.type}</span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{required?.title}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{required?.level}</p>
                  </div>
                </div>

                <div className="md:border-l md:border-gray-200 dark:md:border-gray-700 md:pl-6 flex items-center">
                  <button 
                    onClick={() => handleDelete(p.id)}
                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            );
          })
        ) : (
          <div className="p-12 text-center bg-white dark:bg-gray-800 rounded-xl border border-dashed border-gray-300 dark:border-gray-700">
            <Link className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">No mappings found</h3>
            <p className="text-gray-500 dark:text-gray-400 mt-1">Select a programme or add a new prerequisite mapping.</p>
          </div>
        )}
      </div>

      {/* Add Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-lg p-6 animate-scale-in">
            <h2 className="text-xl font-bold mb-4 dark:text-white">Add Prerequisite Mapping</h2>
            <form onSubmit={handleAddPrerequisite} className="space-y-4">
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Target Course (The course being taken)</label>
                <select 
                  required
                  className="w-full p-2.5 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                  value={targetCourseId}
                  onChange={e => setTargetCourseId(e.target.value)}
                >
                  <option value="">Select Target Course...</option>
                  {filteredCourses.map(c => (
                    <option key={c.id} value={c.id}>{c.code} - {c.title}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Prerequisite Course (Must be passed first)</label>
                <select 
                  required
                  className="w-full p-2.5 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                  value={requiredCourseId}
                  onChange={e => setRequiredCourseId(e.target.value)}
                  disabled={!targetCourseId}
                >
                  <option value="">Select Prerequisite...</option>
                  {filteredCourses
                    .filter(c => c.id !== targetCourseId) // Exclude target course
                    .map(c => (
                    <option key={c.id} value={c.id}>{c.code} - {c.title}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Minimum Grade Required</label>
                <select 
                  className="w-full p-2.5 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                  value={minGrade}
                  onChange={e => setMinGrade(e.target.value)}
                >
                  <option value="A">A</option>
                  <option value="B">B</option>
                  <option value="C">C</option>
                  <option value="D">D</option>
                  <option value="E">E</option>
                </select>
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <button 
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700"
                >
                  Create Mapping
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CoursePrerequisites;
