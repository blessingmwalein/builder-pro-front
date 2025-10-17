'use client';

import React, { useEffect } from 'react';
import { useParams } from 'next/navigation';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { ProjectSingleLayout } from './ProjectSingleLayout';
import { StatCard } from '@/components/dashboard/StatCard';
import { Button } from '@/components/ui/button';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { fetchProject } from '@/lib/features/project/projectSlice';
import { fetchTaskLists } from '@/lib/features/task/taskSlice';
import { fetchBudgetItems, fetchBudgetCategories } from '@/lib/features/budget/budgetSlice';
import { fetchExpenses } from '@/lib/features/expense/expenseSlice';
import { fetchCompanyUsers } from '@/lib/features/company/companySlice';
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
import { ProjectTasksTab } from './ProjectTasksTab';
import { Skeleton } from '@/components/ui/Skeleton';
import BudgetTab from './BudgetTab';

const statusColors = {
  active: 'bg-green-100 text-green-800',
  completed: 'bg-blue-100 text-blue-800',
  on_hold: 'bg-yellow-100 text-yellow-800',
  cancelled: 'bg-red-100 text-red-800',
};

function ProjectDetailPageSkeleton() {
  return (
    <div className="px-4 sm:px-6 lg:px-8 mt-4">
      {/* Stats skeleton */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        {[...Array(4)].map((_, i) => (
          <Skeleton key={i} className="h-28 w-full rounded-2xl" />
        ))}
      </div>
      {/* Content Grid skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Activity skeleton */}
        <div className="lg:col-span-2">
          <div className="card">
            <div className="p-6">
              <Skeleton className="h-6 w-40 mb-4 rounded" />
              <div className="space-y-4">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="flex items-start space-x-3">
                    <Skeleton className="w-2 h-2 rounded-full mt-2 flex-shrink-0" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-4 w-1/3 rounded" />
                      <Skeleton className="h-3 w-2/3 rounded" />
                      <Skeleton className="h-3 w-1/4 rounded" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        {/* Project Info skeleton */}
        <div className="space-y-6">
          <div className="card">
            <div className="p-6">
              <Skeleton className="h-6 w-32 mb-4 rounded" />
              <div className="space-y-3">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <Skeleton className="h-4 w-1/3 rounded" />
                    <Skeleton className="h-4 w-8 rounded" />
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="card">
            <div className="p-6">
              <Skeleton className="h-6 w-32 mb-4 rounded" />
              <div className="space-y-3">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <Skeleton className="h-4 w-1/3 rounded" />
                    <Skeleton className="h-4 w-16 rounded" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ProjectDetailPage() {
  const params = useParams();
  const projectId = parseInt(params.id as string);

  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const companyId = user?.company?.id;
  const { currentProject, isLoading } = useAppSelector((state) => state.project);
  const { taskLists } = useAppSelector((state) => state.task);
  const { tasks } = useAppSelector((state) => state.task);
  const { items: budgetItems } = useAppSelector((state) => state.budget);
  const { expenses } = useAppSelector((state) => state.expense);
  const companyUsers = useAppSelector((state) => state.company.users || []);

  const [activeTab, setActiveTab] = React.useState('overview');

  useEffect(() => {
    if (companyId && projectId) {
      dispatch(fetchProject({ companyId, projectId }));
      dispatch(fetchTaskLists({ companyId, projectId }));
      dispatch(fetchBudgetItems({ companyId, projectId }));
      dispatch(fetchBudgetCategories({ companyId, projectId }));
      dispatch(fetchExpenses({ companyId, projectId }));
      dispatch(fetchCompanyUsers(companyId));
    }
  }, [dispatch, companyId, projectId]);

  // --- FIX: Only use hooks after loading state is checked ---
  if (isLoading || !currentProject) {
    return (
      <DashboardLayout>
        <ProjectSingleLayout project={currentProject}>
          <ProjectDetailPageSkeleton />
        </ProjectSingleLayout>
      </DashboardLayout>
    );
  }

  // --- FIX: define project from currentProject after loading check ---
  const project = currentProject;

  // All hooks and derived values below this point (no conditional hooks above!)
  // Team: use company users count
  const teamCount = companyUsers.length;

  // --- Extract all tasks from taskLists if present, else fallback to tasks ---
  let allTasks: any[] = [];
  if (taskLists && taskLists.length > 0 && Array.isArray(taskLists[0]?.tasks)) {
    allTasks = [];
    for (const list of taskLists) {
      if (Array.isArray(list.tasks) && list.tasks.length > 0) {
        allTasks.push(...list.tasks.map((t: any) => ({ ...t, task_list_id: list.id, listName: list.name })));
      }
    }
  } else {
    allTasks = tasks;
  }

  const completedTasks = allTasks.filter(task => task.status === 'completed' || task.status === 'done').length;
  const totalTasks = allTasks.length;
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
      trend: {
        value: totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0,
        label: 'completed',
        isPositive: true,
      },
    },
    {
      title: 'Budget',
      value: `$${(currentProject?.budget_total_cents ?? 0 / 100).toLocaleString(undefined, { maximumFractionDigits: 2 })} ${currentProject?.currency ?? ''}`,
      icon: CurrencyDollarIcon,
      color: 'yellow' as const,
      trend: {
        value: budgetItems.length > 0
          ? Math.round((expenses.reduce((sum, expense) => sum + expense.amount, 0) /
            budgetItems.reduce((sum, item) => sum + item.total_price, 0)) * 100)
          : 0,
        label: 'utilized',
        isPositive: false,
      },
    },
    {
      title: 'Team',
      value: teamCount ? String(teamCount) : 'N/A',
      icon: UsersIcon,
      color: 'red' as const,
    },
  ];

  // --- Recent Activity: show most recent task per list using nested tasks ---
  let recentTasks: any[] = [];
  if (taskLists && taskLists.length > 0 && Array.isArray(taskLists[0]?.tasks)) {
    recentTasks = taskLists
      .map(list => {
        const listTasks = Array.isArray(list.tasks) ? list.tasks : [];
        const sorted = [...listTasks].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
        return sorted[0] ? { ...sorted[0], listName: list.name } : null;
      })
      .filter(Boolean)
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  } else {
    recentTasks = taskLists
      .map(list => {
        const listTasks = tasks.filter(task => task.task_list_id === list.id);
        const sorted = [...listTasks].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
        return sorted[0] ? { ...sorted[0], listName: list.name } : null;
      })
      .filter(Boolean)
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  }

  const getListTasks = (list: any) => {
    if (Array.isArray(list.tasks)) return list.tasks;
    return tasks.filter((task: any) => task.task_list_id === list.id);
  };

  const totalBudget = budgetItems.reduce((sum, item) => sum + item.total_price, 0);
  const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);

  return (
    <DashboardLayout>
      <ProjectSingleLayout
        project={project}
        progress={progress}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      >
        <div className="px-4 sm:px-6 lg:px-8 mt-4">
          {/* Tab content */}
          {activeTab === 'overview' && (
            <>
              {/* Stats */}
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-8">
                {projectStats.map((stat) => (
                  <StatCard key={stat.title} {...stat} />
                ))}
              </div>

              {/* Content Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Recent Activity */}
                <div className="lg:col-span-2">
                  <div className="card">
                    <div className="p-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
                      <div className="space-y-4">
                        {recentTasks.length === 0 && (
                          <div className="text-gray-500 text-sm">No recent tasks yet.</div>
                        )}
                        {recentTasks.map((task: any) => (
                          <div key={task.id} className="flex items-start space-x-3">
                            <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0" />
                            <div className="flex-1">
                              <div className="flex items-center justify-between">
                                <h4 className="text-sm font-medium text-gray-900">
                                  {task.title}
                                </h4>
                                <span className="text-xs text-gray-500">
                                  {task.created_at ? (
                                    <span>
                                      {new Date(task.created_at).toLocaleDateString()} {new Date(task.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </span>
                                  ) : null}
                                </span>
                              </div>
                              <p className="text-sm text-gray-600">{task.description || 'No description'}</p>
                              <div className="flex items-center gap-2 text-xs text-gray-500">
                                <span>List: {task.listName}</span>
                                {task.assignee_name && <span>• Assigned to: {task.assignee_name}</span>}
                                <span>• Status: {task.status}</span>
                              </div>
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
                          const listTasks = getListTasks(list);
                          const completedInList = listTasks.filter(
                            (task: any) => task.status === 'completed' || task.status === 'done'
                          ).length;
                          return (
                            <div key={list.id} className="flex items-center justify-between">
                              <span className="text-sm text-gray-700">{list.name}</span>
                              <span className="text-sm font-medium text-gray-900">
                                {completedInList}/{listTasks.length}
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
            </>
          )}
          {activeTab === 'tasks' && (
            <ProjectTasksTab
              companyId={companyId}
              projectId={projectId}
              taskLists={taskLists}
              tasks={tasks}
            />
          )}
          {activeTab === 'budget' && (
            <BudgetTab
              companyId={companyId}
              projectId={projectId}
            />
          )}
          {/* Add more tab content as needed */}
        </div>
      </ProjectSingleLayout>
    </DashboardLayout>
  );
}




