import React, { useState } from 'react';
import { Users, Search, Edit2, UserPlus, X } from 'lucide-react';

const Supervisor: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterFaculty, setFilterFaculty] = useState('All');
  const [filterDepartment, setFilterDepartment] = useState('All');
  const [filterProgramme, setFilterProgramme] = useState('All');

  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [selectedSupervisor, setSelectedSupervisor] = useState<any>(null);
  const [selectedStudents, setSelectedStudents] = useState<string[]>([]);

  const eligibleStudents = [
    { id: 's1', name: 'John Doe', matric: 'CSC/20/001' },
    { id: 's2', name: 'Jane Smith', matric: 'CSC/20/002' },
    { id: 's3', name: 'Michael Johnson', matric: 'CSC/20/003' },
    { id: 's4', name: 'Emily Davis', matric: 'CSC/20/004' },
    { id: 's5', name: 'David Wilson', matric: 'CSC/20/005' }
  ];

  const handleOpenAssign = (supervisor: any) => {
    setSelectedSupervisor(supervisor);
    setIsAssignModalOpen(true);
    setSelectedStudents([]);
  };

  const handleAssignStudents = () => {
    if (!selectedSupervisor) return;

    setSupervisors(
      supervisors.map((s) => (s.id === selectedSupervisor.id ? { ...s, assigned: s.assigned + selectedStudents.length } : s))
    );
    setIsAssignModalOpen(false);
    setSelectedStudents([]);
    setSelectedSupervisor(null);
  };

  const toggleStudentSelection = (studentId: string) => {
    setSelectedStudents((prev) => (prev.includes(studentId) ? prev.filter((id) => id !== studentId) : [...prev, studentId]));
  };

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    department: '',
    lecturer: '',
    specialization: '',
    email: '',
    phone: '',
    capacity: 5
  });

  const faculties = ['Faculty of Sciences', 'Faculty of Engineering', 'Faculty of Arts', 'Faculty of Environmental Sciences'];
  const programmes = ['HND Computer Science', 'HND Architecture', 'HND Biology'];

  const departments = ['Computer Science', 'Architecture', 'Biology', 'Physics', 'Mathematics'];

  const lecturers = [
    { id: 'l1', name: 'Dr. Alan Smith', dept: 'Computer Science' },
    { id: 'l2', name: 'Prof. Sarah Connor', dept: 'Architecture' },
    { id: 'l3', name: 'Dr. Emily Blunt', dept: 'Biology' },
    { id: 'l4', name: 'Dr. John Doe', dept: 'Physics' },
    { id: 'l5', name: 'Dr. Jane Doe', dept: 'Mathematics' },
    { id: 'l6', name: 'Mr. Bob Brown', dept: 'Computer Science' }
  ];

  const availableLecturers = formData.department ? lecturers.filter((l) => l.dept === formData.department) : [];

  const [supervisors, setSupervisors] = useState([
    {
      id: 1,
      name: 'Dr. Alan Smith',
      department: 'Computer Science',
      capacity: 5,
      assigned: 3,
      specialization: 'Artificial Intelligence',
      status: 'Active',
      email: 'alan.smith@university.edu',
      phone: '+1234567890'
    },
    {
      id: 2,
      name: 'Prof. Sarah Connor',
      department: 'Architecture',
      capacity: 4,
      assigned: 4,
      specialization: 'Sustainable Design',
      status: 'Full',
      email: 'sarah.connor@university.edu',
      phone: '+1987654321'
    },
    {
      id: 3,
      name: 'Dr. Emily Blunt',
      department: 'Biology',
      capacity: 6,
      assigned: 2,
      specialization: 'Genetics',
      status: 'Active',
      email: 'emily.blunt@university.edu',
      phone: '+1122334455'
    }
  ]);

  const filteredSupervisors = supervisors.filter((supervisor) => {
    const matchesSearch =
      supervisor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      supervisor.department.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFaculty = filterFaculty === 'All' || filterFaculty === 'Faculty of Sciences';
    const matchesDepartment = filterDepartment === 'All' || supervisor.department === filterDepartment;
    const matchesProgramme = filterProgramme === 'All' || true;

    return matchesSearch && matchesFaculty && matchesDepartment && matchesProgramme;
  });

  const handleAddSupervisor = (e: React.FormEvent) => {
    e.preventDefault();

    const lecturer = lecturers.find((l) => l.id === formData.lecturer);

    if (lecturer) {
      const newSupervisor = {
        id: Date.now(),
        name: lecturer.name,
        department: formData.department,
        capacity: Number(formData.capacity),
        assigned: 0,
        specialization: formData.specialization || 'General',
        status: 'Active',
        email: formData.email,
        phone: formData.phone
      };

      setSupervisors([...supervisors, newSupervisor]);
      setIsModalOpen(false);
      setFormData({
        department: '',
        lecturer: '',
        specialization: '',
        email: '',
        phone: '',
        capacity: 5
      });
    }
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <Users className="text-purple-600" />
            Supervisor Allocation
          </h1>
          <p className="text-gray-500 dark:text-gray-400">Manage supervisor workload and assignments.</p>
        </div>
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          <div className="relative flex-1 md:flex-none">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search supervisors..."
              className="pl-10 pr-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 w-full md:w-64"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <select
            value={filterFaculty}
            onChange={(e) => setFilterFaculty(e.target.value)}
            className="px-3 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-xs font-medium focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option value="All">All Faculties</option>
            {faculties.map((f) => (
              <option key={f} value={f}>
                {f}
              </option>
            ))}
          </select>

          <select
            value={filterDepartment}
            onChange={(e) => setFilterDepartment(e.target.value)}
            className="px-3 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-xs font-medium focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option value="All">All Departments</option>
            {departments.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>

          <select
            value={filterProgramme}
            onChange={(e) => setFilterProgramme(e.target.value)}
            className="px-3 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-xs font-medium focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option value="All">All Programmes</option>
            {programmes.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>

          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm font-bold shadow-lg shadow-purple-500/20"
          >
            <UserPlus size={16} />
            Add Supervisor
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredSupervisors.map((supervisor) => {
          const workloadPercentage = (supervisor.assigned / supervisor.capacity) * 100;
          let workloadColor = 'bg-green-500';
          if (workloadPercentage >= 100) workloadColor = 'bg-red-500';
          else if (workloadPercentage >= 75) workloadColor = 'bg-amber-500';

          return (
            <div
              key={supervisor.id}
              className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-6 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center font-bold text-lg">
                    {supervisor.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">{supervisor.name}</h3>
                    <p className="text-xs text-gray-500">{supervisor.department}</p>
                  </div>
                </div>
                <button className="text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors p-1 rounded-full hover:bg-purple-50 dark:hover:bg-purple-900/20">
                  <Edit2 size={18} />
                </button>
              </div>

              <div className="space-y-4">
                <div className="bg-gray-50 dark:bg-gray-900/50 p-3 rounded-xl">
                  <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">Specialization</p>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">{supervisor.specialization}</p>
                </div>

                <div className="space-y-2 text-xs text-gray-500">
                  <div className="flex flex-col">
                    <span className="font-bold text-gray-700 dark:text-gray-300">Email</span>
                    <span className="truncate">{supervisor.email}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="font-bold text-gray-700 dark:text-gray-300">Phone</span>
                    <span>{supervisor.phone}</span>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs font-bold text-gray-500 uppercase">Workload</span>
                    <span
                      className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                        workloadPercentage >= 100
                          ? 'bg-red-100 text-red-600'
                          : workloadPercentage >= 75
                            ? 'bg-amber-100 text-amber-600'
                            : 'bg-green-100 text-green-600'
                      }`}
                    >
                      {supervisor.assigned} / {supervisor.capacity} Students
                    </span>
                  </div>
                  <div className="w-full h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div className={`h-full rounded-full transition-all duration-500 ${workloadColor}`} style={{ width: `${workloadPercentage}%` }} />
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-gray-100 dark:border-gray-700">
                <button
                  onClick={() => handleOpenAssign(supervisor)}
                  className="w-full py-2 bg-purple-50 hover:bg-purple-100 dark:bg-purple-900/20 dark:hover:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-lg text-sm font-bold transition-colors flex items-center justify-center gap-2"
                >
                  <UserPlus size={16} /> Assign Students
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {isAssignModalOpen && selectedSupervisor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-lg shadow-xl border border-gray-200 dark:border-gray-700">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
              <div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">Assign Students</h2>
                <p className="text-sm text-gray-500">To {selectedSupervisor.name}</p>
              </div>
              <button onClick={() => setIsAssignModalOpen(false)} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors">
                <X size={20} className="text-gray-500" />
              </button>
            </div>

            <div className="p-6">
              <div className="mb-4 flex items-center justify-between">
                <p className="text-sm font-bold text-gray-700 dark:text-gray-300">Select Students ({selectedStudents.length})</p>
                <span className="text-xs text-gray-500">
                  Capacity: {selectedSupervisor.assigned} / {selectedSupervisor.capacity}
                </span>
              </div>

              <div className="space-y-2 max-h-60 overflow-y-auto mb-6">
                {eligibleStudents.map((student) => (
                  <div
                    key={student.id}
                    onClick={() => toggleStudentSelection(student.id)}
                    className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all ${
                      selectedStudents.includes(student.id)
                        ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20'
                        : 'border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-900/50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${
                          selectedStudents.includes(student.id) ? 'bg-purple-200 text-purple-700' : 'bg-gray-200 text-gray-600'
                        }`}
                      >
                        {student.name.charAt(0)}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-gray-900 dark:text-white">{student.name}</p>
                        <p className="text-xs text-gray-500">{student.matric}</p>
                      </div>
                    </div>
                    {selectedStudents.includes(student.id) && (
                      <div className="w-5 h-5 bg-purple-600 rounded-full flex items-center justify-center">
                        <X size={12} className="text-white" />
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <div className="flex justify-end pt-4 border-t border-gray-200 dark:border-gray-700">
                <button
                  onClick={() => setIsAssignModalOpen(false)}
                  className="px-4 py-2 mr-3 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAssignStudents}
                  disabled={selectedStudents.length === 0}
                  className="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-bold transition-colors shadow-lg shadow-purple-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Assign Selected
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-md shadow-xl border border-gray-200 dark:border-gray-700">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Add Supervisor</h2>
              <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors">
                <X size={20} className="text-gray-500" />
              </button>
            </div>

            <form onSubmit={handleAddSupervisor} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Department</label>
                <select
                  required
                  value={formData.department}
                  onChange={(e) => setFormData({ ...formData, department: e.target.value, lecturer: '' })}
                  className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 focus:ring-2 focus:ring-purple-500 outline-none"
                >
                  <option value="">Select Department</option>
                  {departments.map((dept) => (
                    <option key={dept} value={dept}>
                      {dept}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Lecturer</label>
                <select
                  required
                  value={formData.lecturer}
                  onChange={(e) => setFormData({ ...formData, lecturer: e.target.value })}
                  disabled={!formData.department}
                  className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 focus:ring-2 focus:ring-purple-500 outline-none disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <option value="">Select Lecturer</option>
                  {availableLecturers.map((lecturer) => (
                    <option key={lecturer.id} value={lecturer.id}>
                      {lecturer.name}
                    </option>
                  ))}
                </select>
                {formData.department && availableLecturers.length === 0 && <p className="text-xs text-orange-500 mt-1">No lecturers found in this department.</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Specialization <span className="text-gray-400 font-normal">(Optional)</span>
                </label>
                <input
                  type="text"
                  value={formData.specialization}
                  onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
                  placeholder="e.g. Cybersecurity, AI"
                  className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 focus:ring-2 focus:ring-purple-500 outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="staff@uni.edu"
                    className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 focus:ring-2 focus:ring-purple-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Phone</label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+123..."
                    className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 focus:ring-2 focus:ring-purple-500 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Student Capacity</label>
                <input
                  type="number"
                  required
                  min="1"
                  max="20"
                  value={formData.capacity}
                  onChange={(e) => setFormData({ ...formData, capacity: Number(e.target.value) })}
                  className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 focus:ring-2 focus:ring-purple-500 outline-none"
                />
              </div>

              <div className="flex justify-end pt-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 mr-3 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-bold transition-colors shadow-lg shadow-purple-500/20"
                >
                  Save & Assign
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Supervisor;
