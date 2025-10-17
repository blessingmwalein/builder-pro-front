'use client';

import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import {
  fetchBudgetCategories,
  createBudgetCategory,
  updateBudgetCategory,
  deleteBudgetCategory,
  fetchBudgetItems,
  createBudgetItem,
  updateBudgetItem,
  deleteBudgetItem,
} from '@/lib/features/budget/budgetSlice';
import { Button } from '@/components/ui/button';
import { PlusIcon, PencilIcon, TrashIcon, XMarkIcon, ViewColumnsIcon, Squares2X2Icon } from '@heroicons/react/24/outline';
import { Dialog, Disclosure } from '@headlessui/react';
import { ChevronDownIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select';
import { CurrencyDollarIcon, ArrowTrendingUpIcon, ArrowTrendingDownIcon } from '@heroicons/react/24/outline';

function BudgetCategoryModal({ open, onClose, onSubmit, initialData }: any) {
  const [form, setForm] = useState(initialData || { name: '', order_index: 0 });
  useEffect(() => { setForm(initialData || { name: '', order_index: 0 }); }, [initialData, open]);
  const [saving, setSaving] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    await onSubmit(form);
    setSaving(false);
  };

  if (!open) return null;
  return (
    <Dialog open={open} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="mx-auto max-w-md w-full bg-white rounded-2xl shadow-lg p-8 relative">
          <button className="absolute top-4 right-4 text-gray-400 hover:text-gray-700" onClick={onClose}>
            <PlusIcon className="h-7 w-7" />
          </button>
          <h2 className="text-xl font-bold mb-6 text-gray-900">{initialData ? 'Edit Category' : 'Add Category'}</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-full border border-gray-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none bg-white"
                placeholder="Category Name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Order Index</label>
              <input
                name="order_index"
                type="number"
                value={form.order_index}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-full border border-gray-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none bg-white"
                placeholder="0"
              />
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

function BudgetItemModal({ open, onClose, onSubmit, initialData, categories }: any) {
  const [form, setForm] = useState(initialData || {
    category_id: '',
    name: '',
    description: '',
    unit: '',
    qty_planned: '',
    rate_cents: '',
    qty_actual: '',
    cost_actual_cents: '',
    vendor_name: '',
    receipt_path: '',
  });
  useEffect(() => { setForm(initialData || {
    category_id: '',
    name: '',
    description: '',
    unit: '',
    qty_planned: '',
    rate_cents: '',
    qty_actual: '',
    cost_actual_cents: '',
    vendor_name: '',
    receipt_path: '',
  }); }, [initialData, open]);
  const [saving, setSaving] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    await onSubmit(form);
    setSaving(false);
  };

  if (!open) return null;
  return (
    <Dialog open={open} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel
          className="mx-auto max-w-2xl w-full bg-white rounded-2xl shadow-lg p-8 relative"
          style={{ maxHeight: 600, minHeight: 400, display: 'flex', flexDirection: 'column' }}
        >
          <button className="absolute top-4 right-4 text-gray-400 hover:text-gray-700" onClick={onClose}>
            <PlusIcon className="h-7 w-7" />
          </button>
          <h2 className="text-xl font-bold mb-6 text-gray-900">{initialData ? 'Edit Budget Item' : 'Add Budget Item'}</h2>
          <form
            onSubmit={handleSubmit}
            className="space-y-4 overflow-y-auto"
            style={{ maxHeight: 420 }}
          >
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
              <Select
                value={form.category_id?.toString() || ''}
                onValueChange={val => setForm({ ...form, category_id: Number(val) })}
              >
                <SelectTrigger className="w-full rounded-full border border-gray-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 bg-white">
                  <SelectValue placeholder="Select Category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat: any) => (
                    <SelectItem key={cat.id} value={cat.id.toString()}>
                      {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-full border border-gray-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none bg-white"
                placeholder="Item Name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-xl border border-gray-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none bg-white"
                placeholder="Description"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Unit</label>
                <input
                  name="unit"
                  value={form.unit}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-full border border-gray-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none bg-white"
                  placeholder="Unit"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Vendor Name</label>
                <input
                  name="vendor_name"
                  value={form.vendor_name}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-full border border-gray-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none bg-white"
                  placeholder="Vendor"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Qty Planned</label>
                <input
                  name="qty_planned"
                  type="number"
                  value={form.qty_planned}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-full border border-gray-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none bg-white"
                  placeholder="0"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Qty Actual</label>
                <input
                  name="qty_actual"
                  type="number"
                  value={form.qty_actual}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-full border border-gray-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none bg-white"
                  placeholder="0"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Rate (cents)</label>
                <input
                  name="rate_cents"
                  type="number"
                  value={form.rate_cents}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-full border border-gray-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none bg-white"
                  placeholder="0"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Cost Actual (cents)</label>
                <input
                  name="cost_actual_cents"
                  type="number"
                  value={form.cost_actual_cents}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-full border border-gray-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none bg-white"
                  placeholder="0"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Receipt Path</label>
              <input
                name="receipt_path"
                value={form.receipt_path ?? ''}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-full border border-gray-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none bg-white"
                placeholder="Receipt Path"
              />
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

// Budget Category View Modal (multi-manage items)
function BudgetCategoryViewModal({
  open,
  onClose,
  category,
  items,
  onEditItem,
  onDeleteItem,
}: {
  open: boolean;
  onClose: () => void;
  category: any;
  items: any[];
  onEditItem: (item: any) => void;
  onDeleteItem: (item: any) => void;
}) {
  if (!open || !category) return null;
  return (
    <Dialog open={open} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/40" aria-hidden="true" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel
          className="mx-auto max-w-4xl w-full bg-white rounded-2xl shadow-2xl p-8 relative"
          style={{ maxHeight: 700, minHeight: 400, display: 'flex', flexDirection: 'column' }}
        >
          <button className="absolute top-4 right-4 text-gray-400 hover:text-gray-700" onClick={onClose}>
            <XMarkIcon className="h-7 w-7" />
          </button>
          <h2 className="text-2xl font-bold mb-4 text-gray-900">{category.name}</h2>
          <div className="mb-4 text-sm text-gray-500">Order: {category.order_index}</div>
          <div className="flex-1 overflow-y-auto" style={{ maxHeight: 500 }}>
            <h3 className="text-lg font-semibold mb-2">Budget Items</h3>
            <div className="divide-y divide-gray-100">
              {items.map((item: any) => (
                <div key={item.id} className="py-3 flex items-center justify-between">
                  <div>
                    <div className="font-medium text-gray-900">{item.name}</div>
                    <div className="text-xs text-gray-500">{item.description}</div>
                    <div className="text-xs text-gray-400">Planned: {item.qty_planned} {item.unit} @ {item.rate_cents}c</div>
                    <div className="text-xs text-gray-400">Actual: {item.qty_actual} {item.unit} (${(item.cost_actual_cents / 100).toFixed(2)})</div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      className="h-9 w-9 rounded-full flex items-center justify-center bg-gradient-to-tr from-blue-500 via-blue-400 to-blue-300"
                      onClick={() => onEditItem(item)}
                      type="button"
                    >
                      <PencilIcon className="h-5 w-5 text-white" />
                    </button>
                    <button
                      className="h-9 w-9 rounded-full flex items-center justify-center bg-gradient-to-tr from-red-500 via-red-400 to-orange-400"
                      onClick={() => onDeleteItem(item)}
                      type="button"
                    >
                      <TrashIcon className="h-5 w-5 text-white" />
                    </button>
                  </div>
                </div>
              ))}
              {items.length === 0 && (
                <div className="text-xs text-gray-400 py-2">No items</div>
              )}
            </div>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}

function formatCurrency(val: number, currency = 'USD') {
  return `${currency} ${val.toLocaleString(undefined, { maximumFractionDigits: 2 })}`;
}

function BudgetStatCard({ icon: Icon, label, value, color, gradient }: { icon: any, label: string, value: string, color: string, gradient: string }) {
  return (
    <div className="flex items-center gap-4 bg-white border border-gray-200 rounded-2xl p-6">
      <div className={`h-12 w-12 rounded-full flex items-center justify-center ${gradient}`}>
        <Icon className="h-7 w-7 text-white" />
      </div>
      <div>
        <div className="text-lg text-gray-900">{value}</div>
        <div className="text-xs text-gray-500">{label}</div>
      </div>
    </div>
  );
}

function BudgetCategoryListView({
  categories,
  items,
  currency,
  onAddCategory,
  onAddItem,
  onEditCategory,
  onDeleteCategory,
  onViewCategory,
}: {
  categories: any[];
  items: any[];
  currency: string;
  onAddCategory: () => void;
  onAddItem: (cat: any) => void;
  onEditCategory: (cat: any) => void;
  onDeleteCategory: (cat: any) => void;
  onViewCategory: (cat: any) => void;
}) {
  // Calculate totals for each category and for the project
  const categoryStats = categories.map(cat => {
    const catItems = items.filter((item: any) => item.category_id === cat.id);
    const planned = catItems.reduce((sum: number, i: any) => sum + (i.qty_planned * i.rate_cents) / 100, 0);
    const used = catItems.reduce((sum: number, i: any) => sum + (i.cost_actual_cents || 0) / 100, 0);
    return {
      ...cat,
      planned,
      used,
      items: catItems,
    };
  });
  const totalPlanned = categoryStats.reduce((sum, c) => sum + c.planned, 0);
  const totalUsed = categoryStats.reduce((sum, c) => sum + c.used, 0);
  const totalRemaining = totalPlanned - totalUsed;

  return (
    <div className="mb-10">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
        <BudgetStatCard
          icon={CurrencyDollarIcon}
          label="Total Planned"
          value={formatCurrency(totalPlanned, currency)}
          color="blue"
          gradient="bg-gradient-to-tr from-blue-500 via-blue-400 to-blue-300"
        />
        <BudgetStatCard
          icon={ArrowTrendingUpIcon}
          label="Total Used"
          value={formatCurrency(totalUsed, currency)}
          color="green"
          gradient="bg-gradient-to-tr from-green-500 via-green-400 to-green-300"
        />
        <BudgetStatCard
          icon={ArrowTrendingDownIcon}
          label="Total Remaining"
          value={formatCurrency(totalRemaining, currency)}
          color="orange"
          gradient="bg-gradient-to-tr from-orange-500 via-orange-400 to-yellow-400"
        />
      </div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-gray-900">Budget Categories</h2>
        <div className="flex gap-2">
          <button
            className="h-10 w-10 rounded-full flex items-center justify-center bg-gradient-to-tr from-orange-500 via-orange-400 to-yellow-400 shadow"
            onClick={onAddCategory}
            type="button"
            title="Add Category"
          >
            <PlusIcon className="h-5 w-5 text-white" />
          </button>
        </div>
      </div>
      <div className="space-y-4">
        {categoryStats.map(cat => (
          <Disclosure key={cat.id}>
            {({ open }) => (
              <div className="bg-white border border-gray-200 rounded-2xl">
                <Disclosure.Button className="w-full flex items-center justify-between px-6 py-4 text-left">
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-3">
                      <span className="h-10 w-10 rounded-full bg-gradient-to-tr from-orange-500 via-orange-400 to-yellow-400 flex items-center justify-center text-white font-bold text-lg">
                        {cat.name[0]}
                      </span>
                      <span className="text-lg text-gray-900">{cat.name}</span>
                    </div>
                    {/* Snapshot of totals below the name */}
                    <div className="flex gap-6 mt-1">
                      <div className="text-xs text-gray-500">
                        Planned: <span className="font-medium text-blue-700">{formatCurrency(cat.planned, currency)}</span>
                      </div>
                      <div className="text-xs text-gray-500">
                        Used: <span className="font-medium text-green-700">{formatCurrency(cat.used, currency)}</span>
                      </div>
                      <div className="text-xs text-gray-500">
                        Remaining: <span className="font-medium text-orange-700">{formatCurrency(cat.planned - cat.used, currency)}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-4 items-center">
                    <button
                      className="h-8 w-8 rounded-full flex items-center justify-center bg-gradient-to-tr from-blue-500 via-blue-400 to-blue-300"
                      onClick={e => { e.stopPropagation(); onEditCategory(cat); }}
                      type="button"
                      title="Edit Category"
                    >
                      <PencilIcon className="h-4 w-4 text-white" />
                    </button>
                    <button
                      className="h-8 w-8 rounded-full flex items-center justify-center bg-gradient-to-tr from-red-500 via-red-400 to-orange-400"
                      onClick={e => { e.stopPropagation(); onDeleteCategory(cat); }}
                      type="button"
                      title="Delete Category"
                    >
                      <TrashIcon className="h-4 w-4 text-white" />
                    </button>
                    <button
                      className="h-8 w-8 rounded-full flex items-center justify-center bg-gradient-to-tr from-orange-500 via-orange-400 to-yellow-400"
                      onClick={e => { e.stopPropagation(); onAddItem(cat); }}
                      type="button"
                      title="Add Item"
                    >
                      <PlusIcon className="h-4 w-4 text-white" />
                    </button>
                    <button
                      className="h-8 w-8 rounded-full flex items-center justify-center bg-gradient-to-tr from-gray-500 via-gray-400 to-gray-300"
                      onClick={e => { e.stopPropagation(); onViewCategory(cat); }}
                      type="button"
                      title="View Category"
                    >
                      <ViewColumnsIcon className="h-4 w-4 text-white" />
                    </button>
                    <ChevronDownIcon className={`h-5 w-5 text-gray-400 transition-transform ${open ? 'rotate-180' : ''}`} />
                  </div>
                </Disclosure.Button>
                <Disclosure.Panel className="px-6 pb-4">
                  {cat.items.length > 0 ? (
                    <div className="divide-y divide-gray-100">
                      {cat.items.map((item: any) => (
                        <div key={item.id} className="py-3 flex items-center justify-between">
                          <div>
                            <div className="font-medium text-gray-900">{item.name}</div>
                            <div className="text-xs text-gray-500">{item.description}</div>
                            <div className="text-xs text-gray-400">Planned: {item.qty_planned} {item.unit} @ {item.rate_cents}c</div>
                            <div className="text-xs text-gray-400">Actual: {item.qty_actual} {item.unit} (${(item.cost_actual_cents / 100).toFixed(2)})</div>
                          </div>
                          <div className="text-right">
                            <div className="text-xs text-gray-500">Planned</div>
                            <div className="font-medium text-blue-700">{formatCurrency((item.qty_planned * item.rate_cents) / 100, currency)}</div>
                            <div className="text-xs text-gray-500">Used</div>
                            <div className="font-medium text-green-700">{formatCurrency((item.cost_actual_cents || 0) / 100, currency)}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-xs text-gray-400 py-2">No items</div>
                  )}
                </Disclosure.Panel>
              </div>
            )}
          </Disclosure>
        ))}
      </div>
    </div>
  );
}

export default function BudgetTab({ companyId, projectId }: { companyId: number; projectId: number }) {
  const dispatch = useAppDispatch();
  const { categories, items } = useAppSelector((state) => state.budget);
  const { currentProject } = useAppSelector((state) => state.project);

  const [tab, setTab] = useState<'grid' | 'list'>('grid');
  const [categoryModalOpen, setCategoryModalOpen] = useState(false);
  const [editCategory, setEditCategory] = useState<any | null>(null);
  const [itemModalOpen, setItemModalOpen] = useState(false);
  const [editItem, setEditItem] = useState<any | null>(null);
  const [viewCategory, setViewCategory] = useState<any | null>(null);

  useEffect(() => {
    dispatch(fetchBudgetCategories({ companyId, projectId }));
    dispatch(fetchBudgetItems({ companyId, projectId }));
  }, [dispatch, companyId, projectId]);

  // Category handlers
  const handleAddCategory = async (data: any) => {
    await dispatch(createBudgetCategory({ companyId, projectId, data })).unwrap();
    setCategoryModalOpen(false);
    toast.success('Category added!');
    dispatch(fetchBudgetCategories({ companyId, projectId }));
  };
  const handleEditCategory = async (data: any) => {
    await dispatch(updateBudgetCategory({ companyId, projectId, categoryId: editCategory.id, data })).unwrap();
    setEditCategory(null);
    toast.success('Category updated!');
    dispatch(fetchBudgetCategories({ companyId, projectId }));
  };
  const handleDeleteCategory = async (cat: any) => {
    await dispatch(deleteBudgetCategory({ companyId, projectId, categoryId: cat.id })).unwrap();
    toast.success('Category deleted!');
    dispatch(fetchBudgetCategories({ companyId, projectId }));
  };

  // Item handlers
  const handleAddItem = async (data: any) => {
    await dispatch(createBudgetItem({ companyId, projectId, data })).unwrap();
    setItemModalOpen(false);
    toast.success('Budget item added!');
    dispatch(fetchBudgetItems({ companyId, projectId }));
  };
  const handleEditItem = async (data: any) => {
    await dispatch(updateBudgetItem({ companyId, projectId, itemId: editItem.id, data })).unwrap();
    setEditItem(null);
    toast.success('Budget item updated!');
    dispatch(fetchBudgetItems({ companyId, projectId }));
  };
  const handleDeleteItem = async (item: any) => {
    await dispatch(deleteBudgetItem({ companyId, projectId, itemId: item.id })).unwrap();
    toast.success('Budget item deleted!');
    dispatch(fetchBudgetItems({ companyId, projectId }));
  };

  // Add this handler definition (it was missing)
  const handleViewCategory = (cat: any) => setViewCategory(cat);

  // Group items by category
  const itemsByCategory = categories.map((cat: any) => ({
    ...cat,
    items: items.filter((item: any) => item.category_id === cat.id),
  }));

  return (
    <div className="space-y-8">
      {/* Tab Switcher */}
      <div className="flex gap-4 mb-4 justify-end">
        <button
          className={`h-10 w-10 rounded-full flex items-center justify-center transition ${
            tab === 'grid'
              ? 'bg-gradient-to-tr from-orange-500 via-orange-400 to-yellow-400 text-white shadow'
              : 'bg-gray-100 text-gray-700 hover:bg-orange-50'
          }`}
          onClick={() => setTab('grid')}
          title="Grid View"
        >
          <Squares2X2Icon className="h-5 w-5" />
        </button>
        <button
          className={`h-10 w-10 rounded-full flex items-center justify-center transition ${
            tab === 'list'
              ? 'bg-gradient-to-tr from-orange-500 via-orange-400 to-yellow-400 text-white shadow'
              : 'bg-gray-100 text-gray-700 hover:bg-orange-50'
          }`}
          onClick={() => setTab('list')}
          title="List View"
        >
          <ViewColumnsIcon className="h-5 w-5" />
        </button>
      </div>

      {tab === 'list' && (
        <BudgetCategoryListView
          categories={categories}
          items={items}
          currency={currentProject?.currency || 'USD'}
          onAddCategory={handleAddCategory}
          onAddItem={handleAddItem}
          onEditCategory={handleEditCategory}
          onDeleteCategory={handleDeleteCategory}
          onViewCategory={handleViewCategory}
        />
      )}

      {tab === 'grid' && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-gray-900">Budget Categories</h2>
            <Button onClick={() => setCategoryModalOpen(true)} variant="default" className="flex items-center gap-2">
              <PlusIcon className="h-5 w-5" /> Add Category
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {itemsByCategory.map((cat: any) => (
              <div key={cat.id} className="bg-white border border-gray-200 rounded-2xl p-6">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <button
                      className="h-10 w-10 rounded-full flex items-center justify-center bg-gradient-to-tr from-orange-500 via-orange-400 to-yellow-400"
                      onClick={() => setViewCategory(cat)}
                      type="button"
                    >
                      <span className="text-white font-bold text-lg">{cat.name[0]}</span>
                    </button>
                    <div className="font-semibold text-lg text-gray-900">{cat.name}</div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      className="h-9 w-9 rounded-full flex items-center justify-center bg-gradient-to-tr from-blue-500 via-blue-400 to-blue-300"
                      onClick={() => setEditCategory(cat)}
                      type="button"
                    >
                      <PencilIcon className="h-5 w-5 text-white" />
                    </button>
                    <button
                      className="h-9 w-9 rounded-full flex items-center justify-center bg-gradient-to-tr from-red-500 via-red-400 to-orange-400"
                      onClick={() => handleDeleteCategory(cat)}
                      type="button"
                    >
                      <TrashIcon className="h-5 w-5 text-white" />
                    </button>
                    <Button size="sm" variant="outline" onClick={() => setItemModalOpen(cat.id)}>
                      <PlusIcon className="h-4 w-4" /> Add Item
                    </Button>
                  </div>
                </div>
                <div className="mb-2 text-xs text-gray-500">Order: {cat.order_index}</div>
                <div className="flex items-center justify-between mb-2">
                  <div className="text-sm text-gray-700 font-medium">Budget Items</div>
                </div>
                <div className="divide-y divide-gray-100">
                  {cat.items.length > 0 ? (
                    <div className="py-3 flex items-center justify-between">
                      <div>
                        <div className="font-medium text-gray-900">{cat.items[0].name}</div>
                        <div className="text-xs text-gray-500">{cat.items[0].description}</div>
                        <div className="text-xs text-gray-400">Planned: {cat.items[0].qty_planned} {cat.items[0].unit} @ {cat.items[0].rate_cents}c</div>
                        <div className="text-xs text-gray-400">Actual: {cat.items[0].qty_actual} {cat.items[0].unit} (${(cat.items[0].cost_actual_cents / 100).toFixed(2)})</div>
                      </div>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="text-orange-600"
                        onClick={() => setViewCategory(cat)}
                      >
                        View More
                      </Button>
                    </div>
                  ) : (
                    <div className="text-xs text-gray-400 py-2">No items</div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <BudgetCategoryModal
        open={categoryModalOpen || !!editCategory}
        onClose={() => {
          setCategoryModalOpen(false);
          setEditCategory(null);
        }}
        onSubmit={editCategory ? handleEditCategory : handleAddCategory}
        initialData={editCategory}
      />
      <BudgetItemModal
        open={!!itemModalOpen || !!editItem}
        onClose={() => {
          setItemModalOpen(false);
          setEditItem(null);
        }}
        onSubmit={editItem ? handleEditItem : handleAddItem}
        initialData={editItem}
        categories={categories}
      />
      <BudgetCategoryViewModal
        open={!!viewCategory}
        onClose={() => setViewCategory(null)}
        category={viewCategory}
        items={viewCategory ? items.filter((item: any) => item.category_id === viewCategory.id) : []}
        onEditItem={setEditItem}
        onDeleteItem={handleDeleteItem}
      />
    </div>
  );
}
