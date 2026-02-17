import { 
  Users, 
  BookOpen, 
  Clock, 
  CheckCircle,
  AlertCircle,
  FileText,
  Briefcase
} from 'lucide-react';

import { Link } from 'react-router-dom';

const StaffDashboard = () => {
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
              ].map((course, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-900/50 rounded-lg border border-gray-100 dark:border-gray-800">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400 font-bold text-xs">
                      {course.code.split(' ')[0]}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white">{course.title}</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{course.code} • {course.students} Students</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-medium text-gray-500 dark:text-gray-400">{course.schedule}</p>
                    <button className="text-xs text-blue-600 hover:underline mt-1">Manage</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Tasks / Notifications */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">Tasks & Alerts</h2>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <AlertCircle className="text-red-500 mt-0.5 flex-shrink-0" size={18} />
                <div>
                  <h4 className="text-sm font-semibold text-gray-900 dark:text-white">Submit Exam Scores</h4>
                  <p className="text-xs text-gray-500 mt-0.5">Deadline: Oct 30, 2025</p>
                  <Link to="/staff/grading" className="text-xs text-blue-600 hover:underline mt-1 block">Upload Scores →</Link>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Clock className="text-orange-500 mt-0.5 flex-shrink-0" size={18} />
                <div>
                  <h4 className="text-sm font-semibold text-gray-900 dark:text-white">Department Meeting</h4>
                  <p className="text-xs text-gray-500 mt-0.5">Tomorrow, 10:00 AM</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="text-green-500 mt-0.5 flex-shrink-0" size={18} />
                <div>
                  <h4 className="text-sm font-semibold text-gray-900 dark:text-white">Attendance Uploaded</h4>
                  <p className="text-xs text-gray-500 mt-0.5">CSC 202 - Week 4</p>
                </div>
              </div>
            </div>
            <button className="w-full mt-6 py-2 border border-gray-200 dark:border-gray-700 rounded-lg text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
              View Calendar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StaffDashboard;
