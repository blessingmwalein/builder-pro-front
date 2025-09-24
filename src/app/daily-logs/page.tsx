'use client';

import React, { useEffect } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/Button';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { fetchDailyLogs } from '@/lib/features/dailyLog/dailyLogSlice';
import { format } from 'date-fns';
import {
  ClipboardDocumentListIcon,
  PlusIcon,
  CloudIcon,
  UsersIcon,
  ExclamationTriangleIcon,
  CameraIcon,
} from '@heroicons/react/24/outline';

export default function DailyLogsPage() {
  const dispatch = useAppDispatch();
  const { dailyLogs, isLoading } = useAppSelector((state) => state.dailyLog);
  const { currentCompany } = useAppSelector((state) => state.company);
  const { currentProject } = useAppSelector((state) => state.project);

  useEffect(() => {
    if (currentCompany && currentProject) {
      dispatch(fetchDailyLogs({ companyId: currentCompany.id, projectId: currentProject.id }));
    }
  }, [dispatch, currentCompany, currentProject]);

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-48 bg-gray-200 rounded-lg"></div>
              ))}
            </div>
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
            <p className="mt-2 text-gray-500">Please select a project to view daily logs.</p>
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
            <h1 className="text-3xl font-bold text-gray-900">Daily Logs</h1>
            <p className="mt-2 text-gray-600">
              {currentProject.name} - Track daily progress and site activities
            </p>
          </div>
          <Button>
            <PlusIcon className="h-5 w-5 mr-2" />
            Add Daily Log
          </Button>
        </div>

        {/* Daily Logs Timeline */}
        <div className="space-y-6">
          {dailyLogs.map((log) => (
            <div key={log.id} className="card">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-4">
                    <div className="bg-blue-100 p-2 rounded-lg">
                      <ClipboardDocumentListIcon className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        {format(new Date(log.date), 'EEEE, MMMM d, yyyy')}
                      </h3>
                      <p className="text-sm text-gray-500">
                        Logged by {log.user?.name} • {format(new Date(log.created_at), 'h:mm a')}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Weather & Manpower */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div className="flex items-center space-x-3">
                    <CloudIcon className="h-5 w-5 text-gray-400" />
                    <div>
                      <span className="text-sm font-medium text-gray-700">Weather:</span>
                      <span className="ml-2 text-sm text-gray-600">{log.weather}</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <UsersIcon className="h-5 w-5 text-gray-400" />
                    <div>
                      <span className="text-sm font-medium text-gray-700">Manpower:</span>
                      <span className="ml-2 text-sm text-gray-600">{log.manpower_count} workers</span>
                    </div>
                  </div>
                </div>

                {/* Summary */}
                <div className="mb-6">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Daily Summary</h4>
                  <p className="text-gray-600">{log.summary}</p>
                </div>

                {/* Notes */}
                {log.notes && (
                  <div className="mb-6">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Additional Notes</h4>
                    <p className="text-gray-600">{log.notes}</p>
                  </div>
                )}

                {/* Materials Used */}
                {log.materials_used.length > 0 && (
                  <div className="mb-6">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Materials Used</h4>
                    <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                      {log.materials_used.map((material, index) => (
                        <li key={index}>{material}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Issues */}
                {log.issues.length > 0 && (
                  <div className="mb-6">
                    <h4 className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                      <ExclamationTriangleIcon className="h-4 w-4 text-yellow-500 mr-1" />
                      Issues & Concerns
                    </h4>
                    <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                      {log.issues.map((issue, index) => (
                        <li key={index} className="text-red-600">{issue}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Photos */}
                {log.photos.length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                      <CameraIcon className="h-4 w-4 text-gray-400 mr-1" />
                      Site Photos ({log.photos.length})
                    </h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {log.photos.map((photo, index) => (
                        <div key={index} className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                          <img 
                            src={photo} 
                            alt={`Site photo ${index + 1}`}
                            className="w-full h-full object-cover hover:scale-105 transition-transform cursor-pointer"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Empty state */}
        {dailyLogs.length === 0 && (
          <div className="card">
            <div className="p-12 text-center">
              <div className="mx-auto h-24 w-24 text-gray-400 mb-4">
                <ClipboardDocumentListIcon />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No daily logs yet</h3>
              <p className="text-gray-500 mb-6">Start documenting daily progress and site activities.</p>
              <Button>
                <PlusIcon className="h-5 w-5 mr-2" />
                Create First Daily Log
              </Button>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}



