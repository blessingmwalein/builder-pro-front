import React, { useState } from 'react';
import { CreateTaskListModal } from '@/components/tasks/CreateTaskListModal';
import { CreateTaskModal } from '@/components/tasks/CreateTaskModal';
import {
  EllipsisVerticalIcon,
  PencilIcon,
  TrashIcon,
  ArrowPathIcon,
  PlusIcon,
  TagIcon,
  UserIcon,
  CalendarIcon,
  ClockIcon,
  FlagIcon,
  XMarkIcon,
  EyeIcon,
} from '@heroicons/react/24/outline';
import clsx from 'clsx';
import { Dialog, Menu } from '@headlessui/react';

// Helper to humanize status
const humanizeStatus = (status: string) => {
  switch (status) {
    case 'todo':
    case 'planned':
      return 'Planned';
    case 'in_progress':
      return 'In Progress';
    case 'blocked':
      return 'Blocked';
    case 'done':
    case 'completed':
      return 'Completed';
    case 'archived':
      return 'Archived';
    default:
      return status.charAt(0).toUpperCase() + status.slice(1);
  }
};

function CompanyUserAvatar({ user }: { user: any }) {
  // Helper for avatar with initials and gradient
  if (!user) return null;
  const initials = user.name
    ? user.name.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2)
    : '';
  return (
    <div className="h-7 w-7 rounded-full bg-gradient-to-tr from-orange-500 via-orange-400 to-yellow-400 flex items-center justify-center text-xs font-bold text-white shadow">
      {user.avatar_url ? (
        <img src={user.avatar_url} alt={user.name} className="h-7 w-7 rounded-full object-cover" />
      ) : (
        initials
      )}
    </div>
  );
}

