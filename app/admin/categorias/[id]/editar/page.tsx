'use client';

import React, { useEffect, useState } from 'react';
import { Card, CardBody } from '@heroui/react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/features/admin/auth/auth-context';
import { getCategories, updateCategory, CategoryModel } from '@/lib/api-client';
import { FormInput, FormCheckbox } from '@/features/admin/ui/form-components';
import { FormButton } from '@/features/admin/ui/button-components';

export default function EditarCategoriaPage() {
  const router = useRouter();
  const params = useParams();
  const categoryId = Number(params.id);
  const { token } = useAuth();

  const [category, setCategory] = useState<CategoryModel | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    common_name: '',
    description: '',
    language: 'es',
    available: true,
  });

  useEffect(() => {
    loadData();
  }, [token, categoryId]);

  const loadData = async () => {
    if (!token) return;
    if (!Number.isFinite(categoryId)) {
      setError('Categoría no válida');
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    try {
      const [activeCategories, inactiveCategories] = await Promise.all([
        getCategories(token, { available: true }),
        getCategories(token, { available: false }),
      ]);

      const allCategories = [...activeCategories];
      for (const item of inactiveCategories) {
        if (!allCategories.find((current) => current.id === item.id)) {
          allCategories.push(item);
        }
      }

      const found = allCategories.find((item) => item.id === categoryId);
      if (!found) {
        setError('Categoría no encontrada');
        return;
      }

      setCategory(found);
      setFormData({
        name: found.name,
        common_name: found.common_name,
        description: found.description || '',
        language: found.language || 'es',
        available: found.available ?? true,
      });
    } catch (err) {
      setError('Error al cargar la categoría');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token || !category || !formData.name || !formData.common_name) {
      setError('Completa todos los campos requeridos');
      return;
    }

    setIsSaving(true);
    try {
      await updateCategory(token, categoryId, {
        ...category,
        ...formData,
        description: formData.description || null,
      });
      router.push('/admin/categorias');
    } catch (err) {
      setError('Error al guardar cambios');
      console.error(err);
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="p-8">
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 mb-4" style={{ borderBottomColor: 'var(--color-gold)', borderWidth: '2px', borderTopColor: 'transparent', borderRightColor: 'transparent', borderLeftColor: 'transparent' }} />
          <p className="font-body" style={{ color: 'var(--color-cream-muted)' }}>Cargando categoría...</p>
        </div>
      </div>
    );
  }

  if (error && !category) {
    return (
      <div className="p-8">
        <Card className="border" style={{ backgroundColor: 'rgba(220, 38, 38, 0.1)', borderColor: 'var(--color-danger)' }}>
          <CardBody>
            <p className="font-body font-semibold" style={{ color: '#ff9999' }}>⚠️ {error}</p>
            <FormButton onClick={() => router.back()} variant="primary" size="md">
              Volver
            </FormButton>
          </CardBody>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="font-display text-4xl mb-2" style={{ color: 'var(--color-gold)' }}>
          Editar Categoría
        </h1>
        <p className="font-body" style={{ color: 'var(--color-cream-muted)' }}>
          {category?.name}
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
              <FormInput
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
                checked={formData.available}
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
                Guardar cambios
              </FormButton>
            </div>
          </form>
        </CardBody>
      </Card>
    </div>
  );
}
