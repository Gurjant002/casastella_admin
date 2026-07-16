'use client';

import {useEffect, useMemo, useState} from 'react';
import {Button, Card, CardBody, Select, SelectItem, Input, Textarea} from '@heroui/react';
import {createProduct, updateProduct, type CategoryModel, type OpeningHoursSchema, type ProductSchema} from '@/lib/api';
import {useAdminSession} from '@/features/admin/auth/use-admin-session';
import {AdminRouteShell} from '@/features/admin/ui/admin-route-shell';

type ProductosClientProps = {
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

export function ProductosClient({categories, products, openingHours}: ProductosClientProps) {
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
    <AdminRouteShell title="Edición de productos" description="Lógica de productos separada en su ruta dedicada.">
      <Card className="premium-card border border-[rgba(201,168,76,0.18)] bg-transparent">
        <CardBody className="gap-5 p-6 md:p-8">
          <div className="flex gap-3">
            <span className="premium-kicker">{products.length} productos</span>
            <span className="premium-kicker">{categories.length} categorías</span>
            <span className="premium-kicker">{openingHours.length} horarios</span>
          </div>
          <Select label="Producto actual" labelPlacement="outside" selectedKeys={selectedProductId ? [selectedProductId] : []} onSelectionChange={(keys) => setSelectedProductId(String(Array.from(keys)[0] ?? ''))} classNames={{trigger: 'premium-input', label: 'text-[var(--cream-soft)]'}}>
            {products.map((product) => (
              <SelectItem key={String(product.id ?? product.number)}>{product.name}</SelectItem>
            ))}
          </Select>
          <div className="grid gap-4 md:grid-cols-2">
            <Input label="Número" labelPlacement="outside" value={productForm.number} onValueChange={(value) => setProductForm((current) => ({...current, number: value}))} classNames={{inputWrapper: 'premium-input', label: 'text-[var(--cream-soft)]'}} />
            <Input label="Precio" labelPlacement="outside" value={productForm.price} onValueChange={(value) => setProductForm((current) => ({...current, price: value}))} classNames={{inputWrapper: 'premium-input', label: 'text-[var(--cream-soft)]'}} />
          </div>
          <Input label="Nombre" labelPlacement="outside" value={productForm.name} onValueChange={(value) => setProductForm((current) => ({...current, name: value}))} classNames={{inputWrapper: 'premium-input', label: 'text-[var(--cream-soft)]'}} />
          <Textarea label="Descripción" labelPlacement="outside" value={productForm.description} onValueChange={(value) => setProductForm((current) => ({...current, description: value}))} minRows={3} classNames={{inputWrapper: 'premium-input', label: 'text-[var(--cream-soft)]', input: 'premium-textarea'}} />
          <div className="grid gap-4 md:grid-cols-2">
            <Select label="Categoría" labelPlacement="outside" selectedKeys={productForm.category_id ? [productForm.category_id] : []} onSelectionChange={(keys) => setProductForm((current) => ({...current, category_id: String(Array.from(keys)[0] ?? '')}))} classNames={{trigger: 'premium-input', label: 'text-[var(--cream-soft)]'}}>
              {categories.map((category) => (
                <SelectItem key={String(category.id ?? category.common_name)}>{category.common_name}</SelectItem>
              ))}
            </Select>
            <Input label="Idioma" labelPlacement="outside" value={productForm.language} onValueChange={(value) => setProductForm((current) => ({...current, language: value}))} classNames={{inputWrapper: 'premium-input', label: 'text-[var(--cream-soft)]'}} />
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            <Input label="Disponible" labelPlacement="outside" value={productForm.available ? 'true' : 'false'} onValueChange={(value) => setProductForm((current) => ({...current, available: value !== 'false'}))} classNames={{inputWrapper: 'premium-input', label: 'text-[var(--cream-soft)]'}} />
            <Input label="Picante" labelPlacement="outside" value={productForm.is_spicy ? 'true' : 'false'} onValueChange={(value) => setProductForm((current) => ({...current, is_spicy: value === 'true'}))} classNames={{inputWrapper: 'premium-input', label: 'text-[var(--cream-soft)]'}} />
            <Input label="Solo adultos" labelPlacement="outside" value={productForm.is_adult_only ? 'true' : 'false'} onValueChange={(value) => setProductForm((current) => ({...current, is_adult_only: value === 'true'}))} classNames={{inputWrapper: 'premium-input', label: 'text-[var(--cream-soft)]'}} />
          </div>
          <div className="flex flex-wrap gap-3">
            <Button className="premium-button-primary" radius="sm" onPress={() => void handleCreateProduct()}>
              Crear producto
            </Button>
            <Button className="premium-button-secondary" radius="sm" variant="bordered" onPress={() => void handleUpdateProduct()}>
              Actualizar producto
            </Button>
          </div>
          {message ? <p className="text-sm leading-6 text-(--gold-hover)">{message}</p> : null}
        </CardBody>
      </Card>
    </AdminRouteShell>
  );
}