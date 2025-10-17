'use client';

import { useState } from 'react';
import { useAppSelector } from '@/lib/hooks';
import { format } from 'date-fns';
import { DashboardLayout } from '@/components/layout/DashboardLayout';

const TABS = [
  {
    key: 'personal',
    label: 'Personal Info',
    icon: (
      <span className="inline-flex items-center justify-center h-10 w-10 rounded-full bg-orange-100">
        <svg className="h-6 w-6 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      </span>
    ),
  },
  {
    key: 'company',
    label: 'Company Info',
    icon: (
      <span className="inline-flex items-center justify-center h-10 w-10 rounded-full bg-green-100">
        <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
      </span>
    ),
  },
  {
    key: 'actions',
    label: 'Quick Actions',
    icon: (
      <span className="inline-flex items-center justify-center h-10 w-10 rounded-full bg-blue-100">
        <svg className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      </span>
    ),
  },
];

export default function ProfilePage() {
  const { user, isLoading, isAuthenticated } = useAppSelector((state) => state.auth);
  const [activeTab, setActiveTab] = useState('personal');

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-orange-500 mx-auto"></div>
            <p className="mt-4 text-lg text-gray-600">Loading profile...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (!isAuthenticated || !user) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="mx-auto h-16 w-16 bg-red-100 rounded-full flex items-center justify-center">
              <svg className="h-8 w-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h2 className="mt-4 text-xl font-semibold text-gray-900">Profile Not Found</h2>
            <p className="mt-2 text-gray-600">You are not logged in.</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Not set';
    try {
      return format(new Date(dateString), 'PPpp');
    } catch {
      return 'Invalid date';
    }
  };

  const personalInfo = [
    { label: 'User ID', value: `#${user.id}` },
    { label: 'Full Name', value: user.name || 'Not set' },
    { label: 'Email', value: user.email || 'Not set' },
    { label: 'Phone', value: user.phone || 'Not set' },
    { label: 'Position', value: user.position || 'Not set' },
    { label: 'Account Type', value: user.account_type || 'Not set' },
    { label: 'Created', value: formatDate(user.created_at) },
  ];

  const companyInfo = user.company ? [
    { label: 'Company Name', value: user.company.name },
    { label: 'Status', value: user.company.status },
    { label: 'Country', value: user.company.country },
    { label: 'Currency', value: user.company.currency },
    { label: 'Your Role', value: user.company.pivot?.role || 'Member' },
  ] : [];

  return (
    <DashboardLayout>
      <div className="space-y-6 px-8">
        {/* Profile Header */}
        <div className="flex items-center space-x-6 mb-6">
          <div className="h-24 w-24 bg-gradient-to-r from-orange-500 to-orange-600 rounded-full flex items-center justify-center shadow-lg">
            <span className="text-3xl font-bold text-white">
              {user.name?.charAt(0)?.toUpperCase() || 'U'}
            </span>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">{user.name}</h2>
            <p className="text-lg text-gray-600">{user.position || 'No position set'}</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200 mb-6">
          <nav className="-mb-px flex space-x-8" aria-label="Tabs">
            {TABS.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`group inline-flex items-center py-4 px-1 border-b-2 font-medium text-sm transition-all duration-150 ${
                  activeTab === tab.key
                    ? 'border-orange-500 text-orange-600'
                    : 'border-transparent text-gray-500 hover:text-orange-600 hover:border-orange-300'
                }`}
                type="button"
              >
                {tab.icon}
                <span className="ml-3">{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        <div>
          {activeTab === 'personal' && (
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <tbody className="bg-white divide-y divide-gray-200">
                  {personalInfo.map((item, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 bg-gray-50">
                        {item.label}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {item.value}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === 'company' && user.company && (
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <tbody className="bg-white divide-y divide-gray-200">
                  {companyInfo.map((item, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 bg-gray-50">
                        {item.label}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {item.value}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === 'actions' && (
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <button className="bg-orange-500 hover:bg-orange-600 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center">
                  <span className="inline-flex items-center justify-center h-8 w-8 rounded-full bg-orange-100 mr-2">
                    <svg className="h-5 w-5 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                    </svg>
                  </span>
                  Edit Profile
                </button>
                <button className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center">
                  <span className="inline-flex items-center justify-center h-8 w-8 rounded-full bg-blue-100 mr-2">
                    <svg className="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </span>
                  Change Password
                </button>
                <button className="bg-green-500 hover:bg-green-600 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center">
                  <span className="inline-flex items-center justify-center h-8 w-8 rounded-full bg-green-100 mr-2">
                    <svg className="h-5 w-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </span>
                  Verify Email
                </button>
                <button className="bg-red-500 hover:bg-red-600 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center">
                  <span className="inline-flex items-center justify-center h-8 w-8 rounded-full bg-red-100 mr-2">
                    <svg className="h-5 w-5 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                  </span>
                  Logout
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}


