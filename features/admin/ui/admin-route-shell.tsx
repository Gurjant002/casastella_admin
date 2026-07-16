'use client';

import Link from 'next/link';
import {Button, Card, CardBody} from '@heroui/react';
import {useAdminSession} from '@/features/admin/auth/use-admin-session';

type AdminRouteShellProps = {
  title: string;
  description: string;
  children: React.ReactNode;
};

export function AdminRouteShell({title, description, children}: AdminRouteShellProps) {
  const {token, isHydrated, logout} = useAdminSession();

  if (!isHydrated) {
    return <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8" />;
  }

  if (!token) {
    return (
      <main className="mx-auto flex min-h-screen max-w-7xl items-center justify-center px-4 py-10 sm:px-6 lg:px-8">
        <Card className="premium-card w-full max-w-2xl border border-[rgba(201,168,76,0.18)] bg-transparent">
          <CardBody className="gap-4 p-6 md:p-8">
            <p className="premium-kicker">Sesión requerida</p>
            <h1 className="premium-title text-3xl text-(--cream) md:text-4xl">Debes iniciar sesión para administrar</h1>
            <p className="text-sm leading-7 text-(--muted)">Vuelve al login principal y accede de nuevo.</p>
            <Button as={Link} href="/" className="premium-button-primary w-fit" radius="sm">
              Ir al login
            </Button>
          </CardBody>
        </Card>
      </main>
    );
  }

  return (
    <main className="relative z-10">
      <header className="premium-nav sticky top-0 z-30">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-4 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
          <div className="space-y-1">
            <p className="premium-kicker">Casa Stella</p>
            <h1 className="premium-title text-2xl text-(--cream)">{title}</h1>
          </div>

          <nav aria-label="Secciones del panel" className="flex flex-wrap gap-2 text-xs tracking-[0.22em] uppercase text-(--cream-soft)">
            <Link className="focus-ring rounded-full border border-[rgba(201,168,76,0.16)] px-3 py-2 transition hover:border-[rgba(240,208,128,0.6)] hover:text-(--cream)" href="/admin">
              Resumen
            </Link>
            <Link className="focus-ring rounded-full border border-[rgba(201,168,76,0.16)] px-3 py-2 transition hover:border-[rgba(240,208,128,0.6)] hover:text-(--cream)" href="/admin/horario">
              Horario
            </Link>
            <Link className="focus-ring rounded-full border border-[rgba(201,168,76,0.16)] px-3 py-2 transition hover:border-[rgba(240,208,128,0.6)] hover:text-(--cream)" href="/admin/categorias">
              Categorías
            </Link>
            <Link className="focus-ring rounded-full border border-[rgba(201,168,76,0.16)] px-3 py-2 transition hover:border-[rgba(240,208,128,0.6)] hover:text-(--cream)" href="/admin/productos">
              Productos
            </Link>
          </nav>

          <Button className="premium-button-secondary" radius="sm" variant="bordered" onPress={logout}>
            Cerrar sesión
          </Button>
        </div>
      </header>

      <section className="mx-auto max-w-7xl px-4 pb-2 pt-8 sm:px-6 lg:px-8 lg:pt-10">
        <Card className="premium-card border border-[rgba(201,168,76,0.18)] bg-transparent">
          <CardBody className="gap-4 p-6 md:p-8">
            <p className="premium-kicker">Edición</p>
            <h2 className="premium-title text-3xl text-(--cream) md:text-4xl">{title}</h2>
            <p className="max-w-3xl text-sm leading-7 text-(--muted) md:text-base">{description}</p>
          </CardBody>
        </Card>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">{children}</section>
    </main>
  );
}