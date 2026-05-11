import axios from 'axios';
import { tokenStorage } from './tokenStorage';
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
