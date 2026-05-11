import { describe, it, expect, beforeEach } from 'vitest';
import MockAdapter from 'axios-mock-adapter';
import { apiClient } from './apiClient';
import { tokenStorage } from './tokenStorage';

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
