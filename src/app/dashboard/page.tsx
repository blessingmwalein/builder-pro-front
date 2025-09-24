'use client';

import React, { useEffect } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { StatCard } from '@/components/dashboard/StatCard';
import { ProjectChart } from '@/components/dashboard/ProjectChart';
import { RecentActivity } from '@/components/dashboard/RecentActivity';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { fetchProjects } from '@/lib/features/project/projectSlice';
import { fetchNotifications } from '@/lib/features/notification/notificationSlice';
import {
  FolderIcon,
  CheckIcon,
  UsersIcon,
  CurrencyDollarIcon,
} from '@heroicons/react/24/outline';

export default function DashboardPage() {
  const dispatch = useAppDispatch();
  const { projects } = useAppSelector((state) => state.project);
  const { currentCompany } = useAppSelector((state) => state.company);

  useEffect(() => {
    // Initialize mock company if none exists
    if (!currentCompany) {
      const mockCompany = {
        id: 1,
        name: 'Demo Construction Co.',
        slug: 'demo-construction',
        phone: '+1-555-0123',
        country: 'US',
        timezone: 'America/New_York',
        currency: 'USD',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      dispatch({ type: 'company/setCurrentCompany', payload: mockCompany });
      dispatch(fetchProjects(mockCompany.id));
    } else {
      dispatch(fetchProjects(currentCompany.id));
    }
    dispatch(fetchNotifications());
  }, [dispatch, currentCompany]);

  // Mock statistics - in real app, these would come from API
  const stats = [
    {
      title: 'Active Projects',
      value: projects.filter(p => p.status === 'active').length,
      icon: FolderIcon,
      color: 'blue' as const,
      trend: { value: 12, label: 'from last month', isPositive: true },
    },
    {
      title: 'Tasks Completed',
      value: '147',
      icon: CheckIcon,
      color: 'green' as const,
      trend: { value: 8, label: 'from last week', isPositive: true },
    },
    {
      title: 'Team Members',
      value: '12',
      icon: UsersIcon,
      color: 'yellow' as const,
      trend: { value: 2, label: 'new this month', isPositive: true },
    },
    {
      title: 'Budget Utilized',
      value: '$87,500',
      icon: CurrencyDollarIcon,
      color: 'red' as const,
      trend: { value: -5, label: 'under budget', isPositive: false },
    },
  ];

  return (
    <DashboardLayout>
      <div className="px-4 sm:px-6 lg:px-8">
        {/* Page header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="mt-2 text-gray-600">
            Welcome back! Here's what's happening with your projects.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-8">
          {stats.map((stat) => (
            <StatCard key={stat.title} {...stat} />
          ))}
        </div>

        {/* Charts and Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <ProjectChart />
          <RecentActivity />
        </div>
      </div>
    </DashboardLayout>
  );
}
