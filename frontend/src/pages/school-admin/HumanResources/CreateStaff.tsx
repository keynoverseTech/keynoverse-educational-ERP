import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  UserPlus,
  User,
  Briefcase,
  Landmark,
  KeyRound,
  Upload,
  Eye,
  EyeOff,
  Copy,
  Check,
  RefreshCw,
  ChevronDown,
  ChevronUp,
  Camera,
  X,
  CheckCircle2,
} from 'lucide-react';
import { useHR } from '../../../state/hrAccessControl';
import type { Staff, Gender } from '../../../state/hrAccessControl';
import { useNavigate } from 'react-router-dom';

/* ──────────────────────── helpers ──────────────────────── */

const generatePassword = (len = 14): string => {
  const upper = 'ABCDEFGHJKLMNPQRSTUVWXYZ';
  const lower = 'abcdefghjkmnpqrstuvwxyz';
  const digits = '23456789';
  const symbols = '!@#$%&*';
  const all = upper + lower + digits + symbols;
  let pwd = [
    upper[Math.floor(Math.random() * upper.length)],
    lower[Math.floor(Math.random() * lower.length)],
    digits[Math.floor(Math.random() * digits.length)],
    symbols[Math.floor(Math.random() * symbols.length)],
  ];
  for (let i = pwd.length; i < len; i++) {
    pwd.push(all[Math.floor(Math.random() * all.length)]);
  }
  for (let i = pwd.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [pwd[i], pwd[j]] = [pwd[j], pwd[i]];
  }
  return pwd.join('');
};

const generateStaffId = (): string => {
  const year = new Date().getFullYear();
  const seq = String(Math.floor(Math.random() * 999) + 1).padStart(3, '0');
  return `STF/${year}/${seq}`;
};

/* ─────────────── shared classes ─────────────── */

const inputClass =
  'w-full px-3.5 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 transition-colors';

const labelClass =
  'block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5';

/* ════════════════════════════════════════════════════════════
   MAIN COMPONENT
   ════════════════════════════════════════════════════════════ */

