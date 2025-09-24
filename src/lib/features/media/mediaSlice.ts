import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { ProjectPhoto } from '@/types';

interface MediaState {
  photos: ProjectPhoto[];
  isLoading: boolean;
  error: string | null;
}

const initialState: MediaState = {
  photos: [],
  isLoading: false,
  error: null,
};

export const fetchProjectPhotos = createAsyncThunk(
  'media/fetchPhotos',
  async ({ companyId, projectId }: { companyId: number; projectId: number }) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return [
      {
        id: 1,
        url: 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=800',
        caption: 'Foundation work in progress',
        taken_at: '2024-01-10',
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
        created_at: '2024-01-10T00:00:00Z',
      },
      {
        id: 2,
        url: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800',
        caption: 'Electrical installation',
        taken_at: '2024-01-15',
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
        created_at: '2024-01-15T00:00:00Z',
      },
    ];
  }
);

const mediaSlice = createSlice({
  name: 'media',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProjectPhotos.fulfilled, (state, action) => {
        state.photos = action.payload;
      });
  },
});

export const { clearError } = mediaSlice.actions;
export default mediaSlice.reducer;



