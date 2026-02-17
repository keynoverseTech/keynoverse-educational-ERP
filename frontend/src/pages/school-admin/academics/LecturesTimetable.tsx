import { useState } from 'react';
import { 
  Calendar, 
  MapPin, 
  Plus, 
  Filter, 
  Users,
  MoreVertical
} from 'lucide-react';

interface Lecture {
  id: string;
  courseCode: string;
  courseTitle: string;
  lecturer: string;
  venue: string;
  day: string;
  startTime: string;
  endTime: string;
  level: string;
  type: 'Lecture' | 'Practical' | 'Tutorial';
}

const LecturesTimetable = () => {
  const [selectedFaculty, setSelectedFaculty] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [selectedLevel, setSelectedLevel] = useState('');
  const [showScheduleModal, setShowScheduleModal] = useState(false);

  // Mock Data
  const lectures: Lecture[] = [
    {
      id: '1',
      courseCode: 'CSC 301',
      courseTitle: 'Operating Systems',
      lecturer: 'Dr. Alan Smith',
      venue: 'Lecture Theatre A',
      day: 'Monday',
      startTime: '08:00',
      endTime: '10:00',
      level: '300',
      type: 'Lecture'
    },
    {
      id: '2',
      courseCode: 'CSC 305',
      courseTitle: 'Database Management',
      lecturer: 'Prof. Sarah Connor',
      venue: 'Computer Lab 2',
      day: 'Tuesday',
      startTime: '10:00',
      endTime: '12:00',
      level: '300',
      type: 'Practical'
    }
  ];

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <Calendar className="w-6 h-6 text-blue-600" />
            Lectures Timetable
          </h1>
          <p className="text-gray-500 dark:text-gray-400">Schedule and manage weekly lectures for students.</p>
        </div>
        <button 
          onClick={() => setShowScheduleModal(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
        >
          <Plus size={18} />
          Schedule Lecture
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="space-y-1">
          <label className="text-xs font-medium text-gray-500 uppercase">Faculty</label>
          <select 
            className="w-full p-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
            value={selectedFaculty}
            onChange={(e) => setSelectedFaculty(e.target.value)}
          >
            <option value="">Select Faculty</option>
            <option value="science">Faculty of Science</option>
            <option value="arts">Faculty of Arts</option>
            <option value="engineering">Faculty of Engineering</option>
          </select>
        </div>
        <div className="space-y-1">
          <label className="text-xs font-medium text-gray-500 uppercase">Department</label>
          <select 
            className="w-full p-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
            value={selectedDepartment}
            onChange={(e) => setSelectedDepartment(e.target.value)}
          >
            <option value="">Select Department</option>
            <option value="csc">Computer Science</option>
            <option value="mth">Mathematics</option>
            <option value="phy">Physics</option>
          </select>
        </div>
        <div className="space-y-1">
          <label className="text-xs font-medium text-gray-500 uppercase">Level</label>
          <select 
            className="w-full p-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
            value={selectedLevel}
            onChange={(e) => setSelectedLevel(e.target.value)}
          >
            <option value="">Select Level</option>
            <option value="100">100 Level</option>
            <option value="200">200 Level</option>
            <option value="300">300 Level</option>
            <option value="400">400 Level</option>
          </select>
        </div>
        <div className="flex items-end">
          <button className="w-full p-2 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors flex items-center justify-center gap-2">
            <Filter size={18} />
            Apply Filters
          </button>
        </div>
      </div>

      {/* Timetable Grid */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-gray-50 dark:bg-gray-900/50">
              <tr>
                <th className="p-4 border-b border-gray-200 dark:border-gray-700 font-semibold text-gray-600 dark:text-gray-300 w-32">Day</th>
                <th className="p-4 border-b border-gray-200 dark:border-gray-700 font-semibold text-gray-600 dark:text-gray-300">Schedule</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {days.map((day) => (
                <tr key={day} className="group hover:bg-gray-50 dark:hover:bg-gray-900/20">
                  <td className="p-4 font-medium text-gray-900 dark:text-white align-top border-r border-gray-100 dark:border-gray-700/50">
                    <div className="sticky left-0">{day}</div>
                  </td>
                  <td className="p-2">
                    <div className="flex flex-wrap gap-3">
                      {lectures.filter(l => l.day === day).length > 0 ? (
                        lectures.filter(l => l.day === day).map((lecture) => (
                          <div key={lecture.id} className="bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500 p-3 rounded-r-lg w-64 hover:shadow-md transition-shadow cursor-pointer group/card relative">
                            <div className="flex justify-between items-start mb-2">
                              <span className="text-xs font-bold text-blue-600 dark:text-blue-400 px-2 py-0.5 bg-white dark:bg-gray-800 rounded-full border border-blue-100 dark:border-blue-800">
                                {lecture.startTime} - {lecture.endTime}
                              </span>
                              <button className="opacity-0 group-hover/card:opacity-100 p-1 hover:bg-blue-100 dark:hover:bg-blue-900/40 rounded">
                                <MoreVertical size={14} className="text-blue-600 dark:text-blue-400" />
                              </button>
                            </div>
                            <h4 className="font-bold text-gray-900 dark:text-white text-sm mb-1">{lecture.courseCode}</h4>
                            <p className="text-xs text-gray-600 dark:text-gray-300 line-clamp-1 mb-2">{lecture.courseTitle}</p>
                            
                            <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 mb-1">
                              <MapPin size={12} />
                              <span>{lecture.venue}</span>
                            </div>
                            <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                              <Users size={12} />
                              <span>{lecture.lecturer}</span>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="w-full py-4 text-center text-gray-400 text-sm border-2 border-dashed border-gray-100 dark:border-gray-800 rounded-lg">
                          No lectures scheduled
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Schedule Modal */}
      {showScheduleModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-lg shadow-xl border border-gray-200 dark:border-gray-700">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">Schedule New Lecture</h3>
              <button 
                onClick={() => setShowScheduleModal(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
              >
                &times;
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Course</label>
                <select className="w-full p-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
                  <option>Select Course</option>
                  <option>CSC 301 - Operating Systems</option>
                  <option>CSC 305 - Database Management</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Day</label>
                  <select className="w-full p-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
                    {days.map(d => <option key={d}>{d}</option>)}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Venue</label>
                  <select className="w-full p-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
                    <option>Lecture Theatre A</option>
                    <option>Computer Lab 2</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Start Time</label>
                  <input type="time" className="w-full p-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">End Time</label>
                  <input type="time" className="w-full p-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white" />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Lecturer</label>
                <input type="text" placeholder="Search lecturer..." className="w-full p-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white" />
              </div>

              <div className="pt-4 flex justify-end gap-3">
                <button 
                  onClick={() => setShowScheduleModal(false)}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700 rounded-lg"
                >
                  Cancel
                </button>
                <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 shadow-lg shadow-blue-500/20">
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

export default LecturesTimetable;