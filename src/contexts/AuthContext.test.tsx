import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, waitFor, act } from '@testing-library/react';
import { AuthProvider, useAuth } from './AuthContext';
import { tokenStorage } from '@/auth/tokenStorage';
import { AUTH_LOGOUT_EVENT } from '@/auth/apiClient';
import { authApi } from '@/pages/auth/api';

vi.mock('@/pages/auth/api', () => ({
  authApi: {
    login: vi.fn(),
    register: vi.fn(),
    refresh: vi.fn(),
    logout: vi.fn(),
    me: vi.fn(),
  },
}));

const profile = {
  id: '1',
  email: 'a@b.c',
  first_name: 'A',
  currency: 'USD',
  created_at: '2026-01-01T00:00:00Z',
  updated_at: '2026-01-01T00:00:00Z',
} as const;

function Probe(): React.ReactElement {
  const { user } = useAuth();
  if (user === undefined) return <div>loading</div>;
  if (user === null) return <div>logged-out</div>;
  return <div>hello {user.first_name}</div>;
}

beforeEach(() => {
  localStorage.clear();
  tokenStorage.clear();
  vi.clearAllMocks();
});

describe('AuthProvider bootstrap', () => {
  it('renders loading initially when refresh token exists', async () => {
    tokenStorage.setRefreshToken('rt');
    let resolveMe: (v: typeof profile) => void;
    (authApi.me as ReturnType<typeof vi.fn>).mockReturnValue(
      new Promise<typeof profile>((res) => {
        resolveMe = res;
      })
    );

    render(
      <AuthProvider>
        <Probe />
      </AuthProvider>
    );
    expect(screen.getByText('loading')).toBeInTheDocument();

    act(() => {
      resolveMe(profile);
    });
    await waitFor(() => expect(screen.getByText(/hello/)).toBeInTheDocument());
  });

  it('without a refresh token, becomes logged-out without calling me()', async () => {
    render(
      <AuthProvider>
        <Probe />
      </AuthProvider>
    );
    await waitFor(() =>
      expect(screen.getByText('logged-out')).toBeInTheDocument()
    );
    expect(authApi.me).not.toHaveBeenCalled();
  });

  it('on me() failure, clears tokens and becomes logged-out', async () => {
    tokenStorage.setRefreshToken('rt');
    (authApi.me as ReturnType<typeof vi.fn>).mockRejectedValue(
      new Error('boom')
    );

    render(
      <AuthProvider>
        <Probe />
      </AuthProvider>
    );
    await waitFor(() =>
      expect(screen.getByText('logged-out')).toBeInTheDocument()
    );
    expect(tokenStorage.getRefreshToken()).toBeNull();
  });
});

describe('AuthProvider events', () => {
  it('auth:logout window event resets user to null', async () => {
    tokenStorage.setRefreshToken('rt');
    (authApi.me as ReturnType<typeof vi.fn>).mockResolvedValue(profile);
    render(
      <AuthProvider>
        <Probe />
      </AuthProvider>
    );
    await waitFor(() => expect(screen.getByText(/hello/)).toBeInTheDocument());

    act(() => {
      window.dispatchEvent(new CustomEvent(AUTH_LOGOUT_EVENT));
    });
    await waitFor(() =>
      expect(screen.getByText('logged-out')).toBeInTheDocument()
    );
  });

  it('storage event removing refresh-token key resets user and clears in-memory access', async () => {
    tokenStorage.setRefreshToken('rt');
    tokenStorage.setAccessToken('at', 60);
    (authApi.me as ReturnType<typeof vi.fn>).mockResolvedValue(profile);
    render(
      <AuthProvider>
        <Probe />
      </AuthProvider>
    );
    await waitFor(() => expect(screen.getByText(/hello/)).toBeInTheDocument());

    act(() => {
      // simulate another tab removing the key
      localStorage.removeItem('accounting_app_refresh_token');
      window.dispatchEvent(
        new StorageEvent('storage', {
          key: 'accounting_app_refresh_token',
          newValue: null,
        })
      );
    });
    await waitFor(() =>
      expect(screen.getByText('logged-out')).toBeInTheDocument()
    );
    expect(tokenStorage.getAccessToken()).toBeNull();
  });
});
