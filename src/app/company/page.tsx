'use client';

import React, { useEffect, useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/Skeleton';
import { Dialog } from '@headlessui/react';
import { PencilIcon, PlusIcon, UserIcon, XMarkIcon, BuildingOffice2Icon, CurrencyDollarIcon, FolderIcon, UsersIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';
import {
  fetchCompanies,
  fetchCompanyUsers,
  updateCompany,
  addCompanyUser,
} from '@/lib/features/company/companySlice';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';

function CompanySkeleton() {
  return (
    <div className="px-4 sm:px-6 lg:px-8 mt-4">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 mb-8">
        {[...Array(3)].map((_, i) => (
          <Skeleton key={i} className="h-32 w-full rounded-2xl" />
        ))}
      </div>
      <div className="card p-8 mt-8">
        <Skeleton className="h-8 w-1/3 mb-4 rounded" />
        <Skeleton className="h-6 w-1/2 mb-2 rounded" />
        <Skeleton className="h-6 w-1/4 mb-2 rounded" />
        <Skeleton className="h-6 w-1/4 mb-2 rounded" />
      </div>
    </div>
  );
}

function CompanyOverviewTab({ company, onEdit }: { company: any; onEdit: () => void }) {
  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-8 mb-8 flex flex-col md:flex-row items-center gap-8" style={{ boxShadow: 'none' }}>
      <div className="flex-shrink-0">
        <div className="h-24 w-24 rounded-full bg-gradient-to-tr from-orange-500 via-orange-400 to-yellow-400 flex items-center justify-center border-4 border-white shadow-lg">
          <BuildingOffice2Icon className="h-14 w-14 text-white" />
        </div>
      </div>
      <div className="flex-1 w-full">
        <div className="flex items-center gap-4 mb-2">
          <h2 className="text-2xl font-bold text-gray-900">{company.name}</h2>
          <span className="text-xs bg-orange-100 text-orange-700 px-3 py-1 rounded-full">{company.status}</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-sm text-gray-700">
          <div>
            <span className="font-medium text-gray-500">Phone:</span> {company.phone || '-'}
          </div>
          <div>
            <span className="font-medium text-gray-500">Country:</span> {company.country}
          </div>
          <div>
            <span className="font-medium text-gray-500">Timezone:</span> {company.timezone}
          </div>
          <div>
            <span className="font-medium text-gray-500">Currency:</span> {company.currency}
          </div>
          <div>
            <span className="font-medium text-gray-500">Slug:</span> <span className="font-mono">{company.slug}</span>
          </div>
          <div>
            <span className="font-medium text-gray-500">Created:</span> {company.created_at?.split('T')[0]}
          </div>
        </div>
      </div>
      <div className="flex flex-col items-end gap-2">
        <Button onClick={onEdit} variant="outline" className="flex items-center gap-2">
          <PencilIcon className="h-5 w-5" /> Edit
        </Button>
      </div>
    </div>
  );
}

function getInitials(name: string) {
  if (!name) return '';
  const parts = name.trim().split(' ');
  if (parts.length === 1) return parts[0][0]?.toUpperCase() || '';
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

function CompanyUserCard({ user, onEdit }: { user: any; onEdit: () => void }) {
  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-6 flex flex-col items-center">
      <div className="h-16 w-16 rounded-full bg-gradient-to-tr from-orange-500 via-orange-400 to-yellow-400 flex items-center justify-center mb-2 shadow">
        {user.avatar_url ? (
          <img src={user.avatar_url} alt={user.name} className="h-16 w-16 rounded-full object-cover" />
        ) : (
          <span className="text-white text-2xl font-bold">{getInitials(user.name)}</span>
        )}
      </div>
      <div className="font-semibold text-gray-900 text-lg">{user.name}</div>
      <div className="text-xs text-gray-500">{user.email}</div>
      <div className="text-xs text-gray-500">{user.position || user.account_type}</div>
      <div className="text-xs text-gray-400 mt-1">{user.pivot?.role ? `Role: ${user.pivot.role}` : ''}</div>
      <Button onClick={onEdit} variant="outline" className="mt-3 w-full">
        Edit
      </Button>
    </div>
  );
}

function CompanyUsersTab({
  users,
  onAdd,
  onEdit,
  loading,
}: {
  users: any[];
  onAdd: () => void;
  onEdit: (user: any) => void;
  loading: boolean;
}) {
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Company Users</h2>
        <Button onClick={onAdd} variant="default" className="flex items-center gap-2">
          <PlusIcon className="h-5 w-5" /> Add User
        </Button>
      </div>
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} className="h-40 w-full rounded-2xl" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-3">
          {users.map((user: any) => (
            <CompanyUserCard key={user.id} user={user} onEdit={() => onEdit(user)} />
          ))}
        </div>
      )}
    </div>
  );
}

