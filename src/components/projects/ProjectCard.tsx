import React from 'react';
import { Project } from '@/types';
import { format } from 'date-fns';
import {
  CalendarIcon,
  CurrencyDollarIcon,
  MapPinIcon,
  IdentificationIcon,
  EllipsisVerticalIcon,
  PencilIcon,
  EyeIcon,
  TrashIcon,
  ArrowPathIcon,
} from '@heroicons/react/24/outline';
import clsx from 'clsx';

interface ProjectCardProps {
  project: Project;
  onClick: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  onView?: () => void;
  onStatusChange?: (status: string) => void;
}

const statusColors = {
  planned: 'bg-blue-100 text-blue-700',
  in_progress: 'bg-orange-100 text-orange-700',
  on_hold: 'bg-yellow-100 text-yellow-700',
  completed: 'bg-green-100 text-green-700',
  archived: 'bg-gray-100 text-gray-500',
};

const statusOptions = [
  { value: 'planned', label: 'Planned' },
  { value: 'in_progress', label: 'In Progress' },
  { value: 'on_hold', label: 'On Hold' },
  { value: 'completed', label: 'Completed' },
  { value: 'archived', label: 'Archived' },
];

export function ProjectCard({
  project,
  onClick,
  onEdit,
  onDelete,
  onView,
  onStatusChange,
}: ProjectCardProps) {
  // Format budget as dollars (assuming cents)
  const budget = project.budget_total_cents
    ? `$${(project.budget_total_cents / 100).toLocaleString(undefined, { maximumFractionDigits: 2 })} ${project.currency || ''}`
    : 'N/A';

  // Format dates
  const startDate = project.start_date ? format(new Date(project.start_date), 'MMM d, yyyy') : '';
  const endDate = project.end_date ? format(new Date(project.end_date), 'MMM d, yyyy') : '';

  // Dropdown state
  const [dropdownOpen, setDropdownOpen] = React.useState(false);

  return (
    <div
      className="card cursor-pointer hover:shadow-md transition-shadow duration-200 relative"
      onClick={onClick}
    >
      <div className="p-6 pb-14 relative">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 truncate flex items-center">
            <IdentificationIcon className="h-5 w-5 text-gray-400 mr-2" />
            {project.code}
          </h3>
          <span className={clsx(
            'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize',
            statusColors[project.status as keyof typeof statusColors] || 'bg-gray-100 text-gray-800'
          )}>
            {project.status.replace('_', ' ')}
          </span>
        </div>

        <div className="flex items-center text-xs text-gray-500 mb-2">
          <MapPinIcon className="h-4 w-4 mr-1" />
          <span className="truncate">{project.location_text || 'No location set'}</span>
          {project.latitude && project.longitude && (
            <a
              href={`https://www.google.com/maps?q=${project.latitude},${project.longitude}`}
              target="_blank"
              rel="noopener noreferrer"
              className="ml-2 text-blue-500 hover:underline"
              title="View on map"
              onClick={e => e.stopPropagation()}
            >
              View
            </a>
          )}
        </div>

        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
          {project.description}
        </p>

        <div className="space-y-2">
          <div className="flex items-center text-sm text-gray-500">
            <CalendarIcon className="h-4 w-4 mr-2" />
            <span>
              {startDate} - {endDate}
            </span>
          </div>
          <div className="flex items-center text-sm text-gray-500">
            <CurrencyDollarIcon className="h-4 w-4 mr-2" />
            <span>{budget}</span>
          </div>
        </div>

        {/* Action Dropdown Button - bottom right */}
        <div className="absolute bottom-4 right-4 z-30">
          <button
            type="button"
            className="p-2 rounded-full bg-gradient-to-tr from-orange-400 via-orange-500 to-yellow-400 text-white shadow hover:scale-105 transition"
            onClick={e => {
              e.stopPropagation();
              setDropdownOpen((open) => !open);
            }}
          >
            <EllipsisVerticalIcon className="h-5 w-5" />
          </button>
          {dropdownOpen && (
            <div
              className="fixed z-[1050] w-44 bg-white border border-gray-200 rounded-xl shadow-2xl"
              style={{
                bottom: '2.5rem',
                right: undefined,
                left: 'auto',
                transform: 'translateX(-100%)',
              }}
            >
              <button
                className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                onClick={e => {
                  e.stopPropagation();
                  setDropdownOpen(false);
                  onView?.();
                }}
              >
                <EyeIcon className="h-4 w-4 mr-2" /> View
              </button>
              <button
                className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                onClick={e => {
                  e.stopPropagation();
                  setDropdownOpen(false);
                  onEdit?.();
                }}
              >
                <PencilIcon className="h-4 w-4 mr-2" /> Edit
              </button>
              <button
                className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                onClick={e => {
                  e.stopPropagation();
                  setDropdownOpen(false);
                  onDelete?.();
                }}
              >
                <TrashIcon className="h-4 w-4 mr-2" /> Delete
              </button>
              <div className="border-t my-1" />
              <div className="px-4 py-2">
                <span className="block text-xs text-gray-500 mb-1">Change Status</span>
                <div className="space-y-1">
                  {statusOptions.map(opt => (
                    <button
                      key={opt.value}
                      className={clsx(
                        "flex items-center w-full px-2 py-1 rounded text-xs",
                        project.status === opt.value
                          ? "bg-orange-100 text-orange-700 font-semibold"
                          : "hover:bg-gray-100 text-gray-700"
                      )}
                      onClick={e => {
                        e.stopPropagation();
                        setDropdownOpen(false);
                        if (onStatusChange && opt.value !== project.status) {
                          onStatusChange(opt.value);
                        }
                      }}
                    >
                      <ArrowPathIcon className="h-3 w-3 mr-2" />
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}




