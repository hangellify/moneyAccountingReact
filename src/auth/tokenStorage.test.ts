import { describe, it, expect, beforeEach, vi } from 'vitest';
import { tokenStorage } from './tokenStorage';

const REFRESH_KEY = 'accounting_app_refresh_token';

beforeEach(() => {
  localStorage.clear();
  tokenStorage.clear();
});

describe('tokenStorage', () => {
  it('returns null for access token when unset', () => {
    expect(tokenStorage.getAccessToken()).toBeNull();
    expect(tokenStorage.getAccessTokenExpiresAt()).toBeNull();
  });

  it('stores access token and computes expiresAt', () => {
    vi.setSystemTime(new Date('2026-05-08T00:00:00Z'));
    tokenStorage.setAccessToken('abc', 60);
    expect(tokenStorage.getAccessToken()).toBe('abc');
    expect(tokenStorage.getAccessTokenExpiresAt()).toBe(
      new Date('2026-05-08T00:01:00Z').getTime(),
    );
  });

  it('reads refresh token from localStorage under the legacy key', () => {
    localStorage.setItem(REFRESH_KEY, 'rt-1');
    expect(tokenStorage.getRefreshToken()).toBe('rt-1');
  });

  it('setTokenResponse writes both', () => {
    tokenStorage.setTokenResponse({
      access_token: 'a', refresh_token: 'r',
      expires_in: 30, token_type: 'Bearer',
    });
    expect(tokenStorage.getAccessToken()).toBe('a');
    expect(localStorage.getItem(REFRESH_KEY)).toBe('r');
  });

  it('clear() wipes both in-memory and localStorage', () => {
    tokenStorage.setTokenResponse({
      access_token: 'a', refresh_token: 'r',
      expires_in: 30, token_type: 'Bearer',
    });
    tokenStorage.clear();
    expect(tokenStorage.getAccessToken()).toBeNull();
    expect(tokenStorage.getAccessTokenExpiresAt()).toBeNull();
    expect(localStorage.getItem(REFRESH_KEY)).toBeNull();
  });

  it('clearAccessToken does NOT touch refresh token', () => {
    tokenStorage.setTokenResponse({
      access_token: 'a', refresh_token: 'r',
      expires_in: 30, token_type: 'Bearer',
    });
    tokenStorage.clearAccessToken();
    expect(tokenStorage.getAccessToken()).toBeNull();
    expect(tokenStorage.getRefreshToken()).toBe('r');
  });
});
