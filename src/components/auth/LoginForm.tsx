'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { loginUser } from '@/lib/features/auth/authSlice';
import { loginSchema } from '@/lib/validations';
import { LoginForm as LoginFormType } from '@/types';

export function LoginForm() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { isLoading, error } = useAppSelector((state) => state.auth);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormType>({
    resolver: yupResolver(loginSchema),
    defaultValues: {
      device_name: 'web',
    },
  });

  const onSubmit = async (data: LoginFormType) => {
    try {
      await dispatch(loginUser(data)).unwrap();
      toast.success('Welcome back!');
      // The router will automatically redirect based on onboarding step
      router.push('/');
    } catch (error: any) {
      toast.error(error?.message || String(error) || 'Login failed');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <Input
        {...register('email')}
        type="email"
        label="Email address"
        placeholder="Enter your email"
        error={errors.email?.message}
        autoComplete="email"
      />

      <Input
        {...register('password')}
        type="password"
        label="Password"
        placeholder="Enter your password"
        error={errors.password?.message}
        autoComplete="current-password"
      />

      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <input
            id="remember-me"
            name="remember-me"
            type="checkbox"
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
            Remember me
          </label>
        </div>

        <div className="text-sm">
          <a href="#" className="font-medium text-blue-600 hover:text-blue-500">
            Forgot your password?
          </a>
        </div>
      </div>

      <Button
        type="submit"
        className="w-full"
        isLoading={isLoading}
      >
        Sign in
      </Button>

      <div className="text-center">
        <span className="text-sm text-gray-600">
          Don't have an account?{' '}
          <button
            type="button"
            onClick={() => router.push('/auth/register')}
            className="font-medium text-blue-600 hover:text-blue-500"
          >
            Sign up
          </button>
        </span>
      </div>
    </form>
  );
}
