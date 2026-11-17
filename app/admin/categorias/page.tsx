'use client';

import React, { useEffect, useState } from 'react';
import {
  Table,
  Button,
  Card,
} from '@heroui/react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/features/admin/auth/auth-context';
import { getCategories, CategoryModel } from '@/lib/api-client';

export default function CategoriasPage() {
  const router = useRouter();
  const { token } = useAuth();
  const [categories, setCategories] = useState<CategoryModel[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, [token]);

  const loadData = async () => {
    if (!token) return;
    setIsLoading(true);
    try {
      const [activeCategories, inactiveCategories] = await Promise.all([
        getCategories(token, { available: true }),
        getCategories(token, { available: false }),
      ]);

      const allCategories = [...activeCategories];
      for (const category of inactiveCategories) {
        if (!allCategories.find((current) => current.id === category.id)) {
          allCategories.push(category);
        }
      }

      allCategories.sort((a, b) => a.name.localeCompare(b.name));
      setCategories(allCategories);
    } catch (err) {
      setError('Error al cargar categorías');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenCategory = (category?: CategoryModel) => {
    if (category?.id) {
      router.push(`/admin/categorias/${category.id}/editar`);
      return;
    }
    router.push('/admin/categorias/nueva');
  };

  return (
    <div className="p-8">
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="font-display text-4xl mb-2" style={{ color: 'var(--color-gold)' }}>Categorías</h1>
          <p className="font-body" style={{ color: 'var(--color-cream-muted)' }}>Gestiona las categorías del menú</p>
        </div>
        <Button
          onPress={() => handleOpenCategory()}
          className="font-body font-semibold uppercase tracking-wider text-black"
          style={{ backgroundColor: 'var(--color-gold)' }}
        >
          + Nueva Categoría
        </Button>
      </div>

      {error && (
        <Card className="mb-6 border" style={{ backgroundColor: 'rgba(192, 57, 43, 0.1)', borderColor: 'var(--color-danger)' }}>
          <Card.Content>
            <p className="font-body" style={{ color: '#ff9999' }}>{error}</p>
          </Card.Content>
        </Card>
      )}

      {isLoading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 mb-4" style={{ borderBottomColor: 'var(--color-gold)', borderWidth: '2px', borderTopColor: 'transparent', borderRightColor: 'transparent', borderLeftColor: 'transparent' }}></div>
          <p className="font-body" style={{ color: 'var(--color-cream-muted)' }}>Cargando categorías...</p>
        </div>
      ) : (
        <Card className="border" style={{ backgroundColor: 'var(--admin-bg-card)', borderColor: 'var(--admin-border)' }}>
          <Table variant="secondary" className="menu-table">
            <Table.ScrollContainer>
              <Table.Content aria-label="Tabla de categorías" className="font-body">
                <Table.Header>
                  <Table.Column isRowHeader className="font-display">Nombre</Table.Column>
                  <Table.Column isRowHeader className="font-display">Nombre común</Table.Column>
                  <Table.Column isRowHeader className="font-display">Estado</Table.Column>
                  <Table.Column isRowHeader className="font-display">Descripción</Table.Column>
                  <Table.Column isRowHeader className="font-display">Acciones</Table.Column>
                </Table.Header>
                <Table.Body>
                  {categories.length === 0 ? (
                    <Table.Row>
                      <Table.Cell colSpan={5}>
                        <div className="text-center py-12">
                          <p className="font-body" style={{ color: 'var(--color-cream-muted)' }}>No hay categorías registradas</p>
                        </div>
                      </Table.Cell>
                    </Table.Row>
                  ) : categories.map((category) => (
                    <Table.Row key={category.id}>
                      <Table.Cell className="font-semibold" style={{ color: 'var(--color-cream)' }}>{category.name}</Table.Cell>
                      <Table.Cell className="font-body" style={{ color: 'var(--color-cream-muted)' }}>{category.common_name}</Table.Cell>
                      <Table.Cell className="font-body">
                    <span
                      className="inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold"
                      style={{
                        backgroundColor: category.available === false ? 'rgba(220, 38, 38, 0.15)' : 'rgba(34, 197, 94, 0.12)',
                        color: category.available === false ? '#ff9999' : '#86efac',
                        border: `1px solid ${category.available === false ? 'rgba(220, 38, 38, 0.3)' : 'rgba(34, 197, 94, 0.3)'}`,
                      }}
                    >
                      {category.available === false ? 'Desactivada' : 'Activa'}
                    </span>
                      </Table.Cell>
                      <Table.Cell className="font-body text-sm" style={{ color: 'var(--color-cream-muted)', whiteSpace: 'pre-line' }}>
                    {category.description?.substring(0, 80) || '-'}
                      </Table.Cell>
                      <Table.Cell className="font-body">
                    <Button
                      isIconOnly
                      size="sm"
                      style={{ backgroundColor: 'var(--color-gold)', color: 'var(--color-black)' }}
                      onPress={() => handleOpenCategory(category)}
                    >
                      ✏️
                    </Button>
                      </Table.Cell>
                    </Table.Row>
                  ))}
                </Table.Body>
              </Table.Content>
            </Table.ScrollContainer>
          </Table>
        </Card>
      )}
    </div>
  );
}
