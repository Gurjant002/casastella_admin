export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? 'https://localhost:8000';

export class ApiError extends Error {
  status: number;
  payload: unknown;

  constructor(message: string, status: number, payload: unknown) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.payload = payload;
  }
}

type Primitive = string | number | boolean;

type RequestOptions = {
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  query?: Record<string, Primitive | null | undefined>;
  body?: unknown;
  token?: string;
};

export type LoginRequest = {
  username: string;
  password: string;
};

export type TokenResponse = {
  access_token: string;
  token_type?: string;
};

export type CategoryModel = {
  id?: number | null;
  name: string;
  common_name: string;
  language?: string;
  description?: string | null;
  available?: boolean;
  parent_id?: number | null;
};

export type CategoryCreateSchema = {
  name: string;
  common_name: string;
  language?: string;
  description?: string | null;
  available?: boolean;
};

export type ProductSchema = {
  id?: number | null;
  number: number;
  name: string;
  description?: string | null;
  price: number;
  language?: string;
  available?: boolean;
  is_spicy?: boolean;
  is_adult_only?: boolean;
  category_id: number;
};

export type ProductCreateSchema = {
  number: number;
  name: string;
  description?: string | null;
  price: number;
  language?: string;
  available?: boolean;
  is_spicy?: boolean;
  is_adult_only?: boolean;
  category_id: number;
  ingredient_ids?: number[] | null;
};

export type ReservationStatus = 'solicitado' | 'reservado' | 'cancelado';

export type ReservationSchema = {
  id: number;
  reservation_datetime: string;
  party_size: number;
  status: ReservationStatus;
  customer_id?: number | null;
  guest_name: string;
  guest_phone: string;
  guest_email?: string | null;
  notes?: string | null;
  created_at: string;
  updated_at: string;
};

export type ReservationStatusUpdateSchema = {
  status: ReservationStatus;
};

export type OpeningHoursSchema = {
  id?: number | null;
  day_of_week: string;
  morning_open_time?: string | null;
  morning_close_time?: string | null;
  afternoon_open_time?: string | null;
  afternoon_close_time?: string | null;
  closed?: boolean;
};

export type CategorySearchParams = {
  lang?: string;
  id?: number;
  common_name?: string;
  available?: boolean;
};

export type ProductSearchParams = {
  by_id?: number;
  by_number?: number;
  lang?: string;
  category_id?: number;
  category_common_name?: string;
  available?: boolean;
};

function buildUrl(path: string, query?: RequestOptions['query']) {
  const url = new URL(path, API_BASE_URL);

  if (query) {
    for (const [key, value] of Object.entries(query)) {
      if (value !== undefined && value !== null) {
        url.searchParams.set(key, String(value));
      }
    }
  }

  return url;
}

function normalizeArray<T>(value: T | T[] | null | undefined): T[] {
  if (value == null) {
    return [];
  }

  return Array.isArray(value) ? value : [value];
}

async function requestJson<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const response = await fetch(buildUrl(path, options.query), {
    method: options.method ?? 'GET',
    cache: 'no-store',
    headers: {
      ...(options.body ? {'Content-Type': 'application/json'} : {}),
      ...(options.token ? {Authorization: `Bearer ${options.token}`} : {}),
    },
    body: options.body ? JSON.stringify(options.body) : undefined,
  });

  if (!response.ok) {
    let payload: unknown = null;

    try {
      payload = await response.json();
    } catch {
      payload = await response.text();
    }

    throw new ApiError(`API request failed for ${path}`, response.status, payload);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return (await response.json()) as T;
}

export async function loginAdmin(payload: LoginRequest) {
  return requestJson<TokenResponse>('/api/v1/auth/login', {
    method: 'POST',
    body: payload,
  });
}

export async function getCategories(params: CategorySearchParams = {}) {
  return normalizeArray(
    await requestJson<CategoryModel | CategoryModel[] | null>('/categorias/get-categories', {
      method: 'POST',
      query: params,
    }),
  );
}

export async function getProducts(params: ProductSearchParams = {}) {
  return normalizeArray(
    await requestJson<ProductSchema | ProductSchema[] | null>('/productos/get-products', {
      method: 'POST',
      query: params,
    }),
  );
}

export async function listReservations(params: {status?: ReservationStatus | null; limit?: number} = {}) {
  return requestJson<ReservationSchema[]>('/reservas/', {
    query: params,
  });
}

export async function updateReservationStatus(reservationId: number, status: ReservationStatus) {
  return requestJson<ReservationSchema>(`/reservas/${reservationId}/status`, {
    method: 'PATCH',
    body: {status} satisfies ReservationStatusUpdateSchema,
  });
}

export async function createCategory(payload: CategoryCreateSchema, token?: string) {
  return requestJson<CategoryModel>('/categorias/create-category', {
    method: 'POST',
    body: payload,
    token,
  });
}

export async function updateCategory(payload: CategoryModel, token?: string) {
  return requestJson<CategoryModel>('/categorias/update-category', {
    method: 'PUT',
    body: payload,
    token,
  });
}

export async function createProduct(payload: ProductCreateSchema, token?: string) {
  return requestJson<ProductSchema>('/productos/create-product', {
    method: 'POST',
    body: payload,
    token,
  });
}

export async function updateProduct(payload: ProductSchema, token?: string) {
  return requestJson<ProductSchema>('/productos/update-product', {
    method: 'PUT',
    body: payload,
  });
}

export async function getOpeningHours(weekDay?: string) {
  return normalizeArray(
    await requestJson<OpeningHoursSchema | OpeningHoursSchema[] | null>('/horarios/get-opening-hours', {
      query: {week_day: weekDay},
    }),
  );
}

export async function setOpeningHours(payload: OpeningHoursSchema, token?: string) {
  return requestJson<OpeningHoursSchema>('/horarios/set-opening-hours', {
    method: 'POST',
    body: payload,
    token,
  });
}