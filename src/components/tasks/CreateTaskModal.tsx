'use client';

import React, { useMemo, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Dialog } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { createTask } from '@/lib/features/task/taskSlice';
import { fetchCompanyUsers } from '@/lib/features/company/companySlice'; // <-- add this import (see below for implementation)
import { CreateTaskForm } from '@/types';
import { createTaskSchema } from '@/lib/validations/index';
// shadcn/ui components
// import { DatePicker } from '@/components/ui/date-picker'; // shadcn/ui DatePicker
// import { Select } from '../ui/Select';
import { DatePicker } from '../ui/DatePicker';
// Use shadcn/ui select (lowercase) and its subcomponents
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select';
import { Loader2 } from "lucide-react";

interface CreateTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultTaskListId?: number;
  initialData?: Partial<CreateTaskForm>; // <-- add this prop for edit mode
}

const priorityOptions = [
  { value: 'low', label: 'Low' },
  { value: 'normal', label: 'Normal' },
  { value: 'high', label: 'High' },
  { value: 'critical', label: 'Critical' },
];

const statusOptions = [
  { value: 'todo', label: 'Planned' },
  { value: 'in_progress', label: 'In Progress' },
  { value: 'blocked', label: 'Blocked' },
  { value: 'done', label: 'Done' }
];

