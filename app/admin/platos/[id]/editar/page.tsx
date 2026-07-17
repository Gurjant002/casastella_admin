'use client';

import React, { useEffect, useState } from 'react';
import { Card, CardBody, CardHeader, Button, Input, Select, SelectItem } from '@heroui/react';
import { useRouter, useParams } from 'next/navigation';
import { useAuth } from '@/features/admin/auth/auth-context';
import {
  getProducts,
  updateProduct,
  getCategories,
  ProductSchema,
  CategoryModel,
} from '@/lib/api-client';

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
        <Card className="border" style={{ backgroundColor: 'rgba(192, 57, 43, 0.1)', borderColor: 'var(--color-danger)' }}>
          <CardBody>
            <p className="font-body" style={{ color: '#ff9999' }}>{error}</p>
            <Button
              onPress={() => router.back()}
              className="mt-4 font-body"
              style={{ backgroundColor: 'var(--color-gold)', color: 'var(--color-black)' }}
            >
              Volver
            </Button>
          </CardBody>
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

      <Card className="max-w-2xl border" style={{ backgroundColor: 'var(--admin-bg-card)', borderColor: 'var(--admin-border)' }}>
        <CardBody className="gap-6 p-8">
          {error && (
            <div className="rounded-lg p-4 border" style={{ backgroundColor: 'rgba(192, 57, 43, 0.1)', borderColor: 'var(--color-danger)' }}>
              <p className="font-body" style={{ color: '#ff9999' }}>{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="gap-6 flex flex-col">
            <div className="grid grid-cols-2 gap-6">
              <Input
                isRequired
                label="Número"
                type="number"
                value={String(formData.number)}
                onChange={(e) => setFormData({ ...formData, number: parseInt(e.target.value) || 0 })}
                classNames={{
                  input: 'font-body',
                  label: 'font-body',
                }}
                style={{
                  '--input-bg': 'var(--color-black)',
                  '--input-text': 'var(--color-cream)',
                  '--input-label': 'var(--color-cream-muted)',
                } as React.CSSProperties}
              />
              <Input
                isRequired
                label="Precio"
                type="number"
                step="0.01"
                value={String(formData.price)}
                onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
                classNames={{
                  input: 'font-body',
                  label: 'font-body',
                }}
                style={{
                  '--input-bg': 'var(--color-black)',
                  '--input-text': 'var(--color-cream)',
                  '--input-label': 'var(--color-cream-muted)',
                } as React.CSSProperties}
              />
            </div>

            <Input
              isRequired
              label="Nombre del plato"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              classNames={{
                input: 'font-body',
                label: 'font-body',
              }}
              style={{
                '--input-bg': 'var(--color-black)',
                '--input-text': 'var(--color-cream)',
                '--input-label': 'var(--color-cream-muted)',
              } as React.CSSProperties}
            />

            <Input
              label="Descripción"
              value={formData.description || ''}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              classNames={{
                input: 'font-body',
                label: 'font-body',
              }}
              style={{
                '--input-bg': 'var(--color-black)',
                '--input-text': 'var(--color-cream)',
                '--input-label': 'var(--color-cream-muted)',
              } as React.CSSProperties}
            />

            <Select
              isRequired
              label="Categoría"
              selectedKeys={formData.category_id ? [String(formData.category_id)] : []}
              onChange={(e) =>
                setFormData({ ...formData, category_id: parseInt(e.target.value) || 0 })
              }
              classNames={{
                trigger: 'font-body',
                label: 'font-body',
              }}
              style={{
                '--input-bg': 'var(--color-black)',
                '--input-text': 'var(--color-cream)',
                '--input-label': 'var(--color-cream-muted)',
              } as React.CSSProperties}
            >
              {categories.map((cat) => (
                <SelectItem key={cat.id}>
                  {cat.name}
                </SelectItem>
              ))}
            </Select>

            <div className="border-t" style={{ borderColor: 'var(--admin-border)' }}>
              <p className="font-body font-semibold mt-6 mb-4" style={{ color: 'var(--color-cream)' }}>
                Opciones adicionales
              </p>
              <div className="grid grid-cols-3 gap-6">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.available}
                    onChange={(e) => setFormData({ ...formData, available: e.target.checked })}
                    className="w-5 h-5 cursor-pointer"
                  />
                  <span className="font-body" style={{ color: 'var(--color-cream-muted)' }}>Disponible</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.is_spicy}
                    onChange={(e) => setFormData({ ...formData, is_spicy: e.target.checked })}
                    className="w-5 h-5 cursor-pointer"
                  />
                  <span className="font-body" style={{ color: 'var(--color-cream-muted)' }}>🌶️ Picante</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.is_adult_only}
                    onChange={(e) => setFormData({ ...formData, is_adult_only: e.target.checked })}
                    className="w-5 h-5 cursor-pointer"
                  />
                  <span className="font-body" style={{ color: 'var(--color-cream-muted)' }}>👤 Solo adultos</span>
                </label>
              </div>
            </div>

            <div className="flex gap-4 justify-end border-t pt-6" style={{ borderColor: 'var(--admin-border)' }}>
              <Button
                onPress={() => router.back()}
                className="font-body font-semibold"
                style={{ backgroundColor: 'var(--admin-bg-hover)', color: 'var(--color-cream-muted)' }}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                isLoading={isSaving}
                disabled={isSaving}
                className="font-body font-semibold uppercase tracking-wider text-black"
                style={{ backgroundColor: 'var(--color-gold)' }}
              >
                Guardar cambios
              </Button>
            </div>
          </form>
        </CardBody>
      </Card>
    </div>
  );
}
