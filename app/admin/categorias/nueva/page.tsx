'use client';

import React, { useState } from 'react';
import { Card, CardBody } from '@heroui/react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/features/admin/auth/auth-context';
import { createCategory, CategoryCreateSchema } from '@/lib/api-client';
import { FormInput, FormCheckbox, FormTextarea } from '@/features/admin/ui/form-components';
import { FormButton } from '@/features/admin/ui/button-components';

export default function NuevaCategoriaPage() {
  const router = useRouter();
  const { token } = useAuth();
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState<CategoryCreateSchema>({
    name: '',
    common_name: '',
    description: '',
    language: 'es',
    available: true,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token || !formData.name || !formData.common_name) {
      setError('Completa todos los campos requeridos');
      return;
    }

    setIsSaving(true);
    try {
      await createCategory(token, formData);
      router.push('/admin/categorias');
    } catch (err) {
      setError('Error al crear la categoría');
      console.error(err);
      setIsSaving(false);
    }
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="font-display text-4xl mb-2" style={{ color: 'var(--color-gold)' }}>
          Nueva Categoría
        </h1>
        <p className="font-body" style={{ color: 'var(--color-cream-muted)' }}>
          Crea una nueva categoría para organizar el menú
        </p>
      </div>

      <Card className="max-w-2xl border" style={{ backgroundColor: 'var(--admin-bg-card)', borderColor: 'var(--admin-border)' }}>
        <CardBody className="gap-8 p-8">
          {error && (
            <div className="rounded-lg p-4 border-2" style={{ backgroundColor: 'rgba(220, 38, 38, 0.1)', borderColor: 'var(--color-danger)' }}>
              <p className="font-body font-semibold" style={{ color: '#ff9999' }}>⚠️ {error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="gap-8 flex flex-col">
            <div>
              <h3 className="font-display text-lg mb-6" style={{ color: 'var(--color-gold)' }}>
                Información básica
              </h3>
              <div className="grid grid-cols-2 gap-6">
                <FormInput
                  label="Nombre"
                  isRequired
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Ej: Pasta"
                />
                <FormInput
                  label="Nombre común"
                  isRequired
                  value={formData.common_name}
                  onChange={(e) => setFormData({ ...formData, common_name: e.target.value })}
                  placeholder="Ej: pasta"
                />
              </div>
            </div>

            <div>
              <FormTextarea
                label="Descripción"
                value={formData.description || ''}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Descripción opcional de la categoría"
              />
            </div>

            <div className="border-t pt-8" style={{ borderColor: 'var(--admin-border)' }}>
              <h3 className="font-display text-lg mb-6" style={{ color: 'var(--color-gold)' }}>
                Estado
              </h3>
              <FormCheckbox
                label="✓ Categoría activa"
                checked={formData.available ?? true}
                onChange={(checked) => setFormData({ ...formData, available: checked })}
              />
              <p className="mt-3 font-body text-sm" style={{ color: 'var(--color-cream-muted)' }}>
                Las categorías activas se muestran en los selectores del menú.
              </p>
            </div>

            <div className="flex gap-4 justify-end border-t pt-8" style={{ borderColor: 'var(--admin-border)' }}>
              <FormButton onClick={() => router.back()} variant="secondary">
                Cancelar
              </FormButton>
              <FormButton
                type="submit"
                variant="primary"
                size="lg"
                isLoading={isSaving}
                disabled={isSaving || !formData.name || !formData.common_name}
              >
                Crear categoría
              </FormButton>
            </div>
          </form>
        </CardBody>
      </Card>
    </div>
  );
}
