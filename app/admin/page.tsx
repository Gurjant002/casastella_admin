import Link from 'next/link';
import {AdminRouteShell} from '@/features/admin/ui/admin-route-shell';

export default async function AdminHomePage() {
  return (
    <AdminRouteShell title="Panel principal" description="Selecciona un apartado para administrar por página.">
      <main className="grid gap-4 md:grid-cols-3">
        <section className="cs-panel cs-panel-strong cs-panel-hover p-5">
          <p className="cs-kicker">Ruta</p>
          <p className="cs-h3 mt-3">Horario</p>
          <p className="mt-2 text-sm leading-6 text-[var(--color-cream-muted)]">Actualiza los tramos de apertura y cierre por día.</p>
          <Link href="/admin/horario" className="btn-primary mt-6 w-fit">
            Ir a horario
          </Link>
        </section>
        <section className="cs-panel cs-panel-strong cs-panel-hover p-5">
          <p className="cs-kicker">Ruta</p>
          <p className="cs-h3 mt-3">Categorías</p>
          <p className="mt-2 text-sm leading-6 text-[var(--color-cream-muted)]">Gestiona familias, descripciones y disponibilidad editorial.</p>
          <Link href="/admin/categorias" className="btn-primary mt-6 w-fit">
            Ir a categorías
          </Link>
        </section>
        <section className="cs-panel cs-panel-strong cs-panel-hover p-5">
          <p className="cs-kicker">Ruta</p>
          <p className="cs-h3 mt-3">Productos</p>
          <p className="mt-2 text-sm leading-6 text-[var(--color-cream-muted)]">Edita la carta con número, precio, atributos y categoría.</p>
          <Link href="/admin/productos" className="btn-primary mt-6 w-fit">
            Ir a productos
          </Link>
        </section>
      </main>
    </AdminRouteShell>
  );
}