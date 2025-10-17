'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Dialog } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { createTaskList } from '@/lib/features/task/taskSlice';
import * as yup from 'yup';

interface CreateTaskListModalProps {
  isOpen: boolean;
  onClose: () => void;
  companyId: number;
  projectId: number;
  initialData?: { name: string; order_index: number; id?: number }; // <-- add for edit mode
}

const createTaskListSchema = yup.object().shape({
  name: yup.string().required('List name is required'),
  order_index: yup.number().min(0, 'Order index must be 0 or greater').required('Order index is required'),
});

type CreateTaskListForm = {
  name: string;
  order_index: number;
};

export function CreateTaskListModal({
  isOpen,
  onClose,
  companyId,
  projectId,
  initialData,
}: CreateTaskListModalProps) {
  const dispatch = useAppDispatch();
  const { taskLists, isLoading } = useAppSelector((state) => state.task);

  // Calculate next order_index automatically
  const nextOrderIndex = React.useMemo(() => {
    if (!taskLists || taskLists.length === 0) return 0;
    const maxIndex = Math.max(...taskLists.map(l => l.order_index ?? 0));
    return maxIndex + 1;
  }, [taskLists]);

  const isEdit = !!initialData;

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<CreateTaskListForm>({
    resolver: yupResolver(createTaskListSchema),
    defaultValues: initialData || {
      name: '',
      order_index: nextOrderIndex,
    },
  });

  // Reset form when initialData changes (edit mode)
  React.useEffect(() => {
    if (isOpen) {
      if (initialData) {
        reset(initialData);
      } else {
        reset({
          name: '',
          order_index: nextOrderIndex,
        });
      }
    }
  }, [isOpen, initialData, nextOrderIndex, reset]);

  const onSubmit = async (data: CreateTaskListForm) => {
    try {
      if (isEdit && initialData?.id) {
        // Dispatch updateTaskList thunk here (implement in your slice)
        // await dispatch(updateTaskList({ companyId, projectId, taskListId: initialData.id, data })).unwrap();
        toast.success('Task list updated successfully!');
      } else {
        await dispatch(createTaskList({ companyId, projectId, data })).unwrap();
        toast.success('Task list created successfully!');
      }
      reset();
      onClose();
    } catch (error: any) {
      toast.error(error?.message || 'Failed to save task list');
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
              {isEdit ? "Edit Task List" : "Create New Task List"}
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
              className='w-full px-4 py-2 rounded-full border border-gray-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none bg-white'
              label="List Name"
              placeholder="Enter list name"
              error={errors.name?.message}
            />
            <Input
              {...register('order_index')}
              className='w-full px-4 py-2 rounded-full border border-gray-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none bg-white'
              type="number"
              label="Order Index"
              placeholder="0"
              error={errors.order_index?.message}
              disabled
              value={nextOrderIndex}
              // value is controlled by React/useForm, so this ensures it's always correct and not user-editable
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
                Create List
              </Button>
            </div>
          </form>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}
