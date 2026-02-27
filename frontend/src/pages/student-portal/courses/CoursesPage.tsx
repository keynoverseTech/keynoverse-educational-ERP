import React, { useMemo, useState } from 'react';
import { BookOpen, Search, Clock, Users, AlertCircle } from 'lucide-react';

type StudentCourse = {
  code: string;
  title: string;
  units: number;
  lecturer: string;
  schedule: string;
  venue: string;
  status: 'Registered' | 'Pending';
};

const COURSES: StudentCourse[] = [
  { code: 'CSC 401', title: 'Advanced Software Engineering', units: 3, lecturer: 'Dr. A. Bello', schedule: 'Mon 10:00 - 12:00', venue: 'Lab 2', status: 'Registered' },
  { code: 'CSC 415', title: 'Distributed Systems', units: 3, lecturer: 'Prof. C. Okoye', schedule: 'Wed 14:00 - 16:00', venue: 'LH A', status: 'Registered' },
  { code: 'CSC 499', title: 'Final Year Project', units: 6, lecturer: 'Project Supervisor', schedule: 'Flexible', venue: 'Department', status: 'Pending' },
];

const CoursesPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'All' | 'Registered' | 'Pending'>('All');

  const filtered = useMemo(() => {
    return COURSES.filter((c) => {
      const matchesSearch = `${c.code} ${c.title}`.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = filterStatus === 'All' || c.status === filterStatus;
      return matchesSearch && matchesStatus;
    });
  }, [filterStatus, searchTerm]);

  const totalUnits = filtered.reduce((sum, c) => sum + c.units, 0);

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-gray-900 dark:text-white flex items-center gap-3">
            <div className="p-2.5 bg-blue-600 rounded-xl shadow-lg shadow-blue-500/20">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            My Courses
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-2">Registered courses and schedules for the current session.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-[2rem] border border-gray-100 dark:border-gray-700 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-50 dark:bg-blue-900/20 text-blue-600 rounded-2xl">
              <BookOpen size={24} />
            </div>
            <div>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Courses</p>
              <h3 className="text-2xl font-black text-gray-900 dark:text-white">{filtered.length}</h3>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-[2rem] border border-gray-100 dark:border-gray-700 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 rounded-2xl">
              <Users size={24} />
            </div>
            <div>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Status</p>
              <h3 className="text-2xl font-black text-gray-900 dark:text-white">{filterStatus}</h3>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-[2rem] border border-gray-100 dark:border-gray-700 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-amber-50 dark:bg-amber-900/20 text-amber-600 rounded-2xl">
              <Clock size={24} />
            </div>
            <div>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Total Units</p>
              <h3 className="text-2xl font-black text-gray-900 dark:text-white">{totalUnits}</h3>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 p-4 rounded-2xl border border-gray-100 dark:border-gray-700 flex flex-col md:flex-row gap-4 items-center">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search course code or title..."
            className="w-full pl-12 pr-4 py-2.5 rounded-xl bg-gray-50 dark:bg-gray-900 border-none focus:ring-2 focus:ring-blue-500 outline-none text-sm transition-all font-medium"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2 p-1 bg-gray-50 dark:bg-gray-900 rounded-xl w-full md:w-auto">
          {(['All', 'Registered', 'Pending'] as const).map((status) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-4 py-2 rounded-lg text-xs font-black transition-all ${
                filterStatus === status ? 'bg-white dark:bg-gray-800 text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.length > 0 ? (
          filtered.map((c) => (
            <div key={c.code} className="bg-white dark:bg-gray-800 rounded-[2.5rem] border border-gray-100 dark:border-gray-700 p-6 shadow-sm hover:shadow-md transition-all group overflow-hidden relative">
              <div className={`absolute top-0 right-0 w-24 h-24 -mr-8 -mt-8 opacity-5 rounded-full ${c.status === 'Registered' ? 'bg-emerald-500' : 'bg-amber-500'}`} />
              <div className="flex justify-between items-start mb-6">
                <div>
                  <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-1 rounded-lg border ${
                    c.status === 'Registered' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-amber-50 text-amber-600 border-amber-100'
                  }`}>
                    {c.status}
                  </span>
                  <h3 className="text-xl font-black text-gray-900 dark:text-white mt-3">{c.code}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{c.title}</p>
                </div>
                <div className="p-3 bg-gray-50 dark:bg-gray-900 rounded-2xl">
                  <BookOpen size={20} className="text-gray-400" />
                </div>
              </div>
              <div className="space-y-3 mb-2">
                <div className="flex justify-between text-xs">
                  <span className="text-gray-500 font-bold">Units</span>
                  <span className="font-black text-gray-900 dark:text-white">{c.units}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-gray-500 font-bold">Lecturer</span>
                  <span className="font-bold text-gray-700 dark:text-gray-300">{c.lecturer}</span>
                </div>
                <div className="pt-4 border-t border-gray-50 dark:border-gray-700">
                  <div className="flex justify-between items-center text-[10px]">
                    <span className="text-gray-400 uppercase tracking-widest font-black">Schedule</span>
                    <span className="font-bold text-gray-600 dark:text-gray-300">{c.schedule}</span>
                  </div>
                  <div className="flex justify-between items-center text-[10px] mt-2">
                    <span className="text-gray-400 uppercase tracking-widest font-black">Venue</span>
                    <span className="font-bold text-gray-600 dark:text-gray-300">{c.venue}</span>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full py-20 bg-gray-50 dark:bg-gray-900/30 rounded-[3rem] border-2 border-dashed border-gray-200 dark:border-gray-700 flex flex-col items-center justify-center text-center">
            <div className="w-20 h-20 bg-white dark:bg-gray-800 rounded-3xl shadow-sm flex items-center justify-center mb-4 text-gray-300">
              <AlertCircle size={40} />
            </div>
            <h3 className="text-lg font-black text-gray-900 dark:text-white mb-2">No Courses</h3>
            <p className="text-sm text-gray-500">Try adjusting your search or filters.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CoursesPage;

