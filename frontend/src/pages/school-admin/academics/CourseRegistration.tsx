import React, { useState, useMemo } from 'react';
import { 
  BookOpen, 
  Plus, 
  Trash2, 
  Save, 
  Search, 
  Filter,
  CheckCircle,
  AlertCircle,
  ChevronDown,
  Info
} from 'lucide-react';

// --- Interfaces ---

interface Course {
  id: string;
  code: string;
  title: string;
  units: number;
  type: 'compulsory' | 'elective' | 'required';
  department?: string;
}

// --- Mock Data ---

const mockDepartments = [
  { id: 'csc', name: 'Computer Science', faculty: 'Science' },
  { id: 'mth', name: 'Mathematics', faculty: 'Science' },
  { id: 'eng', name: 'English', faculty: 'Arts' },
  { id: 'eee', name: 'Electrical Engineering', faculty: 'Engineering' },
];

const mockLevels = ['100', '200', '300', '400', '500'];

const globalCourseBank: Course[] = [
  { id: '1', code: 'CSC 101', title: 'Introduction to Computer Science', units: 3, type: 'compulsory' },
  { id: '2', code: 'MTH 101', title: 'General Mathematics I', units: 3, type: 'compulsory' },
  { id: '3', code: 'PHY 101', title: 'General Physics I', units: 3, type: 'compulsory' },
  { id: '4', code: 'GST 101', title: 'Use of English', units: 2, type: 'compulsory' },
  { id: '5', code: 'CHM 101', title: 'General Chemistry I', units: 3, type: 'elective' },
  { id: '6', code: 'CSC 102', title: 'Introduction to Programming', units: 3, type: 'compulsory' },
  { id: '7', code: 'MTH 102', title: 'General Mathematics II', units: 3, type: 'compulsory' },
  { id: '8', code: 'PHY 102', title: 'General Physics II', units: 3, type: 'compulsory' },
  { id: '9', code: 'GST 102', title: 'Philosophy and Logic', units: 2, type: 'compulsory' },
  { id: '10', code: 'CSC 201', title: 'Data Structures', units: 4, type: 'compulsory' },
  { id: '11', code: 'CSC 202', title: 'Operating Systems', units: 3, type: 'compulsory' },
];

