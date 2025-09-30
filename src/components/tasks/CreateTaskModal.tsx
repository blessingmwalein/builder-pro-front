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
import { createTask } from '@/lib/features/task/taskSlice';
import { createTaskSchema } from '@/lib/validations';
import { CreateTaskForm } from '@/types';

interface CreateTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultTaskListId?: number;
}

const priorityOptions = [
  { value: 'low', label: 'Low' },
  { value: 'medium', label: 'Medium' },
  { value: 'high', label: 'High' },
];

export function CreateTaskModal({ isOpen, onClose, defaultTaskListId }: CreateTaskModalProps) {
  const dispatch = useAppDispatch();
  const { isLoading, taskLists } = useAppSelector((state) => state.task);
  const { users } = useAppSelector((state) => state.company);

  const taskListOptions = taskLists.map(list => ({
    value: list.id.toString(),
    label: list.name,
  }));

  const assigneeOptions = [
    { value: '', label: 'Unassigned' },
    ...users.map(user => ({
      value: user.id.toString(),
      label: user.name,
    })),
  ];

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateTaskForm>({
    resolver: yupResolver(createTaskSchema),
    defaultValues: {
      task_list_id: defaultTaskListId || taskLists[0]?.id,
      priority: 'medium',
    },
  });

  const onSubmit = async (data: CreateTaskForm) => {
    try {
      const taskData = {
        ...data,
        task_list_id: Number(data.task_list_id),
        assignee_id: data.assignee_id ? Number(data.assignee_id) : undefined,
      };
      
      await dispatch(createTask(taskData)).unwrap();
      toast.success('Task created successfully!');
      reset();
      onClose();
    } catch (error: any) {
      toast.error(error || 'Failed to create task');
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
              Create New Task
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
              {...register('title')}
              label="Task Title"
              placeholder="Enter task title"
              error={errors.title?.message}
            />

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                {...register('description')}
                rows={3}
                className="input-field resize-none"
                placeholder="Enter task description"
              />
              {errors.description && (
                <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
              )}
            </div>

            <Select
              {...register('task_list_id')}
              label="Task List"
              options={taskListOptions}
              error={errors.task_list_id?.message}
            />

            <div className="grid grid-cols-2 gap-4">
              <Select
                {...register('priority')}
                label="Priority"
                options={priorityOptions}
                error={errors.priority?.message}
              />

              <Select
                {...register('assignee_id')}
                label="Assignee"
                options={assigneeOptions}
                error={errors.assignee_id?.message}
              />
            </div>

            <Input
              {...register('due_date')}
              type="date"
              label="Due Date (Optional)"
              error={errors.due_date?.message}
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
                Create Task
              </Button>
            </div>
          </form>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}




