'use client';

import React, { useEffect, useState } from 'react';
import { DragDropContext, DropResult } from 'react-beautiful-dnd';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { TaskColumn } from '@/components/tasks/TaskColumn';
import { CreateTaskModal } from '@/components/tasks/CreateTaskModal';
import { Button } from '@/components/ui/Button';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { fetchTaskLists, fetchTasks, moveTask } from '@/lib/features/task/taskSlice';
import { fetchCompanyUsers } from '@/lib/features/company/companySlice';
import { PlusIcon, AdjustmentsHorizontalIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

export default function TasksPage() {
  const dispatch = useAppDispatch();
  const { taskLists, tasks, isLoading } = useAppSelector((state) => state.task);
  const { currentCompany } = useAppSelector((state) => state.company);
  const { currentProject } = useAppSelector((state) => state.project);
  
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [defaultTaskListId, setDefaultTaskListId] = useState<number | undefined>();

  useEffect(() => {
    if (currentCompany && currentProject) {
      dispatch(fetchTaskLists({ companyId: currentCompany.id, projectId: currentProject.id }));
      dispatch(fetchTasks({ companyId: currentCompany.id, projectId: currentProject.id }));
      dispatch(fetchCompanyUsers(currentCompany.id));
    }
  }, [dispatch, currentCompany, currentProject]);

  const handleDragEnd = (result: DropResult) => {
    const { destination, source, draggableId } = result;

    if (!destination) return;

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    const taskId = parseInt(draggableId);
    const newListId = parseInt(destination.droppableId);
    const newIndex = destination.index;

    dispatch(moveTask({ taskId, newListId, newIndex }));
    toast.success('Task moved successfully');
  };

  const handleAddTask = (taskListId: number) => {
    setDefaultTaskListId(taskListId);
    setIsCreateModalOpen(true);
  };

  const handleTaskClick = (task: any) => {
    // TODO: Open task details modal
    console.log('Task clicked:', task);
  };

  const getTasksForList = (taskListId: number) => {
    return tasks.filter(task => task.task_list_id === taskListId);
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-96 bg-gray-200 rounded-lg"></div>
              ))}
            </div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (!currentProject) {
    return (
      <DashboardLayout>
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="text-center py-12">
            <h3 className="text-lg font-medium text-gray-900">No project selected</h3>
            <p className="mt-2 text-gray-500">Please select a project to view tasks.</p>
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
            <h1 className="text-3xl font-bold text-gray-900">Tasks</h1>
            <p className="mt-2 text-gray-600">
              {currentProject.name} - Manage and track project tasks
            </p>
          </div>
          <div className="flex space-x-3">
            <Button variant="secondary">
              <AdjustmentsHorizontalIcon className="h-5 w-5 mr-2" />
              Filter
            </Button>
            <Button onClick={() => setIsCreateModalOpen(true)}>
              <PlusIcon className="h-5 w-5 mr-2" />
              New Task
            </Button>
          </div>
        </div>

        {/* Task Board */}
        <DragDropContext onDragEnd={handleDragEnd}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {taskLists.map((taskList) => (
              <TaskColumn
                key={taskList.id}
                taskList={taskList}
                tasks={getTasksForList(taskList.id)}
                onTaskClick={handleTaskClick}
                onAddTask={handleAddTask}
              />
            ))}
          </div>
        </DragDropContext>

        {/* Empty state */}
        {taskLists.length === 0 && (
          <div className="text-center py-12">
            <div className="mx-auto h-24 w-24 text-gray-400">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1}
                  d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
                />
              </svg>
            </div>
            <h3 className="mt-4 text-lg font-medium text-gray-900">No task lists yet</h3>
            <p className="mt-2 text-gray-500">Task lists will be created automatically when you add tasks.</p>
          </div>
        )}

        <CreateTaskModal
          isOpen={isCreateModalOpen}
          onClose={() => {
            setIsCreateModalOpen(false);
            setDefaultTaskListId(undefined);
          }}
          defaultTaskListId={defaultTaskListId}
        />
      </div>
    </DashboardLayout>
  );
}




