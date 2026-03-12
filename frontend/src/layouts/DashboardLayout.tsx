import React, { type ReactNode, useState, useEffect, useMemo, useRef } from 'react';
import { Menu, Bell, Search, ChevronDown, Moon, Sun, LogOut, User, Settings } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Sidebar, { type SidebarItem } from '../components/Sidebar';
import { useAuth } from '../state/authContext';
import { clearNotifications, getNotifications, markAllRead, markRead, type ResearchNotification } from '../utils/researchNotifications';

interface DashboardLayoutProps {
  children: ReactNode;
  sidebarItems: SidebarItem[];
  role?: string;
  roleSubtitle?: string;
  userInitials?: string;
  sidebarTitle?: string;
  sidebarLogo?: ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ 
  children, 
  sidebarItems,
  role = 'Administrator',
  roleSubtitle = 'Super Admin Access',
  userInitials = 'SA',
  sidebarTitle = 'Planets Tech Global',
  sidebarLogo
}) => {
  const navigate = useNavigate();
  const { logout, user } = useAuth();
  // Initialize sidebar as open on desktop (default)
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const notificationsRef = useRef<HTMLDivElement>(null);
  
  const [isDarkMode, setIsDarkMode] = useState(() => {
    // Check local storage or system preference
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('theme');
      return savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches);
    }
    return false;
  });

  // Apply theme class to html element
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);

  // Close profile dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
      if (notificationsRef.current && !notificationsRef.current.contains(event.target as Node)) {
        setIsNotificationsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const notificationsConfig = useMemo(() => {
    const roleKey = user?.role ?? (role.toLowerCase() === 'student' ? 'student' : role.toLowerCase() === 'staff' ? 'staff' : undefined);
    if (roleKey === 'student') {
      let recipientKey = user?.id || user?.email || userInitials;
      const proposalRaw = localStorage.getItem('student_research_topic_proposal');
      if (proposalRaw) {
        try {
          const parsed = JSON.parse(proposalRaw) as { student?: { matricNumber?: string } };
          if (parsed?.student?.matricNumber) recipientKey = parsed.student.matricNumber;
        } catch {
          return { storageKey: 'research_notifications_students', recipientKey };
        }
      }
      return { storageKey: 'research_notifications_students', recipientKey };
    }

    if (roleKey === 'staff') {
      const recipientKey = user?.name || 'Dr. Sarah';
      return { storageKey: 'research_notifications_staff', recipientKey };
    }

    return null;
  }, [role, user?.email, user?.id, user?.name, user?.role, userInitials]);

  const [notificationsTick, setNotificationsTick] = useState(0);

  useEffect(() => {
    const id = window.setInterval(() => setNotificationsTick((n) => n + 1), 1500);
    return () => window.clearInterval(id);
  }, []);

  const [notifications, setNotifications] = useState<ResearchNotification[]>([]);

  useEffect(() => {
    if (!notificationsConfig) {
      setNotifications([]);
      return;
    }
    setNotifications(getNotifications(notificationsConfig.storageKey, notificationsConfig.recipientKey));
  }, [notificationsConfig, notificationsTick]);

  const unreadCount = useMemo(() => notifications.filter((n) => !n.read).length, [notifications]);

  const goToRelevantNotificationsTarget = () => {
    if (notificationsConfig?.storageKey === 'research_notifications_students') navigate('/student/academics/research/defense');
    if (notificationsConfig?.storageKey === 'research_notifications_staff') navigate('/staff/academics/research/defense');
  };

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  const handleLogout = () => {
    // Capture the role before logging out
    const role = user?.role;
    logout();
    
    // Redirect based on the captured role
     if (role === 'super_admin') {
       navigate('/auth/super-admin');
     } else if (role === 'admin' || role === 'staff') {
       navigate('/auth/school-admin');
     } else if (role === 'student') {
       navigate('/auth/student');
     } else {
       navigate('/auth'); // Fallback to auth selection if role is unknown
     }
  };

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <Sidebar 
        items={sidebarItems} 
        isOpen={isSidebarOpen} 
        onClose={() => setIsSidebarOpen(false)} 
        title={sidebarTitle}
        logo={sidebarLogo}
      />
      
      <div className="flex-1 transition-all duration-300 flex flex-col min-w-0">
        {/* Top Navigation Bar */}
        <header className="sticky top-0 z-40 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800 px-6 py-4 flex items-center justify-between transition-colors duration-300">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800 rounded-lg transition-colors"
            >
              <Menu size={20} />
            </button>
            
            {/* Search Bar (Optional but good for header) */}
            <div className="hidden md:flex items-center gap-2 px-3 py-2 bg-gray-100 dark:bg-gray-800 rounded-lg w-64 transition-colors duration-300">
              <Search size={18} className="text-gray-400 dark:text-gray-500" />
              <input 
                type="text" 
                placeholder="Search..." 
                className="bg-transparent border-none focus:outline-none text-sm text-gray-700 dark:text-gray-200 placeholder-gray-500 dark:placeholder-gray-500 w-full"
              />
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <button 
              onClick={toggleTheme}
              className="p-2 text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800 rounded-lg transition-colors"
              title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
            >
              {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>

            <div className="relative" ref={notificationsRef}>
              <button
                onClick={() => setIsNotificationsOpen((v) => !v)}
                className="relative p-2 text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800 rounded-lg transition-colors"
                title="Notifications"
              >
                <Bell size={20} />
                {unreadCount > 0 && (
                  <>
                    <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-gray-900"></span>
                    <span className="absolute -top-1 -right-1 px-1.5 py-0.5 text-[10px] font-bold rounded-full bg-red-600 text-white border border-white dark:border-gray-900">
                      {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                  </>
                )}
              </button>

              {isNotificationsOpen && (
                <div className="absolute right-0 mt-2 w-96 bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 overflow-hidden animate-in fade-in slide-in-from-top-2 z-50">
                  <div className="p-4 border-b border-gray-100 dark:border-gray-700 flex items-start justify-between gap-3">
                    <div>
                      <p className="text-sm font-black text-gray-900 dark:text-white">Notifications</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{unreadCount ? `${unreadCount} unread` : 'All caught up'}</p>
                    </div>
                    {notificationsConfig && (
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => markAllRead(notificationsConfig.storageKey, notificationsConfig.recipientKey)}
                          className="text-xs font-bold text-blue-600 hover:text-blue-700"
                        >
                          Mark all read
                        </button>
                        <button
                          onClick={() => clearNotifications(notificationsConfig.storageKey, notificationsConfig.recipientKey)}
                          className="text-xs font-bold text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                        >
                          Clear
                        </button>
                      </div>
                    )}
                  </div>

                  <div className="max-h-[420px] overflow-y-auto divide-y divide-gray-100 dark:divide-gray-700">
                    {notifications.length === 0 ? (
                      <div className="p-8 text-center text-sm text-gray-500 dark:text-gray-400 font-bold">No notifications yet.</div>
                    ) : (
                      notifications.slice(0, 12).map((n) => (
                        <button
                          key={n.id}
                          onClick={() => {
                            if (notificationsConfig) markRead(notificationsConfig.storageKey, notificationsConfig.recipientKey, n.id);
                            goToRelevantNotificationsTarget();
                            setIsNotificationsOpen(false);
                          }}
                          className={`w-full text-left p-4 hover:bg-gray-50 dark:hover:bg-gray-900/40 transition-colors ${
                            n.read ? '' : 'bg-blue-50/60 dark:bg-blue-900/10'
                          }`}
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div className="min-w-0">
                              <div className="text-sm font-black text-gray-900 dark:text-white truncate">{n.title}</div>
                              <div className="text-sm text-gray-600 dark:text-gray-300 mt-1 line-clamp-2">{n.message}</div>
                              <div className="text-xs text-gray-400 mt-2">{new Date(n.createdAt).toLocaleString()}</div>
                            </div>
                            {!n.read && <span className="w-2 h-2 rounded-full bg-blue-600 mt-2 shrink-0" />}
                          </div>
                        </button>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>
            
            <div className="h-8 w-[1px] bg-gray-200 dark:bg-gray-700 mx-1"></div>
            
            <div className="relative" ref={profileRef}>
              <button 
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center gap-3 pl-2 pr-1 py-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-colors"
              >
                <div className="text-right hidden sm:block">
                  <p className="text-sm font-bold text-gray-900 dark:text-white leading-none">{role}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 font-medium mt-1">{roleSubtitle}</p>
                </div>
                <div className="w-9 h-9 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-sm shadow-sm shadow-blue-500/20">
                  {userInitials}
                </div>
                <ChevronDown size={16} className={`text-gray-400 transition-transform ${isProfileOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* Profile Dropdown */}
              {isProfileOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 overflow-hidden animate-in fade-in slide-in-from-top-2 z-50">
                  <div className="p-4 border-b border-gray-100 dark:border-gray-700">
                    <p className="text-sm font-bold text-gray-900 dark:text-white">{role}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{roleSubtitle}</p>
                  </div>
                  <div className="p-2">
                    <button className="w-full flex items-center gap-3 px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded-xl transition-colors">
                      <User size={16} />
                      My Profile
                    </button>
                    <button className="w-full flex items-center gap-3 px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded-xl transition-colors">
                      <Settings size={16} />
                      Account Settings
                    </button>
                  </div>
                  <div className="p-2 border-t border-gray-100 dark:border-gray-700">
                    <button 
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-3 py-2 text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-colors"
                    >
                      <LogOut size={16} />
                      Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-6 md:p-8 max-w-[1760px] mx-auto w-full flex-1">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
