import { useState, useMemo } from 'react';
import { Calendar, Clock, MapPin, Search, Download, Plus, AlertCircle, ChevronDown } from 'lucide-react';

interface ExamCycle {
  id: string;
  session: string;
  semester: 'First' | 'Second';
  type: 'Mid-Semester' | 'Final Exam';
  startDate: string;
  endDate: string;
  status: 'Draft' | 'Active' | 'Completed';
}

interface ExamSchedule {
  id: string;
  cycleId: string;
  courseCode: string;
  courseTitle: string;
  date: string;
  startTime: string;
  endTime: string;
  venue: string;
  invigilatorsCount: number;
  studentsCount: number;
  status: 'Scheduled' | 'Conflict';
}

const TimetableScheduling = () => {
  // Mock Cycles Data (Shared concept with ExamCycleSetup)
  const [cycles] = useState<ExamCycle[]>([
    { 
      id: '1', 
      session: '2024/2025', 
      semester: 'First', 
      type: 'Final Exam', 
      startDate: '2025-05-12',
      endDate: '2025-05-30',
      status: 'Active' 
    },
    { 
      id: '2', 
      session: '2024/2025', 
      semester: 'First', 
      type: 'Mid-Semester', 
      startDate: '2025-03-10',
      endDate: '2025-03-15',
      status: 'Completed' 
    },
    { 
      id: '3', 
      session: '2023/2024', 
      semester: 'Second', 
      type: 'Final Exam', 
      startDate: '2024-05-10',
      endDate: '2024-05-25',
      status: 'Completed' 
    },
  ]);

  const [selectedCycleId, setSelectedCycleId] = useState<string>(cycles[0].id);

  const selectedCycle = useMemo(() => 
    cycles.find(c => c.id === selectedCycleId) || cycles[0]
  , [cycles, selectedCycleId]);

  const [schedules, setSchedules] = useState<ExamSchedule[]>([
    {
      id: '1',
      cycleId: '1',
      courseCode: 'CSC 301',
      courseTitle: 'Operating Systems',
      date: '2025-05-12',
      startTime: '09:00',
      endTime: '12:00',
      venue: 'ETF Hall',
      invigilatorsCount: 4,
      studentsCount: 150,
      status: 'Scheduled'
    },
    {
      id: '2',
      cycleId: '1',
      courseCode: 'MTH 201',
      courseTitle: 'Linear Algebra',
      date: '2025-05-12',
      startTime: '09:00',
      endTime: '11:00',
      venue: 'Lecture Theatre B',
      invigilatorsCount: 2,
      studentsCount: 85,
      status: 'Conflict'
    },
    {
      id: '3',
      cycleId: '2', // Belongs to different cycle
      courseCode: 'PHY 101',
      courseTitle: 'General Physics',
      date: '2025-03-10',
      startTime: '10:00',
      endTime: '12:00',
      venue: 'Science Hall 1',
      invigilatorsCount: 3,
      studentsCount: 200,
      status: 'Scheduled'
    }
  ]);

  const filteredSchedules = useMemo(() => 
    schedules.filter(s => s.cycleId === selectedCycleId)
  , [schedules, selectedCycleId]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newSchedule, setNewSchedule] = useState<Partial<ExamSchedule> & { faculty?: string, department?: string, invigilators?: string }>({
    faculty: '',
    department: '',
    courseCode: '',
    date: '',
    startTime: '',
    endTime: '',
    venue: '',
    invigilators: ''
  });

  const handleSaveSchedule = () => {
    if (!newSchedule.courseCode || !newSchedule.date || !newSchedule.startTime || !newSchedule.endTime || !newSchedule.venue) {
      alert('Please fill in all required fields');
      return;
    }

    // Check for conflicts
    const hasConflict = schedules.some(schedule => {
      if (schedule.date !== newSchedule.date) return false;
      if (schedule.venue !== newSchedule.venue!.split(' (')[0]) return false;
      
      const newStart = newSchedule.startTime!;
      const newEnd = newSchedule.endTime!;
      const existingStart = schedule.startTime;
      const existingEnd = schedule.endTime;

      // Check time overlap: (StartA < EndB) and (EndA > StartB)
      return newStart < existingEnd && newEnd > existingStart;
    });

    const schedule: ExamSchedule = {
      id: (schedules.length + 1).toString(),
      cycleId: selectedCycleId,
      courseCode: newSchedule.courseCode!.split(' - ')[0] || newSchedule.courseCode!,
      courseTitle: newSchedule.courseCode!.split(' - ')[1] || 'New Exam',
      date: newSchedule.date!,
      startTime: newSchedule.startTime!,
      endTime: newSchedule.endTime!,
      venue: newSchedule.venue!.split(' (')[0],
      invigilatorsCount: newSchedule.invigilators ? newSchedule.invigilators.split(',').length : 0,
      studentsCount: 100, // Mock student count
      status: hasConflict ? 'Conflict' : 'Scheduled'
    };

    if (hasConflict) {
      if (!confirm('A scheduling conflict has been detected at this venue and time. Do you want to proceed anyway?')) {
        return;
      }
    }

    setSchedules([...schedules, schedule]);
    setIsModalOpen(false);
    setNewSchedule({
      faculty: '',
      department: '',
      courseCode: '',
      date: '',
      startTime: '',
      endTime: '',
      venue: '',
      invigilators: ''
    });
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Exam Timetable Scheduling</h1>
          <div className="flex flex-col gap-2 mt-2">
            <div className="relative inline-block w-64">
              <select
                value={selectedCycleId}
                onChange={(e) => setSelectedCycleId(e.target.value)}
                className="appearance-none w-full pl-4 pr-10 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm font-medium text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none cursor-pointer"
              >
                {cycles.map(cycle => (
                  <option key={cycle.id} value={cycle.id}>
                    {cycle.session} - {cycle.semester} ({cycle.type})
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
            </div>
            <div className="flex items-center gap-2">
              <span className={`px-2 py-0.5 rounded text-xs font-semibold border ${
                selectedCycle.status === 'Active' ? 'bg-green-100 text-green-700 border-green-200' : 
                selectedCycle.status === 'Completed' ? 'bg-gray-100 text-gray-700 border-gray-200' : 
                'bg-yellow-100 text-yellow-700 border-yellow-200'
              }`}>
                {selectedCycle.status}
              </span>
              <p className="text-gray-500 dark:text-gray-400 text-sm">
                <span className="font-medium text-gray-700 dark:text-gray-300 mr-2">
                  {selectedCycle.startDate} to {selectedCycle.endDate}
                </span>
                Schedule exams, assign venues, and manage conflicts.
              </p>
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <button className="px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-lg flex items-center gap-2 hover:bg-gray-50">
            <Download size={18} /> Export
          </button>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
          >
            <Plus size={18} /> Schedule Exam
          </button>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input 
            type="text" 
            placeholder="Search by course code or title..." 
            className="w-full pl-10 pr-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <select className="px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-700 dark:text-gray-300">
          <option>All Faculties</option>
          <option>Science</option>
          <option>Engineering</option>
          <option>Arts</option>
        </select>
        <select className="px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-700 dark:text-gray-300">
          <option>All Venues</option>
          <option>ETF Hall</option>
          <option>Lecture Theatre B</option>
        </select>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 dark:bg-gray-900/50">
            <tr>
              <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase">Course</th>
              <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase">Date & Time</th>
              <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase">Venue</th>
              <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase">Stats</th>
              <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {filteredSchedules.map((exam) => (
              <tr key={exam.id}>
                <td className="px-6 py-4">
                  <div className="font-medium text-gray-900 dark:text-white">{exam.courseCode}</div>
                  <div className="text-sm text-gray-500">{exam.courseTitle}</div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                    <Calendar size={14} />
                    {exam.date}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                    <Clock size={14} />
                    {exam.startTime} - {exam.endTime}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                    <MapPin size={14} />
                    {exam.venue}
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  <div>{exam.studentsCount} Students</div>
                  <div>{exam.invigilatorsCount} Invigilators</div>
                </td>
                <td className="px-6 py-4">
                  {exam.status === 'Conflict' ? (
                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700">
                      <AlertCircle size={12} /> Conflict Detected
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                      Scheduled
                    </span>
                  )}
                </td>
                <td className="px-6 py-4">
                  <button className="text-blue-600 hover:underline text-sm">Edit</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 w-full max-w-lg">
            <h2 className="text-xl font-bold mb-4 dark:text-white">Schedule New Exam</h2>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Faculty</label>
                  <select 
                    value={newSchedule.faculty}
                    onChange={(e) => setNewSchedule({...newSchedule, faculty: e.target.value})}
                    className="w-full border rounded-lg p-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  >
                    <option>Select Faculty...</option>
                    <option>Science</option>
                    <option>Arts</option>
                    <option>Engineering</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Department</label>
                  <select 
                    value={newSchedule.department}
                    onChange={(e) => setNewSchedule({...newSchedule, department: e.target.value})}
                    className="w-full border rounded-lg p-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  >
                    <option>Select Department...</option>
                    <option>Computer Science</option>
                    <option>Mathematics</option>
                    <option>Physics</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Select Course</label>
                <select 
                  value={newSchedule.courseCode}
                  onChange={(e) => setNewSchedule({...newSchedule, courseCode: e.target.value})}
                  className="w-full border rounded-lg p-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                >
                  <option>Select a course...</option>
                  <option>CSC 301 - Operating Systems</option>
                  <option>MTH 201 - Linear Algebra</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Date</label>
                  <input 
                    type="date" 
                    value={newSchedule.date}
                    onChange={(e) => setNewSchedule({...newSchedule, date: e.target.value})}
                    className="w-full border rounded-lg p-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Venue</label>
                  <select 
                    value={newSchedule.venue}
                    onChange={(e) => setNewSchedule({...newSchedule, venue: e.target.value})}
                    className="w-full border rounded-lg p-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  >
                    <option>Select Venue...</option>
                    <option>ETF Hall (750)</option>
                    <option>Lecture Theatre B (300)</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Start Time</label>
                  <input 
                    type="time" 
                    value={newSchedule.startTime}
                    onChange={(e) => setNewSchedule({...newSchedule, startTime: e.target.value})}
                    className="w-full border rounded-lg p-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">End Time</label>
                  <input 
                    type="time" 
                    value={newSchedule.endTime}
                    onChange={(e) => setNewSchedule({...newSchedule, endTime: e.target.value})}
                    className="w-full border rounded-lg p-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white" 
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Invigilators</label>
                <input 
                  type="text" 
                  value={newSchedule.invigilators}
                  onChange={(e) => setNewSchedule({...newSchedule, invigilators: e.target.value})}
                  placeholder="Search and select invigilators..." 
                  className="w-full border rounded-lg p-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
                <p className="text-xs text-gray-500 mt-1">Separate multiple names with commas</p>
              </div>
              <div className="flex justify-end gap-2 mt-6">
                <button onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">Cancel</button>
                <button 
                  onClick={handleSaveSchedule}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
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

export default TimetableScheduling;
