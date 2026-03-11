import { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  FileText, 
  CreditCard, 
  Ticket,
  BookOpen,
  LogOut, 
  Menu, 
  X,
  Bell, 
  ShieldCheck,
  User,
  ChevronDown
} from 'lucide-react';
import nbteLogo from '../../assets/NBTE LOGO.png';

const PortalLayout = () => {
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const navItems = [
    { label: 'Dashboard', path: '/portal/dashboard', icon: LayoutDashboard },
    { label: 'Documents', path: '/portal/documents', icon: FileText },
    { label: 'Payments', path: '/portal/payments', icon: CreditCard },
    { label: 'Tickets', path: '/portal/tickets', icon: Ticket },
    { label: 'Manual', path: '/portal/manual', icon: BookOpen },
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-gray-950 flex flex-col">
      {/* Top Navigation Bar */}
      <nav className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-20">
            {/* Logo and Desktop Nav */}
            <div className="flex items-center gap-8">
              <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/portal/dashboard')}>
                <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center overflow-hidden">
                  <img src={nbteLogo} alt="NBTE" className="w-8 h-8 object-contain" />
                </div>
                <div className="hidden sm:block leading-tight">
                  <div className="text-sm font-black text-gray-900 dark:text-white">NBTE Portal</div>
                  <div className="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Institution Onboarding</div>
                </div>
              </div>

              {/* Desktop Navigation */}
              <div className="hidden md:flex items-center gap-1">
                {navItems.map((item) => (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    className={({ isActive }) => `
                      flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition-all
                      ${isActive 
                        ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400' 
                        : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white'}
                    `}
                  >
                    <item.icon size={18} />
                    {item.label}
                  </NavLink>
                ))}
              </div>
            </div>

            {/* Right side: Notifications and Profile */}
            <div className="flex items-center gap-3">
              <div className="hidden sm:flex items-center gap-3 px-3 py-1.5 rounded-xl bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-900/30">
                <ShieldCheck size={18} className="text-blue-600 dark:text-blue-400" />
                <span className="text-[10px] font-black text-blue-700 dark:text-blue-300 uppercase tracking-wider">Application Active</span>
              </div>

              <button className="p-2.5 rounded-xl bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:text-blue-600 transition-colors relative">
                <Bell size={20} />
                <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-gray-900" />
              </button>

              <div className="relative">
                <button 
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-all border border-transparent hover:border-gray-200 dark:hover:border-gray-700"
                >
                  <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 font-bold">
                    <User size={18} />
                  </div>
                  <ChevronDown size={16} className={`text-gray-400 transition-transform ${isProfileOpen ? 'rotate-180' : ''}`} />
                </button>

                {isProfileOpen && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setIsProfileOpen(false)}></div>
                    <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl shadow-xl z-20 overflow-hidden animate-fade-in-up">
                      <div className="p-4 border-b border-gray-100 dark:border-gray-800">
                        <div className="text-sm font-black text-gray-900 dark:text-white">Institution Admin</div>
                        <div className="text-[10px] text-gray-500 dark:text-gray-400 font-bold truncate">admin@portal.edu</div>
                      </div>
                      <div className="p-2">
                        <button
                          onClick={() => {
                            setIsProfileOpen(false);
                            navigate('/register');
                          }}
                          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-bold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                        >
                          <LogOut size={18} />
                          Logout
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>

              {/* Mobile menu button */}
              <div className="md:hidden flex items-center">
                <button
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  className="p-2.5 rounded-xl bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-400"
                >
                  {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800 animate-fade-in">
            <div className="px-4 pt-2 pb-6 space-y-1">
              {navItems.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={({ isActive }) => `
                    flex items-center gap-3 px-4 py-4 rounded-2xl text-base font-bold transition-all
                    ${isActive 
                      ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' 
                      : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800'}
                  `}
                >
                  <item.icon size={20} />
                  {item.label}
                </NavLink>
              ))}
              <div className="pt-4 mt-4 border-t border-gray-100 dark:border-gray-800">
                <div className="flex items-center gap-3 px-4 py-2 mb-4 bg-blue-50 dark:bg-blue-900/20 rounded-2xl">
                  <ShieldCheck size={20} className="text-blue-600 dark:text-blue-400" />
                  <span className="text-xs font-black text-blue-700 dark:text-blue-300 uppercase tracking-wider">Application Active</span>
                </div>
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    navigate('/register');
                  }}
                  className="w-full flex items-center gap-3 px-4 py-4 rounded-2xl text-base font-bold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                >
                  <LogOut size={20} />
                  Logout
                </button>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Page Content */}
      <main className="flex-1 overflow-y-auto p-6 lg:p-10">
        <div className="max-w-7xl mx-auto">
          <Outlet />
        </div>
      </main>
      
      {/* Simple Footer */}
      <footer className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 py-8 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-500 dark:text-gray-400 font-medium">
          <div className="flex items-center gap-2">
            <img src={nbteLogo} alt="NBTE" className="h-6 w-6 object-contain grayscale opacity-50" />
            <span>NBTE Education ERP Onboarding Portal</span>
          </div>
          <div>© {new Date().getFullYear()} Planets Tech Global. All rights reserved.</div>
        </div>
      </footer>
    </div>
  );
};

export default PortalLayout;
