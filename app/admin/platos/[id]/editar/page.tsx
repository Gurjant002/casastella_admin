'use client';

import React, { useEffect, useState } from 'react';
import { Card } from '@heroui/react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/features/admin/auth/auth-context';
import {
  getProducts,
  updateProduct,
  getCategories,
  ProductSchema,
  CategoryModel,
} from '@/lib/api-client';
import { FormInput, FormSelect, FormCheckbox, FormTextarea } from '@/features/admin/ui/form-components';
import { FormButton } from '@/features/admin/ui/button-components';

export default function EditarPlatoPage() {
  const router = useRouter();
  const params = useParams();
  const platId = Number(params.id);
  const { token } = useAuth();
  
  const [plato, setPlato] = useState<ProductSchema | null>(null);
  const [categories, setCategories] = useState<CategoryModel[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
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
    loadData();
  }, [token, platId]);

  const loadData = async () => {
    if (!token) return;
    setIsLoading(true);
    try {
      const [productsData, categoriesData] = await Promise.all([
        getProducts(token),
        getCategories(token),
      ]);
      
      const found = productsData.find((p) => p.id === platId);
      if (!found) {
        setError('Plato no encontrado');
        return;
      }
      
      setPlato(found);
      setFormData({
        number: found.number,
        name: found.name,
        description: found.description || '',
        price: found.price,
        language: found.language || 'es',
        available: found.available ?? true,
        is_spicy: found.is_spicy ?? false,
        is_adult_only: found.is_adult_only ?? false,
        category_id: found.category_id,
      });
      setCategories(categoriesData);
    } catch (err) {
      setError('Error al cargar datos');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token || !plato || !formData.category_id) {
      setError('Completa todos los campos requeridos');
      return;
    }

    setIsSaving(true);
    try {
      await updateProduct(token, {
        ...plato,
        ...formData,
      });
      router.push('/admin/platos');
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
          <div className="inline-block animate-spin rounded-full h-12 w-12 mb-4" style={{ borderBottomColor: 'var(--color-gold)', borderWidth: '2px', borderTopColor: 'transparent', borderRightColor: 'transparent', borderLeftColor: 'transparent' }}></div>
          <p className="font-body" style={{ color: 'var(--color-cream-muted)' }}>Cargando plato...</p>
        </div>
      </div>
    );
  }

  if (error && !plato) {
    return (
      <div className="p-8">
        <Card className="border" style={{ backgroundColor: 'rgba(220, 38, 38, 0.1)', borderColor: 'var(--color-danger)' }}>
          <Card.Content className="flex flex-col gap-4">
            <p className="font-body font-semibold" style={{ color: '#ff9999' }}>⚠️ {error}</p>
            <FormButton
              onClick={() => router.back()}
              variant="primary"
              size="md"
            >
              Volver
            </FormButton>
          </Card.Content>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="font-display text-4xl mb-2" style={{ color: 'var(--color-gold)' }}>
          Editar Plato
        </h1>
        <p className="font-body" style={{ color: 'var(--color-cream-muted)' }}>
          {plato?.name}
        </p>
      </div>

      <Card className="max-w-3xl border" style={{ backgroundColor: 'var(--admin-bg-card)', borderColor: 'var(--admin-border)' }}>
        <Card.Content className="gap-8 p-8">
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
              <FormTextarea
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
                Guardar cambios
              </FormButton>
            </div>
          </form>
        </Card.Content>
      </Card>
    </div>
  );
}
