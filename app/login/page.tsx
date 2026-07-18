'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button, Card, CardBody, CardHeader } from '@heroui/react';
import { useAuth } from '@/features/admin/auth/auth-context';
import { loginAdmin } from '@/lib/api-client';

function LoginInput({
  label,
  type = 'text',
  value,
  onChange,
  placeholder,
  disabled,
  endContent,
}: {
  label: string;
  type?: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  disabled?: boolean;
  endContent?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-2">
      <label className="font-body font-semibold text-sm" style={{ color: 'var(--color-cream-muted)' }}>
        {label}
      </label>
      <div className="relative">
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          disabled={disabled}
          autoComplete="off"
          className="font-body w-full px-4 py-3 rounded-lg"
          style={{
            backgroundColor: 'var(--admin-bg-card)',
            color: 'var(--color-cream)',
            borderWidth: '2px',
            borderStyle: 'solid',
            borderColor: 'var(--admin-border)',
            outline: 'none',
            paddingRight: endContent ? '5rem' : '1rem',
            opacity: disabled ? 0.6 : 1,
          }}
          onFocus={(e) => { e.currentTarget.style.borderColor = 'var(--color-gold)'; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(201,168,76,0.1)'; }}
          onBlur={(e) => { e.currentTarget.style.borderColor = 'var(--admin-border)'; e.currentTarget.style.boxShadow = 'none'; }}
        />
        {endContent && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            {endContent}
          </div>
        )}
      </div>
    </div>
  );
}

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const response = await loginAdmin(username, password);
      login(response.access_token);
      router.push('/admin');
    } catch (err) {
      setError('Credenciales inválidas. Intenta de nuevo.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="cs-container min-h-screen flex items-center justify-center py-10 bg-black">
      <Card className="w-full max-w-md border" style={{ backgroundColor: 'var(--color-surface)', borderColor: 'var(--admin-border)' }}>
        <CardHeader className="flex flex-col items-center gap-3 px-6 py-8 border-b" style={{ borderColor: 'var(--admin-border)' }}>
          <h1 className="font-display text-4xl" style={{ color: 'var(--color-gold)' }}>Casa Stella</h1>
          <p className="font-body text-sm" style={{ color: 'var(--color-cream-muted)' }}>Panel de administración</p>
        </CardHeader>
        <CardBody className="gap-4 px-6 pb-8">
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <LoginInput
              label="Usuario"
              value={username}
              onChange={setUsername}
              placeholder="Ingresa tu usuario"
              disabled={isLoading}
            />
            <LoginInput
              label="Contraseña"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={setPassword}
              placeholder="Ingresa tu contraseña"
              disabled={isLoading}
              endContent={
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-sm font-body transition-colors"
                  style={{ color: 'var(--color-cream-muted)' }}
                >
                  {showPassword ? 'Ocultar' : 'Mostrar'}
                </button>
              }
            />
            {error && (
              <div className="rounded-lg p-3" style={{ backgroundColor: 'rgba(192, 57, 43, 0.1)', borderColor: 'var(--color-danger)', border: '1px solid' }}>
                <p className="font-body text-sm" style={{ color: '#ff9999' }}>{error}</p>
              </div>
            )}
            <Button
              type="submit"
              className="w-full font-body font-semibold uppercase tracking-wider text-black"
              style={{ backgroundColor: 'var(--color-gold)' }}
              isLoading={isLoading}
              disabled={isLoading || !username || !password}
            >
              {isLoading ? 'Ingresando...' : 'Ingresar'}
            </Button>
          </form>
        </CardBody>
      </Card>
    </div>
  );
}
