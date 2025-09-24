import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { BudgetCategory, BudgetItem } from '@/types';

interface BudgetState {
  categories: BudgetCategory[];
  items: BudgetItem[];
  isLoading: boolean;
  error: string | null;
}

const initialState: BudgetState = {
  categories: [],
  items: [],
  isLoading: false,
  error: null,
};

export const fetchBudgetData = createAsyncThunk(
  'budget/fetchData',
  async ({ companyId, projectId }: { companyId: number; projectId: number }) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const categories = [
      {
        id: 1,
        name: 'Design',
        description: 'Design and UX related costs',
        project_id: projectId,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        id: 2,
        name: 'Development',
        description: 'Development and programming costs',
        project_id: projectId,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
    ];

    const items = [
      {
        id: 1,
        category_id: 1,
        name: 'UI Design',
        description: 'User interface design for web application',
        quantity: 1,
        unit_price: 5000,
        unit: 'project',
        total_price: 5000,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        id: 2,
        category_id: 2,
        name: 'Frontend Development',
        description: 'React application development',
        quantity: 200,
        unit_price: 75,
        unit: 'hour',
        total_price: 15000,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
    ];

    return { categories, items };
  }
);

const budgetSlice = createSlice({
  name: 'budget',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchBudgetData.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchBudgetData.fulfilled, (state, action) => {
        state.isLoading = false;
        state.categories = action.payload.categories;
        state.items = action.payload.items;
      })
      .addCase(fetchBudgetData.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to fetch budget data';
      });
  },
});

export const { clearError } = budgetSlice.actions;
export default budgetSlice.reducer;

