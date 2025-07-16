'use client'

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect, useCallback } from 'react';
import { 
  HomeIcon, 
  UsersIcon, 
  UserCircleIcon, 
  DocumentTextIcon, 
  CogIcon,
  ArrowRightOnRectangleIcon,
  MagnifyingGlassIcon,
  BellIcon,
  UserGroupIcon,
  ChevronDownIcon,
  ChevronRightIcon,
  InformationCircleIcon,
  QuestionMarkCircleIcon
} from '@heroicons/react/24/outline';

interface AdminLayoutProps {
  children: React.ReactNode;
}

interface NavigationItem {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  subItems?: NavigationItem[];
}

const navigation: NavigationItem[] = [
  { name: 'Dashboard', href: '/admin', icon: HomeIcon },
  { name: 'Kelola User', href: '/admin/users', icon: UsersIcon },
  { name: 'Profil', href: '/admin/profile', icon: UserCircleIcon },
  { name: 'Kelola Survei', href: '/admin/surveys', icon: DocumentTextIcon },
  { name: 'Kelola Responden', href: '/admin/respondents', icon: UserGroupIcon },
  { name: 'Bank Soal', href: '/admin/question-bank', icon: QuestionMarkCircleIcon },
  { name: 'Data Referensi', href: '/admin/references', icon: CogIcon },
  { 
    name: 'Pengaturan', 
    href: '#', 
    icon: CogIcon,
    subItems: [
      { 
        name: 'Informasi Pasca Submit', 
        href: '/admin/settings/post-submit-info', 
        icon: InformationCircleIcon 
      }
    ]
  },
];

export default function AdminLayout({ children }: AdminLayoutProps) {
  const pathname = usePathname();
  const [expandedMenus, setExpandedMenus] = useState<string[]>([]);

  const toggleMenu = (itemName: string) => {
    setExpandedMenus(prev => 
      prev.includes(itemName) 
        ? prev.filter(name => name !== itemName)
        : [...prev, itemName]
    );
  };

  const isActive = useCallback((href: string) => {
    return pathname === href || (href !== '/admin' && pathname.startsWith(href));
  }, [pathname]);

  const hasActiveSubItem = useCallback((subItems: NavigationItem[]) => {
    return subItems.some(subItem => isActive(subItem.href));
  }, [isActive]);

  // Auto-expand menus with active sub-items
  useEffect(() => {
    navigation.forEach(item => {
      if (item.subItems && hasActiveSubItem(item.subItems)) {
        setExpandedMenus(prev => 
          prev.includes(item.name) ? prev : [...prev, item.name]
        );
      }
    });
  }, [pathname, hasActiveSubItem]);

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-blue-600 text-white flex flex-col">
        {/* Logo/Title */}
        <div className="p-6 border-b border-blue-500">
          <div className="flex items-center space-x-2">
            <DocumentTextIcon className="h-8 w-8" />
            <span className="text-xl font-bold">CWU Survey Admin</span>
          </div>
        </div>

        {/* User Info */}
        <div className="p-6 border-b border-blue-500">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
              <UserCircleIcon className="h-6 w-6" />
            </div>
            <div>
              <div className="font-medium">admin</div>
              <div className="text-sm text-blue-200">Superadmin</div>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-2">
          {navigation.map((item) => {
            const itemActive = isActive(item.href);
            const hasSubItems = item.subItems && item.subItems.length > 0;
            const isExpanded = expandedMenus.includes(item.name);
            const hasActiveChild = hasSubItems && item.subItems && hasActiveSubItem(item.subItems);
            
            return (
              <div key={item.name}>
                {/* Main navigation item */}
                <div className="flex items-center">
                  <Link
                    href={item.href}
                    className={`
                      flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors flex-1
                      ${itemActive || hasActiveChild
                        ? 'bg-blue-700 text-white' 
                        : 'text-blue-100 hover:bg-blue-500 hover:text-white'
                      }
                    `}
                  >
                    <item.icon className="h-5 w-5" />
                    <span>{item.name}</span>
                  </Link>
                  
                  {/* Expand/collapse button for items with sub-items */}
                  {hasSubItems && (
                    <button
                      onClick={() => toggleMenu(item.name)}
                      className="p-2 text-blue-100 hover:text-white hover:bg-blue-500 rounded-lg transition-colors ml-1"
                    >
                      {isExpanded ? (
                        <ChevronDownIcon className="h-4 w-4" />
                      ) : (
                        <ChevronRightIcon className="h-4 w-4" />
                      )}
                    </button>
                  )}
                </div>

                {/* Sub-navigation items */}
                {hasSubItems && isExpanded && item.subItems && (
                  <div className="ml-4 mt-2 space-y-1">
                    {item.subItems.map((subItem) => (
                      <Link
                        key={subItem.name}
                        href={subItem.href}
                        className={`
                          flex items-center space-x-3 px-4 py-2 rounded-lg transition-colors text-sm
                          ${isActive(subItem.href)
                            ? 'bg-blue-700 text-white' 
                            : 'text-blue-100 hover:bg-blue-500 hover:text-white'
                          }
                        `}
                      >
                        <subItem.icon className="h-4 w-4" />
                        <span>{subItem.name}</span>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        {/* Sign Out */}
        <div className="p-4 border-t border-blue-500">
          <button className="flex items-center space-x-3 px-4 py-3 w-full text-blue-100 hover:bg-blue-500 hover:text-white rounded-lg transition-colors">
            <ArrowRightOnRectangleIcon className="h-5 w-5" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Header */}
        <header className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search..."
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button className="text-gray-400 hover:text-gray-600">
                <span className="sr-only">Visit Site</span>
                Visit Site
              </button>
              <button className="text-gray-400 hover:text-gray-600">
                <BellIcon className="h-6 w-6" />
              </button>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
} 