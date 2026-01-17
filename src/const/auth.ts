/**
 * Auth API Endpoints
 */
export const AUTH_ENDPOINTS = {
  LOGIN: '/auth/login',
  REGISTER: '/auth/register',
  REFRESH: '/auth/refresh',
  LOGOUT: '/auth/logout',
  ME: '/auth/me',
} as const;

/**
 * Storage keys for authentication and user data
 */
export const STORAGE_KEYS = {
  USER_INFO: 'accounting_app_user_info',
  ACCESS_TOKEN: 'accounting_app_access_token',
  REFRESH_TOKEN: 'accounting_app_refresh_token',
} as const;