const CreateStaff: React.FC = () => {
  const { departments, roles, designations, setStaff } = useHR();
  const navigate = useNavigate();

  // Section visibility — simple show/hide, no heavy transitions
  const [openSections, setOpenSections] = useState({
    personal: true,
    employment: true,
    bank: true,
    login: true,
  });

  const toggle = (key: keyof typeof openSections) =>
    setOpenSections(prev => ({ ...prev, [key]: !prev[key] }));

  /* ── Personal Details ── */
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [gender, setGender] = useState<Gender>('Male');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [mobile, setMobile] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [ninNumber, setNinNumber] = useState('');
  const [profilePreview, setProfilePreview] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  /* ── Employment Details ── */
  const [departmentId, setDepartmentId] = useState('');
  const [roleId, setRoleId] = useState('');
  const [designationId, setDesignationId] = useState('');
  const [joiningDate, setJoiningDate] = useState('');
  const [qualifications, setQualifications] = useState('');

  /* ── Bank Details ── */
  const [bankAccNo, setBankAccNo] = useState('');
  const [bankAccName, setBankAccName] = useState('');
  const [bankName, setBankName] = useState('');
  const [bankAddress, setBankAddress] = useState('');

  /* ── ERP Login ── */
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState(() => generatePassword());
  const [showPassword, setShowPassword] = useState(false);
  const [copied, setCopied] = useState(false);

  /* ── Success state ── */
  const [showSuccess, setShowSuccess] = useState(false);
  const [registeredName, setRegisteredName] = useState('');

  // Auto-fill login email from personal email
  useEffect(() => {
    setLoginEmail(email);
  }, [email]);

  /* ── Profile picture handling ── */
  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => setProfilePreview(reader.result as string);
    reader.readAsDataURL(file);
  };

  const removePhoto = () => {
    setProfilePreview(null);
    if (fileRef.current) fileRef.current.value = '';
  };

  /* ── Copy password ── */
  const copyPwd = useCallback(() => {
    navigator.clipboard.writeText(loginPassword);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [loginPassword]);

  /* ── Regenerate password ── */
  const regenPwd = () => setLoginPassword(generatePassword());

  /* ── Submit ── */
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!firstName.trim() || !lastName.trim() || !email.trim()) return;
    if (!departmentId || !roleId || !designationId || !joiningDate) return;

    const newStaff: Staff = {
      id: `staff_${Date.now()}`,
      staffId: generateStaffId(),
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email: email.trim(),
      phone: mobile.trim(),
      departmentId,
      designationId,
      roleId,
      status: 'active',
      dateEmployed: joiningDate,
      gender,
      dateOfBirth,
      address: address.trim(),
      ninNumber: ninNumber.trim(),
      profilePicture: profilePreview || undefined,
      qualifications: qualifications.trim(),
      bankAccountNumber: bankAccNo.trim(),
      bankAccountName: bankAccName.trim(),
      bankName: bankName.trim(),
      bankAddress: bankAddress.trim(),
      loginEmail: loginEmail.trim(),
      loginPassword,
    };

    setStaff(prev => [...prev, newStaff]);
    setRegisteredName(`${firstName.trim()} ${lastName.trim()}`);
    setShowSuccess(true);
  };

  /* ════════════════════  RENDER  ════════════════════ */

  // ── Success overlay ──
  if (showSuccess) {
    return (
      <div className="p-6 max-w-2xl mx-auto flex items-center justify-center min-h-[60vh]">
        <div className="w-full bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-10 text-center space-y-5">
          <div className="mx-auto w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
            <CheckCircle2 className="w-9 h-9 text-green-600 dark:text-green-400" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Staff Registered Successfully!
          </h2>
          <p className="text-gray-500 dark:text-gray-400">
            <span className="font-semibold text-gray-800 dark:text-gray-200">{registeredName}</span>{' '}
            has been added to the system. Login credentials have been configured.
          </p>
          <div className="flex items-center justify-center gap-3 pt-3">
            <button
              onClick={() => navigate('/school-admin/human-resources/dashboard')}
              className="px-5 py-2.5 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-sm font-semibold shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 hover:from-blue-700 hover:to-indigo-700 transition-all"
            >
              View Staff List
            </button>
            <button
              onClick={() => {
                setShowSuccess(false);
                setFirstName('');
                setLastName('');
                setGender('Male');
                setDateOfBirth('');
                setMobile('');
                setEmail('');
                setAddress('');
                setNinNumber('');
                setProfilePreview(null);
                setDepartmentId('');
                setRoleId('');
                setDesignationId('');
                setJoiningDate('');
                setQualifications('');
                setBankAccNo('');
                setBankAccName('');
                setBankName('');
                setBankAddress('');
                setLoginEmail('');
                setLoginPassword(generatePassword());
              }}
              className="px-5 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              Register Another
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── Section header builder ──
  const renderSectionHeader = (
    key: keyof typeof openSections,
    number: number,
    icon: React.ReactNode,
    title: string,
    subtitle: string,
    color: string
  ) => (
    <button
      type="button"
      onClick={() => toggle(key)}
      className="flex items-center justify-between w-full p-5 hover:bg-gray-50 dark:hover:bg-gray-700/40 transition-colors"
    >
      <div className="flex items-center gap-4">
        <div className={`flex items-center justify-center w-10 h-10 rounded-lg ${color} text-white text-sm font-bold shadow-sm`}>
          {number}
        </div>
        <div className="flex items-center gap-3">
          {icon}
          <div className="text-left">
            <h3 className="text-base font-semibold text-gray-900 dark:text-white">{title}</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{subtitle}</p>
          </div>
        </div>
      </div>
      <div className="text-gray-400 dark:text-gray-500">
        {openSections[key] ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
      </div>
    </button>
  );

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      {/* ── Page Header ── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
            <div className="p-2.5 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl shadow-lg shadow-blue-500/20">
              <UserPlus className="w-6 h-6 text-white" />
            </div>
            Add New Staff Member
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1.5 ml-14">
            Fill out the sections below to register a new staff member into the system.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* ═══════════════ 1. PERSONAL DETAILS ═══════════════ */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
          {renderSectionHeader('personal', 1, <User size={20} className="text-blue-600" />, 'Personal Details', 'Basic personal information', 'bg-blue-600')}
          {openSections.personal && (
            <div className="px-5 pb-6 pt-2 border-t border-gray-100 dark:border-gray-700 space-y-5">
              {/* Profile picture */}
              <div className="flex items-center gap-5">
                <div className="relative group">
                  <div className="w-24 h-24 rounded-full border-2 border-dashed border-gray-300 dark:border-gray-600 flex items-center justify-center overflow-hidden bg-gray-50 dark:bg-gray-900">
                    {profilePreview ? (
                      <img src={profilePreview} alt="Profile" className="w-full h-full object-cover" />
                    ) : (
                      <Camera size={28} className="text-gray-400 dark:text-gray-500" />
                    )}
                  </div>
                  {profilePreview && (
                    <button type="button" onClick={removePhoto} className="absolute -top-1 -right-1 p-1 bg-red-500 text-white rounded-full shadow-sm hover:bg-red-600">
                      <X size={12} />
                    </button>
                  )}
                </div>
                <div>
                  <button type="button" onClick={() => fileRef.current?.click()} className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                    <Upload size={16} />
                    Upload Photo
                  </button>
                  <p className="text-xs text-gray-400 dark:text-gray-500 mt-1.5">JPG, PNG or GIF · Max 2 MB</p>
                  <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />
                </div>
              </div>

              {/* Name */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>First Name <span className="text-red-500">*</span></label>
                  <input value={firstName} onChange={e => setFirstName(e.target.value)} className={inputClass} placeholder="e.g. Sarah" required />
                </div>
                <div>
                  <label className={labelClass}>Last Name <span className="text-red-500">*</span></label>
                  <input value={lastName} onChange={e => setLastName(e.target.value)} className={inputClass} placeholder="e.g. Connor" required />
                </div>
              </div>

              {/* Gender + DOB */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>Gender</label>
                  <select value={gender} onChange={e => setGender(e.target.value as Gender)} className={inputClass}>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label className={labelClass}>Date of Birth</label>
                  <input type="date" value={dateOfBirth} onChange={e => setDateOfBirth(e.target.value)} className={inputClass} />
                </div>
              </div>

              {/* Mobile + Email */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>Mobile Number</label>
                  <input value={mobile} onChange={e => setMobile(e.target.value)} className={inputClass} placeholder="+234 801 234 5678" />
                </div>
                <div>
                  <label className={labelClass}>Email Address <span className="text-red-500">*</span></label>
                  <input type="email" value={email} onChange={e => setEmail(e.target.value)} className={inputClass} placeholder="staff@university.edu" required />
                </div>
              </div>

              {/* Address */}
              <div>
                <label className={labelClass}>Home Address</label>
                <textarea value={address} onChange={e => setAddress(e.target.value)} rows={2} className={`${inputClass} resize-none`} placeholder="Enter full residential address" />
              </div>

              {/* NIN */}
              <div className="md:w-1/2">
                <label className={labelClass}>NIN Number</label>
                <input value={ninNumber} onChange={e => setNinNumber(e.target.value)} className={inputClass} placeholder="e.g. 12345678901" />
              </div>
            </div>
          )}
        </div>

        {/* ═══════════════ 2. EMPLOYMENT DETAILS ═══════════════ */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
          {renderSectionHeader('employment', 2, <Briefcase size={20} className="text-emerald-600" />, 'Employment Details', 'Department, role assignments and qualifications', 'bg-emerald-600')}
          {openSections.employment && (
            <div className="px-5 pb-6 pt-2 border-t border-gray-100 dark:border-gray-700 space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>Department <span className="text-red-500">*</span></label>
                  <select value={departmentId} onChange={e => setDepartmentId(e.target.value)} className={inputClass} required>
                    <option value="">Select department…</option>
                    {departments.map(d => (
                      <option key={d.id} value={d.id}>{d.name} ({d.type})</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className={labelClass}>Role <span className="text-red-500">*</span></label>
                  <select value={roleId} onChange={e => setRoleId(e.target.value)} className={inputClass} required>
                    <option value="">Select role…</option>
                    {roles.map(r => (
                      <option key={r.id} value={r.id}>{r.name}</option>
                    ))}
                  </select>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Determines system permissions</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>Designation <span className="text-red-500">*</span></label>
                  <select value={designationId} onChange={e => setDesignationId(e.target.value)} className={inputClass} required>
                    <option value="">Select designation…</option>
                    {designations.map(d => (
                      <option key={d.id} value={d.id}>{d.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className={labelClass}>Joining Date <span className="text-red-500">*</span></label>
                  <input type="date" value={joiningDate} onChange={e => setJoiningDate(e.target.value)} className={inputClass} required />
                </div>
              </div>

              <div>
                <label className={labelClass}>Qualifications</label>
                <input value={qualifications} onChange={e => setQualifications(e.target.value)} className={inputClass} placeholder="e.g. B.Sc Computer Science, M.Sc Data Science, PhD AI" />
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Separate multiple qualifications with commas</p>
              </div>
            </div>
          )}
        </div>

        {/* ═══════════════ 3. BANK DETAILS ═══════════════ */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
          {renderSectionHeader('bank', 3, <Landmark size={20} className="text-amber-600" />, 'Bank Details', 'Salary payment banking information', 'bg-amber-500')}
          {openSections.bank && (
            <div className="px-5 pb-6 pt-2 border-t border-gray-100 dark:border-gray-700 space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>Bank Account Number</label>
                  <input value={bankAccNo} onChange={e => setBankAccNo(e.target.value)} className={inputClass} placeholder="e.g. 0123456789" />
                </div>
                <div>
                  <label className={labelClass}>Account Name</label>
                  <input value={bankAccName} onChange={e => setBankAccName(e.target.value)} className={inputClass} placeholder="e.g. Sarah Connor" />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>Bank Name</label>
                  <input value={bankName} onChange={e => setBankName(e.target.value)} className={inputClass} placeholder="e.g. First Bank" />
                </div>
                <div>
                  <label className={labelClass}>Bank Branch / Address</label>
                  <input value={bankAddress} onChange={e => setBankAddress(e.target.value)} className={inputClass} placeholder="e.g. Victoria Island Branch, Lagos" />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ═══════════════ 4. ERP LOGIN DETAILS ═══════════════ */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
          {renderSectionHeader('login', 4, <KeyRound size={20} className="text-violet-600" />, 'ERP Login Details', 'Portal access credentials for the staff member', 'bg-violet-600')}
          {openSections.login && (
            <div className="px-5 pb-6 pt-2 border-t border-gray-100 dark:border-gray-700 space-y-5">
              <div className="p-4 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
                <p className="text-sm text-blue-700 dark:text-blue-300">
                  Login credentials are auto-generated from the information above. You can modify them if needed.
                </p>
              </div>

              <div>
                <label className={labelClass}>Login Email</label>
                <input type="email" value={loginEmail} onChange={e => setLoginEmail(e.target.value)} className={inputClass} placeholder="staff@university.edu" />
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Defaults to the personal email — change here if different login is needed</p>
              </div>

              <div>
                <label className={labelClass}>Login Password</label>
                <div className="flex items-center gap-2">
                  <div className="relative flex-1">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={loginPassword}
                      onChange={e => setLoginPassword(e.target.value)}
                      className={`${inputClass} pr-10 font-mono tracking-wider`}
                    />
                    <button type="button" onClick={() => setShowPassword(p => !p)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors">
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                  <button type="button" onClick={copyPwd} title="Copy password" className="inline-flex items-center justify-center w-10 h-10 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-500 hover:text-blue-600 hover:border-blue-400 dark:hover:text-blue-400 transition-colors">
                    {copied ? <Check size={16} className="text-green-500" /> : <Copy size={16} />}
                  </button>
                  <button type="button" onClick={regenPwd} title="Generate new password" className="inline-flex items-center justify-center w-10 h-10 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-500 hover:text-violet-600 hover:border-violet-400 dark:hover:text-violet-400 transition-colors">
                    <RefreshCw size={16} />
                  </button>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Auto-generated secure password · Click the refresh icon to regenerate</p>
              </div>
            </div>
          )}
        </div>

        {/* ═══════════════ FOOTER ACTIONS ═══════════════ */}
        <div className="flex items-center justify-between pt-2">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="px-5 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-sm font-semibold shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 hover:from-blue-700 hover:to-indigo-700 transition-all"
          >
            <UserPlus size={16} />
            Register Staff
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateStaff;
