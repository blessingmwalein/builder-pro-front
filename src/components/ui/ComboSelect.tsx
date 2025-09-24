'use client';

import React, { useMemo, useState } from 'react';
import { Listbox, Transition } from '@headlessui/react';
import { CheckIcon, ChevronUpDownIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import clsx from 'clsx';

export interface OptionItem { value: string; label: string }

interface ComboSelectProps {
  label?: string;
  error?: string;
  value?: string;
  onChange?: (value: string) => void;
  options: OptionItem[];
  placeholder?: string;
}

export function ComboSelect({ label, error, value, onChange, options, placeholder }: ComboSelectProps) {
  const [query, setQuery] = useState('');

  const filtered = useMemo(() => {
    if (!query) return options;
    const q = query.toLowerCase();
    return options.filter(o => o.label.toLowerCase().includes(q) || o.value.toLowerCase().includes(q));
  }, [options, query]);

  const selected = useMemo(() => options.find(o => o.value === value) || null, [options, value]);

  return (
    <div className="space-y-1">
      {label && (
        <label className="block text-sm font-medium text-gray-700">{label}</label>
      )}

      <Listbox value={selected?.value ?? ''} onChange={(val: string) => onChange?.(val)}>
        <div className="relative">
          <Listbox.Button className={clsx(
            'w-full input-field text-left',
            error && 'border-red-300 focus:border-red-500 focus:ring-red-500'
          )}>
            <span className="block truncate">{selected?.label || placeholder || 'Select an option'}</span>
            <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
              <ChevronUpDownIcon className="h-5 w-5 text-gray-400" />
            </span>
          </Listbox.Button>

          <Transition
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Listbox.Options className="absolute z-20 mt-2 max-h-60 w-full overflow-auto rounded-xl bg-white py-2 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
              <div className="px-3 pb-2">
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <MagnifyingGlassIcon className="h-4 w-4 text-gray-400" />
                  </span>
                  <input
                    className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Search..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                  />
                </div>
              </div>
              {filtered.length === 0 && (
                <div className="px-4 py-2 text-sm text-gray-500">No results</div>
              )}
              {filtered.map((opt) => (
                <Listbox.Option
                  key={opt.value}
                  value={opt.value}
                  className={({ active }) => clsx(
                    'relative cursor-pointer select-none py-2 pl-10 pr-4',
                    active ? 'bg-blue-50 text-blue-900' : 'text-gray-900'
                  )}
                >
                  {({ selected }) => (
                    <>
                      <span className={clsx('block truncate', selected ? 'font-semibold' : 'font-normal')}>{opt.label}</span>
                      {selected ? (
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-blue-600">
                          <CheckIcon className="h-5 w-5" />
                        </span>
                      ) : null}
                    </>
                  )}
                </Listbox.Option>
              ))}
            </Listbox.Options>
          </Transition>
        </div>
      </Listbox>

      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  );
}


