'use client';

import React, { useEffect, useState } from 'react';
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Button,
  Chip,
  Card,
  CardBody,
  CardHeader,
} from '@heroui/react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/features/admin/auth/auth-context';
import {
  getProducts,
  updateProduct,
  getCategories,
  ProductSchema,
  CategoryModel,
} from '@/lib/api-client';

export default function PlatosPage() {
  const router = useRouter();
  const { token } = useAuth();
  const [products, setProducts] = useState<ProductSchema[]>([]);
  const [categories, setCategories] = useState<CategoryModel[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);

  useEffect(() => {
    loadData();
  }, [token]);

  const loadData = async () => {
    if (!token) return;
    setIsLoading(true);
    try {
      const [productsData, categoriesData] = await Promise.all([
        getProducts(token),
        getCategories(token),
      ]);
      setProducts(productsData);
      setCategories(categoriesData);
    } catch (err) {
      setError('Error al cargar datos');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenModal = (product?: ProductSchema) => {
    if (product) {
      router.push(`/admin/platos/${product.id}/editar`);
    } else {
      router.push('/admin/platos/nuevo');
    }
  };

  const handleSubmit = async () => {
    // Esta función ya no se necesita
  };

  const toggleAvailability = async (product: ProductSchema) => {
    if (!token) return;
    try {
      const updated = await updateProduct(token, {
        ...product,
        available: !product.available,
      });
      setProducts(products.map((p) => (p.id === updated.id ? updated : p)));
    } catch (err) {
      setError('Error al actualizar disponibilidad');
      console.error(err);
    }
  };

  // Filtrar productos por categoría
  const filteredProducts = selectedCategoryId
    ? products.filter((p) => p.category_id === selectedCategoryId)
    : products;

  return (
    <div className="p-8">
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="font-display text-4xl mb-2" style={{ color: 'var(--color-gold)' }}>Gestión de Platos</h1>
          <p className="font-body" style={{ color: 'var(--color-cream-muted)' }}>Crea, edita y gestiona los platos del menú</p>
        </div>
        <Button
          onPress={() => handleOpenModal()}
          className="font-body font-semibold uppercase tracking-wider text-black"
          style={{ backgroundColor: 'var(--color-gold)' }}
        >
          + Nuevo Plato
        </Button>
      </div>

      {error && (
        <Card className="mb-6 border" style={{ backgroundColor: 'rgba(192, 57, 43, 0.1)', borderColor: 'var(--color-danger)' }}>
          <CardBody>
            <p className="font-body" style={{ color: '#ff9999' }}>{error}</p>
          </CardBody>
        </Card>
      )}

      {!isLoading && categories.length > 0 && (
        <Card className="mb-6 border" style={{ backgroundColor: 'var(--admin-bg-card)', borderColor: 'var(--admin-border)' }}>
          <CardBody className="py-4">
            <div className="flex items-center gap-3 flex-wrap">
              <p className="font-body font-semibold" style={{ color: 'var(--color-cream)' }}>Filtrar por categoría:</p>
              <button
                onClick={() => setSelectedCategoryId(null)}
                className="px-4 py-2 rounded-lg font-body text-sm font-semibold transition-colors"
                style={{
                  backgroundColor: selectedCategoryId === null ? 'var(--color-gold)' : 'var(--admin-bg-hover)',
                  color: selectedCategoryId === null ? 'var(--color-black)' : 'var(--color-cream-muted)',
                }}
              >
                Todas ({products.length})
              </button>
              {categories.map((cat) => {
                const count = products.filter((p) => p.category_id === cat.id).length;
                return (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategoryId(cat.id!)}
                    className="px-4 py-2 rounded-lg font-body text-sm font-semibold transition-colors"
                    style={{
                      backgroundColor: selectedCategoryId === cat.id ? 'var(--color-gold)' : 'var(--admin-bg-hover)',
                      color: selectedCategoryId === cat.id ? 'var(--color-black)' : 'var(--color-cream-muted)',
                    }}
                  >
                    {cat.name} ({count})
                  </button>
                );
              })}
            </div>
          </CardBody>
        </Card>
      )}

      {isLoading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 mb-4" style={{ borderBottomColor: 'var(--color-gold)', borderWidth: '2px', borderTopColor: 'transparent', borderRightColor: 'transparent', borderLeftColor: 'transparent' }}></div>
          <p className="font-body" style={{ color: 'var(--color-cream-muted)' }}>Cargando platos...</p>
        </div>
      ) : (
        <Card className="border" style={{ backgroundColor: 'var(--admin-bg-card)', borderColor: 'var(--admin-border)' }}>
          <Table
            aria-label="Tabla de platos"
            classNames={{
              table: 'font-body',
              th: 'font-display',
              td: 'font-body',
            }}
          >
            <TableHeader>
              <TableColumn>Nº</TableColumn>
              <TableColumn>Nombre</TableColumn>
              <TableColumn>Categoría</TableColumn>
              <TableColumn>Precio</TableColumn>
              <TableColumn>Estado</TableColumn>
              <TableColumn>Acciones</TableColumn>
            </TableHeader>
            <TableBody
              emptyContent={
                <div className="text-center py-12">
                  <p className="font-body" style={{ color: 'var(--color-cream-muted)' }}>
                    {selectedCategoryId
                      ? 'No hay platos en esta categoría'
                      : 'No hay platos registrados'}
                  </p>
                </div>
              }
            >
              {filteredProducts.map((product) => (
                <TableRow key={product.id}>
                  <TableCell style={{ color: 'var(--color-cream-muted)' }}>{product.number}</TableCell>
                  <TableCell>
                    <div>
                      <p className="font-semibold" style={{ color: 'var(--color-cream)' }}>{product.name}</p>
                      {product.description && (
                        <p className="text-xs" style={{ color: 'var(--color-cream-muted)' }}>{product.description.substring(0, 50)}...</p>
                      )}
                    </div>
                  </TableCell>
                  <TableCell style={{ color: 'var(--color-cream-muted)' }}>{product.category?.name}</TableCell>
                  <TableCell className="font-semibold" style={{ color: 'var(--color-gold)' }}>${product.price.toFixed(2)}</TableCell>
                  <TableCell>
                    <Chip
                      startContent={product.available ? '✓' : '✗'}
                      className={`${
                        product.available
                          ? 'bg-green-600/30 text-green-200'
                          : 'bg-red-600/30 text-red-200'
                      } font-body`}
                    >
                      {product.available ? 'Disponible' : 'No disponible'}
                    </Chip>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        isIconOnly
                        size="sm"
                        style={{ backgroundColor: 'var(--color-gold)', color: 'var(--color-black)' }}
                        onPress={() => handleOpenModal(product)}
                      >
                        ✏️
                      </Button>
                      <Button
                        isIconOnly
                        size="sm"
                        style={{
                          backgroundColor: product.available ? 'rgba(192, 57, 43, 0.5)' : 'rgba(22, 163, 74, 0.5)',
                          color: product.available ? '#fca5a5' : '#86efac',
                        }}
                        onPress={() => toggleAvailability(product)}
                      >
                        {product.available ? '🚫' : '✓'}
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      )}
    </div>
  );
}
