'use client';

import React, { useEffect, useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { fetchProjectPhotos } from '@/lib/features/media/mediaSlice';
import { format } from 'date-fns';
import {
  CameraIcon,
  PlusIcon,
  MagnifyingGlassIcon,
  CalendarIcon,
  UserIcon,
  EyeIcon,
  TrashIcon,
} from '@heroicons/react/24/outline';

export default function PhotosPage() {
  const dispatch = useAppDispatch();
  const { photos, isLoading } = useAppSelector((state) => state.media);
  const { currentCompany } = useAppSelector((state) => state.company);
  const { currentProject } = useAppSelector((state) => state.project);
  
  const [selectedPhoto, setSelectedPhoto] = useState<any>(null);

  useEffect(() => {
    if (currentCompany && currentProject) {
      dispatch(fetchProjectPhotos({ companyId: currentCompany.id, projectId: currentProject.id }));
    }
  }, [dispatch, currentCompany, currentProject]);

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="aspect-square bg-gray-200 rounded-lg"></div>
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
            <p className="mt-2 text-gray-500">Please select a project to view site photos.</p>
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
            <h1 className="text-3xl font-bold text-gray-900">Site Photos</h1>
            <p className="mt-2 text-gray-600">
              {currentProject.name} - Visual documentation of project progress
            </p>
          </div>
          <div className="flex space-x-3">
            <Button variant="secondary">
              <MagnifyingGlassIcon className="h-5 w-5 mr-2" />
              Filter
            </Button>
            <Button>
              <PlusIcon className="h-5 w-5 mr-2" />
              Upload Photos
            </Button>
          </div>
        </div>

        {/* Photos Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {photos.map((photo) => (
            <div key={photo.id} className="group relative bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <div className="aspect-square">
                <img
                  src={photo.url}
                  alt={photo.caption}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                />
              </div>
              
              {/* Overlay */}
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-200 flex items-center justify-center">
                <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex space-x-2">
                  <button
                    onClick={() => setSelectedPhoto(photo)}
                    className="p-2 bg-white rounded-full text-gray-700 hover:bg-gray-100"
                  >
                    <EyeIcon className="h-5 w-5" />
                  </button>
                  <button className="p-2 bg-white rounded-full text-red-600 hover:bg-gray-100">
                    <TrashIcon className="h-5 w-5" />
                  </button>
                </div>
              </div>

              {/* Photo Info */}
              <div className="p-4">
                <h3 className="text-sm font-medium text-gray-900 truncate mb-1">
                  {photo.caption}
                </h3>
                
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <div className="flex items-center">
                    <CalendarIcon className="h-3 w-3 mr-1" />
                    {format(new Date(photo.taken_at), 'MMM d, yyyy')}
                  </div>
                  
                  <div className="flex items-center">
                    <UserIcon className="h-3 w-3 mr-1" />
                    {photo.user?.name}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty state */}
        {photos.length === 0 && (
          <div className="text-center py-12">
            <div className="mx-auto h-24 w-24 text-gray-400 mb-4">
              <CameraIcon />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No photos yet</h3>
            <p className="text-gray-500 mb-6">Start documenting your project progress with photos.</p>
            <Button>
              <PlusIcon className="h-5 w-5 mr-2" />
              Upload First Photos
            </Button>
          </div>
        )}

        {/* Photo Modal */}
        {selectedPhoto && (
          <div className="fixed inset-0 z-50 bg-black bg-opacity-75 flex items-center justify-center p-4">
            <div className="max-w-4xl max-h-full bg-white rounded-lg overflow-hidden">
              <div className="flex items-center justify-between p-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">
                  {selectedPhoto.caption}
                </h3>
                <button
                  onClick={() => setSelectedPhoto(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ×
                </button>
              </div>
              
              <div className="p-4">
                <img
                  src={selectedPhoto.url}
                  alt={selectedPhoto.caption}
                  className="w-full h-auto max-h-96 object-contain"
                />
                
                <div className="mt-4 flex items-center justify-between text-sm text-gray-500">
                  <div className="flex items-center">
                    <CalendarIcon className="h-4 w-4 mr-1" />
                    Taken on {format(new Date(selectedPhoto.taken_at), 'MMMM d, yyyy')}
                  </div>
                  
                  <div className="flex items-center">
                    <UserIcon className="h-4 w-4 mr-1" />
                    By {selectedPhoto.user?.name}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}




