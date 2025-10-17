import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { postJson, getJson, apiFetch, putJson } from '@/lib/api';

const initialState = {
  categories: [],
  items: [],
  isLoading: false,
  error: null,
};

export const fetchBudgetCategories = createAsyncThunk(
  'budget/fetchBudgetCategories',
  async ({ companyId, projectId }: { companyId: number; projectId: number }, { rejectWithValue }) => {
    try {
      const res = await getJson(`/companies/${companyId}/projects/${projectId}/budget/categories`);
      return res.data;
    } catch (err: any) {
      return rejectWithValue(err?.message || 'Failed to fetch budget categories');
    }
  }
);

export const createBudgetCategory = createAsyncThunk(
  'budget/createBudgetCategory',
  async ({ companyId, projectId, data }: { companyId: number; projectId: number; data: any }, { rejectWithValue }) => {
    try {
      const res = await postJson(`/companies/${companyId}/projects/${projectId}/budget/categories`, data);
      return res.data;
    } catch (err: any) {
      return rejectWithValue(err?.message || 'Failed to create category');
    }
  }
);

export const updateBudgetCategory = createAsyncThunk(
  'budget/updateBudgetCategory',
  async ({ companyId, projectId, categoryId, data }: { companyId: number; projectId: number; categoryId: number; data: any }, { rejectWithValue }) => {
    try {
      const res = await putJson(`/companies/${companyId}/projects/${projectId}/budget/categories/${categoryId}`, data);
      return res.data;
    } catch (err: any) {
      return rejectWithValue(err?.message || 'Failed to update category');
    }
  }
);

export const deleteBudgetCategory = createAsyncThunk(
  'budget/deleteBudgetCategory',
  async ({ companyId, projectId, categoryId }: { companyId: number; projectId: number; categoryId: number }, { rejectWithValue }) => {
    try {
      await apiFetch(`/companies/${companyId}/projects/${projectId}/budget/categories/${categoryId}`, {
        method: 'DELETE'
      });
      return categoryId;
    } catch (err: any) {
      return rejectWithValue(err?.message || 'Failed to delete category');
    }
  }
);

export const fetchBudgetItems = createAsyncThunk(
  'budget/fetchBudgetItems',
  async ({ companyId, projectId }: { companyId: number; projectId: number }, { rejectWithValue }) => {
    try {
      const res = await getJson(`/companies/${companyId}/projects/${projectId}/budget/items`);
      return res.data;
    } catch (err: any) {
      return rejectWithValue(err?.message || 'Failed to fetch budget items');
    }
  }
);

export const createBudgetItem = createAsyncThunk(
  'budget/createBudgetItem',
  async ({ companyId, projectId, data }: { companyId: number; projectId: number; data: any }, { rejectWithValue }) => {
    try {
      const res = await postJson(`/companies/${companyId}/projects/${projectId}/budget/items`, data);
      return res.data;
    } catch (err: any) {
      return rejectWithValue(err?.message || 'Failed to create budget item');
    }
  }
);

export const updateBudgetItem = createAsyncThunk(
  'budget/updateBudgetItem',
  async ({ companyId, projectId, itemId, data }: { companyId: number; projectId: number; itemId: number; data: any }, { rejectWithValue }) => {
    try {
      const res = await putJson(`/companies/${companyId}/projects/${projectId}/budget/items/${itemId}`, data);
      return res.data;
    } catch (err: any) {
      return rejectWithValue(err?.message || 'Failed to update budget item');
    }
  }
);

export const deleteBudgetItem = createAsyncThunk(
  'budget/deleteBudgetItem',
  async ({ companyId, projectId, itemId }: { companyId: number; projectId: number; itemId: number }, { rejectWithValue }) => {
    try {
      await apiFetch(`/companies/${companyId}/projects/${projectId}/budget/items/${itemId}`, {
        method: 'DELETE'
      });
      return itemId;
    } catch (err: any) {
      return rejectWithValue(err?.message || 'Failed to delete budget item');
    }
  }
);

const budgetSlice = createSlice({
  name: 'budget',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(fetchBudgetCategories.pending, state => { state.isLoading = true; })
      .addCase(fetchBudgetCategories.fulfilled, (state, action) => {
        state.isLoading = false;
        state.categories = action.payload;
      })
      .addCase(fetchBudgetCategories.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(createBudgetCategory.fulfilled, (state, action) => {
        state.categories.push(action.payload);
      })
      .addCase(updateBudgetCategory.fulfilled, (state, action) => {
        state.categories = state.categories.map((cat: any) =>
          cat.id === action.payload.id ? action.payload : cat
        );
      })
      .addCase(deleteBudgetCategory.fulfilled, (state, action) => {
        state.categories = state.categories.filter((cat: any) => cat.id !== action.payload);
      })
      .addCase(fetchBudgetItems.pending, state => { state.isLoading = true; })
      .addCase(fetchBudgetItems.fulfilled, (state, action) => {
        state.isLoading = false;
        state.items = action.payload;
      })
      .addCase(fetchBudgetItems.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(createBudgetItem.fulfilled, (state, action) => {
        state.items.push(action.payload);
      })
      .addCase(updateBudgetItem.fulfilled, (state, action) => {
        state.items = state.items.map((item: any) =>
          item.id === action.payload.id ? action.payload : item
        );
      })
      .addCase(deleteBudgetItem.fulfilled, (state, action) => {
        state.items = state.items.filter((item: any) => item.id !== action.payload);
      });
  }
});

export default budgetSlice.reducer;

