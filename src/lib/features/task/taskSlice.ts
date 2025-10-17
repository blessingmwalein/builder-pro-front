import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getJson, postJson, putJson, deleteRequest } from '@/lib/api';

export interface TaskList {
  id: number;
  project_id: number;
  name: string;
  order_index: number;
  created_at: string;
  updated_at: string;
}

export interface Task {
  id: number;
  project_id: number;
  task_list_id: number;
  parent_task_id: number | null;
  title: string;
  description: string;
  status: 'todo' | 'in_progress' | 'blocked' | 'done';
  priority: string;
  start_date: string;
  due_date: string;
  assignee_id: number | null;
  progress_pct: number;
  estimate_hours: number | string;
  actual_hours: number | string;
  created_at: string;
  updated_at: string;
}

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

// Fetch all task lists for a project
export const fetchTaskLists = createAsyncThunk(
  'task/fetchTaskLists',
  async ({ companyId, projectId }: { companyId: number; projectId: number }, { rejectWithValue }) => {
    try {
      const res = await getJson<{ data: TaskList[] }>(`/companies/${companyId}/projects/${projectId}/task-lists`);
      return res.data;
    } catch (err: any) {
      return rejectWithValue(err?.message || 'Failed to fetch task lists');
    }
  }
);

// Create a task list
export const createTaskList = createAsyncThunk(
  'task/createTaskList',
  async ({ companyId, projectId, data }: { companyId: number; projectId: number; data: Partial<TaskList> }, { rejectWithValue }) => {
    try {
      const res = await postJson<{ data: TaskList }>(`/companies/${companyId}/projects/${projectId}/task-lists`, data);
      return res.data;
    } catch (err: any) {
      return rejectWithValue(err?.message || 'Failed to create task list');
    }
  }
);

// Update a task list
export const updateTaskList = createAsyncThunk(
  'task/updateTaskList',
  async ({ companyId, projectId, taskListId, data }: { companyId: number; projectId: number; taskListId: number; data: Partial<TaskList> }, { rejectWithValue }) => {
    try {
      const res = await putJson<{ data: TaskList }>(`/companies/${companyId}/projects/${projectId}/task-lists/${taskListId}`, data);
      return res.data;
    } catch (err: any) {
      return rejectWithValue(err?.message || 'Failed to update task list');
    }
  }
);

// Delete a task list
export const deleteTaskList = createAsyncThunk(
  'task/deleteTaskList',
  async ({ companyId, projectId, taskListId }: { companyId: number; projectId: number; taskListId: number }, { rejectWithValue }) => {
    try {
      await deleteRequest(`/companies/${companyId}/projects/${projectId}/task-lists/${taskListId}`);
      return taskListId;
    } catch (err: any) {
      return rejectWithValue(err?.message || 'Failed to delete task list');
    }
  }
);

// Reorder (move) a task list
export const moveTaskList = createAsyncThunk(
  'task/moveTaskList',
  async ({ companyId, projectId, taskListId, data }: { companyId: number; projectId: number; taskListId: number; data: { order_index: number } }, { rejectWithValue }) => {
    try {
      const res = await postJson<{ data: TaskList }>(`/companies/${companyId}/projects/${projectId}/task-lists/${taskListId}/move`, data);
      return res.data;
    } catch (err: any) {
      return rejectWithValue(err?.message || 'Failed to move task list');
    }
  }
);

// Fetch tasks for a task list
export const fetchTasks = createAsyncThunk(
  'task/fetchTasks',
  async ({ companyId, projectId, taskListId }: { companyId: number; projectId: number; taskListId: number }, { rejectWithValue }) => {
    try {
      const res = await getJson<{ data: Task[] }>(`/companies/${companyId}/projects/${projectId}/tasks?task_list_id=${taskListId}`);
      return res.data;
    } catch (err: any) {
      return rejectWithValue(err?.message || 'Failed to fetch tasks');
    }
  }
);

// Create a task
export const createTask = createAsyncThunk(
  'task/createTask',
  async ({ companyId, projectId, data }: { companyId: number; projectId: number; data: Partial<Task> }, { rejectWithValue }) => {
    try {
      const res = await postJson<{ data: Task }>(`/companies/${companyId}/projects/${projectId}/tasks`, data);
      return res.data;
    } catch (err: any) {
      return rejectWithValue(err?.message || 'Failed to create task');
    }
  }
);

// Update a task
export const updateTask = createAsyncThunk(
  'task/updateTask',
  async ({ companyId, projectId, taskId, data }: { companyId: number; projectId: number; taskId: number; data: Partial<Task> }, { rejectWithValue }) => {
    try {
      const res = await putJson<{ data: Task }>(`/companies/${companyId}/projects/${projectId}/tasks/${taskId}`, data);
      return res.data;
    } catch (err: any) {
      return rejectWithValue(err?.message || 'Failed to update task');
    }
  }
);

// Delete a task
export const deleteTask = createAsyncThunk(
  'task/deleteTask',
  async ({ companyId, projectId, taskId }: { companyId: number; projectId: number; taskId: number }, { rejectWithValue }) => {
    try {
      await deleteRequest(`/companies/${companyId}/projects/${projectId}/tasks/${taskId}`);
      return taskId;
    } catch (err: any) {
      return rejectWithValue(err?.message || 'Failed to delete task');
    }
  }
);

// Move a task to another list/order
export const moveTask = createAsyncThunk(
  'task/moveTask',
  async ({ companyId, projectId, taskId, data }: { companyId: number; projectId: number; taskId: number; data: { task_list_id: number; order_index: number } }, { rejectWithValue }) => {
    try {
      const res = await postJson<{ data: Task }>(`/companies/${companyId}/projects/${projectId}/tasks/${taskId}/move`, data);
      return res.data;
    } catch (err: any) {
      return rejectWithValue(err?.message || 'Failed to move task');
    }
  }
);

const taskSlice = createSlice({
  name: 'task',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTaskLists.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchTaskLists.fulfilled, (state, action) => {
        state.isLoading = false;
        state.taskLists = action.payload;
      })
      .addCase(fetchTaskLists.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(createTaskList.fulfilled, (state, action) => {
        state.taskLists.push(action.payload);
      })
      .addCase(updateTaskList.fulfilled, (state, action) => {
        const idx = state.taskLists.findIndex(l => l.id === action.payload.id);
        if (idx !== -1) state.taskLists[idx] = action.payload;
      })
      .addCase(deleteTaskList.fulfilled, (state, action) => {
        state.taskLists = state.taskLists.filter(l => l.id !== action.payload);
      })
      .addCase(moveTaskList.fulfilled, (state, action) => {
        const idx = state.taskLists.findIndex(l => l.id === action.payload.id);
        if (idx !== -1) state.taskLists[idx] = action.payload;
      })
      .addCase(fetchTasks.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchTasks.fulfilled, (state, action) => {
        state.isLoading = false;
        state.tasks = action.payload;
      })
      .addCase(fetchTasks.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(createTask.fulfilled, (state, action) => {
        state.tasks.push(action.payload);
      })
      .addCase(updateTask.fulfilled, (state, action) => {
        const idx = state.tasks.findIndex(t => t.id === action.payload.id);
        if (idx !== -1) state.tasks[idx] = action.payload;
      })
      .addCase(deleteTask.fulfilled, (state, action) => {
        state.tasks = state.tasks.filter(t => t.id !== action.payload);
      })
      .addCase(moveTask.fulfilled, (state, action) => {
        const idx = state.tasks.findIndex(t => t.id === action.payload.id);
        if (idx !== -1) state.tasks[idx] = action.payload;
      });
  },
});

export default taskSlice.reducer;

