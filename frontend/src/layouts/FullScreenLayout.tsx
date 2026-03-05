import React, { type ReactNode, useState, useEffect } from 'react';
import { Moon, Sun, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface FullScreenLayoutProps {
  children: ReactNode;
  title?: string;
  showBackButton?: boolean;
  backUrl?: string;
}

const FullScreenLayout: React.FC<FullScreenLayoutProps> = ({ 
  children, 
  title,
  showBackButton = true,
  backUrl = '/super-admin/dashboard'
}) => {
  const navigate = useNavigate();
  
  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('theme');
      return savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches);
    }
    return false;
  });

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

  const handleBack = () => {
    navigate(backUrl || '/super-admin/dashboard');
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <header className="sticky top-0 z-30 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-[1920px] mx-auto px-6 py-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            {showBackButton && (
              <button
                type="button"
                onClick={handleBack}
                className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-semibold text-gray-600 hover:text-gray-900 hover:bg-gray-100 dark:text-gray-300 dark:hover:text-white dark:hover:bg-gray-800 transition-colors"
              >
                <ArrowLeft size={18} />
                <span>Back</span>
              </button>
            )}
            {title && (
              <h1 className="text-lg font-bold text-gray-900 dark:text-white truncate">
                {title}
              </h1>
            )}
          </div>

          <button
            type="button"
            onClick={toggleTheme}
            className="p-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            aria-label="Toggle theme"
          >
            {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
          </button>
        </div>
      </header>

      <main className="p-6 max-w-[1920px] mx-auto animate-in fade-in duration-500">
        {children}
      </main>
    </div>
  );
};

export default FullScreenLayout;
