import { useNavigate } from 'react-router-dom';
import { ArrowRight, ShieldCheck, Users, BookOpen, Wallet, MessageSquare, ClipboardCheck, CheckCircle2 } from 'lucide-react';
import nbteLogo from '../../assets/NBTE LOGO.png';
import fullLogo from '../../assets/Full logo.jfif';

const RegistrationPortal = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50 dark:from-gray-950 dark:via-gray-950 dark:to-gray-950">
      <div className="max-w-6xl mx-auto px-6">
        <header className="flex items-center justify-between py-6">
          <div className="flex items-center gap-3">
            <img src={nbteLogo} alt="NBTE" className="h-10 w-10 rounded-lg object-cover border border-gray-200 dark:border-gray-800 bg-white" />
            <div className="leading-tight">
              <div className="text-sm font-black text-gray-900 dark:text-white">NBTE Education ERP</div>
              <div className="text-xs text-gray-500 dark:text-gray-400">Institution Registration</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => navigate('/portal/login')}
              className="px-4 py-2 rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-sm font-bold text-gray-800 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            >
              Portal Login
            </button>
            <button
              onClick={() => navigate('/auth')}
              className="px-4 py-2 rounded-xl bg-blue-600 text-white text-sm font-bold hover:bg-blue-700 transition-colors shadow-lg shadow-blue-600/20"
            >
              ERP Login
            </button>
          </div>
        </header>

        <section className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center py-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/70 dark:bg-gray-900/60 border border-gray-200 dark:border-gray-800 text-xs font-bold text-gray-700 dark:text-gray-200">
              <ShieldCheck size={14} className="text-blue-600 dark:text-blue-400" />
              Secure onboarding for institutions
            </div>
            <h1 className="mt-4 text-4xl md:text-5xl font-black tracking-tight text-gray-900 dark:text-white">
              Run your institution on one powerful ERP
            </h1>
            <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">
              The NBTE Education ERP helps institutions manage academics, finance, HR, student services, library, communication, and reporting from one unified platform.
            </p>

            <div className="mt-8 flex flex-col sm:flex-row flex-wrap gap-3">
              <button
                onClick={() => navigate('/register/new')}
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold shadow-lg shadow-blue-600/20 transition-colors"
              >
                Start Registration
                <ArrowRight size={18} />
              </button>
              <button
                onClick={() => navigate('/portal/login')}
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl font-bold text-gray-800 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              >
                Login to Portal
              </button>
              <button
                onClick={() => navigate('/auth')}
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold shadow-lg shadow-emerald-600/20 transition-colors"
              >
                Direct ERP Access
              </button>
            </div>

            <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-4">
                <div className="text-xs font-bold text-gray-500 uppercase">Setup</div>
                <div className="mt-1 text-sm font-black text-gray-900 dark:text-white">Fast onboarding</div>
              </div>
              <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-4">
                <div className="text-xs font-bold text-gray-500 uppercase">Control</div>
                <div className="mt-1 text-sm font-black text-gray-900 dark:text-white">Role-based access</div>
              </div>
              <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-4">
                <div className="text-xs font-bold text-gray-500 uppercase">Insights</div>
                <div className="mt-1 text-sm font-black text-gray-900 dark:text-white">Real-time reports</div>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="absolute -inset-6 bg-gradient-to-tr from-blue-200/40 via-transparent to-emerald-200/40 dark:from-blue-500/10 dark:to-emerald-500/10 blur-2xl rounded-[3rem]" />
            <div className="relative bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-3xl shadow-sm overflow-hidden">
              <div className="p-6 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between">
                <div className="text-sm font-black text-gray-900 dark:text-white">ERP Overview</div>
                <div className="text-xs font-bold text-gray-500 dark:text-gray-400">Academics • Finance • HR</div>
              </div>
              <div className="p-6 grid grid-cols-2 gap-4">
                <div className="col-span-2 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-5 text-white">
                  <div className="text-xs font-bold opacity-90">Unified Dashboard</div>
                  <div className="text-lg font-black mt-1">Everything in one place</div>
                  <div className="text-xs opacity-90 mt-2">
                    Manage sessions, course registration, payroll, fees, hostel, transport, and communications.
                  </div>
                </div>
                <div className="bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-2xl p-5">
                  <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 font-black text-sm">
                    <BookOpen size={16} />
                    Academics
                  </div>
                  <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">Timetable, LMS, results, research.</div>
                </div>
                <div className="bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-2xl p-5">
                  <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-black text-sm">
                    <Wallet size={16} />
                    Finance
                  </div>
                  <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">Invoices, payments, receipts, budgets.</div>
                </div>
                <div className="bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-2xl p-5">
                  <div className="flex items-center gap-2 text-purple-600 dark:text-purple-400 font-black text-sm">
                    <Users size={16} />
                    HR
                  </div>
                  <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">Staff, payroll, ID cards, leave.</div>
                </div>
                <div className="bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-2xl p-5">
                  <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400 font-black text-sm">
                    <MessageSquare size={16} />
                    Communication
                  </div>
                  <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">Announcements, inbox, direct messages.</div>
                </div>
              </div>
              <div className="p-6 border-t border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-950">
                <div className="flex items-center gap-3">
                  <img src={fullLogo} alt="ERP" className="h-10 w-10 rounded-lg object-cover border border-gray-200 dark:border-gray-800 bg-white" />
                  <div className="text-sm text-gray-700 dark:text-gray-300">
                    Built for ND/HND institutions, optimized for performance, audit trails, and compliance workflows.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-6">
              <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-blue-600 dark:text-blue-400 mb-4">
                <ClipboardCheck size={22} />
              </div>
              <h3 className="text-lg font-black text-gray-900 dark:text-white">Simple registration</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                Submit institute details and accreditation documents for review in minutes.
              </p>
            </div>

            <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-6">
              <div className="w-12 h-12 rounded-xl bg-green-50 dark:bg-green-900/20 flex items-center justify-center text-green-600 dark:text-green-400 mb-4">
                <CheckCircle2 size={22} />
              </div>
              <h3 className="text-lg font-black text-gray-900 dark:text-white">Approval workflow</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                Our team verifies submitted details and grants access based on compliance checks.
              </p>
            </div>

            <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-6">
              <div className="w-12 h-12 rounded-xl bg-purple-50 dark:bg-purple-900/20 flex items-center justify-center text-purple-600 dark:text-purple-400 mb-4">
                <ShieldCheck size={22} />
              </div>
              <h3 className="text-lg font-black text-gray-900 dark:text-white">Secure access</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                Institution credentials are issued after approval, with role-based controls inside the ERP.
              </p>
            </div>
          </div>
        </section>

        <section className="pb-16">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-3xl p-8 md:p-10 text-white flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <h2 className="text-2xl md:text-3xl font-black">Ready to get started?</h2>
              <p className="mt-2 text-white/90">
                Register your institution, get approved, and start managing academics, finance, HR, and student services in one place.
              </p>
            </div>
            <button
              onClick={() => navigate('/register/new')}
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white text-blue-700 rounded-xl font-black hover:bg-blue-50 transition-colors"
            >
              Start Registration
              <ArrowRight size={18} />
            </button>
          </div>
        </section>

        <footer className="py-10 border-t border-gray-200 dark:border-gray-800 text-sm text-gray-500 dark:text-gray-400">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <img src={nbteLogo} alt="NBTE" className="h-7 w-7 rounded-md object-cover border border-gray-200 dark:border-gray-800 bg-white" />
              <span className="font-bold">NBTE Education ERP</span>
            </div>
            <div>© {new Date().getFullYear()} Planets Tech Global</div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default RegistrationPortal;
