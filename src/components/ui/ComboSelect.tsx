import React from 'react';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';

// Minimal ComboSelect wrapper so existing imports don't break the build.
// It forwards common props to underlying Select; adapt as needed.
export type ComboSelectOption = { value: string; label: string };

interface ComboSelectProps {
  value?: string;
  onChange?: (val: string) => void;
  options?: ComboSelectOption[];
  disabled?: boolean;
  placeholder?: string;
  className?: string;
}

export const ComboSelect: React.FC<ComboSelectProps> = ({
  value,
  onChange,
  options = [],
  disabled,
  placeholder,
  className,
}) => {
  return (
    <Select value={value} onValueChange={(v) => onChange?.(v)} disabled={disabled}>
      <SelectTrigger className={className || 'w-full'}>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {options.map((opt) => (
          <SelectItem key={opt.value} value={opt.value}>
            {opt.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default ComboSelect;
