import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Project, ProjectStats } from '@/types';

interface ProjectState {
  projects: Project[];
  currentProject: Project | null;
  stats: ProjectStats | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: ProjectState = {
  projects: [],
  currentProject: null,
  stats: null,
  isLoading: false,
  error: null,
};

// Mock async thunks
export const fetchProjects = createAsyncThunk(
  'project/fetchProjects',
  async (companyId: number) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    // Mock projects data
    return [
      {
        id: 1,
        name: 'Website Redesign',
        description: 'Complete redesign of company website with modern UI/UX',
        start_date: '2024-01-01',
        end_date: '2024-06-30',
        status: 'active' as const,
        company_id: companyId,
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z',
      },
      {
        id: 2,
        name: 'Mobile App Development',
        description: 'Native mobile application for iOS and Android',
        start_date: '2024-02-01',
        end_date: '2024-08-31',
        status: 'active' as const,
        company_id: companyId,
        created_at: '2024-02-01T00:00:00Z',
        updated_at: '2024-02-01T00:00:00Z',
      },
      {
        id: 3,
        name: 'Office Renovation',
        description: 'Complete renovation of headquarters office space',
        start_date: '2023-10-01',
        end_date: '2023-12-31',
        status: 'completed' as const,
        company_id: companyId,
        created_at: '2023-10-01T00:00:00Z',
        updated_at: '2023-12-31T00:00:00Z',
      },
    ];
  }
);

export const createProject = createAsyncThunk(
  'project/createProject',
  async ({ companyId, projectData }: { companyId: number; projectData: Omit<Project, 'id' | 'company_id' | 'created_at' | 'updated_at'> }) => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    return {
      id: Date.now(),
      ...projectData,
      company_id: companyId,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
  }
);

export const fetchProjectStats = createAsyncThunk(
  'project/fetchStats',
  async ({ companyId, projectId }: { companyId: number; projectId: number }) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return {
      total_tasks: 45,
      completed_tasks: 32,
      pending_tasks: 8,
      in_progress_tasks: 5,
      total_budget: 150000,
      spent_budget: 87500,
      team_members: 8,
    };
  }
);

const projectSlice = createSlice({
  name: 'project',
  initialState,
  reducers: {
    setCurrentProject: (state, action: PayloadAction<Project>) => {
      state.currentProject = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
    updateProject: (state, action: PayloadAction<Partial<Project> & { id: number }>) => {
      const index = state.projects.findIndex(p => p.id === action.payload.id);
      if (index !== -1) {
        state.projects[index] = { ...state.projects[index], ...action.payload };
      }
      if (state.currentProject?.id === action.payload.id) {
        state.currentProject = { ...state.currentProject, ...action.payload };
      }
    },
    removeProject: (state, action: PayloadAction<number>) => {
      state.projects = state.projects.filter(p => p.id !== action.payload);
      if (state.currentProject?.id === action.payload) {
        state.currentProject = null;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch projects
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
        state.error = action.error.message || 'Failed to fetch projects';
      })
      // Create project
      .addCase(createProject.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createProject.fulfilled, (state, action) => {
        state.isLoading = false;
        state.projects.push(action.payload);
      })
      .addCase(createProject.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to create project';
      })
      // Fetch stats
      .addCase(fetchProjectStats.fulfilled, (state, action) => {
        state.stats = action.payload;
      });
  },
});

export const { setCurrentProject, clearError, updateProject, removeProject } = projectSlice.actions;
export default projectSlice.reducer;

