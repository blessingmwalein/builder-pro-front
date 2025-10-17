'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Menu } from '@headlessui/react';
import {
  Bars3Icon,
  BellIcon,
  MagnifyingGlassIcon,
  UserCircleIcon,
  BuildingOffice2Icon,
} from '@heroicons/react/24/outline';
import { useAppSelector, useAppDispatch } from '@/lib/hooks';
import { logout, fetchProfile } from '@/lib/features/auth/authSlice';
import toast from 'react-hot-toast';

interface HeaderProps {
  onMenuClick: () => void;
}

export function Header({ onMenuClick }: HeaderProps) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { user, isAuthenticated } = useAppSelector((state) => state.auth);
  const { unreadCount } = useAppSelector((state) => state.notification);

  // Fetch profile if not loaded
  useEffect(() => {
    if (!user && isAuthenticated) {
      dispatch(fetchProfile());
    }
  }, [user, isAuthenticated, dispatch]);

  const handleLogout = () => {
    dispatch(logout());
    toast.success('Logged out successfully');
    router.push('/auth/login');
  };

  // Helper for avatar
  const renderAvatar = () => {
    if (user?.avatar_url) {
      return (
        <img
          src={user.avatar_url}
          alt={user.name}
          className="h-8 w-8 rounded-full object-cover bg-gray-200"
        />
      );
    }
    return (
      <span className="inline-flex items-center justify-center h-8 w-8 rounded-full bg-orange-100 text-orange-600 font-bold text-lg">
        {user?.name?.charAt(0)?.toUpperCase() || <UserCircleIcon className="h-8 w-8 text-gray-400" />}
      </span>
    );
  };

  // Helper for company highlight
  const renderCompanyButton = () => {
    if (!user?.company) return null;
    return (
      <button
        type="button"
        className="flex items-center px-3 py-1 rounded-full bg-orange-50 border border-orange-100 hover:bg-orange-100 transition-colors"
        title={user.company.name}
        style={{ background: 'linear-gradient(90deg, #FFF7ED 60%, #F1F5F9 100%)' }}
        onClick={() => {/* future: open company switcher */}}
      >
        <span className="inline-flex items-center justify-center h-7 w-7 rounded-full bg-orange-200 mr-2">
          <BuildingOffice2Icon className="h-5 w-5 text-orange-700" />
        </span>
        <span className="font-semibold text-orange-800 text-sm">{user.company.name}</span>
        <span className="ml-2 px-2 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-100 ml-3">
          Current
        </span>
        <span className="ml-2 px-2 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200 ml-3">
          {user.company.currency}
        </span>
      </button>
    );
  };

  return (
    <header className="bg-white border-b border-gray-200">
      <div className="flex items-center justify-between px-4 py-3 sm:px-6">
        {/* Left side */}
        <div className="flex items-center">
          <button
            type="button"
            className="p-2 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 lg:hidden"
            onClick={onMenuClick}
          >
            <Bars3Icon className="h-6 w-6" />
          </button>

          {/* Search */}
          <div className="hidden sm:block ml-4 lg:ml-0">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search projects, tasks..."
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Right side */}
        <div className="flex items-center space-x-4">
          {/* Company highlight */}
          {renderCompanyButton()}

          {/* Notifications */}
          <button
            type="button"
            className="relative p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            onClick={() => router.push('/notifications')}
          >
            <BellIcon className="h-6 w-6" />
            {unreadCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 h-5 w-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </button>

          {/* User menu */}
          <Menu as="div" className="relative">
            <Menu.Button className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500">
              {renderAvatar()}
              <div className="hidden sm:block text-left">
                <p className="text-sm font-medium text-gray-900">{user?.name}</p>
                <p className="text-xs text-gray-500 capitalize">{user?.role?.replace('_', ' ')}</p>
              </div>
            </Menu.Button>
            <Menu.Items className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-50">
              <div className="py-1">
                <Menu.Item>
                  {({ active }) => (
                    <button
                      onClick={() => router.push('/profile')}
                      className={`${
                        active ? 'bg-gray-100' : ''
                      } block w-full text-left px-4 py-2 text-sm text-gray-700`}
                    >
                      Your Profile
                    </button>
                  )}
                </Menu.Item>
                <Menu.Item>
                  {({ active }) => (
                    <button
                      onClick={() => router.push('/settings')}
                      className={`${
                        active ? 'bg-gray-100' : ''
                      } block w-full text-left px-4 py-2 text-sm text-gray-700`}
                    >
                      Settings
                    </button>
                  )}
                </Menu.Item>
                <Menu.Item>
                  {({ active }) => (
                    <button
                      onClick={handleLogout}
                      className={`${
                        active ? 'bg-gray-100' : ''
                      } block w-full text-left px-4 py-2 text-sm text-gray-700`}
                    >
                      Sign out
                    </button>
                  )}
                </Menu.Item>
              </div>
            </Menu.Items>
          </Menu>
        </div>
      </div>
    </header>
  );
}




