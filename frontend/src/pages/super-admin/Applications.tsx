import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Plus,
  Filter, 
  ChevronLeft, 
  ChevronRight, 
  Eye, 
  CheckCircle2, 
  ClipboardList,
  History,
  TrendingUp
} from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { BarChart, Bar, ResponsiveContainer } from 'recharts';

import superAdminService from '../../services/superAdminApi';
import { sanitizeUrl, isHttpUrl } from '../../utils/sanitizeUrl';
import LogoAvatar from '../../components/ui/LogoAvatar';

// Mock Data for Charts (until real stats endpoint is available)
const chartData = [
  { name: 'Mon', value: 4 },
  { name: 'Tue', value: 7 },
  { name: 'Wed', value: 5 },
  { name: 'Thu', value: 12 },
  { name: 'Fri', value: 8 },
  { name: 'Sat', value: 15 },
  { name: 'Sun', value: 10 },
];

const sparklineData = {
  newApps: [ { value: 5 }, { value: 8 }, { value: 6 }, { value: 10 }, { value: 12 }, { value: 15 }, { value: 12 } ],
  pending: [ { value: 40 }, { value: 35 }, { value: 45 }, { value: 42 }, { value: 40 }, { value: 42 }, { value: 42 } ],
  approved: [ { value: 10 }, { value: 12 }, { value: 15 }, { value: 14 }, { value: 16 }, { value: 20 }, { value: 18 } ]
};

