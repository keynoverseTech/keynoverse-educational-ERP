import React, { useMemo, useState } from 'react';
import { User, Mail, Shield, Save, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useStudentPortalFinance } from '../../../state/studentPortalFinanceContext';

type FormErrors = Partial<Record<'email' | 'phone' | 'currentPassword' | 'newPassword' | 'confirmPassword', string>>;

const ProfilePage: React.FC = () => {
  const { student } = useStudentPortalFinance();
  const [email, setEmail] = useState('samuel.john@student.edu');
  const [phone, setPhone] = useState('08000000000');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [errors, setErrors] = useState<FormErrors>({});

  const validate = useMemo(() => {
    const next: FormErrors = {};
    if (!email.trim() || !email.includes('@')) next.email = 'Enter a valid email address';
    if (!phone.trim() || phone.trim().length < 8) next.phone = 'Enter a valid phone number';

    if (newPassword || confirmPassword || currentPassword) {
      if (!currentPassword) next.currentPassword = 'Enter your current password';
      if (!newPassword || newPassword.length < 8) next.newPassword = 'Password must be at least 8 characters';
      if (confirmPassword !== newPassword) next.confirmPassword = 'Passwords do not match';
    }
    return next;
  }, [confirmPassword, currentPassword, email, newPassword, phone]);

  const handleSave = async () => {
    const nextErrors = validate;
    setErrors(nextErrors);
    setSuccess(null);
    if (Object.keys(nextErrors).length > 0) return;
    setSaving(true);
    try {
      await new Promise<void>((resolve) => setTimeout(resolve, 650));
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setSuccess('Profile updated successfully.');
    } catch (e) {
      setSuccess(null);
      setErrors((prev) => ({ ...prev, email: e instanceof Error ? e.message : 'Update failed' }));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-gray-900 dark:text-white flex items-center gap-3">
            <div className="p-2.5 bg-gray-900 dark:bg-gray-700 rounded-xl shadow-lg shadow-black/10">
              <User className="w-6 h-6 text-white" />
            </div>
            Profile
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-2">Manage your profile and security settings.</p>
        </div>
      </div>

      {success && (
        <div className="bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-100 dark:border-emerald-900/30 rounded-[2rem] p-6 flex items-start gap-3">
          <CheckCircle2 className="text-emerald-600 mt-0.5" size={20} />
          <div>
            <p className="text-sm font-black text-emerald-700 dark:text-emerald-300">Saved</p>
            <p className="text-xs text-emerald-700/80 dark:text-emerald-200/80 mt-1">{success}</p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="bg-white dark:bg-gray-800 rounded-[2.5rem] border border-gray-100 dark:border-gray-700 p-8 shadow-sm h-fit">
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">Student Info</p>
          <div className="space-y-4">
            <div>
              <p className="text-xs font-bold text-gray-500">Full Name</p>
              <p className="text-lg font-black text-gray-900 dark:text-white mt-1">{student.fullName}</p>
            </div>
            <div>
              <p className="text-xs font-bold text-gray-500">Student ID</p>
              <p className="text-sm font-black text-gray-900 dark:text-white mt-1 font-mono">{student.id}</p>
            </div>
            <div>
              <p className="text-xs font-bold text-gray-500">Programme</p>
              <p className="text-sm font-black text-gray-900 dark:text-white mt-1">{student.programme}</p>
            </div>
            <div>
              <p className="text-xs font-bold text-gray-500">Level</p>
              <p className="text-sm font-black text-gray-900 dark:text-white mt-1">{student.level}</p>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white dark:bg-gray-800 rounded-[2.5rem] border border-gray-100 dark:border-gray-700 p-8 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <Mail className="text-blue-600" size={20} />
              <h2 className="text-xl font-black text-gray-900 dark:text-white">Contact</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Email</label>
                <input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-900 border-none focus:ring-2 focus:ring-blue-500 outline-none font-bold text-gray-900 dark:text-white"
                />
                {errors.email && <p className="text-xs text-rose-600 mt-2 font-bold">{errors.email}</p>}
              </div>
              <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Phone</label>
                <input
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-900 border-none focus:ring-2 focus:ring-blue-500 outline-none font-bold text-gray-900 dark:text-white"
                />
                {errors.phone && <p className="text-xs text-rose-600 mt-2 font-bold">{errors.phone}</p>}
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-[2.5rem] border border-gray-100 dark:border-gray-700 p-8 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <Shield className="text-emerald-600" size={20} />
              <h2 className="text-xl font-black text-gray-900 dark:text-white">Security</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Current Password</label>
                <input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-900 border-none focus:ring-2 focus:ring-emerald-500 outline-none font-bold text-gray-900 dark:text-white"
                />
                {errors.currentPassword && <p className="text-xs text-rose-600 mt-2 font-bold">{errors.currentPassword}</p>}
              </div>
              <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">New Password</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-900 border-none focus:ring-2 focus:ring-emerald-500 outline-none font-bold text-gray-900 dark:text-white"
                />
                {errors.newPassword && <p className="text-xs text-rose-600 mt-2 font-bold">{errors.newPassword}</p>}
              </div>
              <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Confirm Password</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-900 border-none focus:ring-2 focus:ring-emerald-500 outline-none font-bold text-gray-900 dark:text-white"
                />
                {errors.confirmPassword && <p className="text-xs text-rose-600 mt-2 font-bold">{errors.confirmPassword}</p>}
              </div>
            </div>

            <div className="mt-6 p-6 rounded-3xl border border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50 flex items-start gap-3">
              <AlertCircle className="text-gray-500 mt-0.5" size={18} />
              <div>
                <p className="text-sm font-black text-gray-900 dark:text-white">Security tip</p>
                <p className="text-xs text-gray-500 mt-1">Use a unique password and do not share your login credentials.</p>
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              onClick={() => void handleSave()}
              disabled={saving}
              className="px-10 py-4 bg-blue-600 text-white rounded-2xl text-sm font-black hover:scale-[1.02] active:scale-95 transition-all shadow-xl shadow-blue-500/25 disabled:opacity-50 disabled:hover:scale-100 flex items-center gap-2"
            >
              <Save size={18} />
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;

