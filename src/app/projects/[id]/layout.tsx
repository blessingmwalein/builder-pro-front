'use client';

import React from 'react';
import { useParams, usePathname } from 'next/navigation';
import Link from 'next/link';
import { useAppSelector } from '@/lib/hooks';
import { ChevronRightIcon, HomeIcon } from '@heroicons/react/24/outline';
import clsx from 'clsx';

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

export default function ProjectLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const params = useParams();
  const pathname = usePathname();
  const projectId = params.id as string;
  const { projects } = useAppSelector((state) => state.project);
  
  const project = projects.find(p => p.id === parseInt(projectId));
  const projectName = project?.name || 'Project';

  return (
    <div>
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
                    {projectName}
                  </span>
                </div>
              </li>
            </ol>
          </nav>
        </div>
      </div>

      {/* Project Navigation */}
      <div className="bg-white border-b border-gray-200">
        <div className="px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8" aria-label="Project navigation">
            {projectNavigation.map((item) => {
              const href = `/projects/${projectId}${item.href}`;
              const isActive = item.exact 
                ? pathname === `/projects/${projectId}`
                : pathname.startsWith(href);
              
              return (
                <Link
                  key={item.name}
                  href={href}
                  className={clsx(
                    'border-b-2 py-4 px-1 text-sm font-medium',
                    isActive
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  )}
                >
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </div>
      </div>

      {children}
    </div>
  );
}



