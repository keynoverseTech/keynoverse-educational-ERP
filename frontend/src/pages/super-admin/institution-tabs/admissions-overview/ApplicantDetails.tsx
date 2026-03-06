import React, { useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Calendar,
  FileText,
  GraduationCap,
  Key,
  Mail,
  MapPin,
  Phone,
  User,
} from 'lucide-react';
import type { AdmissionApplicant, AdmissionStatus } from './types';

const ApplicantDetails: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'profile' | 'admission' | 'documents' | 'portal'>('profile');

  const applicant: AdmissionApplicant =
    location.state?.applicant || {
      id: 'app-1',
      fullName: 'John Doe',
      applicationNo: '2024987654',
      email: 'john@example.com',
      phone: '+234 801 234 5678',
      address: '12 River Road, Lagos',
      programme: 'ND Computer Science',
      faculty: 'Science',
      department: 'Computer Science',
      session: '2024/2025',
      entryType: 'UTME',
      utmeScore: 245,
      status: 'Eligible',
      appliedDate: '2024-05-15',
      admissionDate: '2024-09-10',
      portalAccess: { isEnabled: false },
    };

  const getStatusColor = (status: AdmissionStatus) => {
    if (status === 'Admitted') return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400';
    if (status === 'Eligible') return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400';
    if (status === 'Pending') return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400';
    return 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400';
  };

  const initials = useMemo(() => {
    return applicant.fullName
      .split(' ')
      .filter(Boolean)
      .map(n => n[0])
      .join('')
      .substring(0, 2)
      .toUpperCase();
  }, [applicant.fullName]);

  const documents = useMemo(() => {
    const d = applicant.documents ?? {};
    return [
      { label: 'Passport Photo', fileName: d.passport?.fileName },
      { label: 'O-Level Result', fileName: d.oLevel?.fileName },
      { label: 'Birth Certificate', fileName: d.birthCert?.fileName },
      { label: 'Medical Report', fileName: d.medicalReport?.fileName },
      { label: 'JAMB Result', fileName: d.jambResult?.fileName },
      { label: 'JAMB Slip', fileName: d.jambSlip?.fileName },
    ].filter(x => Boolean(x.fileName));
  }, [applicant.documents]);

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center gap-3 mb-2">
        <button
          onClick={() => navigate(-1)}
          className="p-2 bg-white dark:bg-[#151e32] rounded-lg border border-gray-200 dark:border-gray-800 text-gray-500 hover:text-emerald-600 dark:text-gray-400 dark:hover:text-emerald-400 transition-colors"
        >
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Applicant Details</h1>
      </div>

      <div className="relative overflow-hidden bg-white dark:bg-gray-800 rounded-[2.5rem] p-8 shadow-xl shadow-gray-200/40 dark:shadow-none border border-gray-100 dark:border-gray-700">
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl -mr-20 -mt-20" />

        <div className="relative flex flex-col md:flex-row gap-8 items-start md:items-center">
          <div className="relative">
            <div className="w-32 h-32 rounded-[2rem] bg-gradient-to-br from-emerald-600 to-teal-600 flex items-center justify-center text-white text-4xl font-black shadow-2xl shadow-emerald-500/30">
              {initials}
            </div>
          </div>

          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-4 mb-3">
              <h2 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight">{applicant.fullName}</h2>
              <span className={`px-4 py-1.5 rounded-2xl text-[10px] font-black uppercase tracking-widest ${getStatusColor(applicant.status)} shadow-sm`}>
                {applicant.status}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl">
                  <GraduationCap size={16} className="text-emerald-600 dark:text-emerald-400" />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-none mb-1">Programme</p>
                  <p className="text-sm font-bold text-gray-700 dark:text-gray-200">{applicant.programme}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-teal-50 dark:bg-teal-900/20 rounded-xl">
                  <Calendar size={16} className="text-teal-600 dark:text-teal-400" />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-none mb-1">Session</p>
                  <p className="text-sm font-bold text-gray-700 dark:text-gray-200">{applicant.session}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
                  <User size={16} className="text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-none mb-1">Application No</p>
                  <p className="text-sm font-bold text-gray-700 dark:text-gray-200 font-mono">{applicant.applicationNo}</p>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-5 mt-6 text-sm text-gray-600 dark:text-gray-300">
              <a href={`mailto:${applicant.email}`} className="flex items-center gap-2 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
                <Mail size={16} /> {applicant.email}
              </a>
              {applicant.phone && (
                <a href={`tel:${applicant.phone}`} className="flex items-center gap-2 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
                  <Phone size={16} /> {applicant.phone}
                </a>
              )}
              {applicant.address && (
                <span className="flex items-center gap-2">
                  <MapPin size={16} /> {applicant.address}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="flex gap-2 border-b border-gray-200 dark:border-gray-700 overflow-x-auto no-scrollbar pb-1">
        {[
          { id: 'profile', label: 'Profile' },
          { id: 'admission', label: 'Admission' },
          { id: 'documents', label: 'Documents' },
          { id: 'portal', label: 'Portal Access' },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as typeof activeTab)}
            className={`px-6 py-3 rounded-t-2xl text-sm font-bold transition-all whitespace-nowrap ${
              activeTab === tab.id
                ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-300'
                : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'profile' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm p-6">
            <h3 className="font-bold text-gray-900 dark:text-white mb-4">Personal & Contact</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="p-4 rounded-xl bg-gray-50 dark:bg-gray-900/40 border border-gray-100 dark:border-gray-700">
                <div className="text-xs font-bold text-gray-400 uppercase">Full Name</div>
                <div className="mt-1 font-bold text-gray-900 dark:text-white">{applicant.fullName}</div>
              </div>
              <div className="p-4 rounded-xl bg-gray-50 dark:bg-gray-900/40 border border-gray-100 dark:border-gray-700">
                <div className="text-xs font-bold text-gray-400 uppercase">NIN</div>
                <div className="mt-1 font-mono font-bold text-gray-900 dark:text-white">{applicant.nin ?? 'N/A'}</div>
              </div>
              <div className="p-4 rounded-xl bg-gray-50 dark:bg-gray-900/40 border border-gray-100 dark:border-gray-700">
                <div className="text-xs font-bold text-gray-400 uppercase">Email</div>
                <div className="mt-1 font-bold text-gray-900 dark:text-white">{applicant.email}</div>
              </div>
              <div className="p-4 rounded-xl bg-gray-50 dark:bg-gray-900/40 border border-gray-100 dark:border-gray-700">
                <div className="text-xs font-bold text-gray-400 uppercase">Phone</div>
                <div className="mt-1 font-bold text-gray-900 dark:text-white">{applicant.phone ?? 'N/A'}</div>
              </div>
              <div className="md:col-span-2 p-4 rounded-xl bg-gray-50 dark:bg-gray-900/40 border border-gray-100 dark:border-gray-700">
                <div className="text-xs font-bold text-gray-400 uppercase">Address</div>
                <div className="mt-1 font-bold text-gray-900 dark:text-white">{applicant.address ?? 'N/A'}</div>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm p-6">
            <h3 className="font-bold text-gray-900 dark:text-white mb-4">Guardian</h3>
            <div className="space-y-3 text-sm">
              <div className="p-4 rounded-xl bg-gray-50 dark:bg-gray-900/40 border border-gray-100 dark:border-gray-700">
                <div className="text-xs font-bold text-gray-400 uppercase">Name</div>
                <div className="mt-1 font-bold text-gray-900 dark:text-white">{applicant.guardianName ?? 'N/A'}</div>
              </div>
              <div className="p-4 rounded-xl bg-gray-50 dark:bg-gray-900/40 border border-gray-100 dark:border-gray-700">
                <div className="text-xs font-bold text-gray-400 uppercase">Phone</div>
                <div className="mt-1 font-bold text-gray-900 dark:text-white">{applicant.guardianPhone ?? 'N/A'}</div>
              </div>
              <div className="p-4 rounded-xl bg-gray-50 dark:bg-gray-900/40 border border-gray-100 dark:border-gray-700">
                <div className="text-xs font-bold text-gray-400 uppercase">Address</div>
                <div className="mt-1 font-bold text-gray-900 dark:text-white">{applicant.guardianAddress ?? 'N/A'}</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'admission' && (
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm p-6">
          <h3 className="font-bold text-gray-900 dark:text-white mb-4">Admission Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="p-4 rounded-xl bg-gray-50 dark:bg-gray-900/40 border border-gray-100 dark:border-gray-700">
              <div className="text-xs font-bold text-gray-400 uppercase">Entry Type</div>
              <div className="mt-1 font-bold text-gray-900 dark:text-white">{applicant.entryType}</div>
            </div>
            <div className="p-4 rounded-xl bg-gray-50 dark:bg-gray-900/40 border border-gray-100 dark:border-gray-700">
              <div className="text-xs font-bold text-gray-400 uppercase">UTME Score</div>
              <div className="mt-1 font-bold text-gray-900 dark:text-white">{applicant.utmeScore ?? 'N/A'}</div>
            </div>
            <div className="p-4 rounded-xl bg-gray-50 dark:bg-gray-900/40 border border-gray-100 dark:border-gray-700">
              <div className="text-xs font-bold text-gray-400 uppercase">ERP ID</div>
              <div className="mt-1 font-mono font-bold text-gray-900 dark:text-white">{applicant.erpId ?? 'N/A'}</div>
            </div>
            <div className="p-4 rounded-xl bg-gray-50 dark:bg-gray-900/40 border border-gray-100 dark:border-gray-700">
              <div className="text-xs font-bold text-gray-400 uppercase">Faculty</div>
              <div className="mt-1 font-bold text-gray-900 dark:text-white">{applicant.faculty ?? 'N/A'}</div>
            </div>
            <div className="p-4 rounded-xl bg-gray-50 dark:bg-gray-900/40 border border-gray-100 dark:border-gray-700">
              <div className="text-xs font-bold text-gray-400 uppercase">Department</div>
              <div className="mt-1 font-bold text-gray-900 dark:text-white">{applicant.department ?? 'N/A'}</div>
            </div>
            <div className="p-4 rounded-xl bg-gray-50 dark:bg-gray-900/40 border border-gray-100 dark:border-gray-700">
              <div className="text-xs font-bold text-gray-400 uppercase">Programme</div>
              <div className="mt-1 font-bold text-gray-900 dark:text-white">{applicant.programme}</div>
            </div>
            <div className="p-4 rounded-xl bg-gray-50 dark:bg-gray-900/40 border border-gray-100 dark:border-gray-700">
              <div className="text-xs font-bold text-gray-400 uppercase">Applied Date</div>
              <div className="mt-1 font-bold text-gray-900 dark:text-white">{applicant.appliedDate ?? 'N/A'}</div>
            </div>
            <div className="p-4 rounded-xl bg-gray-50 dark:bg-gray-900/40 border border-gray-100 dark:border-gray-700">
              <div className="text-xs font-bold text-gray-400 uppercase">Admission Date</div>
              <div className="mt-1 font-bold text-gray-900 dark:text-white">{applicant.admissionDate ?? 'N/A'}</div>
            </div>
            <div className="p-4 rounded-xl bg-gray-50 dark:bg-gray-900/40 border border-gray-100 dark:border-gray-700">
              <div className="text-xs font-bold text-gray-400 uppercase">Session</div>
              <div className="mt-1 font-bold text-gray-900 dark:text-white">{applicant.session}</div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'documents' && (
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm p-6">
          <div className="flex items-center gap-2 mb-4">
            <FileText size={18} className="text-emerald-600 dark:text-emerald-400" />
            <h3 className="font-bold text-gray-900 dark:text-white">Documents</h3>
          </div>

          {documents.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {documents.map(doc => (
                <div key={doc.label} className="p-4 rounded-xl bg-gray-50 dark:bg-gray-900/40 border border-gray-100 dark:border-gray-700">
                  <div className="text-xs font-bold text-gray-400 uppercase">{doc.label}</div>
                  <div className="mt-1 font-bold text-gray-900 dark:text-white">{doc.fileName}</div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-10 rounded-2xl bg-gray-50 dark:bg-gray-900/40 border border-gray-100 dark:border-gray-700 text-center text-gray-500 dark:text-gray-400 font-medium">
              No documents uploaded
            </div>
          )}
        </div>
      )}

      {activeTab === 'portal' && (
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm p-6">
          <div className="flex items-center gap-2 mb-4">
            <Key size={18} className="text-emerald-600 dark:text-emerald-400" />
            <h3 className="font-bold text-gray-900 dark:text-white">Portal Access</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="p-4 rounded-xl bg-gray-50 dark:bg-gray-900/40 border border-gray-100 dark:border-gray-700">
              <div className="text-xs font-bold text-gray-400 uppercase">Enabled</div>
              <div className="mt-1 font-bold text-gray-900 dark:text-white">
                {applicant.portalAccess?.isEnabled ? 'Yes' : 'No'}
              </div>
            </div>
            <div className="p-4 rounded-xl bg-gray-50 dark:bg-gray-900/40 border border-gray-100 dark:border-gray-700">
              <div className="text-xs font-bold text-gray-400 uppercase">Username</div>
              <div className="mt-1 font-mono font-bold text-gray-900 dark:text-white">
                {applicant.portalAccess?.username ?? 'N/A'}
              </div>
            </div>
            <div className="p-4 rounded-xl bg-gray-50 dark:bg-gray-900/40 border border-gray-100 dark:border-gray-700">
              <div className="text-xs font-bold text-gray-400 uppercase">Password</div>
              <div className="mt-1 font-bold text-gray-900 dark:text-white">
                {applicant.portalAccess?.hasPassword ? 'Set' : 'Not set'}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ApplicantDetails;

