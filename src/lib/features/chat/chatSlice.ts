import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { ChatMessage } from '@/types';

interface ChatState {
  messages: ChatMessage[];
  isLoading: boolean;
  error: string | null;
}

const initialState: ChatState = {
  messages: [],
  isLoading: false,
  error: null,
};

export const fetchChatMessages = createAsyncThunk(
  'chat/fetchMessages',
  async ({ companyId, projectId }: { companyId: number; projectId: number }) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return [
      {
        id: 1,
        message: 'Project kickoff meeting scheduled for tomorrow at 10 AM',
        user_id: 1,
        user: {
          id: 1,
          name: 'John Doe',
          email: 'john@example.com',
          role: 'admin' as const,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
        project_id: projectId,
        created_at: '2024-01-15T09:00:00Z',
      },
      {
        id: 2,
        message: 'Updated the design mockups. Please review when you have a chance.',
        attachment_url: 'https://example.com/mockup.pdf',
        user_id: 2,
        user: {
          id: 2,
          name: 'Jane Smith',
          email: 'jane@example.com',
          role: 'project_manager' as const,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
        project_id: projectId,
        created_at: '2024-01-15T14:30:00Z',
      },
    ];
  }
);

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    addMessage: (state, action) => {
      state.messages.push(action.payload);
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchChatMessages.fulfilled, (state, action) => {
        state.messages = action.payload;
      });
  },
});

export const { addMessage, clearError } = chatSlice.actions;
export default chatSlice.reducer;




