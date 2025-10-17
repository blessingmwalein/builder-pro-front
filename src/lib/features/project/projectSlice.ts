import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getJson, postJson, putJson } from '@/lib/api';
import type { RootState } from '@/lib/store';

export interface Project {
  id: number;
  company_id: number;
  code: string;
  title: string;
  description: string;
  status: 'planned' | 'in_progress' | 'on_hold' | 'completed' | 'archived';
  location_text: string;
  latitude: number | string;
  longitude: number | string;
  budget_total_cents: number;
  currency: string;
  start_date: string;
  end_date: string;
  cover_image_url?: string | null;
  created_at: string;
  updated_at: string;
  deleted_at?: string | null;
}

interface ProjectState {
  projects: Project[];
  currentProject: Project | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: ProjectState = {
  projects: [],
  currentProject: null,
  isLoading: false,
  error: null,
};

// Fetch all projects for a company
export const fetchProjects = createAsyncThunk(
  'project/fetchProjects',
  async (companyId: number, { rejectWithValue }) => {
    try {
      const res = await getJson<{ success: boolean; data: Project[] }>(`/companies/${companyId}/projects`);
      return res.data;
    } catch (err: any) {
      return rejectWithValue(err?.message || 'Failed to fetch projects');
    }
  }
);

// Fetch a single project
export const fetchProject = createAsyncThunk(
  'project/fetchProject',
  async ({ companyId, projectId }: { companyId: number; projectId: number }, { rejectWithValue }) => {
    try {
      const res = await getJson<{ success: boolean; data: Project }>(`/companies/${companyId}/projects/${projectId}`);
      return res.data;
    } catch (err: any) {
      return rejectWithValue(err?.message || 'Failed to fetch project');
    }
  }
);

// Create a project
export const createProject = createAsyncThunk(
  'project/createProject',
  async ({ companyId, data }: { companyId: number; data: any }, { rejectWithValue }) => {
    try {
      const res = await postJson<{ success: boolean; data: Project }>(`/companies/${companyId}/projects`, data);
      return res.data;
    } catch (err: any) {
      return rejectWithValue(err?.message || 'Failed to create project');
    }
  }
);

// Update a project
export const updateProject = createAsyncThunk(
  'project/updateProject',
  async ({ companyId, projectId, data }: { companyId: number; projectId: number; data: any }, { rejectWithValue }) => {
    try {
      const res = await putJson<{ success: boolean; data: Project }>(`/companies/${companyId}/projects/${projectId}`, data);
      return res.data;
    } catch (err: any) {
      return rejectWithValue(err?.message || 'Failed to update project');
    }
  }
);

const projectSlice = createSlice({
  name: 'project',
  initialState,
  reducers: {
    setCurrentProject(state, action) {
      state.currentProject = action.payload;
    },
    clearProjectError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProjects.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchProjects.fulfilled, (state, action) => {
        state.isLoading = false;
        state.projects = action.payload;
      })
      .addCase(fetchProjects.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchProject.fulfilled, (state, action) => {
        state.currentProject = action.payload;
      })
      .addCase(createProject.fulfilled, (state, action) => {
        state.projects.unshift(action.payload);
      })
      .addCase(updateProject.fulfilled, (state, action) => {
        const idx = state.projects.findIndex(p => p.id === action.payload.id);
        if (idx !== -1) state.projects[idx] = action.payload;
        if (state.currentProject?.id === action.payload.id) {
          state.currentProject = action.payload;
        }
      });
  },
});

export const { setCurrentProject, clearProjectError } = projectSlice.actions;
export default projectSlice.reducer;

