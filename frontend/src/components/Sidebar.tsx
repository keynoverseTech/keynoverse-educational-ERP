import React, { useState } from 'react';
import { type LucideIcon, LogOut, Hexagon, ChevronDown, ChevronRight } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

export interface SidebarItem {
  name: string;
  path?: string;
  icon?: LucideIcon;
  subItems?: SidebarItem[];
}

interface SidebarProps {
  items: SidebarItem[];
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  logo?: React.ReactNode;
}

const SidebarMenuItem: React.FC<{
  item: SidebarItem;
  level?: number;
  openDropdowns: string[];
  onToggle: (name: string) => void;
  isPathActive: (path?: string) => boolean;
  isSubItemActive: (subItems?: SidebarItem[]) => boolean;
}> = ({ item, level = 0, openDropdowns, onToggle, isPathActive, isSubItemActive }) => {
  const isActive = isPathActive(item.path);
  const hasSubItems = item.subItems && item.subItems.length > 0;
  const isDropdownOpen = openDropdowns.includes(item.name);
  const isParentActive = isActive || isSubItemActive(item.subItems);
  
  // Padding based on nesting level
  const paddingLeft = level === 0 ? 'px-3' : level === 1 ? 'pl-9 pr-3' : 'pl-12 pr-3';

  if (hasSubItems) {
    return (
      <div className="space-y-1">
        <button
          onClick={() => onToggle(item.name)}
          className={`w-full flex items-center justify-between ${paddingLeft} py-2.5 rounded-lg transition-all duration-200 group ${
            isParentActive
              ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
              : 'text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white'
          }`}
        >
          <div className="flex items-center gap-2.5 overflow-hidden">
            {item.icon && (
              <item.icon size={18} className={`shrink-0 ${isParentActive ? 'text-blue-600 dark:text-blue-400' : 'text-gray-400 dark:text-gray-500 group-hover:text-gray-600 dark:group-hover:text-gray-300'}`} />
            )}
            {!item.icon && level > 0 && (
               <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${isParentActive ? 'bg-blue-600 dark:bg-blue-400' : 'bg-gray-300 dark:bg-gray-600'}`}></span>
            )}
            <span className={`font-medium whitespace-nowrap text-sm ${level > 0 ? 'text-xs' : ''}`}>{item.name}</span>
          </div>
          {isDropdownOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
        </button>
        
        {/* Dropdown Items */}
        {isDropdownOpen && (
          <div className="space-y-1 animate-in slide-in-from-top-2 duration-200">
            {item.subItems!.map((subItem) => (
              <SidebarMenuItem 
                key={subItem.path || subItem.name} 
                item={subItem} 
                level={level + 1}
                openDropdowns={openDropdowns}
                onToggle={onToggle}
                isPathActive={isPathActive}
                isSubItemActive={isSubItemActive}
              />
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <Link
      to={item.path!}
      className={`flex items-center gap-2.5 ${paddingLeft} py-2.5 rounded-lg transition-all duration-200 group ${
        isActive
          ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
          : 'text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white'
      }`}
    >
      {item.icon && (
        <item.icon size={18} className={`shrink-0 ${isActive ? 'text-blue-600 dark:text-blue-400' : 'text-gray-400 dark:text-gray-500 group-hover:text-gray-600 dark:group-hover:text-gray-300'}`} />
      )}
      {!item.icon && level > 0 && (
         <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${isActive ? 'bg-blue-600 dark:bg-blue-400' : 'bg-gray-300 dark:bg-gray-600'}`}></span>
      )}
      <span className={`font-medium whitespace-nowrap text-sm ${level > 0 ? 'text-xs' : ''}`}>{item.name}</span>
    </Link>
  );
};

const Sidebar: React.FC<SidebarProps> = ({ items, isOpen, onClose, title = "Keynoverse", logo }) => {
  const location = useLocation();
  const [openDropdowns, setOpenDropdowns] = useState<string[]>([]);

  // Helper to find all parent names for an active path
  const findActiveParents = (items: SidebarItem[], path: string): string[] => {
    for (const item of items) {
      if (item.subItems) {
        if (item.subItems.some(sub => sub.path === path || (sub.path && path.startsWith(sub.path + '/')))) {
          return [item.name];
        }
        // Recursive check
        const parents = findActiveParents(item.subItems, path);
        if (parents.length > 0) {
          return [item.name, ...parents];
        }
      }
    }
    return [];
  };

  // Auto-expand active menu on mount and route change
  React.useEffect(() => {
    const parents = findActiveParents(items, location.pathname);
    if (parents.length > 0) {
      setOpenDropdowns(prev => [...new Set([...prev, ...parents])]);
    }
  }, [location.pathname, items]);

  const toggleDropdown = (name: string) => {
    setOpenDropdowns(prev => 
      prev.includes(name) 
        ? prev.filter(n => n !== name) // Close
        : [...prev, name] // Open (allow multiple open)
    );
  };

  const isPathActive = (path?: string) => {
    if (!path) return false;
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  const isSubItemActive = (subItems?: SidebarItem[]): boolean => {
    if (!subItems) return false;
    return subItems.some(item => isPathActive(item.path) || isSubItemActive(item.subItems));
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
        ${isOpen ? 'translate-x-0 w-60' : '-translate-x-full lg:translate-x-0 lg:w-0 lg:overflow-hidden'}
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
          {items.map((item) => (
            <SidebarMenuItem 
              key={item.path || item.name} 
              item={item} 
              openDropdowns={openDropdowns}
              onToggle={toggleDropdown}
              isPathActive={isPathActive}
              isSubItemActive={isSubItemActive}
            />
          ))}
        </nav>
      </div>
    </>
  );
};

export default Sidebar;