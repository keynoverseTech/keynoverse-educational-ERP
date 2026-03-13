import { useEffect, useMemo, useState } from 'react';
import { Archive, Calendar, Clock, MapPin, Search, Users, Plus, X } from 'lucide-react';
import { pushNotification, type ResearchNotificationType } from '../../../../utils/researchNotifications';
import { upsertArchivedProjects, type ArchivedProject, type ArchivedProjectDocument } from '../../../../utils/researchArchive';

type DefenseStatus = 'Scheduled' | 'Completed' | 'Cancelled';

type Student = {
  id: string;
  name: string;
  matric: string;
  faculty: string;
  department: string;
  programme: string;
  projectTitle: string;
};

type Staff = {
  id: string;
  name: string;
  faculty: string;
  department: string;
};

type DefenseSession = {
  id: string;
  faculty: string;
  department: string;
  programme: string;
  students: Array<{ name: string; matric: string; projectTitle: string }>;
  date: string;
  time: string;
  venue: string;
  panel: string[];
  status: DefenseStatus;
  createdAt: string;
};

const STORAGE_KEY = 'school_admin_research_defense_schedule';
const STUDENT_NOTIFICATIONS_KEY = 'research_notifications_students';
const STAFF_NOTIFICATIONS_KEY = 'research_notifications_staff';
const SUBMISSIONS_KEY = 'school_admin_research_project_submissions';

type ProjectSubmission = {
  studentMatric: string;
  stage: string;
  title: string;
  version: string;
  uploadedAt: string;
  fileName: string;
  fileSize: string;
  fileType: string;
  status: 'Pending' | 'Approved' | 'Rejected' | 'Revision Required';
  documentUrl: string;
};

const loadProjectSubmissions = (): ProjectSubmission[] => {
  const raw = localStorage.getItem(SUBMISSIONS_KEY);
  if (!raw) return [];
  try {
    return JSON.parse(raw) as ProjectSubmission[];
  } catch {
    return [];
  }
};

const yearFromDate = (date: string): string => {
  const y = date?.slice(0, 4);
  if (y && /^\d{4}$/.test(y)) return y;
  return String(new Date().getFullYear());
};

const faculties = ['Faculty of Sciences', 'Faculty of Engineering', 'Faculty of Arts', 'Faculty of Environmental Sciences'];

const departmentsByFaculty: Record<string, string[]> = {
  'Faculty of Sciences': ['Computer Science', 'Biology', 'Physics', 'Mathematics'],
  'Faculty of Engineering': ['Electrical Engineering', 'Mechanical Engineering'],
  'Faculty of Arts': ['English', 'History'],
  'Faculty of Environmental Sciences': ['Architecture']
};

const programmesByDepartment: Record<string, string[]> = {
  'Computer Science': ['HND Computer Science'],
  Biology: ['HND Biology'],
  Physics: ['HND Physics'],
  Mathematics: ['HND Mathematics'],
  'Electrical Engineering': ['B.Eng Electrical Engineering'],
  'Mechanical Engineering': ['B.Eng Mechanical Engineering'],
  English: ['B.A English'],
  History: ['B.A History'],
  Architecture: ['HND Architecture']
};

const studentsCatalog: Student[] = [
  {
    id: 'st-1',
    name: 'John Doe',
    matric: 'CS/2020/001',
    faculty: 'Faculty of Sciences',
    department: 'Computer Science',
    programme: 'HND Computer Science',
    projectTitle: 'AI in Healthcare Diagnostics'
  },
  {
    id: 'st-2',
    name: 'Michael Brown',
    matric: 'CS/2020/042',
    faculty: 'Faculty of Sciences',
    department: 'Computer Science',
    programme: 'HND Computer Science',
    projectTitle: 'Blockchain for Voting Systems'
  },
  {
    id: 'st-3',
    name: 'Jane Smith',
    matric: 'AR/2020/015',
    faculty: 'Faculty of Environmental Sciences',
    department: 'Architecture',
    programme: 'HND Architecture',
    projectTitle: 'Sustainable Urban Planning'
  },
  {
    id: 'st-4',
    name: 'Grace Peter',
    matric: 'EE/2020/008',
    faculty: 'Faculty of Engineering',
    department: 'Electrical Engineering',
    programme: 'B.Eng Electrical Engineering',
    projectTitle: 'Smart Grid Monitoring with IoT'
  },
  {
    id: 'st-5',
    name: 'Emily White',
    matric: 'BI/2020/021',
    faculty: 'Faculty of Sciences',
    department: 'Biology',
    programme: 'HND Biology',
    projectTitle: 'Plant Disease Detection using Computer Vision'
  }
];

