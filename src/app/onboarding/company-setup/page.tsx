'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { completeSocialOnboarding } from '@/lib/features/auth/authSlice';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import toast from 'react-hot-toast';

export default function CompanySetup() {
  const [formData, setFormData] = useState({
    company_name: '',
    company_type: 'construction',
    phone: '',
    address: ''
  });
  
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { onboardingLoading, socialData } = useAppSelector((state) => state.auth);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      await dispatch(completeSocialOnboarding(formData)).unwrap();
      toast.success('Company setup completed! 🎉');
      router.push('/dashboard');
    } catch (error: any) {
      console.error('Company setup error:', error);
      let errorMessage = 'Company setup failed';
      
      if (error && typeof error === 'object' && error.message) {
        errorMessage = error.message;
      } else if (typeof error === 'string') {
        errorMessage = error;
      }
      
      toast.error(errorMessage);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Use suggested company names if available
  const companySuggestions = socialData?.company_name_suggestions || [];

  return (
    <div className="min-h-screen bg-white flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="mx-auto h-16 w-16 bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl flex items-center justify-center shadow-lg">
            <svg className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          </div>
          <h2 className="mt-6 text-3xl font-bold text-gray-900">
            Complete Your Setup
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Tell us about your company to get started
          </p>
        </div>

        {/* Form */}
        <div className="bg-white py-10 px-10 shadow-xl rounded-2xl border border-gray-100">
          <form onSubmit={handleSubmit} className="space-y-6">
            <Input
              name="company_name"
              type="text"
              label="Company Name"
              placeholder="Enter your company name"
              value={formData.company_name}
              onChange={handleInputChange}
              required
            />
            
            {companySuggestions.length > 0 && (
              <div className="mt-2">
                <p className="text-sm text-gray-600 mb-2">Suggestions:</p>
                <div className="flex flex-wrap gap-2">
                  {companySuggestions.map((suggestion: string, index: number) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, company_name: suggestion }))}
                      className="px-3 py-1 text-sm bg-orange-50 text-orange-700 rounded-full hover:bg-orange-100 transition-colors"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div>
              <label htmlFor="company_type" className="block text-sm font-medium text-gray-700 mb-2">
                Company Type
              </label>
              <select
                id="company_type"
                name="company_type"
                value={formData.company_type}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                required
              >
                <option value="construction">Construction</option>
                <option value="renovation">Renovation</option>
                <option value="consulting">Consulting</option>
                <option value="other">Other</option>
              </select>
            </div>

            <Input
              name="phone"
              type="tel"
              label="Phone (Optional)"
              placeholder="Enter your phone number"
              value={formData.phone}
              onChange={handleInputChange}
            />

            <div>
              <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-2">
                Address (Optional)
              </label>
              <textarea
                id="address"
                name="address"
                rows={3}
                placeholder="Enter your company address"
                value={formData.address}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              />
            </div>

            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold py-4 px-6 rounded-full shadow-lg transform transition-all duration-200 hover:scale-[1.02]"
              isLoading={onboardingLoading}
            >
              {onboardingLoading ? 'Setting up...' : 'Complete Setup'}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