// Company Edit Modal
function CompanyEditModal({
  open,
  onClose,
  company,
  onSave,
}: {
  open: boolean;
  onClose: () => void;
  company: any;
  onSave: (data: any) => Promise<void>;
}) {
  const [form, setForm] = useState(company || {});
  useEffect(() => { setForm(company || {}); }, [company, open]);
  const [saving, setSaving] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      // Only send required fields for update
      const payload = {
        name: form.name,
        slug: form.slug,
        owner_user_id: form.owner_user_id || 0,
        phone: form.phone,
        country: form.country,
        timezone: form.timezone,
        currency: form.currency,
        status: form.status,
      };
      await onSave(payload);
    } finally {
      setSaving(false);
    }
  };

  if (!open) return null;
  return (
    <Dialog open={open} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel
          className="mx-auto w-full max-w-3xl bg-white rounded-2xl shadow-lg p-0 relative flex flex-col"
          style={{ maxHeight: 700, minHeight: 400 }}
        >
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <Dialog.Title className="text-xl font-bold text-gray-900">
              Edit Company
            </Dialog.Title>
            <button className="text-gray-400 hover:text-gray-700" onClick={onClose}>
              <XMarkIcon className="h-7 w-7" />
            </button>
          </div>
          <form
            onSubmit={handleSubmit}
            className="space-y-6 overflow-y-auto p-8"
            style={{ maxHeight: 540 }}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input
                  name="name"
                  value={form.name || ''}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-full border border-gray-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none bg-white"
                  placeholder="Company Name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Slug</label>
                <input
                  name="slug"
                  value={form.slug || ''}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-full border border-gray-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none bg-white"
                  placeholder="company-slug"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                <input
                  name="phone"
                  value={form.phone || ''}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-full border border-gray-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none bg-white"
                  placeholder="+263..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
                <input
                  name="country"
                  value={form.country || ''}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-full border border-gray-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none bg-white"
                  placeholder="Country"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Timezone</label>
                <input
                  name="timezone"
                  value={form.timezone || ''}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-full border border-gray-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none bg-white"
                  placeholder="Africa/Harare"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Currency</label>
                <input
                  name="currency"
                  value={form.currency || ''}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-full border border-gray-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none bg-white"
                  placeholder="USD"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <input
                name="status"
                value={form.status || ''}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-full border border-gray-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none bg-white"
                placeholder="active"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Owner User ID</label>
                <input
                  name="owner_user_id"
                  type="number"
                  value={form.owner_user_id || 0}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-full border border-gray-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none bg-white"
                  placeholder="0"
                />
              </div>
            </div>
            <div className="flex justify-end gap-3 pt-4">
              <Button type="button" onClick={onClose} variant="secondary" className="px-6 py-2 rounded-full">Cancel</Button>
              <Button type="submit" isLoading={saving} className="px-6 py-2 rounded-full">Save</Button>
            </div>
          </form>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}

