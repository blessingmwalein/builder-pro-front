import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { User, ApiResponse, ActivePlan } from '@/types';
import { getJson, postJson, api } from '@/lib/api';
import { setTokenCookie, clearTokenCookie, getTokenCookie } from '@/lib/auth';

interface AuthState {
  user: User | null;
  token: string | null;
  activePlan: ActivePlan | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  error: string | null;
  onboardingStep: 'register' | 'complete_profile' | 'create_company' | 'select_plan' | 'completed';
  socialLoading: boolean;
  socialError: string | null;
  needsCompanySetup: boolean;
  socialData: any;
  onboardingLoading: boolean;
}

const initialState: AuthState = {
  user: null,
  token: null,
  activePlan: null,
  isLoading: false,
  isAuthenticated: false,
  error: null,
  onboardingStep: 'register',
  socialLoading: false,
  socialError: null,
  needsCompanySetup: false,
  socialData: null,
  onboardingLoading: false,
};

export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async (userData: { email: string; password: string; device_name: string }, { rejectWithValue }) => {
    try {
      const res = await postJson<ApiResponse<{ token: string; user: User }>>('/auth/login', userData);
      const { token, user } = res.data;
      setTokenCookie(token);
      return { token, user };
    } catch (error: any) {
      // Extract serializable error data
      if (error && typeof error === 'object') {
        // Try to parse the error message if it contains JSON
        let errorMessage = error.message || 'Login failed';
        let errorData = null;
        
        // Check if error message contains JSON data
        if (errorMessage.includes('{"message":')) {
          try {
            const jsonStart = errorMessage.indexOf('{"message":');
            const jsonString = errorMessage.substring(jsonStart);
            errorData = JSON.parse(jsonString);
            
            return rejectWithValue({
              message: errorData.message || 'Login failed',
              errors: errorData.errors || {},
              status: 422
            });
          } catch (parseError) {
            // If JSON parsing fails, use the original message
            return rejectWithValue({
              message: errorMessage,
              errors: {},
              status: 0
            });
          }
        }
        
        return rejectWithValue({
          message: errorMessage,
          errors: {},
          status: 0
        });
      }
      
      return rejectWithValue({
        message: 'Network error occurred',
        errors: {},
        status: 0
      });
    }
  }
);

