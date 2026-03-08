import React, { useMemo } from 'react';
import { Outlet } from 'react-router-dom';
import { LayoutDashboard, ClipboardCheck, Building2, BookOpen, DollarSign, FileText, Settings as SettingsIcon } from 'lucide-react';
import DashboardLayout from './DashboardLayout';
import { useAuth } from '../state/authContext';
import { hasPermission } from '../utils/permissionCheck';
import type { SidebarItem } from '../components/Sidebar';

// Extended SidebarItem with permission and role
interface ExtendedSidebarItem extends Omit<SidebarItem, 'subItems'> {
  permission?: string;
  role?: string;
  subItems?: ExtendedSidebarItem[];
}

const superAdminItems: ExtendedSidebarItem[] = [
  { name: 'Overview', path: '/super-admin/dashboard', icon: LayoutDashboard },
  { name: 'Registrations', path: '/super-admin/applications', icon: ClipboardCheck },
  { name: 'All Institutes', path: '/super-admin/institutions', icon: Building2 },
  { name: 'Program Governance', path: '/super-admin/academic-catalog', icon: BookOpen },
  { 
    name: 'Finance', 
    icon: DollarSign, 
    subItems: [
      { name: 'Dashboard', path: '/super-admin/finance/dashboard' },
      { name: 'Revenue', path: '/super-admin/finance/revenue' },
      { name: 'Subscription Plans', path: '/super-admin/finance/plans' }
    ]
  },
  { name: 'Reports', path: '/super-admin/reports', icon: FileText },
  { name: 'Configuration', path: '/super-admin/config', icon: SettingsIcon }
];

const SuperAdminLayout: React.FC = () => {
  const { user } = useAuth();

  const filteredItems = useMemo(() => {
    // If user is not logged in, return empty (or default items if appropriate)
    // However, DashboardLayout might handle empty items.
    // If we want to debug, we can log user here.
    if (!user) {
        console.log('SuperAdminLayout: No user found');
        return [];
    }
    console.log('SuperAdminLayout: User found', user.role);

    const filterRecursive = (items: ExtendedSidebarItem[]): SidebarItem[] => {
      return items.reduce<SidebarItem[]>((acc, item) => {
        // Role check
        if (item.role && user.role !== item.role) return acc;
        
        // Permission check
        if (item.permission) {
           const [module, action] = item.permission.split('.');
           const allowed = hasPermission(user.role, user.permissions, module, action);
           // Only filter out if NOT allowed. 
           // BUT for Super Admin, hasPermission always returns true if role matches.
           // However, if your role is somehow not matching perfectly in hasPermission, it might return false.
           
           // CRITICAL FIX: If we removed permissions from the items above, this block won't even run for them.
           // But if we want to enforce permissions only for SUB admins, we should handle that logic.
           
           if (!allowed) {
             return acc;
           }
        }

        // Sub-items check
        if (item.subItems) {
          const filteredSub = filterRecursive(item.subItems);
          if (filteredSub.length > 0) {
            acc.push({ ...item, subItems: filteredSub } as SidebarItem);
          }
        } else {
          acc.push(item as SidebarItem);
        }
        
        return acc;
      }, []);
    };

    return filterRecursive(superAdminItems);
  }, [user]);

  return (
    <DashboardLayout sidebarItems={filteredItems}>
      <Outlet />
    </DashboardLayout>
  );
};

export default SuperAdminLayout;
