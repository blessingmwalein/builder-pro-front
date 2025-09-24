'use client';

import React from 'react';
import { Droppable, Draggable } from 'react-beautiful-dnd';
import { TaskList, Task } from '@/types';
import { TaskCard } from './TaskCard';
import { PlusIcon } from '@heroicons/react/24/outline';
import clsx from 'clsx';

interface TaskColumnProps {
  taskList: TaskList;
  tasks: Task[];
  onTaskClick: (task: Task) => void;
  onAddTask: (taskListId: number) => void;
}

const columnColors = {
  0: 'border-t-gray-400',
  1: 'border-t-blue-400',
  2: 'border-t-green-400',
};

export function TaskColumn({ taskList, tasks, onTaskClick, onAddTask }: TaskColumnProps) {
  const colorClass = columnColors[taskList.order_index as keyof typeof columnColors] || 'border-t-gray-400';

  return (
    <div className={clsx('bg-gray-50 rounded-lg border-t-4', colorClass)}>
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-gray-900">
            {taskList.name}
          </h3>
          <div className="flex items-center space-x-2">
            <span className="bg-gray-200 text-gray-700 text-xs font-medium px-2 py-1 rounded-full">
              {tasks.length}
            </span>
            <button
              onClick={() => onAddTask(taskList.id)}
              className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-200 rounded"
            >
              <PlusIcon className="h-4 w-4" />
            </button>
          </div>
        </div>
        {taskList.description && (
          <p className="text-xs text-gray-500 mt-1">{taskList.description}</p>
        )}
      </div>

      <Droppable droppableId={taskList.id.toString()}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={clsx(
              'p-4 min-h-[200px] space-y-3',
              snapshot.isDraggingOver && 'bg-blue-50'
            )}
          >
            {tasks.map((task, index) => (
              <Draggable 
                key={task.id} 
                draggableId={task.id.toString()} 
                index={index}
              >
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    className={clsx(
                      'transition-transform duration-200',
                      snapshot.isDragging && 'rotate-3 shadow-lg'
                    )}
                  >
                    <TaskCard 
                      task={task} 
                      onClick={() => onTaskClick(task)} 
                    />
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}

            {tasks.length === 0 && (
              <div className="text-center py-8">
                <p className="text-sm text-gray-500">No tasks yet</p>
                <button
                  onClick={() => onAddTask(taskList.id)}
                  className="mt-2 text-sm text-blue-600 hover:text-blue-500 font-medium"
                >
                  Add first task
                </button>
              </div>
            )}
          </div>
        )}
      </Droppable>
    </div>
  );
}



