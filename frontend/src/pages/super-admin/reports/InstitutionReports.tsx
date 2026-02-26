import React from 'react';
import { 
  Users, 
  GraduationCap, 
  BookOpen, 
  ArrowUpRight, 
  TrendingUp,
  AlertTriangle,
  Printer,
  Download,
  UserCheck
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell
} from 'recharts';

interface InstitutionReportsProps {
  institutionId: string;
  reportType?: string;
}

const InstitutionReports: React.FC<InstitutionReportsProps> = ({ institutionId, reportType = 'summary' }) => {
  // Mock Data for specific institution
  const mockInstitutionName = 
    institutionId === 'inst-1' ? 'Global Heights Academy' : 
    institutionId === 'inst-2' ? 'Tech Institute of Technology' : 'City University';

  // Mock Data for specific report types
  const departmentStats = [
    { department: 'Computer Science', total: 450, graduating: 120, dropouts: 5, malpractice: 2, deceased: 1, withdrawn: 8 },
    { department: 'Electrical Engineering', total: 380, graduating: 95, dropouts: 3, malpractice: 1, deceased: 0, withdrawn: 4 },
    { department: 'Business Admin', total: 520, graduating: 150, dropouts: 8, malpractice: 4, deceased: 2, withdrawn: 12 },
    { department: 'Biochemistry', total: 310, graduating: 80, dropouts: 2, malpractice: 0, deceased: 0, withdrawn: 3 },
    { department: 'Mass Communication', total: 410, graduating: 110, dropouts: 6, malpractice: 3, deceased: 1, withdrawn: 7 },
  ];

  const studentData = [
    { id: 1, name: 'John Doe', matricNo: 'MAT/2023/001', status: 'Active', cgpa: 4.5, graduating: true },
    { id: 2, name: 'Jane Smith', matricNo: 'MAT/2023/002', status: 'Active', cgpa: 3.8, graduating: false },
    { id: 3, name: 'Mike Johnson', matricNo: 'MAT/2023/003', status: 'Probation', cgpa: 1.9, graduating: false },
    { id: 4, name: 'Sarah Wilson', matricNo: 'MAT/2023/004', status: 'Active', cgpa: 4.2, graduating: true },
    { id: 5, name: 'David Brown', matricNo: 'MAT/2023/005', status: 'Withdrawn', cgpa: 2.1, graduating: false },
  ];

  const financialData = [
    { category: 'Tuition Fees', expected: 5000000, collected: 4200000, outstanding: 800000 },
    { category: 'Hostel Fees', expected: 2000000, collected: 1800000, outstanding: 200000 },
    { category: 'Library Fees', expected: 500000, collected: 450000, outstanding: 50000 },
  ];

  const monthlyAttendance = [
    { name: 'Week 1', rate: 92 },
    { name: 'Week 2', rate: 88 },
    { name: 'Week 3', rate: 95 },
    { name: 'Week 4', rate: 91 },
  ];

  const departmentPerformance = [
    { name: 'Science', score: 85 },
    { name: 'Arts', score: 78 },
    { name: 'Commerce', score: 92 },
    { name: 'Tech', score: 88 },
  ];

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

  const academicData = {
    totalStudents: 1240,
    totalStaff: 120,
    coursesActive: 48,
    examsConducted: 35,
    incidents: 3,
    attendanceRate: 92,
    programs: [
      { name: 'Undergraduate', value: 850 },
      { name: 'Postgraduate', value: 250 },
      { name: 'Diploma', value: 140 },
    ],
    semesterPerformance: [
      { name: 'Sem 1', avgScore: 78 },
      { name: 'Sem 2', avgScore: 82 },
    ]
  };

  const renderContent = () => {
    switch (reportType) {
      case 'academic':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white dark:bg-[#151e32] p-6 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <p className="text-sm font-bold text-gray-500 uppercase">Student/Staff Ratio</p>
                    <h3 className="text-2xl font-black text-gray-900 dark:text-white mt-1">10:1</h3>
                  </div>
                  <div className="p-3 bg-blue-50 dark:bg-blue-900/20 text-blue-600 rounded-xl">
                    <UserCheck size={20} />
                  </div>
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <span className="font-medium text-gray-900 dark:text-white">{academicData.totalStudents} Students</span>
                  <span>/</span>
                  <span className="font-medium text-gray-900 dark:text-white">{academicData.totalStaff} Staff</span>
                </div>
              </div>

              <div className="bg-white dark:bg-[#151e32] p-6 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <p className="text-sm font-bold text-gray-500 uppercase">Courses & Exams</p>
                    <h3 className="text-2xl font-black text-gray-900 dark:text-white mt-1">{academicData.coursesActive}</h3>
                  </div>
                  <div className="p-3 bg-purple-50 dark:bg-purple-900/20 text-purple-600 rounded-xl">
                    <BookOpen size={20} />
                  </div>
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <span className="font-medium text-gray-900 dark:text-white">{academicData.examsConducted} Exams Written</span>
                </div>
              </div>

              <div className="bg-white dark:bg-[#151e32] p-6 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <p className="text-sm font-bold text-gray-500 uppercase">Incidents</p>
                    <h3 className="text-2xl font-black text-gray-900 dark:text-white mt-1">{academicData.incidents}</h3>
                  </div>
                  <div className="p-3 bg-red-50 dark:bg-red-900/20 text-red-600 rounded-xl">
                    <AlertTriangle size={20} />
                  </div>
                </div>
                <div className="flex items-center gap-2 text-xs text-red-600 bg-red-50 px-2 py-0.5 rounded-md w-fit">
                  <span>Requires Attention</span>
                </div>
              </div>

              <div className="bg-white dark:bg-[#151e32] p-6 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <p className="text-sm font-bold text-gray-500 uppercase">Attendance Rate</p>
                    <h3 className="text-2xl font-black text-gray-900 dark:text-white mt-1">{academicData.attendanceRate}%</h3>
                  </div>
                  <div className="p-3 bg-green-50 dark:bg-green-900/20 text-green-600 rounded-xl">
                    <TrendingUp size={20} />
                  </div>
                </div>
                <div className="flex items-center gap-2 text-xs text-green-600 bg-green-50 px-2 py-0.5 rounded-md w-fit">
                  <ArrowUpRight size={12} /> +2.5% vs last sem
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white dark:bg-[#151e32] p-6 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6">Program Distribution</h3>
                <div className="h-80 w-full flex items-center justify-center">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={academicData.programs}
                        cx="50%"
                        cy="50%"
                        innerRadius={80}
                        outerRadius={100}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {academicData.programs.map((_entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend verticalAlign="bottom" height={36} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="bg-white dark:bg-[#151e32] p-6 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6">Department Performance</h3>
                <div className="h-80 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={departmentPerformance} layout="vertical" margin={{ left: 40 }}>
                      <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e5e7eb" />
                      <XAxis type="number" hide />
                      <YAxis dataKey="name" type="category" width={100} tick={{fill: '#6b7280', fontSize: 12, fontWeight: 600}} axisLine={false} tickLine={false} />
                      <Tooltip cursor={{fill: 'transparent'}} />
                      <Bar dataKey="score" fill="#3b82f6" radius={[0, 4, 4, 0]} barSize={32} background={{ fill: '#f3f4f6' }} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>
        );

      case 'student':
        return (
          <div className="space-y-6">
            <div className="bg-white dark:bg-[#151e32] p-6 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">Departmental Student Statistics</h3>
                <div className="flex gap-2">
                  <select className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-1.5 text-sm">
                    <option>2024/2025 Session</option>
                    <option>2023/2024 Session</option>
                    <option>2022/2023 Session</option>
                  </select>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-gray-50 dark:bg-gray-900/50 text-gray-500 uppercase font-bold text-xs">
                    <tr>
                      <th className="p-4">Department</th>
                      <th className="p-4 text-center">Total Students</th>
                      <th className="p-4 text-center">Graduating</th>
                      <th className="p-4 text-center text-orange-600">Dropouts</th>
                      <th className="p-4 text-center text-red-600">Malpractice</th>
                      <th className="p-4 text-center text-gray-600">Deceased</th>
                      <th className="p-4 text-center text-yellow-600">Withdrawn</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                    {departmentStats.map((dept, index) => (
                      <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-900/20">
                        <td className="p-4 font-bold text-gray-900 dark:text-white">{dept.department}</td>
                        <td className="p-4 text-center font-medium">{dept.total}</td>
                        <td className="p-4 text-center font-medium text-blue-600 bg-blue-50 dark:bg-blue-900/10 rounded-lg">{dept.graduating}</td>
                        <td className="p-4 text-center text-orange-600">{dept.dropouts}</td>
                        <td className="p-4 text-center text-red-600">{dept.malpractice}</td>
                        <td className="p-4 text-center text-gray-500">{dept.deceased}</td>
                        <td className="p-4 text-center text-yellow-600">{dept.withdrawn}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="bg-white dark:bg-[#151e32] p-6 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6">Detailed Student Directory</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-gray-50 dark:bg-gray-900/50 text-gray-500 uppercase font-bold text-xs">
                    <tr>
                      <th className="p-4">Student Name</th>
                      <th className="p-4">Matric No</th>
                      <th className="p-4">CGPA</th>
                      <th className="p-4">Status</th>
                      <th className="p-4">Graduating</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                    {studentData.map((student) => (
                      <tr key={student.id} className="hover:bg-gray-50 dark:hover:bg-gray-900/20">
                        <td className="p-4 font-medium text-gray-900 dark:text-white">{student.name}</td>
                        <td className="p-4 text-gray-500">{student.matricNo}</td>
                        <td className="p-4 font-bold text-gray-700 dark:text-gray-300">{student.cgpa}</td>
                        <td className="p-4">
                          <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                            student.status === 'Active' ? 'bg-green-100 text-green-700' : 
                            student.status === 'Probation' ? 'bg-orange-100 text-orange-700' : 'bg-red-100 text-red-700'
                          }`}>
                            {student.status}
                          </span>
                        </td>
                        <td className="p-4">
                          {student.graduating ? (
                            <span className="flex items-center gap-1 text-blue-600 font-bold text-xs">
                              <GraduationCap size={14} /> Yes
                            </span>
                          ) : (
                            <span className="text-gray-400 text-xs">No</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        );

      case 'financial':
        return (
          <div className="bg-white dark:bg-[#151e32] p-6 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6">Financial Performance Breakdown</h3>
            <div className="h-80 w-full mb-8">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={financialData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                  <XAxis dataKey="category" axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12}} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12}} />
                  <Tooltip cursor={{fill: 'transparent'}} />
                  <Legend />
                  <Bar dataKey="collected" name="Collected" fill="#10b981" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="outstanding" name="Outstanding" fill="#ef4444" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        );

      default:
        // Default Summary View
        return (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white dark:bg-[#151e32] p-6 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-blue-50 dark:bg-blue-900/20 text-blue-600 rounded-xl">
                    <Users size={24} />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-500 uppercase">Total Students</p>
                    <h3 className="text-2xl font-black text-gray-900 dark:text-white">1,240</h3>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-gray-50 dark:border-gray-800 flex items-center gap-2 text-xs">
                  <span className="text-green-600 font-bold flex items-center gap-1"><ArrowUpRight size={12} /> +5%</span>
                  <span className="text-gray-400">new admissions</span>
                </div>
              </div>

              <div className="bg-white dark:bg-[#151e32] p-6 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-purple-50 dark:bg-purple-900/20 text-purple-600 rounded-xl">
                    <BookOpen size={24} />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-500 uppercase">Courses Active</p>
                    <h3 className="text-2xl font-black text-gray-900 dark:text-white">48</h3>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-gray-50 dark:border-gray-800 flex items-center gap-2 text-xs">
                  <span className="text-gray-500 font-bold">12</span>
                  <span className="text-gray-400">pending approval</span>
                </div>
              </div>

              <div className="bg-white dark:bg-[#151e32] p-6 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-orange-50 dark:bg-orange-900/20 text-orange-600 rounded-xl">
                    <AlertTriangle size={24} />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-500 uppercase">Incidents</p>
                    <h3 className="text-2xl font-black text-gray-900 dark:text-white">3</h3>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-gray-50 dark:border-gray-800 flex items-center gap-2 text-xs">
                  <span className="text-red-500 font-bold flex items-center gap-1"><ArrowUpRight size={12} /> +1</span>
                  <span className="text-gray-400">this week</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white dark:bg-[#151e32] p-6 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                  <TrendingUp size={18} className="text-green-500" />
                  Attendance Rate (Monthly)
                </h3>
                <div className="h-72 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={monthlyAttendance}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                      <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12}} dy={10} />
                      <YAxis domain={[0, 100]} axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12}} />
                      <Tooltip />
                      <Line type="monotone" dataKey="rate" stroke="#10b981" strokeWidth={3} dot={{r: 4}} activeDot={{r: 6}} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="bg-white dark:bg-[#151e32] p-6 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                  <GraduationCap size={18} className="text-blue-500" />
                  Department Performance
                </h3>
                <div className="h-72 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={departmentPerformance} barSize={40}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                      <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12}} dy={10} />
                      <YAxis domain={[0, 100]} axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12}} />
                      <Tooltip cursor={{fill: 'transparent'}} />
                      <Bar dataKey="score" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </>
        );
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-xl font-black text-gray-900 dark:text-white">{mockInstitutionName}</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">Detailed performance analysis</p>
        </div>
        
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-[#151e32] border border-gray-200 dark:border-gray-700 rounded-lg text-sm font-bold text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors shadow-sm">
            <Printer size={16} /> Print
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-bold transition-colors shadow-lg shadow-blue-500/20">
            <Download size={16} /> Export
          </button>
        </div>
      </div>

      {renderContent()}
    </div>
  );
};

export default InstitutionReports;
