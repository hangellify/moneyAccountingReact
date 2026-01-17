import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { authAPI } from '@/pages/auth/api';
import { useAuth } from '@/contexts/AuthContext';
import { storageService } from '@/lib/storage';
import { toast } from '@/hooks/use-toast';
import type { TokenResponseDto } from '@/types/auth';

interface AuthFlowOptions {
  successTitle: string;
  successDescription: string;
  errorTitle: string;
  onSuccess?: () => void;
}

export function useAuthFlow({
  successTitle,
  successDescription,
  errorTitle,
  onSuccess,
}: AuthFlowOptions) {
  const navigate = useNavigate();
  const { login } = useAuth();

  const executeAuthFlow = useCallback(
    async (tokenPromise: Promise<TokenResponseDto>): Promise<void> => {
      try {
        // Step 1: Get tokens (from login or register)
        const tokenResponse = await tokenPromise;

        // Step 2: Save tokens to storage
        storageService.setAccessToken(tokenResponse.access_token);
        storageService.setRefreshToken(tokenResponse.refresh_token);

        // Step 3: Get user profile
        const userProfile = await authAPI.getProfile(
          tokenResponse.access_token
        );

        // Step 4: Save user info to storage
        storageService.setUserInfo(userProfile);

        // Step 5: Update auth context
        login(
          userProfile,
          tokenResponse.access_token,
          tokenResponse.refresh_token
        );

        // Step 6: Show success toast
        toast({
          variant: 'success',
          title: successTitle,
          description: successDescription,
        });

        // Step 7: Call optional success callback or navigate
        if (onSuccess) {
          onSuccess();
        } else {
          void navigate('/dashboard');
        }
      } catch (error) {
        // Show error toast
        toast({
          variant: 'destructive',
          title: errorTitle,
          description:
            error instanceof Error ? error.message : 'An error occurred',
        });
      }
    },
    [login, navigate, successTitle, successDescription, errorTitle, onSuccess]
  );

  return { executeAuthFlow };
}
