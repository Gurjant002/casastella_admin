'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button, Input, Card, CardBody, CardHeader } from '@heroui/react';
import { useAuth } from '@/features/admin/auth/auth-context';
import { loginAdmin } from '@/lib/api-client';

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
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <Input
              isRequired
              label="Usuario"
              placeholder="Ingresa tu usuario"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              disabled={isLoading}
              classNames={{
                input: ['font-body'],
                label: ['font-body'],
              }}
              style={{
                '--input-bg': 'var(--color-black)',
                '--input-text': 'var(--color-cream)',
                '--input-label': 'var(--color-cream-muted)',
              } as React.CSSProperties}
            />
            <Input
              isRequired
              label="Contraseña"
              placeholder="Ingresa tu contraseña"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
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
              classNames={{
                input: ['font-body'],
                label: ['font-body'],
              }}
              style={{
                '--input-bg': 'var(--color-black)',
                '--input-text': 'var(--color-cream)',
                '--input-label': 'var(--color-cream-muted)',
              } as React.CSSProperties}
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
