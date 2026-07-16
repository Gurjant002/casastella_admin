'use client';

import {useEffect, useMemo} from 'react';
import Link from 'next/link';
import {useRouter} from 'next/navigation';
import {Button, Card, CardBody, Chip, Input} from '@heroui/react';
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
        <Card key={item.label} className="premium-card border border-[rgba(201,168,76,0.18)] bg-transparent">
          <CardBody className="gap-2 p-5">
            <p className="premium-kicker">{item.label}</p>
            <p className="premium-title text-3xl text-(--cream)">{item.value}</p>
            <p className="text-sm leading-6 text-(--muted)">{item.hint}</p>
          </CardBody>
        </Card>
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
      <main className="mx-auto flex min-h-screen max-w-7xl items-center justify-center px-4 py-10 sm:px-6 lg:px-8">
        <Card className="premium-card w-full max-w-2xl border border-[rgba(201,168,76,0.18)] bg-transparent">
          <CardBody className="gap-4 p-6 md:p-8">
            <p className="premium-kicker">Sesión detectada</p>
            <h1 className="premium-title text-3xl text-(--cream) md:text-4xl">Redirigiendo al panel principal</h1>
            <p className="text-sm leading-7 text-(--muted)">Si no redirige automáticamente, puedes entrar manualmente.</p>
            <Button as={Link} href="/admin" className="premium-button-primary w-fit" radius="sm">
              Ir a /admin
            </Button>
          </CardBody>
        </Card>
      </main>
    );
  }

  return (
    <main className="mx-auto flex min-h-screen max-w-7xl items-center justify-center px-4 py-10 sm:px-6 lg:px-8">
      <Card className="premium-card w-full max-w-4xl border border-[rgba(201,168,76,0.18)] bg-transparent">
        <CardBody className="grid gap-8 p-6 md:grid-cols-[1.1fr_0.9fr] md:p-8">
          <div className="space-y-5">
            <p className="premium-kicker">Casa Stella Admin</p>
            <h1 className="premium-title text-4xl text-(--cream) md:text-6xl">Acceso privado al restaurante</h1>
            <p className="max-w-xl text-sm leading-7 text-(--muted) md:text-base">
              Inicia sesión para entrar a las rutas de administración por página.
            </p>
            <PortalStats categories={categories} products={products} reservations={reservations} />
            <div className="flex flex-wrap gap-3">
              <Chip className="premium-chip border-0 text-[0.72rem] uppercase tracking-[0.22em]" variant="flat">
                /admin/horario
              </Chip>
              <Chip className="premium-chip border-0 text-[0.72rem] uppercase tracking-[0.22em]" variant="flat">
                /admin/categorias
              </Chip>
              <Chip className="premium-chip border-0 text-[0.72rem] uppercase tracking-[0.22em]" variant="flat">
                /admin/productos
              </Chip>
            </div>
          </div>

          <Card className="premium-card-quiet border border-[rgba(201,168,76,0.12)] bg-transparent">
            <CardBody className="gap-4 p-5">
              <Input label="Username" labelPlacement="outside" value={username} onValueChange={setUsername} classNames={{inputWrapper: 'premium-input', label: 'text-[var(--cream-soft)]'}} />
              <Input label="Contraseña" labelPlacement="outside" type="password" value={password} onValueChange={setPassword} classNames={{inputWrapper: 'premium-input', label: 'text-[var(--cream-soft)]'}} />
              <Button className="premium-button-primary mt-2" radius="sm" isLoading={loading} onPress={() => void login()}>
                Entrar
              </Button>
              {errorMessage ? <p className="text-sm leading-6 text-(--gold-hover)">{errorMessage}</p> : null}
            </CardBody>
          </Card>
        </CardBody>
      </Card>
    </main>
  );
}
