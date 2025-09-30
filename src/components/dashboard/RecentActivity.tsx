'use client';

import React from 'react';
import { formatDistanceToNow } from 'date-fns';
import {
  CheckCircleIcon,
  ClockIcon,
  ExclamationTriangleIcon,
  UserPlusIcon,
} from '@heroicons/react/24/outline';

const activities = [
  {
    id: 1,
    type: 'task_completed',
    title: 'Foundation work completed',
    description: 'Task "Foundation excavation" marked as complete',
    user: 'John Doe',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    icon: CheckCircleIcon,
    iconColor: 'text-green-600',
  },
  {
    id: 2,
    type: 'task_overdue',
    title: 'Task overdue',
    description: 'Electrical inspection is 2 days overdue',
    user: 'System',
    timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 hours ago
    icon: ExclamationTriangleIcon,
    iconColor: 'text-red-600',
  },
  {
    id: 3,
    type: 'user_added',
    title: 'New team member added',
    description: 'Sarah Johnson joined as Site Supervisor',
    user: 'Admin',
    timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6 hours ago
    icon: UserPlusIcon,
    iconColor: 'text-blue-600',
  },
  {
    id: 4,
    type: 'task_created',
    title: 'New task created',
    description: 'Plumbing rough-in scheduled for next week',
    user: 'Jane Smith',
    timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000), // 8 hours ago
    icon: ClockIcon,
    iconColor: 'text-yellow-600',
  },
];

export function RecentActivity() {
  return (
    <div className="card">
      <div className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
        <div className="flow-root">
          <ul className="-mb-8">
            {activities.map((activity, index) => (
              <li key={activity.id}>
                <div className="relative pb-8">
                  {index !== activities.length - 1 && (
                    <span
                      className="absolute left-5 top-5 -ml-px h-full w-0.5 bg-gray-200"
                      aria-hidden="true"
                    />
                  )}
                  <div className="relative flex items-start space-x-3">
                    <div className="relative">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100">
                        <activity.icon className={`h-5 w-5 ${activity.iconColor}`} />
                      </div>
                    </div>
                    <div className="min-w-0 flex-1">
                      <div>
                        <div className="text-sm">
                          <span className="font-medium text-gray-900">{activity.title}</span>
                        </div>
                        <p className="mt-0.5 text-sm text-gray-500">{activity.description}</p>
                        <div className="mt-2 flex items-center text-xs text-gray-400">
                          <span>{activity.user}</span>
                          <span className="mx-1">·</span>
                          <span>{formatDistanceToNow(activity.timestamp, { addSuffix: true })}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
        <div className="mt-6">
          <button className="w-full text-center text-sm text-blue-600 hover:text-blue-500 font-medium">
            View all activity
          </button>
        </div>
      </div>
    </div>
  );
}