const staffCatalog: Staff[] = [
  { id: 'sf-1', name: 'Dr. Alan Smith', faculty: 'Faculty of Sciences', department: 'Computer Science' },
  { id: 'sf-2', name: 'Dr. Sarah', faculty: 'Faculty of Sciences', department: 'Computer Science' },
  { id: 'sf-3', name: 'Dr. Musa Ibrahim', faculty: 'Faculty of Engineering', department: 'Electrical Engineering' },
  { id: 'sf-4', name: 'Prof. Sarah Connor', faculty: 'Faculty of Environmental Sciences', department: 'Architecture' },
  { id: 'sf-5', name: 'Dr. Emily Blunt', faculty: 'Faculty of Sciences', department: 'Biology' },
  { id: 'sf-6', name: 'Dr. John Doe', faculty: 'Faculty of Sciences', department: 'Physics' }
];

const loadDefenseSessions = (): DefenseSession[] => {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return [];
  try {
    return JSON.parse(raw) as DefenseSession[];
  } catch {
    return [];
  }
};

const saveDefenseSessions = (sessions: DefenseSession[]) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions));
  } catch {
    return;
  }
};

const seedDefenseSessions = (): DefenseSession[] => [
  {
    id: 'def-1',
    faculty: 'Faculty of Sciences',
    department: 'Computer Science',
    programme: 'HND Computer Science',
    students: [
      { name: 'John Doe', matric: 'CS/2020/001', projectTitle: 'AI in Healthcare Diagnostics' },
      { name: 'Michael Brown', matric: 'CS/2020/042', projectTitle: 'Blockchain for Voting Systems' }
    ],
    date: '2024-04-15',
    time: '10:00 AM',
    venue: 'Conference Hall A',
    panel: ['Dr. Alan Smith', 'Dr. Sarah'],
    status: 'Scheduled',
    createdAt: '2024-03-20T10:00:00.000Z'
  },
  {
    id: 'def-2',
    faculty: 'Faculty of Environmental Sciences',
    department: 'Architecture',
    programme: 'HND Architecture',
    students: [{ name: 'Jane Smith', matric: 'AR/2020/015', projectTitle: 'Sustainable Urban Planning' }],
    date: '2024-04-16',
    time: '02:00 PM',
    venue: 'Room 305',
    panel: ['Prof. Sarah Connor'],
    status: 'Scheduled',
    createdAt: '2024-03-21T12:10:00.000Z'
  }
];

