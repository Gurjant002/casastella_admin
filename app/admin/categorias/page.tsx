import {CategoriasClient} from '@/app/admin/categorias/categorias-client';
import {getCategories, getOpeningHours, getProducts} from '@/lib/api';

export default async function AdminCategoriasPage() {
  const [categoriesResult, productsResult] = await Promise.allSettled([
    getCategories({lang: 'es', available: true}),
    getProducts({lang: 'es', available: true}),
  ]);
  const openingHoursResult = await getOpeningHours().catch(() => []);

  const categories = categoriesResult.status === 'fulfilled' ? categoriesResult.value : [];
  const products = productsResult.status === 'fulfilled' ? productsResult.value : [];

  return (
    <CategoriasClient categories={categories} products={products} openingHours={openingHoursResult} />
  );
}