import axios, { AxiosError } from 'axios';
import { tokenStorage } from './tokenStorage';
import { ApiError } from './apiError';
import { env } from '@/lib/env';

export const apiClient = axios.create({
  baseURL: env.apiUrl,
  headers: { 'Content-Type': 'application/json' },
});

apiClient.interceptors.request.use((config) => {
  const t = tokenStorage.getAccessToken();
  if (t) config.headers.set('Authorization', `Bearer ${t}`);
  return config;
});

apiClient.interceptors.response.use(
  (r) => r,
  (err: AxiosError) => {
    const status = err.response?.status;
    const body = err.response?.data as { message?: string; code?: string } | undefined;
    return Promise.reject(new ApiError(
      status, body?.code, body?.message ?? err.message, body,
    ));
  },
);
