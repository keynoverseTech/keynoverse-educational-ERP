import React, { useMemo, useState } from 'react';
import { 
  CheckCircle, 
  AlertCircle, 
  Search, 
  Filter, 
  ArrowRight, 
  FileText, 
  ShieldAlert,
  Download,
  TrendingUp
} from 'lucide-react';
import { useAlumni } from '../../../state/alumniState';
import { loadAcademicDepartments, loadAcademicFaculties, loadAcademicLevels, loadAcademicSessions } from '../../../state/academics/academicSetupStorage';

interface Student {
  id: string;
  name: string;
  matricNo: string;
  faculty: string;
  department: string;
  currentLevel: string;
  cgpa: number;
  creditsPassed: number;
  creditsRegistered: number;
  status: 'Eligible' | 'Probation' | 'Withdrawn' | 'Outstanding' | 'Graduated';
  remark?: string;
}

const LevelPromotion: React.FC = () => {
  const { alumni, setAlumni } = useAlumni();
  const [activeTab, setActiveTab] = useState<'Eligible' | 'Probation' | 'Withdrawn' | 'Outstanding' | 'Graduated'>('Eligible');
  const [selectedFaculty, setSelectedFaculty] = useState('All Faculties');
  const [selectedDept, setSelectedDept] = useState('All Departments');
  const storedLevels = useMemo(() => {
    const stored = loadAcademicLevels();
    if (stored.length > 0) return stored;
    return [
      { id: '1', name: '100 Level', description: 'Freshman Year' },
      { id: '2', name: '200 Level', description: 'Sophomore Year' },
      { id: '3', name: '300 Level', description: 'Junior Year' },
      { id: '4', name: '400 Level', description: 'Senior Year' },
      { id: '5', name: '500 Level', description: 'Final Year (Engineering)' },
    ];
  }, []);
  const levelNames = useMemo(() => {
    const names = storedLevels.map(l => l.name).filter(Boolean);
    const uniq = Array.from(new Set(names));
    return uniq;
  }, [storedLevels]);
  const [fromLevel, setFromLevel] = useState(levelNames[0] || '100 Level');
  const [toLevel, setToLevel] = useState(levelNames[1] || levelNames[0] || '200 Level');
  const [minCredits, setMinCredits] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStudents, setSelectedStudents] = useState<string[]>([]);
  const storedSessions = useMemo(() => {
    const stored = loadAcademicSessions();
    if (stored.length > 0) return stored;
    return [
      { id: '1', name: '2024/2025', startDate: '2024-09-01', endDate: '2025-07-30', status: 'Active' },
      { id: '2', name: '2023/2024', startDate: '2023-09-01', endDate: '2024-07-30', status: 'Closed' },
    ];
  }, []);
  const sessionNames = useMemo(() => storedSessions.map(s => s.name), [storedSessions]);
  const [currentSession, setCurrentSession] = useState(sessionNames[1] || sessionNames[0] || '2023/2024');
  const [targetSession, setTargetSession] = useState(sessionNames[0] || '2024/2025');

  // Mock Data
  const [students, setStudents] = useState<Student[]>([
    {
      id: '1', name: 'John Doe', matricNo: 'SCI/23/001', faculty: 'Faculty of Sciences', department: 'Computer Science',
      currentLevel: '100 Level', cgpa: 3.5, creditsPassed: 24, creditsRegistered: 24, status: 'Eligible'
    },
    {
      id: '2', name: 'Jane Smith', matricNo: 'SCI/23/002', faculty: 'Faculty of Sciences', department: 'Computer Science',
      currentLevel: '100 Level', cgpa: 1.2, creditsPassed: 10, creditsRegistered: 24, status: 'Probation', remark: 'Low CGPA'
    },
    {
      id: '3', name: 'Alice Johnson', matricNo: 'ENG/23/005', faculty: 'Faculty of Engineering', department: 'Electrical Engineering',
      currentLevel: '100 Level', cgpa: 4.0, creditsPassed: 24, creditsRegistered: 24, status: 'Eligible'
    },
    {
      id: '4', name: 'Bob Brown', matricNo: 'ART/23/010', faculty: 'Faculty of Sciences', department: 'Biochemistry',
      currentLevel: '200 Level', cgpa: 2.8, creditsPassed: 20, creditsRegistered: 24, status: 'Outstanding', remark: 'Missing core course'
    },
    {
      id: '5', name: 'Charlie Davis', matricNo: 'SCI/23/006', faculty: 'Faculty of Sciences', department: 'Biochemistry',
      currentLevel: '100 Level', cgpa: 0.8, creditsPassed: 5, creditsRegistered: 24, status: 'Withdrawn', remark: 'Poor Academic Performance'
    },
  ]);

  const storedFaculties = useMemo(() => {
    const stored = loadAcademicFaculties();
    if (stored.length > 0) return stored;
    return [
      { id: '1', name: 'Faculty of Engineering', code: 'ENG', status: 'Active' as const },
      { id: '2', name: 'Faculty of Sciences', code: 'SCI', status: 'Active' as const },
    ];
  }, []);
  const storedDepartments = useMemo(() => {
    const stored = loadAcademicDepartments();
    if (stored.length > 0) return stored;
    return [
      { id: '1', name: 'Computer Science', code: 'CSC', facultyId: '2', headOfDepartment: 'Dr. Sarah Connor' },
      { id: '2', name: 'Electrical Engineering', code: 'EEE', facultyId: '1' },
      { id: '3', name: 'Biochemistry', code: 'BCH', facultyId: '2' },
    ];
  }, []);
  const faculties = useMemo(() => ['All Faculties', ...storedFaculties.map(f => f.name)], [storedFaculties]);
  const selectedFacultyEntity = useMemo(() => storedFaculties.find(f => f.name === selectedFaculty), [selectedFaculty, storedFaculties]);
  const departments = useMemo(() => {
    const base = selectedFacultyEntity
      ? storedDepartments.filter(d => d.facultyId === selectedFacultyEntity.id)
      : storedDepartments;
    return ['All Departments', ...base.map(d => d.name)];
  }, [selectedFacultyEntity, storedDepartments]);
  const fromLevels = useMemo(() => levelNames, [levelNames]);
  const toLevels = useMemo(() => (levelNames.includes('Alumni') ? levelNames : [...levelNames, 'Alumni']), [levelNames]);

  const getGraduationYear = (sessionName: string) => {
    const parts = sessionName.split('/');
    const last = parts[parts.length - 1];
    const parsed = Number.parseInt(last, 10);
    return Number.isFinite(parsed) ? parsed : new Date().getFullYear();
  };

  const getClassOfDegree = (cgpa: number) => {
    if (cgpa >= 4.5) return 'First Class';
    if (cgpa >= 3.5) return 'Second Class Upper';
    if (cgpa >= 2.4) return 'Second Class Lower';
    if (cgpa >= 1.5) return 'Third Class';
    return 'Pass';
  };

  // Filtering Logic
  const filteredStudents = students.filter(student => {
    const matchesTab = student.status === activeTab;
    const matchesFaculty = selectedFaculty === 'All Faculties' || student.faculty === selectedFaculty;
    const matchesDept = selectedDept === 'All Departments' || student.department === selectedDept;
    const matchesLevel = student.currentLevel === fromLevel;
    const matchesCredits = student.creditsPassed >= minCredits;
    const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          student.matricNo.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesTab && matchesFaculty && matchesDept && matchesLevel && matchesCredits && matchesSearch;
  });

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedStudents(filteredStudents.map(s => s.id));
    } else {
      setSelectedStudents([]);
    }
  };

  const handleSelectStudent = (id: string) => {
    if (selectedStudents.includes(id)) {
      setSelectedStudents(selectedStudents.filter(s => s !== id));
    } else {
      setSelectedStudents([...selectedStudents, id]);
    }
  };

  const handleBulkPromote = () => {
    if (selectedStudents.length === 0) return;
    const isAlumniPromotion = toLevel === 'Alumni';
    const message = isAlumniPromotion 
      ? `Are you sure you want to graduate ${selectedStudents.length} students to Alumni status?`
      : `Are you sure you want to promote ${selectedStudents.length} students to ${toLevel}?`;

    if (window.confirm(message)) {
      if (isAlumniPromotion) {
        const graduationYear = getGraduationYear(targetSession);
        const toAdd = students
          .filter(s => selectedStudents.includes(s.id))
          .filter(s => !alumni.some(a => a.studentId === s.matricNo))
          .map(s => {
            const parts = s.name.trim().split(/\s+/);
            const firstName = parts[0] || s.name;
            const lastName = parts.slice(1).join(' ') || 'Alumni';
            const emailSafe = s.matricNo.toLowerCase().replace(/[^a-z0-9]+/g, '.');
            return {
              id: `alu-${Date.now()}-${s.id}`,
              studentId: s.matricNo,
              firstName,
              lastName,
              email: `${emailSafe}@alumni.nbte.edu`,
              phone: '',
              gender: 'Other' as const,
              dateOfBirth: '2000-01-01',
              program: s.department,
              department: s.department,
              faculty: s.faculty,
              graduationYear,
              cgpa: s.cgpa,
              classOfDegree: getClassOfDegree(s.cgpa),
              employmentStatus: 'Unemployed' as const,
            };
          });
        if (toAdd.length > 0) {
          setAlumni(prev => [...toAdd, ...prev]);
        }
      }

      setStudents(students.map(student => {
        if (selectedStudents.includes(student.id)) {
          return {
            ...student,
            currentLevel: toLevel,
            creditsPassed: 0,
            creditsRegistered: 0,
            status: isAlumniPromotion ? 'Graduated' : 'Eligible' as any // Update status
          };
        }
        return student;
      }));
      setSelectedStudents([]);
      alert(isAlumniPromotion 
        ? `Successfully graduated ${selectedStudents.length} students!` 
        : `Successfully promoted ${selectedStudents.length} students to ${toLevel}!`
      );
    }
  };

  const handleReviewCase = (student: Student) => {
    alert(`Reviewing case for ${student.name}\nIssue: ${student.remark || student.status}\nCGPA: ${student.cgpa}`);
  };

  const handleViewExceptions = () => {
    const exceptions = students.filter(s => s.status !== 'Eligible' && s.currentLevel === fromLevel);
    alert(`Found ${exceptions.length} students with exceptions in ${fromLevel}.`);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <TrendingUp className="text-blue-600" />
            Level Promotion Management
          </h1>
          <p className="text-gray-500 dark:text-gray-400">Promote students based on session completion and academic performance.</p>
        </div>
        <div className="flex gap-2">
          <button className="px-4 py-2 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center gap-2 shadow-sm">
            <Download size={18} />
            Export List
          </button>
        </div>
      </div>

      {/* Filters & Actions */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 space-y-6">
        <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <Filter size={20} className="text-gray-500" />
          Promotion Criteria
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
           <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">From Session</label>
            <select 
              value={currentSession}
              onChange={(e) => setCurrentSession(e.target.value)}
              className="w-full p-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            >
              {sessionNames.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
           <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">To Session</label>
            <select 
              value={targetSession}
              onChange={(e) => setTargetSession(e.target.value)}
              className="w-full p-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            >
              {sessionNames.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">From Level</label>
            <select 
              value={fromLevel} 
              onChange={(e) => setFromLevel(e.target.value)}
              className="w-full p-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            >
              {fromLevels.map(l => <option key={l} value={l}>{l}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">To Level</label>
            <select 
              value={toLevel} 
              onChange={(e) => setToLevel(e.target.value)}
              className="w-full p-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            >
              {toLevels.map(l => <option key={l} value={l}>{l}</option>)}
            </select>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-gray-100 dark:border-gray-700">
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Faculty</label>
            <select 
              value={selectedFaculty} 
              onChange={(e) => setSelectedFaculty(e.target.value)}
              className="w-full p-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            >
              {faculties.map(f => <option key={f} value={f}>{f}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Department</label>
            <select 
              value={selectedDept} 
              onChange={(e) => setSelectedDept(e.target.value)}
              className="w-full p-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            >
              {departments.map(d => <option key={d} value={d}>{d}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Min. Credits Passed</label>
            <input 
              type="number" 
              value={minCredits}
              onChange={(e) => setMinCredits(parseInt(e.target.value) || 0)}
              className="w-full p-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center gap-4 pt-4 border-t border-gray-100 dark:border-gray-700">
          <div className="relative w-full md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="Search student..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
          <div className="flex gap-2 w-full md:w-auto">
             <button 
              onClick={handleViewExceptions}
              className="px-4 py-2 text-orange-600 bg-orange-50 hover:bg-orange-100 rounded-lg flex items-center gap-2 text-sm font-medium transition-colors"
            >
              <ShieldAlert size={18} />
              View Exceptions
            </button>
            <button 
              onClick={handleBulkPromote}
              disabled={selectedStudents.length === 0}
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center gap-2 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ArrowRight size={18} />
              {toLevel === 'Alumni' ? `Graduate Selected (${selectedStudents.length})` : `Promote Selected (${selectedStudents.length})`}
            </button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 dark:border-gray-700">
        <nav className="flex space-x-8 overflow-x-auto">
          {['Eligible', 'Probation', 'Withdrawn', 'Outstanding'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as 'Eligible' | 'Probation' | 'Withdrawn' | 'Outstanding')}
              className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2 whitespace-nowrap transition-colors ${
                activeTab === tab
                  ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
              }`}
            >
              {tab === 'Eligible' && <CheckCircle size={16} />}
              {tab === 'Probation' && <AlertCircle size={16} />}
              {tab === 'Withdrawn' && <ShieldAlert size={16} />}
              {tab === 'Outstanding' && <FileText size={16} />}
              {tab}
              <span className={`ml-2 py-0.5 px-2.5 rounded-full text-xs font-medium ${
                activeTab === tab ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400' : 'bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-gray-300'
              }`}>
                {students.filter(s => s.status === tab && s.currentLevel === fromLevel && (selectedFaculty === 'All Faculties' || s.faculty === selectedFaculty) && (selectedDept === 'All Departments' || s.department === selectedDept)).length}
              </span>
            </button>
          ))}
        </nav>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead className="bg-gray-50 dark:bg-gray-900/50">
            <tr>
              <th className="p-4 w-4">
                <input 
                  type="checkbox" 
                  checked={filteredStudents.length > 0 && selectedStudents.length === filteredStudents.length}
                  onChange={handleSelectAll}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
              </th>
              <th className="p-4 text-xs font-bold text-gray-500 uppercase">Student</th>
              <th className="p-4 text-xs font-bold text-gray-500 uppercase">Academic Unit</th>
              <th className="p-4 text-xs font-bold text-gray-500 uppercase">Performance</th>
              <th className="p-4 text-xs font-bold text-gray-500 uppercase">Credits</th>
              <th className="p-4 text-xs font-bold text-gray-500 uppercase">Status</th>
              <th className="p-4 text-xs font-bold text-gray-500 uppercase text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {filteredStudents.length > 0 ? (
              filteredStudents.map(student => (
                <tr key={student.id} className="hover:bg-gray-50 dark:hover:bg-gray-900/50 transition-colors">
                  <td className="p-4">
                    <input 
                      type="checkbox" 
                      checked={selectedStudents.includes(student.id)}
                      onChange={() => handleSelectStudent(student.id)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                  </td>
                  <td className="p-4">
                    <div className="font-medium text-gray-900 dark:text-white">{student.name}</div>
                    <div className="text-xs text-gray-500">{student.matricNo}</div>
                  </td>
                  <td className="p-4">
                    <div className="text-sm text-gray-900 dark:text-white">{student.department}</div>
                    <div className="text-xs text-gray-500">{student.faculty}</div>
                  </td>
                  <td className="p-4">
                    <div className="text-sm font-semibold text-gray-900 dark:text-white">{student.cgpa.toFixed(2)} CGPA</div>
                  </td>
                  <td className="p-4">
                    <div className="text-xs text-gray-500">Passed: {student.creditsPassed}</div>
                    <div className="text-xs text-gray-500">Registered: {student.creditsRegistered}</div>
                  </td>
                  <td className="p-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                      student.status === 'Eligible' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 border-green-200 dark:border-green-900' :
                      student.status === 'Probation' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400 border-yellow-200 dark:border-yellow-900' :
                      student.status === 'Withdrawn' ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400 border-red-200 dark:border-red-900' :
                      student.status === 'Graduated' ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400 border-purple-200 dark:border-purple-900' :
                      'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400 border-blue-200 dark:border-blue-900'
                    }`}>
                      {student.status}
                    </span>
                    {student.remark && (
                      <div className="text-xs text-red-500 mt-1">{student.remark}</div>
                    )}
                  </td>
                  <td className="p-4 text-right">
                    <button 
                      onClick={() => handleReviewCase(student)}
                      className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                    >
                      Review Case
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} className="p-8 text-center text-gray-500 dark:text-gray-400">
                  No students found in this category.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default LevelPromotion;