const DefenseScheduling = () => {
  const [viewMode, setViewMode] = useState<'calendar' | 'list'>('list');
  const [sessions, setSessions] = useState<DefenseSession[]>(() => {
    const existing = loadDefenseSessions();
    if (existing.length > 0) return existing;
    const seeded = seedDefenseSessions();
    saveDefenseSessions(seeded);
    return seeded;
  });

  const [isScheduleOpen, setIsScheduleOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [filterFaculty, setFilterFaculty] = useState('All');
  const [filterDepartment, setFilterDepartment] = useState('All');
  const [filterProgramme, setFilterProgramme] = useState('All');

  const [studentSearch, setStudentSearch] = useState('');
  const [panelSearch, setPanelSearch] = useState('');

  const [selectedStudentIds, setSelectedStudentIds] = useState<string[]>([]);
  const [selectedPanelIds, setSelectedPanelIds] = useState<string[]>([]);

  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [venue, setVenue] = useState('');

  useEffect(() => {
    saveDefenseSessions(sessions);
  }, [sessions]);

  const availableDepartments = useMemo(() => {
    if (filterFaculty === 'All') return [];
    return departmentsByFaculty[filterFaculty] ?? [];
  }, [filterFaculty]);

  const availableProgrammes = useMemo(() => {
    if (filterDepartment === 'All') return [];
    return programmesByDepartment[filterDepartment] ?? [];
  }, [filterDepartment]);

  const filteredStudents = useMemo(() => {
    const q = studentSearch.trim().toLowerCase();
    return studentsCatalog
      .filter((s) => (filterFaculty === 'All' ? true : s.faculty === filterFaculty))
      .filter((s) => (filterDepartment === 'All' ? true : s.department === filterDepartment))
      .filter((s) => (filterProgramme === 'All' ? true : s.programme === filterProgramme))
      .filter((s) => {
        if (!q) return true;
        return s.name.toLowerCase().includes(q) || s.matric.toLowerCase().includes(q) || s.projectTitle.toLowerCase().includes(q);
      });
  }, [filterDepartment, filterFaculty, filterProgramme, studentSearch]);

  const filteredStaff = useMemo(() => {
    const q = panelSearch.trim().toLowerCase();
    return staffCatalog
      .filter((s) => (filterFaculty === 'All' ? true : s.faculty === filterFaculty))
      .filter((s) => (filterDepartment === 'All' ? true : s.department === filterDepartment))
      .filter((s) => {
        if (!q) return true;
        return s.name.toLowerCase().includes(q);
      });
  }, [filterDepartment, filterFaculty, panelSearch]);

  const selectedStudents = useMemo(() => {
    const set = new Set(selectedStudentIds);
    return studentsCatalog.filter((s) => set.has(s.id));
  }, [selectedStudentIds]);

  const selectedPanel = useMemo(() => {
    const set = new Set(selectedPanelIds);
    return staffCatalog.filter((s) => set.has(s.id));
  }, [selectedPanelIds]);

  const openCreate = () => {
    setEditingId(null);
    setIsScheduleOpen(true);
    setFilterFaculty('All');
    setFilterDepartment('All');
    setFilterProgramme('All');
    setStudentSearch('');
    setPanelSearch('');
    setSelectedStudentIds([]);
    setSelectedPanelIds([]);
    setDate('');
    setTime('');
    setVenue('');
  };

  const openEdit = (session: DefenseSession) => {
    setEditingId(session.id);
    setIsScheduleOpen(true);
    setFilterFaculty(session.faculty);
    setFilterDepartment(session.department);
    setFilterProgramme(session.programme);
    setStudentSearch('');
    setPanelSearch('');
    setSelectedStudentIds(
      studentsCatalog
        .filter((s) => session.students.some((st) => st.matric === s.matric))
        .map((s) => s.id)
    );
    setSelectedPanelIds(staffCatalog.filter((sf) => session.panel.includes(sf.name)).map((sf) => sf.id));
    setDate(session.date);
    setTime(session.time);
    setVenue(session.venue);
  };

  const toggleStudent = (id: string) => {
    setSelectedStudentIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  };

  const togglePanel = (id: string) => {
    setSelectedPanelIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  };

  useEffect(() => {
    if (filterFaculty === 'All') {
      setFilterDepartment('All');
      setFilterProgramme('All');
      setSelectedStudentIds([]);
      setSelectedPanelIds([]);
      return;
    }
  }, [filterFaculty]);

  useEffect(() => {
    if (filterDepartment === 'All') {
      setFilterProgramme('All');
      setSelectedStudentIds([]);
      setSelectedPanelIds([]);
      return;
    }
  }, [filterDepartment]);

  useEffect(() => {
    setSelectedStudentIds([]);
  }, [filterProgramme]);

  const canSave = useMemo(() => {
    if (!date.trim() || !time.trim() || !venue.trim()) return false;
    if (filterFaculty === 'All' || filterDepartment === 'All' || filterProgramme === 'All') return false;
    if (selectedStudentIds.length === 0) return false;
    if (selectedPanelIds.length === 0) return false;
    return true;
  }, [date, filterDepartment, filterFaculty, filterProgramme, selectedPanelIds.length, selectedStudentIds.length, time, venue]);

  const save = () => {
    if (!canSave) return;
    const notificationType: ResearchNotificationType = editingId ? 'defense_schedule_updated' : 'defense_schedule_created';
    const session: DefenseSession = {
      id: editingId ?? `def-${Date.now()}`,
      faculty: filterFaculty,
      department: filterDepartment,
      programme: filterProgramme,
      students: selectedStudents.map((s) => ({ name: s.name, matric: s.matric, projectTitle: s.projectTitle })),
      date,
      time,
      venue,
      panel: selectedPanel.map((p) => p.name),
      status: 'Scheduled',
      createdAt: new Date().toISOString()
    };

    setSessions((prev) => {
      const next = [...prev];
      const idx = next.findIndex((s) => s.id === session.id);
      if (idx >= 0) next[idx] = { ...next[idx], ...session, createdAt: next[idx].createdAt };
      else next.unshift(session);
      return next;
    });

    const createdAt = new Date().toISOString();
    const title = notificationType === 'defense_schedule_created' ? 'Defense scheduled' : 'Defense schedule updated';
    const studentNames =
      session.students.length === 1 ? session.students[0].name : `${session.students[0].name} + ${session.students.length - 1} others`;
    const message = `${title}: ${session.department} • ${session.date} • ${session.time} • ${session.venue} • ${studentNames}`;

    session.students.forEach((st) => {
      pushNotification(STUDENT_NOTIFICATIONS_KEY, st.matric, {
        id: `notif-${session.id}-${st.matric}-${Date.now()}`,
        type: notificationType,
        title,
        message,
        createdAt,
        read: false,
        data: {
          sessionId: session.id,
          faculty: session.faculty,
          department: session.department,
          programme: session.programme,
          date: session.date,
          time: session.time,
          venue: session.venue
        }
      });
    });

    session.panel.forEach((staffName, idx) => {
      pushNotification(STAFF_NOTIFICATIONS_KEY, staffName, {
        id: `notif-${session.id}-${idx}-${Date.now()}`,
        type: notificationType,
        title,
        message,
        createdAt,
        read: false,
        data: {
          sessionId: session.id,
          faculty: session.faculty,
          department: session.department,
          programme: session.programme,
          date: session.date,
          time: session.time,
          venue: session.venue
        }
      });
    });

    setIsScheduleOpen(false);
  };

  const completeAndArchive = (defense: DefenseSession) => {
    const submissions = loadProjectSubmissions();
    const archivedAt = new Date().toISOString();
    const year = yearFromDate(defense.date);

    const toDocuments = (studentMatric: string): ArchivedProjectDocument[] => {
      const docs = submissions
        .filter((s) => s.studentMatric === studentMatric && s.status === 'Approved')
        .sort((a, b) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime());

      if (docs.length === 0) return [];

      const finalLike = docs.filter((d) => /final|thesis|complete/i.test(d.stage) || /final|thesis/i.test(d.title));
      const chosen = finalLike.length > 0 ? finalLike : docs;

      return chosen.map((d) => ({
        stage: d.stage,
        version: d.version,
        fileName: d.fileName,
        fileType: d.fileType,
        fileSize: d.fileSize,
        documentUrl: d.documentUrl,
        uploadedAt: d.uploadedAt
      }));
    };

    const archiveItems: ArchivedProject[] = defense.students.map((st) => ({
      id: `arch-${st.matric}-${year}`,
      title: st.projectTitle,
      student: st.name,
      matricNumber: st.matric,
      year,
      department: defense.department,
      faculty: defense.faculty,
      programme: defense.programme,
      supervisor: defense.panel[0],
      archivedAt,
      documents: toDocuments(st.matric)
    }));

    upsertArchivedProjects(archiveItems);

    setSessions((prev) => prev.map((s) => (s.id === defense.id ? { ...s, status: 'Completed' } : s)));
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <Calendar className="text-orange-600" />
            Defence Scheduling
          </h1>
          <p className="text-gray-500 dark:text-gray-400">Schedule and manage project defence sessions.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
            <button
              onClick={() => setViewMode('list')}
              className={`px-3 py-1.5 text-xs font-bold rounded-md transition-all ${
                viewMode === 'list' ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm' : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
            >
              List View
            </button>
            <button
              onClick={() => setViewMode('calendar')}
              className={`px-3 py-1.5 text-xs font-bold rounded-md transition-all ${
                viewMode === 'calendar' ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm' : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
            >
              Calendar View
            </button>
          </div>
          <button
            onClick={openCreate}
            className="flex items-center gap-2 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors text-sm font-bold shadow-lg shadow-orange-500/20"
          >
            <Plus size={16} />
            Schedule Defense
          </button>
        </div>
      </div>

      {viewMode === 'list' ? (
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="p-6 grid grid-cols-1 gap-4">
            {sessions.map((defense) => (
              <div
                key={defense.id}
                className="flex flex-col md:flex-row items-start md:items-center justify-between p-4 bg-gray-50 dark:bg-gray-900/50 rounded-xl hover:bg-orange-50 dark:hover:bg-orange-900/10 transition-colors border border-transparent hover:border-orange-200 dark:hover:border-orange-800"
              >
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                      {defense.students.length === 1 ? defense.students[0].name : `${defense.students.length} Students`}
                    </h3>
                    <span className="px-2 py-0.5 bg-green-100 text-green-700 text-[10px] font-bold rounded-full uppercase">{defense.status}</span>
                    <span className="px-2 py-0.5 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 text-[10px] font-bold rounded-full uppercase">
                      {defense.department}
                    </span>
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-300 font-medium mb-2 space-y-1">
                    {defense.students.slice(0, 3).map((s) => (
                      <div key={s.matric} className="truncate">
                        {s.name} • <span className="text-gray-500">{s.projectTitle}</span>
                      </div>
                    ))}
                    {defense.students.length > 3 && <div className="text-xs text-gray-400">+{defense.students.length - 3} more</div>}
                  </div>

                  <div className="flex flex-wrap gap-4 text-xs text-gray-500">
                    <div className="flex items-center gap-1">
                      <Calendar size={14} /> {defense.date}
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock size={14} /> {defense.time}
                    </div>
                    <div className="flex items-center gap-1">
                      <MapPin size={14} /> {defense.venue}
                    </div>
                  </div>
                </div>

                <div className="mt-4 md:mt-0 md:ml-6 flex flex-col items-end gap-2">
                  <div className="flex items-center -space-x-2">
                    {defense.panel.slice(0, 4).map((member, idx) => (
                      <div
                        key={`${defense.id}-p-${idx}`}
                        className="w-8 h-8 rounded-full bg-white dark:bg-gray-800 border-2 border-gray-100 dark:border-gray-700 flex items-center justify-center text-[10px] font-bold text-gray-600 dark:text-gray-300"
                        title={member}
                      >
                        {member.charAt(0)}
                      </div>
                    ))}
                    <div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-800 border-2 border-white dark:border-gray-700 flex items-center justify-center text-[10px] font-bold text-gray-500">
                      <Users size={12} />
                    </div>
                  </div>
                  <button onClick={() => openEdit(defense)} className="text-xs font-bold text-orange-600 hover:underline">
                    Edit Details
                  </button>
                  <button
                    onClick={() => completeAndArchive(defense)}
                    disabled={defense.status === 'Completed'}
                    className="text-xs font-bold text-teal-600 hover:underline disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center gap-1"
                  >
                    <Archive size={14} />
                    Complete & Archive
                  </button>
                </div>
              </div>
            ))}
            {sessions.length === 0 && <div className="py-14 text-center text-gray-400 italic">No defense sessions scheduled yet.</div>}
          </div>
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-8 text-center">
          <Calendar size={48} className="mx-auto text-gray-300 mb-4" />
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">Calendar View</h3>
          <p className="text-gray-500">Calendar integration would go here.</p>
        </div>
      )}

      {isScheduleOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-5xl max-h-[90vh] overflow-y-auto shadow-xl border border-gray-200 dark:border-gray-700">
            <div className="sticky top-0 bg-white dark:bg-gray-800 p-6 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center z-10">
              <div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">{editingId ? 'Edit Defense Schedule' : 'Schedule Defense'}</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">Select students and panel members, then set date, time and location.</p>
              </div>
              <button onClick={() => setIsScheduleOpen(false)} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors">
                <X size={20} className="text-gray-500" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                <div className="lg:col-span-3 bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 rounded-2xl p-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Faculty</label>
                      <select
                        value={filterFaculty}
                        onChange={(e) => {
                          setFilterFaculty(e.target.value);
                          setFilterDepartment('All');
                          setFilterProgramme('All');
                        }}
                        className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-orange-500"
                      >
                        <option value="All">Select Faculty</option>
                        {faculties.map((f) => (
                          <option key={f} value={f}>
                            {f}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Department</label>
                      <select
                        value={filterDepartment}
                        onChange={(e) => {
                          setFilterDepartment(e.target.value);
                          setFilterProgramme('All');
                        }}
                        disabled={filterFaculty === 'All'}
                        className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-orange-500 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <option value="All">{filterFaculty === 'All' ? 'Select Faculty first' : 'Select Department'}</option>
                        {availableDepartments.map((d) => (
                          <option key={d} value={d}>
                            {d}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Programme</label>
                      <select
                        value={filterProgramme}
                        onChange={(e) => setFilterProgramme(e.target.value)}
                        disabled={filterDepartment === 'All'}
                        className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-orange-500 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <option value="All">{filterDepartment === 'All' ? 'Select Department first' : 'Select Programme'}</option>
                        {availableProgrammes.map((p) => (
                          <option key={p} value={p}>
                            {p}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
                  <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                    <div className="flex items-center justify-between gap-3">
                      <div className="text-sm font-black text-gray-900 dark:text-white">Select Students</div>
                      <div className="text-xs font-black text-gray-600 dark:text-gray-300 px-2 py-1 rounded-lg bg-gray-100 dark:bg-gray-700">
                        {selectedStudentIds.length}
                      </div>
                    </div>
                    <div className="mt-3 relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                      <input
                        value={studentSearch}
                        onChange={(e) => setStudentSearch(e.target.value)}
                        placeholder="Search students..."
                        disabled={filterProgramme === 'All'}
                        className="w-full pl-10 pr-4 py-2 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-sm font-medium text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-orange-500 disabled:opacity-50 disabled:cursor-not-allowed"
                      />
                    </div>
                  </div>

                  <div className="max-h-96 overflow-y-auto divide-y divide-gray-100 dark:divide-gray-700">
                    {filterProgramme === 'All' ? (
                      <div className="p-10 text-center text-sm text-gray-500 dark:text-gray-400 font-bold">
                        Select Faculty, Department and Programme to load students.
                      </div>
                    ) : filteredStudents.length === 0 ? (
                      <div className="p-10 text-center text-sm text-gray-500 dark:text-gray-400 font-bold">No students found.</div>
                    ) : (
                      filteredStudents.map((s) => {
                        const selected = selectedStudentIds.includes(s.id);
                        return (
                          <button
                            key={s.id}
                            onClick={() => toggleStudent(s.id)}
                            className={`w-full text-left p-4 hover:bg-gray-50 dark:hover:bg-gray-900/40 transition-colors ${
                              selected ? 'bg-orange-50 dark:bg-orange-900/10' : ''
                            }`}
                          >
                            <div className="flex items-start gap-3">
                              <div className="w-9 h-9 rounded-full bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center text-orange-700 dark:text-orange-300 font-black text-sm">
                                {s.name.charAt(0)}
                              </div>
                              <div className="min-w-0 flex-1">
                                <div className="flex items-start justify-between gap-3">
                                  <div className="min-w-0">
                                    <div className="text-sm font-black text-gray-900 dark:text-white truncate">{s.name}</div>
                                    <div className="text-xs text-gray-500 dark:text-gray-400">{s.matric}</div>
                                  </div>
                                  <div
                                    className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                                      selected ? 'bg-orange-600 border-orange-600' : 'border-gray-300 dark:border-gray-600'
                                    }`}
                                  >
                                    {selected && <div className="w-2 h-2 bg-white rounded-full" />}
                                  </div>
                                </div>
                                <div className="mt-2 text-xs text-gray-600 dark:text-gray-300 truncate">{s.projectTitle}</div>
                              </div>
                            </div>
                          </button>
                        );
                      })
                    )}
                  </div>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
                  <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                    <div className="flex items-center justify-between gap-3">
                      <div className="text-sm font-black text-gray-900 dark:text-white">Panel Members</div>
                      <div className="text-xs font-black text-gray-600 dark:text-gray-300 px-2 py-1 rounded-lg bg-gray-100 dark:bg-gray-700">
                        {selectedPanelIds.length}
                      </div>
                    </div>
                    <div className="mt-3 relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                      <input
                        value={panelSearch}
                        onChange={(e) => setPanelSearch(e.target.value)}
                        placeholder="Search staff..."
                        disabled={filterDepartment === 'All'}
                        className="w-full pl-10 pr-4 py-2 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-sm font-medium text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-orange-500 disabled:opacity-50 disabled:cursor-not-allowed"
                      />
                    </div>
                    <div className="mt-3 text-xs text-gray-500 dark:text-gray-400 font-medium">
                      {filterDepartment === 'All' ? 'Select department to load staff list.' : `Showing staff in ${filterDepartment}`}
                    </div>
                  </div>

                  <div className="max-h-96 overflow-y-auto divide-y divide-gray-100 dark:divide-gray-700">
                    {filterDepartment === 'All' ? (
                      <div className="p-10 text-center text-sm text-gray-500 dark:text-gray-400 font-bold">Select department first.</div>
                    ) : filteredStaff.length === 0 ? (
                      <div className="p-10 text-center text-sm text-gray-500 dark:text-gray-400 font-bold">No staff found.</div>
                    ) : (
                      filteredStaff.map((sf) => {
                        const selected = selectedPanelIds.includes(sf.id);
                        return (
                          <button
                            key={sf.id}
                            onClick={() => togglePanel(sf.id)}
                            className={`w-full text-left p-4 hover:bg-gray-50 dark:hover:bg-gray-900/40 transition-colors ${
                              selected ? 'bg-orange-50 dark:bg-orange-900/10' : ''
                            }`}
                          >
                            <div className="flex items-center justify-between gap-3">
                              <div className="min-w-0">
                                <div className="text-sm font-black text-gray-900 dark:text-white truncate">{sf.name}</div>
                                <div className="text-xs text-gray-500 dark:text-gray-400">{sf.department}</div>
                              </div>
                              <div
                                className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                                  selected ? 'bg-orange-600 border-orange-600' : 'border-gray-300 dark:border-gray-600'
                                }`}
                              >
                                {selected && <div className="w-2 h-2 bg-white rounded-full" />}
                              </div>
                            </div>
                          </button>
                        );
                      })
                    )}
                  </div>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-4 space-y-4">
                  <div className="text-sm font-black text-gray-900 dark:text-white">Schedule Details</div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="sm:col-span-1">
                      <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Date</label>
                      <input
                        type="date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-sm font-bold text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-orange-500"
                      />
                    </div>
                    <div className="sm:col-span-1">
                      <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Time</label>
                      <input
                        type="time"
                        value={time}
                        onChange={(e) => setTime(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-sm font-bold text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-orange-500"
                      />
                    </div>
                    <div className="sm:col-span-1">
                      <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Location</label>
                      <input
                        type="text"
                        value={venue}
                        onChange={(e) => setVenue(e.target.value)}
                        placeholder="e.g. Conference Hall A"
                        className="w-full px-3 py-2 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-sm font-bold text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-orange-500"
                      />
                    </div>
                  </div>

                  <div className="bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 rounded-xl p-3">
                    <div className="text-xs font-black text-gray-500 uppercase tracking-wide">Summary</div>
                    <div className="mt-2 text-sm text-gray-700 dark:text-gray-200 font-bold">
                      {selectedStudentIds.length ? `${selectedStudentIds.length} student(s) selected` : 'No students selected'}
                      {selectedPanelIds.length ? ` • ${selectedPanelIds.length} panel member(s)` : ''}
                    </div>
                    <div className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                      {filterFaculty !== 'All' && filterDepartment !== 'All' && filterProgramme !== 'All'
                        ? `${filterFaculty} • ${filterDepartment} • ${filterProgramme}`
                        : 'Select faculty, department and programme'}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50 flex flex-col md:flex-row md:items-center justify-between gap-3">
              <div className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                {canSave ? 'Ready to save schedule.' : 'Complete filters, select students/panel and fill date/time/location.'}
              </div>
              <div className="flex items-center justify-end gap-3">
                <button
                  onClick={() => setIsScheduleOpen(false)}
                  className="px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg font-bold hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={save}
                  disabled={!canSave}
                  className="px-5 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg font-bold transition-colors shadow-lg shadow-orange-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Save Schedule
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DefenseScheduling;
