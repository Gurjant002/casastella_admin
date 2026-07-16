'use client';

import {useEffect, useMemo, useState} from 'react';
import {Button, Card, CardBody, Select, SelectItem, Input, Textarea} from '@heroui/react';
import {createCategory, updateCategory, type CategoryModel, type OpeningHoursSchema, type ProductSchema} from '@/lib/api';
import {useAdminSession} from '@/features/admin/auth/use-admin-session';
import {AdminRouteShell} from '@/features/admin/ui/admin-route-shell';

type CategoriasClientProps = {
  categories: CategoryModel[];
  products: ProductSchema[];
  openingHours: OpeningHoursSchema[];
};

function firstCategoryId(categories: CategoryModel[]) {
  return String(categories.find((category) => typeof category.id === 'number')?.id ?? '');
}

export function CategoriasClient({categories, products, openingHours}: CategoriasClientProps) {
  const {token} = useAdminSession();
  const [message, setMessage] = useState('');
  const [selectedCategoryId, setSelectedCategoryId] = useState(firstCategoryId(categories));
  const [categoryForm, setCategoryForm] = useState({
    name: '',
    common_name: '',
    language: 'es',
    description: '',
    available: true,
  });

  useEffect(() => {
    const selectedCategory = categories.find((category) => String(category.id) === selectedCategoryId);
    if (!selectedCategory) {
      return;
    }

    setCategoryForm({
      name: selectedCategory.name,
      common_name: selectedCategory.common_name,
      language: selectedCategory.language ?? 'es',
      description: selectedCategory.description ?? '',
      available: selectedCategory.available ?? true,
    });
  }, [categories, selectedCategoryId]);

  const selectedCategory = useMemo(
    () => categories.find((category) => String(category.id) === selectedCategoryId) ?? categories[0],
    [categories, selectedCategoryId],
  );

  async function handleCreateCategory() {
    setMessage('');
    try {
      await createCategory(
        {
          ...categoryForm,
          description: categoryForm.description || null,
        },
        token,
      );
      setMessage('Categoría creada correctamente.');
    } catch {
      setMessage('No se pudo crear la categoría.');
    }
  }

  async function handleUpdateCategory() {
    if (!selectedCategory?.id) {
      setMessage('Selecciona una categoría antes de guardar.');
      return;
    }

    setMessage('');
    try {
      await updateCategory(
        {
          id: selectedCategory.id,
          name: categoryForm.name,
          common_name: categoryForm.common_name,
          language: categoryForm.language,
          description: categoryForm.description || null,
          available: categoryForm.available,
          parent_id: selectedCategory.parent_id ?? null,
        },
        token,
      );
      setMessage('Categoría actualizada correctamente.');
    } catch {
      setMessage('No se pudo actualizar la categoría.');
    }
  }

  return (
    <AdminRouteShell title="Edición de categorías" description="Lógica de categorías aislada en esta ruta.">
      <Card className="premium-card border border-[rgba(201,168,76,0.18)] bg-transparent">
        <CardBody className="gap-5 p-6 md:p-8">
          <div className="flex gap-3">
            <span className="premium-kicker">{categories.length} categorías</span>
            <span className="premium-kicker">{products.length} productos</span>
            <span className="premium-kicker">{openingHours.length} horarios</span>
          </div>
          <Select label="Categoría actual" labelPlacement="outside" selectedKeys={selectedCategoryId ? [selectedCategoryId] : []} onSelectionChange={(keys) => setSelectedCategoryId(String(Array.from(keys)[0] ?? ''))} classNames={{trigger: 'premium-input', label: 'text-[var(--cream-soft)]'}}>
            {categories.map((category) => (
              <SelectItem key={String(category.id ?? category.common_name)}>{category.common_name}</SelectItem>
            ))}
          </Select>
          <Input label="Nombre interno" labelPlacement="outside" value={categoryForm.name} onValueChange={(value) => setCategoryForm((current) => ({...current, name: value}))} classNames={{inputWrapper: 'premium-input', label: 'text-[var(--cream-soft)]'}} />
          <Input label="Nombre común" labelPlacement="outside" value={categoryForm.common_name} onValueChange={(value) => setCategoryForm((current) => ({...current, common_name: value}))} classNames={{inputWrapper: 'premium-input', label: 'text-[var(--cream-soft)]'}} />
          <Textarea label="Descripción" labelPlacement="outside" value={categoryForm.description} onValueChange={(value) => setCategoryForm((current) => ({...current, description: value}))} minRows={3} classNames={{inputWrapper: 'premium-input', label: 'text-[var(--cream-soft)]', input: 'premium-textarea'}} />
          <div className="flex flex-wrap gap-3">
            <Button className="premium-button-primary" radius="sm" onPress={() => void handleCreateCategory()}>
              Crear categoría
            </Button>
            <Button className="premium-button-secondary" radius="sm" variant="bordered" onPress={() => void handleUpdateCategory()}>
              Actualizar categoría
            </Button>
          </div>
          {message ? <p className="text-sm leading-6 text-(--gold-hover)">{message}</p> : null}
        </CardBody>
      </Card>
    </AdminRouteShell>
  );
}