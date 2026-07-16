import {getAdminWorkspaceData} from '@/features/admin/server/admin-data';
import {AdminHorarioView} from '@/features/admin/ui/admin-horario-view';

export default async function AdminHorarioPage() {
  const {categories, products, openingHours} = await getAdminWorkspaceData();

  return <AdminHorarioView categories={categories} products={products} openingHours={openingHours} />;
}