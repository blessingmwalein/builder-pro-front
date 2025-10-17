'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Dialog } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { createProject } from '@/lib/features/project/projectSlice';
import { CreateProjectForm } from '@/types';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select'; // Custom shadcn select
import { DatePicker } from '@/components/ui/DatePicker'; // Custom shadcn date picker
import { createProjectSchema } from '@/lib/validations/index';

interface CreateProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  companyId?: number;
  initialData?: Partial<CreateProjectForm>;
  onEditSubmit?: (data: CreateProjectForm) => void;
}

const statusOptions = [
  { value: 'planned', label: 'Planned' },
  { value: 'in_progress', label: 'In Progress' },
  { value: 'on_hold', label: 'On Hold' },
  { value: 'completed', label: 'Completed' },
  { value: 'archived', label: 'Archived' },
];

export function CreateProjectModal({
  isOpen,
  onClose,
  companyId,
  initialData,
  onEditSubmit,
}: CreateProjectModalProps) {
  const dispatch = useAppDispatch();
  const { isLoading } = useAppSelector((state) => state.project);

  const isEdit = !!initialData;

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    watch,
    formState: { errors },
  } = useForm<CreateProjectForm>({
    resolver: yupResolver(createProjectSchema),
    defaultValues: initialData || {
      code: '',
      title: '',
      description: '',
      status: 'planned',
      location_text: '',
      latitude: '',
      longitude: '',
      budget_total_cents: 0,
      currency: 'USD',
      start_date: '',
      end_date: '',
    },
  });

  React.useEffect(() => {
    if (initialData) {
      reset(initialData);
    } else {
      reset({
        code: '',
        title: '',
        description: '',
        status: 'planned',
        location_text: '',
        latitude: '',
        longitude: '',
        budget_total_cents: 0,
        currency: 'USD',
        start_date: '',
        end_date: '',
      });
    }
  }, [initialData, reset]);

  const onSubmit = async (data: CreateProjectForm) => {
    if (!companyId) return;
    try {
      if (isEdit && onEditSubmit) {
        await onEditSubmit(data);
      } else {
        await dispatch(createProject({ companyId, data })).unwrap();
        toast.success('Project created!');
      }
      reset();
      onClose();
    } catch (err: any) {
      toast.error(err?.message || 'Failed to save project');
    }
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onClose={handleClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel
          className="mx-auto w-full max-w-4xl bg-white rounded-3xl shadow-2xl p-12 relative flex flex-col"
          style={{ maxHeight: 800, minHeight: 600 }}
        >
          <button
            className="absolute top-6 right-6 text-gray-400 hover:text-gray-700"
            onClick={handleClose}
          >
            <span className="sr-only">Close</span>
            <XMarkIcon className="h-7 w-7" />
          </button>
          <h2 className="text-3xl font-bold mb-8 text-gray-900 flex items-center">
            <span className="inline-flex items-center justify-center h-12 w-12 rounded-full bg-orange-100 mr-4">
              <svg className="h-7 w-7 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </span>
            {isEdit ? 'Edit Project' : 'Create New Project'}
          </h2>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-6 overflow-y-auto"
            style={{ maxHeight: 540 }}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Project Code</label>
                <input
                  {...register('code')}
                  className="w-full px-4 py-2 rounded-full border border-gray-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none bg-white"
                  placeholder="e.g. PRJ-001"
                />
                {errors.code && <p className="text-red-500 text-xs mt-1">{errors.code.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                <input
                  {...register('title')}
                  className="w-full px-4 py-2 rounded-full border border-gray-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none bg-white"
                  placeholder="Project Title"
                />
                {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title.message}</p>}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea
                {...register('description')}
                className="w-full px-4 py-2 rounded-2xl border border-gray-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none bg-white"
                rows={2}
                placeholder="Project Description"
              />
              {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description.message}</p>}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <Select
                  value={watch('status')}
                  onValueChange={val => setValue('status', val)}
                  disabled={isLoading}
                >
                  <SelectTrigger className="w-full rounded-full border border-gray-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 bg-white">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    {statusOptions.map(opt => (
                      <SelectItem key={opt.value} value={opt.value}>
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.status && <p className="text-red-500 text-xs mt-1">{errors.status.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Currency</label>
                <input
                  {...register('currency')}
                  className="w-full px-4 py-2 rounded-full border border-gray-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none bg-white"
                  placeholder="USD"
                />
                {errors.currency && <p className="text-red-500 text-xs mt-1">{errors.currency.message}</p>}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Budget (in cents)</label>
              <input
                type="number"
                {...register('budget_total_cents')}
                className="w-full px-4 py-2 rounded-full border border-gray-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none bg-white"
                placeholder="e.g. 100000"
              />
              {errors.budget_total_cents && <p className="text-red-500 text-xs mt-1">{errors.budget_total_cents.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
              <input
                {...register('location_text')}
                className="w-full px-4 py-2 rounded-full border border-gray-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none bg-white"
                placeholder="e.g. Harare, Zimbabwe"
              />
              {errors.location_text && <p className="text-red-500 text-xs mt-1">{errors.location_text.message}</p>}
            </div>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Latitude</label>
                <input
                  type="number"
                  step="any"
                  {...register('latitude')}
                  className="w-full px-4 py-2 rounded-full border border-gray-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none bg-white"
                  placeholder="-17.8252"
                />
                {errors.latitude && <p className="text-red-500 text-xs mt-1">{errors.latitude.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Longitude</label>
                <input
                  type="number"
                  step="any"
                  {...register('longitude')}
                  className="w-full px-4 py-2 rounded-full border border-gray-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none bg-white"
                  placeholder="31.0335"
                />
                {errors.longitude && <p className="text-red-500 text-xs mt-1">{errors.longitude.message}</p>}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                <div className="flex">
                  <DatePicker
                    value={watch('start_date')}
                    onChange={val => setValue('start_date', val)}
                    className="w-full rounded-full border border-gray-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 bg-white"
                    placeholder="Select start date"
                  />
                </div>
                {errors.start_date && <p className="text-red-500 text-xs mt-1">{errors.start_date.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                <div className="flex">
                  <DatePicker
                    value={watch('end_date')}
                    onChange={val => setValue('end_date', val)}
                    className="w-full rounded-full border border-gray-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 bg-white"
                    placeholder="Select end date"
                  />
                </div>
                {errors.end_date && <p className="text-red-500 text-xs mt-1">{errors.end_date.message}</p>}
              </div>
            </div>
            <div className="flex justify-end gap-3 pt-4">
              <Button type="button" className="px-6 py-2" onClick={handleClose} variant="secondary">
                Cancel
              </Button>
              <Button type="submit" isLoading={isLoading} className="px-6 py-2">
                {isEdit ? 'Save Changes' : 'Create Project'}
              </Button>
            </div>
          </form>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}




