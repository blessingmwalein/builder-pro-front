import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Company, User, ApiResponse, Plan } from '@/types';
import { postJson, getJson, apiFetch, putJson } from '@/lib/api';

interface CompanyState {
  currentCompany: Company | null;
  companies: Company[];
  users: User[];
  plans: Plan[];
  isLoading: boolean;
  error: string | null;
}

const initialState: CompanyState = {
  currentCompany: null,
  companies: [],
  users: [],
  plans: [],
  isLoading: false,
  error: null,
};

// Mock async thunks
export const createCompany = createAsyncThunk(
  'company/createCompany',
  async (companyData: Omit<Company, 'id' | 'created_at' | 'updated_at'>) => {
    const res = await postJson<ApiResponse<Company>>('/companies', companyData);
    return res.data;
  }
);

export const fetchPlans = createAsyncThunk(
  'company/fetchPlans',
  async () => {
    const res = await getJson<ApiResponse<Plan[]>>('/plans');
    return res.data;
  }
);

export const selectPlan = createAsyncThunk(
  'company/selectPlan',
  async ({ plan_code }: { plan_code: string }) => {
    const res = await postJson<ApiResponse<{ success?: boolean }>>(`/user/select-plan`, { plan_code });
    return res.data;
  }
);

export const fetchCompanies = createAsyncThunk(
  'company/fetchCompanies',
  async (_, { rejectWithValue }) => {
    try {
      const res = await apiFetch('/admin/companies');
      return res.data;
    } catch (err: any) {
      return rejectWithValue(err?.message || 'Failed to fetch companies');
    }
  }
);

export const fetchCompanyUsers = createAsyncThunk(
  'company/fetchCompanyUsers',
  async (companyId: number, { rejectWithValue }) => {
    try {
      const res = await apiFetch(`/companies/${companyId}/users`);
      return res.data;
    } catch (err: any) {
      return rejectWithValue(err?.message || 'Failed to fetch company users');
    }
  }
);

//update this to use post json postJson
export const updateCompany = createAsyncThunk(
  'company/updateCompany',
  async ({ companyId, data }: { companyId: number; data: any }, { rejectWithValue }) => {
    try {
      const res = await putJson(`/admin/companies/${companyId}`, data);
      return res.data;
    } catch (err: any) {
      return rejectWithValue(err?.message || 'Failed to update company');
    }
  }
);

export const addCompanyUser = createAsyncThunk(
  'company/addCompanyUser',
  async ({ companyId, data }: { companyId: number; data: any }, { rejectWithValue }) => {
    try {
      const res = await postJson(`/companies/${companyId}/users`, data);
      return res.data;
    } catch (err: any) {
      return rejectWithValue(err?.message || 'Failed to add user');
    }
  }
);

const companySlice = createSlice({
  name: 'company',
  initialState,
  reducers: {
    setCurrentCompany: (state, action: PayloadAction<Company>) => {
      state.currentCompany = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
    removeUser: (state, action: PayloadAction<number>) => {
      state.users = state.users.filter(user => user.id !== action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      // Create company
      .addCase(createCompany.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createCompany.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentCompany = action.payload;
        state.companies.push(action.payload);
        // Move to plan selection step in state
      })
      .addCase(createCompany.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to create company';
      })
      // Fetch plans
      .addCase(fetchPlans.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchPlans.fulfilled, (state, action) => {
        state.isLoading = false;
        state.plans = action.payload;
      })
      .addCase(fetchPlans.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to fetch plans';
      })
      // Select plan
      .addCase(selectPlan.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(selectPlan.fulfilled, (state, action) => {
        state.isLoading = false;
      })
      .addCase(selectPlan.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to select plan';
      })
      // Fetch companies
      .addCase(fetchCompanies.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchCompanies.fulfilled, (state, action) => {
        state.isLoading = false;
        state.companies = action.payload;
      })
      .addCase(fetchCompanies.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Fetch users
      .addCase(fetchCompanyUsers.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchCompanyUsers.fulfilled, (state, action) => {
        state.isLoading = false;
        state.users = action.payload;
      })
      .addCase(fetchCompanyUsers.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to fetch users';
      });
  },
});

export const { setCurrentCompany, clearError, removeUser } = companySlice.actions;
export default companySlice.reducer;
