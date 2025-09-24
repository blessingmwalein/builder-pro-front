'use client';

import { Provider } from 'react-redux';
import { store } from '@/lib/store';
import { useEffect } from 'react';
import { useAppDispatch } from '@/lib/hooks';
import { fetchProfile, setToken } from '@/lib/features/auth/authSlice';
import { getTokenCookie } from '@/lib/auth';

function AuthInitializer({ children }: { children: React.ReactNode }) {
  const dispatch = useAppDispatch();

  useEffect(() => {
    const token = getTokenCookie();
    if (token) {
      dispatch(setToken(token));
      dispatch(fetchProfile());
    }
  }, [dispatch]);

  return <>{children}</>;
}

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <AuthInitializer>
        {children}
      </AuthInitializer>
    </Provider>
  );
}


