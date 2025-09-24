'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAppSelector } from '@/lib/hooks';

export default function Home() {
  const router = useRouter();
  const { isAuthenticated, onboardingStep } = useAppSelector((state) => state.auth);

  useEffect(() => {
    if (isAuthenticated) {
      // Redirect based on onboarding step
      switch (onboardingStep) {
        case 'complete_profile':
          router.push('/onboarding/complete-profile');
          break;
        case 'create_company':
          router.push('/onboarding/create-company');
          break;
        case 'select_plan':
          router.push('/onboarding/select-plan');
          break;
        case 'completed':
          router.push('/dashboard');
          break;
        default:
          router.push('/dashboard');
      }
    } else {
      router.push('/auth/login');
    }
  }, [isAuthenticated, onboardingStep, router]);

  // Show loading spinner while redirecting
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="flex flex-col items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <p className="mt-4 text-gray-600">Loading...</p>
      </div>
    </div>
  );
}