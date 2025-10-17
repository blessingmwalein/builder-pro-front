import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { User, LoginForm, RegisterForm, CompanySetupForm, AuthResponse } from '../../../types';

// API base URL
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

// Helper function for API calls
const apiCall = async (endpoint: string, options: RequestInit = {}) => {
  const token = localStorage.getItem('auth_token');
  
  const defaultOptions: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    },
  };
  
  const config = {
    ...defaultOptions,
    ...options,
    headers: {
      ...defaultOptions.headers,
      ...options.headers,
    },
  };
  
  const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(data.message || `HTTP error! status: ${response.status}`);
  }
  
  return data;
};

// Regular auth functions
export const login = createAsyncThunk(
  'auth/login',
  async (credentials: LoginForm, { rejectWithValue }) => {
    try {
      const response = await apiCall('/api/v1/auth/login', {
        method: 'POST',
        body: JSON.stringify(credentials),
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Login failed');
    }
  }
);

export const register = createAsyncThunk(
  'auth/register-user',
  async (userData: RegisterForm, { rejectWithValue }) => {
    try {
      const response = await apiCall('/api/v1/auth/register-user', {
        method: 'POST',
        body: JSON.stringify(userData),
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Registration failed');
    }
  }
);

// Alias functions for compatibility
export const loginUser = login;
export const registerUser = register;

// Social login functions
export const loginWithGoogle = createAsyncThunk(
  'auth/loginWithGoogle',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/auth/google/redirect`);
      const data = await response.json();
      
      if (data.redirect_url) {
        window.location.href = data.redirect_url;
        return { redirected: true };
      } else {
        throw new Error('Failed to get Google OAuth URL');
      }
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Google login failed');
    }
  }
);

export const loginWithFacebook = createAsyncThunk(
  'auth/loginWithFacebook',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/auth/facebook/redirect`);
      const data = await response.json();
      
      if (data.redirect_url) {
        window.location.href = data.redirect_url;
        return { redirected: true };
      } else {
        throw new Error('Failed to get Facebook OAuth URL');
      }
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Facebook login failed');
    }
  }
);

export const socialLogin = createAsyncThunk(
  'auth/socialLogin',
  async ({ provider, code, state }: { provider: string; code: string; state: string }, { rejectWithValue }) => {
    try {
      const response = await apiCall(`/api/v1/auth/${provider}/callback`, {
        method: 'POST',
        body: JSON.stringify({ code, state }),
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Social login failed');
    }
  }
);

export const completeSocialOnboarding = createAsyncThunk(
  'auth/completeSocialOnboarding',
  async (companyData: CompanySetupForm, { rejectWithValue }) => {
    try {
      const response = await apiCall('/api/v1/auth/complete-social-onboarding', {
        method: 'POST',
        body: JSON.stringify(companyData),
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Company setup failed');
    }
  }
);

export const fetchProfile = createAsyncThunk(
  'auth/fetchProfile',
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiCall('/api/v1/auth/profile');
      return response.data;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to fetch profile');
    }
  }
);

// Initial state
interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
  needsCompanySetup: boolean;
  socialData: {
    company_name_suggestions?: string[];
  } | null;
}

const initialState: AuthState = {
  user: null,
  token: typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null,
  isAuthenticated: typeof window !== 'undefined' ? !!localStorage.getItem('auth_token') : false,
  loading: false,
  error: null,
  needsCompanySetup: false,
  socialData: null,
};

// Slice
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.loading = false;
      state.error = null;
      state.needsCompanySetup = false;
      state.socialData = null;
      if (typeof window !== 'undefined') {
        localStorage.removeItem('auth_token');
      }
    },
    clearError: (state) => {
      state.error = null;
    },
    setNeedsCompanySetup: (state, action) => {
      state.needsCompanySetup = action.payload;
    },
    setToken: (state, action) => {
      state.token = action.payload;
      state.isAuthenticated = !!action.payload;
      if (typeof window !== 'undefined') {
        if (action.payload) {
          localStorage.setItem('auth_token', action.payload);
        } else {
          localStorage.removeItem('auth_token');
        }
      }
    },
  },
  extraReducers: (builder) => {
    // Handle all login variants
    const handleLoginSuccess = (state: any, action: any) => {
      state.loading = false;
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isAuthenticated = true;
      if (typeof window !== 'undefined') {
        localStorage.setItem('auth_token', action.payload.token);
      }
    };

    const handleLoginPending = (state: any) => {
      state.loading = true;
      state.error = null;
    };

    const handleLoginRejected = (state: any, action: any) => {
      state.loading = false;
      state.error = action.payload as string;
    };

    builder
      // Login
      .addCase(login.pending, handleLoginPending)
      .addCase(login.fulfilled, handleLoginSuccess)
      .addCase(login.rejected, handleLoginRejected)
      
      // Register  
      .addCase(register.pending, handleLoginPending)
      .addCase(register.fulfilled, handleLoginSuccess)
      .addCase(register.rejected, handleLoginRejected)

      // Google Login
      .addCase(loginWithGoogle.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginWithGoogle.fulfilled, (state) => {
        state.loading = false;
        // Redirect handled in thunk
      })
      .addCase(loginWithGoogle.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Facebook Login
      .addCase(loginWithFacebook.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginWithFacebook.fulfilled, (state) => {
        state.loading = false;
        // Redirect handled in thunk
      })
      .addCase(loginWithFacebook.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Social Login
      .addCase(socialLogin.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(socialLogin.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
        state.needsCompanySetup = action.payload.needs_company_setup || false;
        state.socialData = action.payload.social_data || null;
        if (typeof window !== 'undefined') {
          localStorage.setItem('auth_token', action.payload.token);
        }
      })
      .addCase(socialLogin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Complete Social Onboarding
      .addCase(completeSocialOnboarding.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(completeSocialOnboarding.fulfilled, (state, action) => {
        state.loading = false;
        state.needsCompanySetup = false;
        if (state.user) {
          state.user.company = action.payload.company;
        }
      })
      .addCase(completeSocialOnboarding.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Fetch Profile
      .addCase(fetchProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user || action.payload;
      })
      .addCase(fetchProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.isAuthenticated = false;
        state.token = null;
        if (typeof window !== 'undefined') {
          localStorage.removeItem('auth_token');
        }
      });
  },
});

export const { logout, clearError, setNeedsCompanySetup, setToken } = authSlice.actions;
export default authSlice.reducer;