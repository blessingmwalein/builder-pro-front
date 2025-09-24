import React from 'react';
import { Task } from '@/types';
import { format } from 'date-fns';
import {
  CalendarIcon,
  UserIcon,
  ExclamationTriangleIcon,
} from '@heroicons/react/24/outline';
import clsx from 'clsx';

interface TaskCardProps {
  task: Task;
  onClick: () => void;
}

const priorityColors = {
  low: 'bg-green-100 text-green-800',
  medium: 'bg-yellow-100 text-yellow-800',
  high: 'bg-red-100 text-red-800',
};

const statusColors = {
  pending: 'bg-gray-100 text-gray-800',
  in_progress: 'bg-blue-100 text-blue-800',
  completed: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800',
};

export function TaskCard({ task, onClick }: TaskCardProps) {
  const isOverdue = task.due_date && new Date(task.due_date) < new Date() && task.status !== 'completed';

  return (
    <div 
      className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 cursor-pointer hover:shadow-md transition-shadow duration-200"
      onClick={onClick}
    >
      <div className="flex items-start justify-between mb-3">
        <h4 className="text-sm font-medium text-gray-900 flex-1 truncate">
          {task.title}
        </h4>
        <div className="flex items-center space-x-2 ml-2">
          <span className={clsx(
            'inline-flex items-center px-2 py-0.5 rounded text-xs font-medium capitalize',
            priorityColors[task.priority]
          )}>
            {task.priority}
          </span>
          {isOverdue && (
            <ExclamationTriangleIcon className="h-4 w-4 text-red-500" />
          )}
        </div>
      </div>

      <p className="text-xs text-gray-600 mb-3 line-clamp-2">
        {task.description}
      </p>

      <div className="flex items-center justify-between text-xs text-gray-500">
        <div className="flex items-center space-x-3">
          {task.assignee && (
            <div className="flex items-center">
              <UserIcon className="h-3 w-3 mr-1" />
              <span>{task.assignee.name}</span>
            </div>
          )}
          
          {task.due_date && (
            <div className={clsx(
              'flex items-center',
              isOverdue && 'text-red-600'
            )}>
              <CalendarIcon className="h-3 w-3 mr-1" />
              <span>{format(new Date(task.due_date), 'MMM d')}</span>
            </div>
          )}
        </div>

        <span className={clsx(
          'inline-flex items-center px-2 py-0.5 rounded text-xs font-medium capitalize',
          statusColors[task.status]
        )}>
          {task.status.replace('_', ' ')}
        </span>
      </div>
    </div>
  );
}
