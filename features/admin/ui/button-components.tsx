import React from 'react';

interface FormButtonProps {
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  variant?: 'primary' | 'secondary' | 'danger';
  isLoading?: boolean;
  disabled?: boolean;
  children: React.ReactNode;
  fullWidth?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export function FormButton({
  onClick,
  type = 'button',
  variant = 'secondary',
  isLoading = false,
  disabled = false,
  children,
  fullWidth = false,
  size = 'md',
}: FormButtonProps) {
  const sizeClasses = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
  };

  const variantStyles = {
    primary: {
      backgroundColor: 'var(--color-gold)',
      color: 'var(--color-black)',
      border: 'none',
    },
    secondary: {
      backgroundColor: 'var(--admin-bg-hover)',
      color: 'var(--color-cream-muted)',
      border: '2px solid var(--admin-border)',
    },
    danger: {
      backgroundColor: 'rgba(220, 38, 38, 0.1)',
      color: 'var(--color-danger)',
      border: '2px solid var(--color-danger)',
    },
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || isLoading}
      className={`
        font-body font-semibold rounded-lg transition-all duration-200 
        uppercase tracking-wider
        ${sizeClasses[size]}
        ${fullWidth ? 'w-full' : ''}
        ${disabled || isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-lg hover:scale-105'}
      `}
      style={{
        ...variantStyles[variant],
        opacity: disabled || isLoading ? 0.5 : 1,
        transform: 'translateZ(0)',
      }}
    >
      {isLoading ? (
        <span className="flex items-center justify-center gap-2">
          <span
            className="inline-block w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"
            style={{
              borderColor: 'currentColor',
              borderTopColor: 'transparent',
            }}
          />
          Procesando...
        </span>
      ) : (
        children
      )}
    </button>
  );
}

interface FormButtonGroupProps {
  onCancel?: () => void;
  onSubmit?: () => void;
  submitLabel?: string;
  cancelLabel?: string;
  isLoading?: boolean;
  submitDisabled?: boolean;
}

export function FormButtonGroup({
  onCancel,
  onSubmit,
  submitLabel = 'Guardar',
  cancelLabel = 'Cancelar',
  isLoading = false,
  submitDisabled = false,
}: FormButtonGroupProps) {
  return (
    <div className="flex gap-4 justify-end">
      {onCancel && (
        <FormButton onClick={onCancel} variant="secondary" size="md">
          {cancelLabel}
        </FormButton>
      )}
      {onSubmit && (
        <FormButton 
          onClick={onSubmit} 
          variant="primary" 
          size="lg"
          isLoading={isLoading}
          disabled={submitDisabled}
        >
          {submitLabel}
        </FormButton>
      )}
    </div>
  );
}
