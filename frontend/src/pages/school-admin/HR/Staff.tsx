import React, { useMemo, useState } from 'react';
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
import type { Staff as StaffEntity } from '../../../state/hrAccessControl';
import { useHR } from '../../../state/hrAccessControl';

type StaffFilterType = 'All' | 'Academic' | 'Non-Academic';

interface EnrichedStaffRow {
  staff: StaffEntity;
  id: string;
  name: string;
  staffId: string;
  email: string;
  roleName: string;
  departmentName: string;
  statusLabel: 'Active' | 'Inactive';
  typeLabel: 'Academic' | 'Non-Academic';
}

const Staff: React.FC = () => {
  const { staff, departments, roles, designations, setStaff } = useHR();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<StaffFilterType>('All');
  const [filterDepartment, setFilterDepartment] = useState('All');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentStaff, setCurrentStaff] = useState<Partial<StaffEntity>>({});
  const [fullName, setFullName] = useState('');
  const [portalAccess, setPortalAccess] = useState(false);

  const enrichedStaff = useMemo<EnrichedStaffRow[]>(() => {
    return staff.map(s => {
      const dept = departments.find(d => d.id === s.departmentId);
      const role = roles.find(r => r.id === s.roleId);
      const name = `${s.firstName} ${s.lastName}`.trim();
      const typeLabel: 'Academic' | 'Non-Academic' =
        dept && dept.type === 'Academic' ? 'Academic' : 'Non-Academic';
      const statusLabel: 'Active' | 'Inactive' =
        s.status === 'active' ? 'Active' : 'Inactive';
      return {
        staff: s,
        id: s.id,
        name,
        staffId: s.staffId,
        email: s.email,
        roleName: role ? role.name : '',
        departmentName: dept ? dept.name : '',
        statusLabel,
        typeLabel
      };
    });
  }, [staff, departments, roles]);

  const filteredStaff = enrichedStaff.filter(row => {
    const matchesSearch =
      row.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      row.staffId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType =
      filterType === 'All' || row.typeLabel === filterType;
    const matchesDept =
      filterDepartment === 'All' ||
      row.departmentName === filterDepartment;
    return matchesSearch && matchesType && matchesDept;
  });

  const getStatusColor = (statusLabel: 'Active' | 'Inactive') => {
    if (statusLabel === 'Active') {
      return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
    }
    return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400';
  };

  const totalStaff = enrichedStaff.length;
  const academicCount = enrichedStaff.filter(
    row => row.typeLabel === 'Academic'
  ).length;
  const inactiveCount = enrichedStaff.filter(
    row => row.statusLabel === 'Inactive'
  ).length;

  const handleOpenCreate = () => {
    setCurrentStaff({ status: 'active' });
    setFullName('');
    setPortalAccess(false);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (row: EnrichedStaffRow) => {
    setCurrentStaff(row.staff);
    setFullName(`${row.staff.firstName} ${row.staff.lastName}`.trim());
    setPortalAccess(false);
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const name = fullName.trim();
    if (!name) {
      return;
    }
    const parts = name.split(' ');
    const firstName = parts[0];
    const lastName = parts.slice(1).join(' ');
    if (!currentStaff.staffId || !currentStaff.email || !currentStaff.departmentId || !currentStaff.designationId || !currentStaff.roleId || !currentStaff.status || !currentStaff.dateEmployed) {
      return;
    }
    const isEdit = Boolean(currentStaff.id);
    if (isEdit && currentStaff.id) {
      setStaff(prev =>
        prev.map(s =>
          s.id === currentStaff.id
            ? {
                ...s,
                staffId: currentStaff.staffId as string,
                firstName,
                lastName,
                email: currentStaff.email as string,
                phone: currentStaff.phone || '',
                departmentId: currentStaff.departmentId as string,
                designationId: currentStaff.designationId as string,
                roleId: currentStaff.roleId as string,
                status: currentStaff.status as StaffEntity['status'],
                dateEmployed: currentStaff.dateEmployed as string
              }
            : s
        )
      );
    } else {
      const newStaff: StaffEntity = {
        id: `staff_${Date.now()}`,
        staffId: currentStaff.staffId as string,
        firstName,
        lastName,
        email: currentStaff.email as string,
        phone: currentStaff.phone || '',
        departmentId: currentStaff.departmentId as string,
        designationId: currentStaff.designationId as string,
        roleId: currentStaff.roleId as string,
        status: currentStaff.status as StaffEntity['status'],
        dateEmployed: currentStaff.dateEmployed as string
      };
      setStaff(prev => [...prev, newStaff]);
    }
    console.log('Saving staff:', currentStaff, 'Portal Access:', portalAccess);
    setIsModalOpen(false);
    setCurrentStaff({});
    setFullName('');
    setPortalAccess(false);
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
            onClick={handleOpenCreate}
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
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mt-2">{totalStaff}</h3>
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
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mt-2">{academicCount}</h3>
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
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mt-2">{departments.length}</h3>
            </div>
            <div className="p-2 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
              <Building2 className="text-purple-600 dark:text-purple-400" size={20} />
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Inactive</p>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mt-2">{inactiveCount}</h3>
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
            onChange={e => setFilterType(e.target.value as StaffFilterType)}
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
            {departments.map(dept => (
              <option key={dept.id} value={dept.name}>
                {dept.name}
              </option>
            ))}
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
                filteredStaff.map(row => (
                  <tr key={row.id} className="hover:bg-gray-50 dark:hover:bg-gray-900/30 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-xs font-bold text-gray-600 dark:text-gray-300">
                          {row.name
                            .split(' ')
                            .filter(Boolean)
                            .map(n => n[0])
                            .join('')}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">{row.name}</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
                            <Mail size={10} /> {row.email}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-600 dark:text-gray-300 font-mono text-xs">
                      {row.staffId}
                    </td>
                    <td className="px-6 py-4 text-gray-600 dark:text-gray-300">
                      <div className="flex flex-col">
                        <span>{row.roleName}</span>
                        <span className="text-xs text-gray-400">{row.typeLabel}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-600 dark:text-gray-300">
                      {row.departmentName}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-2.5 py-1 rounded-full text-xs font-medium ${getStatusColor(
                          row.statusLabel
                        )}`}
                      >
                        {row.statusLabel}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg text-gray-400 hover:text-blue-600 transition-colors">
                          <Eye size={16} />
                        </button>
                        <button 
                          onClick={() => handleOpenEdit(row)}
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
            <h2 className="text-xl font-bold mb-4 dark:text-white">
              {currentStaff.id ? 'Edit Staff' : 'Add New Staff'}
            </h2>
            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Full Name
                  </label>
                  <input 
                    type="text" 
                    className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    placeholder="Dr. Sarah Connor"
                    required
                    value={fullName}
                    onChange={e => setFullName(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Staff ID
                  </label>
                  <input 
                    type="text" 
                    className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    placeholder="STF/2024/001"
                    required
                    value={currentStaff.staffId || ''}
                    onChange={e =>
                      setCurrentStaff(prev => ({
                        ...prev,
                        staffId: e.target.value
                      }))
                    }
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Email Address
                </label>
                <input 
                  type="email" 
                  className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  placeholder="staff@university.edu"
                  required
                  value={currentStaff.email || ''}
                  onChange={e =>
                    setCurrentStaff(prev => ({
                      ...prev,
                      email: e.target.value
                    }))
                  }
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Department
                  </label>
                  <select
                    className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    value={currentStaff.departmentId || ''}
                    onChange={e =>
                      setCurrentStaff(prev => ({
                        ...prev,
                        departmentId: e.target.value
                      }))
                    }
                  >
                    <option value="">Select department...</option>
                    {departments.map(dept => (
                      <option key={dept.id} value={dept.id}>
                        {dept.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Employment Status
                  </label>
                  <select
                    className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    value={currentStaff.status || 'active'}
                    onChange={e =>
                      setCurrentStaff(prev => ({
                        ...prev,
                        status: e.target.value as StaffEntity['status']
                      }))
                    }
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Designation
                </label>
                <select
                  className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  value={currentStaff.designationId || ''}
                  onChange={e =>
                    setCurrentStaff(prev => ({
                      ...prev,
                      designationId: e.target.value
                    }))
                  }
                >
                  <option value="">Select designation...</option>
                  {designations.map(des => (
                    <option key={des.id} value={des.id}>
                      {des.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Assigned Role
                </label>
                <select
                  className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  value={currentStaff.roleId || ''}
                  onChange={e =>
                    setCurrentStaff(prev => ({
                      ...prev,
                      roleId: e.target.value
                    }))
                  }
                >
                  <option value="">Select role...</option>
                  {roles.map(role => (
                    <option key={role.id} value={role.id}>
                      {role.name}
                    </option>
                  ))}
                </select>
                <p className="text-xs text-gray-500 mt-1">This role determines their permissions in the system.</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Date Employed
                </label>
                <input
                  type="date"
                  className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  value={currentStaff.dateEmployed || ''}
                  onChange={e =>
                    setCurrentStaff(prev => ({
                      ...prev,
                      dateEmployed: e.target.value
                    }))
                  }
                  required
                />
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
