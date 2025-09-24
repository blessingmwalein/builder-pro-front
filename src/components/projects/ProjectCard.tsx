import React from 'react';
import { Project } from '@/types';
import { format } from 'date-fns';
import {
  CalendarIcon,
  UserGroupIcon,
  CurrencyDollarIcon,
} from '@heroicons/react/24/outline';
import clsx from 'clsx';

interface ProjectCardProps {
  project: Project;
  onClick: () => void;
}

const statusColors = {
  active: 'bg-green-100 text-green-800',
  completed: 'bg-blue-100 text-blue-800',
  on_hold: 'bg-yellow-100 text-yellow-800',
  cancelled: 'bg-red-100 text-red-800',
};

export function ProjectCard({ project, onClick }: ProjectCardProps) {
  return (
    <div 
      className="card cursor-pointer hover:shadow-md transition-shadow duration-200"
      onClick={onClick}
    >
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 truncate">
            {project.name}
          </h3>
          <span className={clsx(
            'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize',
            statusColors[project.status]
          )}>
            {project.status.replace('_', ' ')}
          </span>
        </div>

        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
          {project.description}
        </p>

        <div className="space-y-2">
          <div className="flex items-center text-sm text-gray-500">
            <CalendarIcon className="h-4 w-4 mr-2" />
            <span>
              {format(new Date(project.start_date), 'MMM d')} - {format(new Date(project.end_date), 'MMM d, yyyy')}
            </span>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center text-sm text-gray-500">
              <UserGroupIcon className="h-4 w-4 mr-2" />
              <span>8 members</span>
            </div>
            
            <div className="flex items-center text-sm text-gray-500">
              <CurrencyDollarIcon className="h-4 w-4 mr-2" />
              <span>$87.5k / $150k</span>
            </div>
          </div>
        </div>

        {/* Progress bar */}
        <div className="mt-4">
          <div className="flex items-center justify-between text-sm mb-1">
            <span className="text-gray-500">Progress</span>
            <span className="font-medium text-gray-900">65%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: '65%' }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}



