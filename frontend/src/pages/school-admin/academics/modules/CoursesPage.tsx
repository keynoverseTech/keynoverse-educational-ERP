import React, { useState, useMemo } from 'react';
import { 
  BookOpen, 
  Plus, 
  User,
  Edit2, 
  Trash2
} from 'lucide-react';

// --- Interfaces ---

interface Faculty {
  id: string;
  name: string;
}

interface Department {
  id: string;
  name: string;
  facultyId: string;
}

interface Programme {
  id: string;
  name: string;
  departmentId: string;
  // Programmes usually run for a number of years/levels
  maxLevel: number; // e.g. 400 or 500
}

interface Level {
  id: string;
  name: string;
  value: number; // 100, 200, 300, 400
}

interface Semester {
  id: string;
  name: string;
  value: number; // 1 or 2
}

interface Staff {
  id: string;
  name: string;
  role: string;
}

interface Prerequisite {
  courseId: string;
  minGrade?: string; // e.g., 'C'
}

interface Course {
  id: string;
  code: string;
  title: string;
  creditUnits: number;
  programmeId: string;
  levelId: string; // e.g. "100"
  semesterId: string; // e.g. "1"
  status: 'active' | 'inactive';
  assignedStaffId?: string;
  prerequisites?: Prerequisite[];
  isGlobal?: boolean;
}

// --- Mock Data ---

const faculties: Faculty[] = [
  { id: 'fac-1', name: 'Faculty of Sciences' },
  { id: 'fac-2', name: 'Faculty of Engineering' },
  { id: 'fac-3', name: 'Faculty of Arts' },
];

const departments: Department[] = [
  { id: 'dept-1', name: 'Computer Science', facultyId: 'fac-1' },
  { id: 'dept-2', name: 'Mathematics', facultyId: 'fac-1' },
  { id: 'dept-3', name: 'Electrical Engineering', facultyId: 'fac-2' },
  { id: 'dept-4', name: 'Mechanical Engineering', facultyId: 'fac-2' },
];

const programmes: Programme[] = [
  { id: 'prog-1', name: 'HND Computer Science', departmentId: 'dept-1', maxLevel: 400 },
  { id: 'prog-2', name: 'HND Mathematics', departmentId: 'dept-2', maxLevel: 400 },
  { id: 'prog-3', name: 'PHD Electrical Engineering', departmentId: 'dept-3', maxLevel: 500 },
];

const levels: Level[] = [
  { id: 'lvl-100', name: '100 Level', value: 100 },
  { id: 'lvl-200', name: '200 Level', value: 200 },
  { id: 'lvl-300', name: '300 Level', value: 300 },
  { id: 'lvl-400', name: '400 Level', value: 400 },
  { id: 'lvl-500', name: '500 Level', value: 500 },
];

const semesters: Semester[] = [
  { id: 'sem-1', name: 'First Semester', value: 1 },
  { id: 'sem-2', name: 'Second Semester', value: 2 },
];

const staffMembers: Staff[] = [
  { id: 'stf-1', name: 'Dr. Alan Turing', role: 'Senior Lecturer' },
  { id: 'stf-2', name: 'Prof. Grace Hopper', role: 'Professor' },
  { id: 'stf-3', name: 'Dr. Ada Lovelace', role: 'Lecturer I' },
  { id: 'stf-4', name: 'Mr. Charles Babbage', role: 'Lecturer II' },
];

const initialCourses: Course[] = [
  { id: 'crs-1', code: 'CSC101', title: 'Introduction to Computer Science', creditUnits: 3, programmeId: 'prog-1', levelId: 'lvl-100', semesterId: 'sem-1', status: 'active', assignedStaffId: 'stf-1', prerequisites: [], isGlobal: true },
  { id: 'crs-2', code: 'CSC102', title: 'Introduction to Programming', creditUnits: 3, programmeId: 'prog-1', levelId: 'lvl-100', semesterId: 'sem-2', status: 'active', assignedStaffId: 'stf-3', prerequisites: [{ courseId: 'crs-1', minGrade: 'C' }], isGlobal: true },
  { id: 'crs-3', code: 'MTH101', title: 'General Mathematics I', creditUnits: 3, programmeId: 'prog-1', levelId: 'lvl-100', semesterId: 'sem-1', status: 'active', prerequisites: [], isGlobal: true },
  { id: 'crs-4', code: 'EEE201', title: 'Circuit Theory I', creditUnits: 4, programmeId: 'prog-3', levelId: 'lvl-200', semesterId: 'sem-1', status: 'active', assignedStaffId: 'stf-4', prerequisites: [], isGlobal: false },
];

