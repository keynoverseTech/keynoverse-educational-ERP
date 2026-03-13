import React, { useState, useEffect } from 'react';
import { BookOpen, Clock, BarChart2, TrendingUp, TrendingDown, Users, Settings, List, Calendar, ArrowLeft, GraduationCap, School, ChevronRight, Activity, ClipboardCheck, FileText } from 'lucide-react';
import { academicsOverviewService } from './service';
import type { AcademicsOverviewData } from './types';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend, Filler } from 'chart.js';
import AcademicConfiguration from './AcademicConfiguration';
import CoursesList from './CoursesList';
import TimetableView from './TimetableView';
import AttendanceReport from './AttendanceReport';
import ResearchProjectsOverview from './ResearchProjectsOverview';
import { useNavigate } from 'react-router-dom';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend, Filler);

const AcademicsOverviewDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [data, setData] = useState<AcademicsOverviewData | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'config' | 'courses' | 'timetable' | 'attendance' | 'research'>('overview');

  useEffect(() => {
    academicsOverviewService.getAcademicsOverviewData().then(res => {
      setData(res);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="flex flex-col items-center gap-4">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
            <p className="text-gray-500 font-medium">Loading Academic Data...</p>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="p-8 text-center bg-gray-50 dark:bg-gray-900 min-h-screen flex flex-col items-center justify-center">
        <School size={64} className="text-gray-300 mb-6" />
        <h3 className="text-xl font-bold text-gray-900 dark:text-white">Unable to load academic data</h3>
        <p className="text-gray-500 mt-2 mb-6">We couldn't fetch the latest academic information. Please check your connection.</p>
        <button 
            onClick={() => window.location.reload()}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
            Retry
        </button>
      </div>
    );
  }

  // Enhanced Chart Data
  const attendanceChartData = {
    labels: data.attendanceReport.dailyTrend.map(d => d.day),
    datasets: [
      {
        label: 'Present',
        data: data.attendanceReport.dailyTrend.map(d => d.present),
        backgroundColor: 'rgba(59, 130, 246, 0.8)',
        borderRadius: 6,
        barThickness: 20,
      },
      {
        label: 'Absent',
        data: data.attendanceReport.dailyTrend.map(d => d.absent),
        backgroundColor: 'rgba(239, 68, 68, 0.2)',
        borderRadius: 6,
        barThickness: 20,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        align: 'end' as const,
        labels: {
          usePointStyle: true,
          boxWidth: 8,
          padding: 20,
          font: {
            family: "'Inter', sans-serif",
            size: 11
          }
        }
      },
      tooltip: {
        backgroundColor: 'rgba(17, 24, 39, 0.9)',
        padding: 12,
        titleFont: { size: 13 },
        bodyFont: { size: 12 },
        cornerRadius: 8,
        displayColors: false,
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          display: true,
          color: 'rgba(243, 244, 246, 0.6)',
          drawBorder: false,
        },
        ticks: {
            font: { size: 11 },
            color: '#9CA3AF'
        }
      },
      x: {
        grid: {
          display: false,
        },
        ticks: {
            font: { size: 11 },
            color: '#6B7280'
        }
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50/50 dark:bg-gray-900">
      {/* Top Navigation Bar */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-30 shadow-sm backdrop-blur-xl bg-opacity-90 dark:bg-opacity-90">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <button 
                onClick={() => navigate(-1)}
                className="group flex items-center gap-2 px-3 py-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-all text-gray-500 dark:text-gray-400"
              >
                <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
                <span className="text-sm font-medium">Back</span>
              </button>
              <div className="h-6 w-px bg-gray-200 dark:bg-gray-700 mx-2"></div>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-600 rounded-lg text-white shadow-lg shadow-blue-500/30">
                  <GraduationCap size={20} />
                </div>
                <div>
                  <h1 className="text-lg font-bold text-gray-900 dark:text-white leading-tight">Academics Overview</h1>
                  <p className="text-[11px] font-medium text-gray-500 dark:text-gray-400 tracking-wide uppercase">Institutional Management</p>
                </div>
              </div>
            </div>
            
            {/* Navigation Tabs */}
            <nav className="flex items-center bg-gray-100/50 dark:bg-gray-700/30 p-1 rounded-xl">
              {[
                { id: 'overview', label: 'Dashboard', icon: Activity },
                { id: 'config', label: 'Modules Oversight', icon: Settings },
                { id: 'courses', label: 'All Courses', icon: BookOpen },
                { id: 'timetable', label: 'Timetable', icon: Calendar },
                { id: 'attendance', label: 'Attendance', icon: ClipboardCheck },
                { id: 'research', label: 'Research & Projects', icon: FileText },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    activeTab === tab.id
                      ? 'bg-white dark:bg-gray-800 text-blue-600 dark:text-blue-400 shadow-sm ring-1 ring-black/5 dark:ring-white/10'
                      : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:bg-gray-200/50 dark:hover:bg-gray-600/30'
                  }`}
                >
                  <tab.icon size={16} className={activeTab === tab.id ? 'stroke-[2.5px]' : 'stroke-2'} />
                  <span className="hidden sm:inline">{tab.label}</span>
                </button>
              ))}
            </nav>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Dynamic Content Rendering */}
        <div className="min-h-[calc(100vh-140px)]">
          {activeTab === 'overview' && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              
              {/* Header Section */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Academic Snapshot</h2>
                  <p className="text-gray-500 dark:text-gray-400 mt-1">Real-time overview of courses, attendance, and activities.</p>
                </div>
                <div className="flex gap-3">
                    <button className="px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 shadow-sm">
                        Download Report
                    </button>
                    <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 shadow-lg shadow-blue-500/30">
                        View Analytics
                    </button>
                </div>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white shadow-xl shadow-blue-500/20 relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-10 -mt-10 blur-2xl group-hover:scale-110 transition-transform duration-700"></div>
                  <div className="relative z-10">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                            <BookOpen size={20} className="text-white" />
                        </div>
                        <span className="flex items-center gap-1 text-xs font-medium bg-white/20 px-2 py-1 rounded-full text-white/90">
                            <TrendingUp size={12} /> +12%
                        </span>
                    </div>
                    <h3 className="text-blue-100 text-sm font-medium mb-1">Total Active Courses</h3>
                    <p className="text-3xl font-bold">{data.courseSummary.totalCourses}</p>
                    <p className="text-blue-100/70 text-xs mt-4">Across all departments</p>
                  </div>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-100 dark:border-gray-700 shadow-sm relative overflow-hidden group hover:border-blue-200 dark:hover:border-blue-900 transition-colors">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-purple-50 dark:bg-purple-900/10 rounded-full -mr-8 -mt-8 group-hover:scale-110 transition-transform duration-700"></div>
                  <div className="relative z-10">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-2 bg-purple-50 dark:bg-purple-900/20 rounded-lg text-purple-600">
                            <List size={20} />
                        </div>
                        <span className="text-xs font-medium text-gray-400">This Month</span>
                    </div>
                    <h3 className="text-gray-500 dark:text-gray-400 text-sm font-medium mb-1">New Courses Added</h3>
                    <p className="text-3xl font-bold text-gray-900 dark:text-white">{data.courseSummary.newCourses}</p>
                    <p className="text-gray-400 text-xs mt-4">Awaiting final approval</p>
                  </div>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-100 dark:border-gray-700 shadow-sm relative overflow-hidden group hover:border-orange-200 dark:hover:border-orange-900 transition-colors">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-orange-50 dark:bg-orange-900/10 rounded-full -mr-8 -mt-8 group-hover:scale-110 transition-transform duration-700"></div>
                  <div className="relative z-10">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-2 bg-orange-50 dark:bg-orange-900/20 rounded-lg text-orange-600">
                            <Users size={20} />
                        </div>
                        <span className="flex items-center gap-1 text-xs font-medium bg-orange-50 dark:bg-orange-900/20 text-orange-600 px-2 py-1 rounded-full">
                            Action Needed
                        </span>
                    </div>
                    <h3 className="text-gray-500 dark:text-gray-400 text-sm font-medium mb-1">Low Enrollment</h3>
                    <p className="text-3xl font-bold text-gray-900 dark:text-white">{data.courseSummary.coursesWithNoStudents}</p>
                    <p className="text-gray-400 text-xs mt-4">Courses with &lt; 5 students</p>
                  </div>
                </div>
              </div>

              {/* Main Dashboard Content Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                
                {/* Attendance Chart Section */}
                <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                  <div className="flex items-center justify-between mb-8">
                    <div>
                      <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                        <BarChart2 className="text-blue-500" size={20} />
                        Attendance Trends
                      </h3>
                      <p className="text-sm text-gray-500">Weekly student participation overview</p>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="text-right hidden sm:block">
                            <p className="text-2xl font-bold text-gray-900 dark:text-white">{data.attendanceReport.overallAttendance}%</p>
                            <p className="text-xs text-gray-500">Average Rate</p>
                        </div>
                        <div className="p-2 bg-gray-50 dark:bg-gray-700 rounded-lg">
                            <TrendingUp size={20} className="text-green-500" />
                        </div>
                    </div>
                  </div>

                  <div className="h-[320px] w-full">
                    <Bar data={attendanceChartData} options={chartOptions} />
                  </div>

                  {/* Performance Indicators */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8 pt-6 border-t border-gray-100 dark:border-gray-700">
                    <div className="flex items-center gap-4 p-4 bg-green-50/50 dark:bg-green-900/10 rounded-xl border border-green-100 dark:border-green-900/20">
                      <div className="p-3 bg-white dark:bg-gray-800 rounded-lg text-green-600 shadow-sm">
                        <TrendingUp size={20} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">Top Performer</p>
                        <p className="text-sm font-bold text-gray-900 dark:text-white truncate" title={data.attendanceReport.bestPerformingCourse.name}>
                          {data.attendanceReport.bestPerformingCourse.name}
                        </p>
                      </div>
                      <div className="text-right">
                        <span className="text-lg font-bold text-green-600">{data.attendanceReport.bestPerformingCourse.rate}%</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 p-4 bg-red-50/50 dark:bg-red-900/10 rounded-xl border border-red-100 dark:border-red-900/20">
                      <div className="p-3 bg-white dark:bg-gray-800 rounded-lg text-red-600 shadow-sm">
                        <TrendingDown size={20} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">Needs Focus</p>
                        <p className="text-sm font-bold text-gray-900 dark:text-white truncate" title={data.attendanceReport.worstPerformingCourse.name}>
                          {data.attendanceReport.worstPerformingCourse.name}
                        </p>
                      </div>
                      <div className="text-right">
                        <span className="text-lg font-bold text-red-600">{data.attendanceReport.worstPerformingCourse.rate}%</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Upcoming Classes / Schedule Widget */}
                <div className="lg:col-span-1 bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 flex flex-col">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                      <Clock className="text-blue-500" size={20} />
                      Live Schedule
                    </h3>
                    <button onClick={() => setActiveTab('timetable')} className="text-xs font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 flex items-center gap-1">
                        View All <ChevronRight size={14} />
                    </button>
                  </div>
                  
                  <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
                      <div className="space-y-4">
                        {data.upcomingClasses.map((c, idx) => (
                            <div key={c.id} className="relative pl-6 pb-4 border-l-2 border-gray-100 dark:border-gray-700 last:border-0 last:pb-0 group">
                            <div className={`absolute -left-[9px] top-0 w-4 h-4 rounded-full border-2 border-white dark:border-gray-800 box-content ${idx === 0 ? 'bg-green-500 ring-4 ring-green-100 dark:ring-green-900/30' : 'bg-gray-300 dark:bg-gray-600'}`}></div>
                            
                            <div className="bg-gray-50 dark:bg-gray-700/20 p-4 rounded-xl group-hover:bg-blue-50 dark:group-hover:bg-blue-900/10 transition-colors border border-transparent group-hover:border-blue-100 dark:group-hover:border-blue-900/30">
                                <div className="flex justify-between items-start mb-2">
                                    <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/30 px-2 py-0.5 rounded uppercase tracking-wide">
                                        {c.courseCode}
                                    </span>
                                    <span className="text-xs font-semibold text-gray-500 bg-white dark:bg-gray-800 px-2 py-0.5 rounded shadow-sm border border-gray-100 dark:border-gray-700">
                                        {c.time}
                                    </span>
                                </div>
                                <h4 className="font-bold text-gray-900 dark:text-white text-sm mb-2">{c.courseName}</h4>
                                <div className="flex flex-col gap-1.5">
                                    <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                                        <Users size={12} className="text-gray-400" /> 
                                        <span>{c.lecturer}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                                        <School size={12} className="text-gray-400" /> 
                                        <span>{c.location}</span>
                                    </div>
                                </div>
                            </div>
                            </div>
                        ))}
                      </div>
                  </div>

                  <div className="mt-6 pt-4 border-t border-gray-100 dark:border-gray-700 text-center">
                      <p className="text-xs text-gray-400">Showing next 2 hours of classes</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'config' && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <AcademicConfiguration configurations={data.modules} />
            </div>
          )}

          {activeTab === 'research' && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <ResearchProjectsOverview />
            </div>
          )}

          {activeTab === 'courses' && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <CoursesList courses={data.courses} />
            </div>
          )}

          {activeTab === 'timetable' && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <TimetableView timetable={data.timetable} />
            </div>
          )}

          {activeTab === 'attendance' && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <AttendanceReport />
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default AcademicsOverviewDashboard;
