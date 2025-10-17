'use client';

import React, { useEffect } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { fetchNotifications, markAsRead, markAllAsRead } from '@/lib/features/notification/notificationSlice';
import { formatDistanceToNow } from 'date-fns';
import {
  BellIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
  XCircleIcon,
} from '@heroicons/react/24/outline';
import clsx from 'clsx';

const typeIcons = {
  info: InformationCircleIcon,
  success: CheckCircleIcon,
  warning: ExclamationTriangleIcon,
  error: XCircleIcon,
};

const typeColors = {
  info: 'text-blue-600 bg-blue-50',
  success: 'text-green-600 bg-green-50',
  warning: 'text-yellow-600 bg-yellow-50',
  error: 'text-red-600 bg-red-50',
};

export default function NotificationsPage() {
  const dispatch = useAppDispatch();
  const { notifications, unreadCount, isLoading } = useAppSelector((state) => state.notification);

  useEffect(() => {
    dispatch(fetchNotifications());
  }, [dispatch]);

  const handleMarkAsRead = (id: number) => {
    dispatch(markAsRead(id));
  };

  const handleMarkAllAsRead = () => {
    dispatch(markAllAsRead());
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-20 bg-gray-200 rounded-lg"></div>
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
            <h1 className="text-3xl font-bold text-gray-900">Notifications</h1>
            <p className="mt-2 text-gray-600">
              Stay updated with project activities and important alerts
            </p>
          </div>
          {unreadCount > 0 && (
            <Button variant="secondary" onClick={handleMarkAllAsRead}>
              Mark all as read ({unreadCount})
            </Button>
          )}
        </div>

        {/* Notifications List */}
        <div className="space-y-4">
          {notifications.map((notification) => {
            const Icon = typeIcons[notification.type];
            const isUnread = !notification.read_at;
            
            return (
              <div
                key={notification.id}
                className={clsx(
                  'card cursor-pointer transition-all duration-200',
                  isUnread ? 'border-blue-200 bg-blue-50/50' : 'hover:shadow-md'
                )}
                onClick={() => isUnread && handleMarkAsRead(notification.id)}
              >
                <div className="p-6">
                  <div className="flex items-start space-x-4">
                    <div className={clsx(
                      'p-2 rounded-lg flex-shrink-0',
                      typeColors[notification.type]
                    )}>
                      <Icon className="h-5 w-5" />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className={clsx(
                          'text-sm font-medium truncate',
                          isUnread ? 'text-gray-900' : 'text-gray-700'
                        )}>
                          {notification.title}
                        </h3>
                        {isUnread && (
                          <div className="w-2 h-2 bg-blue-600 rounded-full flex-shrink-0 ml-2" />
                        )}
                      </div>
                      
                      <p className="text-sm text-gray-600 mb-2">
                        {notification.message}
                      </p>
                      
                      <p className="text-xs text-gray-400">
                        {formatDistanceToNow(new Date(notification.created_at), { addSuffix: true })}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Empty state */}
        {notifications.length === 0 && (
          <div className="card">
            <div className="p-12 text-center">
              <div className="mx-auto h-24 w-24 text-gray-400 mb-4">
                <BellIcon />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No notifications</h3>
              <p className="text-gray-500">You're all caught up! New notifications will appear here.</p>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}




