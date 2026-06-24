import {AdminPortal} from '@/components/admin-portal';
import {getCategories, getOpeningHours, getProducts, listReservations} from '@/lib/api';

export default async function Page() {
  const [categoriesResult, productsResult, reservationsResult] = await Promise.allSettled([
    getCategories({lang: 'es', available: true}),
    getProducts({lang: 'es', available: true}),
    listReservations({limit: 4}),
  ]);
  const openingHoursResult = await getOpeningHours().catch(() => []);

  const categories = categoriesResult.status === 'fulfilled' ? categoriesResult.value : [];
  const products = productsResult.status === 'fulfilled' ? productsResult.value : [];
  const reservations = reservationsResult.status === 'fulfilled' ? reservationsResult.value : [];

  return <AdminPortal categories={categories} products={products} reservations={reservations} openingHours={openingHoursResult} />;
}
