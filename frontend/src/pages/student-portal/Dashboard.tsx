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
  Award,
  Activity,
  ArrowUpRight,
  ArrowDownRight
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

  const stats = useMemo(() => {
    const fmtMoney = (n: number) => `₦${n.toLocaleString()}`;
    return [
      {
        title: 'CGPA',
        value: academicProfile.cgpa.toFixed(2),
        subtext: 'Current',
        icon: Award,
        trend: academicProfile.cgpa >= 4.0 ? 'up' : 'down',
        trendValue: academicProfile.cgpa >= 4.0 ? 'Excellent' : 'Needs improvement'
      },
      {
        title: 'Units Registered',
        value: String(academicProfile.unitsRegistered),
        subtext: `${academicProfile.currentSemester}`,
        icon: BookOpen,
        trend: 'up',
        trendValue: 'On track'
      },
      {
        title: 'Attendance',
        value: `${academicProfile.attendance}%`,
        subtext: 'This semester',
        icon: Activity,
        trend: academicProfile.attendance >= 80 ? 'up' : 'down',
        trendValue: academicProfile.attendance >= 80 ? 'Good' : 'Low'
      },
      {
        title: 'Outstanding Fees',
        value: fmtMoney(totals.outstanding),
        subtext: totals.dueCount > 0 ? `${totals.dueCount} invoices due` : 'No dues',
        icon: CreditCard,
        trend: totals.outstanding === 0 ? 'up' : 'down',
        trendValue: totals.outstanding === 0 ? 'Cleared' : 'Pending'
      }
    ] as const;
  }, [academicProfile.attendance, academicProfile.cgpa, academicProfile.currentSemester, academicProfile.unitsRegistered, totals.dueCount, totals.outstanding]);

  const gradientForStat = (title: string) => {
    if (title.includes('Outstanding')) return 'bg-gradient-to-r from-rose-500 via-red-500 to-orange-500';
    if (title.includes('Attendance')) return 'bg-gradient-to-r from-emerald-500 via-emerald-400 to-teal-500';
    if (title.includes('Units')) return 'bg-gradient-to-r from-blue-500 via-indigo-500 to-emerald-500';
    return 'bg-gradient-to-r from-purple-500 via-indigo-500 to-blue-500';
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto animate-in fade-in duration-500">
      <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-emerald-500 rounded-2xl px-6 py-5 shadow-lg shadow-blue-600/20 border border-blue-500/20">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-xs font-semibold text-blue-50 mb-3">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              Student Overview
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-white flex items-center gap-2">
              <GraduationCap className="w-7 h-7" />
              Student Dashboard
            </h1>
            <p className="text-blue-50/80 mt-2 text-sm md:text-base max-w-xl">
              Track academics, schedules, and finance for the current session.
            </p>
          </div>
          <div className="flex flex-col items-start md:items-end gap-3 text-blue-50/90">
            <div className="text-right">
              <p className="text-xs uppercase tracking-wide">Student</p>
              <p className="text-xl font-bold">{student.fullName}</p>
              <p className="text-xs text-blue-50/80 font-semibold mt-1">{academicProfile.matricNumber} • {academicProfile.currentSession}</p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => navigate('/student/profile')}
                className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors text-sm font-bold backdrop-blur-sm border border-white/20"
              >
                Edit Profile
              </button>
              <button
                onClick={() => navigate('/student/fees')}
                className="px-4 py-2 bg-white text-blue-700 rounded-lg transition-colors text-sm font-bold shadow-sm"
              >
                Pay Fees
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
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-6 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <h3 className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <User size={18} className="text-blue-600 dark:text-blue-400" />
                Profile Snapshot
              </h3>
              <div className="text-xs font-bold text-gray-500 dark:text-gray-400">
                {student.programme} • {student.level} Level
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
              <div className="space-y-1">
                <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wide">Faculty</p>
                <p className="text-sm font-bold text-gray-900 dark:text-white truncate" title={academicProfile.faculty}>
                  {academicProfile.faculty}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wide">Department</p>
                <p className="text-sm font-bold text-gray-900 dark:text-white truncate" title={academicProfile.department}>
                  {academicProfile.department}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wide">Email</p>
                <p className="text-sm font-bold text-gray-900 dark:text-white truncate" title={academicProfile.email}>
                  {academicProfile.email}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wide">Advisor</p>
                <p className="text-sm font-bold text-gray-900 dark:text-white truncate" title={academicProfile.advisor}>
                  {academicProfile.advisor}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <Calendar size={18} className="text-blue-600 dark:text-blue-400" />
                Next Class
              </h3>
              <button
                onClick={() => navigate('/student/timetable')}
                className="text-sm font-bold text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
              >
                View Timetable
              </button>
            </div>

            <div className="bg-gray-50 dark:bg-gray-900/50 rounded-2xl p-5 border border-gray-200 dark:border-gray-700 flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 text-center min-w-[92px]">
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Time</p>
                  <p className="text-lg font-black text-gray-900 dark:text-white mt-1">{academicProfile.nextClass.time}</p>
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wide">{academicProfile.nextClass.code}</p>
                  <h4 className="text-lg font-bold text-gray-900 dark:text-white">{academicProfile.nextClass.title}</h4>
                  <div className="flex flex-wrap items-center gap-3 mt-2 text-xs font-bold text-gray-500 dark:text-gray-400">
                    <span className="flex items-center gap-1"><MapPin size={12} /> {academicProfile.nextClass.venue}</span>
                    <span className="flex items-center gap-1"><User size={12} /> {academicProfile.nextClass.lecturer}</span>
                  </div>
                </div>
              </div>
              <button className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-sm font-bold">
                Join Class
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <button
              onClick={() => navigate('/student/courses')}
              className="p-4 rounded-2xl bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 hover:border-blue-200 dark:hover:border-blue-800 transition-colors group text-center shadow-sm"
            >
              <div className="w-10 h-10 mx-auto bg-blue-50 dark:bg-blue-900/20 rounded-xl flex items-center justify-center text-blue-600 dark:text-blue-400 transition-colors mb-2">
                <BookOpen size={20} />
              </div>
              <span className="text-xs font-bold text-gray-700 dark:text-gray-200">My Courses</span>
            </button>
            <button
              onClick={() => navigate('/student/results')}
              className="p-4 rounded-2xl bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 hover:border-blue-200 dark:hover:border-blue-800 transition-colors group text-center shadow-sm"
            >
              <div className="w-10 h-10 mx-auto bg-emerald-50 dark:bg-emerald-900/20 rounded-xl flex items-center justify-center text-emerald-600 dark:text-emerald-400 transition-colors mb-2">
                <Award size={20} />
              </div>
              <span className="text-xs font-bold text-gray-700 dark:text-gray-200">Results</span>
            </button>
            <button
              onClick={() => navigate('/student/fees')}
              className="p-4 rounded-2xl bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 hover:border-blue-200 dark:hover:border-blue-800 transition-colors group text-center shadow-sm"
            >
              <div className="w-10 h-10 mx-auto bg-indigo-50 dark:bg-indigo-900/20 rounded-xl flex items-center justify-center text-indigo-600 dark:text-indigo-400 transition-colors mb-2">
                <CreditCard size={20} />
              </div>
              <span className="text-xs font-bold text-gray-700 dark:text-gray-200">Fees</span>
            </button>
            <button
              onClick={() => navigate('/student/profile')}
              className="p-4 rounded-2xl bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 hover:border-blue-200 dark:hover:border-blue-800 transition-colors group text-center shadow-sm"
            >
              <div className="w-10 h-10 mx-auto bg-gray-50 dark:bg-gray-900 rounded-xl flex items-center justify-center text-gray-600 dark:text-gray-300 transition-colors mb-2">
                <User size={20} />
              </div>
              <span className="text-xs font-bold text-gray-700 dark:text-gray-200">Profile</span>
            </button>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-emerald-500 rounded-2xl p-6 shadow-lg shadow-blue-600/20 border border-blue-500/20 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full -mr-16 -mt-16 pointer-events-none"></div>
            <div className="relative">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold flex items-center gap-2">
                  <CreditCard size={18} />
                  Finance Snapshot
                </h3>
                <button
                  onClick={() => navigate('/student/fees/history')}
                  className="px-3 py-1.5 bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg text-xs font-bold transition-colors"
                >
                  History
                </button>
              </div>

              <div className="mt-5 bg-white/10 backdrop-blur-sm p-5 rounded-2xl border border-white/10">
                <p className="text-xs text-blue-50/80 uppercase tracking-widest font-bold">Outstanding</p>
                <p className="text-3xl font-black mt-2">₦{totals.outstanding.toLocaleString()}</p>
                <p className="text-xs text-blue-50/80 mt-2">{totals.dueCount > 0 ? `${totals.dueCount} invoices due` : 'No pending invoices'}</p>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-2">
                <button
                  onClick={() => navigate('/student/fees')}
                  className="py-3 bg-white text-blue-700 rounded-lg font-bold text-sm hover:bg-blue-50 transition-colors shadow-sm"
                >
                  Pay Now
                </button>
                <button
                  onClick={() => navigate('/student/fees/receipts')}
                  className="py-3 bg-white/10 hover:bg-white/20 text-white rounded-lg font-bold text-sm transition-colors border border-white/20"
                >
                  Receipts
                </button>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">Recent Payments</h3>
              <button
                onClick={() => navigate('/student/fees/history')}
                className="text-xs font-bold text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
              >
                View all
              </button>
            </div>
            <div className="space-y-3">
              {myPayments.slice(0, 4).map((payment) => (
                <div key={payment.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-900/50 rounded-2xl border border-gray-200/70 dark:border-gray-700/70">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="p-2 bg-emerald-100 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 rounded-xl">
                      <Receipt size={16} />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-bold text-gray-900 dark:text-white truncate">₦{payment.amountPaid.toLocaleString()}</p>
                      <p className="text-[10px] text-gray-500 dark:text-gray-400">{new Date(payment.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wide text-gray-400 dark:text-gray-500">{payment.paymentMethod}</span>
                </div>
              ))}
              {myPayments.length === 0 && (
                <p className="text-sm text-gray-400 text-center py-6">No recent payments found.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
