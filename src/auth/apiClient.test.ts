import { describe, it, expect, beforeEach } from 'vitest';
import MockAdapter from 'axios-mock-adapter';
import { apiClient } from './apiClient';
import { tokenStorage } from './tokenStorage';
import { ApiError } from './apiError';

let mock: MockAdapter;

beforeEach(() => {
  mock = new MockAdapter(apiClient);
  localStorage.clear();
  tokenStorage.clear();
});

describe('apiClient request interceptor', () => {
  it('attaches Authorization header when access token present', async () => {
    tokenStorage.setAccessToken('tok-1', 60);
    mock.onGet('/budgets').reply((config) => {
      expect(config.headers?.Authorization).toBe('Bearer tok-1');
      return [200, []];
    });
    await apiClient.get('/budgets');
  });

  it('omits Authorization header when access token absent', async () => {
    mock.onGet('/budgets').reply((config) => {
      expect(config.headers?.Authorization).toBeUndefined();
      return [200, []];
    });
    await apiClient.get('/budgets');
  });
});

describe('apiClient response interceptor — error mapping', () => {
  it('maps a 400 to ApiError with status, message, body', async () => {
    mock.onPost('/budgets').reply(400, {
      message: 'Validation failed',
      code: 'VALIDATION',
      errors: { name: ['required'] },
    });
    await expect(apiClient.post('/budgets', {})).rejects.toMatchObject({
      name: 'ApiError',
      status: 400,
      code: 'VALIDATION',
      message: 'Validation failed',
    });
  });

  it('maps a 500 with no body to ApiError with axios message', async () => {
    mock.onGet('/anything').reply(500);
    await expect(apiClient.get('/anything')).rejects.toBeInstanceOf(ApiError);
  });
});
