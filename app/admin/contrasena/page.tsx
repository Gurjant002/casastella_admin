'use client';

import React, { useState } from 'react';
import { Card, CardBody } from '@heroui/react';
import { useAuth } from '@/features/admin/auth/auth-context';
import { changePassword } from '@/lib/api-client';
import { FormButton } from '@/features/admin/ui/button-components';

function PasswordInput({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  const [show, setShow] = useState(false);
  return (
    <div className="flex flex-col gap-2">
      <label className="font-body font-semibold text-sm" style={{ color: 'var(--color-cream)' }}>
        {label} <span style={{ color: 'var(--color-danger)' }}>*</span>
      </label>
      <div className="relative">
        <input
          type={show ? 'text' : 'password'}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          autoComplete="new-password"
          className="font-body w-full px-4 py-3 rounded-lg"
          style={{
            backgroundColor: 'var(--color-black)',
            color: 'var(--color-cream)',
            borderWidth: '2px',
            borderStyle: 'solid',
            borderColor: 'var(--admin-border)',
            outline: 'none',
            paddingRight: '3rem',
          }}
          onFocus={(e) => { e.currentTarget.style.borderColor = 'var(--color-gold)'; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(201,168,76,0.1)'; }}
          onBlur={(e) => { e.currentTarget.style.borderColor = 'var(--admin-border)'; e.currentTarget.style.boxShadow = 'none'; }}
        />
        <button
          type="button"
          onClick={() => setShow((s) => !s)}
          className="absolute right-3 top-1/2 -translate-y-1/2 font-body text-xs"
          style={{ color: 'var(--color-cream-muted)' }}
        >
          {show ? 'Ocultar' : 'Mostrar'}
        </button>
      </div>
    </div>
  );
}

export default function ContrasenaPage() {
  const { token } = useAuth();
  const [current, setCurrent] = useState('');
  const [next, setNext] = useState('');
  const [confirm, setConfirm] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!current || !next || !confirm) {
      setError('Completa todos los campos');
      return;
    }
    if (next !== confirm) {
      setError('La nueva contraseña y la confirmación no coinciden');
      return;
    }
    if (next.length < 8) {
      setError('La nueva contraseña debe tener al menos 8 caracteres');
      return;
    }

    setIsSaving(true);
    try {
      await changePassword(token!, {
        current_password: current,
        new_password: next,
        confirm_password: confirm,
      });
      setCurrent('');
      setNext('');
      setConfirm('');
      setSuccess(true);
      setTimeout(() => setSuccess(false), 4000);
    } catch (err: unknown) {
      const msg = (err as { payload?: { detail?: string } })?.payload?.detail;
      setError(msg || 'Error al cambiar la contraseña. Verifica la contraseña actual.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="font-display text-4xl mb-2" style={{ color: 'var(--color-gold)' }}>Contraseña</h1>
        <p className="font-body" style={{ color: 'var(--color-cream-muted)' }}>
          Cambia la contraseña de acceso al panel de administración
        </p>
      </div>

      <Card className="max-w-md border" style={{ backgroundColor: 'var(--admin-bg-card)', borderColor: 'var(--admin-border)' }}>
        <CardBody className="p-8">
          {error && (
            <div className="mb-6 rounded-lg p-4 border-2" style={{ backgroundColor: 'rgba(220,38,38,0.1)', borderColor: 'var(--color-danger)' }}>
              <p className="font-body font-semibold text-sm" style={{ color: '#ff9999' }}>⚠️ {error}</p>
            </div>
          )}
          {success && (
            <div className="mb-6 rounded-lg p-4 border-2" style={{ backgroundColor: 'rgba(34,197,94,0.1)', borderColor: 'var(--color-success)' }}>
              <p className="font-body font-semibold text-sm" style={{ color: '#86efac' }}>✓ Contraseña actualizada correctamente</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            <PasswordInput
              label="Contraseña actual"
              value={current}
              onChange={setCurrent}
              placeholder="Introduce tu contraseña actual"
            />

            <div className="border-t" style={{ borderColor: 'var(--admin-border)' }} />

            <PasswordInput
              label="Nueva contraseña"
              value={next}
              onChange={setNext}
              placeholder="Mínimo 8 caracteres"
            />

            <PasswordInput
              label="Confirmar nueva contraseña"
              value={confirm}
              onChange={setConfirm}
              placeholder="Repite la nueva contraseña"
            />

            {/* Indicador de fortaleza */}
            {next.length > 0 && (
              <div>
                <div className="flex gap-1 mb-1">
                  {[1, 2, 3, 4].map((i) => {
                    const strength = [next.length >= 8, /[A-Z]/.test(next), /[0-9]/.test(next), /[^A-Za-z0-9]/.test(next)].filter(Boolean).length;
                    return (
                      <div
                        key={i}
                        className="h-1 flex-1 rounded-full transition-all"
                        style={{
                          backgroundColor: i <= strength
                            ? strength <= 1 ? '#ef4444' : strength === 2 ? '#f59e0b' : strength === 3 ? '#84cc16' : '#22c55e'
                            : 'var(--admin-border)',
                        }}
                      />
                    );
                  })}
                </div>
                <p className="font-body text-xs" style={{ color: 'var(--color-cream-muted)' }}>
                  {[next.length >= 8, /[A-Z]/.test(next), /[0-9]/.test(next), /[^A-Za-z0-9]/.test(next)].filter(Boolean).length <= 1
                    ? 'Débil — añade mayúsculas, números o símbolos'
                    : [next.length >= 8, /[A-Z]/.test(next), /[0-9]/.test(next), /[^A-Za-z0-9]/.test(next)].filter(Boolean).length === 2
                    ? 'Regular'
                    : [next.length >= 8, /[A-Z]/.test(next), /[0-9]/.test(next), /[^A-Za-z0-9]/.test(next)].filter(Boolean).length === 3
                    ? 'Buena'
                    : 'Fuerte'}
                </p>
              </div>
            )}

            <FormButton
              type="submit"
              variant="primary"
              size="lg"
              isLoading={isSaving}
              disabled={!current || !next || !confirm}
              fullWidth
            >
              Cambiar contraseña
            </FormButton>
          </form>
        </CardBody>
      </Card>
    </div>
  );
}
