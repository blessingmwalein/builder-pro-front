# Social Login Integration Documentation

## Overview
This document explains how to integrate Google and Facebook social login with your Laravel API backend from your Next.js frontend application.

## Setup Requirements

### 1. Google OAuth Setup
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable Google+ API and Google OAuth2 API
4. Go to "Credentials" → "Create Credentials" → "OAuth 2.0 Client IDs"
5. Set authorized redirect URIs:
   - For development: `http://localhost:3000/auth/google/callback`
   - For production: `https://yourdomain.com/auth/google/callback`
6. Copy the Client ID and Client Secret to your Laravel `.env` file

### 2. Facebook OAuth Setup
1. Go to [Facebook Developers](https://developers.facebook.com/)
2. Create a new app or use existing one
3. Add "Facebook Login" product to your app
4. In Facebook Login settings, add valid OAuth redirect URIs:
   - For development: `http://localhost:3000/auth/facebook/callback`
   - For production: `https://yourdomain.com/auth/facebook/callback`
5. Copy the App ID and App Secret to your Laravel `.env` file

### 3. Laravel Environment Variables
Update your Laravel `.env` file with actual credentials:
```env
GOOGLE_CLIENT_ID=your_actual_google_client_id
GOOGLE_CLIENT_SECRET=your_actual_google_client_secret
FACEBOOK_CLIENT_ID=your_actual_facebook_app_id
FACEBOOK_CLIENT_SECRET=your_actual_facebook_app_secret
```

## Frontend Implementation

### API Integration
The implementation uses your existing API structure from `src/lib/api.ts`:

```typescript
// Using existing API helper instead of fetch
import { api } from '@/lib/api';

// Social login thunks use your API structure
export const getSocialAuthUrl = createAsyncThunk(
  'auth/getSocialAuthUrl',
  async ({ provider }, { rejectWithValue }) => {
    try {
      const response = await api.get(`/auth/${provider}/redirect`);
      return { provider, url: response.redirect_url };
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to get OAuth URL');
    }
  }
);
```

### Error Handling Implementation
The error handling now properly uses your existing API error structure:

1. **API Integration**: Uses your existing `api.ts` helper functions
2. **Error Structure**: Leverages your existing error handling patterns
3. **Consistent Response**: Maintains consistency with your current API implementation
4. **Token Management**: Uses your existing token storage/retrieval system

### Files Modified/Created

1. **AuthSlice Enhancement** (`src/lib/features/auth/authSlice.ts`)
   - Added social login async thunks
   - Enhanced state management for social auth
   - Error handling for OAuth flows
   - Consistent error handling for both login and register

2. **Social Login Buttons** (`src/components/auth/SocialLoginButtons.tsx`)
   - Circular Google and Facebook login buttons
   - Modern construction-themed design
   - Loading states and error handling

3. **Enhanced Login Form** (`src/components/auth/LoginForm.tsx`)
   - Improved error handling for backend validation errors
   - Modern construction-themed UI design
   - Integration with social login buttons

4. **Enhanced Register Form** (`src/components/auth/RegisterForm.tsx`)
   - Matching design with login form
   - Proper validation error display
   - Same error handling patterns as login
   - Two-column layout for name fields
   - Terms of service checkbox

5. **OAuth Callback Pages**
   - `src/app/auth/google/callback/page.tsx`
   - `src/app/auth/facebook/callback/page.tsx`

6. **Company Setup Page**
   - `src/app/onboarding/company-setup/page.tsx`

## API Endpoints

### Available Laravel Endpoints
- `GET /api/v1/auth/google/redirect` - Get Google OAuth URL
- `POST /api/v1/auth/google/callback` - Handle Google callback
- `GET /api/v1/auth/facebook/redirect` - Get Facebook OAuth URL  
- `POST /api/v1/auth/facebook/callback` - Handle Facebook callback
- `POST /api/v1/auth/complete-social-onboarding` - Complete company setup

## Redux State Management

### AuthSlice New Properties
```typescript
interface AuthState {
  // ...existing properties...
  socialLoading: boolean;
  socialError: string | null;
  needsCompanySetup: boolean;
  socialData: any;
  onboardingLoading: boolean;
}
```

### New Async Thunks
- `getSocialAuthUrl` - Fetches OAuth redirect URL
- `handleSocialCallback` - Processes OAuth callback
- `completeSocialOnboarding` - Completes company setup

## Error Handling

### Backend Error Format
```json
{
  "message": "The provided credentials are incorrect.",
  "errors": {
    "email": [
      "The provided credentials are incorrect."
    ]
  }
}
```

### Frontend Error Handling Implementation
The auth slice now properly handles backend errors by:

1. **Parsing HTTP Response**: Checking response status and extracting error data
2. **Structured Error Return**: Returning properly formatted error objects
3. **Field-Specific Errors**: Mapping backend validation errors to form fields
4. **Toast Messages**: Displaying clean error messages instead of raw objects

```typescript
// Example of proper error handling in authSlice
if (!response.ok) {
  if (response.status === 422 && data.errors) {
    return rejectWithValue({
      message: data.message || 'Validation failed',
      errors: data.errors,
      status: response.status
    });
  }
}
```

### Error Display Features
- **Field Validation**: Backend errors appear under specific input fields
- **Clean Messages**: Only the `message` property is shown in toast notifications
- **No Object Display**: Raw error objects are never displayed to users
- **Fallback Handling**: Graceful handling of unexpected error formats

## UI/UX Enhancements

### Construction-Themed Design
- Orange gradient color scheme
- Construction icons (🏗️, building icons)
- Modern card-based layout
- Smooth animations and transitions
- Professional construction industry aesthetic

### Features
- Circular social login buttons
- Loading states with spinners
- Error messages with proper styling
- Responsive design
- Accessibility features

## User Flow

### Social Login Flow
1. User clicks Google/Facebook button
2. Frontend requests OAuth URL from Laravel API
3. User redirected to OAuth provider
4. User authorizes application
5. OAuth provider redirects to callback URL
6. Frontend processes callback and sends to Laravel
7. Laravel returns user data and token
8. User redirected to dashboard or company setup

### Company Setup Flow (if needed)
1. After social login, check `needs_company_setup` flag
2. Redirect to `/onboarding/company-setup`
3. User completes company information
4. Submit to `/api/v1/auth/complete-social-onboarding`
5. Redirect to dashboard

## Testing

### Test the Integration
1. Start your development servers (Next.js and Laravel)
2. Navigate to `http://localhost:3000/auth/login`
3. Click on Google or Facebook buttons
4. Complete OAuth flow
5. Verify proper error handling with invalid credentials

### Error Testing
- Test with invalid email/password
- Test with network errors
- Test OAuth cancellation
- Test expired OAuth codes

## Security Considerations

1. **HTTPS Required**: OAuth providers require HTTPS in production
2. **State Parameter**: Used to prevent CSRF attacks (handled automatically)
3. **Token Storage**: Store auth tokens securely in Redux store
4. **Redirect URI Validation**: Must match exactly in OAuth provider settings
5. **CORS**: Ensure Laravel API allows requests from Next.js frontend

## Troubleshooting

### Common Issues
1. **Redirect URI Mismatch**: Check OAuth provider settings
2. **CORS Errors**: Configure Laravel CORS properly
3. **Invalid Client**: Verify client ID/secret in Laravel `.env`
4. **Token Errors**: Check token storage and retrieval
5. **Styling Issues**: Ensure Tailwind CSS is properly configured

### Debug Steps
1. Check browser console for errors
2. Verify API responses in Network tab
3. Check Laravel logs for backend errors
4. Validate OAuth provider settings
5. Test with different browsers/devices

This implementation provides a complete, modern social login integration with proper error handling and a construction-themed UI design.

## Implementation Notes

### Using Existing API Structure
- All API calls use your existing `api.get()` and `api.post()` methods
- Error handling follows your established patterns
- Token management integrates with your current authentication system
- Response format matches your existing API implementation

### Benefits of Using Existing API
- Consistent error handling across the application
- Automatic token attachment for authenticated requests
- Centralized request/response interceptors
- Built-in retry logic and timeout handling

## Register Form Integration

### Overview
The register form allows users to create a new account using email/password or social login. It collects first_name and last_name separately in the UI but combines them into a single name field when submitting to the API.

### API Integration
The register form transforms the data before sending to match your API requirements:

```typescript
// Register thunk combines first_name and last_name into name
export const registerUser = createAsyncThunk(
  'auth/registerUser',
  async ({ first_name, last_name, email, password, password_confirmation, device_name }, { rejectWithValue }) => {
    try {
      // Combine first_name and last_name into name field for API
      const userData = {
        name: `${first_name} ${last_name}`.trim(),
        email,
        password,
        password_confirmation,
        device_name,
      };

      const res = await postJson('/auth/register-user', userData);
      return res.data;
    } catch (error: any) {
      return rejectWithValue(error);
    }
  }
);
```

### Data Transformation
- **Frontend Form**: Collects `first_name` and `last_name` separately for better UX
- **API Submission**: Combines them into single `name` field as required by your API
- **Error Mapping**: Maps any `name` field errors back to `first_name` for display

### Register API Endpoint
Your API expects this format:
```json
{
  "name": "John Doe",
  "email": "user@example.com",
  "password": "password123",
  "password_confirmation": "password123"
}
```

## Authentication Flow & Middleware

### Middleware Protection
The application now includes middleware that protects all routes except authentication pages:

1. **Protected Routes**: All pages except `/auth/login`, `/auth/register`, and callback pages
2. **Automatic Redirects**: Unauthenticated users are redirected to login
3. **Token Validation**: Middleware checks for valid authentication tokens
4. **Authenticated Redirects**: Logged-in users are redirected away from login/register pages

### Files Added for Authentication Flow

7. **Middleware** (`src/middleware.ts`)
   - Route protection logic
   - Authentication state checking
   - Automatic redirects

8. **Auth Provider** (`src/components/providers/AuthProvider.tsx`)
   - Initializes authentication state on app load
   - Handles loading states during initialization
   - Validates tokens from cookies

9. **Enhanced Profile Page** (`src/app/profile/page.tsx`)
   - Integrated with DashboardLayout component for consistent navigation
   - Modern tabular view for all user information display
   - Professional table design with alternating row colors and hover effects
   - Gradient headers for different information sections
   - Smart data formatting with badges, verification icons, and code styling
   - Company information display with comprehensive details
   - Quick action buttons organized in responsive grid
   - Optimized for both desktop and mobile viewing

### Profile Page Features

The profile page now includes:
- **DashboardLayout Integration**: Full integration with existing dashboard navigation and sidebar
- **Tabular Data Display**: Clean, organized tables for personal and company information
- **Smart Data Formatting**: 
  - Badges for status indicators and roles
  - Verification icons for email status
  - Code formatting for technical fields like company slug
  - Date formatting for timestamps
- **Enhanced Visual Design**: 
  - Gradient table headers with section-specific colors
  - Hover effects on table rows
  - Professional styling consistent with dashboard theme
- **Responsive Tables**: Horizontal scrolling on smaller screens
- **Quick Actions Grid**: Organized action buttons in responsive grid layout
- **Profile Header**: Prominent user information display with avatar and status badges

### Authentication State Management

The auth slice now includes:
- `initializeAuth` - Validates token and loads user data on app start
- `setAuthFromCookie` - Sets auth state from stored cookie
- Enhanced error handling for token validation
- Proper cleanup when tokens are invalid

### User Experience Flow

1. **App Initialization**: Auth state is loaded from cookies
2. **Route Protection**: Middleware redirects unauthenticated users
3. **Profile Loading**: User data is fetched and displayed
4. **Token Refresh**: Invalid tokens are automatically cleared
5. **Seamless Navigation**: Authenticated users have full access
