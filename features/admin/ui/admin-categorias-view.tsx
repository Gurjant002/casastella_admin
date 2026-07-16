'use client';

import {useEffect, useMemo, useState} from 'react';
import {createCategory, updateCategory, type CategoryModel, type OpeningHoursSchema, type ProductSchema} from '@/lib/api';
import {useAdminSession} from '@/features/admin/auth/use-admin-session';
import {AdminRouteShell} from '@/features/admin/ui/admin-route-shell';
import {AdminMetricsStrip} from '@/features/admin/ui/admin-metrics-strip';

type AdminCategoriasViewProps = {
  categories: CategoryModel[];
  products: ProductSchema[];
  openingHours: OpeningHoursSchema[];
};

function firstCategoryId(categories: CategoryModel[]) {
  return String(categories.find((category) => typeof category.id === 'number')?.id ?? '');
}

export function AdminCategoriasView({categories, products, openingHours}: AdminCategoriasViewProps) {
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
      <section className="cs-panel cs-panel-strong p-6 md:p-8">
        <AdminMetricsStrip categories={categories.length} products={products.length} openingHours={openingHours.length} />
        <div className="mt-6">
          <label className="floating-label" htmlFor="selected-category">Categoría actual</label>
          <select id="selected-category" className="input-luxury" value={selectedCategoryId} onChange={(event) => setSelectedCategoryId(event.target.value)}>
            <option value="" className="bg-(--color-black) text-cs-cream">Selecciona una categoría</option>
            {categories.map((category) => (
              <option key={String(category.id ?? category.common_name)} value={String(category.id ?? '')} className="bg-(--color-black) text-cs-cream">
                {category.common_name}
              </option>
            ))}
          </select>
        </div>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <div>
            <label className="floating-label" htmlFor="category-name">Nombre interno</label>
            <input id="category-name" className="input-luxury" value={categoryForm.name} onChange={(event) => setCategoryForm((current) => ({...current, name: event.target.value}))} />
          </div>
          <div>
            <label className="floating-label" htmlFor="category-common-name">Nombre común</label>
            <input id="category-common-name" className="input-luxury" value={categoryForm.common_name} onChange={(event) => setCategoryForm((current) => ({...current, common_name: event.target.value}))} />
          </div>
        </div>
        <div className="mt-4">
          <label className="floating-label" htmlFor="category-description">Descripción</label>
          <textarea id="category-description" className="input-luxury min-h-32 resize-y pt-4" value={categoryForm.description} onChange={(event) => setCategoryForm((current) => ({...current, description: event.target.value}))} />
        </div>
        <div className="mt-8 flex flex-wrap gap-3">
          <button className="btn-primary" type="button" onClick={() => void handleCreateCategory()}>
            Crear categoría
          </button>
          <button className="btn-secondary" type="button" onClick={() => void handleUpdateCategory()}>
            Actualizar categoría
          </button>
        </div>
        {message ? <p className="mt-4 text-sm leading-6 text-cs-gold">{message}</p> : null}
      </section>
    </AdminRouteShell>
  );
}
