'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { ProjectCard } from '@/components/projects/ProjectCard';
import { CreateProjectModal } from '@/components/projects/CreateProjectModal';
import { Button } from '@/components/ui/Button';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { fetchProjects, setCurrentProject } from '@/lib/features/project/projectSlice';
import { PlusIcon } from '@heroicons/react/24/outline';

export default function ProjectsPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { projects, isLoading } = useAppSelector((state) => state.project);
  const { currentCompany } = useAppSelector((state) => state.company);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  useEffect(() => {
    if (currentCompany) {
      dispatch(fetchProjects(currentCompany.id));
    }
  }, [dispatch, currentCompany]);

  const handleProjectClick = (project: any) => {
    dispatch(setCurrentProject(project));
    router.push(`/projects/${project.id}`);
  };

  const activeProjects = projects.filter(p => p.status === 'active');
  const completedProjects = projects.filter(p => p.status === 'completed');
  const otherProjects = projects.filter(p => !['active', 'completed'].includes(p.status));

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-48 bg-gray-200 rounded-lg"></div>
              ))}
            </div>
          </div>
        </div>
      </DashboardLayout>
    );
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
          </div>
          <Button
            onClick={() => setIsCreateModalOpen(true)}
            className="flex items-center"
          >
            <PlusIcon className="h-5 w-5 mr-2" />
            New Project
          </Button>
        </div>

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
                />
              ))}
            </div>
          </div>
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
          onClose={() => setIsCreateModalOpen(false)}
        />
      </div>
    </DashboardLayout>
  );
}




