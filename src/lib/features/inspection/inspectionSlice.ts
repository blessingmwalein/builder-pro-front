import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { Inspection } from '@/types';

interface InspectionState {
  inspections: Inspection[];
  summary: {
    total: number;
    completed: number;
    pending: number;
    overdue: number;
  } | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: InspectionState = {
  inspections: [],
  summary: null,
  isLoading: false,
  error: null,
};

export const fetchInspections = createAsyncThunk(
  'inspection/fetchInspections',
  async ({ companyId, projectId }: { companyId: number; projectId: number }) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return [
      {
        id: 1,
        title: 'Foundation Inspection',
        description: 'Inspection of foundation work completion',
        status: 'completed' as const,
        scheduled_date: '2024-01-10',
        council_officer: 'Mike Johnson',
        contact_email: 'mike.johnson@council.gov',
        project_id: projectId,
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-10T00:00:00Z',
      },
      {
        id: 2,
        title: 'Electrical Inspection',
        description: 'Electrical work inspection before drywall',
        status: 'pending' as const,
        scheduled_date: '2024-02-15',
        council_officer: 'Sarah Davis',
        contact_email: 'sarah.davis@council.gov',
        project_id: projectId,
        created_at: '2024-01-15T00:00:00Z',
        updated_at: '2024-01-15T00:00:00Z',
      },
    ];
  }
);

export const fetchInspectionSummary = createAsyncThunk(
  'inspection/fetchSummary',
  async ({ companyId, projectId }: { companyId: number; projectId: number }) => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return {
      total: 5,
      completed: 3,
      pending: 1,
      overdue: 1,
    };
  }
);

const inspectionSlice = createSlice({
  name: 'inspection',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchInspections.fulfilled, (state, action) => {
        state.inspections = action.payload;
      })
      .addCase(fetchInspectionSummary.fulfilled, (state, action) => {
        state.summary = action.payload;
      });
  },
});

export const { clearError } = inspectionSlice.actions;
export default inspectionSlice.reducer;

