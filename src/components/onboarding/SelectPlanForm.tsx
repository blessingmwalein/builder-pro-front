'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { Button } from '@/components/ui/Button';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { setOnboardingStep } from '@/lib/features/auth/authSlice';
import { fetchPlans, selectPlan } from '@/lib/features/company/companySlice';
import { CheckIcon } from '@heroicons/react/24/outline';
import clsx from 'clsx';

// Backend-driven; we will fetch from API

export function SelectPlanForm() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { plans, isLoading } = useAppSelector((s) => s.company);
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);

  useEffect(() => {
    dispatch(fetchPlans());
  }, [dispatch]);

  const handleSelectPlan = async (): Promise<void> => {
    if (!selectedPlan) {
      toast.error('Please select a plan');
      return;
    }
    try {
      await dispatch(selectPlan({ plan_code: selectedPlan })).unwrap();
      dispatch(setOnboardingStep('completed'));
      toast.success('Plan selected successfully!');
      router.push('/dashboard');
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      toast.error(message || 'Failed to select plan');
    }
  };

  const handleSkip = () => {
    dispatch(setOnboardingStep('completed'));
    toast.success('You can select a plan later from settings');
    router.push('/dashboard');
  };

  return (
    <div className="space-y-6">
      {/* Plans Grid */}
      <div className="grid grid-cols-1 gap-4">
        {plans.map((plan) => (
          <div
            key={plan.code}
            className={clsx(
              'relative border-2 rounded-lg p-4 cursor-pointer transition-all duration-200',
              selectedPlan === plan.code
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200 hover:border-gray-300',
              false && 'ring-2 ring-blue-500 ring-opacity-50'
            )}
            onClick={() => setSelectedPlan(plan.code)}
          >
            {false && (
              <div className="absolute -top-2 left-4">
                <span className="bg-blue-500 text-white px-3 py-1 text-xs font-medium rounded-full">
                  Recommended
                </span>
              </div>
            )}
            
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <div
                    className={clsx(
                      'w-4 h-4 rounded-full border-2 flex items-center justify-center',
                      selectedPlan === plan.code
                        ? 'border-blue-500 bg-blue-500'
                        : 'border-gray-300'
                    )}
                  >
                    {selectedPlan === plan.code && (
                      <CheckIcon className="w-2.5 h-2.5 text-white" />
                    )}
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {plan.name}
                  </h3>
                </div>
                
                <p className="text-sm text-gray-600 mb-3">
                  {plan.interval} billing · {plan.currency}
                </p>
                
                <ul className="space-y-1">
                  {plan.features.slice(0, 4).map((feature, index) => (
                    <li key={index} className="text-sm text-gray-600 flex items-center">
                      <CheckIcon className="w-3 h-3 text-green-500 mr-2 flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                  {plan.features.length > 4 && (
                    <li className="text-sm text-gray-500">
                      +{plan.features.length - 4} more features
                    </li>
                  )}
                </ul>
              </div>
              
              <div className="text-right ml-4">
                <div className="text-2xl font-bold text-gray-900">
                  ${(plan.price_cents / 100).toFixed(2)}
                </div>
                <div className="text-sm text-gray-500">per month</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Free Trial Notice */}
      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <div className="flex items-center">
          <CheckIcon className="w-5 h-5 text-green-500 mr-2" />
          <div>
            <h4 className="text-sm font-medium text-green-900">
              14-day free trial included
            </h4>
            <p className="text-sm text-green-700">
              Try all features risk-free. Cancel anytime during the trial period.
            </p>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex space-x-3">
        <Button
          type="button"
          variant="secondary"
          onClick={handleSkip}
          className="flex-1"
        >
          Skip for now
        </Button>
        <Button
          onClick={handleSelectPlan}
          isLoading={isLoading}
          className="flex-1"
        >
          Start Free Trial
        </Button>
      </div>

      {/* Terms */}
      <p className="text-xs text-gray-500 text-center">
        By selecting a plan, you agree to our{' '}
        <a href="#" className="text-blue-600 hover:text-blue-500">
          Terms of Service
        </a>{' '}
        and{' '}
        <a href="#" className="text-blue-600 hover:text-blue-500">
          Privacy Policy
        </a>
      </p>
    </div>
  );
}


