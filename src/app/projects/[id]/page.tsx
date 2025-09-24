'use client';

import React, { useEffect } from 'react';
import { useParams } from 'next/navigation';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { StatCard } from '@/components/dashboard/StatCard';
import { Button } from '@/components/ui/Button';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { fetchProjects, fetchProjectStats } from '@/lib/features/project/projectSlice';
import { fetchTaskLists, fetchTasks } from '@/lib/features/task/taskSlice';
import { fetchBudgetData } from '@/lib/features/budget/budgetSlice';
import { fetchExpenses } from '@/lib/features/expense/expenseSlice';
import { format } from 'date-fns';
import {
  CalendarIcon,
  UsersIcon,
  CurrencyDollarIcon,
  CheckIcon,
  ClockIcon,
  PencilIcon,
  Cog6ToothIcon,
} from '@heroicons/react/24/outline';
import clsx from 'clsx';

const statusColors = {
  active: 'bg-green-100 text-green-800',
  completed: 'bg-blue-100 text-blue-800',
  on_hold: 'bg-yellow-100 text-yellow-800',
  cancelled: 'bg-red-100 text-red-800',
};

export default function ProjectDetailPage() {
  const params = useParams();
  const projectId = parseInt(params.id as string);
  
  const dispatch = useAppDispatch();
  const { projects, currentProject, stats } = useAppSelector((state) => state.project);
  const { currentCompany } = useAppSelector((state) => state.company);
  const { tasks, taskLists } = useAppSelector((state) => state.task);
  const { items: budgetItems } = useAppSelector((state) => state.budget);
  const { expenses } = useAppSelector((state) => state.expense);

  useEffect(() => {
    if (currentCompany) {
      // Find and set current project
      const project = projects.find(p => p.id === projectId);
      if (project) {
        dispatch({ type: 'project/setCurrentProject', payload: project });
        
        // Fetch project-specific data
        dispatch(fetchProjectStats({ companyId: currentCompany.id, projectId }));
        dispatch(fetchTaskLists({ companyId: currentCompany.id, projectId }));
        dispatch(fetchTasks({ companyId: currentCompany.id, projectId }));
        dispatch(fetchBudgetData({ companyId: currentCompany.id, projectId }));
        dispatch(fetchExpenses({ companyId: currentCompany.id, projectId }));
      } else {
        // Fetch projects if not loaded
        dispatch(fetchProjects(currentCompany.id));
      }
    }
  }, [dispatch, currentCompany, projectId, projects]);

  const project = projects.find(p => p.id === projectId);

  if (!project) {
    return (
      <DashboardLayout>
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="text-center py-12">
            <h3 className="text-lg font-medium text-gray-900">Project not found</h3>
            <p className="mt-2 text-gray-500">The project you're looking for doesn't exist.</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  const totalBudget = budgetItems.reduce((sum, item) => sum + item.total_price, 0);
  const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);
  const completedTasks = tasks.filter(task => task.status === 'completed').length;
  const totalTasks = tasks.length;
  const progress = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

  const projectStats = [
    {
      title: 'Progress',
      value: `${Math.round(progress)}%`,
      icon: CheckIcon,
      color: 'green' as const,
      trend: { value: progress, label: 'completion', isPositive: true },
    },
    {
      title: 'Tasks',
      value: `${completedTasks}/${totalTasks}`,
      icon: ClockIcon,
      color: 'blue' as const,
    },
    {
      title: 'Budget',
      value: `$${totalBudget.toLocaleString()}`,
      icon: CurrencyDollarIcon,
      color: 'yellow' as const,
      trend: { 
        value: totalBudget > 0 ? Math.round((totalExpenses / totalBudget) * 100) : 0, 
        label: 'utilized', 
        isPositive: false 
      },
    },
    {
      title: 'Team',
      value: '8',
      icon: UsersIcon,
      color: 'red' as const,
    },
  ];

  const recentActivities = [
    {
      id: 1,
      action: 'Task completed',
      description: 'Foundation work marked as complete',
      user: 'John Doe',
      time: '2 hours ago',
    },
    {
      id: 2,
      action: 'Expense added',
      description: 'Material costs: $2,500',
      user: 'Jane Smith',
      time: '4 hours ago',
    },
    {
      id: 3,
      action: 'Daily log updated',
      description: 'Weather and progress report',
      user: 'Bob Wilson',
      time: '1 day ago',
    },
  ];

  return (
    <DashboardLayout>
      <div className="px-4 sm:px-6 lg:px-8">
        {/* Project Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">{project.name}</h1>
                <p className="mt-2 text-gray-600">{project.description}</p>
              </div>
              <span className={clsx(
                'inline-flex items-center px-3 py-1 rounded-full text-sm font-medium capitalize',
                statusColors[project.status]
              )}>
                {project.status.replace('_', ' ')}
              </span>
            </div>
            <div className="flex space-x-3">
              <Button variant="secondary">
                <PencilIcon className="h-5 w-5 mr-2" />
                Edit Project
              </Button>
              <Button variant="secondary">
                <Cog6ToothIcon className="h-5 w-5 mr-2" />
                Settings
              </Button>
            </div>
          </div>

          {/* Project Timeline */}
          <div className="mt-6 flex items-center space-x-8 text-sm text-gray-600">
            <div className="flex items-center">
              <CalendarIcon className="h-4 w-4 mr-2" />
              <span>Started: {format(new Date(project.start_date), 'MMM d, yyyy')}</span>
            </div>
            <div className="flex items-center">
              <CalendarIcon className="h-4 w-4 mr-2" />
              <span>Due: {format(new Date(project.end_date), 'MMM d, yyyy')}</span>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mt-4">
            <div className="flex items-center justify-between text-sm mb-2">
              <span className="text-gray-700">Overall Progress</span>
              <span className="font-medium text-gray-900">{Math.round(progress)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-green-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-8">
          {projectStats.map((stat) => (
            <StatCard key={stat.title} {...stat} />
          ))}
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Button className="h-20 flex-col space-y-2" variant="secondary">
            <CheckIcon className="h-6 w-6" />
            <span>View Tasks</span>
          </Button>
          <Button className="h-20 flex-col space-y-2" variant="secondary">
            <CurrencyDollarIcon className="h-6 w-6" />
            <span>Manage Budget</span>
          </Button>
          <Button className="h-20 flex-col space-y-2" variant="secondary">
            <ClockIcon className="h-6 w-6" />
            <span>Daily Logs</span>
          </Button>
          <Button className="h-20 flex-col space-y-2" variant="secondary">
            <UsersIcon className="h-6 w-6" />
            <span>Team Chat</span>
          </Button>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Activity */}
          <div className="lg:col-span-2">
            <div className="card">
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
                <div className="space-y-4">
                  {recentActivities.map((activity) => (
                    <div key={activity.id} className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0" />
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h4 className="text-sm font-medium text-gray-900">
                            {activity.action}
                          </h4>
                          <span className="text-xs text-gray-500">{activity.time}</span>
                        </div>
                        <p className="text-sm text-gray-600">{activity.description}</p>
                        <p className="text-xs text-gray-500">by {activity.user}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Project Info */}
          <div className="space-y-6">
            {/* Task Summary */}
            <div className="card">
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Task Summary</h3>
                <div className="space-y-3">
                  {taskLists.map((list) => {
                    const listTasks = tasks.filter(task => task.task_list_id === list.id);
                    return (
                      <div key={list.id} className="flex items-center justify-between">
                        <span className="text-sm text-gray-700">{list.name}</span>
                        <span className="text-sm font-medium text-gray-900">
                          {listTasks.length}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Budget Summary */}
            <div className="card">
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Budget Summary</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-700">Total Budget</span>
                    <span className="text-sm font-medium text-gray-900">
                      ${totalBudget.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-700">Spent</span>
                    <span className="text-sm font-medium text-red-600">
                      ${totalExpenses.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex items-center justify-between border-t pt-2">
                    <span className="text-sm font-medium text-gray-700">Remaining</span>
                    <span className="text-sm font-bold text-green-600">
                      ${(totalBudget - totalExpenses).toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}



