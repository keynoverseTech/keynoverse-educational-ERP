import React, { useState } from 'react';
import { 
  Search, 
  Plus, 
  Download, 
  Eye, 
  Edit, 
  Trash2,
  Briefcase,
  Users,
  Building2,
  Mail
} from 'lucide-react';

interface StaffMember {
  id: string;
  name: string;
  staffId: string;
  email: string;
  role: string;
  department: string;
  status: 'Active' | 'On Leave' | 'Resigned' | 'Suspended';
  type: 'Academic' | 'Non-Academic';
}

const mockStaff: StaffMember[] = [
  {
    id: '1',
    name: 'Dr. Sarah Connor',
    staffId: 'STF/2015/001',
    email: 'sarah.connor@uni.edu',
    role: 'Senior Lecturer',
    department: 'Computer Science',
    status: 'Active',
    type: 'Academic'
  },
  {
    id: '2',
    name: 'Prof. John Smith',
    staffId: 'STF/2010/056',
    email: 'john.smith@uni.edu',
    role: 'HOD',
    department: 'Mechanical Engineering',
    status: 'Active',
    type: 'Academic'
  },
  {
    id: '3',
    name: 'Emily Blunt',
    staffId: 'STF/2018/112',
    email: 'emily.b@uni.edu',
    role: 'Lab Technician',
    department: 'Medicine',
    status: 'On Leave',
    type: 'Non-Academic'
  },
  {
    id: '4',
    name: 'Michael Scott',
    staffId: 'STF/2019/089',
    email: 'm.scott@uni.edu',
    role: 'Admin Officer',
    department: 'Registry',
    status: 'Active',
    type: 'Non-Academic'
  },
  {
    id: '5',
    name: 'Dr. Gregory House',
    staffId: 'STF/2012/023',
    email: 'g.house@uni.edu',
    role: 'Professor',
    department: 'Medicine',
    status: 'Suspended',
    type: 'Academic'
  }
];

