import React, {
  createContext,
  useContext,
  useState,
  type ReactNode,
} from 'react';
import { storageService } from '@/lib/storage';
import { authAPI } from '@/pages/auth/api';
import { toast } from '@/hooks/use-toast';
import type { UserProfileDto } from '@/types/auth';

interface AuthContextType {
  user: UserProfileDto | null;
  isAuthenticated: boolean;
  login: (
    userInfo: UserProfileDto,
    accessToken: string,
    refreshToken: string
  ) => void;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({
  children,
}: {
  children: ReactNode;
}): React.ReactElement {
  const [user, setUser] = useState<UserProfileDto | null>(() =>
    storageService.getUserInfo()
  );
  const [isAuthenticated, setIsAuthenticated] = useState(() =>
    storageService.isAuthenticated()
  );

  const login = (
    userInfo: UserProfileDto,
    accessToken: string,
    refreshToken: string
  ): void => {
    storageService.setUserInfo(userInfo);
    storageService.setAccessToken(accessToken);
    storageService.setRefreshToken(refreshToken);
    setUser(userInfo);
    setIsAuthenticated(true);
  };

  const logout = async (): Promise<void> => {
    try {
      const accessToken = storageService.getAccessToken();

      // Call logout API if we have an access token
      if (accessToken) {
        await authAPI.logout(accessToken);
      }

      // Clear storage and state
      storageService.clearAuth();
      setUser(null);
      setIsAuthenticated(false);

      // Show success toast
      toast({
        variant: 'success',
        title: 'Logged out successfully',
        description: 'You have been successfully logged out from the system',
      });
    } catch (error) {
      // Even if API call fails, clear local storage
      storageService.clearAuth();
      setUser(null);
      setIsAuthenticated(false);

      // Show error toast but still log out locally
      toast({
        variant: 'destructive',
        title: 'Logout warning',
        description:
          error instanceof Error
            ? error.message
            : 'Logged out locally, but server logout failed',
      });
    }
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
