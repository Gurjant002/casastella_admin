'use client';

import {useEffect, useMemo, useState} from 'react';
import {Button, Card, CardBody, Chip, Input} from '@heroui/react';
import {ApiError, loginAdmin, type CategoryModel, type OpeningHoursSchema, type ProductSchema, type ReservationSchema} from '@/lib/api';
import {AdminWorkspace} from '@/components/admin-workspace';

type AdminPortalProps = {
  categories: CategoryModel[];
  products: ProductSchema[];
  reservations: ReservationSchema[];
  openingHours: OpeningHoursSchema[];
};

function readStoredToken() {
  if (typeof window === 'undefined') {
    return '';
  }

  return window.localStorage.getItem('casastella-admin-token') ?? '';
}

function storeToken(token: string) {
  if (typeof window === 'undefined') {
    return;
  }

  if (token) {
    window.localStorage.setItem('casastella-admin-token', token);
  } else {
    window.localStorage.removeItem('casastella-admin-token');
  }
}

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
  const [token, setToken] = useState('');
  const [username, setEmail] = useState('admin@casastella.com');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setToken(readStoredToken());
  }, []);

  async function handleLogin() {
    setErrorMessage('');
    setLoading(true);

    try {
      const response = await loginAdmin({username, password});
      setToken(response.access_token);
      storeToken(response.access_token);
    } catch (error) {
      if (error instanceof ApiError) {
        setErrorMessage(`API ${error.status}: ${error.message}`);
      } else {
        setErrorMessage('No se pudo iniciar sesión.');
      }
    } finally {
      setLoading(false);
    }
  }

  function handleLogout() {
    setToken('');
    storeToken('');
  }

  if (!token) {
    return (
      <main className="mx-auto flex min-h-screen max-w-7xl items-center justify-center px-4 py-10 sm:px-6 lg:px-8">
        <Card className="premium-card w-full max-w-4xl border border-[rgba(201,168,76,0.18)] bg-transparent">
          <CardBody className="grid gap-8 p-6 md:grid-cols-[1.1fr_0.9fr] md:p-8">
            <div className="space-y-5">
              <p className="premium-kicker">Casa Stella Admin</p>
              <h1 className="premium-title text-4xl text-(--cream) md:text-6xl">Acceso privado al restaurante</h1>
              <p className="max-w-xl text-sm leading-7 text-(--muted) md:text-base">
                Inicia sesión para editar la carta, cambiar el horario y administrar las categorías de productos.
              </p>
              <div className="flex flex-wrap gap-3">
                <Chip className="premium-chip border-0 text-[0.72rem] uppercase tracking-[0.22em]" variant="flat">
                  Carta
                </Chip>
                <Chip className="premium-chip border-0 text-[0.72rem] uppercase tracking-[0.22em]" variant="flat">
                  Horario
                </Chip>
                <Chip className="premium-chip border-0 text-[0.72rem] uppercase tracking-[0.22em]" variant="flat">
                  Categorías
                </Chip>
              </div>
            </div>

            <Card className="premium-card-quiet border border-[rgba(201,168,76,0.12)] bg-transparent">
              <CardBody className="gap-4 p-5">
                <Input label="Username" labelPlacement="outside" value={username} onValueChange={setEmail} classNames={{inputWrapper: 'premium-input', label: 'text-[var(--cream-soft)]'}} />
                <Input label="Contraseña" labelPlacement="outside" type="password" value={password} onValueChange={setPassword} classNames={{inputWrapper: 'premium-input', label: 'text-[var(--cream-soft)]'}} />
                <Button className="premium-button-primary mt-2" radius="sm" isLoading={loading} onPress={() => void handleLogin()}>
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

  return (
    <main className="relative z-10">
      <header className="premium-nav sticky top-0 z-30">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-4 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
          <div className="space-y-1">
            <p className="premium-kicker">Casa Stella</p>
            <h1 className="premium-title text-2xl text-(--cream)">Panel principal</h1>
          </div>

          <nav aria-label="Secciones del panel" className="flex flex-wrap gap-2 text-xs tracking-[0.22em] uppercase text-(--cream-soft)">
            <a className="focus-ring rounded-full border border-[rgba(201,168,76,0.16)] px-3 py-2 transition hover:border-[rgba(240,208,128,0.6)] hover:text-(--cream)" href="#overview">
              Resumen
            </a>
            <a className="focus-ring rounded-full border border-[rgba(201,168,76,0.16)] px-3 py-2 transition hover:border-[rgba(240,208,128,0.6)] hover:text-(--cream)" href="#workspace">
              Edición
            </a>
            <a className="focus-ring rounded-full border border-[rgba(201,168,76,0.16)] px-3 py-2 transition hover:border-[rgba(240,208,128,0.6)] hover:text-(--cream)" href="#horario">
              Horario
            </a>
            <a className="focus-ring rounded-full border border-[rgba(201,168,76,0.16)] px-3 py-2 transition hover:border-[rgba(240,208,128,0.6)] hover:text-(--cream)" href="#categorias">
              Categorías
            </a>
            <a className="focus-ring rounded-full border border-[rgba(201,168,76,0.16)] px-3 py-2 transition hover:border-[rgba(240,208,128,0.6)] hover:text-(--cream)" href="#productos">
              Productos
            </a>
          </nav>

          <Button className="premium-button-secondary" radius="sm" variant="bordered" onPress={handleLogout}>
            Cerrar sesión
          </Button>
        </div>
      </header>

      <section id="overview" className="mx-auto max-w-7xl px-4 pb-8 pt-8 sm:px-6 lg:px-8 lg:pt-10">
        <Card className="premium-card border border-[rgba(201,168,76,0.18)] bg-transparent">
          <CardBody className="gap-6 p-6 md:p-8">
            <div className="space-y-4">
              <p className="premium-kicker">Casa Stella Admin</p>
              <h2 className="premium-title text-4xl text-(--cream) md:text-5xl">Controla carta, horario y categorías desde un solo lugar</h2>
              <p className="max-w-3xl text-sm leading-7 text-(--muted) md:text-base">
                Esta pantalla centraliza las tareas operativas. Usa los accesos rápidos para ir directo al bloque que necesitas editar.
              </p>
            </div>

            <PortalStats categories={categories} products={products} reservations={reservations} />

            <div className="grid gap-4 md:grid-cols-3">
              <Card className="premium-card-quiet border border-[rgba(201,168,76,0.12)] bg-transparent">
                <CardBody className="gap-3 p-5">
                  <p className="premium-kicker">Atajo</p>
                  <a className="premium-title text-2xl text-(--cream)" href="#horario">
                    Editar horario
                  </a>
                  <p className="text-sm leading-6 text-(--muted)">Define turnos de mañana y tarde por día.</p>
                </CardBody>
              </Card>
              <Card className="premium-card-quiet border border-[rgba(201,168,76,0.12)] bg-transparent">
                <CardBody className="gap-3 p-5">
                  <p className="premium-kicker">Atajo</p>
                  <a className="premium-title text-2xl text-(--cream)" href="#categorias">
                    Editar categorías
                  </a>
                  <p className="text-sm leading-6 text-(--muted)">Alta y mantenimiento de familias de productos.</p>
                </CardBody>
              </Card>
              <Card className="premium-card-quiet border border-[rgba(201,168,76,0.12)] bg-transparent">
                <CardBody className="gap-3 p-5">
                  <p className="premium-kicker">Atajo</p>
                  <a className="premium-title text-2xl text-(--cream)" href="#productos">
                    Editar productos
                  </a>
                  <p className="text-sm leading-6 text-(--muted)">Crear platos y actualizar datos de carta.</p>
                </CardBody>
              </Card>
            </div>
          </CardBody>
        </Card>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
        <AdminWorkspace token={token} categories={categories} products={products} openingHours={openingHours} />
      </section>
    </main>
  );
}
