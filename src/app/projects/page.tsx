'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { ProjectCard } from '@/components/projects/ProjectCard';
import { CreateProjectModal } from '@/components/projects/CreateProjectModal';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/Skeleton';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { fetchProjects, setCurrentProject, updateProject } from '@/lib/features/project/projectSlice';
import { PlusIcon, Squares2X2Icon, RectangleGroupIcon } from '@heroicons/react/24/outline';

function ProjectsPageSkeleton() {
  return (
    <div className="px-4 sm:px-6 lg:px-8 mt-4">
      {/* Header skeleton */}
      <div className="flex items-center justify-between mb-8">
        <Skeleton className="h-10 w-1/3 rounded-xl" />
        <Skeleton className="h-10 w-32 rounded-xl" />
      </div>
      {/* Table skeleton */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6">
        <div className="flex mb-4">
          <Skeleton className="h-6 w-24 rounded" />
          <Skeleton className="h-6 w-24 rounded ml-6" />
          <Skeleton className="h-6 w-24 rounded ml-6" />
        </div>
        <div className="space-y-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="flex items-center space-x-4">
              <Skeleton className="h-10 w-10 rounded-xl" />
              <Skeleton className="h-6 w-1/4 rounded" />
              <Skeleton className="h-6 w-1/6 rounded" />
              <Skeleton className="h-6 w-1/6 rounded" />
              <Skeleton className="h-6 w-1/6 rounded" />
              <Skeleton className="h-8 w-20 rounded-xl ml-auto" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function ProjectsPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  // Use company from profile in auth slice (persisted in cookie)
  const { user } = useAppSelector((state) => state.auth);
  const companyId = user?.company?.id;
  const { projects, isLoading } = useAppSelector((state) => state.project);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [view, setView] = useState<'grid' | 'board'>('grid');
  const [editProject, setEditProject] = useState<any>(null);

  // Status color mapping for board view
  const statusColors: Record<string, string> = {
    planned: 'bg-blue-100 text-blue-700',
    in_progress: 'bg-orange-100 text-orange-700',
    on_hold: 'bg-yellow-100 text-yellow-700',
    completed: 'bg-green-100 text-green-700',
    archived: 'bg-gray-100 text-gray-500',
  };

  useEffect(() => {
    if (companyId) {
      dispatch(fetchProjects(companyId));
    }
  }, [dispatch, companyId]);

  const handleProjectClick = (project: any) => {
    dispatch(setCurrentProject(project));
    router.push(`/projects/${project.id}`);
  };

  const handleView = (project: any) => {
    router.push(`/projects/${project.id}`);
  };

  const handleEdit = (project: any) => {
    setEditProject(project);
    setIsCreateModalOpen(true);
  };

  const handleEditSubmit = async (data: any) => {
    if (!companyId || !editProject) return;
    try {
      await dispatch(updateProject({ companyId, projectId: editProject.id, data })).unwrap();
      setEditProject(null);
      setIsCreateModalOpen(false);
    } catch (err) {
      // handle error (toast, etc)
    }
  };

  const handleModalClose = () => {
    setEditProject(null);
    setIsCreateModalOpen(false);
  };

  // Statuses: planned, in_progress, on_hold, completed, archived
  const activeProjects = projects.filter(
    p => p.status === 'planned' || p.status === 'in_progress'
  );
  const completedProjects = projects.filter(p => p.status === 'completed');
  const otherProjects = projects.filter(
    p => !['planned', 'in_progress', 'completed'].includes(p.status)
  );

  if (isLoading) {
    return <ProjectsPageSkeleton />;
  }

  return (
    <DashboardLayout>
      <div className="px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Projects</h1>
            <p className="mt-2 text-gray-600">
              Manage and track all your construction projects
            </p>
            {/* Tabs for view switcher */}
            <div className="flex items-center border-b border-gray-200 mt-4">
              {(
                [
                  {
                    key: 'grid',
                    label: 'Grid View',
                    icon: <Squares2X2Icon className="h-5 w-5 mr-1" />,
                  },
                  {
                    key: 'board',
                    label: 'Board View',
                    icon: <RectangleGroupIcon className="h-5 w-5 mr-1" />,
                  },
                ] as const
              ).map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setView(tab.key)}
                  className={`flex items-center px-3 py-2 text-sm font-medium transition
                    ${view === tab.key
                      ? 'border-b-2 border-orange-500 text-orange-600'
                      : 'text-gray-500 hover:text-orange-600 border-b-2 border-transparent'}
                  `}
                  style={{ outline: 'none' }}
                  type="button"
                >
                  {tab.icon}
                  <span
                    className={`${
                      view === tab.key
                        ? 'font-semibold'
                        : 'font-normal'
                    }`}
                  >
                    {tab.label}
                  </span>
                </button>
              ))}
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              onClick={() => setIsCreateModalOpen(true)}
              className="flex flex-row items-center justify-center px-4 py-2"
            >
              <PlusIcon className="h-6 w-6 mr-2" />
              <span>New Project</span>
            </Button>
          </div>
        </div>

        {/* Board View */}
        {view === 'board' ? (
          <div className="flex gap-6 overflow-x-auto pb-4">
            {['planned', 'in_progress', 'on_hold', 'completed', 'archived'].map((status) => {
              const statusProjects = projects.filter(p => p.status === status);
              return (
                <div key={status} className="min-w-[300px] flex-1">
                  <div className={`flex items-center px-4 py-2 rounded-t-xl font-semibold text-sm uppercase ${statusColors[status]}`}>
                    {status.replace('_', ' ')}
                    <span className="ml-2 bg-white text-gray-700 rounded-full px-2 py-0.5 text-xs font-bold">{statusProjects.length}</span>
                  </div>
                  <div className="bg-gray-50 rounded-b-xl min-h-[120px] p-3 space-y-4">
                    {statusProjects.length === 0 && (
                      <div className="text-xs text-gray-400 text-center py-4">No projects</div>
                    )}
                    {statusProjects.map((project) => (
                      <ProjectCard
                        key={project.id}
                        project={project}
                        onClick={() => handleProjectClick(project)}
                        onView={() => handleView(project)}
                        onEdit={() => handleEdit(project)}
                      />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <>
            {/* Active Projects */}
            {activeProjects.length > 0 && (
              <div className="mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  Active Projects ({activeProjects.length})
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {activeProjects.map((project) => (
                    <ProjectCard
                      key={project.id}
                      project={project}
                      onClick={() => handleProjectClick(project)}
                      onView={() => handleView(project)}
                      onEdit={() => handleEdit(project)}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Completed Projects */}
            {completedProjects.length > 0 && (
              <div className="mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  Completed Projects ({completedProjects.length})
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {completedProjects.map((project) => (
                    <ProjectCard
                      key={project.id}
                      project={project}
                      onClick={() => handleProjectClick(project)}
                      onView={() => handleView(project)}
                      onEdit={() => handleEdit(project)}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Other Projects */}
            {otherProjects.length > 0 && (
              <div className="mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  Other Projects ({otherProjects.length})
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {otherProjects.map((project) => (
                    <ProjectCard
                      key={project.id}
                      project={project}
                      onClick={() => handleProjectClick(project)}
                      onView={() => handleView(project)}
                      onEdit={() => handleEdit(project)}
                    />
                  ))}
                </div>
              </div>
            )}
          </>
        )}

        {/* Empty state */}
        {projects.length === 0 && (
          <div className="text-center py-12">
            <div className="mx-auto h-24 w-24 text-gray-400">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1}
                  d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                />
              </svg>
            </div>
            <h3 className="mt-4 text-lg font-medium text-gray-900">No projects yet</h3>
            <p className="mt-2 text-gray-500">Get started by creating your first project.</p>
            <div className="mt-6">
              <Button onClick={() => setIsCreateModalOpen(true)}>
                <PlusIcon className="h-5 w-5 mr-2" />
                Create Project
              </Button>
            </div>
          </div>
        )}

        <CreateProjectModal
          isOpen={isCreateModalOpen}
          onClose={handleModalClose}
          companyId={companyId}
          initialData={editProject}
          onEditSubmit={handleEditSubmit}
        />
      </div>
    </DashboardLayout>
  );
}




