'use client';

import React, { useEffect } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { BudgetOverview } from '@/components/budget/BudgetOverview';
import { BudgetTable } from '@/components/budget/BudgetTable';
import { StatCard } from '@/components/dashboard/StatCard';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { fetchBudgetData } from '@/lib/features/budget/budgetSlice';
import {
  CurrencyDollarIcon,
  ChartBarIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
} from '@heroicons/react/24/outline';

export default function BudgetPage() {
  const dispatch = useAppDispatch();
  const { categories, items, isLoading } = useAppSelector((state) => state.budget);
  const { currentCompany } = useAppSelector((state) => state.company);
  const { currentProject } = useAppSelector((state) => state.project);

  useEffect(() => {
    if (currentCompany && currentProject) {
      dispatch(fetchBudgetData({ companyId: currentCompany.id, projectId: currentProject.id }));
    }
  }, [dispatch, currentCompany, currentProject]);

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-32 bg-gray-200 rounded-lg"></div>
              ))}
            </div>
            <div className="h-96 bg-gray-200 rounded-lg"></div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  const totalBudget = items.reduce((sum, item) => sum + item.total_price, 0);
  const spentBudget = 87500; // Mock data - in real app, this would come from expenses
  const remainingBudget = totalBudget - spentBudget;
  const budgetUtilization = totalBudget > 0 ? (spentBudget / totalBudget) * 100 : 0;

  const stats = [
    {
      title: 'Total Budget',
      value: `$${totalBudget.toLocaleString()}`,
      icon: CurrencyDollarIcon,
      color: 'blue' as const,
    },
    {
      title: 'Spent',
      value: `$${spentBudget.toLocaleString()}`,
      icon: ChartBarIcon,
      color: 'red' as const,
      trend: { value: budgetUtilization, label: 'of budget', isPositive: false },
    },
    {
      title: 'Remaining',
      value: `$${remainingBudget.toLocaleString()}`,
      icon: CheckCircleIcon,
      color: 'green' as const,
    },
    {
      title: 'Categories',
      value: categories.length,
      icon: ExclamationTriangleIcon,
      color: 'yellow' as const,
    },
  ];

  if (!currentProject) {
    return (
      <DashboardLayout>
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="text-center py-12">
            <h3 className="text-lg font-medium text-gray-900">No project selected</h3>
            <p className="mt-2 text-gray-500">Please select a project to view budget.</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Budget</h1>
          <p className="mt-2 text-gray-600">
            {currentProject.name} - Track and manage project budget
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-8">
          {stats.map((stat) => (
            <StatCard key={stat.title} {...stat} />
          ))}
        </div>

        {/* Budget Overview */}
        <div className="mb-8">
          <BudgetOverview />
        </div>

        {/* Budget Table */}
        <BudgetTable />
      </div>
    </DashboardLayout>
  );
}



