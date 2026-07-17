'use client';

import React, { useEffect, useState } from 'react';
import { Card, CardBody } from '@heroui/react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/features/admin/auth/auth-context';
import {
  createProduct,
  getCategories,
  ProductCreateSchema,
  CategoryModel,
} from '@/lib/api-client';
import { FormInput, FormSelect, FormCheckbox } from '@/features/admin/ui/form-components';
import { FormButton, FormButtonGroup } from '@/features/admin/ui/button-components';

export default function NuevoPlatoPage() {
  const router = useRouter();
  const { token } = useAuth();
  const [categories, setCategories] = useState<CategoryModel[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState<ProductCreateSchema>({
    number: 0,
    name: '',
    description: '',
    price: 0,
    language: 'es',
    available: true,
    is_spicy: false,
    is_adult_only: false,
    category_id: 0,
  });

  useEffect(() => {
    loadCategories();
  }, [token]);

  const loadCategories = async () => {
    if (!token) return;
    setIsLoading(true);
    try {
      const data = await getCategories(token);
      setCategories(data);
    } catch (err) {
      setError('Error al cargar categorías');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token || !formData.category_id) {
      setError('Completa todos los campos requeridos');
      return;
    }

    setIsSaving(true);
    try {
      await createProduct(token, formData);
      router.push('/admin/platos');
    } catch (err) {
      setError('Error al crear el plato');
      console.error(err);
      setIsSaving(false);
    }
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="font-display text-4xl mb-2" style={{ color: 'var(--color-gold)' }}>
          Nuevo Plato
        </h1>
        <p className="font-body" style={{ color: 'var(--color-cream-muted)' }}>
          Crea un nuevo plato para el menú
        </p>
      </div>

      <Card className="max-w-3xl border" style={{ backgroundColor: 'var(--admin-bg-card)', borderColor: 'var(--admin-border)' }}>
        <CardBody className="gap-8 p-8">
          {error && (
            <div className="rounded-lg p-4 border-2" style={{ backgroundColor: 'rgba(220, 38, 38, 0.1)', borderColor: 'var(--color-danger)' }}>
              <p className="font-body font-semibold" style={{ color: '#ff9999' }}>⚠️ {error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="gap-8 flex flex-col">
            {/* Información básica */}
            <div>
              <h3 className="font-display text-lg mb-6" style={{ color: 'var(--color-gold)' }}>
                Información básica
              </h3>
              <div className="grid grid-cols-2 gap-6">
                <FormInput
                  label="Número"
                  isRequired
                  type="number"
                  value={String(formData.number)}
                  onChange={(e) => setFormData({ ...formData, number: parseInt(e.target.value) || 0 })}
                  placeholder="Ej: 1"
                />
                <FormInput
                  label="Precio"
                  isRequired
                  type="number"
                  step="0.01"
                  value={String(formData.price)}
                  onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
                  placeholder="Ej: 12.50"
                />
              </div>
            </div>

            {/* Descripción */}
            <div>
              <FormInput
                label="Nombre del plato"
                isRequired
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Ej: Pasta Carbonara"
              />
            </div>

            <div>
              <FormInput
                label="Descripción"
                value={formData.description || ''}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Describe el plato, ingredientes principales, etc..."
              />
            </div>

            {/* Categoría */}
            <div>
              <FormSelect
                label="Categoría"
                isRequired
                value={String(formData.category_id)}
                onChange={(e) => setFormData({ ...formData, category_id: parseInt(e.target.value) || 0 })}
                options={categories}
              />
            </div>

            {/* Opciones adicionales */}
            <div className="border-t pt-8" style={{ borderColor: 'var(--admin-border)' }}>
              <h3 className="font-display text-lg mb-6" style={{ color: 'var(--color-gold)' }}>
                Opciones adicionales
              </h3>
              <div className="grid grid-cols-3 gap-3">
                <FormCheckbox
                  label="✓ Disponible"
                  checked={formData.available}
                  onChange={(checked) => setFormData({ ...formData, available: checked })}
                />
                <FormCheckbox
                  label="🌶️ Picante"
                  checked={formData.is_spicy}
                  onChange={(checked) => setFormData({ ...formData, is_spicy: checked })}
                />
                <FormCheckbox
                  label="👤 Solo adultos"
                  checked={formData.is_adult_only}
                  onChange={(checked) => setFormData({ ...formData, is_adult_only: checked })}
                />
              </div>
            </div>

            {/* Botones */}
            <div className="flex gap-4 justify-end border-t pt-8" style={{ borderColor: 'var(--admin-border)' }}>
              <FormButton 
                onClick={() => router.back()} 
                variant="secondary"
              >
                Cancelar
              </FormButton>
              <FormButton
                type="submit"
                variant="primary"
                size="lg"
                isLoading={isSaving}
                disabled={isSaving || !formData.category_id}
              >
                Crear plato
              </FormButton>
            </div>
          </form>
        </CardBody>
      </Card>
    </div>
  );
}