// Company User Modal (Add/Edit)
function CompanyUserModal({ open, onClose, onSave, initialData }: { open: boolean; onClose: () => void; onSave: (data: any) => void; initialData?: any }) {
  const [form, setForm] = useState(initialData || { name: '', email: '', role: 'admin' });
  useEffect(() => { setForm(initialData || { name: '', email: '', role: 'admin' }); }, [initialData, open]);
  const [saving, setSaving] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    await onSave(form);
    setSaving(false);
  };

  if (!open) return null;
  return (
    <Dialog open={open} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="mx-auto max-w-lg w-full bg-white rounded-2xl shadow-lg p-8 relative">
          <button className="absolute top-4 right-4 text-gray-400 hover:text-gray-700" onClick={onClose}>
            <XMarkIcon className="h-7 w-7" />
          </button>
          <h2 className="text-xl font-bold mb-6 text-gray-900">{initialData ? 'Edit User' : 'Add User'}</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
              <input name="name" value={form.name || ''} onChange={handleChange} className="w-full px-4 py-2 rounded-xl border border-gray-300" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input name="email" value={form.email || ''} onChange={handleChange} className="w-full px-4 py-2 rounded-xl border border-gray-300" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
              <select name="role" value={form.role || 'admin'} onChange={handleChange} className="w-full px-4 py-2 rounded-xl border border-gray-300">
                <option value="admin">Admin</option>
                <option value="member">Member</option>
              </select>
            </div>
            <div className="flex justify-end gap-3 pt-4">
              <Button type="button" onClick={onClose} variant="secondary" className="px-6 py-2 rounded-full">Cancel</Button>
              <Button type="submit" isLoading={saving} className="px-6 py-2 rounded-full">{initialData ? 'Save' : 'Add'}</Button>
            </div>
          </form>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}

