'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
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

export default function ProjectTasksPage() {
  const params = useParams();
  const projectId = parseInt(params.id as string);
  
  const dispatch = useAppDispatch();
  const { taskLists, tasks, isLoading } = useAppSelector((state) => state.task);
  const { currentCompany } = useAppSelector((state) => state.company);
  
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [defaultTaskListId, setDefaultTaskListId] = useState<number | undefined>();

  useEffect(() => {
    if (currentCompany) {
      dispatch(fetchTaskLists({ companyId: currentCompany.id, projectId }));
      dispatch(fetchTasks({ companyId: currentCompany.id, projectId }));
      dispatch(fetchCompanyUsers(currentCompany.id));
    }
  }, [dispatch, currentCompany, projectId]);

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

  return (
    <DashboardLayout>
      <div className="px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Project Tasks</h1>
            <p className="mt-1 text-gray-600">
              Manage and track project tasks
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




