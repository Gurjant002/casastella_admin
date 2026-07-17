import React from 'react';
import { Input, Select, SelectItem } from '@heroui/react';

interface FormInputProps {
  label: string;
  isRequired?: boolean;
  value: string | number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type?: string;
  step?: string;
  placeholder?: string;
}

export function FormInput({
  label,
  isRequired = false,
  value,
  onChange,
  type = 'text',
  step,
  placeholder,
}: FormInputProps) {
  return (
    <div className="flex flex-col gap-2">
      <label className="font-body font-semibold" style={{ color: 'var(--color-cream)' }}>
        {label}
        {isRequired && <span style={{ color: 'var(--color-danger)' }}> *</span>}
      </label>
      <input
        type={type}
        step={step}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="font-body px-4 py-3 rounded-lg border-2 transition-all"
        style={{
          backgroundColor: 'var(--color-black)',
          color: 'var(--color-cream)',
          borderColor: 'var(--admin-border)',
        }}
        onFocus={(e) => {
          e.currentTarget.style.borderColor = 'var(--color-gold)';
          e.currentTarget.style.boxShadow = '0 0 0 3px rgba(201, 168, 76, 0.1)';
        }}
        onBlur={(e) => {
          e.currentTarget.style.borderColor = 'var(--admin-border)';
          e.currentTarget.style.boxShadow = 'none';
        }}
      />
    </div>
  );
}

interface FormSelectProps {
  label: string;
  isRequired?: boolean;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  options: Array<{ id?: number | string | null | undefined; name: string }>;
}

export function FormSelect({
  label,
  isRequired = false,
  value,
  onChange,
  options,
}: FormSelectProps) {
  return (
    <div className="flex flex-col gap-2">
      <label className="font-body font-semibold" style={{ color: 'var(--color-cream)' }}>
        {label}
        {isRequired && <span style={{ color: 'var(--color-danger)' }}> *</span>}
      </label>
      <select
        value={value}
        onChange={onChange}
        className="font-body px-4 py-3 rounded-lg border-2 transition-all appearance-none"
        style={{
          backgroundColor: 'var(--color-black)',
          color: 'var(--color-cream)',
          borderColor: 'var(--admin-border)',
          backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3e%3cpath fill='none' stroke='%23c9a84c' stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M2 5l6 6 6-6'/%3e%3c/svg%3e")`,
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'right 0.75rem center',
          backgroundSize: '16px',
          paddingRight: '2.5rem',
        }}
        onFocus={(e) => {
          e.currentTarget.style.borderColor = 'var(--color-gold)';
          e.currentTarget.style.boxShadow = '0 0 0 3px rgba(201, 168, 76, 0.1)';
        }}
        onBlur={(e) => {
          e.currentTarget.style.borderColor = 'var(--admin-border)';
          e.currentTarget.style.boxShadow = 'none';
        }}
      >
        <option value="">Selecciona una opción</option>
        {options.filter(opt => opt.id != null).map((opt) => (
          <option key={opt.id} value={String(opt.id)}>
            {opt.name}
          </option>
        ))}
      </select>
    </div>
  );
}

interface FormCheckboxProps {
  label: string;
  checked: boolean | undefined;
  onChange: (checked: boolean) => void;
}

export function FormCheckbox({ label, checked, onChange }: FormCheckboxProps) {
  return (
    <label className="flex items-center gap-3 cursor-pointer p-3 rounded-lg transition-all hover:opacity-80" style={{
      backgroundColor: checked ? 'rgba(201, 168, 76, 0.1)' : 'transparent',
    }}>
      <input
        type="checkbox"
        checked={checked ?? false}
        onChange={(e) => onChange(e.target.checked)}
        className="w-5 h-5 cursor-pointer accent-gold rounded"
        style={{
          accentColor: 'var(--color-gold)',
        }}
      />
      <span className="font-body" style={{ color: 'var(--color-cream)' }}>
        {label}
      </span>
    </label>
  );
}
