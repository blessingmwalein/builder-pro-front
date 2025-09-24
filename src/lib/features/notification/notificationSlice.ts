import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Notification } from '@/types';

interface NotificationState {
  notifications: Notification[];
  unreadCount: number;
  isLoading: boolean;
  error: string | null;
}

const initialState: NotificationState = {
  notifications: [],
  unreadCount: 0,
  isLoading: false,
  error: null,
};

export const fetchNotifications = createAsyncThunk(
  'notification/fetchNotifications',
  async () => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return [
      {
        id: 1,
        title: 'Task Assigned',
        message: 'You have been assigned to "Design Homepage Mockup"',
        type: 'info' as const,
        created_at: '2024-01-15T10:00:00Z',
      },
      {
        id: 2,
        title: 'Budget Alert',
        message: 'Project budget is 80% utilized',
        type: 'warning' as const,
        created_at: '2024-01-14T15:30:00Z',
      },
      {
        id: 3,
        title: 'Inspection Completed',
        message: 'Foundation inspection passed successfully',
        type: 'success' as const,
        read_at: '2024-01-13T09:00:00Z',
        created_at: '2024-01-13T08:00:00Z',
      },
    ];
  }
);

const notificationSlice = createSlice({
  name: 'notification',
  initialState,
  reducers: {
    markAsRead: (state, action: PayloadAction<number>) => {
      const notification = state.notifications.find(n => n.id === action.payload);
      if (notification && !notification.read_at) {
        notification.read_at = new Date().toISOString();
        state.unreadCount = Math.max(0, state.unreadCount - 1);
      }
    },
    markAllAsRead: (state) => {
      state.notifications.forEach(notification => {
        if (!notification.read_at) {
          notification.read_at = new Date().toISOString();
        }
      });
      state.unreadCount = 0;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchNotifications.fulfilled, (state, action) => {
        state.notifications = action.payload;
        state.unreadCount = action.payload.filter(n => !n.read_at).length;
      });
  },
});

export const { markAsRead, markAllAsRead, clearError } = notificationSlice.actions;
export default notificationSlice.reducer;



