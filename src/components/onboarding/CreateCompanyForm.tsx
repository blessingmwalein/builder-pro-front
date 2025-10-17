'use client';

import React, { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { ComboSelect } from '@/components/ui/ComboSelect';
import { Button } from '@/components/ui/button';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { createCompany } from '@/lib/features/company/companySlice';
import { setOnboardingStep } from '@/lib/features/auth/authSlice';
import { createCompanySchema } from '@/lib/validations';
import { CreateCompanyForm as CreateCompanyFormType } from '@/types';
import { countryOptions, timezoneOptions, currencyOptions } from '@/lib/options';

// Options now come from shared options lists

export function CreateCompanyForm() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { isLoading } = useAppSelector((state) => state.company);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
    control,
  } = useForm<CreateCompanyFormType>({
    resolver: yupResolver(createCompanySchema),
  });

  const companyName = watch('name');

  // Auto-generate slug from company name
  useEffect(() => {
    if (companyName) {
      const slug = companyName
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim();
      setValue('slug', slug);
    }
  }, [companyName, setValue]);

  const onSubmit = async (data: CreateCompanyFormType) => {
    try {
      await dispatch(createCompany(data)).unwrap();
      dispatch(setOnboardingStep('select_plan'));
      toast.success('Company created successfully!');
      router.push('/');
    } catch (error: any) {
      toast.error(error || 'Failed to create company');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <Input
        {...register('name')}
        type="text"
        label="Company name"
        placeholder="Enter your company name"
        error={errors.name?.message}
      />

      {/* Slug is auto-generated and hidden from UI */}
      <input type="hidden" {...register('slug')} />

      <Input
        {...register('phone')}
        type="tel"
        label="Company phone"
        placeholder="+1 (555) 123-4567"
        error={errors.phone?.message}
      />

      {/* Country selector (Combobox) */}
      <Controller
        name="country"
        control={control}
        render={({ field }) => (
          <ComboSelect
            label="Country"
            value={field.value}
            onChange={field.onChange}
            options={countryOptions}
            placeholder="Select a country"
            error={errors.country?.message}
          />
        )}
      />

      <Controller
        name="timezone"
        control={control}
        render={({ field }) => (
          <ComboSelect
            label="Timezone"
            value={field.value}
            onChange={field.onChange}
            options={timezoneOptions}
            placeholder="Select a timezone"
            error={errors.timezone?.message}
          />
        )}
      />

      <Controller
        name="currency"
        control={control}
        render={({ field }) => (
          <ComboSelect
            label="Currency"
            value={field.value}
            onChange={field.onChange}
            options={currencyOptions}
            placeholder="Select a currency"
            error={errors.currency?.message}
          />
        )}
      />

      <div className="flex space-x-4">
        <Button
          type="button"
          variant="secondary"
          onClick={() => router.push('/onboarding/complete-profile')}
          className="flex-1"
        >
          Back
        </Button>
        <Button
          type="submit"
          className="flex-1"
          isLoading={isLoading}
        >
          Create Company
        </Button>
      </div>
    </form>
  );
}
