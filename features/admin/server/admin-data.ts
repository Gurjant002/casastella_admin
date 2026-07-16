import {getCategories, getOpeningHours, getProducts, listReservations} from '@/lib/api';

export async function getAdminWorkspaceData() {
  const [categoriesResult, productsResult] = await Promise.allSettled([
    getCategories({lang: 'es', available: true}),
    getProducts({lang: 'es', available: true}),
  ]);

  const openingHours = await getOpeningHours().catch(() => []);

  return {
    categories: categoriesResult.status === 'fulfilled' ? categoriesResult.value : [],
    products: productsResult.status === 'fulfilled' ? productsResult.value : [],
    openingHours,
  };
}

export async function getAdminPortalData() {
  const [categoriesResult, productsResult, reservationsResult] = await Promise.allSettled([
    getCategories({lang: 'es', available: true}),
    getProducts({lang: 'es', available: true}),
    listReservations({limit: 4}),
  ]);

  const openingHours = await getOpeningHours().catch(() => []);

  return {
    categories: categoriesResult.status === 'fulfilled' ? categoriesResult.value : [],
    products: productsResult.status === 'fulfilled' ? productsResult.value : [],
    reservations: reservationsResult.status === 'fulfilled' ? reservationsResult.value : [],
    openingHours,
  };
}
