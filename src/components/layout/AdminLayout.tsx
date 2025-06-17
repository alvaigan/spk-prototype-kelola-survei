'use client'

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  HomeIcon, 
  UsersIcon, 
  UserCircleIcon, 
  DocumentTextIcon, 
  CogIcon,
  ArrowRightOnRectangleIcon,
  MagnifyingGlassIcon,
  BellIcon
} from '@heroicons/react/24/outline';

interface AdminLayoutProps {
  children: React.ReactNode;
}

const navigation = [
  { name: 'Dashboard', href: '/admin', icon: HomeIcon },
  { name: 'Kelola User', href: '/admin/users', icon: UsersIcon },
  { name: 'Profil', href: '/admin/profile', icon: UserCircleIcon },
  { name: 'Kelola Survei', href: '/admin/surveys', icon: DocumentTextIcon },
  { name: 'Data Referensi', href: '/admin/references', icon: CogIcon },
];

export default function AdminLayout({ children }: AdminLayoutProps) {
  const pathname = usePathname();

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
            const isActive = pathname === item.href || 
              (item.href !== '/admin' && pathname.startsWith(item.href));
            
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`
                  flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors
                  ${isActive 
                    ? 'bg-blue-700 text-white' 
                    : 'text-blue-100 hover:bg-blue-500 hover:text-white'
                  }
                `}
              >
                <item.icon className="h-5 w-5" />
                <span>{item.name}</span>
              </Link>
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