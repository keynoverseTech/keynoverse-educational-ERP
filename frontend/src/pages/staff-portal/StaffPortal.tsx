import { 
  Users, 
  BookOpen, 
  Clock, 
  FileText,
  Briefcase,
  ArrowUpRight,
  ArrowDownRight,
  Calendar
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const StaffPortal = () => {
  const navigate = useNavigate();
  const stats = [
    {
      title: 'Total Students',
      value: '142',
      subtext: 'Across 3 Courses',
      icon: Users,
      trend: 'up' as const,
      trendValue: '+12'
    },
    {
      title: 'Classes Today',
      value: '2',
      subtext: 'Next: 10:00 AM',
      icon: BookOpen,
      trend: 'up' as const,
      trendValue: 'On schedule'
    },
    {
      title: 'Pending Grading',
      value: '24',
      subtext: 'Assignments',
      icon: FileText,
      trend: 'down' as const,
      trendValue: 'Needs action'
    },
    {
      title: 'Leave Balance',
      value: '12',
      subtext: 'Days Remaining',
      icon: Briefcase,
      trend: 'up' as const,
      trendValue: 'Available'
    }
  ];

  const gradientForStat = (title: string) => {
    if (title.includes('Pending')) return 'bg-gradient-to-r from-rose-500 via-red-500 to-orange-500';
    if (title.includes('Leave')) return 'bg-gradient-to-r from-purple-500 via-indigo-500 to-blue-500';
    if (title.includes('Classes')) return 'bg-gradient-to-r from-emerald-500 via-emerald-400 to-teal-500';
    return 'bg-gradient-to-r from-blue-500 via-indigo-500 to-emerald-500';
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto animate-in fade-in duration-500">
      <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-emerald-500 rounded-2xl px-6 py-5 shadow-lg shadow-blue-600/20 border border-blue-500/20">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-xs font-semibold text-blue-50 mb-3">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              Staff Overview
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-white flex items-center gap-2">
              <Briefcase className="w-7 h-7" />
              Staff Dashboard
            </h1>
            <p className="text-blue-50/80 mt-2 text-sm md:text-base max-w-xl">
              Manage courses, track classes, and review academic workload efficiently.
            </p>
          </div>
          <div className="flex flex-col items-start md:items-end gap-3 text-blue-50/90">
            <div className="text-right">
              <p className="text-xs uppercase tracking-wide">Welcome</p>
              <p className="text-xl font-bold">Dr. Sarah</p>
              <p className="text-xs text-blue-50/80 font-semibold mt-1">Senior Lecturer • Computer Science</p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => navigate('/staff/academics/courses')}
                className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors text-sm font-bold backdrop-blur-sm border border-white/20"
              >
                My Courses
              </button>
              <button
                onClick={() => navigate('/staff/academics/timetable')}
                className="px-4 py-2 bg-white text-blue-700 rounded-lg transition-colors text-sm font-bold shadow-sm"
              >
                Timetable
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((s) => (
          <div
            key={s.title}
            className="relative overflow-hidden bg-white dark:bg-[#151e32] p-5 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 hover:shadow-lg transition-all duration-300 hover:shadow-blue-500/10"
          >
            <div className={`absolute inset-x-0 top-0 h-1 ${gradientForStat(s.title)}`} />
            <div className="flex justify-between items-start relative">
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{s.title}</p>
                <h3 className="text-2xl font-bold mt-2 text-gray-900 dark:text-white">{s.value}</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{s.subtext}</p>
              </div>
              <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
                <s.icon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
            <div className="mt-4 flex items-center gap-2 relative">
              <span
                className={`text-xs font-bold px-2 py-0.5 rounded-full flex items-center gap-1 ${
                  s.trend === 'up' ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300' : 'bg-rose-50 text-rose-700 dark:bg-rose-900/30 dark:text-rose-300'
                }`}
              >
                {s.trend === 'up' ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                {s.trendValue}
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">Assigned Courses</h2>
            <button 
              onClick={() => navigate('/staff/academics/courses')}
              className="text-sm font-bold text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
            >
              View All
            </button>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {[
                { code: 'CSC 401', title: 'Advanced Software Engineering', students: 45, schedule: 'Mon 10-12, Wed 2-4' },
                { code: 'CSC 202', title: 'Introduction to Algorithms', students: 82, schedule: 'Tue 8-10, Thu 10-12' },
                { code: 'CSC 499', title: 'Final Year Project Supervision', students: 15, schedule: 'By Appointment' },
              ].map((course) => (
                <div key={course.code} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-gray-50 dark:bg-gray-900/50 rounded-2xl border border-gray-100 dark:border-gray-700 gap-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-black text-blue-600 dark:text-blue-400">{course.code}</span>
                      <span className="text-sm font-medium text-gray-900 dark:text-white">{course.title}</span>
                    </div>
                    <div className="flex flex-wrap items-center gap-3 text-xs font-bold text-gray-500 dark:text-gray-400">
                      <span className="flex items-center gap-1"><Users size={12} /> {course.students} Students</span>
                      <span className="flex items-center gap-1"><Clock size={12} /> {course.schedule}</span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Link to="/staff/grading" className="px-3 py-2 text-xs font-bold bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                      Grading
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">Upcoming Classes</h2>
            <button
              onClick={() => navigate('/staff/academics/timetable')}
              className="text-sm font-bold text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
            >
              Full Timetable
            </button>
          </div>
          <div className="p-6">
            <div className="space-y-6">
              {[
                { time: '10:00 AM', course: 'CSC 401', room: 'Lecture Hall A', status: 'Next' },
                { time: '02:00 PM', course: 'CSC 202', room: 'Lab 2', status: 'Upcoming' },
              ].map((item, idx) => (
                <div key={idx} className="relative pl-6 border-l-2 border-blue-500">
                  <div className="absolute -left-1.5 top-0 w-3 h-3 bg-blue-500 rounded-full border-2 border-white dark:border-gray-800" />
                  <p className="text-xs font-black text-blue-600 dark:text-blue-400 mb-1">{item.time}</p>
                  <h4 className="text-sm font-bold text-gray-900 dark:text-white">{item.course}</h4>
                  <p className="text-xs font-bold text-gray-500 dark:text-gray-400">{item.room}</p>
                  {item.status === 'Next' && (
                    <span className="mt-2 inline-flex items-center gap-1 px-2 py-0.5 bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 text-[10px] font-bold rounded uppercase tracking-wider">
                      <Calendar size={12} /> In 15 Mins
                    </span>
                  )}
                </div>
              ))}
            </div>
            <button 
              onClick={() => navigate('/staff/academics/timetable')}
              className="w-full mt-8 py-2.5 text-sm font-bold text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              View Full Schedule
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StaffPortal;
