'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { registerUser } from '@/lib/features/auth/authSlice';
import { registerSchema } from '@/lib/validations';
import { RegisterForm as RegisterFormType } from '@/types';
import { SocialLoginButtons } from './SocialLoginButtons';

export function RegisterForm() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { isLoading, error } = useAppSelector((state) => state.auth);

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    setError,
    watch,
  } = useForm<RegisterFormType>({
    resolver: yupResolver(registerSchema),
    mode: 'onChange',
    defaultValues: {
      device_name: 'web',
      first_name: '',
      last_name: '',
      email: '',
      password: '',
      password_confirmation: '',
      terms: false,
    },
  });

  // Watch form values for debugging
  const formValues = watch();
  console.log('Form values:', formValues);
  console.log('Form errors:', errors);
  console.log('Form isValid:', isValid);

  const onSubmit = async (data: RegisterFormType) => {
    console.log('Form submitted with data:', data);

    try {
      const result = await dispatch(registerUser(data)).unwrap();
      console.log('Registration successful:', result);
      toast.success('Account created successfully! 🎉');
      router.push('/');
    } catch (error: any) {
      console.log('Registration error received:', error);

      // Handle structured error response
      if (error && typeof error === 'object') {
        // Handle field-specific errors
        if (error.errors && typeof error.errors === 'object') {
          Object.keys(error.errors).forEach((field) => {
            const errorMessages = error.errors[field];
            if (Array.isArray(errorMessages) && errorMessages.length > 0) {
              const mappedField = field === 'name' ? 'first_name' : field;
              setError(mappedField as keyof RegisterFormType, {
                type: 'server',
                message: errorMessages[0],
              });
            }
          });
        }

        if (error.message && typeof error.message === 'string') {
          toast.error(error.message);
        } else {
          toast.error('Registration failed. Please check your information.');
        }
      } else if (typeof error === 'string') {
        toast.error(error);
      } else {
        toast.error('Registration failed. Please try again.');
      }
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl w-full space-y-8">
        {/* Header Section */}
        <div className="text-center">
          <div className="mx-auto h-16 w-16 bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl flex items-center justify-center shadow-lg">
            <svg className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          </div>
          <h2 className="mt-6 text-3xl font-bold text-gray-900">
            Create Your Account
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Join BuilderPro and start managing your projects
          </p>
        </div>

        {/* Register Card */}
        <div className="bg-white py-10 px-10 shadow-xl rounded-2xl border border-gray-100 w-full">
          {/* Social Login Buttons */}
          <SocialLoginButtons />

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Name Fields Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                {...register('first_name')}
                type="text"
                label="First Name"
                placeholder="Enter your first name"
                error={errors.first_name?.message}
                autoComplete="given-name"
                className="transition-all duration-200 focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              />

              <Input
                {...register('last_name')}
                type="text"
                label="Last Name"
                placeholder="Enter your last name"
                error={errors.last_name?.message}
                autoComplete="family-name"
                className="transition-all duration-200 focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              />
            </div>

            <Input
              {...register('email')}
              type="email"
              label="Email address"
              placeholder="Enter your email"
              error={errors.email?.message}
              autoComplete="email"
              className="transition-all duration-200 focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
            />

            <Input
              {...register('password')}
              type="password"
              label="Password"
              placeholder="Enter your password"
              error={errors.password?.message}
              autoComplete="new-password"
              className="transition-all duration-200 focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
            />

            <Input
              {...register('password_confirmation')}
              type="password"
              label="Confirm Password"
              placeholder="Confirm your password"
              error={errors.password_confirmation?.message}
              autoComplete="new-password"
              className="transition-all duration-200 focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
            />

            {/* Terms and Conditions */}
            <div className="flex items-start">
              <div className="flex items-center h-5">
                <input
                  {...register('terms')}
                  id="terms"
                  type="checkbox"
                  className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded transition-colors duration-200"
                />
              </div>
              <div className="ml-3 text-sm">
                <label htmlFor="terms" className="text-gray-700">
                  I agree to the{' '}
                  <a href="#" className="text-orange-600 hover:text-orange-500 font-medium">
                    Terms of Service
                  </a>{' '}
                  and{' '}
                  <a href="#" className="text-orange-600 hover:text-orange-500 font-medium">
                    Privacy Policy
                  </a>
                </label>
                {errors.terms && (
                  <p className="text-red-500 text-xs mt-1">{errors.terms.message}</p>
                )}
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold py-4 px-6 rounded-full shadow-lg transform transition-all duration-200 hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Creating account...
                </div>
              ) : (
                'Create Account'
              )}
            </button>

            {/* Construction-themed divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">🏗️</span>
              </div>
            </div>

            <div className="text-center">
              <span className="text-sm text-gray-600">
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => router.push('/auth/login')}
                  className="font-semibold text-orange-600 hover:text-orange-500 transition-colors duration-200"
                >
                  Sign in
                </button>
              </span>
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="text-center">
          <p className="text-xs text-gray-500">
            Secure registration powered by BuilderPro
          </p>
        </div>
      </div>
    </div>
  );
}