export default function CourseAllocation() {
  // Selection State
  const [selectedDepartment, setSelectedDepartment] = useState<string>('');
  const [selectedLevel, setSelectedLevel] = useState<string>('');
  const [selectedSemester, setSelectedSemester] = useState<'1' | '2'>('1');
  
  // Data State
  // In a real app, this would be fetched based on the selection
  // Structure: { [dept_level_semester]: Course[] }
  const [allocations, setAllocations] = useState<Record<string, Course[]>>(() => {
    const saved = localStorage.getItem('course_allocations');
    return saved ? JSON.parse(saved) : {};
  });
  
  // Modal State
  const [showAddModal, setShowAddModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Save to local storage whenever allocations change
  React.useEffect(() => {
    localStorage.setItem('course_allocations', JSON.stringify(allocations));
  }, [allocations]);

  // Helper to generate key for allocation map
  const getAllocationKey = (dept: string, level: string, sem: string) => `${dept}_${level}_${sem}`;

  // Get currently assigned courses
  const currentCourses = useMemo(() => {
    if (!selectedDepartment || !selectedLevel) return [];
    const key = getAllocationKey(selectedDepartment, selectedLevel, selectedSemester);
    return allocations[key] || [];
  }, [selectedDepartment, selectedLevel, selectedSemester, allocations]);

  // Calculate total units
  const totalUnits = useMemo(() => {
    return currentCourses.reduce((sum, course) => sum + course.units, 0);
  }, [currentCourses]);

  // Handlers
  const handleAddCourse = (course: Course) => {
    if (!selectedDepartment || !selectedLevel) return;
    
    const key = getAllocationKey(selectedDepartment, selectedLevel, selectedSemester);
    const current = allocations[key] || [];
    
    // Check if already exists
    if (current.find(c => c.id === course.id)) return;

    setAllocations({
      ...allocations,
      [key]: [...current, course]
    });
    setShowAddModal(false);
  };

  const handleRemoveCourse = (courseId: string) => {
    const key = getAllocationKey(selectedDepartment, selectedLevel, selectedSemester);
    setAllocations({
      ...allocations,
      [key]: allocations[key].filter(c => c.id !== courseId)
    });
  };

  const handleUpdateCourseType = (courseId: string, newType: Course['type']) => {
    const key = getAllocationKey(selectedDepartment, selectedLevel, selectedSemester);
    setAllocations({
      ...allocations,
      [key]: allocations[key].map(c => c.id === courseId ? { ...c, type: newType } : c)
    });
  };

  const handleSave = () => {
    // API Call to save configuration
    alert(`Saved ${currentCourses.length} courses for ${selectedDepartment} Level ${selectedLevel} Semester ${selectedSemester}`);
  };

  // Filter available courses for modal
  const filteredAvailableCourses = globalCourseBank.filter(course => {
    const isAlreadyAdded = currentCourses.some(c => c.id === course.id);
    const matchesSearch = 
      course.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      course.code.toLowerCase().includes(searchQuery.toLowerCase());
    return !isAlreadyAdded && matchesSearch;
  });

  const isSelectionComplete = selectedDepartment && selectedLevel;

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <BookOpen className="text-blue-600" />
          Departmental Course Allocation
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">
          Configure the courses students are required to take for each level and semester.
        </p>
      </div>

      {/* Configuration Panel */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Department Selection */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Department</label>
            <div className="relative">
              <select
                className="w-full appearance-none bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg px-4 py-2.5 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                value={selectedDepartment}
                onChange={(e) => setSelectedDepartment(e.target.value)}
              >
                <option value="">Select Department</option>
                {mockDepartments.map(dept => (
                  <option key={dept.id} value={dept.id}>{dept.name}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
            </div>
          </div>

          {/* Level Selection */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Level</label>
            <div className="relative">
              <select
                className="w-full appearance-none bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg px-4 py-2.5 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                value={selectedLevel}
                onChange={(e) => setSelectedLevel(e.target.value)}
              >
                <option value="">Select Level</option>
                {mockLevels.map(level => (
                  <option key={level} value={level}>{level} Level</option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
            </div>
          </div>

          {/* Semester Selection */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Semester</label>
            <div className="flex bg-gray-100 dark:bg-gray-900 p-1 rounded-lg">
              <button
                onClick={() => setSelectedSemester('1')}
                className={`flex-1 py-1.5 text-sm font-medium rounded-md transition-all ${
                  selectedSemester === '1'
                    ? 'bg-white dark:bg-gray-800 text-blue-600 shadow-sm'
                    : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
                }`}
              >
                1st Semester
              </button>
              <button
                onClick={() => setSelectedSemester('2')}
                className={`flex-1 py-1.5 text-sm font-medium rounded-md transition-all ${
                  selectedSemester === '2'
                    ? 'bg-white dark:bg-gray-800 text-blue-600 shadow-sm'
                    : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
                }`}
              >
                2nd Semester
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      {isSelectionComplete ? (
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
          <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
            <div className="flex items-center gap-4">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">Assigned Courses</h2>
              <div className="px-3 py-1 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-full text-xs font-bold border border-blue-100 dark:border-blue-800">
                Total Units: {totalUnits}
              </div>
            </div>
            <div className="flex gap-3">
              <button 
                onClick={() => setShowAddModal(true)}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-bold transition-colors shadow-sm"
              >
                <Plus size={16} /> Add Course
              </button>
              <button 
                onClick={handleSave}
                disabled={currentCourses.length === 0}
                className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-sm font-bold transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Save size={16} /> Save Changes
              </button>
            </div>
          </div>

          {currentCourses.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-gray-50 dark:bg-gray-900/50 border-b border-gray-200 dark:border-gray-700 text-xs uppercase text-gray-500 font-medium">
                  <tr>
                    <th className="px-6 py-4">Course Code</th>
                    <th className="px-6 py-4">Course Title</th>
                    <th className="px-6 py-4">Units</th>
                    <th className="px-6 py-4">Type</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {currentCourses.map((course) => (
                    <tr key={course.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                      <td className="px-6 py-4 font-bold text-gray-900 dark:text-white">{course.code}</td>
                      <td className="px-6 py-4 text-gray-600 dark:text-gray-300">{course.title}</td>
                      <td className="px-6 py-4 text-gray-600 dark:text-gray-300">{course.units}</td>
                      <td className="px-6 py-4">
                        <select 
                          value={course.type}
                          onChange={(e) => handleUpdateCourseType(course.id, e.target.value as Course['type'])}
                          className={`px-3 py-1 rounded-lg text-xs font-bold border outline-none cursor-pointer ${
                            course.type === 'compulsory' 
                              ? 'bg-red-50 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800' 
                              : course.type === 'required'
                              ? 'bg-yellow-50 text-yellow-700 border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-400 dark:border-yellow-800'
                              : 'bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800'
                          }`}
                        >
                          <option value="compulsory">Compulsory</option>
                          <option value="required">Required</option>
                          <option value="elective">Elective</option>
                        </select>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button 
                          onClick={() => handleRemoveCourse(course.id)}
                          className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                        >
                          <Trash2 size={18} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-12 text-center">
              <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400">
                <BookOpen size={32} />
              </div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">No Courses Assigned</h3>
              <p className="text-gray-500 dark:text-gray-400 mt-1 max-w-sm mx-auto">
                There are no courses assigned to this department and level for the {selectedSemester === '1' ? '1st' : '2nd'} semester yet.
              </p>
              <button 
                onClick={() => setShowAddModal(true)}
                className="mt-6 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-bold transition-colors shadow-sm"
              >
                Add First Course
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-dashed border-gray-300 dark:border-gray-700 p-12 text-center">
           <div className="w-16 h-16 bg-blue-50 dark:bg-blue-900/20 rounded-full flex items-center justify-center mx-auto mb-4 text-blue-500">
             <Info size={32} />
           </div>
           <h3 className="text-lg font-bold text-gray-900 dark:text-white">Select Configuration</h3>
           <p className="text-gray-500 dark:text-gray-400 mt-1">
             Please select a Department and Level above to start managing courses.
           </p>
        </div>
      )}

      {/* Add Course Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-2xl overflow-hidden border border-gray-200 dark:border-gray-700 flex flex-col max-h-[80vh]">
            <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
              <h3 className="font-bold text-lg text-gray-900 dark:text-white">Add Course to Curriculum</h3>
              <button 
                onClick={() => setShowAddModal(false)}
                className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
              >
                <Trash2 className="rotate-45" size={24} /> {/* Using Trash2 as close icon temporarily or replace with X */}
              </button>
            </div>
            
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input 
                  type="text" 
                  placeholder="Search course code or title..." 
                  className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none dark:text-white"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-2">
              {filteredAvailableCourses.length > 0 ? (
                <div className="grid gap-2">
                  {filteredAvailableCourses.map(course => (
                    <div key={course.id} className="flex items-center justify-between p-3 hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded-lg border border-transparent hover:border-gray-200 dark:hover:border-gray-700 transition-all group">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-blue-600 dark:text-blue-400 font-bold text-xs">
                          {course.code.split(' ')[0]}
                        </div>
                        <div>
                          <h4 className="font-bold text-gray-900 dark:text-white text-sm">{course.code}</h4>
                          <p className="text-xs text-gray-500 dark:text-gray-400">{course.title}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="text-xs font-medium text-gray-500">{course.units} Units</span>
                        <button 
                          onClick={() => handleAddCourse(course)}
                          className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-md transition-colors shadow-sm"
                        >
                          Add
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-10">
                  <p className="text-gray-500 dark:text-gray-400 text-sm">No courses found matching your search.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
