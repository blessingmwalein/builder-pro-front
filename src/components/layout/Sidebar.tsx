'use client';

import React from 'react';
import { usePathname, useRouter } from 'next/navigation';
import clsx from 'clsx';
import {
  HomeIcon,
  FolderIcon,
  CheckIcon,
  CurrencyDollarIcon,
  ClipboardDocumentListIcon,
  CameraIcon,
  ChatBubbleLeftRightIcon,
  BellIcon,
  ChartBarIcon,
  UsersIcon,
  Cog6ToothIcon,
  BuildingOfficeIcon,
} from '@heroicons/react/24/outline';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: HomeIcon },
  { name: 'Projects', href: '/projects', icon: FolderIcon },
  { name: 'Tasks', href: '/tasks', icon: CheckIcon },
  // { name: 'Companies', href: '/companies', icon: CheckIcon },

  // { name: 'Budget', href: '/budget', icon: CurrencyDollarIcon },
  // { name: 'Expenses', href: '/expenses', icon: CurrencyDollarIcon },
  // { name: 'Inspections', href: '/inspections', icon: ClipboardDocumentListIcon },
  // { name: 'Daily Logs', href: '/daily-logs', icon: ClipboardDocumentListIcon },
  // { name: 'Site Photos', href: '/photos', icon: CameraIcon },
  // { name: 'Team Chat', href: '/chat', icon: ChatBubbleLeftRightIcon },
  // { name: 'Analytics', href: '/analytics', icon: ChartBarIcon },
];

const secondaryNavigation = [
  { name: 'Team', href: '/team', icon: UsersIcon },
  { name: 'Company', href: '/company', icon: BuildingOfficeIcon },
  { name: 'Settings', href: '/settings', icon: Cog6ToothIcon },
];

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();

  const handleNavigation = (href: string) => {
    router.push(href);
    onClose(); // Close mobile sidebar after navigation
  };

  return (
    <>
      {/* Mobile sidebar overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div className={clsx(
        'fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0',
        isOpen ? 'translate-x-0' : '-translate-x-full'
      )}>
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center px-6 py-4 border-b border-gray-200">
            <BuildingOfficeIcon className="h-8 w-8 text-blue-600 mr-3" />
            <h1 className="text-xl font-bold text-gray-900">Builder Pro</h1>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto">
            {navigation.map((item) => {
              const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
              return (
                <button
                  key={item.name}
                  onClick={() => handleNavigation(item.href)}
                  className={clsx(
                    'sidebar-link w-full text-left',
                    isActive && 'active'
                  )}
                >
                  <item.icon className="mr-3 h-5 w-5" />
                  {item.name}
                </button>
              );
            })}

            <div className="pt-6 mt-6 border-t border-gray-200">
              {secondaryNavigation.map((item) => {
                const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
                return (
                  <button
                    key={item.name}
                    onClick={() => handleNavigation(item.href)}
                    className={clsx(
                      'sidebar-link w-full text-left',
                      isActive && 'active'
                    )}
                  >
                    <item.icon className="mr-3 h-5 w-5" />
                    {item.name}
                  </button>
                );
              })}
            </div>
          </nav>
        </div>
      </div>
    </>
  );
}
