'use client';

import {useEffect, useMemo, useState} from 'react';
import {createProduct, updateProduct, type CategoryModel, type OpeningHoursSchema, type ProductSchema} from '@/lib/api';
import {useAdminSession} from '@/features/admin/auth/use-admin-session';
import {AdminRouteShell} from '@/features/admin/ui/admin-route-shell';
import {AdminMetricsStrip} from '@/features/admin/ui/admin-metrics-strip';

type AdminProductosViewProps = {
  categories: CategoryModel[];
  products: ProductSchema[];
  openingHours: OpeningHoursSchema[];
};

function firstProductId(products: ProductSchema[]) {
  return String(products.find((product) => typeof product.id === 'number')?.id ?? '');
}

function firstCategoryId(categories: CategoryModel[]) {
  return String(categories.find((category) => typeof category.id === 'number')?.id ?? '');
}

export function AdminProductosView({categories, products, openingHours}: AdminProductosViewProps) {
  const {token} = useAdminSession();
  const [message, setMessage] = useState('');
  const [selectedProductId, setSelectedProductId] = useState(firstProductId(products));
  const [productForm, setProductForm] = useState({
    number: '',
    name: '',
    description: '',
    price: '',
    language: 'es',
    category_id: firstCategoryId(categories),
    available: true,
    is_spicy: false,
    is_adult_only: false,
  });

  useEffect(() => {
    const selectedProduct = products.find((product) => String(product.id) === selectedProductId);
    if (!selectedProduct) {
      return;
    }

    setProductForm({
      number: String(selectedProduct.number),
      name: selectedProduct.name,
      description: selectedProduct.description ?? '',
      price: String(selectedProduct.price),
      language: selectedProduct.language ?? 'es',
      category_id: String(selectedProduct.category_id),
      available: selectedProduct.available ?? true,
      is_spicy: selectedProduct.is_spicy ?? false,
      is_adult_only: selectedProduct.is_adult_only ?? false,
    });
  }, [products, selectedProductId]);

  const selectedProduct = useMemo(
    () => products.find((product) => String(product.id) === selectedProductId) ?? products[0],
    [products, selectedProductId],
  );

  async function handleCreateProduct() {
    setMessage('');
    try {
      await createProduct(
        {
          number: Number(productForm.number),
          name: productForm.name,
          description: productForm.description || null,
          price: Number(productForm.price),
          language: productForm.language,
          available: productForm.available,
          is_spicy: productForm.is_spicy,
          is_adult_only: productForm.is_adult_only,
          category_id: Number(productForm.category_id),
        },
        token,
      );
      setMessage('Producto creado correctamente.');
    } catch {
      setMessage('No se pudo crear el producto.');
    }
  }

  async function handleUpdateProduct() {
    if (!selectedProduct?.id) {
      setMessage('Selecciona un producto antes de guardar.');
      return;
    }

    setMessage('');
    try {
      await updateProduct(
        {
          id: selectedProduct.id,
          number: Number(productForm.number),
          name: productForm.name,
          description: productForm.description || null,
          price: Number(productForm.price),
          language: productForm.language,
          available: productForm.available,
          is_spicy: productForm.is_spicy,
          is_adult_only: productForm.is_adult_only,
          category_id: Number(productForm.category_id),
        },
        token,
      );
      setMessage('Producto actualizado correctamente.');
    } catch {
      setMessage('No se pudo actualizar el producto.');
    }
  }

  return (
    <AdminRouteShell title="Edición de productos" description="Edición de carta y atributos de producto por ruta.">
      <section className="cs-panel cs-panel-strong p-6 md:p-8">
        <AdminMetricsStrip categories={categories.length} products={products.length} openingHours={openingHours.length} />

        <div className="mt-6">
          <label className="floating-label" htmlFor="selected-product">Producto actual</label>
          <select id="selected-product" className="input-luxury" value={selectedProductId} onChange={(event) => setSelectedProductId(event.target.value)}>
            <option value="" className="bg-(--color-black) text-cs-cream">Selecciona un producto</option>
            {products.map((product) => (
              <option key={String(product.id ?? product.number)} value={String(product.id ?? '')} className="bg-(--color-black) text-cs-cream">
                {product.name}
              </option>
            ))}
          </select>
        </div>

        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <div>
            <label className="floating-label" htmlFor="product-number">Número</label>
            <input id="product-number" className="input-luxury" value={productForm.number} onChange={(event) => setProductForm((current) => ({...current, number: event.target.value}))} />
          </div>
          <div>
            <label className="floating-label" htmlFor="product-price">Precio</label>
            <input id="product-price" className="input-luxury" value={productForm.price} onChange={(event) => setProductForm((current) => ({...current, price: event.target.value}))} />
          </div>
        </div>

        <div className="mt-4">
          <label className="floating-label" htmlFor="product-name">Nombre</label>
          <input id="product-name" className="input-luxury" value={productForm.name} onChange={(event) => setProductForm((current) => ({...current, name: event.target.value}))} />
        </div>

        <div className="mt-4">
          <label className="floating-label" htmlFor="product-description">Descripción</label>
          <textarea id="product-description" className="input-luxury min-h-32 resize-y pt-4" value={productForm.description} onChange={(event) => setProductForm((current) => ({...current, description: event.target.value}))} />
        </div>

        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <div>
            <label className="floating-label" htmlFor="product-category">Categoría</label>
            <select id="product-category" className="input-luxury" value={productForm.category_id} onChange={(event) => setProductForm((current) => ({...current, category_id: event.target.value}))}>
              <option value="" className="bg-(--color-black) text-cs-cream">Selecciona una categoría</option>
              {categories.map((category) => (
                <option key={String(category.id ?? category.common_name)} value={String(category.id ?? '')} className="bg-(--color-black) text-cs-cream">
                  {category.common_name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="floating-label" htmlFor="product-language">Idioma</label>
            <input id="product-language" className="input-luxury" value={productForm.language} onChange={(event) => setProductForm((current) => ({...current, language: event.target.value}))} />
          </div>
        </div>

        <div className="mt-4 grid gap-4 md:grid-cols-3">
          <div>
            <label className="floating-label" htmlFor="product-available">Disponible</label>
            <select id="product-available" className="input-luxury" value={productForm.available ? 'true' : 'false'} onChange={(event) => setProductForm((current) => ({...current, available: event.target.value !== 'false'}))}>
              <option value="true" className="bg-(--color-black) text-cs-cream">true</option>
              <option value="false" className="bg-(--color-black) text-cs-cream">false</option>
            </select>
          </div>
          <div>
            <label className="floating-label" htmlFor="product-spicy">Picante</label>
            <select id="product-spicy" className="input-luxury" value={productForm.is_spicy ? 'true' : 'false'} onChange={(event) => setProductForm((current) => ({...current, is_spicy: event.target.value === 'true'}))}>
              <option value="true" className="bg-(--color-black) text-cs-cream">true</option>
              <option value="false" className="bg-(--color-black) text-cs-cream">false</option>
            </select>
          </div>
          <div>
            <label className="floating-label" htmlFor="product-adult">Solo adultos</label>
            <select id="product-adult" className="input-luxury" value={productForm.is_adult_only ? 'true' : 'false'} onChange={(event) => setProductForm((current) => ({...current, is_adult_only: event.target.value === 'true'}))}>
              <option value="true" className="bg-(--color-black) text-cs-cream">true</option>
              <option value="false" className="bg-(--color-black) text-cs-cream">false</option>
            </select>
          </div>
        </div>

        <div className="mt-8 flex flex-wrap gap-3">
          <button className="btn-primary" type="button" onClick={() => void handleCreateProduct()}>
            Crear producto
          </button>
          <button className="btn-secondary" type="button" onClick={() => void handleUpdateProduct()}>
            Actualizar producto
          </button>
        </div>

        {message ? <p className="mt-4 text-sm leading-6 text-cs-gold">{message}</p> : null}
      </section>
    </AdminRouteShell>
  );
}
