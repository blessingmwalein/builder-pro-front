'use client';

import React, { useMemo, useState } from 'react';
import { useAppSelector, useAppDispatch } from '@/lib/hooks';
import { Button } from '@/components/ui/Button';
import { CompleteProfileForm as CompleteProfileFormType } from '@/types';
import { completeProfile, fetchProfile } from '@/lib/features/auth/authSlice';
import toast from 'react-hot-toast';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { UserCircleIcon, ShieldCheckIcon, CreditCardIcon, PhotoIcon } from '@heroicons/react/24/outline';
import { format } from 'date-fns';

export default function ProfilePage() {
  const dispatch = useAppDispatch();
  const { user, activePlan, isLoading } = useAppSelector((s) => s.auth);
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState<'profile' | 'plan' | 'security'>('profile');
  const [form, setForm] = useState<CompleteProfileFormType>({
    name: user?.name ?? '',
    phone: user?.phone ?? '',
    position: user?.position ?? '',
    account_type: user?.account_type ?? 'company',
    avatar_url: user?.avatar_url ?? undefined,
  } as any);

  const bannerColor = useMemo(() => {
    return 'from-blue-600 to-cyan-500';
  }, []);

  const onSubmit = async () => {
    try {
      await dispatch(completeProfile(form)).unwrap();
      await dispatch(fetchProfile());
      toast.success('Profile updated');
      setIsEditing(false);
    } catch (e: any) {
      toast.error(e?.message || 'Failed to update profile');
    }
  };

  const formatMaybeDate = (iso?: string | null) => {
    if (!iso) return '-';
    const d = new Date(iso);
    if (isNaN(d.getTime())) return iso;
    return format(d, 'PPpp');
  };

  const SecurityForm = (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <label className="text-sm">
          <span className="block text-gray-700 mb-1">Current password</span>
          <input className="w-full border rounded px-3 py-2" type="password" placeholder="••••••••" />
        </label>
        <div />
        <label className="text-sm">
          <span className="block text-gray-700 mb-1">New password</span>
          <input className="w-full border rounded px-3 py-2" type="password" placeholder="At least 8 characters" />
        </label>
        <label className="text-sm">
          <span className="block text-gray-700 mb-1">Confirm new password</span>
          <input className="w-full border rounded px-3 py-2" type="password" placeholder="Repeat new password" />
        </label>
      </div>
      <Button onClick={() => toast.success('Password change submitted')}>Change password</Button>
    </div>
  );

  if (!user) {
    return (
      <DashboardLayout>
        <div className="p-6">
          <h1 className="text-xl font-semibold mb-2">Profile</h1>
          <p className="text-gray-600">You are not logged in.</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Banner and avatar */}
        <div className={`rounded-xl h-36 bg-gradient-to-r ${bannerColor} relative overflow-hidden`}></div>
        <div className="relative -mt-10 pl-4 sm:pl-6 lg:pl-8 flex items-center">
          <div className="h-20 w-20 rounded-full ring-4 ring-white bg-gray-200 overflow-hidden flex items-center justify-center">
            {user.avatar_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={user.avatar_url} alt={user.name} className="h-full w-full object-cover" />
            ) : (
              <UserCircleIcon className="h-16 w-16 text-gray-400" />
            )}
          </div>
          <div className="ml-4">
            <h1 className="text-2xl font-bold text-gray-900">{user.name}</h1>
            <p className="text-gray-600">{user.email}</p>
          </div>
          <div className="ml-auto pr-4 sm:pr-6 lg:pr-8">
            <Button variant="secondary" onClick={() => setIsEditing(true)}>
              <span className="inline-flex items-center">
                <PhotoIcon className="w-4 h-4 mr-2" /> Edit profile
              </span>
            </Button>
          </div>
        </div>

        {/* Tabs */}
        <div className="mt-8">
          <div className="flex space-x-2 border-b">
            <button
              className={`px-4 py-2 text-sm font-medium ${activeTab === 'profile' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-600'}`}
              onClick={() => setActiveTab('profile')}
            >
              <span className="inline-flex items-center">
                <UserCircleIcon className="w-4 h-4 mr-2" /> Profile
              </span>
            </button>
            <button
              className={`px-4 py-2 text-sm font-medium ${activeTab === 'plan' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-600'}`}
              onClick={() => setActiveTab('plan')}
            >
              <span className="inline-flex items-center">
                <CreditCardIcon className="w-4 h-4 mr-2" /> Plan
              </span>
            </button>
            <button
              className={`px-4 py-2 text-sm font-medium ${activeTab === 'security' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-600'}`}
              onClick={() => setActiveTab('security')}
            >
              <span className="inline-flex items-center">
                <ShieldCheckIcon className="w-4 h-4 mr-2" /> Security
              </span>
            </button>
          </div>

          <div className="mt-6">
            {activeTab === 'profile' && (
              <div className="bg-white border rounded-lg p-4 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <div className="text-sm text-gray-500">Full name</div>
                    <div className="text-gray-900">{user.name}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">Email</div>
                    <div className="text-gray-900">{user.email}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">Phone</div>
                    <div className="text-gray-900">{user.phone || '-'}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">Position</div>
                    <div className="text-gray-900">{user.position || '-'}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">Account type</div>
                    <div className="text-gray-900">{user.account_type || '-'}</div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'plan' && (
              <div className="bg-white border rounded-lg p-4 space-y-4">
                {activePlan ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <div className="text-sm text-gray-500">Plan</div>
                      <div className="text-gray-900">{activePlan.plan.name} · {activePlan.plan.currency}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-500">Price</div>
                      <div className="text-gray-900">${(activePlan.plan.price_cents / 100).toFixed(2)} / {activePlan.plan.interval}</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-500">Status</div>
                      <div className="text-gray-900">{activePlan.status}</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-500">Current period start</div>
                      <div className="text-gray-900">{formatMaybeDate(activePlan.current_period_start)}</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-500">Current period end</div>
                      <div className="text-gray-900">{formatMaybeDate(activePlan.current_period_end)}</div>
                    </div>
                  </div>
                ) : (
                  <div className="text-gray-600">No active plan</div>
                )}
              </div>
            )}

            {activeTab === 'security' && (
              <div className="bg-white border rounded-lg p-4">
                {SecurityForm}
              </div>
            )}
          </div>
        </div>
      </div>

      {isEditing && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-lg p-4 space-y-4">
            <h3 className="text-lg font-semibold">Edit Profile</h3>

            <div className="grid grid-cols-1 gap-3">
              <label className="text-sm">
                <span className="block text-gray-700 mb-1">Full name</span>
                <input
                  className="w-full border rounded px-3 py-2"
                  value={form.name || ''}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                />
              </label>
              <label className="text-sm">
                <span className="block text-gray-700 mb-1">Phone</span>
                <input
                  className="w-full border rounded px-3 py-2"
                  value={form.phone}
                  onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
                />
              </label>
              <label className="text-sm">
                <span className="block text-gray-700 mb-1">Position</span>
                <input
                  className="w-full border rounded px-3 py-2"
                  value={form.position}
                  onChange={(e) => setForm((f) => ({ ...f, position: e.target.value }))}
                />
              </label>
              <label className="text-sm">
                <span className="block text-gray-700 mb-1">Avatar URL</span>
                <input
                  className="w-full border rounded px-3 py-2"
                  placeholder="https://..."
                  value={form.avatar_url || ''}
                  onChange={(e) => setForm((f) => ({ ...f, avatar_url: e.target.value }))}
                />
              </label>
              <div className="text-sm">
                <span className="block text-gray-700 mb-1">Account type</span>
                <div className="flex items-center space-x-6">
                  <label className="inline-flex items-center space-x-2">
                    <input
                      type="radio"
                      checked={(form.account_type || 'company') === 'company'}
                      onChange={() => setForm((f) => ({ ...f, account_type: 'company' }))}
                    />
                    <span>Company</span>
                  </label>
                  <label className="inline-flex items-center space-x-2">
                    <input
                      type="radio"
                      checked={form.account_type === 'individual'}
                      onChange={() => setForm((f) => ({ ...f, account_type: 'individual' }))}
                    />
                    <span>Individual</span>
                  </label>
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-3">
              <Button variant="secondary" onClick={() => setIsEditing(false)}>
                Cancel
              </Button>
              <Button onClick={onSubmit} isLoading={isLoading}>Save</Button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}


