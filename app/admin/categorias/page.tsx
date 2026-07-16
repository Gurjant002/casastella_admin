import {getAdminWorkspaceData} from '@/features/admin/server/admin-data';
import {AdminCategoriasView} from '@/features/admin/ui/admin-categorias-view';

export default async function AdminCategoriasPage() {
  const {categories, products, openingHours} = await getAdminWorkspaceData();

  return <AdminCategoriasView categories={categories} products={products} openingHours={openingHours} />;
}