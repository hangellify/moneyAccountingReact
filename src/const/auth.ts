export const AUTH_ENDPOINTS = {
  LOGIN: '/auth/login',
  REGISTER: '/auth/register',
  REFRESH: '/auth/refresh',
  LOGOUT: '/auth/logout',
  ME: '/auth/me',
} as const;

export const STORAGE_KEYS = {
  REFRESH_TOKEN: 'accounting_app_refresh_token',
} as const;
