import { API_BASE_URL, ApiError, TokenResponse, LoginRequest } from './api';

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

interface RequestOptions {
  method?: HttpMethod;
  query?: Record<string, string | number | boolean | null | undefined>;
  body?: unknown;
  token?: string;
}

function normalizeRequestBody(value: unknown): unknown {
  if (typeof value === 'string') {
    return value.replace(/\r\n/g, '\n');
  }

  if (Array.isArray(value)) {
    return value.map(normalizeRequestBody);
  }

  if (value && typeof value === 'object') {
    return Object.fromEntries(
      Object.entries(value).map(([key, entry]) => [key, normalizeRequestBody(entry)])
    );
  }

  return value;
}

async function request<T>(
  path: string,
  options: RequestOptions = {}
): Promise<T> {
  const { method = 'GET', query, body, token } = options;
  const normalizedBody = body ? normalizeRequestBody(body) : undefined;

  const url = new URL(`${API_BASE_URL}${path}`);
  if (query) {
    Object.entries(query).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        url.searchParams.append(key, String(value));
      }
    });
  }

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(url.toString(), {
    method,
    headers,
    body: normalizedBody ? JSON.stringify(normalizedBody) : undefined,
  });

  if (!response.ok) {
    const payload = await response.json().catch(() => ({}));
    throw new ApiError(`HTTP ${response.status}`, response.status, payload);
  }

  return response.json();
}

// Auth endpoints
export async function loginAdmin(
  username: string,
  password: string
): Promise<TokenResponse> {
  return request('/api/v1/auth/login', {
    method: 'POST',
    body: { username, password },
  });
}

// Product endpoints
export interface ProductSchema {
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
  category?: CategoryModel | null;
  ingredients?: IngredientSchema[] | null;
}

export interface ProductCreateSchema {
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
}

export interface CategoryModel {
  id?: number | null;
  name: string;
  common_name: string;
  language?: string;
  description?: string | null;
  available?: boolean;
  parent_id?: number | null;
}

export interface CategoryCreateSchema {
  name: string;
  common_name: string;
  language?: string;
  description?: string | null;
  available?: boolean;
}

export interface IngredientSchema {
  id?: number | null;
  name: string;
  common_name?: string;
  description?: string | null;
  allergen_id?: number | null;
}

export async function getProducts(
  token: string,
  filters?: {
    by_id?: number;
    by_number?: number;
    lang?: string;
    category_id?: number;
    available?: boolean;
  }
): Promise<ProductSchema[]> {
  return request('/productos/get-products', {
    method: 'POST',
    query: filters,
    token,
  });
}

export async function createProduct(
  token: string,
  data: ProductCreateSchema
): Promise<ProductSchema> {
  return request('/productos/create-product', {
    method: 'POST',
    body: data,
    token,
  });
}

export async function updateProduct(
  token: string,
  data: ProductSchema
): Promise<ProductSchema> {
  return request('/productos/update-product', {
    method: 'PUT',
    body: data,
    token,
  });
}

// Category endpoints
export async function getCategories(
  token: string,
  filters?: {
    lang?: string;
    id?: number;
    common_name?: string;
    available?: boolean;
  }
): Promise<CategoryModel[]> {
  return request('/categorias/get-categories', {
    method: 'POST',
    query: filters,
    token,
  });
}

export async function createCategory(
  token: string,
  data: CategoryCreateSchema
): Promise<CategoryModel> {
  return request('/categorias/create-category', {
    method: 'POST',
    body: data,
    token,
  });
}

export async function updateCategory(
  token: string,
  data: CategoryModel
): Promise<CategoryModel> {
  return request('/categorias/update-category', {
    method: 'PUT',
    body: data,
    token,
  });
}

// Opening hours endpoints
export interface OpeningHoursSchema {
  id?: number | null;
  day_of_week: string;
  morning_open_time?: string | null;
  morning_close_time?: string | null;
  afternoon_open_time?: string | null;
  afternoon_close_time?: string | null;
  closed?: boolean;
}

export async function getOpeningHours(token: string): Promise<OpeningHoursSchema[]> {
  return request('/horarios/get-opening-hours', {
    method: 'GET',
    token,
  });
}

export async function setOpeningHours(
  token: string,
  hour: OpeningHoursSchema
): Promise<OpeningHoursSchema> {
  return request('/horarios/set-opening-hours', {
    method: 'POST',
    body: hour,
    token,
  });
}

// Auth - change password
export async function changePassword(
  token: string,
  data: { current_password: string; new_password: string; confirm_password: string }
): Promise<{ message: string }> {
  return request('/api/v1/auth/change-password', {
    method: 'PUT',
    body: data,
    token,
  });
}
