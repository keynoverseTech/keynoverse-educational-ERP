import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Save,
  User,
  Users,
  GraduationCap,
  FileText,
  Upload,
  Link as LinkIcon,
  Globe,
  Share2,
  Download,
  Key,
  CheckCircle,
  AlertTriangle,
} from 'lucide-react';
import { mockProgrammes } from '../../../data/mockData';

const CreateAdmission: React.FC = () => {
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<'manual' | 'online' | 'bulk'>('manual');
  const [toast, setToast] = useState<{ show: boolean; message: string; type: 'success' | 'error' } | null>(null);

  const [onlineFormSettings, setOnlineFormSettings] = useState({
    allowSelfRegistration: true,
  });

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
    oLevel: null as File | null,
    birthCert: null as File | null,
    medicalReport: null as File | null,
    jambResult: null as File | null,
    jambSlip: null as File | null,
    passport: null as File | null,
    createPortalAccess: false,
    portalUsername: '',
    portalPassword: '',
  });

  const handleCreateApplication = () => {
    if (!newApplicant.firstName || !newApplicant.jambNo || !newApplicant.score || !newApplicant.programme) {
      setToast({ show: true, message: 'Please fill in all required fields', type: 'error' });
      setTimeout(() => setToast(null), 3000);
      return;
    }

    setToast({ show: true, message: 'Application submitted successfully!', type: 'success' });
    setTimeout(() => setToast(null), 3000);
  };

  return (
    <div className="p-6 max-w-[1600px] mx-auto space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className="p-2 bg-white dark:bg-[#151e32] rounded-xl border border-gray-200 dark:border-gray-800 text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 transition-colors"
            title="Back"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Create Admission</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">Create new applicant records and share admission forms</p>
          </div>
        </div>

        <button
          onClick={() => navigate('/school-admin/admissions/applicants')}
          className="px-4 py-2.5 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors font-bold text-sm text-gray-700 dark:text-gray-200"
        >
          Applicants
        </button>
      </div>

      <div className="bg-white dark:bg-[#151e32] rounded-2xl shadow-sm border border-gray-200 dark:border-gray-800 overflow-hidden">
        <div className="p-6 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between bg-gray-50/50 dark:bg-gray-900/20">
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">New Application</h2>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Register new student applicant</p>
          </div>

          <div className="flex bg-gray-100 dark:bg-gray-800 p-1 rounded-xl">
            <button
              onClick={() => setActiveTab('manual')}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'manual'
                  ? 'bg-white dark:bg-[#151e32] text-blue-600 shadow-sm'
                  : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
            >
              Manual Entry
            </button>
            <button
              onClick={() => setActiveTab('online')}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'online'
                  ? 'bg-white dark:bg-[#151e32] text-blue-600 shadow-sm'
                  : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
            >
              Online Form
            </button>
            <button
              onClick={() => setActiveTab('bulk')}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'bulk'
                  ? 'bg-white dark:bg-[#151e32] text-blue-600 shadow-sm'
                  : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
            >
              Bulk Upload
            </button>
          </div>
        </div>

        <div className="p-8">
          {activeTab === 'manual' && (
            <div className="max-w-4xl mx-auto space-y-8">
              <div className="space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b border-gray-100 dark:border-gray-800">
                  <User size={18} className="text-blue-600" />
                  <h3 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider">Personal Details</h3>
                </div>

                <div className="grid grid-cols-12 gap-6">
                  <div className="col-span-12 md:col-span-3 flex flex-col items-center gap-3">
                    <div className="w-32 h-32 rounded-2xl bg-gray-100 dark:bg-gray-800 border-2 border-dashed border-gray-300 dark:border-gray-700 flex flex-col items-center justify-center text-gray-400 hover:border-blue-500 hover:text-blue-500 transition-colors cursor-pointer relative overflow-hidden group">
                      {newApplicant.passport ? (
                        <img
                          src={URL.createObjectURL(newApplicant.passport)}
                          alt="Preview"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <>
                          <User size={32} />
                          <span className="text-[10px] font-bold mt-2">Upload Photo</span>
                        </>
                      )}
                      <input
                        type="file"
                        className="absolute inset-0 opacity-0 cursor-pointer"
                        accept="image/*"
                        onChange={(e) => setNewApplicant({ ...newApplicant, passport: e.target.files?.[0] || null })}
                      />
                    </div>
                  </div>

                  <div className="col-span-12 md:col-span-9 grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase">
                        First Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none text-sm"
                        placeholder="John"
                        value={newApplicant.firstName}
                        onChange={(e) => setNewApplicant({ ...newApplicant, firstName: e.target.value })}
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase">Middle Name</label>
                      <input
                        type="text"
                        className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none text-sm"
                        placeholder="Kwame"
                        value={newApplicant.middleName}
                        onChange={(e) => setNewApplicant({ ...newApplicant, middleName: e.target.value })}
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase">
                        Last Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none text-sm"
                        placeholder="Doe"
                        value={newApplicant.lastName}
                        onChange={(e) => setNewApplicant({ ...newApplicant, lastName: e.target.value })}
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase">Gender</label>
                      <select
                        className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none text-sm"
                        value={newApplicant.gender}
                        onChange={(e) => setNewApplicant({ ...newApplicant, gender: e.target.value })}
                      >
                        <option>Male</option>
                        <option>Female</option>
                      </select>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase">Date of Birth</label>
                      <input
                        type="date"
                        className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none text-sm"
                        value={newApplicant.dob}
                        onChange={(e) => setNewApplicant({ ...newApplicant, dob: e.target.value })}
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase">NIN Number</label>
                      <input
                        type="text"
                        className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none text-sm"
                        placeholder="12345678901"
                        value={newApplicant.nin}
                        onChange={(e) => setNewApplicant({ ...newApplicant, nin: e.target.value })}
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase">Email Address</label>
                    <input
                      type="email"
                      className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none text-sm"
                      placeholder="student@example.com"
                      value={newApplicant.email}
                      onChange={(e) => setNewApplicant({ ...newApplicant, email: e.target.value })}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase">Mobile Number</label>
                    <input
                      type="tel"
                      className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none text-sm"
                      placeholder="+234..."
                      value={newApplicant.phone}
                      onChange={(e) => setNewApplicant({ ...newApplicant, phone: e.target.value })}
                    />
                  </div>
                  <div className="col-span-2 space-y-1.5">
                    <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase">Residential Address</label>
                    <input
                      type="text"
                      className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none text-sm"
                      placeholder="Full address..."
                      value={newApplicant.address}
                      onChange={(e) => setNewApplicant({ ...newApplicant, address: e.target.value })}
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b border-gray-100 dark:border-gray-800">
                  <Users size={18} className="text-orange-500" />
                  <h3 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider">Guardian Information</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase">Guardian Name</label>
                    <input
                      type="text"
                      className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none text-sm"
                      value={newApplicant.guardianName}
                      onChange={(e) => setNewApplicant({ ...newApplicant, guardianName: e.target.value })}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase">Guardian Phone</label>
                    <input
                      type="tel"
                      className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none text-sm"
                      value={newApplicant.guardianPhone}
                      onChange={(e) => setNewApplicant({ ...newApplicant, guardianPhone: e.target.value })}
                    />
                  </div>
                  <div className="col-span-2 space-y-1.5">
                    <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase">Guardian Address</label>
                    <input
                      type="text"
                      className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none text-sm"
                      value={newApplicant.guardianAddress}
                      onChange={(e) => setNewApplicant({ ...newApplicant, guardianAddress: e.target.value })}
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b border-gray-100 dark:border-gray-800">
                  <GraduationCap size={18} className="text-purple-600" />
                  <h3 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider">Admission Details</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase">JAMB Reg No</label>
                    <input
                      type="text"
                      className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none text-sm font-mono"
                      value={newApplicant.jambNo}
                      onChange={(e) => setNewApplicant({ ...newApplicant, jambNo: e.target.value })}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase">UTME Score</label>
                    <input
                      type="number"
                      className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none text-sm"
                      value={newApplicant.score}
                      onChange={(e) => setNewApplicant({ ...newApplicant, score: e.target.value })}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase">Academic Session</label>
                    <select
                      className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none text-sm"
                      value={newApplicant.session}
                      onChange={(e) => setNewApplicant({ ...newApplicant, session: e.target.value })}
                    >
                      <option>2024/2025</option>
                      <option>2025/2026</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase">Faculty</label>
                    <input
                      type="text"
                      className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none text-sm"
                      value={newApplicant.faculty}
                      onChange={(e) => setNewApplicant({ ...newApplicant, faculty: e.target.value })}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase">Department</label>
                    <input
                      type="text"
                      className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none text-sm"
                      value={newApplicant.department}
                      onChange={(e) => setNewApplicant({ ...newApplicant, department: e.target.value })}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase">
                      Programme <span className="text-red-500">*</span>
                    </label>
                    <select
                      className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none text-sm"
                      value={newApplicant.programme}
                      onChange={(e) => setNewApplicant({ ...newApplicant, programme: e.target.value })}
                    >
                      <option value="">Select Programme</option>
                      {mockProgrammes.map((prog) => (
                        <option key={prog.id} value={prog.name}>
                          {prog.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase">Entry Type</label>
                    <select
                      className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none text-sm"
                      value={newApplicant.entryType}
                      onChange={(e) => setNewApplicant({ ...newApplicant, entryType: e.target.value })}
                    >
                      <option>UTME</option>
                      <option>Direct Entry</option>
                      <option>Transfer</option>
                      <option>Postgraduate</option>
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase">Date of Admission</label>
                    <input
                      type="date"
                      className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none text-sm"
                      value={newApplicant.admissionDate}
                      onChange={(e) => setNewApplicant({ ...newApplicant, admissionDate: e.target.value })}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase">Years of Program</label>
                    <input
                      type="number"
                      className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none text-sm"
                      value={newApplicant.programDuration}
                      onChange={(e) => setNewApplicant({ ...newApplicant, programDuration: e.target.value })}
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b border-gray-100 dark:border-gray-800">
                  <FileText size={18} className="text-green-600" />
                  <h3 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider">Required Documents</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                  {['O-Level Result', 'Birth Certificate', 'Medical Report', 'JAMB Result', 'JAMB Slip'].map((doc) => (
                    <div
                      key={doc}
                      className="border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-xl p-4 flex flex-col items-center justify-center text-center hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/10 transition-colors"
                    >
                      <Upload size={24} className="text-gray-400 mb-2" />
                      <span className="text-xs font-bold text-gray-600 dark:text-gray-300">{doc}</span>
                      <span className="text-[10px] text-gray-400 mt-1">Upload later</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-gray-100 dark:border-gray-800">
                  <div className="flex items-center gap-2">
                    <Key size={18} className="text-yellow-600" />
                    <h3 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider">Portal Access</h3>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-500 dark:text-gray-400">Create login credentials now?</span>
                    <button
                      onClick={() => setNewApplicant((prev) => ({ ...prev, createPortalAccess: !prev.createPortalAccess }))}
                      className={`w-10 h-5 rounded-full p-1 transition-colors ${
                        newApplicant.createPortalAccess ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-700'
                      }`}
                    >
                      <div
                        className={`w-3 h-3 rounded-full bg-white shadow-sm transition-transform ${
                          newApplicant.createPortalAccess ? 'translate-x-5' : 'translate-x-0'
                        }`}
                      />
                    </button>
                  </div>
                </div>

                {newApplicant.createPortalAccess && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase">Username</label>
                      <input
                        type="text"
                        className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none text-sm"
                        value={newApplicant.portalUsername}
                        onChange={(e) => setNewApplicant({ ...newApplicant, portalUsername: e.target.value })}
                        placeholder="e.g. johndoe"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase">Password</label>
                      <input
                        type="password"
                        className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none text-sm"
                        value={newApplicant.portalPassword}
                        onChange={(e) => setNewApplicant({ ...newApplicant, portalPassword: e.target.value })}
                        placeholder="••••••••"
                      />
                    </div>
                  </div>
                )}
              </div>

              <div className="pt-8 flex justify-end gap-3">
                <button
                  onClick={() => navigate('/school-admin/admissions/applicants')}
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
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Students create their own portal account during application.
                  </p>
                </div>
                <button
                  onClick={() => setOnlineFormSettings((prev) => ({ ...prev, allowSelfRegistration: !prev.allowSelfRegistration }))}
                  className={`w-12 h-6 rounded-full p-1 transition-colors ${
                    onlineFormSettings.allowSelfRegistration ? 'bg-green-500' : 'bg-gray-300 dark:bg-gray-700'
                  }`}
                >
                  <div
                    className={`w-4 h-4 rounded-full bg-white shadow-sm transition-transform ${
                      onlineFormSettings.allowSelfRegistration ? 'translate-x-6' : 'translate-x-0'
                    }`}
                  />
                </button>
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

      {toast && toast.show && (
        <div
          className={`fixed bottom-8 right-8 px-6 py-4 rounded-xl shadow-2xl text-white font-bold flex items-center gap-3 animate-in slide-in-from-bottom-10 fade-in duration-300 z-50 ${
            toast.type === 'success' ? 'bg-green-600' : 'bg-red-600'
          }`}
        >
          {toast.type === 'success' ? <CheckCircle size={20} /> : <AlertTriangle size={20} />}
          {toast.message}
        </div>
      )}
    </div>
  );
};

export default CreateAdmission;