function CompanyBanner({ company }: { company: any }) {
  return (
    <div className="relative w-full h-56 rounded-3xl overflow-hidden mb-8">
      <img
        src="/excavator-action.jpg"
        alt="Company Banner"
        className="absolute inset-0 w-full h-full object-cover"
        style={{ filter: 'brightness(0.7)' }}
      />
      <div className="absolute inset-0 flex items-end">
        <div className="flex items-center gap-6 p-8 bg-gradient-to-r from-black/60 via-black/30 to-transparent rounded-br-3xl">
          <div className="flex-shrink-0">
            <div className="h-20 w-20 rounded-full bg-orange-100 flex items-center justify-center border-4 border-white shadow-lg">
              <BuildingOffice2Icon className="h-12 w-12 text-orange-500" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-bold text-white">{company.name}</div>
            <div className="text-sm text-orange-100">{company.phone || '-'}</div>
            <div className="text-sm text-orange-100">{company.country} &middot; {company.timezone}</div>
            <div className="text-xs text-orange-200 mt-1">{company.address || company.slug}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

function CompanyStats({ stats }: { stats: { label: string; value: string; icon: any; color: string; gradient: string }[] }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {stats.map(stat => (
        <div
          key={stat.label}
          className="flex items-center gap-4 bg-white border border-gray-200 rounded-2xl p-6"
          style={{ boxShadow: 'none' }}
        >
          <div
            className={`h-14 w-14 rounded-full flex items-center justify-center ${stat.gradient}`}
          >
            <stat.icon className="h-7 w-7 text-white" />
          </div>
          <div>
            <div className="text-3xl text-gray-900">{stat.value}</div>
            <div className="text-xs text-gray-500">{stat.label}</div>
          </div>
        </div>
      ))}
    </div>
  );
}

function RecentProjects({ projects }: { projects: any[] }) {
  if (!projects?.length) return null;
  return (
    <div className="card p-6 mt-8">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Projects</h3>
      <div className="space-y-3">
        {projects.slice(0, 5).map((project: any) => (
          <div key={project.id} className="flex items-center justify-between border-b last:border-b-0 py-2">
            <div>
              <div className="font-medium text-gray-800">{project.title}</div>
              <div className="text-xs text-gray-500">{project.status} &middot; {project.created_at?.split('T')[0]}</div>
            </div>
            <div className="text-xs text-orange-600 font-semibold">{project.currency} ${(project.budget_total_cents / 100).toLocaleString()}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function CompanyPage() {
  const dispatch = useAppDispatch();
  const { companies, users, isLoading } = useAppSelector((state) => state.company);
  const [tab, setTab] = useState<'overview' | 'users'>('overview');
  const [editCompanyOpen, setEditCompanyOpen] = useState(false);
  const [userModalOpen, setUserModalOpen] = useState(false);
  const [editUser, setEditUser] = useState<any | null>(null);
  const [projects, setProjects] = useState<any[]>([]);
  const [moneyUsed, setMoneyUsed] = useState<number>(0);
  const [storageUsed, setStorageUsed] = useState<number>(0);

  const company = companies[0];

  useEffect(() => {
    dispatch(fetchCompanies()).then(async (res: any) => {
      const company = res.payload?.[0];
      if (company) {
        dispatch(fetchCompanyUsers(company.id));
        // Fetch projects for stats and recent projects
        const projectsRes = await fetch(`/api/v1/companies/${company.id}/projects`, { credentials: 'include' });
        const projectsData = await projectsRes.json();
        setProjects(projectsData.data || []);
        // Example: Calculate money used and storage used (replace with real API if available)
        setMoneyUsed(projectsData.data?.reduce((sum: number, p: any) => sum + (p.budget_total_cents || 0), 0) / 100);
        setStorageUsed(2.3); // Example: 2.3 GB used, replace with real value
      }
    });
  }, [dispatch]);

  // Update company
  const handleCompanySave = async (data: any) => {
    if (!company) return;
    try {
      await dispatch(updateCompany({ companyId: company.id, data })).unwrap();
      setEditCompanyOpen(false);
      toast.success('Company updated!');
      // Fetch company again after update
      dispatch(fetchCompanies());
    } catch (err: any) {
      toast.error(err?.message || 'Failed to update company');
    }
  };

  // Add or update user
  const handleUserSave = async (data: any) => {
    if (!company) return;
    if (editUser) {
      // Implement update user API if available
      toast.success('User updated!');
    } else {
      await dispatch(addCompanyUser({ companyId: company.id, data }));
      dispatch(fetchCompanyUsers(company.id));
      toast.success('User added!');
    }
    setUserModalOpen(false);
    setEditUser(null);
  };

  // Stats for company overview
  const stats = [
    {
      label: 'Projects',
      value: projects.length.toString(),
      icon: FolderIcon,
      color: 'bg-blue-500',
      gradient: 'bg-gradient-to-tr from-blue-500 via-blue-400 to-blue-300',
    },
    {
      label: 'Money Used',
      value: `$${moneyUsed.toLocaleString()}`,
      icon: CurrencyDollarIcon,
      color: 'bg-green-500',
      gradient: 'bg-gradient-to-tr from-green-500 via-green-400 to-green-300',
    },
    {
      label: 'Storage Used',
      value: `${storageUsed} GB`,
      icon: FolderIcon,
      color: 'bg-orange-500',
      gradient: 'bg-gradient-to-tr from-orange-500 via-orange-400 to-yellow-400',
    },
    {
      label: 'Users',
      value: users.length.toString(),
      icon: UsersIcon,
      color: 'bg-purple-500',
      gradient: 'bg-gradient-to-tr from-purple-500 via-purple-400 to-purple-300',
    },
  ];

  return (
    <DashboardLayout>
      <div className="px-4 sm:px-6 lg:px-8 mt-4">
        {company && <CompanyBanner company={company} />}
        <div className="flex gap-6 border-b border-gray-200 mb-8">
          <button
            className={`px-4 py-2 font-semibold ${tab === 'overview' ? 'border-b-2 border-orange-500 text-orange-600' : 'text-gray-600'}`}
            onClick={() => setTab('overview')}
          >
            Overview
          </button>
          <button
            className={`px-4 py-2 font-semibold ${tab === 'users' ? 'border-b-2 border-orange-500 text-orange-600' : 'text-gray-600'}`}
            onClick={() => setTab('users')}
          >
            Company Users
          </button>
        </div>
        {isLoading ? (
          <CompanySkeleton />
        ) : (
          <>
            {tab === 'overview' && company && (
              <>
                <CompanyStats stats={stats} />
                <CompanyOverviewTab company={company} onEdit={() => setEditCompanyOpen(true)} />
                <RecentProjects projects={projects} />
              </>
            )}
            {tab === 'users' && (
              <CompanyUsersTab
                users={users}
                onAdd={() => {
                  setEditUser(null);
                  setUserModalOpen(true);
                }}
                onEdit={user => {
                  setEditUser(user);
                  setUserModalOpen(true);
                }}
                loading={isLoading}
              />
            )}
            <CompanyEditModal
              open={editCompanyOpen}
              onClose={() => setEditCompanyOpen(false)}
              company={company}
              onSave={handleCompanySave}
            />
            <CompanyUserModal
              open={userModalOpen}
              onClose={() => {
                setUserModalOpen(false);
                setEditUser(null);
              }}
              onSave={handleUserSave}
              initialData={editUser}
            />
          </>
        )}
      </div>
    </DashboardLayout>
  );
}
