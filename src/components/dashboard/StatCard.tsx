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

export function StatCard({
  title,
  value,
  icon: Icon,
  color,
  trend,
}: {
  title: string;
  value: string;
  icon: React.ElementType;
  color: string;
  trend?: { value: number; label: string; isPositive: boolean };
}) {
  return (
    <div
      className={`bg-white rounded-2xl p-6 flex flex-col items-start border border-gray-200`}
    >
      <div className="flex items-center mb-2">
        <span
          className={`inline-flex items-center justify-center rounded-full bg-${color}-100 text-${color}-600 mr-3`}
          style={{ width: 36, height: 36 }}
        >
          <Icon className="h-6 w-6" />
        </span>
        <span className="text-sm text-gray-500">{title}</span>
      </div>
      <div
        className={`text-2xl font-normal text-gray-900`}
      >
        {value}
      </div>
      {trend && (
        <div className="flex items-center mt-1 text-xs text-gray-500">
          <span className={trend.isPositive ? 'text-green-600' : 'text-red-600'}>
            {trend.value > 0 ? `+${trend.value}%` : `${trend.value}%`}
          </span>
          <span className="ml-1">{trend.label}</span>
        </div>
      )}
    </div>
  );
}




