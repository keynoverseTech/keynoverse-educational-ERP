import { 
  BookOpen, 
  Calendar, 
  Clock, 
  CheckCircle,
  TrendingUp,
  Award,
  AlertCircle
} from 'lucide-react';

const semesterStatus = {
  session: '2023/2024',
  semester: 'First Semester',
  status: 'In Progress',
  currentWeek: 12,
  totalWeeks: 15,
  startDate: 'Jan 08, 2024',
  endDate: 'Apr 26, 2024'
};

const upcomingEvents = [
  { id: 1, title: 'Mid-Semester Break', date: 'Feb 20 - Feb 22', type: 'Holiday', color: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400' },
  { id: 2, title: 'Matriculation Ceremony', date: 'Mar 05', type: 'Event', color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' },
  { id: 3, title: 'First Semester Exams', date: 'Apr 15 - Apr 26', type: 'Academic', color: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400' },
];

const StudentDashboard = () => {
  return (
    <div className="p-6 space-y-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Welcome back, Samuel! 👋</h1>
          <p className="text-gray-500 dark:text-gray-400">B.Sc. Computer Science • Level 400</p>
        </div>
        <div className="flex items-center gap-3">
          <span className="px-3 py-1 bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 rounded-full text-sm font-medium border border-green-200 dark:border-green-800">
            Active Student
          </span>
          <div className="text-right">
            <p className="text-sm font-bold text-gray-900 dark:text-white">Oct 24, 2025</p>
            <p className="text-xs text-gray-500">Wednesday</p>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Current CGPA</p>
              <h3 className="text-3xl font-bold text-gray-900 dark:text-white mt-2">3.85</h3>
              <p className="text-xs text-green-600 mt-1 flex items-center gap-1">
                <TrendingUp size={12} /> Top 5% of class
              </p>
            </div>
            <div className="p-3 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl">
              <Award className="text-indigo-600 dark:text-indigo-400" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Enrolled Courses</p>
              <h3 className="text-3xl font-bold text-gray-900 dark:text-white mt-2">6</h3>
              <p className="text-xs text-gray-500 mt-1">18 Credit Units</p>
            </div>
            <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
              <BookOpen className="text-blue-600 dark:text-blue-400" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Attendance</p>
              <h3 className="text-3xl font-bold text-gray-900 dark:text-white mt-2">92%</h3>
              <p className="text-xs text-gray-500 mt-1">This Semester</p>
            </div>
            <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-xl">
              <CheckCircle className="text-green-600 dark:text-green-400" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Next Class</p>
              <h3 className="text-3xl font-bold text-gray-900 dark:text-white mt-2">10:00</h3>
              <p className="text-xs text-gray-500 mt-1">CSC 401 (Lab 2)</p>
            </div>
            <div className="p-3 bg-orange-50 dark:bg-orange-900/20 rounded-xl">
              <Clock className="text-orange-600 dark:text-orange-400" size={24} />
            </div>
          </div>
        </div>
      </div>

      {/* Academic Overview Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Semester Status */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <BookOpen size={20} className="text-blue-600" />
              Semester Status
            </h3>
            <span className="px-3 py-1 bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 rounded-full text-xs font-bold uppercase">
              {semesterStatus.status}
            </span>
          </div>
          
          <div className="space-y-6">
            <div className="flex justify-between items-end">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Current Session</p>
                <h4 className="text-xl font-bold text-gray-900 dark:text-white">{semesterStatus.session}</h4>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Semester</p>
                <h4 className="text-xl font-bold text-gray-900 dark:text-white">{semesterStatus.semester}</h4>
              </div>
            </div>

            {/* Progress Bar */}
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="font-medium text-gray-700 dark:text-gray-300">Week {semesterStatus.currentWeek} of {semesterStatus.totalWeeks}</span>
                <span className="text-gray-500">{Math.round((semesterStatus.currentWeek / semesterStatus.totalWeeks) * 100)}% Completed</span>
              </div>
              <div className="w-full bg-gray-100 dark:bg-gray-700 rounded-full h-3">
                <div 
                  className="bg-blue-600 h-3 rounded-full transition-all duration-1000" 
                  style={{ width: `${(semesterStatus.currentWeek / semesterStatus.totalWeeks) * 100}%` }}
                ></div>
              </div>
              <div className="flex justify-between text-xs text-gray-500 mt-2">
                <span>Start: {semesterStatus.startDate}</span>
                <span>End: {semesterStatus.endDate}</span>
              </div>
            </div>
          </div>
        </div>

        {/* School Calendar Preview */}
        <div className="lg:col-span-2 bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <Calendar size={20} className="text-orange-600" />
              School Calendar
            </h3>
            <button className="text-sm text-blue-600 font-medium hover:underline">View Full Calendar</button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {upcomingEvents.map(event => (
              <div key={event.id} className="p-4 rounded-xl border border-gray-100 dark:border-gray-700 hover:shadow-md transition-shadow bg-gray-50 dark:bg-gray-800/50">
                <div className={`inline-block px-2 py-1 rounded-md text-xs font-bold mb-3 ${event.color}`}>
                  {event.type}
                </div>
                <h4 className="font-bold text-gray-900 dark:text-white mb-1">{event.title}</h4>
                <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                  <Clock size={14} />
                  {event.date}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Today's Schedule */}
        <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">Today's Schedule</h2>
            <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">View Full Timetable</button>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {[
                { code: 'CSC 401', title: 'Advanced Software Engineering', time: '10:00 AM - 12:00 PM', venue: 'Computer Lab 2', type: 'Laboratory', status: 'Upcoming' },
                { code: 'CSC 202', title: 'Introduction to Algorithms', time: '02:00 PM - 04:00 PM', venue: 'Lecture Hall A', type: 'Lecture', status: 'Pending' },
              ].map((course, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-900/50 rounded-lg border border-gray-100 dark:border-gray-800 hover:border-blue-200 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex flex-col items-center justify-center text-blue-600 dark:text-blue-400 font-bold text-xs">
                      <span>{course.time.split(' ')[0]}</span>
                      <span className="text-[10px] font-normal">{course.time.split(' ')[1]}</span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white">{course.title}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs font-medium px-2 py-0.5 rounded bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300">{course.code}</span>
                        <span className="text-sm text-gray-500 dark:text-gray-400">• {course.venue}</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      course.status === 'Upcoming' 
                        ? 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400'
                        : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400'
                    }`}>
                      {course.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Notices & Alerts */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">Notices</h2>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <AlertCircle className="text-red-500 mt-0.5 flex-shrink-0" size={18} />
                <div>
                  <h4 className="text-sm font-semibold text-gray-900 dark:text-white">Tuition Fee Due</h4>
                  <p className="text-xs text-gray-500 mt-0.5">Please clear your outstanding balance by Oct 30 to avoid penalties.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Calendar className="text-blue-500 mt-0.5 flex-shrink-0" size={18} />
                <div>
                  <h4 className="text-sm font-semibold text-gray-900 dark:text-white">Mid-Semester Exams</h4>
                  <p className="text-xs text-gray-500 mt-0.5">Timetable has been published. Exams start Nov 15.</p>
                </div>
              </div>
            </div>
            
            <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
               <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-3">Course Progress</h3>
               <div className="space-y-3">
                 <div>
                   <div className="flex justify-between text-xs mb-1">
                     <span className="text-gray-600 dark:text-gray-400">CSC 401</span>
                     <span className="text-gray-900 dark:text-white font-medium">75%</span>
                   </div>
                   <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
                     <div className="bg-blue-600 h-1.5 rounded-full" style={{ width: '75%' }}></div>
                   </div>
                 </div>
                 <div>
                   <div className="flex justify-between text-xs mb-1">
                     <span className="text-gray-600 dark:text-gray-400">CSC 202</span>
                     <span className="text-gray-900 dark:text-white font-medium">45%</span>
                   </div>
                   <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
                     <div className="bg-orange-500 h-1.5 rounded-full" style={{ width: '45%' }}></div>
                   </div>
                 </div>
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
