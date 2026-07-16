'use client';

import Link from 'next/link';
import type {ReactNode} from 'react';
import {useAdminSession} from '@/features/admin/auth/use-admin-session';

type AdminRouteShellProps = {
  title: string;
  description: string;
  children: ReactNode;
};

export function AdminRouteShell({title, description, children}: AdminRouteShellProps) {
  const {token, isHydrated, logout} = useAdminSession();

  if (!isHydrated) {
    return <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8" />;
  }

  if (!token) {
    return (
      <main className="cs-container flex min-h-screen items-center justify-center py-10">
        <section className="cs-panel cs-panel-strong w-full max-w-2xl p-6 md:p-8">
          <p className="cs-kicker">Sesión requerida</p>
          <h1 className="cs-h2 mt-3">Debes iniciar sesión para administrar</h1>
          <p className="mt-3 text-sm leading-7 text-cs-cream-muted">Vuelve al login principal y accede de nuevo.</p>
          <Link href="/" className="btn-primary mt-6 w-fit">
            Ir al login
          </Link>
        </section>
      </main>
    );
  }

  return (
    <main className="relative z-10 pb-10">
      <header className="sticky top-0 z-30 border-b border-[rgba(201,168,76,0.14)] bg-[rgba(13,13,13,0.9)] backdrop-blur-md">
        <div className="cs-container flex flex-col gap-4 py-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="space-y-1">
            <p className="cs-kicker">Casa Stella</p>
            <h1 className="cs-h3 text-2xl">{title}</h1>
          </div>

          <nav aria-label="Secciones del panel" className="flex flex-wrap gap-2 text-xs uppercase tracking-[0.22em] text-cs-cream-muted">
            <Link className="border border-[rgba(201,168,76,0.16)] px-3 py-2 transition hover:border-[rgba(240,208,128,0.6)] hover:text-cs-cream" href="/admin">
              Resumen
            </Link>
            <Link className="border border-[rgba(201,168,76,0.16)] px-3 py-2 transition hover:border-[rgba(240,208,128,0.6)] hover:text-cs-cream" href="/admin/horario">
              Horario
            </Link>
            <Link className="border border-[rgba(201,168,76,0.16)] px-3 py-2 transition hover:border-[rgba(240,208,128,0.6)] hover:text-cs-cream" href="/admin/categorias">
              Categorías
            </Link>
            <Link className="border border-[rgba(201,168,76,0.16)] px-3 py-2 transition hover:border-[rgba(240,208,128,0.6)] hover:text-cs-cream" href="/admin/productos">
              Productos
            </Link>
          </nav>

          <button className="btn-secondary" type="button" onClick={logout}>
            Cerrar sesión
          </button>
        </div>
      </header>

      <section className="cs-container pb-2 pt-8 lg:pt-10">
        <div className="cs-panel cs-panel-strong cs-hero-glow p-6 md:p-8">
          <p className="cs-kicker">Edición</p>
          <h2 className="cs-h2 mt-3">{title}</h2>
          <p className="mt-3 max-w-3xl text-sm leading-7 text-cs-cream-muted md:text-base">{description}</p>
        </div>
      </section>

      <section className="cs-container py-4">{children}</section>
    </main>
  );
}