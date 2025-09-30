'use client';

import React, { useEffect, useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { StatCard } from '@/components/dashboard/StatCard';
import { Button } from '@/components/ui/Button';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { fetchExpenses } from '@/lib/features/expense/expenseSlice';
import { format } from 'date-fns';
import {
  CurrencyDollarIcon,
  DocumentIcon,
  CalendarIcon,
  PlusIcon,
  EyeIcon,
} from '@heroicons/react/24/outline';

export default function ExpensesPage() {
  const dispatch = useAppDispatch();
  const { expenses, isLoading } = useAppSelector((state) => state.expense);
  const { currentCompany } = useAppSelector((state) => state.company);
  const { currentProject } = useAppSelector((state) => state.project);

  useEffect(() => {
    if (currentCompany && currentProject) {
      dispatch(fetchExpenses({ companyId: currentCompany.id, projectId: currentProject.id }));
    }
  }, [dispatch, currentCompany, currentProject]);

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-32 bg-gray-200 rounded-lg"></div>
              ))}
            </div>
            <div className="h-96 bg-gray-200 rounded-lg"></div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (!currentProject) {
    return (
      <DashboardLayout>
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="text-center py-12">
            <h3 className="text-lg font-medium text-gray-900">No project selected</h3>
            <p className="mt-2 text-gray-500">Please select a project to view expenses.</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);
  const thisMonthExpenses = expenses.filter(expense => {
    const expenseDate = new Date(expense.date);
    const now = new Date();
    return expenseDate.getMonth() === now.getMonth() && expenseDate.getFullYear() === now.getFullYear();
  }).reduce((sum, expense) => sum + expense.amount, 0);

  const stats = [
    {
      title: 'Total Expenses',
      value: `$${totalExpenses.toLocaleString()}`,
      icon: CurrencyDollarIcon,
      color: 'blue' as const,
    },
    {
      title: 'This Month',
      value: `$${thisMonthExpenses.toLocaleString()}`,
      icon: CalendarIcon,
      color: 'green' as const,
    },
    {
      title: 'Total Items',
      value: expenses.length,
      icon: DocumentIcon,
      color: 'yellow' as const,
    },
  ];

  return (
    <DashboardLayout>
      <div className="px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Expenses</h1>
            <p className="mt-2 text-gray-600">
              {currentProject.name} - Track project expenses and receipts
            </p>
          </div>
          <Button>
            <PlusIcon className="h-5 w-5 mr-2" />
            Add Expense
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3 mb-8">
          {stats.map((stat) => (
            <StatCard key={stat.title} {...stat} />
          ))}
        </div>

        {/* Expenses Table */}
        <div className="card">
          <div className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Expenses</h3>
            
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Description
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Category
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Submitted By
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Receipt
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {expenses.map((expense) => (
                    <tr key={expense.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {expense.description}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 capitalize">
                          {expense.category}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {format(new Date(expense.date), 'MMM d, yyyy')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        ${expense.amount.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {expense.user?.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        {expense.receipt_url ? (
                          <button className="text-blue-600 hover:text-blue-900">
                            <EyeIcon className="h-4 w-4" />
                          </button>
                        ) : (
                          <span className="text-gray-400">No receipt</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {expenses.length === 0 && (
              <div className="text-center py-8">
                <div className="mx-auto h-24 w-24 text-gray-400">
                  <CurrencyDollarIcon />
                </div>
                <h3 className="mt-4 text-lg font-medium text-gray-900">No expenses yet</h3>
                <p className="mt-2 text-gray-500">Start tracking project expenses by adding your first expense.</p>
                <div className="mt-6">
                  <Button>
                    <PlusIcon className="h-5 w-5 mr-2" />
                    Add First Expense
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}




