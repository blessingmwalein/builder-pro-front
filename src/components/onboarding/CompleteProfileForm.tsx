'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { completeProfile } from '@/lib/features/auth/authSlice';
import { completeProfileSchema } from '@/lib/validations';
import { CompleteProfileForm as CompleteProfileFormType } from '@/types';

export function CompleteProfileForm() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { isLoading } = useAppSelector((state) => state.auth);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<CompleteProfileFormType>({
    resolver: yupResolver(completeProfileSchema),
    defaultValues: {
      account_type: 'company',
    },
  });

  const onSubmit = async (data: CompleteProfileFormType) => {
    try {
      await dispatch(completeProfile(data)).unwrap();
      toast.success('Profile completed successfully!');
      // The router will automatically redirect based on onboarding step
      router.push('/');
    } catch (error: any) {
      toast.error(error?.message || String(error) || 'Failed to complete profile');
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
        {...register('phone')}
        type="tel"
        label="Phone number"
        placeholder="+1 (555) 123-4567"
        error={errors.phone?.message}
        autoComplete="tel"
      />

      <Input
        {...register('position')}
        type="text"
        label="Position/Title"
        placeholder="e.g., Project Manager, Site Supervisor"
        error={errors.position?.message}
        autoComplete="organization-title"
      />

      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">Account type</label>
        <div className="flex items-center space-x-6">
          <label className="inline-flex items-center space-x-2">
            <input type="radio" value="company" {...register('account_type')} />
            <span>Company</span>
          </label>
          <label className="inline-flex items-center space-x-2">
            <input type="radio" value="individual" {...register('account_type')} />
            <span>Individual</span>
          </label>
        </div>
        {errors.account_type && (
          <p className="text-sm text-red-600">{errors.account_type.message as any}</p>
        )}
      </div>

      <div className="flex space-x-4">
        <Button
          type="button"
          variant="secondary"
          onClick={() => router.push('/auth/login')}
          className="flex-1"
        >
          Back
        </Button>
        <Button
          type="submit"
          className="flex-1"
          isLoading={isLoading}
        >
          Continue
        </Button>
      </div>
    </form>
  );
}
