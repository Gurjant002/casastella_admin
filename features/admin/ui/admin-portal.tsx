'use client';

import {useEffect, useMemo} from 'react';
import Link from 'next/link';
import {useRouter} from 'next/navigation';
import {useAdminSession} from '@/features/admin/auth/use-admin-session';
import type {AdminPortalProps} from '@/features/admin/types';

function PortalStats({categories, products, reservations}: Pick<AdminPortalProps, 'categories' | 'products' | 'reservations'>) {
  const stats = useMemo(
    () => [
      {label: 'Categorías', value: categories.length, hint: 'Gestionar familias y subfamilias'},
      {label: 'Productos', value: products.length, hint: 'Editar carta y disponibilidad'},
      {label: 'Reservas', value: reservations.length, hint: 'Visión rápida del servicio'},
    ],
    [categories.length, products.length, reservations.length],
  );

  return (
    <div className="grid gap-4 md:grid-cols-3">
      {stats.map((item) => (
        <article key={item.label} className="cs-panel cs-panel-strong cs-panel-hover p-5">
          <p className="cs-kicker">{item.label}</p>
          <p className="cs-h3 mt-2 text-3xl">{item.value}</p>
          <p className="mt-2 text-sm leading-6 text-[var(--color-cream-muted)]">{item.hint}</p>
        </article>
      ))}
    </div>
  );
}

export function AdminPortal({categories, products, reservations, openingHours}: AdminPortalProps) {
  const router = useRouter();
  const {token, isHydrated, username, setUsername, password, setPassword, errorMessage, loading, login} = useAdminSession();

  useEffect(() => {
    if (token) {
      router.replace('/admin');
    }
  }, [router, token]);

  if (!isHydrated) {
    return <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8" />;
  }

  if (token) {
    return (
      <main className="cs-container flex min-h-screen items-center justify-center py-10">
        <section className="cs-panel cs-panel-strong w-full max-w-2xl p-6 md:p-8">
          <p className="cs-kicker">Sesión detectada</p>
          <h1 className="cs-h2 mt-3">Redirigiendo al panel principal</h1>
          <p className="mt-3 text-sm leading-7 text-cs-cream-muted">Si no redirige automáticamente, puedes entrar manualmente.</p>
          <Link href="/admin" className="btn-primary mt-6 w-fit">
            Ir a /admin
          </Link>
        </section>
      </main>
    );
  }

  return (
    <main className="cs-container flex min-h-screen items-center justify-center py-10">
      <section className="cs-panel cs-panel-strong cs-hero-glow w-full max-w-5xl overflow-hidden p-6 md:p-8">
        <div className="grid gap-8 md:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-5">
            <p className="cs-kicker">Casa Stella Admin</p>
            <h1 className="cs-h1 max-w-3xl">Acceso privado al restaurante</h1>
            <p className="max-w-xl text-sm leading-7 text-cs-cream-muted md:text-base">
              Inicia sesión para entrar a las rutas de administración por página.
            </p>
            <PortalStats categories={categories} products={products} reservations={reservations} />
            <div className="flex flex-wrap gap-3 text-[0.72rem] uppercase tracking-[0.22em] text-cs-gold">
              <span className="border border-[rgba(201,168,76,0.2)] px-3 py-1">/admin/horario</span>
              <span className="border border-[rgba(201,168,76,0.2)] px-3 py-1">/admin/categorias</span>
              <span className="border border-[rgba(201,168,76,0.2)] px-3 py-1">/admin/productos</span>
              <span className="border border-[rgba(201,168,76,0.2)] px-3 py-1">{openingHours.length} tramos</span>
            </div>
          </div>

          <section className="cs-panel cs-panel-soft p-5 md:p-6">
            <div className="space-y-4">
              <div>
                <label className="floating-label" htmlFor="portal-username">Username</label>
                <input id="portal-username" className="input-luxury" value={username} onChange={(event) => setUsername(event.target.value)} />
              </div>
              <div>
                <label className="floating-label" htmlFor="portal-password">Contraseña</label>
                <input id="portal-password" className="input-luxury" type="password" value={password} onChange={(event) => setPassword(event.target.value)} />
              </div>
              <button className="btn-primary mt-2 w-full justify-center disabled:opacity-35" type="button" disabled={loading} onClick={() => void login()}>
                Entrar
              </button>
              {errorMessage ? <p className="text-sm leading-6 text-cs-gold">{errorMessage}</p> : null}
            </div>
          </section>
        </div>
      </section>
    </main>
  );
}
