import {getAdminWorkspaceData} from '@/features/admin/server/admin-data';
import {AdminProductosView} from '@/features/admin/ui/admin-productos-view';

export default async function AdminProductosPage() {
  const {categories, products, openingHours} = await getAdminWorkspaceData();

  return <AdminProductosView categories={categories} products={products} openingHours={openingHours} />;
}