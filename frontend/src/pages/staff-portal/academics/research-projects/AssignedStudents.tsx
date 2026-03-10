import { useState } from 'react';
import { 
  Search, 
  Filter, 
  MoreVertical, 
  BookOpen
} from 'lucide-react';

const AssignedStudents = () => {
  const [searchTerm, setSearchTerm] = useState('');

  // Mock data
  const students = [
    {
      id: 1,
      name: 'John Doe',
      regNo: 'CS/2020/001',
      topic: 'AI in Healthcare',
      status: 'In Progress',
      progress: 60,
      lastActive: '2 days ago'
    },
    {
      id: 2,
      name: 'Jane Smith',
      regNo: 'CS/2020/015',
      topic: 'Sustainable Energy Monitoring System',
      status: 'Approved',
      progress: 20,
      lastActive: '5 hours ago'
    },
    {
      id: 3,
      name: 'Michael Brown',
      regNo: 'CS/2020/042',
      topic: 'Blockchain Voting System',
      status: 'Pending Review',
      progress: 40,
      lastActive: '1 day ago'
    },
    {
      id: 4,
      name: 'Sarah Wilson',
      regNo: 'CS/2020/088',
      topic: 'Smart Campus Navigation',
      status: 'Completed',
      progress: 100,
      lastActive: '1 week ago'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed': return 'text-green-600 bg-green-50 dark:bg-green-900/20';
      case 'In Progress': return 'text-blue-600 bg-blue-50 dark:bg-blue-900/20';
      case 'Pending Review': return 'text-amber-600 bg-amber-50 dark:bg-amber-900/20';
      default: return 'text-gray-600 bg-gray-50 dark:bg-gray-900/20';
    }
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Assigned Students</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">Manage students under your supervision</p>
        </div>
        <div className="flex gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search students..."
              className="pl-10 pr-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button className="p-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700">
            <Filter size={20} className="text-gray-500" />
          </button>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 dark:bg-gray-900/50 border-b border-gray-200 dark:border-gray-700">
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Student</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Topic</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Status</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Progress</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Last Active</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {students.map((student) => (
                <tr key={student.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 font-bold">
                        {student.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">{student.name}</p>
                        <p className="text-xs text-gray-500">{student.regNo}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 max-w-xs">
                      <BookOpen size={16} className="text-gray-400 flex-shrink-0" />
                      <span className="text-sm text-gray-700 dark:text-gray-300 truncate">{student.topic}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(student.status)}`}>
                      {student.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 max-w-[100px]">
                      <div 
                        className="bg-blue-600 h-2 rounded-full" 
                        style={{ width: `${student.progress}%` }}
                      ></div>
                    </div>
                    <span className="text-xs text-gray-500 mt-1 block">{student.progress}%</span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {student.lastActive}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
                      <MoreVertical size={20} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AssignedStudents;
