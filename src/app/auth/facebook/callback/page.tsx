'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { handleSocialCallback } from '@/lib/features/auth/authSlice';
import toast from 'react-hot-toast';

export default function FacebookCallback() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const dispatch = useAppDispatch();
  const { socialLoading, needsCompanySetup } = useAppSelector((state) => state.auth);

  useEffect(() => {
    const handleCallback = async () => {
      const code = searchParams.get('code');
      const state = searchParams.get('state');
      const error = searchParams.get('error');
      
      if (error) {
        toast.error('Facebook login was cancelled or failed');
        router.push('/auth/login?error=facebook_auth_cancelled');
        return;
      }
      
      if (code) {
        try {
          const result = await dispatch(handleSocialCallback({ 
            provider: 'facebook', 
            code, 
            state: state || '' 
          })).unwrap();
          
          toast.success('Facebook login successful! 🎉');
          
          if (result.needs_company_setup) {
            router.push('/onboarding/company-setup');
          } else {
            router.push('/dashboard');
          }
        } catch (error: any) {
          console.error('Facebook callback error:', error);
          let errorMessage = 'Facebook login failed';
          
          if (error && typeof error === 'object' && error.message) {
            errorMessage = error.message;
          } else if (typeof error === 'string') {
            errorMessage = error;
          }
          
          toast.error(errorMessage);
          router.push('/auth/login?error=facebook_auth_failed');
        }
      } else {
        toast.error('No authorization code received');
        router.push('/auth/login?error=facebook_auth_failed');
      }
    };
    
    if (searchParams) {
      handleCallback();
    }
  }, [searchParams, dispatch, router]);
  
  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-500 mx-auto"></div>
        <p className="mt-6 text-lg text-gray-600">Processing Facebook login...</p>
        <p className="mt-2 text-sm text-gray-500">Please wait while we complete your authentication</p>
      </div>
    </div>
  );
}