// Custom Task Card
function TaskCard({
  task,
  onClick,
  onEdit,
  onDelete,
  onView,
}: {
  task: any;
  onClick: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onView: () => void;
}) {
  const assignee = task.assignee || (task.assignee_id && task.assignee_id !== 'unassigned'
    ? (task.assignees?.find?.((u: any) => u.id === task.assignee_id) || null)
    : null);

  return (
    <div
      className={clsx(
        "bg-gray-50 border border-gray-200 rounded-xl p-4 mb-2 cursor-pointer hover:bg-orange-50 transition"
      )}
      draggable
      onClick={onClick}
    >
      <div className="flex items-center justify-between">
        <div className="font-semibold text-gray-900 text-base">{task.title}</div>
        <div className="relative">
          <Menu as="div" className="relative inline-block text-left">
            <Menu.Button
              className="p-1 rounded-full hover:bg-gray-200"
              onClick={e => e.stopPropagation()}
            >
              <EllipsisVerticalIcon className="h-5 w-5 text-gray-400" />
            </Menu.Button>
            <Menu.Items className="absolute right-0 mt-2 w-36 bg-white border border-gray-200 rounded-xl shadow-lg z-20">
              <Menu.Item>
                {({ active }) => (
                  <button
                    className={`flex items-center w-full px-4 py-2 text-sm ${active ? 'bg-gray-50' : ''}`}
                    onClick={e => {
                      e.stopPropagation();
                      onView();
                    }}
                  >
                    <EyeIcon className="h-4 w-4 mr-2" /> View
                  </button>
                )}
              </Menu.Item>
              <Menu.Item>
                {({ active }) => (
                  <button
                    className={`flex items-center w-full px-4 py-2 text-sm ${active ? 'bg-gray-50' : ''}`}
                    onClick={e => {
                      e.stopPropagation();
                      onEdit();
                    }}
                  >
                    <PencilIcon className="h-4 w-4 mr-2" /> Edit
                  </button>
                )}
              </Menu.Item>
              <Menu.Item>
                {({ active }) => (
                  <button
                    className={`flex items-center w-full px-4 py-2 text-sm text-red-600 ${active ? 'bg-red-50' : ''}`}
                    onClick={e => {
                      e.stopPropagation();
                      onDelete();
                    }}
                  >
                    <TrashIcon className="h-4 w-4 mr-2" /> Delete
                  </button>
                )}
              </Menu.Item>
            </Menu.Items>
          </Menu>
        </div>
      </div>
      <div className="flex flex-wrap gap-2 mt-2 mb-1">
        <span className={clsx(
          "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium",
          task.status === 'done' || task.status === 'completed'
            ? "bg-green-100 text-green-800"
            : task.status === 'in_progress'
            ? "bg-blue-100 text-blue-800"
            : task.status === 'blocked'
            ? "bg-red-100 text-red-800"
            : "bg-gray-100 text-gray-800"
        )}>
          <FlagIcon className="h-3 w-3 mr-1" />
          {humanizeStatus(task.status)}
        </span>
        {task.priority && (
          <span className={clsx(
            "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium",
            task.priority === 'high'
              ? "bg-red-100 text-red-700"
              : task.priority === 'medium'
              ? "bg-yellow-100 text-yellow-700"
              : "bg-gray-100 text-gray-700"
          )}>
            <FlagIcon className="h-3 w-3 mr-1" />
            {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
          </span>
        )}
        {task.tags && task.tags.length > 0 && (
          <span className="flex items-center gap-1">
            <TagIcon className="h-4 w-4 text-orange-400" />
            {task.tags.map((tag: string) => (
              <span key={tag} className="bg-orange-100 text-orange-700 px-2 py-0.5 rounded-full text-xs">{tag}</span>
            ))}
          </span>
        )}
      </div>
      <div className="flex items-center gap-2 text-xs text-gray-500 mb-1">
        <CalendarIcon className="h-4 w-4" />
        Due: {task.due_date ? task.due_date.split('T')[0] : 'N/A'}
      </div>
      <div className="flex items-center gap-2 text-xs text-gray-500">
        <UserIcon className="h-4 w-4" />
        {assignee ? (
          <>
            <CompanyUserAvatar user={assignee} />
            <span>{assignee.name}</span>
          </>
        ) : (
          <span>Unassigned</span>
        )}
      </div>
    </div>
  );
}

// Task View Modal
function TaskViewModal({ open, onClose, task }: { open: boolean; onClose: () => void; task: any }) {
  if (!open || !task) return null;
  return (
    <Dialog open={open} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/40" aria-hidden="true" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="mx-auto max-w-2xl w-full bg-white rounded-2xl shadow-2xl p-8 relative">
          <button
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-700"
            onClick={onClose}
          >
            <XMarkIcon className="h-7 w-7" />
          </button>
          <h2 className="text-2xl font-bold mb-2 text-gray-900">{task.title}</h2>
          <div className="flex flex-wrap gap-3 mb-4">
            <span className={clsx(
              "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium",
              task.status === 'done' || task.status === 'completed'
                ? "bg-green-100 text-green-800"
                : task.status === 'in_progress'
                ? "bg-blue-100 text-blue-800"
                : task.status === 'blocked'
                ? "bg-red-100 text-red-800"
                : "bg-gray-100 text-gray-800"
            )}>
              <FlagIcon className="h-3 w-3 mr-1" />
              {humanizeStatus(task.status)}
            </span>
            {task.priority && (
              <span className={clsx(
                "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium",
                task.priority === 'high'
                  ? "bg-red-100 text-red-700"
                  : task.priority === 'medium'
                  ? "bg-yellow-100 text-yellow-700"
                  : "bg-gray-100 text-gray-700"
              )}>
                <FlagIcon className="h-3 w-3 mr-1" />
                {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
              </span>
            )}
            {task.tags && task.tags.length > 0 && (
              <span className="flex items-center gap-1">
                <TagIcon className="h-4 w-4 text-orange-400" />
                {task.tags.map((tag: string) => (
                  <span key={tag} className="bg-orange-100 text-orange-700 px-2 py-0.5 rounded-full text-xs">{tag}</span>
                ))}
              </span>
            )}
          </div>
          <div className="mb-4">
            <div className="text-sm text-gray-700 mb-2">{task.description || <span className="italic text-gray-400">No description</span>}</div>
            <div className="flex flex-wrap gap-4 text-xs text-gray-500">
              <div className="flex items-center gap-1">
                <CalendarIcon className="h-4 w-4" />
                <span>Due: {task.due_date ? task.due_date.split('T')[0] : 'N/A'}</span>
              </div>
              <div className="flex items-center gap-1">
                <UserIcon className="h-4 w-4" />
                <span>Assignee: {task.assignee_name || "Unassigned"}</span>
              </div>
              <div className="flex items-center gap-1">
                <ClockIcon className="h-4 w-4" />
                <span>Created: {task.created_at ? task.created_at.split('T')[0] : 'N/A'}</span>
              </div>
              <div className="flex items-center gap-1">
                <PencilIcon className="h-4 w-4" />
                <span>Last Updated: {task.updated_at ? task.updated_at.split('T')[0] : 'N/A'}</span>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 mt-6">
            <div>
              <div className="text-xs text-gray-500 mb-1">Task List</div>
              <div className="font-medium text-gray-800">{task.task_list_name || "N/A"}</div>
            </div>
            <div>
              <div className="text-xs text-gray-500 mb-1">ID</div>
              <div className="font-mono text-gray-700">{task.id}</div>
            </div>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}

export function ProjectTasksTab({ companyId, projectId, taskLists, tasks }: {
  companyId: number;
  projectId: number;
  taskLists: any[];
  tasks: any[];
}) {
  const hasTaskLists = taskLists && taskLists.length > 0;
  const [isAddListOpen, setIsAddListOpen] = React.useState(false);
  const [isAddTaskOpen, setIsAddTaskOpen] = React.useState(false);
  const [selectedTaskListId, setSelectedTaskListId] = React.useState<number | null>(null);
  const [listMenuOpen, setListMenuOpen] = React.useState<number | null>(null);
  const [draggedListId, setDraggedListId] = React.useState<number | null>(null);
  const [draggedTaskId, setDraggedTaskId] = React.useState<number | null>(null);

  // Task view modal state
  const [viewTask, setViewTask] = React.useState<any | null>(null);
  const [editTaskList, setEditTaskList] = useState<any | null>(null);
  const [editTask, setEditTask] = useState<any | null>(null);

  // Handlers for drag and drop (implement actual reorder logic as needed)
  const handleListDragStart = (listId: number) => setDraggedListId(listId);
  const handleListDragOver = (e: React.DragEvent, overId: number) => { e.preventDefault(); };
  const handleListDrop = (overId: number) => { setDraggedListId(null); /* reorder logic here */ };

  const handleTaskDragStart = (taskId: number) => setDraggedTaskId(taskId);
  const handleTaskDragOver = (e: React.DragEvent, overId: number) => { e.preventDefault(); };
  const handleTaskDrop = (overId: number, listId: number) => { setDraggedTaskId(null); /* reorder logic here */ };

  return (
    <div>
      <div className="flex gap-6 pb-4 min-h-[300px] overflow-x-auto scrollbar-hide">
        {hasTaskLists ? (
          <>
            {taskLists.map((list) => (
              <div
                key={list.id}
                className={clsx(
                  "min-w-[340px] max-w-[340px] flex flex-col bg-white border border-gray-200 rounded-2xl p-0 relative",
                  draggedListId === list.id && "opacity-60"
                )}
                draggable
                onDragStart={() => setDraggedListId(list.id)}
                onDragOver={e => { e.preventDefault(); }}
                onDrop={() => setDraggedListId(null)}
              >
                {/* List Header */}
                <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 bg-gray-50 rounded-t-2xl">
                  <div className="font-normal text-base text-gray-900 truncate">{list.name}</div>
                  <div className="flex items-center gap-1">
                    {/* Add Task circular icon button */}
                    <button
                      className="p-1.5 rounded-full bg-gradient-to-tr from-orange-500 via-orange-400 to-yellow-400 text-white hover:scale-110 transition"
                      title="Add Task"
                      onClick={() => {
                        setSelectedTaskListId(list.id);
                        setIsAddTaskOpen(true);
                      }}
                    >
                      <PlusIcon className="h-4 w-4" />
                    </button>
                    {/* More actions */}
                    <div className="relative">
                      <Menu as="div" className="relative inline-block text-left">
                        <Menu.Button
                          className="p-1 rounded-full hover:bg-gray-200"
                          onClick={e => {
                            e.stopPropagation();
                            setListMenuOpen(listMenuOpen === list.id ? null : list.id);
                          }}
                        >
                          <EllipsisVerticalIcon className="h-5 w-5 text-gray-400" />
                        </Menu.Button>
                        {listMenuOpen === list.id && (
                          <Menu.Items className="absolute right-0 mt-2 w-44 bg-white border border-gray-200 rounded-xl shadow-lg z-20">
                            <Menu.Item>
                              {({ active }) => (
                                <button className={`flex items-center w-full px-4 py-2 text-sm ${active ? 'bg-gray-50' : ''}`}>
                                  <ArrowPathIcon className="h-4 w-4 mr-2" /> Move List
                                </button>
                              )}
                            </Menu.Item>
                            <Menu.Item>
                              {({ active }) => (
                                <button
                                  className={`flex items-center w-full px-4 py-2 text-sm ${active ? 'bg-gray-50' : ''}`}
                                  onClick={e => {
                                    e.stopPropagation();
                                    setListMenuOpen(null);
                                    setEditTaskList(list);
                                  }}
                                >
                                  <PencilIcon className="h-4 w-4 mr-2" /> Edit List
                                </button>
                              )}
                            </Menu.Item>
                            <Menu.Item>
                              {({ active }) => (
                                <button className={`flex items-center w-full px-4 py-2 text-sm text-red-600 ${active ? 'bg-red-50' : ''}`}>
                                  <TrashIcon className="h-4 w-4 mr-2" /> Delete List
                                </button>
                              )}
                            </Menu.Item>
                          </Menu.Items>
                        )}
                      </Menu>
                    </div>
                  </div>
                </div>
                {/* Tasks in List */}
                <div className="flex-1 px-4 py-3 space-y-3">
                  {(!list.tasks || list.tasks.length === 0) && (
                    <div className="text-center text-gray-400 text-sm py-6">No tasks</div>
                  )}
                  {list.tasks && list.tasks.map((task: any) => (
                    <TaskCard
                      key={task.id}
                      task={{
                        ...task,
                        assignee_name: task.assignee?.name || task.assignee_name || "Unassigned",
                        task_list_name: list.name,
                      }}
                      onClick={() => setViewTask({
                        ...task,
                        assignee_name: task.assignee?.name || task.assignee_name || "Unassigned",
                        task_list_name: list.name,
                      })}
                      onView={() => setViewTask({
                        ...task,
                        assignee_name: task.assignee?.name || task.assignee_name || "Unassigned",
                        task_list_name: list.name,
                      })}
                      onEdit={() => setEditTask({ ...task, task_list_name: list.name })}
                      onDelete={() => {/* implement delete task logic here */}}
                    />
                  ))}
                </div>
              </div>
            ))}
            {/* Add button to create new task list */}
            <div className="min-w-[340px] flex items-center justify-center">
              <button
                className="rounded-full px-8 py-3 font-bold text-white bg-gradient-to-tr from-orange-500 via-orange-400 to-yellow-400 shadow hover:scale-105 transition"
                onClick={() => setIsAddListOpen(true)}
              >
                + Add List
              </button>
            </div>
          </>
        ) : (
          <div className="w-full flex flex-col items-center justify-center min-h-[300px]">
            <div className="text-gray-400 text-5xl mb-4">🗂️</div>
            <div className="text-lg font-semibold text-gray-700 mb-2">No Task Lists</div>
            <div className="text-gray-500 mb-4">Get started by creating your first task list for this project.</div>
            <button
              className="rounded-full px-8 py-3 font-bold text-white bg-gradient-to-tr from-orange-500 via-orange-400 to-yellow-400 shadow hover:scale-105 transition"
              onClick={() => setIsAddListOpen(true)}
            >
              + Add List
            </button>
          </div>
        )}
      </div>
      <CreateTaskListModal
        isOpen={isAddListOpen || !!editTaskList}
        onClose={() => {
          setIsAddListOpen(false);
          setEditTaskList(null);
        }}
        companyId={companyId}
        projectId={projectId}
        {...(editTaskList ? { initialData: editTaskList } : {})}
      />
      <CreateTaskModal
        isOpen={isAddTaskOpen || !!editTask}
        onClose={() => {
          setIsAddTaskOpen(false);
          setEditTask(null);
        }}
        defaultTaskListId={selectedTaskListId || undefined}
        {...(editTask ? { initialData: editTask } : {})}
      />
      <TaskViewModal open={!!viewTask} onClose={() => setViewTask(null)} task={viewTask} />
      {/* Hide horizontal scrollbar with custom CSS */}
      <style jsx global>{`
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
}
