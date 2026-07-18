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
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
  Input,
  Card,
  CardBody,
} from '@heroui/react';
import { useAuth } from '@/features/admin/auth/auth-context';
import { getCategories, createCategory, updateCategory, CategoryModel } from '@/lib/api-client';

export default function CategoriasPage() {
  const { token } = useAuth();
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [categories, setCategories] = useState<CategoryModel[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingCategory, setEditingCategory] = useState<CategoryModel | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    common_name: '',
    description: '',
    language: 'es',
  });

  useEffect(() => {
    loadData();
  }, [token]);

  const loadData = async () => {
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

  const handleOpenModal = (category?: CategoryModel) => {
    if (category) {
      setEditingCategory(category);
      setFormData({
        name: category.name,
        common_name: category.common_name,
        description: category.description || '',
        language: category.language || 'es',
      });
    } else {
      setEditingCategory(null);
      setFormData({
        name: '',
        common_name: '',
        description: '',
        language: 'es',
      });
    }
    onOpen();
  };

  const handleSubmit = async () => {
    if (!token || !formData.name || !formData.common_name) {
      setError('Completa todos los campos requeridos');
      return;
    }

    try {
      if (editingCategory) {
        const updated = await updateCategory(token, editingCategory.id!, {
          ...formData,
          available: editingCategory.available,
        });
        setCategories(categories.map((c) => (c.id === updated.id ? updated : c)));
      } else {
        const created = await createCategory(token, formData);
        setCategories([...categories, created]);
      }
      onOpenChange();
    } catch (err) {
      setError('Error al guardar categoría');
      console.error(err);
    }
  };

  return (
    <div className="p-8">
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="font-display text-4xl mb-2" style={{ color: 'var(--color-gold)' }}>Categorías</h1>
          <p className="font-body" style={{ color: 'var(--color-cream-muted)' }}>Gestiona las categorías del menú</p>
        </div>
        <Button
          onPress={() => handleOpenModal()}
          className="font-body font-semibold uppercase tracking-wider text-black"
          style={{ backgroundColor: 'var(--color-gold)' }}
        >
          + Nueva Categoría
        </Button>
      </div>

      {error && (
        <Card className="mb-6 border" style={{ backgroundColor: 'rgba(192, 57, 43, 0.1)', borderColor: 'var(--color-danger)' }}>
          <CardBody>
            <p className="font-body" style={{ color: '#ff9999' }}>{error}</p>
          </CardBody>
        </Card>
      )}

      {isLoading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 mb-4" style={{ borderBottomColor: 'var(--color-gold)', borderWidth: '2px', borderTopColor: 'transparent', borderRightColor: 'transparent', borderLeftColor: 'transparent' }}></div>
          <p className="font-body" style={{ color: 'var(--color-cream-muted)' }}>Cargando categorías...</p>
        </div>
      ) : (
        <Card className="border" style={{ backgroundColor: 'var(--admin-bg-card)', borderColor: 'var(--admin-border)' }}>
          <Table
            aria-label="Tabla de categorías"
            classNames={{
              table: 'font-body',
              th: 'font-display',
              td: 'font-body',
            }}
          >
            <TableHeader>
              <TableColumn>Nombre</TableColumn>
              <TableColumn>Nombre común</TableColumn>
              <TableColumn>Descripción</TableColumn>
              <TableColumn>Acciones</TableColumn>
            </TableHeader>
            <TableBody
              emptyContent={
                <div className="text-center py-12">
                  <p className="font-body" style={{ color: 'var(--color-cream-muted)' }}>No hay categorías registradas</p>
                </div>
              }
            >
              {categories.map((category) => (
                <TableRow key={category.id}>
                  <TableCell className="font-semibold" style={{ color: 'var(--color-cream)' }}>{category.name}</TableCell>
                  <TableCell style={{ color: 'var(--color-cream-muted)' }}>{category.common_name}</TableCell>
                  <TableCell className="text-sm" style={{ color: 'var(--color-cream-muted)' }}>
                    {category.description?.substring(0, 50) || '-'}
                  </TableCell>
                  <TableCell>
                    <Button
                      isIconOnly
                      size="sm"
                      style={{ backgroundColor: 'var(--color-gold)', color: 'var(--color-black)' }}
                      onPress={() => handleOpenModal(category)}
                    >
                      ✏️
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      )}

      <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="lg">
        <ModalContent style={{ backgroundColor: 'var(--admin-bg-card)' }}>
          <ModalHeader className="font-display text-2xl" style={{ color: 'var(--color-gold)' }}>
            {editingCategory ? 'Editar Categoría' : 'Nueva Categoría'}
          </ModalHeader>
          <ModalBody className="gap-4">
            <Input
              label="Nombre"
              labelPlacement="outside"
              placeholder="Nombre de la categoría"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              classNames={{
                input: 'font-body',
                label: 'font-body font-semibold',
              }}
              style={{
                '--input-bg': 'var(--color-black)',
                '--input-text': 'var(--color-cream)',
                '--input-label': 'var(--color-cream-muted)',
              } as React.CSSProperties}
            />
            <Input
              label="Nombre común"
              labelPlacement="outside"
              placeholder="Identificador interno (ej: pasta_rellena)"
              value={formData.common_name}
              onChange={(e) => setFormData({ ...formData, common_name: e.target.value })}
              classNames={{
                input: 'font-body',
                label: 'font-body font-semibold',
              }}
              style={{
                '--input-bg': 'var(--color-black)',
                '--input-text': 'var(--color-cream)',
                '--input-label': 'var(--color-cream-muted)',
              } as React.CSSProperties}
            />
            <Input
              label="Descripción"
              labelPlacement="outside"
              placeholder="Descripción opcional"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              classNames={{
                input: 'font-body',
                label: 'font-body font-semibold',
              }}
              style={{
                '--input-bg': 'var(--color-black)',
                '--input-text': 'var(--color-cream)',
                '--input-label': 'var(--color-cream-muted)',
              } as React.CSSProperties}
            />
          </ModalBody>
          <ModalFooter>
            <Button color="default" onPress={() => onOpenChange()} className="font-body">
              Cancelar
            </Button>
            <Button
              onPress={handleSubmit}
              className="bg-amber-600 hover:bg-amber-700 text-white font-body font-semibold"
            >
              {editingCategory ? 'Guardar cambios' : 'Crear categoría'}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
}
