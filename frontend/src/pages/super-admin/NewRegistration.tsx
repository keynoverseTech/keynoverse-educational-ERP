import React, { useState } from 'react';
import { 
  Building2, 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Globe, 
  Upload, 
  Lock, 
  CheckCircle2, 
  XCircle,
  ChevronLeft,
  Save,
  AlertTriangle
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { RegistrationSuccess, RegistrationRejected } from '../../components/RegistrationStatus';

const NewRegistration: React.FC = () => {
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [status, setStatus] = useState<'idle' | 'success' | 'rejected'>('idle');
  const [isSimulatedRejection, setIsSimulatedRejection] = useState(false); // For demonstration
  
  // Password validation checks
  const passwordChecks = {
    length: password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
    number: /[0-9]/.test(password),
    special: /[!@#$%^&*(),.?":{}|<>]/.test(password),
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate API call
    console.log('Form submitted');
    
    // For demonstration: Toggle between success and rejection based on checkbox
    if (isSimulatedRejection) {
      setStatus('rejected');
    } else {
      setStatus('success');
    }
  };

  if (status === 'success') {
    return (
      <div className="max-w-5xl mx-auto py-12">
        <RegistrationSuccess 
          title="Institute Registered Successfully"
          message="The institute has been successfully onboarded and the admin account has been created. An email with credentials has been sent to the Director of ICT."
          actionLabel="View Institution Details"
          onAction={() => navigate('/super-admin/institutions/INST-2023-001')}
        />
      </div>
    );
  }

  if (status === 'rejected') {
    return (
      <div className="max-w-5xl mx-auto py-12">
        <RegistrationRejected 
          title="Registration Failed"
          message="We encountered an issue while processing the registration. This could be due to invalid documents or system maintenance."
          actionLabel="Review & Try Again"
          onAction={() => setStatus('idle')}
          secondaryAction={() => navigate('/super-admin/institutions')}
          secondaryLabel="Cancel Registration"
        />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Link 
          to="/super-admin/institutions"
          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors text-gray-500 dark:text-gray-400"
        >
          <ChevronLeft size={24} />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">Institute Onboarding Registration</h1>
          <p className="text-gray-600 dark:text-gray-400 font-medium mt-1">
            Apply to access the NBTE Education ERP
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
        <div className="p-8 space-y-8">
          {/* Section 1: Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700 dark:text-gray-300">Name of Institute</label>
              <div className="relative">
                <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input 
                  type="text" 
                  placeholder="e.g. Federal Polytechnic, Nekede"
                  className="w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-gray-900 dark:text-white"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700 dark:text-gray-300">Name of Director ICT</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input 
                  type="text" 
                  placeholder="Full Name"
                  className="w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-gray-900 dark:text-white"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700 dark:text-gray-300">Type of Institute</label>
              <select className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-gray-900 dark:text-white appearance-none">
                <option value="">Select type</option>
                <option value="university">University</option>
                <option value="polytechnic">Polytechnic</option>
                <option value="college">College of Education</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700 dark:text-gray-300">Email ID of Director ICT</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input 
                  type="email" 
                  placeholder="director.ict@example.com"
                  className="w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-gray-900 dark:text-white"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700 dark:text-gray-300">Number of registered students</label>
              <select className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-gray-900 dark:text-white appearance-none">
                <option value="">Select tier</option>
                <option value="tier1">0 - 1,000</option>
                <option value="tier2">1,001 - 5,000</option>
                <option value="tier3">5,001 - 10,000</option>
                <option value="tier4">10,000+</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700 dark:text-gray-300">Phone Number of Director ICT</label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input 
                  type="tel" 
                  placeholder="+234..."
                  className="w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-gray-900 dark:text-white"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700 dark:text-gray-300">Estimated Annual Subscription</label>
              <input 
                type="text" 
                placeholder="Select a student tier"
                readOnly
                className="w-full px-4 py-2.5 bg-blue-50/50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-900/30 rounded-xl text-blue-600 dark:text-blue-400 font-bold cursor-not-allowed"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700 dark:text-gray-300">Portal Admin Email ID</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input 
                  type="email" 
                  placeholder="admin@portal.edu.ng"
                  className="w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-gray-900 dark:text-white"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700 dark:text-gray-300">Name of Rector</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input 
                  type="text" 
                  placeholder="Full Name"
                  className="w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-gray-900 dark:text-white"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700 dark:text-gray-300">Portal Admin Password Desired</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-gray-900 dark:text-white"
                />
              </div>
              
              {/* Password Requirements */}
              <div className="mt-3 p-3 bg-gray-50 dark:bg-gray-900/50 rounded-xl border border-gray-100 dark:border-gray-700/50 text-xs space-y-1.5">
                <p className="font-medium text-gray-500 dark:text-gray-400 mb-2">Password must contain:</p>
                <div className={`flex items-center gap-2 ${passwordChecks.length ? 'text-emerald-600 dark:text-emerald-400' : 'text-gray-400'}`}>
                  {passwordChecks.length ? <CheckCircle2 size={12} /> : <XCircle size={12} />}
                  <span>Minimum 8 characters</span>
                </div>
                <div className={`flex items-center gap-2 ${passwordChecks.uppercase ? 'text-emerald-600 dark:text-emerald-400' : 'text-gray-400'}`}>
                  {passwordChecks.uppercase ? <CheckCircle2 size={12} /> : <XCircle size={12} />}
                  <span>At least one uppercase letter (A-Z)</span>
                </div>
                <div className={`flex items-center gap-2 ${passwordChecks.lowercase ? 'text-emerald-600 dark:text-emerald-400' : 'text-gray-400'}`}>
                  {passwordChecks.lowercase ? <CheckCircle2 size={12} /> : <XCircle size={12} />}
                  <span>At least one lowercase letter (a-z)</span>
                </div>
                <div className={`flex items-center gap-2 ${passwordChecks.number ? 'text-emerald-600 dark:text-emerald-400' : 'text-gray-400'}`}>
                  {passwordChecks.number ? <CheckCircle2 size={12} /> : <XCircle size={12} />}
                  <span>At least one number (0-9)</span>
                </div>
                <div className={`flex items-center gap-2 ${passwordChecks.special ? 'text-emerald-600 dark:text-emerald-400' : 'text-gray-400'}`}>
                  {passwordChecks.special ? <CheckCircle2 size={12} /> : <XCircle size={12} />}
                  <span>At least one special character</span>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700 dark:text-gray-300">Email ID of Rector</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input 
                  type="email" 
                  placeholder="rector@example.com"
                  className="w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-gray-900 dark:text-white"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700 dark:text-gray-300">Desired Custom Subdomain (optional)</label>
              <div className="relative">
                <Globe className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input 
                  type="text" 
                  placeholder="e.g. schoolname"
                  className="w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-gray-900 dark:text-white"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700 dark:text-gray-300">Phone Number of Rector</label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input 
                  type="tel" 
                  placeholder="+234..."
                  className="w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-gray-900 dark:text-white"
                />
              </div>
            </div>
          </div>

          {/* Full Width Fields */}
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700 dark:text-gray-300">Complete Address of the institute</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-3 text-gray-400" size={18} />
                <textarea 
                  rows={3}
                  placeholder="Enter full address"
                  className="w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-gray-900 dark:text-white resize-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700 dark:text-gray-300">State of establishment</label>
                <select className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-gray-900 dark:text-white appearance-none">
                  <option value="">Select State</option>
                  <option value="abuja">Abuja</option>
                  <option value="lagos">Lagos</option>
                  <option value="kano">Kano</option>
                  {/* Add more states as needed */}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700 dark:text-gray-300">Institute Website/URL (optional)</label>
                <div className="relative">
                  <Globe className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <input 
                    type="url" 
                    placeholder="https://"
                    className="w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-gray-900 dark:text-white"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700 dark:text-gray-300">Institute Logo <span className="text-red-500">*</span></label>
              <div className="flex items-center justify-center w-full">
                <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 dark:border-gray-700 border-dashed rounded-xl cursor-pointer bg-gray-50 dark:bg-gray-900/50 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <Upload className="w-8 h-8 mb-3 text-gray-400" />
                    <p className="mb-2 text-sm text-gray-500 dark:text-gray-400"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">JPG, PNG, GIF (MAX. 2MB)</p>
                  </div>
                  <input type="file" className="hidden" />
                </label>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700 dark:text-gray-300">NBTE Accreditation Approval Letter <span className="text-red-500">*</span></label>
              <div className="flex items-center justify-center w-full">
                <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 dark:border-gray-700 border-dashed rounded-xl cursor-pointer bg-gray-50 dark:bg-gray-900/50 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <Upload className="w-8 h-8 mb-3 text-gray-400" />
                    <p className="mb-2 text-sm text-gray-500 dark:text-gray-400"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">PDF, DOC, DOCX (Mandatory)</p>
                  </div>
                  <input type="file" className="hidden" />
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-6 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/30 flex justify-end gap-4">
          <div className="flex items-center gap-2 mr-auto">
            <input 
              type="checkbox" 
              id="simulate-rejection"
              checked={isSimulatedRejection}
              onChange={(e) => setIsSimulatedRejection(e.target.checked)}
              className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
            />
            <label htmlFor="simulate-rejection" className="text-sm text-gray-500 dark:text-gray-400 select-none cursor-pointer flex items-center gap-1">
              <AlertTriangle size={14} />
              Simulate Rejection (Dev)
            </label>
          </div>
          <button 
            type="button"
            onClick={() => navigate('/super-admin/institutions')}
            className="px-6 py-2.5 rounded-xl font-bold text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
          >
            Cancel
          </button>
          <button 
            type="submit"
            className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold transition-colors shadow-lg shadow-blue-600/20"
          >
            <Save size={18} />
            <span>Submit Registration</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default NewRegistration;
