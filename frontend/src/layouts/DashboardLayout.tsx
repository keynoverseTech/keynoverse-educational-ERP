import React, { type ReactNode, useState, useEffect } from 'react';
import { Menu, Bell, Search, ChevronDown, Moon, Sun } from 'lucide-react';
import Sidebar, { type SidebarItem } from '../components/Sidebar';

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
  sidebarTitle,
  sidebarLogo
}) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
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

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300" style={{ zoom: '90%' }}>
      <Sidebar 
        items={sidebarItems} 
        isOpen={isSidebarOpen} 
        onClose={() => setIsSidebarOpen(false)} 
        title={sidebarTitle}
        logo={sidebarLogo}
      />
      
      <div className="flex-1 transition-all duration-300 flex flex-col min-w-0">
        {/* Top Navigation Bar */}
        <header className="sticky top-0 z-10 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800 px-6 py-4 flex items-center justify-between transition-colors duration-300">
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

            <button className="relative p-2 text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800 rounded-lg transition-colors">
              <Bell size={20} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-gray-900"></span>
            </button>
            
            <div className="h-8 w-[1px] bg-gray-200 dark:bg-gray-700 mx-1"></div>
            
            <button className="flex items-center gap-3 pl-2 pr-1 py-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-colors">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-bold text-gray-900 dark:text-white leading-none">{role}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 font-medium mt-1">{roleSubtitle}</p>
              </div>
              <div className="w-9 h-9 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-sm shadow-sm shadow-blue-500/20">
                {userInitials}
              </div>
              <ChevronDown size={16} className="text-gray-400" />
            </button>
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
