import React, { useState } from 'react';
import { type LucideIcon, LogOut, Hexagon, ChevronDown, ChevronRight } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

export interface SidebarItem {
  name: string;
  path?: string;
  icon: LucideIcon;
  subItems?: {
    name: string;
    path: string;
  }[];
}

interface SidebarProps {
  items: SidebarItem[];
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  logo?: React.ReactNode;
}

const Sidebar: React.FC<SidebarProps> = ({ items, isOpen, onClose, title = "Keynoverse", logo }) => {
  const location = useLocation();
  const [openDropdowns, setOpenDropdowns] = useState<string[]>([]);

  // Auto-expand active menu on mount and route change
  React.useEffect(() => {
    const activeItem = items.find(item => 
      item.subItems?.some(sub => 
        location.pathname === sub.path || location.pathname.startsWith(sub.path + '/')
      )
    );
    if (activeItem) {
      setOpenDropdowns([activeItem.name]);
    }
  }, [location.pathname, items]);

  const toggleDropdown = (name: string) => {
    setOpenDropdowns(prev => 
      prev.includes(name) 
        ? [] // Close if already open (toggle behavior)
        : [name] // Open only this one (accordion behavior)
    );
  };

  const isPathActive = (path?: string) => {
    if (!path) return false;
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  const isSubItemActive = (subItems?: { path: string }[]) => {
    if (!subItems) return false;
    return subItems.some(item => isPathActive(item.path));
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/20 dark:bg-black/50 z-20 lg:hidden"
          onClick={onClose}
        />
      )}

      <div className={`
        bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 flex flex-col
        fixed top-0 left-0 h-[111.12vh] z-30 transition-all duration-300 ease-in-out
        lg:sticky lg:top-0 lg:h-[111.12vh]
        ${isOpen ? 'translate-x-0 w-64' : '-translate-x-full lg:translate-x-0 lg:w-0 lg:overflow-hidden'}
      `}>
        {/* Logo Section */}
        <div className="p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white">
                {logo || <Hexagon className="w-5 h-5 fill-current" />}
            </div>
            <h1 className="text-xl font-bold text-gray-900 dark:text-white tracking-tight">{title}</h1>
          </div>
          <button 
            onClick={onClose}
            className="lg:hidden p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-lg"
          >
            <LogOut size={20} className="rotate-180" />
          </button>
        </div>

        {/* Main Menu Label */}
        <div className="px-5 py-2">
          <p className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">Main Menu</p>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 space-y-1.5 overflow-y-auto mt-2 custom-scrollbar">
          {items.map((item) => {
            const isActive = isPathActive(item.path);
            const hasSubItems = item.subItems && item.subItems.length > 0;
            const isDropdownOpen = openDropdowns.includes(item.name);
            const isParentActive = isActive || isSubItemActive(item.subItems);

            if (hasSubItems) {
              return (
                <div key={item.name} className="space-y-1">
                  <button
                    onClick={() => toggleDropdown(item.name)}
                    className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-200 group ${
                      isParentActive
                        ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
                        : 'text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white'
                    }`}
                  >
                    <div className="flex items-center gap-3 overflow-hidden">
                      <item.icon size={20} className={`shrink-0 ${isParentActive ? 'text-blue-600 dark:text-blue-400' : 'text-gray-400 dark:text-gray-500 group-hover:text-gray-600 dark:group-hover:text-gray-300'}`} />
                      <span className="font-medium whitespace-nowrap">{item.name}</span>
                    </div>
                    {isDropdownOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                  </button>
                  
                  {/* Dropdown Items */}
                  {isDropdownOpen && (
                    <div className="pl-4 space-y-1 animate-in slide-in-from-top-2 duration-200">
                      {item.subItems!.map((subItem) => {
                        const isSubActive = isPathActive(subItem.path);
                        return (
                          <Link
                            key={subItem.path}
                            to={subItem.path}
                            className={`flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all duration-200 text-sm ${
                              isSubActive
                                ? 'bg-blue-50/50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 font-semibold'
                                : 'text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700/50 hover:text-gray-900 dark:hover:text-white'
                            }`}
                          >
                            <span className={`w-1.5 h-1.5 rounded-full ${isSubActive ? 'bg-blue-600 dark:bg-blue-400' : 'bg-gray-300 dark:bg-gray-600'}`}></span>
                            <span>{subItem.name}</span>
                          </Link>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            }

            return (
              <Link
                key={item.path || item.name}
                to={item.path!}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
                  isActive
                    ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
                    : 'text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                <item.icon size={20} className={`shrink-0 ${isActive ? 'text-blue-600 dark:text-blue-400' : 'text-gray-400 dark:text-gray-500 group-hover:text-gray-600 dark:group-hover:text-gray-300'}`} />
                <span className="font-medium whitespace-nowrap">{item.name}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </>
  );
};

export default Sidebar;