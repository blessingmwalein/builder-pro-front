import React from 'react';
import Link from 'next/link';
import { useParams, usePathname } from 'next/navigation';
import { ChevronRightIcon, HomeIcon, PencilIcon, Cog6ToothIcon, CalendarIcon } from '@heroicons/react/24/outline';
import clsx from 'clsx';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { CreateProjectModal } from '@/components/projects/CreateProjectModal';

const projectNavigation = [
  { name: 'Overview', href: '', exact: true },
  { name: 'Tasks', href: '/tasks' },
  { name: 'Budget', href: '/budget' },
  { name: 'Expenses', href: '/expenses' },
  { name: 'Inspections', href: '/inspections' },
  { name: 'Daily Logs', href: '/daily-logs' },
  { name: 'Photos', href: '/photos' },
  { name: 'Chat', href: '/chat' },
];

const statusColors = {
  planned: 'bg-blue-100 text-blue-700',
  in_progress: 'bg-orange-100 text-orange-700',
  on_hold: 'bg-yellow-100 text-yellow-700',
  completed: 'bg-green-100 text-green-700',
  archived: 'bg-gray-100 text-gray-500',
};

interface ProjectSingleLayoutProps {
  children: React.ReactNode;
  project: any;
  progress?: number;
  activeTab?: string;
  onTabChange?: (tab: string) => void;
}

export function ProjectSingleLayout({
  children,
  project,
  progress = 0,
  activeTab,
  onTabChange,
}: ProjectSingleLayoutProps) {
  const params = useParams();
  const pathname = usePathname();
  const projectId = params.id as string;

  // Edit modal state
  const [isEditOpen, setIsEditOpen] = React.useState(false);

  return (
    <div className="flex flex-col h-full min-h-screen">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-200">
        <div className="px-4 sm:px-6 lg:px-8">
          <nav className="flex py-4" aria-label="Breadcrumb">
            <ol className="flex items-center space-x-4">
              <li>
                <div>
                  <Link href="/dashboard" className="text-gray-400 hover:text-gray-500">
                    <HomeIcon className="h-5 w-5 flex-shrink-0" />
                    <span className="sr-only">Home</span>
                  </Link>
                </div>
              </li>
              <li>
                <div className="flex items-center">
                  <ChevronRightIcon className="h-5 w-5 flex-shrink-0 text-gray-400" />
                  <Link
                    href="/projects"
                    className="ml-4 text-sm font-medium text-gray-500 hover:text-gray-700"
                  >
                    Projects
                  </Link>
                </div>
              </li>
              <li>
                <div className="flex items-center">
                  <ChevronRightIcon className="h-5 w-5 flex-shrink-0 text-gray-400" />
                  <span className="ml-4 text-sm font-medium text-gray-900">
                    {project?.title || project?.name || 'Project'}
                  </span>
                </div>
              </li>
            </ol>
          </nav>
        </div>
      </div>

      {/* Project Header Summary */}
      {project && (
        <div className="bg-white border-b border-gray-100">
          <div className="px-4 sm:px-6 lg:px-8 py-6">
            <div className="mb-8">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div>
                    <h1 className="text-3xl font-bold text-gray-900">{project.title}</h1>
                    <p className="mt-2 text-gray-600">{project.description}</p>
                  </div>
                  <span className={clsx(
                    'inline-flex items-center px-3 py-1 rounded-full text-sm font-medium capitalize',
                    statusColors[project.status as keyof typeof statusColors] || 'bg-gray-100 text-gray-800'
                  )}>
                    {project.status.replace('_', ' ')}
                  </span>
                </div>
                <div className="flex space-x-3">
                  <Button variant="secondary" onClick={() => setIsEditOpen(true)}>
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
          </div>

          {/* Edit Project Modal */}
          <CreateProjectModal
            isOpen={isEditOpen}
            onClose={() => setIsEditOpen(false)}
            companyId={project.company_id}
            initialData={project}
            onEditSubmit={undefined}
          />
        </div>
      )}

      {/* Fixed Project Navigation */}
      <div className="sticky top-0 z-30 bg-white border-b border-gray-200">
        <div className="px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8" aria-label="Project navigation">
            {projectNavigation.map((item) => {
              const tabKey = item.name.toLowerCase().replace(/\s+/g, '');
              const isActive = activeTab
                ? activeTab === tabKey
                : false;
              return (
                <button
                  key={item.name}
                  type="button"
                  onClick={() => onTabChange?.(tabKey)}
                  className={clsx(
                    'border-b-2 py-4 px-1 text-sm font-medium bg-transparent',
                    isActive
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  )}
                >
                  {item.name}
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto mb-3 bg-white">
        {children}
      </div>
    </div>
  );
}