export function CreateTaskModal({
  isOpen,
  onClose,
  defaultTaskListId,
  initialData,
}: CreateTaskModalProps) {
  const dispatch = useAppDispatch();
  const taskLists = useAppSelector((state) => state.task.taskLists);
  const isLoading = useAppSelector((state) => state.task.isLoading);
  const companyId = useAppSelector((state) => state.auth.user?.company?.id);
  const projectId = useAppSelector((state) => state.project.currentProject?.id); // <-- get projectId from state
  const users = useAppSelector((state) => state.company?.users || []);

  // Fetch company users when modal opens
  useEffect(() => {
    if (isOpen && companyId) {
      dispatch(fetchCompanyUsers(companyId));
    }
  }, [isOpen, companyId, dispatch]);

  // Task list options
  const taskListOptions = useMemo(
    () =>
      taskLists.map(list => ({
        value: list.id.toString(),
        label: list.name,
      })),
    [taskLists]
  );

  // User options with avatar, name, email
  const assigneeOptions = useMemo(
    () =>
      [
        { value: 'unassigned', label: 'Unassigned', avatar: null, email: null },
        ...users.map(user => ({
          value: user.id.toString(),
          label: user.name,
          avatar: user.avatar_url,
          email: user.email,
        })),
      ],
    [users]
  );

  // Detect edit mode
  const isEdit = !!initialData;

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<CreateTaskForm>({
    resolver: yupResolver(createTaskSchema),
    defaultValues: initialData || {
      task_list_id: defaultTaskListId || taskLists[0]?.id,
      priority: 'normal',
      status: 'todo',
    },
  });

  // Reset form when initialData changes (edit mode)
  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        reset(initialData);
      } else {
        reset({
          task_list_id: defaultTaskListId || taskLists[0]?.id,
          priority: 'normal',
          status: 'todo',
        });
      }
    }
  }, [isOpen, initialData, defaultTaskListId, taskLists, reset]);

  // If opened for a specific task list, disable the selector
  const isTaskListFixed = !!defaultTaskListId;

  // Set correct default value for task_list_id when modal opens or defaultTaskListId changes
  React.useEffect(() => {
    if (isOpen) {
      if (defaultTaskListId) {
        setValue('task_list_id', defaultTaskListId);
      } else if (taskLists.length > 0) {
        setValue('task_list_id', taskLists[0].id);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, defaultTaskListId, taskLists, setValue]);

  // Remove due date/start date cross-validation and allow assignee_id to be null or "unassigned"
  // If you have a custom validation schema, update it to:
  // - Remove any test that checks due_date > start_date
  // - Make assignee_id optional and allow string or number

  // Example for a relaxed schema (if you use yup):
  // const createTaskSchema = yup.object().shape({
  //   ...otherFields,
  //   assignee_id: yup.mixed().nullable(),
  //   due_date: yup.string().nullable(),
  // });

  const onSubmit = async (data: CreateTaskForm) => {
    try {
      if (!companyId || !projectId) {
        toast.error("Missing company or project ID");
        return;
      }
      const taskData = {
        ...data,
        title: data.title,
        task_list_id: Number(data.task_list_id),
        assignee_id:
          !data.assignee_id || data.assignee_id === "unassigned"
            ? undefined
            : Number(data.assignee_id),
      };
      const cleanTaskData = Object.fromEntries(
        Object.entries(taskData).filter(([_, v]) => v !== undefined && v !== null)
      );
      if (isEdit && initialData?.id) {
        // Dispatch updateTask thunk here (implement in your slice)
        // await dispatch(updateTask({ companyId, projectId, taskId: initialData.id, data: cleanTaskData })).unwrap();
        toast.success('Task updated successfully!');
      } else {
        await dispatch(
          createTask({
            companyId,
            projectId,
            data: cleanTaskData,
          })
        ).unwrap();
        toast.success('Task created successfully!');
      }
      reset();
      onClose();
    } catch (error: any) {
      // Show clean error message for API 422 and similar errors
      let message = "Failed to save task";
      if (error?.message) {
        message = error.message;
      }
      // Laravel validation error format
      if (error?.errors && typeof error.errors === "object") {
        const firstField = Object.keys(error.errors)[0];
        if (firstField && Array.isArray(error.errors[firstField]) && error.errors[firstField][0]) {
          message = error.errors[firstField][0];
        }
      }
      toast.error(message);
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
        <Dialog.Panel className="mx-auto max-w-2xl w-full bg-white rounded-2xl shadow-lg">
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <Dialog.Title className="text-lg font-semibold text-gray-900">
              {isEdit ? "Edit Task" : "Create New Task"}
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
              className="rounded-full"
            />

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                {...register('description')}
                rows={3}
                className="w-full px-4 py-2 rounded-xl border border-gray-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none bg-white"
                placeholder="Enter task description"
              />
              {errors.description && (
                <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
              )}
            </div>

            {/* Task List Selector */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Task List</label>
              <Select
                value={watch('task_list_id')?.toString() || ''}
                onValueChange={val => setValue('task_list_id', Number(val))}
                disabled={isTaskListFixed}
              >
                <SelectTrigger className="w-full rounded-full border border-gray-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 bg-white">
                  <SelectValue placeholder="Select task list" />
                </SelectTrigger>
                <SelectContent>
                  {taskListOptions.map(opt => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.task_list_id && (
                <p className="mt-1 text-sm text-red-600">{errors.task_list_id.message}</p>
              )}
            </div>

            {/* Status Selector */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <Select
                value={watch('status')}
                onValueChange={val => setValue('status', val)}
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
              {errors.status && (
                <p className="mt-1 text-sm text-red-600">{errors.status.message}</p>
              )}
            </div>

            {/* Priority and Assignee */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                <Select
                  value={watch('priority')}
                  onValueChange={val => setValue('priority', val)}
                >
                  <SelectTrigger className="w-full rounded-full border border-gray-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 bg-white">
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                  <SelectContent>
                    {priorityOptions.map(opt => (
                      <SelectItem key={opt.value} value={opt.value}>
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.priority && (
                  <p className="mt-1 text-sm text-red-600">{errors.priority.message}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Assignee</label>
                <Select
                  value={watch('assignee_id')?.toString() || ''}
                  onValueChange={val => setValue('assignee_id', val)}
                >
                  <SelectTrigger className="w-full rounded-full border border-gray-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 bg-white">
                    <SelectValue placeholder="Select assignee" />
                  </SelectTrigger>
                  <SelectContent>
                    {assigneeOptions.map(opt => (
                      <SelectItem key={opt.value} value={opt.value}>
                        <div className="flex flex-col items-start">
                          <div className="flex items-center gap-2">
                            {opt.avatar && (
                              <img src={opt.avatar} alt={opt.label} className="h-6 w-6 rounded-full" />
                            )}
                            <span>{opt.label}</span>
                          </div>
                          {opt.email && (
                            <span className="text-xs text-gray-500">{opt.email}</span>
                          )}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.assignee_id && (
                  <p className="mt-1 text-sm text-red-600">{errors.assignee_id.message}</p>
                )}
              </div>
            </div>

            {/* Due Date */}
            <div className='grid grid-cols-2 gap-4'>
             <div>
               <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
              <DatePicker
                value={watch('start_date') || ''}
                onChange={val => setValue('start_date', val)}
                className="w-full rounded-full border border-gray-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 bg-white"
                placeholder="Select due date"
              />
              {errors.start_date && (
                <p className="mt-1 text-sm text-red-600">{errors.start_date.message}</p>
              )}
             </div>
             <div>
               <label className="block text-sm font-medium text-gray-700 mb-1">Due Date</label>
              <DatePicker
                value={watch('due_date') || ''}
                onChange={val => setValue('due_date', val)}
                className="w-full rounded-full border border-gray-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 bg-white"
                placeholder="Select due date"
              />
              {errors.due_date && (
                <p className="mt-1 text-sm text-red-600">{errors.due_date.message}</p>
              )}
             </div>
            </div>

            {/* Action buttons bottom right, not full width */}
            <div className="flex justify-end gap-3 pt-4">
              <Button
                type="button"
                variant="secondary"
                onClick={handleClose}
                disabled={isLoading || isSubmitting}
                className="px-6 py-2 rounded-full"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                isLoading={isLoading || isSubmitting}
                disabled={isLoading || isSubmitting}
                suffixIcon={
                  (isLoading || isSubmitting) ? <Loader2 className="animate-spin h-5 w-5" /> : undefined
                }
                className="px-6 py-2 rounded-full"
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