const Staff: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('All');
  const [filterDepartment, setFilterDepartment] = useState('All');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentStaff, setCurrentStaff] = useState<Partial<StaffMember>>({});
  const [portalAccess, setPortalAccess] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would save to the backend
    console.log('Saving staff:', currentStaff, 'Portal Access:', portalAccess);
    setIsModalOpen(false);
    // Reset form
    setCurrentStaff({});
    setPortalAccess(false);
  };

  const filteredStaff = mockStaff.filter(staff => {
    const matchesSearch = staff.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          staff.staffId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'All' || staff.type === filterType;
    const matchesDept = filterDepartment === 'All' || staff.department === filterDepartment;
    
    return matchesSearch && matchesType && matchesDept;
  });

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'Active': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
      case 'On Leave': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400';
      case 'Resigned': return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400';
      case 'Suspended': return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
      default: return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400';
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <Briefcase className="w-8 h-8 text-blue-600" />
            Staff Management
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Manage academic and non-academic staff records</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
            <Download size={18} />
            Export
          </button>
          <button 
            onClick={() => { setCurrentStaff({}); setPortalAccess(false); setIsModalOpen(true); }}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-lg shadow-blue-600/20"
          >
            <Plus size={18} />
            Add Staff
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Staff</p>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mt-2">1,250</h3>
            </div>
            <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <Users className="text-blue-600 dark:text-blue-400" size={20} />
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Academic Staff</p>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mt-2">850</h3>
            </div>
            <div className="p-2 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <Briefcase className="text-green-600 dark:text-green-400" size={20} />
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Departments</p>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mt-2">45</h3>
            </div>
            <div className="p-2 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
              <Building2 className="text-purple-600 dark:text-purple-400" size={20} />
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">On Leave</p>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mt-2">42</h3>
            </div>
            <div className="p-2 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
              <Users className="text-orange-600 dark:text-orange-400" size={20} />
            </div>
          </div>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 flex flex-col md:flex-row gap-4 justify-between items-center">
        <div className="flex flex-wrap gap-3 w-full md:w-auto">
          <select 
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-3 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
          >
            <option value="All">All Types</option>
            <option value="Academic">Academic Staff</option>
            <option value="Non-Academic">Non-Academic Staff</option>
          </select>
          <select 
            value={filterDepartment}
            onChange={(e) => setFilterDepartment(e.target.value)}
            className="px-3 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
          >
            <option value="All">All Departments</option>
            <option value="Computer Science">Computer Science</option>
            <option value="Mechanical Engineering">Mechanical Engineering</option>
            <option value="Medicine">Medicine</option>
            <option value="Registry">Registry</option>
          </select>
        </div>
        <div className="relative w-full md:w-64">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <input 
            type="text" 
            placeholder="Search staff..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 dark:bg-gray-900/50 border-b border-gray-200 dark:border-gray-700">
              <tr>
                <th className="px-6 py-4 font-medium text-gray-500 dark:text-gray-400">Staff Name</th>
                <th className="px-6 py-4 font-medium text-gray-500 dark:text-gray-400">Staff ID</th>
                <th className="px-6 py-4 font-medium text-gray-500 dark:text-gray-400">Role</th>
                <th className="px-6 py-4 font-medium text-gray-500 dark:text-gray-400">Department</th>
                <th className="px-6 py-4 font-medium text-gray-500 dark:text-gray-400">Status</th>
                <th className="px-6 py-4 font-medium text-gray-500 dark:text-gray-400 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {filteredStaff.length > 0 ? (
                filteredStaff.map((staff) => (
                  <tr key={staff.id} className="hover:bg-gray-50 dark:hover:bg-gray-900/30 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-xs font-bold text-gray-600 dark:text-gray-300">
                          {staff.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">{staff.name}</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
                            <Mail size={10} /> {staff.email}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-600 dark:text-gray-300 font-mono text-xs">{staff.staffId}</td>
                    <td className="px-6 py-4 text-gray-600 dark:text-gray-300">
                      <div className="flex flex-col">
                        <span>{staff.role}</span>
                        <span className="text-xs text-gray-400">{staff.type}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-600 dark:text-gray-300">{staff.department}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${getStatusColor(staff.status)}`}>
                        {staff.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg text-gray-400 hover:text-blue-600 transition-colors">
                          <Eye size={16} />
                        </button>
                        <button 
                          onClick={() => { setCurrentStaff(staff); setPortalAccess(true); setIsModalOpen(true); }}
                          className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg text-gray-400 hover:text-amber-600 transition-colors"
                        >
                          <Edit size={16} />
                        </button>
                        <button className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg text-gray-400 hover:text-red-600 transition-colors">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-gray-500 dark:text-gray-400">
                    No staff found matching your filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-lg p-6 max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4 dark:text-white">{currentStaff.id ? 'Edit Staff' : 'Add New Staff'}</h2>
            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Full Name</label>
                  <input 
                    type="text" 
                    className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    placeholder="Dr. Sarah Connor"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Staff ID</label>
                  <input 
                    type="text" 
                    className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    placeholder="STF/2024/001"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email Address</label>
                <input 
                  type="email" 
                  className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  placeholder="staff@university.edu"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Department</label>
                  <select className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                    <option>Computer Science</option>
                    <option>Mechanical Engineering</option>
                    <option>Registry</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Staff Type</label>
                  <select className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                    <option>Academic</option>
                    <option>Non-Academic</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Assigned Role</label>
                <select className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                  <option value="">Select Role...</option>
                  <option value="Lecturer">Lecturer</option>
                  <option value="Senior Lecturer">Senior Lecturer</option>
                  <option value="HOD">Head of Department (HOD)</option>
                  <option value="Dean">Dean</option>
                  <option value="Admin Officer">Admin Officer</option>
                  <option value="Lab Technician">Lab Technician</option>
                </select>
                <p className="text-xs text-gray-500 mt-1">This role determines their permissions in the system.</p>
              </div>

              <div className="p-4 bg-gray-50 dark:bg-gray-900/50 rounded-lg border border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-medium text-gray-900 dark:text-white">Portal Access</h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Allow staff to log in to the staff portal</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" checked={portalAccess} onChange={e => setPortalAccess(e.target.checked)} className="sr-only peer" />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                  </label>
                </div>
                {portalAccess && (
                  <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                     <p className="text-xs text-blue-600 dark:text-blue-400 flex items-center gap-1">
                       <Mail size={12} />
                       Login credentials will be sent to the email above.
                     </p>
                  </div>
                )}
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <button 
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-600"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 dark:focus:ring-blue-800"
                >
                  {currentStaff.id ? 'Save Changes' : 'Create Staff'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Staff;