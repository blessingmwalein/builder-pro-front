import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Task, TaskList } from '@/types';

interface TaskState {
  taskLists: TaskList[];
  tasks: Task[];
  isLoading: boolean;
  error: string | null;
}

const initialState: TaskState = {
  taskLists: [],
  tasks: [],
  isLoading: false,
  error: null,
};

export const fetchTaskLists = createAsyncThunk(
  'task/fetchTaskLists',
  async ({ companyId, projectId }: { companyId: number; projectId: number }) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return [
      {
        id: 1,
        name: 'To Do',
        description: 'Tasks to be started',
        project_id: projectId,
        order_index: 0,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        id: 2,
        name: 'In Progress',
        description: 'Tasks currently being worked on',
        project_id: projectId,
        order_index: 1,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        id: 3,
        name: 'Done',
        description: 'Completed tasks',
        project_id: projectId,
        order_index: 2,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
    ];
  }
);

export const fetchTasks = createAsyncThunk(
  'task/fetchTasks',
  async ({ companyId, projectId }: { companyId: number; projectId: number }) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return [
      {
        id: 1,
        title: 'Design Homepage Mockup',
        description: 'Create detailed mockup for the new homepage design',
        task_list_id: 1,
        assignee_id: 2,
        assignee: {
          id: 2,
          name: 'Jane Smith',
          email: 'jane@example.com',
          role: 'project_manager' as const,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
        priority: 'high' as const,
        status: 'pending' as const,
        due_date: '2024-02-15',
        order_index: 0,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        id: 2,
        title: 'Set up Development Environment',
        description: 'Configure development environment for the project',
        task_list_id: 2,
        assignee_id: 1,
        assignee: {
          id: 1,
          name: 'John Doe',
          email: 'john@example.com',
          role: 'admin' as const,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
        priority: 'medium' as const,
        status: 'in_progress' as const,
        due_date: '2024-02-10',
        order_index: 0,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        id: 3,
        title: 'Project Planning',
        description: 'Complete initial project planning and requirements gathering',
        task_list_id: 3,
        assignee_id: 1,
        assignee: {
          id: 1,
          name: 'John Doe',
          email: 'john@example.com',
          role: 'admin' as const,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
        priority: 'low' as const,
        status: 'completed' as const,
        due_date: '2024-01-30',
        order_index: 0,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
    ];
  }
);

export const createTask = createAsyncThunk(
  'task/createTask',
  async (taskData: Omit<Task, 'id' | 'order_index' | 'created_at' | 'updated_at' | 'assignee'>) => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    return {
      id: Date.now(),
      ...taskData,
      order_index: 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
  }
);

const taskSlice = createSlice({
  name: 'task',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    updateTask: (state, action: PayloadAction<Partial<Task> & { id: number }>) => {
      const index = state.tasks.findIndex(t => t.id === action.payload.id);
      if (index !== -1) {
        state.tasks[index] = { ...state.tasks[index], ...action.payload };
      }
    },
    moveTask: (state, action: PayloadAction<{ taskId: number; newListId: number; newIndex: number }>) => {
      const { taskId, newListId, newIndex } = action.payload;
      const taskIndex = state.tasks.findIndex(t => t.id === taskId);
      if (taskIndex !== -1) {
        state.tasks[taskIndex].task_list_id = newListId;
        state.tasks[taskIndex].order_index = newIndex;
      }
    },
    removeTask: (state, action: PayloadAction<number>) => {
      state.tasks = state.tasks.filter(t => t.id !== action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTaskLists.fulfilled, (state, action) => {
        state.taskLists = action.payload;
      })
      .addCase(fetchTasks.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchTasks.fulfilled, (state, action) => {
        state.isLoading = false;
        state.tasks = action.payload;
      })
      .addCase(fetchTasks.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to fetch tasks';
      })
      .addCase(createTask.fulfilled, (state, action) => {
        state.tasks.push(action.payload);
      });
  },
});

export const { clearError, updateTask, moveTask, removeTask } = taskSlice.actions;
export default taskSlice.reducer;

