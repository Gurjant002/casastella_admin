export type StatItem = {
  label: string;
  value: string;
  delta: string;
  note: string;
};

export type QueueItem = {
  title: string;
  subtitle: string;
  status: string;
  meta: string;
};

export type CatalogItem = {
  number: string;
  name: string;
  category: string;
  price: string;
  available: boolean;
  tags: string[];
};

export type ReservationItem = {
  guest: string;
  date: string;
  size: string;
  status: string;
  notes: string;
};

export const dashboardStats: StatItem[] = [
  {
    label: 'Órdenes hoy',
    value: '42',
    delta: '+18% vs. ayer',
    note: 'Basado en /customers/me/orders/total',
  },
  {
    label: 'Categorías activas',
    value: '18',
    delta: '3 ocultas',
    note: 'Sincronizado con /categorias/get-total-categories',
  },
  {
    label: 'Productos visibles',
    value: '126',
    delta: '14 destacados',
    note: 'Catálogo de /productos/get-products',
  },
  {
    label: 'Reservas en espera',
    value: '07',
    delta: '2 urgentes',
    note: 'Estados solicitado / reservado / cancelado',
  },
];

export const operations: QueueItem[] = [
  {
    title: 'Aprobación de reservas',
    subtitle: 'Revisar solicitudes de hoy y liberar mesa para turnos premium.',
    status: 'solicitado',
    meta: 'Disponibles en /reservas',
  },
  {
    title: 'Oferta de temporada',
    subtitle: 'Publicar un grupo de productos con precio fijo y maridaje.',
    status: 'admin',
    meta: 'Endpoints /ofertas/*',
  },
  {
    title: 'Carta del chef',
    subtitle: 'Mantener categorías y productos alineados con el menú vigente.',
    status: 'catálogo',
    meta: 'Endpoints /categorias y /productos',
  },
];

export const catalog: CatalogItem[] = [
  {
    number: '01',
    name: 'Risotto Nero di Sepia',
    category: 'Pasta & arroces',
    price: '€18.50',
    available: true,
    tags: ['Signature', 'Disponible'],
  },
  {
    number: '02',
    name: 'Pizza Trufa Bianca',
    category: 'Pizze',
    price: '€21.00',
    available: true,
    tags: ['Chef', 'Activo'],
  },
  {
    number: '03',
    name: 'Tartar de Salmón',
    category: 'Entrantes',
    price: '€16.00',
    available: false,
    tags: ['Temporalmente oculto'],
  },
];

export const reservations: ReservationItem[] = [
  {
    guest: 'Valeria M.',
    date: 'Hoy · 20:30',
    size: '4 comensales',
    status: 'reservado',
    notes: 'Ventana principal, celebración',
  },
  {
    guest: 'Andrés R.',
    date: 'Hoy · 22:00',
    size: '2 comensales',
    status: 'solicitado',
    notes: 'Preferencia de mesa alta',
  },
  {
    guest: 'Lucía P.',
    date: 'Mañana · 21:00',
    size: '6 comensales',
    status: 'cancelado',
    notes: 'Reprogramado por el cliente',
  },
];

export const quickFacts = [
  'JWT admin con role=admin',
  'Cambios de contraseña para el staff',
  'Carrito persistente para customer',
  'Direcciones con default automático',
];
