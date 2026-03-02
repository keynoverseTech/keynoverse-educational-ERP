import React, { useMemo, useState } from 'react';
import { Calendar, Clock, Users, Plus, Filter, Search } from 'lucide-react';
import { useHR } from '../../../state/hrAccessControl';

type Day =
  | 'Monday'
  | 'Tuesday'
  | 'Wednesday'
  | 'Thursday'
  | 'Friday'
  | 'Saturday'
  | 'Sunday';

type Lecture = {
  id: string;
  courseCode: string;
  courseTitle: string;
  lecturer: string;
  venue: string;
  day: Day;
  startTime: string;
  endTime: string;
};

type NonAcademicSchedule = {
  staffId: string;
  day: Day;
  startTime: string;
  endTime: string;
};

const days: Day[] = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

const StaffSchedules: React.FC = () => {
  const { staff, departments } = useHR();

  const academicStaff = useMemo(() => {
    const academicDeptIds = departments.filter(d => d.type === 'Academic').map(d => d.id);
    return staff.filter(s => academicDeptIds.includes(s.departmentId));
  }, [staff, departments]);

  const nonAcademicStaff = useMemo(() => {
    const nonAcademicDeptIds = departments.filter(d => d.type !== 'Academic').map(d => d.id);
    return staff.filter(s => nonAcademicDeptIds.includes(s.departmentId));
  }, [staff, departments]);

  const mockLectures: Lecture[] = [
    {
      id: 'lec1',
      courseCode: 'CSC 301',
      courseTitle: 'Operating Systems',
      lecturer: `${academicStaff[0]?.firstName || 'Dr.'} ${academicStaff[0]?.lastName || 'Smith'}`.trim(),
      venue: 'Lecture Theatre A',
      day: 'Monday',
      startTime: '08:00',
      endTime: '10:00',
    },
    {
      id: 'lec2',
      courseCode: 'CSC 305',
      courseTitle: 'Database Management',
      lecturer: `${academicStaff[0]?.firstName || 'Dr.'} ${academicStaff[0]?.lastName || 'Smith'}`.trim(),
      venue: 'Computer Lab 2',
      day: 'Wednesday',
      startTime: '10:00',
      endTime: '12:00',
    },
    {
      id: 'lec3',
      courseCode: 'MTH 201',
      courseTitle: 'Linear Algebra',
      lecturer: `${academicStaff[1]?.firstName || 'Prof.'} ${academicStaff[1]?.lastName || 'Johnson'}`.trim(),
      venue: 'Lecture Theatre B',
      day: 'Tuesday',
      startTime: '09:00',
      endTime: '11:00',
    },
  ];

  const [activeTab, setActiveTab] = useState<'Academic' | 'Non-Academic'>('Academic');

  const [selectedAcademicStaffId, setSelectedAcademicStaffId] = useState<string>('');
  
  // Update selected staff ID when academic staff list changes (initial load)
  React.useEffect(() => {
    if (academicStaff.length > 0 && !selectedAcademicStaffId) {
      setSelectedAcademicStaffId(academicStaff[0].id);
    }
  }, [academicStaff, selectedAcademicStaffId]);

  const selectedAcademicStaffName = useMemo(() => {
    const s = academicStaff.find(a => a.id === selectedAcademicStaffId);
    return s ? `${s.firstName} ${s.lastName}` : '';
  }, [academicStaff, selectedAcademicStaffId]);

  const [academicSearchTerm, setAcademicSearchTerm] = useState('');

  const filteredAcademicStaff = useMemo(() => {
    return academicStaff.filter(s =>
      `${s.firstName} ${s.lastName}`.toLowerCase().includes(academicSearchTerm.toLowerCase()) ||
      s.staffId.toLowerCase().includes(academicSearchTerm.toLowerCase())
    );
  }, [academicStaff, academicSearchTerm]);

  // Update selected academic staff if the current selection is filtered out, or on initial filter
  React.useEffect(() => {
    if (filteredAcademicStaff.length > 0) {
      const currentExists = filteredAcademicStaff.find(s => s.id === selectedAcademicStaffId);
      if (!currentExists) {
        setSelectedAcademicStaffId(filteredAcademicStaff[0].id);
      }
    } else {
      setSelectedAcademicStaffId('');
    }
  }, [filteredAcademicStaff, selectedAcademicStaffId]);

  const academicScheduleByDay = useMemo(() => {
    const byDay: Record<Day, Lecture[]> = {
      Monday: [],
      Tuesday: [],
      Wednesday: [],
      Thursday: [],
      Friday: [],
      Saturday: [],
      Sunday: [],
    };
    if (!selectedAcademicStaffName) return byDay;
    mockLectures
      .filter(l => l.lecturer.toLowerCase() === selectedAcademicStaffName.toLowerCase())
      .forEach(l => {
        byDay[l.day].push(l);
      });
    return byDay;
  }, [selectedAcademicStaffName, mockLectures]);

  const { schedules, setSchedules } = useHR() as any;
  const nonAcademicSchedules: NonAcademicSchedule[] = useMemo(() => {
    return (schedules || []).filter((s: any) =>
      nonAcademicStaff.some(ns => ns.id === s.staffId)
    );
  }, [schedules, nonAcademicStaff]);
  const [selectedNonAcademicStaffId, setSelectedNonAcademicStaffId] = useState<string>('');
  
  // Update selected staff ID when non-academic staff list changes (initial load)
  React.useEffect(() => {
    if (nonAcademicStaff.length > 0 && !selectedNonAcademicStaffId) {
      setSelectedNonAcademicStaffId(nonAcademicStaff[0].id);
    }
  }, [nonAcademicStaff, selectedNonAcademicStaffId]);

  const [day, setDay] = useState<Day>('Monday');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const [designationFilter, setDesignationFilter] = useState('All');
  const { designations } = useHR();

  const filteredNonAcademic = useMemo(() => {
    return nonAcademicStaff.filter(s => {
      const matchesSearch = `${s.firstName} ${s.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.staffId.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesDesignation = designationFilter === 'All' || 
        designations.find(d => d.id === s.designationId)?.name === designationFilter;

      return matchesSearch && matchesDesignation;
    });
  }, [nonAcademicStaff, searchTerm, designationFilter, designations]);

  const nonAcademicAssignments = useMemo(() => {
    return nonAcademicSchedules.filter(s => {
      const staff = nonAcademicStaff.find(st => st.id === s.staffId);
      if (!staff) return false;
      
      const matchesSearch = `${staff.firstName} ${staff.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
        staff.staffId.toLowerCase().includes(searchTerm.toLowerCase());
        
      const matchesDesignation = designationFilter === 'All' || 
        designations.find(d => d.id === staff.designationId)?.name === designationFilter;

      return matchesSearch && matchesDesignation;
    });
  }, [nonAcademicSchedules, nonAcademicStaff, searchTerm, designationFilter, designations]);

  const groupedSchedules = useMemo(() => {
    const groups: Record<string, NonAcademicSchedule[]> = {};
    nonAcademicAssignments.forEach(s => {
      if (!groups[s.staffId]) groups[s.staffId] = [];
      groups[s.staffId].push(s);
    });

    const dayOrder: Record<string, number> = {
      Monday: 1,
      Tuesday: 2,
      Wednesday: 3,
      Thursday: 4,
      Friday: 5,
      Saturday: 6,
      Sunday: 7,
    };

    Object.values(groups).forEach(group => {
      group.sort((a, b) => {
        const dayDiff = dayOrder[a.day] - dayOrder[b.day];
        if (dayDiff !== 0) return dayDiff;
        return a.startTime.localeCompare(b.startTime);
      });
    });

    return groups;
  }, [nonAcademicAssignments]);

  // Update selected non-academic staff if filtered out
  React.useEffect(() => {
    if (filteredNonAcademic.length > 0) {
      const currentExists = filteredNonAcademic.find(s => s.id === selectedNonAcademicStaffId);
      if (!currentExists) {
        setSelectedNonAcademicStaffId(filteredNonAcademic[0].id);
      }
    } else {
      setSelectedNonAcademicStaffId('');
    }
  }, [filteredNonAcademic, selectedNonAcademicStaffId]);

  const [editingSchedule, setEditingSchedule] = useState<{staffId: string, idx: number} | null>(null);

  const handleAssignSchedule = () => {
    if (selectedNonAcademicStaffId && day && startTime && endTime) {
      if (editingSchedule) {
        setSchedules((prev: any[]) => {
          const newSchedules = [...prev];
          // Find the actual index in the main array
          // This is a simplification; in a real app, schedules should have unique IDs
          // For now we'll filter and re-add to update
           const staffSchedules = newSchedules.filter(s => s.staffId === editingSchedule.staffId);
           const scheduleToUpdate = staffSchedules[editingSchedule.idx];
           
           // Remove old and add new (simple update strategy without IDs)
           const filtered = newSchedules.filter(s => s !== scheduleToUpdate);
           return [...filtered, { staffId: selectedNonAcademicStaffId, day, startTime, endTime }];
        });
        setEditingSchedule(null);
      } else {
        setSchedules((prev: any[]) => [
          ...(prev || []),
          {
            staffId: selectedNonAcademicStaffId,
            day,
            startTime,
            endTime,
          },
        ]);
      }
      setStartTime('');
      setEndTime('');
    }
  };

  const handleEdit = (staffId: string, idx: number, schedule: NonAcademicSchedule) => {
    setSelectedNonAcademicStaffId(staffId);
    setDay(schedule.day);
    setStartTime(schedule.startTime);
    setEndTime(schedule.endTime);
    setEditingSchedule({ staffId, idx });
  };

  const handleRemove = (staffId: string, idx: number) => {
    if (window.confirm('Are you sure you want to remove this schedule?')) {
        setSchedules((prev: any[]) => {
            // Get all schedules for this staff to find the correct one by index
            const allSchedules = [...prev];
            const staffSchedules = allSchedules.filter(s => s.staffId === staffId);
            const scheduleToRemove = staffSchedules[idx];
            
            // Return all schedules except the one we want to remove
            // Note: This relies on object reference equality or exact content match
            // Ideally schedules should have IDs
            const indexToRemove = allSchedules.findIndex(s => 
                s.staffId === staffId && 
                s.day === scheduleToRemove.day && 
                s.startTime === scheduleToRemove.startTime && 
                s.endTime === scheduleToRemove.endTime
            );
            
            if (indexToRemove !== -1) {
                const newSchedules = [...allSchedules];
                newSchedules.splice(indexToRemove, 1);
                return newSchedules;
            }
            return allSchedules;
        });
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <Calendar className="w-6 h-6 text-blue-600" />
            Staff Schedules
          </h1>
          <p className="text-gray-500 dark:text-gray-400">View and assign schedules for academic and non-academic staff.</p>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-2">
        <div className="flex gap-2">
          <button
            onClick={() => setActiveTab('Academic')}
            className={`px-4 py-2 rounded-lg text-sm font-bold ${activeTab === 'Academic' ? 'bg-blue-600 text-white' : 'bg-gray-100 dark:bg-gray-900 text-gray-700 dark:text-gray-300'}`}
          >
            Academic Staff
          </button>
          <button
            onClick={() => setActiveTab('Non-Academic')}
            className={`px-4 py-2 rounded-lg text-sm font-bold ${activeTab === 'Non-Academic' ? 'bg-blue-600 text-white' : 'bg-gray-100 dark:bg-gray-900 text-gray-700 dark:text-gray-300'}`}
          >
            Non-Academic Staff
          </button>
        </div>
      </div>

      {activeTab === 'Academic' && (
        <div className="space-y-4">
          <div className="bg-white dark:bg-gray-800 p-4 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="flex items-center gap-3 w-full md:w-auto flex-1">
              <div className="relative w-full md:w-80">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  value={academicSearchTerm}
                  onChange={e => setAcademicSearchTerm(e.target.value)}
                  placeholder="Search staff by name or ID..."
                  className="w-full pl-9 pr-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-sm outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="h-8 w-[1px] bg-gray-200 dark:bg-gray-700 mx-2 hidden md:block"></div>
              <Users className="text-gray-500 hidden md:block" size={18} />
              <select
                className="w-full md:w-64 p-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                value={selectedAcademicStaffId}
                onChange={e => setSelectedAcademicStaffId(e.target.value)}
              >
                {filteredAcademicStaff.map(s => (
                  <option key={s.id} value={s.id}>
                    {s.firstName} {s.lastName} ({s.staffId})
                  </option>
                ))}
                {filteredAcademicStaff.length === 0 && (
                  <option value="">No staff found</option>
                )}
              </select>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead className="bg-gray-50 dark:bg-gray-900/50">
                  <tr>
                    <th className="p-4 border-b border-gray-200 dark:border-gray-700 font-semibold text-gray-600 dark:text-gray-300 w-32">Day</th>
                    <th className="p-4 border-b border-gray-200 dark:border-gray-700 font-semibold text-gray-600 dark:text-gray-300">Schedule</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {days.map(day => (
                    <tr key={day} className="group hover:bg-gray-50 dark:hover:bg-gray-900/20">
                      <td className="p-4 font-medium text-gray-900 dark:text-white align-top border-r border-gray-100 dark:border-gray-700/50">
                        {day}
                      </td>
                      <td className="p-2">
                        <div className="flex flex-wrap gap-3">
                          {academicScheduleByDay[day].length > 0 ? (
                            academicScheduleByDay[day].map(lecture => (
                              <div key={lecture.id} className="bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500 p-3 rounded-r-lg w-64 hover:shadow-md transition-shadow">
                                <div className="flex items-center justify-between mb-1">
                                  <span className="text-xs font-bold text-blue-600 dark:text-blue-400 px-2 py-0.5 bg-white dark:bg-gray-800 rounded-full border border-blue-100 dark:border-blue-800">
                                    {lecture.startTime} - {lecture.endTime}
                                  </span>
                                </div>
                                <div className="text-sm font-bold text-gray-900 dark:text-white">{lecture.courseCode}</div>
                                <div className="text-xs text-gray-600 dark:text-gray-300 truncate">{lecture.courseTitle}</div>
                                <div className="mt-1 flex items-center gap-2 text-[11px] text-gray-500 dark:text-gray-400">
                                  <Clock size={12} /> {lecture.venue}
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
        </div>
      )}

      {activeTab === 'Non-Academic' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Create Schedule Form */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 h-fit">
            <h3 className="font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
              <Plus size={18} />
              Create Schedule
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Select Staff</label>
                <select 
                  className="w-full p-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 outline-none focus:ring-2 focus:ring-blue-500"
                  value={selectedNonAcademicStaffId}
                  onChange={e => {
                    setSelectedNonAcademicStaffId(e.target.value);
                  }}
                >
                  {filteredNonAcademic.map(s => (
                    <option key={s.id} value={s.id}>
                      {s.firstName} {s.lastName} ({s.staffId})
                    </option>
                  ))}
                  {filteredNonAcademic.length === 0 && (
                    <option value="">No staff found</option>
                  )}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Day</label>
                  <select 
                    className="w-full p-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 outline-none focus:ring-2 focus:ring-blue-500"
                    value={day}
                    onChange={e => setDay(e.target.value as Day)}
                  >
                    {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map(d => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Start Time</label>
                  <input 
                    type="time" 
                    className="w-full p-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 outline-none focus:ring-2 focus:ring-blue-500"
                    value={startTime}
                    onChange={e => setStartTime(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">End Time</label>
                  <input 
                    type="time" 
                    className="w-full p-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 outline-none focus:ring-2 focus:ring-blue-500"
                    value={endTime}
                    onChange={e => setEndTime(e.target.value)}
                  />
                </div>
              </div>

              <button 
                onClick={handleAssignSchedule}
                disabled={!selectedNonAcademicStaffId}
                className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold transition-all shadow-lg shadow-blue-600/20 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {editingSchedule ? 'Update Schedule' : 'Assign Schedule'}
              </button>
            </div>
          </div>

          {/* Schedule List */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex gap-4 mb-4">
              <div className="relative flex-1">
                <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input 
                  type="text" 
                  placeholder="Search staff..." 
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 outline-none"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="relative w-48">
                 <Filter size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                 <select
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 outline-none appearance-none"
                  value={designationFilter}
                  onChange={(e) => setDesignationFilter(e.target.value)}
                 >
                   <option value="All">All Designations</option>
                   {designations.map(d => (
                     <option key={d.id} value={d.name}>{d.name}</option>
                   ))}
                 </select>
              </div>
            </div>
            
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead className="bg-gray-50 dark:bg-gray-900/50">
                  <tr>
                    <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Staff</th>
                    <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Staff ID</th>
                    <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Day</th>
                    <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Time</th>
                    <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50 dark:divide-gray-700">
                  {Object.keys(groupedSchedules).length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                        No schedules found for the selected filter.
                      </td>
                    </tr>
                  ) : (
                    Object.keys(groupedSchedules).map(staffId => {
                      const staff = nonAcademicStaff.find(s => s.id === staffId);
                      if (!staff) return null;
                      const entries = groupedSchedules[staffId];
                       return entries.map((e, idx) => (
                         <tr key={`${staffId}-${e.day}-${e.startTime}-${idx}`} className="group hover:bg-gray-50 dark:hover:bg-gray-700/50">
                          <td className="px-6 py-4">{staff.firstName} {staff.lastName}</td>
                          <td className="px-6 py-4">{staff.staffId}</td>
                          <td className="px-6 py-4">{e.day}</td>
                          <td className="px-6 py-4">{e.startTime} - {e.endTime}</td>
                          <td className="px-6 py-4 text-right">
                            <button
                              onClick={() => handleEdit(staff.id, idx, e)}
                              className="text-blue-600 hover:text-blue-800 text-xs font-bold mr-3"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleRemove(staff.id, idx)}
                              className="text-rose-600 hover:text-rose-800 text-xs font-bold"
                            >
                              Remove
                            </button>
                          </td>
                        </tr>
                      ));
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      )}
    </div>
  );
};

export default StaffSchedules;
