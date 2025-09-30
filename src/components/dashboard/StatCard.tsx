import React from 'react';
import clsx from 'clsx';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ComponentType<{ className?: string }>;
  trend?: {
    value: number;
    label: string;
    isPositive: boolean;
  };
  color?: 'blue' | 'green' | 'yellow' | 'red';
}

export function StatCard({ title, value, icon: Icon, trend, color = 'blue' }: StatCardProps) {
  const colorClasses = {
    blue: 'text-blue-600 bg-blue-50',
    green: 'text-green-600 bg-green-50',
    yellow: 'text-yellow-600 bg-yellow-50',
    red: 'text-red-600 bg-red-50',
  };

  return (
    <div className="card">
      <div className="p-6">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <div className={clsx('p-3 rounded-lg', colorClasses[color])}>
              <Icon className="h-6 w-6" />
            </div>
          </div>
          <div className="ml-5 w-0 flex-1">
            <dl>
              <dt className="text-sm font-medium text-gray-500 truncate">{title}</dt>
              <dd className="text-2xl font-bold text-gray-900">{value}</dd>
            </dl>
          </div>
        </div>
        {trend && (
          <div className="mt-4 flex items-center text-sm">
            <span
              className={clsx(
                'inline-flex items-baseline px-2.5 py-0.5 rounded-full text-sm font-medium',
                trend.isPositive
                  ? 'bg-green-100 text-green-800'
                  : 'bg-red-100 text-red-800'
              )}
            >
              {trend.isPositive ? '+' : ''}{trend.value}%
            </span>
            <span className="ml-2 text-gray-500">{trend.label}</span>
          </div>
        )}
      </div>
    </div>
  );
}




