'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { loginUser } from '@/lib/features/auth/authSlice';
import { loginSchema } from '@/lib/validations';
import { LoginForm as LoginFormType } from '@/types';
import { SocialLoginButtons } from './SocialLoginButtons';

export function LoginForm() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { isLoading, error } = useAppSelector((state) => state.auth);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<LoginFormType>({
    resolver: yupResolver(loginSchema),
    defaultValues: {
      device_name: 'web',
    },
  });

  const onSubmit = async (data: LoginFormType) => {
    try {
      await dispatch(loginUser(data)).unwrap();
      toast.success('Welcome back! 🎉');
      router.push('/');
    } catch (error: any) {
      console.log('Error received:', error); // Debug log
      
      // Handle structured error response
      if (error && typeof error === 'object') {
        // Handle field-specific errors
        if (error.errors && typeof error.errors === 'object') {
          Object.keys(error.errors).forEach((field) => {
            const errorMessages = error.errors[field];
            if (Array.isArray(errorMessages) && errorMessages.length > 0) {
              setError(field as keyof LoginFormType, {
                type: 'server',
                message: errorMessages[0],
              });
            }
          });
        }
        
        // Show clean error message in toast
        if (error.message && typeof error.message === 'string') {
          toast.error(error.message);
        } else {
          toast.error('Login failed. Please check your credentials.');
        }
      } else if (typeof error === 'string') {
        // Handle string errors
        toast.error(error);
      } else {
        // Fallback error message
        toast.error('Login failed. Please try again.');
      }
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center py-12 ">
      <div className="max-w-2xl w-full space-y-8">
       

        {/* Login Card */}
        <div className="bg-white py-10 px-10 shadow-xl rounded-2xl border border-gray-100 w-[120%]">
          {/* Social Login Buttons */}
          <SocialLoginButtons />

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
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
              autoComplete="current-password"
              className="transition-all duration-200 focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
            />

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded transition-colors duration-200"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                  Remember me
                </label>
              </div>

              <div className="text-sm">
                <button
                  type="button"
                  className="font-medium text-orange-600 hover:text-orange-500 transition-colors duration-200"
                >
                  Forgot your password?
                </button>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold py-4 px-6 rounded-full shadow-lg transform transition-all duration-200 hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
              isLoading={isLoading}
            >
            Sign in
            </Button>

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
                New to BuilderPro?{' '}
                <button
                  type="button"
                  onClick={() => router.push('/auth/register-user')}
                  className="font-semibold text-orange-600 hover:text-orange-500 transition-colors duration-200"
                >
                  Create your account
                </button>
              </span>
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="text-center">
          <p className="text-xs text-gray-500">
            Secure login powered by BuilderPro
          </p>
        </div>
      </div>
    </div>
  );
}
