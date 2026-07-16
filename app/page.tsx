import {getAdminPortalData} from '@/features/admin/server/admin-data';
import {AdminPortal} from '@/features/admin/ui/admin-portal';

export default async function Page() {
  const {categories, products, reservations, openingHours} = await getAdminPortalData();

  return <AdminPortal categories={categories} products={products} reservations={reservations} openingHours={openingHours} />;
}
