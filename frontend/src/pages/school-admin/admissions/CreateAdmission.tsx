import React, { useMemo, useState } from 'react';
import { 
  Search, 
  User, 
  CheckCircle, 
  XCircle, 
  Clock, 
  AlertTriangle,
  Plus,
  ArrowLeft,
  Save,
  GraduationCap,
  Mail,
  Phone,
  FileText,
  Calendar,
  MoreVertical,
  Filter,
  Upload,
  Link as LinkIcon,
  Globe,
  Share2,
  Users,
  Download,
  Key, 
  Lock
} from 'lucide-react';
import { mockProgrammes } from '../../../data/mockData';

interface Applicant {
  id: string;
  name: string;
  firstName?: string;
  lastName?: string;
  middleName?: string;
  gender?: string;
  dob?: string;
  programme: string;
  faculty?: string;
  department?: string;
  session?: string;
  entryType?: string;
  admissionDate?: string;
  programDuration?: string;
  score: number;
  status: 'Pending' | 'Eligible' | 'Admitted' | 'Rejected';
  appNo: string;
  email: string;
  phone?: string;
  address?: string;
  nin?: string;
  guardianName?: string;
  guardianPhone?: string;
  guardianAddress?: string;
  jambNo?: string;
  appliedDate?: string;
  erpId?: string; // Simulated ERP ID
  portalAccess?: {
    isEnabled: boolean;
    username?: string;
    hasPassword?: boolean;
  };
  documents?: {
    oLevel?: { file?: File | null; fileName?: string };
    birthCert?: { file?: File | null; fileName?: string };
    medicalReport?: { file?: File | null; fileName?: string };
    jambResult?: { file?: File | null; fileName?: string };
    jambSlip?: { file?: File | null; fileName?: string };
    passport?: { file?: File | null; fileName?: string };
  };
}

const initialApplicants: Applicant[] = [
  { 
    id: '1',
    name: 'John Doe',
    firstName: 'John',
    lastName: 'Doe',
    gender: 'Male',
    dob: '2004-03-12',
    programme: 'ND Computer Science',
    faculty: 'Science',
    department: 'Computer Science',
    session: '2024/2025',
    entryType: 'UTME',
    admissionDate: '2024-09-10',
    programDuration: '2',
    score: 245,
    status: 'Eligible',
    appNo: '2024987654',
    email: 'john@example.com',
    phone: '+234 801 234 5678',
    address: '12 River Road, Lagos',
    nin: '12345678901',
    guardianName: 'Peter Doe',
    guardianPhone: '+234 808 111 2233',
    guardianAddress: '12 River Road, Lagos',
    jambNo: '2024987654',
    appliedDate: '2024-05-15',
    portalAccess: { isEnabled: false },
    documents: {
      oLevel: { fileName: 'O-Level Result.pdf' },
      birthCert: { fileName: 'Birth Certificate.pdf' },
      medicalReport: { fileName: 'Medical Report.pdf' },
      jambResult: { fileName: 'JAMB Result.pdf' },
      jambSlip: { fileName: 'JAMB Slip.pdf' },
      passport: { fileName: 'Passport Photo.jpg' }
    }
  },
  { 
    id: '2',
    name: 'Jane Smith',
    firstName: 'Jane',
    lastName: 'Smith',
    gender: 'Female',
    dob: '2005-07-02',
    programme: 'HND Business Administration',
    faculty: 'Management',
    department: 'Business Administration',
    session: '2024/2025',
    entryType: 'Direct Entry',
    admissionDate: '2024-09-10',
    programDuration: '2',
    score: 180,
    status: 'Pending',
    appNo: '2024123456',
    email: 'jane@example.com',
    phone: '+234 802 345 6789',
    address: '8 Market Street, Abuja',
    nin: '10987654321',
    guardianName: 'Mary Smith',
    guardianPhone: '+234 809 222 3344',
    guardianAddress: '8 Market Street, Abuja',
    jambNo: '2024123456',
    appliedDate: '2024-05-18',
    portalAccess: { isEnabled: false },
    documents: {
      oLevel: { fileName: 'O-Level Result.pdf' },
      birthCert: { fileName: 'Birth Certificate.pdf' },
      jambResult: { fileName: 'JAMB Result.pdf' },
      passport: { fileName: 'Passport Photo.jpg' }
    }
  },
  { 
    id: '3',
    name: 'Michael Brown',
    firstName: 'Michael',
    lastName: 'Brown',
    gender: 'Male',
    dob: '2003-11-22',
    programme: 'ND Mass Communication',
    faculty: 'Arts',
    department: 'Mass Communication',
    session: '2024/2025',
    entryType: 'UTME',
    admissionDate: '2024-09-10',
    programDuration: '2',
    score: 280,
    status: 'Admitted',
    appNo: '2024567890',
    email: 'michael@example.com',
    phone: '+234 803 456 7890',
    address: '22 Hill View, Port Harcourt',
    nin: '23456789012',
    guardianName: 'Grace Brown',
    guardianPhone: '+234 810 333 4455',
    guardianAddress: '22 Hill View, Port Harcourt',
    jambNo: '2024567890',
    appliedDate: '2024-05-10',
    erpId: 'MED/24/001',
    portalAccess: { isEnabled: true, username: 'michael.brown', hasPassword: true },
    documents: {
      oLevel: { fileName: 'O-Level Result.pdf' },
      birthCert: { fileName: 'Birth Certificate.pdf' },
      medicalReport: { fileName: 'Medical Report.pdf' },
      jambResult: { fileName: 'JAMB Result.pdf' },
      jambSlip: { fileName: 'JAMB Slip.pdf' },
      passport: { fileName: 'Passport Photo.jpg' }
    }
  },
  { 
    id: '4',
    name: 'Sarah Wilson',
    firstName: 'Sarah',
    lastName: 'Wilson',
    gender: 'Female',
    dob: '2006-01-09',
    programme: 'ND Mass Communication',
    faculty: 'Arts',
    department: 'Mass Communication',
    session: '2024/2025',
    entryType: 'UTME',
    admissionDate: '2024-09-10',
    programDuration: '2',
    score: 150,
    status: 'Rejected',
    appNo: '2024234567',
    email: 'sarah@example.com',
    phone: '+234 804 567 8901',
    address: '14 Lake Road, Enugu',
    nin: '34567890123',
    guardianName: 'James Wilson',
    guardianPhone: '+234 811 444 5566',
    guardianAddress: '14 Lake Road, Enugu',
    jambNo: '2024234567',
    appliedDate: '2024-05-20',
    portalAccess: { isEnabled: false },
    documents: {
      passport: { fileName: 'Passport Photo.jpg' }
    }
  },
  { 
    id: '5',
    name: 'David Lee',
    firstName: 'David',
    lastName: 'Lee',
    gender: 'Male',
    dob: '2004-09-18',
    programme: 'HND Software Engineering',
    faculty: 'Engineering',
    department: 'Software Engineering',
    session: '2024/2025',
    entryType: 'Transfer',
    admissionDate: '2024-09-10',
    programDuration: '2',
    score: 210,
    status: 'Eligible',
    appNo: 'DE2024001',
    email: 'david@example.com',
    phone: '+234 805 678 9012',
    address: '5 Unity Avenue, Ibadan',
    nin: '45678901234',
    guardianName: 'Helen Lee',
    guardianPhone: '+234 812 555 6677',
    guardianAddress: '5 Unity Avenue, Ibadan',
    jambNo: 'DE2024001',
    appliedDate: '2024-05-22',
    portalAccess: { isEnabled: false }
  },
];

