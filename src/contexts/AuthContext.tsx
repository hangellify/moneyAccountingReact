import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  type ReactNode,
  type ReactElement,
} from 'react';
import { tokenStorage } from '@/auth/tokenStorage';
import { AUTH_LOGOUT_EVENT } from '@/auth/apiClient';
import { authApi } from '@/pages/auth/api';
import type {
  UserProfileDto,
  LoginRequest,
  RegisterRequest,
} from '@/types/auth';

const REFRESH_KEY = 'accounting_app_refresh_token';

interface AuthContextValue {
  user: UserProfileDto | null | undefined;
  isAuthenticated: boolean;
  login: (payload: LoginRequest) => Promise<void>;
  register: (payload: RegisterRequest) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({
  children,
}: {
  children: ReactNode;
}): ReactElement {
  const [user, setUser] = useState<UserProfileDto | null | undefined>(
    undefined
  );

  useEffect(() => {
    if (!tokenStorage.getRefreshToken()) {
      setUser(null);
      return;
    }
    let cancelled = false;
    authApi
      .me()
      .then((p) => {
        if (!cancelled) setUser(p);
      })
      .catch(() => {
        if (cancelled) return;
        tokenStorage.clear();
        setUser(null);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    const onLogout = (): void => setUser(null);
    const onStorage = (e: StorageEvent): void => {
      if (e.key === REFRESH_KEY && e.newValue === null) {
        tokenStorage.clearAccessToken();
        setUser(null);
      }
    };
    window.addEventListener(AUTH_LOGOUT_EVENT, onLogout);
    window.addEventListener('storage', onStorage);
    return () => {
      window.removeEventListener(AUTH_LOGOUT_EVENT, onLogout);
      window.removeEventListener('storage', onStorage);
    };
  }, []);

  const login = useCallback(async (payload: LoginRequest): Promise<void> => {
    const tokens = await authApi.login(payload);
    tokenStorage.setTokenResponse(tokens);
    const profile = await authApi.me();
    setUser(profile);
  }, []);

  const register = useCallback(
    async (payload: RegisterRequest): Promise<void> => {
      const tokens = await authApi.register(payload);
      tokenStorage.setTokenResponse(tokens);
      const profile = await authApi.me();
      setUser(profile);
    },
    []
  );

  const logout = useCallback(async (): Promise<void> => {
    try {
      const refresh_token = tokenStorage.getRefreshToken() ?? undefined;
      await authApi.logout({ refresh_token });
    } catch {
      // best-effort
    } finally {
      tokenStorage.clear();
      setUser(null);
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: user != null,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const v = useContext(AuthContext);
  if (!v) throw new Error('useAuth must be used inside AuthProvider');
  return v;
}