export const registerUser = createAsyncThunk(
  'auth/registerUser',
  async ({ first_name, last_name, email, password, password_confirmation, device_name }: { 
    first_name: string; 
    last_name: string; 
    email: string; 
    password: string; 
    password_confirmation: string; 
    device_name: string;
  }, { rejectWithValue }) => {
    try {
      // Combine first_name and last_name into name field for API
      const userData = {
        name: `${first_name} ${last_name}`.trim(),
        email,
        password,
        password_confirmation,
        device_name,
      };

      const res = await postJson<ApiResponse<{ token: string; user: User }>>('/auth/register-user', userData);
      const { token, user } = res.data;
      setTokenCookie(token);
      return { token, user };
    } catch (error: any) {
      // Extract serializable error data
      if (error && typeof error === 'object') {
        let errorMessage = error.message || 'Registration failed';
        
        // Check if error message contains JSON data
        if (errorMessage.includes('{"message":')) {
          try {
            const jsonStart = errorMessage.indexOf('{"message":');
            const jsonString = errorMessage.substring(jsonStart);
            const errorData = JSON.parse(jsonString);
            
            return rejectWithValue({
              message: errorData.message || 'Registration failed',
              errors: errorData.errors || {},
              status: 422
            });
          } catch (parseError) {
            return rejectWithValue({
              message: errorMessage,
              errors: {},
              status: 0
            });
          }
        }
        
        return rejectWithValue({
          message: errorMessage,
          errors: {},
          status: 0
        });
      }
      
      return rejectWithValue({
        message: 'Network error occurred',
        errors: {},
        status: 0
      });
    }
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

export const fetchProfile = createAsyncThunk(
  'auth/fetchProfile', 
  async (_, { rejectWithValue }) => {
    try {
      // Your API directly returns { user: {...} }, not wrapped in ApiResponse
      const res = await getJson('/profile');
      console.log('fetchProfile - Raw API Response:', res); // Debug log
      
      // Since your API returns { user: {...} } directly
      return res;
    } catch (error: any) {
      console.log('fetchProfile error:', error); // Debug log
      return rejectWithValue('Failed to fetch profile');
    }
  }
);

export const getSocialAuthUrl = createAsyncThunk(
  'auth/getSocialAuthUrl',
  async ({ provider }: { provider: 'google' | 'facebook' }, { rejectWithValue }) => {
    try {
      const res = await getJson<ApiResponse<{ redirect_url: string }>>(`/auth/${provider}/redirect`);
      return { provider, url: res.data.redirect_url };
    } catch (error: any) {
      // Extract serializable error data
      if (error && typeof error === 'object') {
        let errorMessage = error.message || 'Failed to get OAuth URL';
        
        // Check if error message contains JSON data
        if (errorMessage.includes('{"message":')) {
          try {
            const jsonStart = errorMessage.indexOf('{"message":');
            const jsonString = errorMessage.substring(jsonStart);
            const errorData = JSON.parse(jsonString);
            
            return rejectWithValue(errorData.message || 'Failed to get OAuth URL');
          } catch (parseError) {
            return rejectWithValue(errorMessage);
          }
        }
        
        return rejectWithValue(errorMessage);
      }
      
      return rejectWithValue('Failed to get OAuth URL');
    }
  }
);

export const handleSocialCallback = createAsyncThunk(
  'auth/handleSocialCallback',
  async ({ provider, code, state }: { provider: string; code: string; state: string }, { rejectWithValue }) => {
    try {
      const res = await postJson<ApiResponse<{ 
        token: string; 
        user: User; 
        needs_company_setup: boolean; 
        social_data: any 
      }>>(`/auth/${provider}/callback`, { code, state });
      
      const { token, user } = res.data;
      setTokenCookie(token);
      return res.data;
    } catch (error: any) {
      // Extract serializable error data
      if (error && typeof error === 'object') {
        let errorMessage = error.message || 'Social login failed';
        
        // Check if error message contains JSON data
        if (errorMessage.includes('{"message":')) {
          try {
            const jsonStart = errorMessage.indexOf('{"message":');
            const jsonString = errorMessage.substring(jsonStart);
            const errorData = JSON.parse(jsonString);
            
            return rejectWithValue(errorData.message || 'Social login failed');
          } catch (parseError) {
            return rejectWithValue(errorMessage);
          }
        }
        
        return rejectWithValue(errorMessage);
      }
      
      return rejectWithValue('Social login failed');
    }
  }
);

export const completeSocialOnboarding = createAsyncThunk(
  'auth/completeSocialOnboarding',
  async (companyData: any, { rejectWithValue }) => {
    try {
      const res = await postJson<ApiResponse<{ company: any; user: User }>>('/auth/complete-social-onboarding', companyData);
      return res.data;
    } catch (error: any) {
      return rejectWithValue(error);
    }
  }
);

export const initializeAuth = createAsyncThunk(
  'auth/initializeAuth',
  async (_, { rejectWithValue }) => {
    try {
      const token = getTokenCookie();
      if (!token) {
        return null;
      }
      
      // If token exists, fetch profile to validate it
      const res = await getJson('/profile');
      console.log('initializeAuth - Raw API Response:', res); // Debug log
      
      // Your API returns { user: {...} } directly
      return { token, ...res };
    } catch (error: any) {
      console.log('initializeAuth error:', error); // Debug log
      // If token is invalid, clear it
      clearTokenCookie();
      return rejectWithValue('Invalid token');
    }
  }
);

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
    clearSocialError: (state) => {
      state.socialError = null;
    },
    setSocialLoading: (state, action) => {
      state.socialLoading = action.payload;
    },
    setAuthFromCookie: (state, action) => {
      const token = getTokenCookie();
      if (token) {
        state.token = token;
        state.isAuthenticated = true;
      }
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
        // Store only the message string, not the entire error object
        state.error = typeof action.payload === 'object' && action.payload?.message 
          ? action.payload.message 
          : 'Login failed';
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
        // Store only the message string, not the entire error object
        state.error = typeof action.payload === 'object' && action.payload?.message 
          ? action.payload.message 
          : 'Registration failed';
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
      // Fetch profile cases
      .addCase(fetchProfile.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchProfile.fulfilled, (state, action) => {
        console.log('fetchProfile.fulfilled payload:', action.payload); // Debug log
        state.isLoading = false;
        
        // Your API returns { user: {...} } directly
        if (action.payload && action.payload.user) {
          state.user = action.payload.user;
          state.activePlan = action.payload.plan ?? null;
          state.isAuthenticated = true;
          state.onboardingStep = 'completed';
        } else {
          console.error('No user data in payload:', action.payload);
          state.error = 'No user data received';
        }
      })
      .addCase(fetchProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
        // If profile fetch fails, user might not be authenticated
        state.isAuthenticated = false;
        state.user = null;
        state.token = null;
        clearTokenCookie();
      })
      // Social auth URL cases
      .addCase(getSocialAuthUrl.pending, (state) => {
        state.socialLoading = true;
        state.socialError = null;
      })
      .addCase(getSocialAuthUrl.fulfilled, (state) => {
        state.socialLoading = false;
      })
      .addCase(getSocialAuthUrl.rejected, (state, action) => {
        state.socialLoading = false;
        state.socialError = action.payload as string;
      })
      // Social callback cases
      .addCase(handleSocialCallback.pending, (state) => {
        state.socialLoading = true;
        state.socialError = null;
      })
      .addCase(handleSocialCallback.fulfilled, (state, action) => {
        state.socialLoading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.needsCompanySetup = action.payload.needs_company_setup;
        state.socialData = action.payload.social_data;
        state.isAuthenticated = true;
      })
      .addCase(handleSocialCallback.rejected, (state, action) => {
        state.socialLoading = false;
        state.socialError = action.payload as string;
      })
      // Social onboarding cases
      .addCase(completeSocialOnboarding.pending, (state) => {
        state.onboardingLoading = true;
        state.socialError = null;
      })
      .addCase(completeSocialOnboarding.fulfilled, (state, action) => {
        state.onboardingLoading = false;
        state.needsCompanySetup = false;
        state.user = { ...state.user, company: action.payload.company };
      })
      .addCase(completeSocialOnboarding.rejected, (state, action) => {
        state.onboardingLoading = false;
        state.socialError = action.payload as string;
      })
      // Initialize auth cases
      .addCase(initializeAuth.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(initializeAuth.fulfilled, (state, action) => {
        console.log('initializeAuth.fulfilled payload:', action.payload); // Debug log
        state.isLoading = false;
        
        if (action.payload && action.payload.user) {
          state.user = action.payload.user;
          state.token = action.payload.token;
          state.activePlan = action.payload.plan ?? null;
          state.isAuthenticated = true;
          state.onboardingStep = 'completed';
        } else {
          // No token or invalid response
          state.isAuthenticated = false;
          state.user = null;
          state.token = null;
        }
      })
      .addCase(initializeAuth.rejected, (state, action) => {
        state.isLoading = false;
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
        state.error = action.payload as string;
        clearTokenCookie();
      });
  },
});

export const { logout, clearError, setOnboardingStep, setToken, clearSocialError, setSocialLoading, setAuthFromCookie } = authSlice.actions;
export default authSlice.reducer;
