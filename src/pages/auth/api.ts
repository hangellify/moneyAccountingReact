import { apiClient } from '@/auth/apiClient';
import { AUTH_ENDPOINTS } from '@/const/auth';
import type {
  LoginRequest,
  RegisterRequest,
  RefreshTokenRequest,
  LogoutRequest,
  TokenResponseDto,
  UserProfileDto,
} from '@/types/auth';

export const authApi = {
  login: (p: LoginRequest): Promise<TokenResponseDto> =>
    apiClient
      .post<TokenResponseDto>(AUTH_ENDPOINTS.LOGIN, p)
      .then((r) => r.data),
  register: (p: RegisterRequest): Promise<TokenResponseDto> =>
    apiClient
      .post<TokenResponseDto>(AUTH_ENDPOINTS.REGISTER, p)
      .then((r) => r.data),
  refresh: (p: RefreshTokenRequest): Promise<TokenResponseDto> =>
    apiClient
      .post<TokenResponseDto>(AUTH_ENDPOINTS.REFRESH, p)
      .then((r) => r.data),
  logout: (p?: LogoutRequest): Promise<void> =>
    apiClient.post<void>(AUTH_ENDPOINTS.LOGOUT, p ?? {}).then(() => undefined),
  me: (): Promise<UserProfileDto> =>
    apiClient.get<UserProfileDto>(AUTH_ENDPOINTS.ME).then((r) => r.data),
};
