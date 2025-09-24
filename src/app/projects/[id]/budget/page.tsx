'use client';

import React, { useEffect } from 'react';
import { useParams } from 'next/navigation';
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

export default function ProjectBudgetPage() {
  const params = useParams();
  const projectId = parseInt(params.id as string);
  
  const dispatch = useAppDispatch();
  const { categories, items, isLoading } = useAppSelector((state) => state.budget);
  const { currentCompany } = useAppSelector((state) => state.company);

  useEffect(() => {
    if (currentCompany) {
      dispatch(fetchBudgetData({ companyId: currentCompany.id, projectId }));
    }
  }, [dispatch, currentCompany, projectId]);

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse">
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

  return (
    <DashboardLayout>
      <div className="px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Project Budget</h1>
          <p className="mt-1 text-gray-600">
            Track and manage project budget
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