const CreateAdmission: React.FC = () => {
  const [selectedApplicant, setSelectedApplicant] = useState<Applicant | null>(null);
  const [applicants, setApplicants] = useState<Applicant[]>(initialApplicants);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [showConfirmModal, setShowConfirmModal] = useState<{ show: boolean, action: 'admit' | 'reject' | 'hold' | null }>({ show: false, action: null });
  const [toast, setToast] = useState<{ show: boolean, message: string, type: 'success' | 'error' } | null>(null);
  
  // Tab State
  const [activeTab, setActiveTab] = useState<'manual' | 'online' | 'bulk'>('manual');

  // New Application State
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [newApplicant, setNewApplicant] = useState({
    firstName: '',
    lastName: '',
    middleName: '',
    gender: 'Male',
    dob: '',
    email: '',
    phone: '',
    address: '',
    nin: '',
    guardianName: '',
    guardianPhone: '',
    guardianAddress: '',
    jambNo: '',
    score: '',
    programme: '',
    faculty: '',
    department: '',
    session: '2024/2025',
    entryType: 'UTME',
    admissionDate: new Date().toISOString().split('T')[0],
    programDuration: '4',
    
    // Documents (placeholders for file objects)
    oLevel: null as File | null,
    birthCert: null as File | null,
    medicalReport: null as File | null,
    jambResult: null as File | null,
    jambSlip: null as File | null,
    passport: null as File | null,

    // Portal Access
    createPortalAccess: false,
    portalUsername: '',
    portalPassword: ''
  });

  const [onlineFormSettings, setOnlineFormSettings] = useState({
    allowSelfRegistration: true
  });

  const filteredApplicants = useMemo(() => {
    return applicants.filter(app => {
      const matchesSearch =
        app.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        app.appNo.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === 'all' || app.status.toLowerCase() === statusFilter.toLowerCase();
      return matchesSearch && matchesStatus;
    });
  }, [applicants, searchQuery, statusFilter]);

  const handleDecision = (action: 'admit' | 'reject' | 'hold') => {
    setTimeout(() => {
      let message = `Applicant successfully ${action === 'admit' ? 'admitted' : action === 'reject' ? 'rejected' : 'put on hold'}!`;
      if (action === 'admit') {
        message += " Portal access created. ERP ID generated.";
        if (selectedApplicant) {
          const erpId = `ERP/${new Date().getFullYear()}/${String(Math.floor(Math.random() * 1000)).padStart(3, '0')}`;
          const updated = { 
            ...selectedApplicant,
            status: 'Admitted' as const,
            erpId,
            portalAccess: {
              isEnabled: true,
              username: selectedApplicant.portalAccess?.username || selectedApplicant.email.split('@')[0],
              hasPassword: true
            }
          };
          setSelectedApplicant(updated);
          setApplicants(prev => prev.map(a => (a.id === updated.id ? updated : a)));
        }
      } else if (selectedApplicant) {
        const updated = { ...selectedApplicant, status: action === 'reject' ? 'Rejected' as const : 'Pending' as const };
        setSelectedApplicant(updated);
        setApplicants(prev => prev.map(a => (a.id === updated.id ? updated : a)));
      }

      setToast({ show: true, message, type: 'success' });
      setShowConfirmModal({ show: false, action: null });
      setTimeout(() => setToast(null), 4000);
    }, 500);
  };

  const handleCreateApplication = () => {
    if (!newApplicant.firstName || !newApplicant.jambNo || !newApplicant.score || !newApplicant.programme) {
      setToast({ show: true, message: 'Please fill in all required fields', type: 'error' });
      setTimeout(() => setToast(null), 3000);
      return;
    }

    setTimeout(() => {
      const id = `app-${Date.now()}`;
      const fullName = [newApplicant.firstName, newApplicant.middleName, newApplicant.lastName].filter(Boolean).join(' ');
      const created: Applicant = {
        id,
        name: fullName,
        firstName: newApplicant.firstName,
        middleName: newApplicant.middleName,
        lastName: newApplicant.lastName,
        gender: newApplicant.gender,
        dob: newApplicant.dob,
        programme: newApplicant.programme,
        faculty: newApplicant.faculty,
        department: newApplicant.department,
        session: newApplicant.session,
        entryType: newApplicant.entryType,
        admissionDate: newApplicant.admissionDate,
        programDuration: newApplicant.programDuration,
        score: Number(newApplicant.score),
        status: 'Pending',
        appNo: newApplicant.jambNo || `APP-${String(Math.floor(Math.random() * 1000000)).padStart(6, '0')}`,
        email: newApplicant.email || `${newApplicant.firstName.toLowerCase()}.${newApplicant.lastName.toLowerCase()}@example.com`,
        phone: newApplicant.phone,
        address: newApplicant.address,
        nin: newApplicant.nin,
        guardianName: newApplicant.guardianName,
        guardianPhone: newApplicant.guardianPhone,
        guardianAddress: newApplicant.guardianAddress,
        jambNo: newApplicant.jambNo,
        appliedDate: new Date().toISOString().split('T')[0],
        portalAccess: newApplicant.createPortalAccess
          ? { isEnabled: true, username: newApplicant.portalUsername, hasPassword: Boolean(newApplicant.portalPassword) }
          : { isEnabled: false },
        documents: {
          oLevel: { file: newApplicant.oLevel, fileName: newApplicant.oLevel?.name },
          birthCert: { file: newApplicant.birthCert, fileName: newApplicant.birthCert?.name },
          medicalReport: { file: newApplicant.medicalReport, fileName: newApplicant.medicalReport?.name },
          jambResult: { file: newApplicant.jambResult, fileName: newApplicant.jambResult?.name },
          jambSlip: { file: newApplicant.jambSlip, fileName: newApplicant.jambSlip?.name },
          passport: { file: newApplicant.passport, fileName: newApplicant.passport?.name }
        }
      };
      setApplicants(prev => [created, ...prev]);
      setSelectedApplicant(created);
      setIsAddingNew(false);
      setToast({ show: true, message: 'New application created successfully!', type: 'success' });
      setTimeout(() => setToast(null), 3000);
    }, 1000);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Admitted': 
        return <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 border border-green-200 dark:border-green-800"><CheckCircle size={12} /> Admitted</span>;
      case 'Eligible': 
        return <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 border border-blue-200 dark:border-blue-800"><CheckCircle size={12} /> Eligible</span>;
      case 'Pending': 
        return <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400 border border-yellow-200 dark:border-yellow-800"><Clock size={12} /> Pending</span>;
      case 'Rejected': 
        return <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 border border-red-200 dark:border-red-800"><XCircle size={12} /> Rejected</span>;
      default: 
        return <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400 border border-gray-200 dark:border-gray-700">Unknown</span>;
    }
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
  };

  const selectedDocuments = useMemo(() => {
    if (!selectedApplicant?.documents) return [];
    const docs = selectedApplicant.documents;
    return [
      { key: 'passport', label: 'Passport Photo', data: docs.passport },
      { key: 'oLevel', label: 'O-Level Result', data: docs.oLevel },
      { key: 'birthCert', label: 'Birth Certificate', data: docs.birthCert },
      { key: 'medicalReport', label: 'Medical Report', data: docs.medicalReport },
      { key: 'jambResult', label: 'JAMB Result', data: docs.jambResult },
      { key: 'jambSlip', label: 'JAMB Slip', data: docs.jambSlip },
    ];
  }, [selectedApplicant]);

  return (
    <div className="h-[calc(100vh-100px)] flex gap-6 p-6 max-w-[1600px] mx-auto">
      {/* Left Column: Applicant List */}
      <div className="w-1/3 min-w-[350px] bg-white dark:bg-[#151e32] rounded-2xl shadow-sm border border-gray-200 dark:border-gray-800 flex flex-col overflow-hidden">
        <div className="p-5 border-b border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/20">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">Applicants</h2>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Manage intake applications</p>
            </div>
            <button 
              onClick={() => { setIsAddingNew(true); setSelectedApplicant(null); setActiveTab('manual'); }}
              className="p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-all shadow-lg shadow-blue-600/20 flex items-center gap-2"
              title="Add New Applicant"
            >
              <Plus size={18} />
            </button>
          </div>
          
          <div className="flex gap-2 mb-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
              <input 
                type="text" 
                placeholder="Search name or ID..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-sm focus:ring-2 focus:ring-blue-500/50 outline-none transition-all"
              />
            </div>
            <div className="relative group">
              <button className="h-full px-3 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-gray-500">
                <Filter size={18} />
              </button>
            </div>
          </div>
          
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
            {['All', 'Pending', 'Eligible', 'Admitted', 'Rejected'].map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status.toLowerCase())}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-colors border ${
                  statusFilter === status.toLowerCase()
                    ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                    : 'bg-white dark:bg-gray-900 text-gray-600 dark:text-gray-400 border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800'
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto p-3 space-y-2 custom-scrollbar">
          {filteredApplicants.length > 0 ? (
            filteredApplicants.map(app => (
              <div 
                key={app.id}
                onClick={() => { setSelectedApplicant(app); setIsAddingNew(false); }}
                className={`p-3 rounded-xl cursor-pointer transition-all border group relative ${
                  selectedApplicant?.id === app.id 
                    ? 'bg-blue-50 dark:bg-blue-900/10 border-blue-200 dark:border-blue-800 shadow-sm' 
                    : 'bg-white dark:bg-gray-900/40 border-transparent hover:bg-gray-50 dark:hover:bg-gray-800 hover:border-gray-200 dark:hover:border-gray-700'
                }`}
              >
                {selectedApplicant?.id === app.id && (
                  <div className="absolute left-0 top-3 bottom-3 w-1 bg-blue-600 rounded-r-full"></div>
                )}
                <div className="flex items-start gap-3 pl-2">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold shadow-sm flex-shrink-0 ${
                    selectedApplicant?.id === app.id 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'
                  }`}>
                    {getInitials(app.name)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start">
                      <h3 className={`font-bold text-sm truncate ${selectedApplicant?.id === app.id ? 'text-blue-900 dark:text-blue-100' : 'text-gray-900 dark:text-white'}`}>
                        {app.name}
                      </h3>
                      <span className="text-[10px] font-mono text-gray-400 dark:text-gray-500 bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded">
                        {app.score}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate mt-0.5">{app.programme}</p>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-[10px] text-gray-400">{app.appNo}</span>
                      {getStatusBadge(app.status)}
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center h-40 text-gray-400 mt-10">
              <Search size={32} className="mb-2 opacity-50" />
              <p className="text-sm font-medium">No applicants found</p>
            </div>
          )}
        </div>
      </div>

      {/* Right Column: Details or Create Form */}
      <div className="flex-1 bg-white dark:bg-[#151e32] rounded-2xl shadow-sm border border-gray-200 dark:border-gray-800 flex flex-col overflow-hidden relative">
        {isAddingNew ? (
          // Create New Application Form
          <div className="flex flex-col h-full animate-in fade-in slide-in-from-right-4 duration-300">
            <div className="p-6 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between bg-gray-50/50 dark:bg-gray-900/20">
              <div className="flex items-center gap-4">
                <button 
                  onClick={() => setIsAddingNew(false)}
                  className="p-2 hover:bg-white dark:hover:bg-gray-800 rounded-xl transition-colors text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 border border-transparent hover:border-gray-200 dark:hover:border-gray-700 shadow-sm"
                >
                  <ArrowLeft size={20} />
                </button>
                <div>
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">New Application</h2>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Register new student applicant</p>
                </div>
              </div>

              {/* Tabs for New Application */}
              <div className="flex bg-gray-100 dark:bg-gray-800 p-1 rounded-xl">
                <button 
                  onClick={() => setActiveTab('manual')}
                  className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${activeTab === 'manual' ? 'bg-white dark:bg-[#151e32] text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'}`}
                >
                  Manual Entry
                </button>
                <button 
                  onClick={() => setActiveTab('online')}
                  className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${activeTab === 'online' ? 'bg-white dark:bg-[#151e32] text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'}`}
                >
                  Online Form
                </button>
                <button 
                  onClick={() => setActiveTab('bulk')}
                  className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${activeTab === 'bulk' ? 'bg-white dark:bg-[#151e32] text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'}`}
                >
                  Bulk Upload
                </button>
              </div>
            </div>
            
            <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
              {activeTab === 'manual' && (
                <div className="max-w-4xl mx-auto space-y-8">
                  {/* Personal Information Section */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 pb-2 border-b border-gray-100 dark:border-gray-800">
                      <User size={18} className="text-blue-600" />
                      <h3 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider">Personal Details</h3>
                    </div>
                    
                    <div className="grid grid-cols-12 gap-6">
                      {/* Profile Picture Upload */}
                      <div className="col-span-12 md:col-span-3 flex flex-col items-center gap-3">
                        <div className="w-32 h-32 rounded-2xl bg-gray-100 dark:bg-gray-800 border-2 border-dashed border-gray-300 dark:border-gray-700 flex flex-col items-center justify-center text-gray-400 hover:border-blue-500 hover:text-blue-500 transition-colors cursor-pointer relative overflow-hidden group">
                          {newApplicant.passport ? (
                            <img src={URL.createObjectURL(newApplicant.passport)} alt="Preview" className="w-full h-full object-cover" />
                          ) : (
                            <>
                              <User size={32} />
                              <span className="text-[10px] font-bold mt-2">Upload Photo</span>
                            </>
                          )}
                          <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" accept="image/*" onChange={(e) => setNewApplicant({...newApplicant, passport: e.target.files?.[0] || null})} />
                        </div>
                      </div>

                      <div className="col-span-12 md:col-span-9 grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="space-y-1.5">
                          <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase">First Name <span className="text-red-500">*</span></label>
                          <input type="text" className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none text-sm" placeholder="John" 
                            value={newApplicant.firstName} onChange={e => setNewApplicant({...newApplicant, firstName: e.target.value})} />
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase">Middle Name</label>
                          <input type="text" className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none text-sm" placeholder="Kwame"
                            value={newApplicant.middleName} onChange={e => setNewApplicant({...newApplicant, middleName: e.target.value})} />
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase">Last Name <span className="text-red-500">*</span></label>
                          <input type="text" className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none text-sm" placeholder="Doe"
                            value={newApplicant.lastName} onChange={e => setNewApplicant({...newApplicant, lastName: e.target.value})} />
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase">Gender</label>
                          <select className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none text-sm"
                            value={newApplicant.gender} onChange={e => setNewApplicant({...newApplicant, gender: e.target.value})}>
                            <option>Male</option>
                            <option>Female</option>
                          </select>
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase">Date of Birth</label>
                          <input type="date" className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none text-sm"
                            value={newApplicant.dob} onChange={e => setNewApplicant({...newApplicant, dob: e.target.value})} />
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase">NIN Number</label>
                          <input type="text" className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none text-sm" placeholder="12345678901"
                            value={newApplicant.nin} onChange={e => setNewApplicant({...newApplicant, nin: e.target.value})} />
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase">Email Address</label>
                        <input type="email" className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none text-sm" placeholder="student@example.com"
                          value={newApplicant.email} onChange={e => setNewApplicant({...newApplicant, email: e.target.value})} />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase">Mobile Number</label>
                        <input type="tel" className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none text-sm" placeholder="+234..."
                          value={newApplicant.phone} onChange={e => setNewApplicant({...newApplicant, phone: e.target.value})} />
                      </div>
                      <div className="col-span-2 space-y-1.5">
                        <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase">Residential Address</label>
                        <input type="text" className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none text-sm" placeholder="Full address..."
                          value={newApplicant.address} onChange={e => setNewApplicant({...newApplicant, address: e.target.value})} />
                      </div>
                    </div>
                  </div>

                  {/* Guardian Details */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 pb-2 border-b border-gray-100 dark:border-gray-800">
                      <Users size={18} className="text-orange-500" />
                      <h3 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider">Guardian Information</h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase">Guardian Name</label>
                        <input type="text" className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none text-sm"
                          value={newApplicant.guardianName} onChange={e => setNewApplicant({...newApplicant, guardianName: e.target.value})} />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase">Guardian Phone</label>
                        <input type="tel" className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none text-sm"
                          value={newApplicant.guardianPhone} onChange={e => setNewApplicant({...newApplicant, guardianPhone: e.target.value})} />
                      </div>
                      <div className="col-span-2 space-y-1.5">
                        <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase">Guardian Address</label>
                        <input type="text" className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none text-sm"
                          value={newApplicant.guardianAddress} onChange={e => setNewApplicant({...newApplicant, guardianAddress: e.target.value})} />
                      </div>
                    </div>
                  </div>

                  {/* Admission Details */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 pb-2 border-b border-gray-100 dark:border-gray-800">
                      <GraduationCap size={18} className="text-purple-600" />
                      <h3 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider">Admission Details</h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase">JAMB Reg No</label>
                        <input type="text" className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none text-sm font-mono"
                          value={newApplicant.jambNo} onChange={e => setNewApplicant({...newApplicant, jambNo: e.target.value})} />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase">UTME Score</label>
                        <input type="number" className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none text-sm"
                          value={newApplicant.score} onChange={e => setNewApplicant({...newApplicant, score: e.target.value})} />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase">Academic Session</label>
                        <select className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none text-sm"
                          value={newApplicant.session} onChange={e => setNewApplicant({...newApplicant, session: e.target.value})}>
                          <option>2024/2025</option>
                          <option>2025/2026</option>
                        </select>
                      </div>
                      
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase">Faculty</label>
                        <input type="text" className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none text-sm"
                          value={newApplicant.faculty} onChange={e => setNewApplicant({...newApplicant, faculty: e.target.value})} />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase">Department</label>
                        <input type="text" className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none text-sm"
                          value={newApplicant.department} onChange={e => setNewApplicant({...newApplicant, department: e.target.value})} />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase">Programme</label>
                        <select
                          className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none text-sm"
                          value={newApplicant.programme}
                          onChange={e => setNewApplicant({...newApplicant, programme: e.target.value})}
                        >
                          <option value="">Select Programme</option>
                          {mockProgrammes.map(prog => (
                            <option key={prog.id} value={prog.name}>{prog.name}</option>
                          ))}
                        </select>
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase">Entry Type</label>
                        <select className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none text-sm"
                          value={newApplicant.entryType} onChange={e => setNewApplicant({...newApplicant, entryType: e.target.value})}>
                          <option>UTME</option>
                          <option>Direct Entry</option>
                          <option>Transfer</option>
                          <option>Postgraduate</option>
                        </select>
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase">Date of Admission</label>
                        <input type="date" className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none text-sm"
                          value={newApplicant.admissionDate} onChange={e => setNewApplicant({...newApplicant, admissionDate: e.target.value})} />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase">Years of Program</label>
                        <input type="number" className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none text-sm"
                          value={newApplicant.programDuration} onChange={e => setNewApplicant({...newApplicant, programDuration: e.target.value})} />
                      </div>
                    </div>
                  </div>

                  {/* Document Uploads */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 pb-2 border-b border-gray-100 dark:border-gray-800">
                      <FileText size={18} className="text-green-600" />
                      <h3 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider">Required Documents</h3>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                      {['O-Level Result', 'Birth Certificate', 'Medical Report', 'JAMB Result', 'JAMB Slip'].map((doc) => (
                        <div key={doc} className="border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-xl p-4 flex flex-col items-center justify-center text-center hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/10 transition-colors cursor-pointer group">
                          <Upload size={24} className="text-gray-400 group-hover:text-blue-500 mb-2" />
                          <span className="text-xs font-bold text-gray-600 dark:text-gray-300">{doc}</span>
                          <span className="text-[10px] text-gray-400 mt-1">Click to upload</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Portal Access */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between pb-2 border-b border-gray-100 dark:border-gray-800">
                      <div className="flex items-center gap-2">
                        <Key size={18} className="text-yellow-600" />
                        <h3 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider">Portal Access</h3>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-500 dark:text-gray-400">Create login credentials now?</span>
                        <button
                          onClick={() => setNewApplicant(prev => ({ ...prev, createPortalAccess: !prev.createPortalAccess }))}
                          className={`w-10 h-5 rounded-full p-1 transition-colors ${newApplicant.createPortalAccess ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-700'}`}
                        >
                          <div className={`w-3 h-3 rounded-full bg-white shadow-sm transition-transform ${newApplicant.createPortalAccess ? 'translate-x-5' : 'translate-x-0'}`} />
                        </button>
                      </div>
                    </div>
                    
                    {newApplicant.createPortalAccess && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in slide-in-from-top-2 duration-200">
                        <div className="space-y-1.5">
                          <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase">Username</label>
                          <input type="text" className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none text-sm"
                            value={newApplicant.portalUsername} onChange={e => setNewApplicant({...newApplicant, portalUsername: e.target.value})} placeholder="e.g. johndoe" />
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase">Password</label>
                          <input type="password" className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none text-sm"
                            value={newApplicant.portalPassword} onChange={e => setNewApplicant({...newApplicant, portalPassword: e.target.value})} placeholder="••••••••" />
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="pt-8 flex justify-end gap-3">
                    <button 
                      onClick={() => setIsAddingNew(false)}
                      className="px-6 py-2.5 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors font-bold text-sm"
                    >
                      Cancel
                    </button>
                    <button 
                      onClick={handleCreateApplication}
                      className="px-6 py-2.5 bg-blue-600 text-white font-bold text-sm rounded-xl hover:bg-blue-700 transition-colors shadow-lg shadow-blue-600/20 flex items-center gap-2"
                    >
                      <Save size={18} />
                      Submit Application
                    </button>
                  </div>
                </div>
              )}

              {activeTab === 'online' && (
                <div className="max-w-2xl mx-auto text-center space-y-8 py-10">
                  <div className="w-24 h-24 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto text-blue-600 dark:text-blue-400">
                    <Globe size={48} />
                  </div>
                  <div>
                    <h3 className="text-2xl font-black text-gray-900 dark:text-white">Online Admission Form</h3>
                    <p className="text-gray-500 dark:text-gray-400 mt-2 max-w-md mx-auto">
                      Share this link with prospective students to allow them to fill out the admission form directly.
                    </p>
                  </div>
                  
                  <div className="flex items-center gap-2 p-2 bg-gray-100 dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 max-w-lg mx-auto">
                    <div className="p-2 bg-white dark:bg-gray-900 rounded-lg text-gray-400">
                      <LinkIcon size={16} />
                    </div>
                    <input 
                      type="text" 
                      value="https://portal.university.edu/apply/2024-session" 
                      readOnly 
                      className="flex-1 bg-transparent border-none outline-none text-sm text-gray-600 dark:text-gray-300 font-medium"
                    />
                    <button className="px-4 py-2 bg-blue-600 text-white text-xs font-bold rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2">
                      <Share2 size={14} /> Copy Link
                    </button>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 max-w-lg mx-auto">
                    <div className="text-left">
                      <h4 className="font-bold text-gray-900 dark:text-white text-sm">Allow Self-Registration</h4>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Students create their own portal account during application.</p>
                    </div>
                    <button
                      onClick={() => setOnlineFormSettings(prev => ({ ...prev, allowSelfRegistration: !prev.allowSelfRegistration }))}
                      className={`w-12 h-6 rounded-full p-1 transition-colors ${onlineFormSettings.allowSelfRegistration ? 'bg-green-500' : 'bg-gray-300 dark:bg-gray-700'}`}
                    >
                      <div className={`w-4 h-4 rounded-full bg-white shadow-sm transition-transform ${onlineFormSettings.allowSelfRegistration ? 'translate-x-6' : 'translate-x-0'}`} />
                    </button>
                  </div>

                  <div className="grid grid-cols-3 gap-4 max-w-lg mx-auto pt-6">
                    <div className="p-4 bg-gray-50 dark:bg-gray-900/50 rounded-xl border border-gray-200 dark:border-gray-800">
                      <div className="text-2xl font-black text-gray-900 dark:text-white">1,240</div>
                      <div className="text-xs text-gray-500 font-bold uppercase tracking-wider mt-1">Visits</div>
                    </div>
                    <div className="p-4 bg-gray-50 dark:bg-gray-900/50 rounded-xl border border-gray-200 dark:border-gray-800">
                      <div className="text-2xl font-black text-gray-900 dark:text-white">856</div>
                      <div className="text-xs text-gray-500 font-bold uppercase tracking-wider mt-1">Started</div>
                    </div>
                    <div className="p-4 bg-gray-50 dark:bg-gray-900/50 rounded-xl border border-gray-200 dark:border-gray-800">
                      <div className="text-2xl font-black text-green-600 dark:text-green-400">420</div>
                      <div className="text-xs text-gray-500 font-bold uppercase tracking-wider mt-1">Submitted</div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'bulk' && (
                <div className="max-w-2xl mx-auto text-center space-y-8 py-10">
                  <div className="w-24 h-24 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center mx-auto text-purple-600 dark:text-purple-400">
                    <Upload size={48} />
                  </div>
                  <div>
                    <h3 className="text-2xl font-black text-gray-900 dark:text-white">Bulk Upload Applicants</h3>
                    <p className="text-gray-500 dark:text-gray-400 mt-2 max-w-md mx-auto">
                      Upload a CSV or Excel file containing multiple applicant records to process them in bulk.
                    </p>
                  </div>

                  <div className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-2xl p-10 hover:border-purple-500 hover:bg-purple-50 dark:hover:bg-purple-900/10 transition-all cursor-pointer">
                    <div className="flex flex-col items-center gap-4">
                      <Upload size={32} className="text-gray-400" />
                      <div>
                        <p className="text-sm font-bold text-gray-700 dark:text-gray-300">Click to upload or drag and drop</p>
                        <p className="text-xs text-gray-500 mt-1">CSV, XLS, XLSX (Max 10MB)</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-center">
                    <button className="flex items-center gap-2 text-sm font-bold text-blue-600 hover:underline">
                      <Download size={16} /> Download Template
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : selectedApplicant ? (
          // Applicant Details
          <div className="flex flex-col h-full animate-in fade-in duration-300">
            {/* Header */}
            <div className="p-6 border-b border-gray-100 dark:border-gray-800 bg-gray-50/30 dark:bg-gray-900/10">
              <div className="flex items-center gap-2 mb-4">
                <button 
                  onClick={() => setSelectedApplicant(null)}
                  className="p-1.5 hover:bg-white dark:hover:bg-gray-800 rounded-lg transition-colors text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 border border-transparent hover:border-gray-200 dark:hover:border-gray-700 shadow-sm"
                >
                  <ArrowLeft size={18} />
                </button>
                <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Back to list</span>
              </div>
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-2xl font-bold shadow-lg shadow-blue-500/20">
                    {getInitials(selectedApplicant.name)}
                  </div>
                  <div>
                    <h2 className="text-2xl font-black text-gray-900 dark:text-white">{selectedApplicant.name}</h2>
                    <div className="flex items-center gap-3 mt-1 text-sm text-gray-500 dark:text-gray-400">
                      <span className="font-mono bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded text-xs font-bold">ID: {selectedApplicant.appNo}</span>
                      <span>•</span>
                      <span className="flex items-center gap-1"><Calendar size={12} /> Applied: {selectedApplicant.appliedDate || 'N/A'}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {getStatusBadge(selectedApplicant.status)}
                  <button className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                    <MoreVertical size={20} />
                  </button>
                </div>
              </div>
              
              <div className="flex gap-6 mt-6">
                <a href={`mailto:${selectedApplicant.email}`} className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  <Mail size={16} /> {selectedApplicant.email}
                </a>
                {selectedApplicant.phone && (
                  <a href={`tel:${selectedApplicant.phone}`} className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                    <Phone size={16} /> {selectedApplicant.phone}
                  </a>
                )}
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
              <div className="max-w-4xl mx-auto space-y-8">
                
                <div className={`p-5 rounded-2xl border shadow-sm flex flex-col md:flex-row items-center justify-between gap-4 ${
                  selectedApplicant.portalAccess?.isEnabled
                    ? 'bg-green-50 dark:bg-green-900/10 border-green-200 dark:border-green-900/30'
                    : 'bg-gray-50 dark:bg-gray-900/40 border-gray-200 dark:border-gray-800'
                }`}>
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                      selectedApplicant.portalAccess?.isEnabled
                        ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400'
                        : 'bg-gray-200 dark:bg-gray-800 text-gray-600 dark:text-gray-400'
                    }`}>
                      {selectedApplicant.portalAccess?.isEnabled ? <Key size={24} /> : <Lock size={20} />}
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 dark:text-white">
                        {selectedApplicant.portalAccess?.isEnabled ? 'Portal Access Created' : 'Portal Access Not Created'}
                      </h3>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        <span className="mr-3">ERP ID: <span className="font-mono font-bold text-gray-900 dark:text-white">{selectedApplicant.erpId || 'N/A'}</span></span>
                        <span>Username: <span className="font-mono font-bold text-gray-900 dark:text-white">{selectedApplicant.portalAccess?.username || 'N/A'}</span></span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 bg-white/70 dark:bg-gray-900/60 px-3 py-1.5 rounded-lg border border-gray-200 dark:border-gray-800">
                    <Lock size={14} />
                    <span>Password: <span className="font-mono">{selectedApplicant.portalAccess?.hasPassword ? 'Set' : 'Not set'}</span></span>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="p-5 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm">
                      <div className="flex items-center gap-2 mb-4">
                        <User size={18} className="text-blue-600" />
                        <h3 className="font-bold text-gray-900 dark:text-white">Personal & Contact</h3>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <div className="text-[11px] font-bold text-gray-500 uppercase">Gender</div>
                          <div className="text-sm font-medium text-gray-900 dark:text-white">{selectedApplicant.gender || 'N/A'}</div>
                        </div>
                        <div>
                          <div className="text-[11px] font-bold text-gray-500 uppercase">Date of Birth</div>
                          <div className="text-sm font-medium text-gray-900 dark:text-white">{selectedApplicant.dob || 'N/A'}</div>
                        </div>
                        <div>
                          <div className="text-[11px] font-bold text-gray-500 uppercase">NIN</div>
                          <div className="text-sm font-medium text-gray-900 dark:text-white font-mono">{selectedApplicant.nin || 'N/A'}</div>
                        </div>
                        <div>
                          <div className="text-[11px] font-bold text-gray-500 uppercase">Phone</div>
                          <div className="text-sm font-medium text-gray-900 dark:text-white">{selectedApplicant.phone || 'N/A'}</div>
                        </div>
                        <div className="col-span-2">
                          <div className="text-[11px] font-bold text-gray-500 uppercase">Email</div>
                          <div className="text-sm font-medium text-gray-900 dark:text-white">{selectedApplicant.email || 'N/A'}</div>
                        </div>
                        <div className="col-span-2">
                          <div className="text-[11px] font-bold text-gray-500 uppercase">Address</div>
                          <div className="text-sm font-medium text-gray-900 dark:text-white">{selectedApplicant.address || 'N/A'}</div>
                        </div>
                      </div>
                    </div>

                    <div className="p-5 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm">
                      <div className="flex items-center gap-2 mb-4">
                        <Users size={18} className="text-orange-500" />
                        <h3 className="font-bold text-gray-900 dark:text-white">Guardian</h3>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="col-span-2">
                          <div className="text-[11px] font-bold text-gray-500 uppercase">Name</div>
                          <div className="text-sm font-medium text-gray-900 dark:text-white">{selectedApplicant.guardianName || 'N/A'}</div>
                        </div>
                        <div>
                          <div className="text-[11px] font-bold text-gray-500 uppercase">Phone</div>
                          <div className="text-sm font-medium text-gray-900 dark:text-white">{selectedApplicant.guardianPhone || 'N/A'}</div>
                        </div>
                        <div>
                          <div className="text-[11px] font-bold text-gray-500 uppercase">Address</div>
                          <div className="text-sm font-medium text-gray-900 dark:text-white">{selectedApplicant.guardianAddress || 'N/A'}</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="p-5 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm">
                    <div className="flex items-center gap-2 mb-4">
                      <GraduationCap size={18} className="text-purple-600" />
                      <h3 className="font-bold text-gray-900 dark:text-white">Admission</h3>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="col-span-2">
                        <div className="text-[11px] font-bold text-gray-500 uppercase">Programme</div>
                        <div className="text-sm font-medium text-gray-900 dark:text-white">{selectedApplicant.programme || 'N/A'}</div>
                      </div>
                      <div>
                        <div className="text-[11px] font-bold text-gray-500 uppercase">Faculty</div>
                        <div className="text-sm font-medium text-gray-900 dark:text-white">{selectedApplicant.faculty || 'N/A'}</div>
                      </div>
                      <div>
                        <div className="text-[11px] font-bold text-gray-500 uppercase">Department</div>
                        <div className="text-sm font-medium text-gray-900 dark:text-white">{selectedApplicant.department || 'N/A'}</div>
                      </div>
                      <div>
                        <div className="text-[11px] font-bold text-gray-500 uppercase">Session</div>
                        <div className="text-sm font-medium text-gray-900 dark:text-white">{selectedApplicant.session || 'N/A'}</div>
                      </div>
                      <div>
                        <div className="text-[11px] font-bold text-gray-500 uppercase">Entry Type</div>
                        <div className="text-sm font-medium text-gray-900 dark:text-white">{selectedApplicant.entryType || 'N/A'}</div>
                      </div>
                      <div>
                        <div className="text-[11px] font-bold text-gray-500 uppercase">Admission Date</div>
                        <div className="text-sm font-medium text-gray-900 dark:text-white">{selectedApplicant.admissionDate || 'N/A'}</div>
                      </div>
                      <div>
                        <div className="text-[11px] font-bold text-gray-500 uppercase">Years</div>
                        <div className="text-sm font-medium text-gray-900 dark:text-white">{selectedApplicant.programDuration || 'N/A'}</div>
                      </div>
                      <div className="col-span-2">
                        <div className="text-[11px] font-bold text-gray-500 uppercase">JAMB Reg No</div>
                        <div className="text-sm font-medium text-gray-900 dark:text-white font-mono">{selectedApplicant.jambNo || 'N/A'}</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Score & Programme Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="p-5 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm relative overflow-hidden group hover:border-blue-200 dark:hover:border-blue-900/50 transition-all">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-blue-50 dark:bg-blue-900/10 rounded-full blur-2xl -mr-8 -mt-8"></div>
                    <div className="relative z-10">
                      <p className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">UTME Score</p>
                      <div className="flex items-baseline gap-2">
                        <span className="text-4xl font-black text-gray-900 dark:text-white">{selectedApplicant.score}</span>
                        <span className="text-sm font-medium text-gray-400">/ 400</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="col-span-2 p-5 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm relative overflow-hidden group hover:border-purple-200 dark:hover:border-purple-900/50 transition-all">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-purple-50 dark:bg-purple-900/10 rounded-full blur-2xl -mr-10 -mt-10"></div>
                    <div className="relative z-10">
                      <p className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">Applied Programme</p>
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                        <GraduationCap className="text-purple-500" size={24} />
                        {selectedApplicant.programme}
                      </h3>
                      <p className="text-sm text-gray-500 mt-2">{selectedApplicant.faculty ? `Faculty of ${selectedApplicant.faculty}` : 'Faculty: N/A'}{selectedApplicant.department ? ` • ${selectedApplicant.department}` : ''}</p>
                    </div>
                  </div>
                </div>

                {/* Cut-off Analysis */}
                <div className="bg-amber-50 dark:bg-amber-900/10 border border-amber-100 dark:border-amber-900/20 rounded-2xl p-6 flex items-start gap-4">
                  <div className="p-3 bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 rounded-xl shrink-0">
                    <AlertTriangle size={24} />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 dark:text-white mb-1">Eligibility Analysis</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                      The departmental cut-off mark for <span className="font-bold">{selectedApplicant.programme}</span> is <span className="font-bold">220</span>.
                      With a score of <span className={`font-bold ${selectedApplicant.score >= 220 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>{selectedApplicant.score}</span>, 
                      this applicant is {selectedApplicant.score >= 220 ? <span className="text-green-600 font-bold">ELIGIBLE</span> : <span className="text-red-600 font-bold">BELOW CUT-OFF</span>} for admission.
                    </p>
                  </div>
                </div>

                {/* Documents Placeholder */}
                <div>
                  <h3 className="font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                    <FileText size={18} className="text-gray-400" /> Submitted Documents
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {selectedDocuments.length > 0 ? (
                      selectedDocuments.map(doc => {
                        const file = doc.data?.file || null;
                        const fileName = doc.data?.fileName;
                        const isSubmitted = Boolean(fileName || file);
                        return (
                          <div key={doc.key} className={`p-4 rounded-xl border flex items-start justify-between gap-4 transition-colors ${
                            isSubmitted
                              ? 'border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-900/40'
                              : 'border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/50'
                          }`}>
                            <div className="flex items-start gap-3 min-w-0">
                              <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                                isSubmitted ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400' : 'bg-gray-100 dark:bg-gray-800 text-gray-400'
                              }`}>
                                <FileText size={18} />
                              </div>
                              <div className="min-w-0">
                                <div className="text-sm font-bold text-gray-900 dark:text-white">{doc.label}</div>
                                <div className="text-xs text-gray-500 dark:text-gray-400 truncate">{fileName || 'Not submitted'}</div>
                              </div>
                            </div>
                            <div className="shrink-0">
                              {file ? (
                                <button
                                  onClick={() => window.open(URL.createObjectURL(file), '_blank')}
                                  className="px-3 py-1.5 rounded-lg text-xs font-bold bg-blue-600 text-white hover:bg-blue-700 transition-colors"
                                >
                                  View
                                </button>
                              ) : (
                                <div className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider border ${
                                  isSubmitted
                                    ? 'bg-green-50 dark:bg-green-900/10 text-green-700 dark:text-green-400 border-green-200 dark:border-green-900/30'
                                    : 'bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 border-gray-200 dark:border-gray-700'
                                }`}>
                                  {isSubmitted ? 'Submitted' : 'Missing'}
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      })
                    ) : (
                      <div className="text-sm text-gray-500 dark:text-gray-400">No documents submitted yet.</div>
                    )}
                  </div>
                </div>

                {/* Decision Actions */}
                <div className="pt-8 border-t border-gray-100 dark:border-gray-800">
                  <h3 className="font-bold text-gray-900 dark:text-white mb-4">Admission Decision</h3>
                  <div className="grid grid-cols-3 gap-4 mb-6">
                    <button 
                      onClick={() => setShowConfirmModal({ show: true, action: 'admit' })}
                      disabled={selectedApplicant.status === 'Admitted'}
                      className="group relative flex flex-col items-center justify-center gap-3 p-6 rounded-2xl border-2 border-dashed border-green-200 dark:border-green-900/30 hover:border-green-500 dark:hover:border-green-500 hover:bg-green-50 dark:hover:bg-green-900/10 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <div className="p-3 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-full group-hover:scale-110 transition-transform">
                        <CheckCircle size={28} />
                      </div>
                      <div className="text-center">
                        <span className="block font-bold text-green-700 dark:text-green-400">Grant Admission</span>
                        <span className="text-xs text-green-600/70 dark:text-green-400/70">Send admission letter</span>
                      </div>
                    </button>
                    
                    <button 
                      onClick={() => setShowConfirmModal({ show: true, action: 'reject' })}
                      disabled={selectedApplicant.status === 'Rejected'}
                      className="group relative flex flex-col items-center justify-center gap-3 p-6 rounded-2xl border-2 border-dashed border-red-200 dark:border-red-900/30 hover:border-red-500 dark:hover:border-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <div className="p-3 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-full group-hover:scale-110 transition-transform">
                        <XCircle size={28} />
                      </div>
                      <div className="text-center">
                        <span className="block font-bold text-red-700 dark:text-red-400">Reject Application</span>
                        <span className="text-xs text-red-600/70 dark:text-red-400/70">Mark as unqualified</span>
                      </div>
                    </button>
                    
                    <button 
                      onClick={() => setShowConfirmModal({ show: true, action: 'hold' })}
                      className="group relative flex flex-col items-center justify-center gap-3 p-6 rounded-2xl border-2 border-dashed border-yellow-200 dark:border-yellow-900/30 hover:border-yellow-500 dark:hover:border-yellow-500 hover:bg-yellow-50 dark:hover:bg-yellow-900/10 transition-all"
                    >
                      <div className="p-3 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400 rounded-full group-hover:scale-110 transition-transform">
                        <Clock size={28} />
                      </div>
                      <div className="text-center">
                        <span className="block font-bold text-yellow-700 dark:text-yellow-400">Put on Hold</span>
                        <span className="text-xs text-yellow-600/70 dark:text-yellow-400/70">Review later</span>
                      </div>
                    </button>
                  </div>
                  
                  <div>
                    <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase mb-2">Internal Notes</label>
                    <textarea 
                      placeholder="Add optional notes explaining this decision..."
                      className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-sm focus:ring-2 focus:ring-blue-500/50 outline-none resize-none transition-all"
                      rows={3}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
            <div className="w-24 h-24 bg-gray-50 dark:bg-gray-900 rounded-full flex items-center justify-center mb-6">
              <User size={48} className="text-gray-300 dark:text-gray-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">No Applicant Selected</h3>
            <p className="text-gray-500 dark:text-gray-400 max-w-xs mx-auto mb-8">
              Select an applicant from the list to view their details, score analysis, and take admission actions.
            </p>
            <button 
              onClick={() => setIsAddingNew(true)}
              className="px-6 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-colors shadow-lg shadow-blue-600/20 flex items-center gap-2"
            >
              <Plus size={20} /> Create New Application
            </button>
          </div>
        )}
      </div>

      {/* Confirmation Modal */}
      {showConfirmModal.show && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
          <div className="bg-white dark:bg-[#151e32] rounded-2xl shadow-2xl max-w-md w-full p-6 border border-gray-100 dark:border-gray-800 transform transition-all scale-100">
            <div className="flex items-center gap-4 mb-4">
              <div className={`p-3 rounded-full ${
                showConfirmModal.action === 'admit' ? 'bg-green-100 text-green-600' : 
                showConfirmModal.action === 'reject' ? 'bg-red-100 text-red-600' : 'bg-yellow-100 text-yellow-600'
              }`}>
                {showConfirmModal.action === 'admit' ? <CheckCircle size={24} /> : 
                 showConfirmModal.action === 'reject' ? <XCircle size={24} /> : <Clock size={24} />}
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white capitalize">{showConfirmModal.action} Application</h3>
            </div>
            
            <p className="text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
              Are you sure you want to <span className="font-bold">{showConfirmModal.action}</span> the application for <span className="font-bold text-gray-900 dark:text-white">{selectedApplicant?.name}</span>? 
              {showConfirmModal.action === 'admit' && ' This will trigger an admission letter email.'}
              {showConfirmModal.action === 'reject' && ' This action cannot be easily undone.'}
            </p>
            
            <div className="flex gap-3">
              <button 
                onClick={() => setShowConfirmModal({ show: false, action: null })}
                className="flex-1 py-2.5 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl font-bold text-sm transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={() => handleDecision(showConfirmModal.action!)}
                className={`flex-1 py-2.5 text-white rounded-xl font-bold text-sm transition-colors shadow-lg ${
                  showConfirmModal.action === 'admit' ? 'bg-green-600 hover:bg-green-700 shadow-green-600/20' : 
                  showConfirmModal.action === 'reject' ? 'bg-red-600 hover:bg-red-700 shadow-red-600/20' : 'bg-yellow-600 hover:bg-yellow-700 shadow-yellow-600/20'
                }`}
              >
                Confirm Decision
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {toast && toast.show && (
        <div className={`fixed bottom-8 right-8 px-6 py-4 rounded-xl shadow-2xl text-white font-bold flex items-center gap-3 animate-in slide-in-from-bottom-10 fade-in duration-300 z-50 ${
          toast.type === 'success' ? 'bg-green-600' : 'bg-red-600'
        }`}>
          {toast.type === 'success' ? <CheckCircle size={20} /> : <AlertTriangle size={20} />}
          {toast.message}
        </div>
      )}
    </div>
  );
};

export default CreateAdmission;
