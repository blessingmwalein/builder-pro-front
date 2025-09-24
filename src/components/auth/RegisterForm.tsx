'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { registerUser } from '@/lib/features/auth/authSlice';
import { registerSchema } from '@/lib/validations';
import { RegisterForm as RegisterFormType } from '@/types';

export function RegisterForm() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { isLoading } = useAppSelector((state) => state.auth);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormType>({
    resolver: yupResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormType) => {
    try {
      await dispatch(registerUser(data)).unwrap();
      toast.success('Account created successfully!');
      // The router will automatically redirect based on onboarding step
      router.push('/');
    } catch (error: any) {
      toast.error(error?.message || String(error) || 'Registration failed');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <Input
        {...register('name')}
        type="text"
        label="Full name"
        placeholder="Enter your full name"
        error={errors.name?.message}
        autoComplete="name"
      />

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
        placeholder="Create a password"
        error={errors.password?.message}
        autoComplete="new-password"
        helperText="Must be at least 8 characters long"
      />

      <Input
        {...register('password_confirmation')}
        type="password"
        label="Confirm password"
        placeholder="Confirm your password"
        error={errors.password_confirmation?.message}
        autoComplete="new-password"
      />

      <div className="flex items-start">
        <div className="flex items-center h-5">
          <input
            id="terms"
            name="terms"
            type="checkbox"
            required
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
        </div>
        <div className="ml-3 text-sm">
          <label htmlFor="terms" className="text-gray-700">
            I agree to the{' '}
            <a href="#" className="font-medium text-blue-600 hover:text-blue-500">
              Terms of Service
            </a>{' '}
            and{' '}
            <a href="#" className="font-medium text-blue-600 hover:text-blue-500">
              Privacy Policy
            </a>
          </label>
        </div>
      </div>

      <Button
        type="submit"
        className="w-full"
        isLoading={isLoading}
      >
        Create account
      </Button>

      <div className="text-center">
        <span className="text-sm text-gray-600">
          Already have an account?{' '}
          <button
            type="button"
            onClick={() => router.push('/auth/login')}
            className="font-medium text-blue-600 hover:text-blue-500"
          >
            Sign in
          </button>
        </span>
      </div>
    </form>
  );
}
