import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { Expense } from '@/types';

interface ExpenseState {
  expenses: Expense[];
  isLoading: boolean;
  error: string | null;
}

const initialState: ExpenseState = {
  expenses: [],
  isLoading: false,
  error: null,
};

export const fetchExpenses = createAsyncThunk(
  'expense/fetchExpenses',
  async ({ companyId, projectId }: { companyId: number; projectId: number }) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return [
      {
        id: 1,
        description: 'Design software license',
        amount: 299,
        date: '2024-01-15',
        category: 'software',
        receipt_url: 'https://example.com/receipt1.pdf',
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
        created_at: '2024-01-15T00:00:00Z',
        updated_at: '2024-01-15T00:00:00Z',
      },
      {
        id: 2,
        description: 'Office supplies',
        amount: 150,
        date: '2024-01-20',
        category: 'supplies',
        project_id: projectId,
        user_id: 2,
        user: {
          id: 2,
          name: 'Jane Smith',
          email: 'jane@example.com',
          role: 'project_manager' as const,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
        created_at: '2024-01-20T00:00:00Z',
        updated_at: '2024-01-20T00:00:00Z',
      },
    ];
  }
);

const expenseSlice = createSlice({
  name: 'expense',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchExpenses.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchExpenses.fulfilled, (state, action) => {
        state.isLoading = false;
        state.expenses = action.payload;
      })
      .addCase(fetchExpenses.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to fetch expenses';
      });
  },
});

export const { clearError } = expenseSlice.actions;
export default expenseSlice.reducer;