const Applications: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [applications, setApplications] = useState<any[]>([]);

  const [error, setError] = useState('');

  // --- Filtering & Pagination ---
  const [filterStatus, setFilterStatus] = useState('All'); 
  const [searchTerm, setSearchTerm] = useState('');

  // Update fetch function to handle different endpoints based on filter
  useEffect(() => {
    const fetchApplications = async () => {
      setLoading(true);
      setError('');
      try {
        let response;
        
        // Select endpoint based on filterStatus
        switch(filterStatus) {
            case 'Draft':
                response = await superAdminService.getInstitutions();
                break;
            case 'Pending':
                response = await superAdminService.getInstitutionsPending();
                break;
            case 'Approved':
                response = await superAdminService.getInstitutionsApproved();
                break;
            case 'Queried':
                response = await superAdminService.getInstitutionsQueried();
                break;
            case 'Suspended':
                response = await superAdminService.getInstitutionsSuspended();
                break;
            case 'Expired':
                response = await superAdminService.getInstitutionsExpired();
                break;
            case 'All':
            default:
                response = await superAdminService.getInstitutions();
                break;
        }

        const data = Array.isArray(response) ? response : (response as any).data || [];
        
        const toStatusNormalized = (status: any) => (status || 'pending').toString().toLowerCase();
        const getStatusMeta = (statusNormalized: string) => {
          switch (statusNormalized) {
            case 'approved':
              return {
                label: 'Approved',
                pillClass: 'text-emerald-700 bg-emerald-50 dark:bg-emerald-900/20 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800',
              };
            case 'pending':
              return {
                label: 'Pending',
                pillClass: 'text-amber-700 bg-amber-50 dark:bg-amber-900/20 dark:text-amber-400 border-amber-200 dark:border-amber-800',
              };
            case 'queried':
              return {
                label: 'Queried',
                pillClass: 'text-blue-700 bg-blue-50 dark:bg-blue-900/20 dark:text-blue-400 border-blue-200 dark:border-blue-800',
              };
            case 'suspended':
              return {
                label: 'Suspended',
                pillClass: 'text-red-700 bg-red-50 dark:bg-red-900/20 dark:text-red-400 border-red-200 dark:border-red-800',
              };
            case 'draft':
              return {
                label: 'Draft',
                pillClass: 'text-gray-700 bg-gray-100 dark:bg-gray-800 dark:text-gray-300 border-gray-200 dark:border-gray-700',
              };
            case 'rejected':
              return {
                label: 'Rejected',
                pillClass: 'text-red-700 bg-red-50 dark:bg-red-900/20 dark:text-red-400 border-red-200 dark:border-red-800',
              };
            default:
              return {
                label: statusNormalized ? `${statusNormalized.charAt(0).toUpperCase()}${statusNormalized.slice(1)}` : 'Pending',
                pillClass: 'text-gray-700 bg-gray-100 dark:bg-gray-800 dark:text-gray-300 border-gray-200 dark:border-gray-700',
              };
          }
        };

        // Map API data to UI structure
        const mapped = data.map((inst: any) => {
          const statusNormalized = toStatusNormalized(inst.status);
          const statusMeta = getStatusMeta(statusNormalized);
          return {
            id: inst.id,
            institution: inst.name,
            location: inst.address || 'N/A',
            logo: (() => {
              const cleaned = sanitizeUrl(inst.logo);
              if (isHttpUrl(cleaned)) return cleaned;
              return (inst.name.charAt(0) + (inst.name.split(' ')[1] || '').charAt(0)).toUpperCase();
            })(),
            logoColor: 'bg-blue-600',
            dateSubmitted: new Date(inst.created_at || Date.now()).toLocaleDateString(),
            type: inst.institution_type_id ? 'Institution' : 'Unknown',
            contactName: inst.rector || 'N/A',
            contactAvatar: '',
            status: statusMeta.label,
            statusNormalized,
            statusPillClass: statusMeta.pillClass,
            priority: 'Normal'
          };
        });

        const normalizedFilter = filterStatus.toLowerCase();
        const filteredByStatus = normalizedFilter === 'all'
          ? mapped
          : mapped.filter((row: any) => row.statusNormalized === normalizedFilter);

        setApplications(filteredByStatus);
      } catch (err: any) {
        console.error('Failed to fetch applications', err);
        setError(err.message || 'Failed to load applications');
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, [filterStatus]); // Re-fetch when filter changes

  const filteredApplications = applications.filter(app => {
    // Status is already filtered by API endpoint, so we only filter by search term locally
    // unless we are in 'All' mode where we might want client side filtering if needed, 
    // but typically API handles status. 
    // However, the previous logic filtered by status locally. 
    // Since we now fetch specific lists, we can assume the returned list is correct for that status.
    // Exception: 'All' returns everything.
    
    // Actually, to be safe and allow searching within the result set:
    const matchesSearch = 
      app.institution.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.location.toLowerCase().includes(searchTerm.toLowerCase());
      
    return matchesSearch;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
          <p className="text-gray-500 font-medium">Loading Applications...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-4 text-center">
          <div className="p-4 bg-red-100 dark:bg-red-900/30 rounded-full text-red-600 dark:text-red-400">
            <TrendingUp size={32} className="rotate-180" /> 
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">Unable to load applications</h3>
            <p className="text-gray-500 dark:text-gray-400 mt-1 max-w-md">{error}</p>
          </div>
          <button 
            onClick={() => window.location.reload()}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 transition-colors shadow-lg shadow-blue-500/20"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">New Registrations</h1>
          <p className="text-gray-600 dark:text-gray-400 font-medium mt-1">
            Overview of incoming institution applications.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link to="/super-admin/new-registration" className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 transition-colors shadow-lg shadow-blue-500/20">
            <Plus size={18} />
            <span>Register New Institution</span>
          </Link>
          <button className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 rounded-lg font-bold hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors shadow-sm">
            <ClipboardList size={18} />
            <span>Generate Report</span>
          </button>
        </div>
      </div>

      {/* Status Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm flex flex-col justify-between h-40 transition-transform hover:scale-[1.02] duration-200">
          <div className="flex items-center justify-between">
            <div className="p-3 rounded-lg bg-blue-100 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400">
              <ClipboardList size={24} />
            </div>
            <div className="h-10 w-24">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={sparklineData.newApps}>
                  <Bar dataKey="value" fill="#3b82f6" radius={[2, 2, 2, 2]} barSize={4} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div>
            <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">New Applications</p>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-gray-900 dark:text-white">12</span>
              <span className="text-xs font-bold text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/20 px-1.5 py-0.5 rounded">+4</span>
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm flex flex-col justify-between h-40 transition-transform hover:scale-[1.02] duration-200">
          <div className="flex items-center justify-between">
            <div className="p-3 rounded-lg bg-amber-100 text-amber-600 dark:bg-amber-900/20 dark:text-amber-400">
              <History size={24} />
            </div>
            <div className="h-10 w-24">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={sparklineData.pending}>
                  <Bar dataKey="value" fill="#d97706" radius={[2, 2, 2, 2]} barSize={4} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div>
            <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Total Pending</p>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-gray-900 dark:text-white">42</span>
              <span className="text-xs font-bold text-amber-600 dark:text-amber-400">Requires action</span>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm flex flex-col justify-between h-40 transition-transform hover:scale-[1.02] duration-200">
          <div className="flex items-center justify-between">
            <div className="p-3 rounded-lg bg-emerald-100 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400">
              <CheckCircle2 size={24} />
            </div>
            <div className="h-10 w-24">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={sparklineData.approved}>
                  <Bar dataKey="value" fill="#10b981" radius={[2, 2, 2, 2]} barSize={4} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div>
            <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Approved Today</p>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-gray-900 dark:text-white">18</span>
              <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-900/20 px-1.5 py-0.5 rounded">+12%</span>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm flex flex-col justify-between h-40 transition-transform hover:scale-[1.02] duration-200">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Activity Trend</p>
              <TrendingUp size={14} className="text-gray-400" />
            </div>
            <div className="h-20 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <Bar dataKey="value" fill="#3b82f6" radius={[2, 2, 2, 2]} barSize={6} />
                </BarChart>
              </ResponsiveContainer>
            </div>
        </div>
      </div>

      {/* Filters & Table */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
        {/* Filters */}
        <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="Search by ID, name, or contact..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-900/5 dark:bg-gray-900/50 border-none rounded-xl text-gray-900 dark:text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500/20 transition-all text-sm font-medium"
            />
          </div>
          
          <div className="flex items-center gap-3 w-full md:w-auto overflow-x-auto pb-2 md:pb-0">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider whitespace-nowrap mr-2">Filters:</span>
            
            {['All', 'Draft', 'Pending', 'Approved', 'Queried', 'Suspended', 'Expired'].map((status) => (
                <button 
                  key={status}
                  onClick={() => setFilterStatus(status)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors border ${
                    filterStatus === status 
                      ? 'bg-blue-100 text-blue-600 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800' 
                      : 'bg-gray-900/5 dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-transparent hover:border-gray-300 dark:hover:border-gray-500'
                  }`}
                >
                  {status}
                </button>
            ))}
            
            <button className="p-2 text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700 rounded-lg transition-colors ml-2">
              <Filter size={18} />
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50 dark:bg-gray-900/50 border-b border-gray-200 dark:border-gray-800">
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Institution</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Date Submitted</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Type</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Contact</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {filteredApplications.map((app) => (
                <tr key={app.id} className="hover:bg-gray-50 dark:hover:bg-gray-900/30 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      {/* Logo Container - Fixed Width to prevent overlapping */}
                      <LogoAvatar
                        src={app.logo}
                        alt="Logo"
                        fallback={app.institution ? app.institution.substring(0, 2).toUpperCase() : 'IN'}
                        className={`w-10 h-10 rounded-lg ${app.logoColor} flex items-center justify-center text-white font-bold text-sm shrink-0 overflow-hidden`}
                      />
                      <div className="min-w-0">
                        <div className="font-bold text-gray-900 dark:text-white truncate max-w-[200px]" title={app.institution}>{app.institution}</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-gray-300 dark:bg-gray-600 shrink-0"></span>
                          <span className="truncate max-w-[150px]">{app.location}</span>
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400 font-medium">
                    {app.dateSubmitted}
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 rounded-md text-xs font-bold">
                      {app.type}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      {app.contactAvatar && <img src={app.contactAvatar} alt={app.contactName} className="w-6 h-6 rounded-full object-cover" />}
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{app.contactName}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold border ${app.statusPillClass}`}>
                      {app.status === 'Approved' && <CheckCircle2 size={12} />}
                      {app.status === 'Pending' && <div className="w-1.5 h-1.5 rounded-full bg-current animate-pulse"></div>}
                      {app.status === 'Draft' && <div className="w-1.5 h-1.5 rounded-full bg-current"></div>}
                      {app.status === 'Suspended' && <div className="w-1.5 h-1.5 rounded-full bg-current"></div>}
                      {app.status === 'Queried' && <div className="w-1.5 h-1.5 rounded-full bg-current"></div>}
                      {app.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button 
                      onClick={() => navigate(`/super-admin/applications/${app.id}`)}
                      className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                    >
                      <Eye size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between bg-gray-50/50 dark:bg-gray-800/50">
          <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">
            Showing <span className="font-bold text-gray-900 dark:text-white">1 to 10</span> of <span className="font-bold text-gray-900 dark:text-white">42</span> results
          </p>
          <div className="flex items-center gap-1">
            <button className="p-2 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-500 dark:text-gray-400 hover:bg-white dark:hover:bg-gray-700 disabled:opacity-50 transition-colors">
              <ChevronLeft size={16} />
            </button>
            <button className="w-8 h-8 flex items-center justify-center rounded-lg bg-blue-600 text-white font-bold text-sm shadow-sm">1</button>
            <button className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 font-bold text-sm hover:bg-white dark:hover:bg-gray-700 transition-colors">2</button>
            <button className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 font-bold text-sm hover:bg-white dark:hover:bg-gray-700 transition-colors">3</button>
            <span className="w-8 h-8 flex items-center justify-center text-gray-400 font-bold">...</span>
            <button className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 font-bold text-sm hover:bg-white dark:hover:bg-gray-700 transition-colors">8</button>
            <button className="p-2 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-500 dark:text-gray-400 hover:bg-white dark:hover:bg-gray-700 disabled:opacity-50 transition-colors">
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Applications;
