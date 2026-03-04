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
    // Check if backUrl is provided, otherwise default logic
    if (backUrl) {
      navigate(backUrl);
    } else {
      // If we came from the dashboard, go back there
      navigate('/super-admin/dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      {/* Main Content */}
      <main className="p-6 max-w-[1920px] mx-auto animate-in fade-in duration-500">
        {children}
      </main>
    </div>
  );
};

export default FullScreenLayout;