// --- Component ---

export const CoursesPage: React.FC = () => {
  // --- State for Hierarchy Selection ---
  const [selectedFaculty, setSelectedFaculty] = useState<string>('');
  const [selectedDept, setSelectedDept] = useState<string>('');
  const [selectedProgramme, setSelectedProgramme] = useState<string>('');
  const [selectedLevel, setSelectedLevel] = useState<string>('');
  const [selectedSemester, setSelectedSemester] = useState<string>('');

  // --- State for Data ---
  const [courses, setCourses] = useState<Course[]>(initialCourses);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentCourse, setCurrentCourse] = useState<Partial<Course>>({});

  // --- Derived State (Dependent Dropdowns) ---
  
  const availableDepartments = useMemo(() => {
    return selectedFaculty 
      ? departments.filter(d => d.facultyId === selectedFaculty)
      : [];
  }, [selectedFaculty]);

  const availableProgrammes = useMemo(() => {
    return selectedDept
      ? programmes.filter(p => p.departmentId === selectedDept)
      : [];
  }, [selectedDept]);

  const availableLevels = useMemo(() => {
    if (!selectedProgramme) return [];
    const prog = programmes.find(p => p.id === selectedProgramme);
    return prog 
      ? levels.filter(l => l.value <= prog.maxLevel)
      : [];
  }, [selectedProgramme]);

  // --- Filtered Courses ---
  
  const filteredCourses = useMemo(() => {
    let result = courses;
    if (selectedProgramme) result = result.filter(c => c.programmeId === selectedProgramme);
    if (selectedLevel) result = result.filter(c => c.levelId === selectedLevel);
    if (selectedSemester) result = result.filter(c => c.semesterId === selectedSemester);
    return result;
  }, [courses, selectedProgramme, selectedLevel, selectedSemester]);

  // --- Handlers ---

  const handleFacultyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedFaculty(e.target.value);
    setSelectedDept('');
    setSelectedProgramme('');
    setSelectedLevel('');
    setSelectedSemester('');
  };

  const handleDeptChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedDept(e.target.value);
    setSelectedProgramme('');
    setSelectedLevel('');
    setSelectedSemester('');
  };

  const handleProgrammeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedProgramme(e.target.value);
    setSelectedLevel('');
    setSelectedSemester('');
  };

  const handleSaveCourse = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentCourse.id) {
      setCourses(courses.map(c => c.id === currentCourse.id ? { ...c, ...currentCourse } as Course : c));
    } else {
      const newCourse: Course = {
        ...currentCourse,
        id: Math.random().toString(36).substr(2, 9),
        status: 'active',
        // Ensure we capture the context if not explicitly set in form (though form should handle it)
        programmeId: currentCourse.programmeId || selectedProgramme,
        levelId: currentCourse.levelId || selectedLevel,
        semesterId: currentCourse.semesterId || selectedSemester,
      } as Course;
      setCourses([...courses, newCourse]);
    }
    setIsModalOpen(false);
    setCurrentCourse({});
  };



  return (
    <div className="space-y-6 p-6">
      
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-blue-100 dark:bg-blue-900/30 text-blue-600 rounded-2xl">
            <BookOpen size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Courses Catalog</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">View and manage courses and credit units.</p>
          </div>
        </div>
        <button 
          onClick={() => {
            setCurrentCourse({});
            setIsModalOpen(true);
          }}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg flex items-center gap-2 hover:bg-blue-700 transition-colors shadow-lg shadow-blue-500/20"
        >
          <Plus size={20} /> Add Course
        </button>
      </div>

      {/* --- Hierarchy Filters --- */}
      <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        
        {/* Faculty */}
        <div className="space-y-1">
          <label className="text-xs font-semibold text-gray-500 uppercase">Faculty</label>
          <select 
            className="w-full p-2 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white text-sm"
            value={selectedFaculty}
            onChange={handleFacultyChange}
          >
            <option value="">Select Faculty...</option>
            {faculties.map(f => <option key={f.id} value={f.id}>{f.name}</option>)}
          </select>
        </div>

        {/* Department */}
        <div className="space-y-1">
          <label className="text-xs font-semibold text-gray-500 uppercase">Department</label>
          <select 
            className="w-full p-2 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white text-sm disabled:opacity-50"
            value={selectedDept}
            onChange={handleDeptChange}
            disabled={!selectedFaculty}
          >
            <option value="">Select Department...</option>
            {availableDepartments.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
          </select>
        </div>

        {/* Programme */}
        <div className="space-y-1">
          <label className="text-xs font-semibold text-gray-500 uppercase">Programme</label>
          <select 
            className="w-full p-2 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white text-sm disabled:opacity-50"
            value={selectedProgramme}
            onChange={handleProgrammeChange}
            disabled={!selectedDept}
          >
            <option value="">Select Programme...</option>
            {availableProgrammes.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
          </select>
        </div>

        {/* Level */}
        <div className="space-y-1">
          <label className="text-xs font-semibold text-gray-500 uppercase">Level</label>
          <select 
            className="w-full p-2 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white text-sm disabled:opacity-50"
            value={selectedLevel}
            onChange={(e) => setSelectedLevel(e.target.value)}
            disabled={!selectedProgramme}
          >
            <option value="">All Levels</option>
            {availableLevels.map(l => <option key={l.id} value={l.id}>{l.name}</option>)}
          </select>
        </div>

        {/* Semester */}
        <div className="space-y-1">
          <label className="text-xs font-semibold text-gray-500 uppercase">Semester</label>
          <select 
            className="w-full p-2 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white text-sm disabled:opacity-50"
            value={selectedSemester}
            onChange={(e) => setSelectedSemester(e.target.value)}
            disabled={!selectedProgramme}
          >
            <option value="">All Semesters</option>
            {semesters.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
          </select>
        </div>
      </div>

      {/* --- Action Bar --- */}
      <div className="flex justify-between items-center">
        <div className="text-sm text-gray-500 dark:text-gray-400">
          Showing {filteredCourses.length} courses
          {selectedProgramme && ` for ${programmes.find(p => p.id === selectedProgramme)?.name}`}
        </div>
      </div>

      {/* --- Courses Table --- */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        {filteredCourses.length > 0 ? (
          <table className="w-full text-left border-collapse">
            <thead className="bg-gray-50 dark:bg-gray-900/50">
              <tr>
                <th className="p-4 text-xs font-bold text-gray-500 uppercase">Code</th>
                <th className="p-4 text-xs font-bold text-gray-500 uppercase">Course Title</th>
                <th className="p-4 text-xs font-bold text-gray-500 uppercase">Units</th>
                <th className="p-4 text-xs font-bold text-gray-500 uppercase">Level</th>
                <th className="p-4 text-xs font-bold text-gray-500 uppercase">Semester</th>
                <th className="p-4 text-xs font-bold text-gray-500 uppercase">Assigned Staff</th>
                <th className="p-4 text-xs font-bold text-gray-500 uppercase text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {filteredCourses.map(course => (
                <tr key={course.id} className="hover:bg-gray-50 dark:hover:bg-gray-900/50">
                  <td className="p-4 font-mono font-medium text-blue-600 dark:text-blue-400">
                    {course.code}
                  </td>
                  <td className="p-4 font-medium text-gray-900 dark:text-white">
                    <div className="flex items-center gap-2">
                      <span>{course.title}</span>
                      {course.isGlobal && (
                        <span className="px-1.5 py-0.5 bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 text-[9px] font-black uppercase rounded border border-purple-100 dark:border-purple-900/30">Global</span>
                      )}
                    </div>
                  </td>
                  <td className="p-4 text-gray-600 dark:text-gray-400 font-medium">
                    {course.creditUnits} Units
                  </td>
                  <td className="p-4 text-gray-600 dark:text-gray-400">
                    <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded text-xs">
                      {levels.find(l => l.id === course.levelId)?.name}
                    </span>
                  </td>
                  <td className="p-4 text-gray-600 dark:text-gray-400">
                    {semesters.find(s => s.id === course.semesterId)?.name}
                  </td>
                  <td className="p-4 text-gray-600 dark:text-gray-400">
                    {course.assignedStaffId ? (
                      <div className="flex items-center gap-2">
                        <User size={16} className="text-gray-400" />
                        <span className="text-sm">
                          {staffMembers.find(s => s.id === course.assignedStaffId)?.name}
                        </span>
                      </div>
                    ) : (
                      <span className="text-sm text-gray-400 italic">Unassigned</span>
                    )}
                    {course.prerequisites && course.prerequisites.length > 0 && (
                      <div className="mt-1 flex flex-wrap gap-1">
                        <span className="text-xs text-gray-400 mr-1">Prereqs:</span>
                        {course.prerequisites.map(p => {
                          const prereqCourse = courses.find(c => c.id === p.courseId);
                          return (
                            <span key={p.courseId} className="text-[10px] px-1.5 py-0.5 bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400 rounded border border-orange-200 dark:border-orange-800" title={`Requires ${prereqCourse?.title} (Min ${p.minGrade})`}>
                              {prereqCourse?.code} ({p.minGrade})
                            </span>
                          );
                        })}
                      </div>
                    )}
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button 
                        onClick={() => {
                          setCurrentCourse(course);
                          setIsModalOpen(true);
                        }}
                        className="p-1.5 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                        title="Edit Course"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button 
                        className="p-1.5 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                        title="Delete Course"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="p-12 text-center text-gray-500 dark:text-gray-400">
            {selectedProgramme 
              ? "No courses found for this selection. Click 'Add Course' to create one." 
              : "Please select a Faculty, Department, and Programme to view courses."}
          </div>
        )}
      </div>

      {/* --- Add/Edit Modal --- */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-lg p-6">
            <h2 className="text-xl font-bold mb-4 dark:text-white">
              {currentCourse.id ? 'Edit Course' : selectedProgramme ? `Add Course to ${programmes.find(p => p.id === selectedProgramme)?.name}` : 'Add New Course'}
            </h2>
            <form onSubmit={handleSaveCourse} className="space-y-4">
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Course Code</label>
                  <input 
                    type="text" 
                    required
                    className="w-full p-2 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                    placeholder="e.g. CSC101"
                    value={currentCourse.code || ''}
                    onChange={e => setCurrentCourse({...currentCourse, code: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Credit Units</label>
                  <input 
                    type="number" 
                    required
                    min="1"
                    max="6"
                    className="w-full p-2 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                    value={currentCourse.creditUnits || ''}
                    onChange={e => setCurrentCourse({...currentCourse, creditUnits: parseInt(e.target.value)})}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Course Title</label>
                <input 
                  type="text" 
                  required
                  className="w-full p-2 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                  placeholder="e.g. Introduction to Computer Science"
                  value={currentCourse.title || ''}
                  onChange={e => setCurrentCourse({...currentCourse, title: e.target.value})}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Assigned Staff (Lecturer)</label>
                <select 
                  className="w-full p-2 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                  value={currentCourse.assignedStaffId || ''}
                  onChange={e => setCurrentCourse({...currentCourse, assignedStaffId: e.target.value})}
                >
                  <option value="">Unassigned</option>
                  {staffMembers.map(staff => (
                    <option key={staff.id} value={staff.id}>
                      {staff.name} ({staff.role})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Level</label>
                  <select 
                    required
                    className="w-full p-2 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                    value={currentCourse.levelId || ''}
                    onChange={e => setCurrentCourse({...currentCourse, levelId: e.target.value})}
                  >
                    <option value="">Select Level...</option>
                    {levels.map(l => (
                      <option key={l.id} value={l.id}>{l.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Semester</label>
                  <select 
                    required
                    className="w-full p-2 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                    value={currentCourse.semesterId || ''}
                    onChange={e => setCurrentCourse({...currentCourse, semesterId: e.target.value})}
                  >
                    <option value="">Select Semester...</option>
                    {semesters.map(s => (
                      <option key={s.id} value={s.id}>{s.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Hidden Programme Field (Implicit from context or selection) */}
               {!selectedProgramme && (
                <div>
                   <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Programme</label>
                   <select 
                      required
                      className="w-full p-2 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                      value={currentCourse.programmeId || ''}
                      onChange={e => setCurrentCourse({...currentCourse, programmeId: e.target.value})}
                   >
                      <option value="">Select Programme...</option>
                      {programmes.map(p => (
                         <option key={p.id} value={p.id}>{p.name}</option>
                      ))}
                   </select>
                </div>
               )}

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
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  {currentCourse.id ? 'Save Changes' : 'Create Course'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
