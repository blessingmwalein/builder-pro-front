import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { User, ApiResponse, ActivePlan } from '@/types';
import { getJson, postJson } from '@/lib/api';
import { setTokenCookie, clearTokenCookie, getTokenCookie } from '@/lib/auth';

interface AuthState {
  user: User | null;
  token: string | null;
  activePlan: ActivePlan | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  error: string | null;
  onboardingStep: 'register' | 'complete_profile' | 'create_company' | 'select_plan' | 'completed';
}

const initialState: AuthState = {
  user: null,
  token: null,
  activePlan: null,
  isLoading: false,
  isAuthenticated: false,
  error: null,
  onboardingStep: 'register',
};

export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async ({ email, password, device_name }: { email: string; password: string; device_name: string }) => {
    const res = await postJson<ApiResponse<{ token: string; user: User }>>('/auth/login-user', {
      email,
      password,
      device_name,
    });
    const { token, user } = res.data;
    setTokenCookie(token);
    return { token, user };
  }
);

export const registerUser = createAsyncThunk(
  'auth/registerUser',
  async ({ name, email, password, password_confirmation }: { name: string; email: string; password: string; password_confirmation: string }) => {
    const res = await postJson<ApiResponse<{ token: string; user: User }>>('/auth/register-user', {
      name,
      email,
      password,
      password_confirmation,
    });
    const { token, user } = res.data;
    setTokenCookie(token);
    return { token, user };
  }
);

export const completeProfile = createAsyncThunk(
  'auth/completeProfile',
  async ({ name, position, account_type, phone, avatar_url }: { name?: string; position: string; account_type?: 'company' | 'individual'; phone: string; avatar_url?: string }) => {
    const res = await postJson<ApiResponse<User>>('/auth/complete-profile', {
      name,
      position,
      account_type,
      phone,
      avatar_url,
    });
    return res.data;
  }
);

export const fetchProfile = createAsyncThunk('auth/fetchProfile', async () => {
  const res = await getJson<ApiResponse<{ user: User; plan?: ActivePlan }>>('/profile');
  return res.data;
});

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.onboardingStep = 'register';
      clearTokenCookie();
    },
    clearError: (state) => {
      state.error = null;
    },
    setOnboardingStep: (state, action: PayloadAction<AuthState['onboardingStep']>) => {
      state.onboardingStep = action.payload;
    },
    setToken: (state, action: PayloadAction<string>) => {
      state.token = action.payload;
      state.isAuthenticated = true;
    },
  },
  extraReducers: (builder) => {
    builder
      // Login cases
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
        state.onboardingStep = 'completed';
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Login failed';
      })
      // Register cases
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
        state.onboardingStep = 'complete_profile';
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Registration failed';
      })
      // Complete profile cases
      .addCase(completeProfile.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(completeProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
        // If user selected individual, skip company creation
        const accountType = (action.meta.arg as any).account_type;
        if (accountType === 'individual') {
          state.onboardingStep = 'completed';
        } else {
          state.onboardingStep = 'create_company';
        }
      })
      .addCase(completeProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Profile completion failed';
      })
      // Fetch profile
      .addCase(fetchProfile.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.activePlan = action.payload.plan ?? null;
        state.isAuthenticated = true;
        state.onboardingStep = 'completed';
      })
      .addCase(fetchProfile.rejected, (state) => {
        state.isLoading = false;
      });
  },
});

export const { logout, clearError, setOnboardingStep, setToken } = authSlice.actions;
export default authSlice.reducer;
