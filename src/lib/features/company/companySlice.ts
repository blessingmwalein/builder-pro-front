import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Company, User, ApiResponse, Plan } from '@/types';
import { postJson, getJson } from '@/lib/api';

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

export const fetchCompanyUsers = createAsyncThunk(
  'company/fetchUsers',
  async (companyId: number) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    // Mock users data
    return [
      {
        id: 1,
        name: 'John Doe',
        email: 'john@example.com',
        role: 'admin' as const,
        position: 'Project Manager',
        phone: '+1234567890',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        id: 2,
        name: 'Jane Smith',
        email: 'jane@example.com',
        role: 'project_manager' as const,
        position: 'Senior Developer',
        phone: '+1234567891',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        id: 3,
        name: 'Bob Wilson',
        email: 'bob@example.com',
        role: 'site_supervisor' as const,
        position: 'Site Supervisor',
        phone: '+1234567892',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
    ];
  }
);

export const inviteUser = createAsyncThunk(
  'company/inviteUser',
  async ({ companyId, userData }: { companyId: number; userData: { email: string; name: string; role: string } }) => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    return {
      id: Date.now(),
      ...userData,
      role: userData.role as User['role'],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
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
      })
      // Invite user
      .addCase(inviteUser.fulfilled, (state, action) => {
        state.users.push(action.payload);
      });
  },
});

export const { setCurrentCompany, clearError, removeUser } = companySlice.actions;
export default companySlice.reducer;
