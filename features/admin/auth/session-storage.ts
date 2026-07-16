import {ADMIN_TOKEN_STORAGE_KEY} from '@/features/admin/constants';

export function readStoredAdminToken() {
  if (typeof window === 'undefined') {
    return '';
  }

  return window.localStorage.getItem(ADMIN_TOKEN_STORAGE_KEY) ?? '';
}

export function writeStoredAdminToken(token: string) {
  if (typeof window === 'undefined') {
    return;
  }

  if (token) {
    window.localStorage.setItem(ADMIN_TOKEN_STORAGE_KEY, token);
    return;
  }

  window.localStorage.removeItem(ADMIN_TOKEN_STORAGE_KEY);
}
