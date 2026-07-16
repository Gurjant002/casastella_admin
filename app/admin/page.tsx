import Link from 'next/link';
import {Button, Card, CardBody} from '@heroui/react';
import {AdminRouteShell} from '@/features/admin/ui/admin-route-shell';

export default async function AdminHomePage() {
  return (
    <AdminRouteShell title="Panel principal" description="Selecciona un apartado para administrar por página.">
      <main className="mx-auto max-w-7xl px-0 py-0">
        <Card className="premium-card border border-[rgba(201,168,76,0.18)] bg-transparent">
          <CardBody className="gap-6 p-6 md:p-8">
            <div className="grid gap-4 md:grid-cols-3">
              <Card className="premium-card-quiet border border-[rgba(201,168,76,0.12)] bg-transparent">
                <CardBody className="gap-3 p-5">
                  <p className="premium-kicker">Ruta</p>
                  <p className="premium-title text-2xl text-(--cream)">Horario</p>
                  <Button as={Link} href="/admin/horario" className="premium-button-primary w-fit" radius="sm">
                    Ir a horario
                  </Button>
                </CardBody>
              </Card>
              <Card className="premium-card-quiet border border-[rgba(201,168,76,0.12)] bg-transparent">
                <CardBody className="gap-3 p-5">
                  <p className="premium-kicker">Ruta</p>
                  <p className="premium-title text-2xl text-(--cream)">Categorías</p>
                  <Button as={Link} href="/admin/categorias" className="premium-button-primary w-fit" radius="sm">
                    Ir a categorías
                  </Button>
                </CardBody>
              </Card>
              <Card className="premium-card-quiet border border-[rgba(201,168,76,0.12)] bg-transparent">
                <CardBody className="gap-3 p-5">
                  <p className="premium-kicker">Ruta</p>
                  <p className="premium-title text-2xl text-(--cream)">Productos</p>
                  <Button as={Link} href="/admin/productos" className="premium-button-primary w-fit" radius="sm">
                    Ir a productos
                  </Button>
                </CardBody>
              </Card>
            </div>
          </CardBody>
        </Card>
      </main>
    </AdminRouteShell>
  );
}