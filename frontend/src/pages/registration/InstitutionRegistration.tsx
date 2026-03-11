import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Building2, Mail, Phone, MapPin, Globe, Upload, ArrowLeft, Eye, EyeOff, CheckCircle2, User } from 'lucide-react';
import { RegistrationRejected, RegistrationSuccess } from '../../components/RegistrationStatus';

type SubmissionStatus = 'idle' | 'review' | 'success' | 'rejected';

const InstitutionRegistration = () => {
  const navigate = useNavigate();

  const [status, setStatus] = useState<SubmissionStatus>('idle');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [applicationRef, setApplicationRef] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [simulateRejection, setSimulateRejection] = useState(false);

  const [form, setForm] = useState({
    instituteName: '',
    institutionType: '',
    headName: '',
    directorIctEmail: '',
    directorIctPhone: '',
    registeredStudentsTier: '',
    subscriptionPlan: '',
    portalAdminEmail: '',
    portalAdminPassword: '',
    rectorName: '',
    rectorEmail: '',
    rectorPhone: '',
    customSubdomain: '',
    address: '',
    state: '',
    website: '',
  });

  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [accreditationFile, setAccreditationFile] = useState<File | null>(null);

  const institutionTypes = [
    'Polytechnic',
    'Monotechnic',
    'College of Education',
    'Vocational Institute',
    'Innovation Enterprise Institution',
  ];

  const studentTiers = [
    { id: 'tier-1', label: '1 - 500' },
    { id: 'tier-2', label: '501 - 2,000' },
    { id: 'tier-3', label: '2,001 - 5,000' },
    { id: 'tier-4', label: '5,001 - 10,000' },
    { id: 'tier-5', label: '10,001+' },
  ];

  const subscriptionPlans = [
    { id: 'starter', label: 'Starter' },
    { id: 'standard', label: 'Standard' },
    { id: 'enterprise', label: 'Enterprise' },
  ];

  const states = [
    'Abia',
    'Adamawa',
    'Akwa Ibom',
    'Anambra',
    'Bauchi',
    'Bayelsa',
    'Benue',
    'Borno',
    'Cross River',
    'Delta',
    'Ebonyi',
    'Edo',
    'Ekiti',
    'Enugu',
    'FCT',
    'Gombe',
    'Imo',
    'Jigawa',
    'Kaduna',
    'Kano',
    'Katsina',
    'Kebbi',
    'Kogi',
    'Kwara',
    'Lagos',
    'Nasarawa',
    'Niger',
    'Ogun',
    'Ondo',
    'Osun',
    'Oyo',
    'Plateau',
    'Rivers',
    'Sokoto',
    'Taraba',
    'Yobe',
    'Zamfara',
  ];

  const passwordChecks = useMemo(() => {
    const password = form.portalAdminPassword;
    return {
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /[0-9]/.test(password),
      special: /[!@#$%^&*(),.?":{}|<>]/.test(password),
    };
  }, [form.portalAdminPassword]);

  const canSubmit = useMemo(() => {
    return (
      form.instituteName.trim().length > 1 &&
      form.address.trim().length > 3 &&
      form.institutionType.trim().length > 0 &&
      form.headName.trim().length > 1 &&
      form.directorIctEmail.trim().length > 3 &&
      form.directorIctPhone.trim().length > 3 &&
      form.registeredStudentsTier.trim().length > 0 &&
      form.subscriptionPlan.trim().length > 0 &&
      form.portalAdminEmail.trim().length > 3 &&
      form.portalAdminPassword.trim().length > 0 &&
      form.rectorEmail.trim().length > 3 &&
      form.rectorPhone.trim().length > 3 &&
      form.state.trim().length > 0 &&
      Boolean(logoFile) &&
      Boolean(accreditationFile) &&
      Object.values(passwordChecks).every(Boolean)
    );
  }, [form, logoFile, accreditationFile, passwordChecks]);

  const reset = () => {
    setStatus('idle');
    setIsLoading(false);
    setError('');
    setApplicationRef('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;

    setIsLoading(true);
    setError('');
    setStatus('review');

    await new Promise<void>((resolve) => window.setTimeout(() => resolve(), 1400));

    const ref = `REG-${new Date().getFullYear()}-${Math.floor(100000 + Math.random() * 900000)}`;
    setApplicationRef(ref);

    setIsLoading(false);
    if (simulateRejection) {
      setError('Submission was rejected (simulation). Please review and resubmit.');
      setStatus('rejected');
      return;
    }
    setStatus('success');
  };

  if (status === 'success') {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
        <div className="max-w-4xl mx-auto p-6">
          <RegistrationSuccess
            title="Registration Submitted"
            message={`Your registration has been submitted for review. Reference: ${applicationRef}. You will receive ERP credentials via the contact email once approved.`}
            onAction={() => navigate('/auth')}
            actionLabel="Go to Login"
          />
        </div>
      </div>
    );
  }

  if (status === 'rejected') {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
        <div className="max-w-4xl mx-auto p-6">
          <RegistrationRejected
            title="Submission Failed"
            message={error || 'We could not submit your registration. Please review the information and try again.'}
            onAction={() => reset()}
            actionLabel="Try Again"
            secondaryAction={() => navigate('/register')}
            secondaryLabel="Back"
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <div className="max-w-5xl mx-auto p-6">
        <button
          onClick={() => navigate('/register')}
          className="inline-flex items-center gap-2 text-sm font-bold text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
        >
          <ArrowLeft size={18} />
        </button>

        <div className="mt-4">
          <h1 className="text-2xl font-black text-gray-900 dark:text-white">Institute Onboarding Registration</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Apply to access the NBTE Education ERP</p>
        </div>

        <div className="mt-6 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm">
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Name of Institute</label>
                <div className="relative">
                  <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <input
                    value={form.instituteName}
                    onChange={(e) => setForm((p) => ({ ...p, instituteName: e.target.value }))}
                    className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g. Federal Polytechnic, Nekede"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Name of Rector / Head of Institution</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <input
                    value={form.headName}
                    onChange={(e) => setForm((p) => ({ ...p, headName: e.target.value }))}
                    className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Full Name"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Type of Institute</label>
                <select
                  value={form.institutionType}
                  onChange={(e) => setForm((p) => ({ ...p, institutionType: e.target.value }))}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Select type</option>
                  {institutionTypes.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Email ID of Rector</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <input
                    type="email"
                    value={form.directorIctEmail}
                    onChange={(e) => setForm((p) => ({ ...p, directorIctEmail: e.target.value }))}
                    className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="superadmin@planestech.com"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Number of registered students</label>
                <select
                  value={form.registeredStudentsTier}
                  onChange={(e) => setForm((p) => ({ ...p, registeredStudentsTier: e.target.value }))}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Select tier</option>
                  {studentTiers.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Phone Number of Director ICT</label>
                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <input
                    value={form.directorIctPhone}
                    onChange={(e) => setForm((p) => ({ ...p, directorIctPhone: e.target.value }))}
                    className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="+234..."
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Estimated Annual Subscription</label>
                <select
                  value={form.subscriptionPlan}
                  onChange={(e) => setForm((p) => ({ ...p, subscriptionPlan: e.target.value }))}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Select Plan</option>
                  {subscriptionPlans.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Portal Admin Email ID</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <input
                    type="email"
                    value={form.portalAdminEmail}
                    onChange={(e) => setForm((p) => ({ ...p, portalAdminEmail: e.target.value }))}
                    className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="admin@portal.edu.ng"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Name of Rector</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <input
                    value={form.rectorName}
                    onChange={(e) => setForm((p) => ({ ...p, rectorName: e.target.value }))}
                    className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Full Name"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Portal Admin Password Desired</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={form.portalAdminPassword}
                    onChange={(e) => setForm((p) => ({ ...p, portalAdminPassword: e.target.value }))}
                    className="w-full pl-4 pr-12 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="••••••••••••"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-lg text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                <div className="mt-3 p-3 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                  <div className="text-xs text-gray-500 dark:text-gray-400 mb-2">Password must contain:</div>
                  <div className="space-y-1 text-xs">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 size={14} className={passwordChecks.length ? 'text-green-600' : 'text-gray-300'} />
                      <span className={passwordChecks.length ? 'text-green-700 dark:text-green-300' : 'text-gray-500 dark:text-gray-400'}>
                        Minimum 8 characters
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 size={14} className={passwordChecks.uppercase ? 'text-green-600' : 'text-gray-300'} />
                      <span className={passwordChecks.uppercase ? 'text-green-700 dark:text-green-300' : 'text-gray-500 dark:text-gray-400'}>
                        At least one uppercase letter (A-Z)
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 size={14} className={passwordChecks.lowercase ? 'text-green-600' : 'text-gray-300'} />
                      <span className={passwordChecks.lowercase ? 'text-green-700 dark:text-green-300' : 'text-gray-500 dark:text-gray-400'}>
                        At least one lowercase letter (a-z)
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 size={14} className={passwordChecks.number ? 'text-green-600' : 'text-gray-300'} />
                      <span className={passwordChecks.number ? 'text-green-700 dark:text-green-300' : 'text-gray-500 dark:text-gray-400'}>
                        At least one number (0-9)
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 size={14} className={passwordChecks.special ? 'text-green-600' : 'text-gray-300'} />
                      <span className={passwordChecks.special ? 'text-green-700 dark:text-green-300' : 'text-gray-500 dark:text-gray-400'}>
                        At least one special character
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Email ID of Rector</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <input
                    type="email"
                    value={form.rectorEmail}
                    onChange={(e) => setForm((p) => ({ ...p, rectorEmail: e.target.value }))}
                    className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="rector@example.com"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Desired Custom Subdomain (optional)</label>
                <div className="relative">
                  <Globe className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <input
                    value={form.customSubdomain}
                    onChange={(e) => setForm((p) => ({ ...p, customSubdomain: e.target.value }))}
                    className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g. schoolname"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Phone Number of Rector</label>
                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <input
                    value={form.rectorPhone}
                    onChange={(e) => setForm((p) => ({ ...p, rectorPhone: e.target.value }))}
                    className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="+234..."
                    required
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Complete Address of the institute</label>
              <div className="relative">
                <MapPin className="absolute left-4 top-4 text-gray-400" size={18} />
                <textarea
                  value={form.address}
                  onChange={(e) => setForm((p) => ({ ...p, address: e.target.value }))}
                  className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  placeholder="Enter full address"
                  rows={3}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-2">State of establishment</label>
                <select
                  value={form.state}
                  onChange={(e) => setForm((p) => ({ ...p, state: e.target.value }))}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Select State</option>
                  {states.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Institute Website/URL (optional)</label>
                <div className="relative">
                  <Globe className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <input
                    value={form.website}
                    onChange={(e) => setForm((p) => ({ ...p, website: e.target.value }))}
                    className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="https://"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Institute Logo</label>
              <div className="border border-dashed border-gray-300 dark:border-gray-700 rounded-2xl bg-gray-50 dark:bg-gray-900/50 p-8 text-center">
                <div className="flex items-center justify-center">
                  <div className="w-10 h-10 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 flex items-center justify-center text-gray-600 dark:text-gray-200">
                    <Upload size={18} />
                  </div>
                </div>
                <div className="mt-3 text-sm font-bold text-gray-700 dark:text-gray-200">
                  {logoFile ? logoFile.name : 'Click to upload or drag and drop'}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">JPG, PNG, GIF (MAX. 2MB)</div>
                <input
                  type="file"
                  className="mt-4 w-full text-sm"
                  onChange={(e) => setLogoFile(e.target.files?.[0] ?? null)}
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-2">NBTE Accreditation Approval Letter</label>
              <div className="border border-dashed border-gray-300 dark:border-gray-700 rounded-2xl bg-gray-50 dark:bg-gray-900/50 p-8 text-center">
                <div className="flex items-center justify-center">
                  <div className="w-10 h-10 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 flex items-center justify-center text-gray-600 dark:text-gray-200">
                    <Upload size={18} />
                  </div>
                </div>
                <div className="mt-3 text-sm font-bold text-gray-700 dark:text-gray-200">
                  {accreditationFile ? accreditationFile.name : 'Click to upload or drag and drop'}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">PDF, DOC, DOCX (Mandatory)</div>
                <input
                  type="file"
                  className="mt-4 w-full text-sm"
                  onChange={(e) => setAccreditationFile(e.target.files?.[0] ?? null)}
                  required
                />
              </div>
            </div>

            <label className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
              <input
                type="checkbox"
                checked={simulateRejection}
                onChange={(e) => setSimulateRejection(e.target.checked)}
                className="h-4 w-4"
              />
              Simulate Rejection (Dev)
            </label>

            {error && (
              <div className="p-4 rounded-xl bg-red-50 text-red-700 border border-red-200 text-sm font-medium">
                {error}
              </div>
            )}

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
              <button
                type="button"
                onClick={() => navigate('/register')}
                className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-transparent border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 font-bold hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!canSubmit || isLoading}
                className={`inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-black transition-colors ${
                  !canSubmit || isLoading ? 'bg-gray-200 dark:bg-gray-700 text-gray-500 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-600/20'
                }`}
              >
                <Upload size={18} className={isLoading ? 'animate-spin' : ''} />
                {isLoading ? 'Submitting...' : 'Submit Registration'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default InstitutionRegistration;
