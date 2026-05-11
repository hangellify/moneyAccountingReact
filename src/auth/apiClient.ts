import axios, { type AxiosError, type InternalAxiosRequestConfig } from 'axios';
import { tokenStorage } from './tokenStorage';
import { ApiError } from './apiError';
import { env } from '@/lib/env';
import type { TokenResponseDto } from '@/types/auth';

export const apiClient = axios.create({
  baseURL: env.apiUrl,
  headers: { 'Content-Type': 'application/json' },
});

apiClient.interceptors.request.use((config) => {
  const t = tokenStorage.getAccessToken();
  if (t) config.headers.set('Authorization', `Bearer ${t}`);
  return config;
});

export const AUTH_LOGOUT_EVENT = 'auth:logout';

let refreshInFlight: Promise<string> | null = null;

async function runRefresh(): Promise<string> {
  const refresh_token = tokenStorage.getRefreshToken();
  if (!refresh_token) throw new Error('NO_REFRESH_TOKEN');
  const { data } = await axios.post<TokenResponseDto>(
    `${env.apiUrl}/auth/refresh`,
    { refresh_token },
    { headers: { 'Content-Type': 'application/json' } }
  );
  tokenStorage.setTokenResponse(data);
  return data.access_token;
}

function refreshAccessToken(): Promise<string> {
  if (!refreshInFlight) {
    refreshInFlight = runRefresh().finally(() => {
      refreshInFlight = null;
    });
  }
  return refreshInFlight;
}

const AUTH_PATHS = ['/auth/login', '/auth/register', '/auth/refresh'];

apiClient.interceptors.response.use(
  (r) => r,
  async (err: AxiosError) => {
    const original = err.config as
      | (InternalAxiosRequestConfig & { _retried?: boolean })
      | undefined;
    const status = err.response?.status;
    const url = original?.url ?? '';
    const isAuthEndpoint = AUTH_PATHS.some((p) => url.includes(p));

    if (status === 401 && original && !original._retried && !isAuthEndpoint) {
      original._retried = true;
      try {
        const newToken = await refreshAccessToken();
        original.headers.set('Authorization', `Bearer ${newToken}`);
        return apiClient(original);
      } catch {
        tokenStorage.clear();
        window.dispatchEvent(new CustomEvent(AUTH_LOGOUT_EVENT));
      }
    }

    const body = err.response?.data as
      | { message?: string; code?: string }
      | undefined;
    // Note: when refresh failed above, we still reject here using the
    // original 401's body — not the refresh failure. Intentional.
    return Promise.reject(
      new ApiError(status, body?.code, body?.message ?? err.message, body)
    );
  }
);
