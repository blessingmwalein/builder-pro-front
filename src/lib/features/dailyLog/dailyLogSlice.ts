import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { DailyLog } from '@/types';

interface DailyLogState {
  dailyLogs: DailyLog[];
  isLoading: boolean;
  error: string | null;
}

const initialState: DailyLogState = {
  dailyLogs: [],
  isLoading: false,
  error: null,
};

export const fetchDailyLogs = createAsyncThunk(
  'dailyLog/fetchDailyLogs',
  async ({ companyId, projectId }: { companyId: number; projectId: number }) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return [
      {
        id: 1,
        date: '2024-01-15',
        weather: 'Sunny, 75°F',
        summary: 'Foundation work completed successfully',
        notes: 'All concrete poured according to specifications. No issues encountered.',
        manpower_count: 8,
        materials_used: ['Concrete - 50 cubic yards', 'Rebar - 2000 lbs', 'Forms - 500 sq ft'],
        issues: [],
        photos: ['https://example.com/photo1.jpg', 'https://example.com/photo2.jpg'],
        project_id: projectId,
        user_id: 1,
        user: {
          id: 1,
          name: 'John Doe',
          email: 'john@example.com',
          role: 'admin' as const,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
        created_at: '2024-01-15T18:00:00Z',
        updated_at: '2024-01-15T18:00:00Z',
      },
      {
        id: 2,
        date: '2024-01-16',
        weather: 'Cloudy, 68°F',
        summary: 'Electrical rough-in started',
        notes: 'Began electrical rough-in work. Waiting for inspector approval.',
        manpower_count: 6,
        materials_used: ['Electrical wire - 1000 ft', 'Conduit - 200 ft', 'Junction boxes - 50'],
        issues: ['Delay in material delivery', 'Need additional permits for outdoor lighting'],
        photos: ['https://example.com/photo3.jpg'],
        project_id: projectId,
        user_id: 3,
        user: {
          id: 3,
          name: 'Bob Wilson',
          email: 'bob@example.com',
          role: 'site_supervisor' as const,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
        created_at: '2024-01-16T18:00:00Z',
        updated_at: '2024-01-16T18:00:00Z',
      },
    ];
  }
);

const dailyLogSlice = createSlice({
  name: 'dailyLog',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDailyLogs.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchDailyLogs.fulfilled, (state, action) => {
        state.isLoading = false;
        state.dailyLogs = action.payload;
      })
      .addCase(fetchDailyLogs.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to fetch daily logs';
      });
  },
});

export const { clearError } = dailyLogSlice.actions;
export default dailyLogSlice.reducer;



