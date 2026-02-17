import { useState } from 'react';
import { User, Shield, Briefcase, Search, Plus, Trash2 } from 'lucide-react';

interface Officer {
  id: string;
  name: string;
  staffId: string;
  department: string;
  role: 'Chief Examiner' | 'Invigilator' | 'Supervisor';
  assignedExams: number;
  status: 'Active' | 'On Leave';
}

const OfficerAssignment = () => {
  const [officers, setOfficers] = useState<Officer[]>([
    {
      id: '1',
      name: 'Dr. Sarah Wilson',
      staffId: 'STF/001',
      department: 'Computer Science',
      role: 'Chief Examiner',
      assignedExams: 5,
      status: 'Active'
    },
    {
      id: '2',
      name: 'Mr. James Okafor',
      staffId: 'STF/042',
      department: 'Mathematics',
      role: 'Invigilator',
      assignedExams: 12,
      status: 'Active'
    }
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newOfficer, setNewOfficer] = useState<Partial<Officer>>({
    name: '',
    staffId: '',
    department: '',
    role: 'Invigilator',
    status: 'Active'
  });

  const handleRegister = () => {
    if (!newOfficer.name || !newOfficer.staffId || !newOfficer.department) {
      alert('Please fill in all required fields');
      return;
    }

    const officer: Officer = {
      id: (officers.length + 1).toString(),
      name: newOfficer.name,
      staffId: newOfficer.staffId,
      department: newOfficer.department,
      role: newOfficer.role as 'Chief Examiner' | 'Invigilator' | 'Supervisor',
      assignedExams: 0,
      status: 'Active'
    };

    setOfficers([...officers, officer]);
    setIsModalOpen(false);
    setNewOfficer({
      name: '',
      staffId: '',
      department: '',
      role: 'Invigilator',
      status: 'Active'
    });
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to remove this officer?')) {
      setOfficers(officers.filter(o => o.id !== id));
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Exam Officer Management</h1>
          <p className="text-gray-500 dark:text-gray-400">Register and assign roles to examination officers.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
        >
          <Plus size={18} />
          Register Officer
        </button>
      </div>

      <div className="flex gap-4 items-center bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-200 dark:border-gray-700">
        <Search className="text-gray-400" size={20} />
        <input 
          type="text" 
          placeholder="Search by name or staff ID..." 
          className="bg-transparent border-none focus:ring-0 text-gray-900 dark:text-white flex-1"
        />
        <select className="bg-transparent border-none text-gray-500 focus:ring-0">
          <option>All Roles</option>
          <option>Chief Examiner</option>
          <option>Invigilator</option>
          <option>Supervisor</option>
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {officers.map((officer) => (
          <div key={officer.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 flex flex-col gap-4">
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                  <User className="text-gray-500 dark:text-gray-400" size={20} />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 dark:text-white">{officer.name}</h3>
                  <p className="text-xs text-gray-500">{officer.staffId}</p>
                </div>
              </div>
              <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                officer.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
              }`}>
                {officer.status}
              </span>
            </div>

            <div className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
              <div className="flex items-center gap-2">
                <Briefcase size={14} />
                {officer.department}
              </div>
              <div className="flex items-center gap-2">
                <Shield size={14} />
                {officer.role}
              </div>
              <div className="mt-2 pt-2 border-t dark:border-gray-700 flex justify-between items-center">
                <span>Assigned Exams:</span>
                <span className="font-bold">{officer.assignedExams}</span>
              </div>
            </div>

            <div className="flex gap-2 mt-auto">
              <button className="flex-1 py-2 text-sm text-blue-600 bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/40 rounded">
                View Assignments
              </button>
              <button 
                onClick={() => handleDelete(officer.id)}
                className="p-2 text-red-600 bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/40 rounded"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4 dark:text-white">Register Exam Officer</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Staff Name</label>
                <input 
                  type="text" 
                  value={newOfficer.name}
                  onChange={(e) => setNewOfficer({...newOfficer, name: e.target.value})}
                  className="w-full border rounded-lg p-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white" 
                  placeholder="Full Name" 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Staff ID</label>
                <input 
                  type="text" 
                  value={newOfficer.staffId}
                  onChange={(e) => setNewOfficer({...newOfficer, staffId: e.target.value})}
                  className="w-full border rounded-lg p-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white" 
                  placeholder="e.g. STF/001" 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Department</label>
                <input 
                  type="text" 
                  value={newOfficer.department}
                  onChange={(e) => setNewOfficer({...newOfficer, department: e.target.value})}
                  className="w-full border rounded-lg p-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white" 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Exam Role</label>
                <select 
                  value={newOfficer.role}
                  onChange={(e) => setNewOfficer({...newOfficer, role: e.target.value as Officer['role']})}
                  className="w-full border rounded-lg p-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                >
                  <option>Invigilator</option>
                  <option>Chief Examiner</option>
                  <option>Supervisor</option>
                </select>
              </div>
              <div className="flex justify-end gap-2 mt-6">
                <button onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">Cancel</button>
                <button 
                  onClick={handleRegister}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Register
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OfficerAssignment;
