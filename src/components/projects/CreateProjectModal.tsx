'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Dialog } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { createProject } from '@/lib/features/project/projectSlice';
import { createProjectSchema } from '@/lib/validations';
import { CreateProjectForm } from '@/types';

interface CreateProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const statusOptions = [
  { value: 'active', label: 'Active' },
  { value: 'on_hold', label: 'On Hold' },
  { value: 'completed', label: 'Completed' },
  { value: 'cancelled', label: 'Cancelled' },
];

export function CreateProjectModal({ isOpen, onClose }: CreateProjectModalProps) {
  const dispatch = useAppDispatch();
  const { isLoading } = useAppSelector((state) => state.project);
  const { currentCompany } = useAppSelector((state) => state.company);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateProjectForm>({
    resolver: yupResolver(createProjectSchema),
    defaultValues: {
      status: 'active',
    },
  });

  const onSubmit = async (data: CreateProjectForm) => {
    if (!currentCompany) {
      toast.error('No company selected');
      return;
    }

    try {
      await dispatch(createProject({ companyId: currentCompany.id, projectData: data })).unwrap();
      toast.success('Project created successfully!');
      reset();
      onClose();
    } catch (error: any) {
      toast.error(error || 'Failed to create project');
    }
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  return (
    <Dialog open={isOpen} onClose={handleClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="mx-auto max-w-md w-full bg-white rounded-lg shadow-lg">
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <Dialog.Title className="text-lg font-semibold text-gray-900">
              Create New Project
            </Dialog.Title>
            <button
              onClick={handleClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4">
            <Input
              {...register('name')}
              label="Project Name"
              placeholder="Enter project name"
              error={errors.name?.message}
            />

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                {...register('description')}
                rows={3}
                className="input-field resize-none"
                placeholder="Enter project description"
              />
              {errors.description && (
                <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Input
                {...register('start_date')}
                type="date"
                label="Start Date"
                error={errors.start_date?.message}
              />

              <Input
                {...register('end_date')}
                type="date"
                label="End Date"
                error={errors.end_date?.message}
              />
            </div>

            <Select
              {...register('status')}
              label="Status"
              options={statusOptions}
              error={errors.status?.message}
            />

            <div className="flex space-x-3 pt-4">
              <Button
                type="button"
                variant="secondary"
                onClick={handleClose}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                isLoading={isLoading}
                className="flex-1"
              >
                Create Project
              </Button>
            </div>
          </form>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}



