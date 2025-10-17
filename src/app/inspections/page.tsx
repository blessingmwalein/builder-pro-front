'use client';

import React, { useEffect } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { StatCard } from '@/components/dashboard/StatCard';
import { Button } from '@/components/ui/button';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { fetchInspections, fetchInspectionSummary } from '@/lib/features/inspection/inspectionSlice';
import { format } from 'date-fns';
import {
  ClipboardDocumentListIcon,
  CheckCircleIcon,
  ClockIcon,
  ExclamationTriangleIcon,
  PlusIcon,
  EnvelopeIcon,
  PhoneIcon,
} from '@heroicons/react/24/outline';
import clsx from 'clsx';

const statusColors = {
  pending: 'bg-yellow-100 text-yellow-800',
  completed: 'bg-green-100 text-green-800',
  overdue: 'bg-red-100 text-red-800',
};

export default function InspectionsPage() {
  const dispatch = useAppDispatch();
  const { inspections, summary, isLoading } = useAppSelector((state) => state.inspection);
  const { currentCompany } = useAppSelector((state) => state.company);
  const { currentProject } = useAppSelector((state) => state.project);

  useEffect(() => {
    if (currentCompany && currentProject) {
      dispatch(fetchInspections({ companyId: currentCompany.id, projectId: currentProject.id }));
      dispatch(fetchInspectionSummary({ companyId: currentCompany.id, projectId: currentProject.id }));
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

  if (!currentProject) {
    return (
      <DashboardLayout>
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="text-center py-12">
            <h3 className="text-lg font-medium text-gray-900">No project selected</h3>
            <p className="mt-2 text-gray-500">Please select a project to view inspections.</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  const stats = [
    {
      title: 'Total Inspections',
      value: summary?.total || 0,
      icon: ClipboardDocumentListIcon,
      color: 'blue' as const,
    },
    {
      title: 'Completed',
      value: summary?.completed || 0,
      icon: CheckCircleIcon,
      color: 'green' as const,
    },
    {
      title: 'Pending',
      value: summary?.pending || 0,
      icon: ClockIcon,
      color: 'yellow' as const,
    },
    {
      title: 'Overdue',
      value: summary?.overdue || 0,
      icon: ExclamationTriangleIcon,
      color: 'red' as const,
    },
  ];

  return (
    <DashboardLayout>
      <div className="px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Inspections</h1>
            <p className="mt-2 text-gray-600">
              {currentProject.name} - Manage building inspections and compliance
            </p>
          </div>
          <div className="flex space-x-3">
            <Button variant="secondary">
              <EnvelopeIcon className="h-5 w-5 mr-2" />
              Email Council
            </Button>
            <Button>
              <PlusIcon className="h-5 w-5 mr-2" />
              Schedule Inspection
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-8">
          {stats.map((stat) => (
            <StatCard key={stat.title} {...stat} />
          ))}
        </div>

        {/* Inspections List */}
        <div className="card">
          <div className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Upcoming & Recent Inspections</h3>
            
            <div className="space-y-4">
              {inspections.map((inspection) => (
                <div key={inspection.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h4 className="text-lg font-medium text-gray-900">
                          {inspection.title}
                        </h4>
                        <span className={clsx(
                          'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize',
                          statusColors[inspection.status]
                        )}>
                          {inspection.status}
                        </span>
                      </div>
                      
                      <p className="text-gray-600 mb-3">
                        {inspection.description}
                      </p>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                        <div>
                          <span className="font-medium text-gray-700">Scheduled Date:</span>
                          <p className="text-gray-600">
                            {format(new Date(inspection.scheduled_date), 'MMMM d, yyyy')}
                          </p>
                        </div>
                        
                        <div>
                          <span className="font-medium text-gray-700">Council Officer:</span>
                          <p className="text-gray-600">{inspection.council_officer}</p>
                        </div>
                        
                        <div>
                          <span className="font-medium text-gray-700">Contact:</span>
                          <div className="flex items-center space-x-2">
                            <EnvelopeIcon className="h-4 w-4 text-gray-400" />
                            <a 
                              href={`mailto:${inspection.contact_email}`}
                              className="text-blue-600 hover:text-blue-500"
                            >
                              {inspection.contact_email}
                            </a>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col space-y-2 ml-4">
                      <Button size="sm" variant="secondary">
                        Send Reminder
                      </Button>
                      {inspection.status === 'pending' && (
                        <Button size="sm">
                          Mark Complete
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {inspections.length === 0 && (
              <div className="text-center py-8">
                <div className="mx-auto h-24 w-24 text-gray-400">
                  <ClipboardDocumentListIcon />
                </div>
                <h3 className="mt-4 text-lg font-medium text-gray-900">No inspections scheduled</h3>
                <p className="mt-2 text-gray-500">Schedule your first inspection to track compliance and progress.</p>
                <div className="mt-6">
                  <Button>
                    <PlusIcon className="h-5 w-5 mr-2" />
                    Schedule First Inspection
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




