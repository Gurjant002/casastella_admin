import {ProductosClient} from '@/app/admin/productos/productos-client';
import {getCategories, getOpeningHours, getProducts} from '@/lib/api';

export default async function AdminProductosPage() {
  const [categoriesResult, productsResult] = await Promise.allSettled([
    getCategories({lang: 'es', available: true}),
    getProducts({lang: 'es', available: true}),
  ]);
  const openingHoursResult = await getOpeningHours().catch(() => []);

  const categories = categoriesResult.status === 'fulfilled' ? categoriesResult.value : [];
  const products = productsResult.status === 'fulfilled' ? productsResult.value : [];

  return (
    <ProductosClient categories={categories} products={products} openingHours={openingHoursResult} />
  );
}