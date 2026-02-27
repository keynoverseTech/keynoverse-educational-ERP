import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  BookOpen, 
  Calendar, 
  CreditCard, 
  GraduationCap, 
  Receipt,
  User,
  MapPin,
  Mail,
  Award,
  Activity
} from 'lucide-react';
import { useStudentPortalFinance } from '../../state/studentPortalFinanceContext';

const StudentDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { student, myInvoices, myPayments } = useStudentPortalFinance();

  // Mock Academic Data (In a real app, this would come from an AcademicContext)
  const academicProfile = {
    matricNumber: 'CSC/2021/042',
    faculty: 'Physical Sciences',
    department: 'Computer Science',
    currentSession: '2024/2025',
    currentSemester: 'First Semester',
    cgpa: 4.25,
    unitsRegistered: 18,
    attendance: 92, // Percentage
    advisor: 'Dr. A. Bello',
    email: 'samuel.john@student.edu', // Mock email matching the name
    phone: '08012345678',
    nextClass: {
      code: 'CSC 401',
      title: 'Advanced Software Engineering',
      time: '10:00 AM',
      venue: 'Lab 2',
      lecturer: 'Dr. A. Bello'
    }
  };

  const totals = useMemo(() => {
    const outstanding = myInvoices.reduce((sum, inv) => sum + inv.balance, 0);
    const dueCount = myInvoices.filter((inv) => inv.balance > 0).length;
    const postedPayments = myPayments.filter((p) => p.status === 'Posted');
    const totalPaid = postedPayments.reduce((sum, p) => sum + p.amountPaid, 0);
    const lastPayment = postedPayments[0];
    return { outstanding, dueCount, totalPaid, lastPayment };
  }, [myInvoices, myPayments]);

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
      {/* Header Section with Student Profile */}
      <div className="bg-white dark:bg-gray-800 rounded-[2.5rem] p-8 border border-gray-100 dark:border-gray-700 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-50 dark:bg-indigo-900/10 rounded-full -mr-24 -mt-24 pointer-events-none opacity-50"></div>
        
        <div className="flex flex-col md:flex-row gap-8 items-start relative z-10">
          {/* Profile Image & Basic Info */}
          <div className="flex-shrink-0 flex flex-col items-center md:items-start gap-4">
            <div className="w-32 h-32 rounded-[2rem] bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center border-4 border-white dark:border-gray-800 shadow-xl shadow-indigo-500/10">
              <User size={48} className="text-indigo-600 dark:text-indigo-400" />
            </div>
            <div className="text-center md:text-left">
              <span className="inline-block px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 text-[10px] font-black uppercase tracking-widest rounded-full mb-2">
                Active Student
              </span>
              <p className="text-sm font-bold text-gray-400 dark:text-gray-500">{academicProfile.matricNumber}</p>
            </div>
          </div>

          {/* Detailed Info */}
          <div className="flex-1 w-full">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
              <div>
                <h1 className="text-3xl font-black text-gray-900 dark:text-white">
                  {student.fullName}
                </h1>
                <p className="text-lg text-gray-500 dark:text-gray-400 mt-1">
                  {student.programme} • {student.level} Level
                </p>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => navigate('/student/profile')}
                  className="px-5 py-2.5 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-xl font-bold text-sm hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                >
                  Edit Profile
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="space-y-1">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wide">Faculty</p>
                <p className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
                  <BookOpen size={14} className="text-indigo-500" />
                  {academicProfile.faculty}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wide">Department</p>
                <p className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
                  <GraduationCap size={14} className="text-indigo-500" />
                  {academicProfile.department}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wide">Email</p>
                <p className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
                  <Mail size={14} className="text-indigo-500" />
                  {academicProfile.email}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wide">Advisor</p>
                <p className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
                  <User size={14} className="text-indigo-500" />
                  {academicProfile.advisor}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Academic & Schedule */}
        <div className="lg:col-span-2 space-y-8">
          {/* Academic Overview Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-[2rem] border border-gray-100 dark:border-gray-700 shadow-sm flex flex-col items-center text-center hover:scale-[1.02] transition-transform">
              <div className="p-3 bg-purple-50 dark:bg-purple-900/20 text-purple-600 rounded-2xl mb-3">
                <Award size={24} />
              </div>
              <h3 className="text-3xl font-black text-gray-900 dark:text-white">{academicProfile.cgpa}</h3>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">CGPA</p>
            </div>
            <div className="bg-white dark:bg-gray-800 p-6 rounded-[2rem] border border-gray-100 dark:border-gray-700 shadow-sm flex flex-col items-center text-center hover:scale-[1.02] transition-transform">
              <div className="p-3 bg-blue-50 dark:bg-blue-900/20 text-blue-600 rounded-2xl mb-3">
                <BookOpen size={24} />
              </div>
              <h3 className="text-3xl font-black text-gray-900 dark:text-white">{academicProfile.unitsRegistered}</h3>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">Units Registered</p>
            </div>
            <div className="bg-white dark:bg-gray-800 p-6 rounded-[2rem] border border-gray-100 dark:border-gray-700 shadow-sm flex flex-col items-center text-center hover:scale-[1.02] transition-transform">
              <div className="p-3 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 rounded-2xl mb-3">
                <Activity size={24} />
              </div>
              <h3 className="text-3xl font-black text-gray-900 dark:text-white">{academicProfile.attendance}%</h3>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">Attendance</p>
            </div>
          </div>

          {/* Next Class / Timetable Snippet */}
          <div className="bg-white dark:bg-gray-800 rounded-[2.5rem] border border-gray-100 dark:border-gray-700 p-8 shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-black text-gray-900 dark:text-white flex items-center gap-2">
                <Calendar size={20} className="text-indigo-600" />
                Next Class
              </h3>
              <button 
                onClick={() => navigate('/student/timetable')}
                className="text-sm font-bold text-indigo-600 hover:text-indigo-700"
              >
                View Timetable
              </button>
            </div>
            
            <div className="bg-indigo-50 dark:bg-indigo-900/20 rounded-[2rem] p-6 flex flex-col md:flex-row items-center justify-between gap-6 border border-indigo-100 dark:border-indigo-800">
              <div className="flex items-center gap-4">
                <div className="p-4 bg-white dark:bg-gray-800 rounded-2xl shadow-sm text-center min-w-[80px]">
                  <p className="text-xs font-black text-gray-400 uppercase">Today</p>
                  <p className="text-xl font-black text-indigo-600">{academicProfile.nextClass.time}</p>
                </div>
                <div>
                  <h4 className="text-lg font-black text-gray-900 dark:text-white">{academicProfile.nextClass.code}</h4>
                  <p className="font-medium text-gray-600 dark:text-gray-300">{academicProfile.nextClass.title}</p>
                  <div className="flex items-center gap-4 mt-2 text-xs font-bold text-gray-500">
                    <span className="flex items-center gap-1"><MapPin size={12} /> {academicProfile.nextClass.venue}</span>
                    <span className="flex items-center gap-1"><User size={12} /> {academicProfile.nextClass.lecturer}</span>
                  </div>
                </div>
              </div>
              <button 
                className="px-6 py-3 bg-indigo-600 text-white rounded-xl font-bold text-sm shadow-lg shadow-indigo-500/20 hover:scale-105 transition-transform"
              >
                Join Class
              </button>
            </div>
          </div>
          
          {/* Quick Links */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <button
              onClick={() => navigate('/student/courses')}
              className="p-4 rounded-3xl bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 hover:border-indigo-200 dark:hover:border-indigo-800 transition-colors group text-center"
            >
              <div className="w-10 h-10 mx-auto bg-gray-50 dark:bg-gray-900 rounded-xl flex items-center justify-center text-gray-500 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors mb-2">
                <BookOpen size={20} />
              </div>
              <span className="text-xs font-bold text-gray-600 dark:text-gray-300">My Courses</span>
            </button>
            <button
              onClick={() => navigate('/student/results')}
              className="p-4 rounded-3xl bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 hover:border-indigo-200 dark:hover:border-indigo-800 transition-colors group text-center"
            >
              <div className="w-10 h-10 mx-auto bg-gray-50 dark:bg-gray-900 rounded-xl flex items-center justify-center text-gray-500 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors mb-2">
                <Award size={20} />
              </div>
              <span className="text-xs font-bold text-gray-600 dark:text-gray-300">Results</span>
            </button>
            <button
              onClick={() => navigate('/student/timetable')}
              className="p-4 rounded-3xl bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 hover:border-indigo-200 dark:hover:border-indigo-800 transition-colors group text-center"
            >
              <div className="w-10 h-10 mx-auto bg-gray-50 dark:bg-gray-900 rounded-xl flex items-center justify-center text-gray-500 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors mb-2">
                <Calendar size={20} />
              </div>
              <span className="text-xs font-bold text-gray-600 dark:text-gray-300">Timetable</span>
            </button>
            <button
              onClick={() => navigate('/student/profile')}
              className="p-4 rounded-3xl bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 hover:border-indigo-200 dark:hover:border-indigo-800 transition-colors group text-center"
            >
              <div className="w-10 h-10 mx-auto bg-gray-50 dark:bg-gray-900 rounded-xl flex items-center justify-center text-gray-500 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors mb-2">
                <User size={20} />
              </div>
              <span className="text-xs font-bold text-gray-600 dark:text-gray-300">Profile</span>
            </button>
          </div>
        </div>

        {/* Right Column: Finance Snapshot */}
        <div className="space-y-6">
          <div className="bg-indigo-600 rounded-[2.5rem] p-8 shadow-xl shadow-indigo-500/20 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full -mr-16 -mt-16 pointer-events-none"></div>
            <div className="relative z-10">
              <h3 className="text-xl font-black mb-1 flex items-center gap-2">
                <CreditCard size={20} />
                Finance
              </h3>
              <p className="text-indigo-100 text-sm mb-6">Current session status</p>
              
              <div className="bg-white/10 backdrop-blur-sm p-6 rounded-3xl border border-white/10 mb-4">
                <p className="text-xs text-indigo-200 uppercase tracking-widest font-bold mb-1">Outstanding</p>
                <p className="text-3xl font-black">₦{totals.outstanding.toLocaleString()}</p>
                {totals.dueCount > 0 && (
                  <p className="text-xs text-indigo-100 mt-2 bg-red-500/20 inline-block px-2 py-1 rounded-lg">
                    {totals.dueCount} invoices due
                  </p>
                )}
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => navigate('/student/fees')}
                  className="flex-1 py-3 bg-white text-indigo-600 rounded-xl font-bold text-sm hover:bg-indigo-50 transition-colors shadow-lg"
                >
                  Pay Now
                </button>
                <button
                  onClick={() => navigate('/student/fees/history')}
                  className="px-4 py-3 bg-indigo-700 text-white rounded-xl font-bold text-sm hover:bg-indigo-800 transition-colors"
                >
                  History
                </button>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-[2.5rem] border border-gray-100 dark:border-gray-700 p-6 shadow-sm">
            <h3 className="text-lg font-black text-gray-900 dark:text-white mb-4">Recent Payments</h3>
            <div className="space-y-4">
              {myPayments.slice(0, 3).map((payment) => (
                <div key={payment.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-900/50 rounded-2xl">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-green-100 dark:bg-green-900/20 text-green-600 rounded-xl">
                      <Receipt size={16} />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-gray-900 dark:text-white">₦{payment.amountPaid.toLocaleString()}</p>
                      <p className="text-[10px] text-gray-500">{new Date(payment.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wide text-gray-400">{payment.paymentMethod}</span>
                </div>
              ))}
              {myPayments.length === 0 && (
                <p className="text-sm text-gray-400 text-center py-4">No recent payments found.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
