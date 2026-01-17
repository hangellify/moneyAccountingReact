import { env } from '@/lib/env';
import { AUTH_ENDPOINTS } from '@/const/auth';
import type {
  LoginRequest,
  RegisterRequest,
  RefreshTokenRequest,
  TokenResponseDto,
  UserProfileDto,
  ErrorResponse,
} from '@/types/auth';

/**
 * Auth API Functions
 */
class AuthAPI {
  private baseUrl: string;

  constructor() {
    this.baseUrl = env.apiUrl;
  }

  /**
   * Generic fetch wrapper with error handling
   */
  private async fetchWithErrorHandling<T>(
    endpoint: string,
    options: RequestInit,
    defaultErrorMessage: string
  ): Promise<T> {
    const response = await fetch(`${this.baseUrl}${endpoint}`, options);

    if (!response.ok) {
      let error: ErrorResponse;
      try {
        error = (await response.json()) as ErrorResponse;
      } catch {
        error = {
          message: defaultErrorMessage,
        };
      }
      throw new Error(error.message || defaultErrorMessage);
    }

    return response.json() as Promise<T>;
  }

  /**
   * Login user
   */
  async login(data: LoginRequest): Promise<TokenResponseDto> {
    return this.fetchWithErrorHandling<TokenResponseDto>(
      AUTH_ENDPOINTS.LOGIN,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      },
      'Login failed'
    );
  }

  /**
   * Get user profile
   */
  async getProfile(accessToken: string): Promise<UserProfileDto> {
    return this.fetchWithErrorHandling<UserProfileDto>(
      AUTH_ENDPOINTS.ME,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
      },
      'Failed to fetch user profile'
    );
  }

  /**
   * Register new user
   */
  async register(data: RegisterRequest): Promise<TokenResponseDto> {
    return this.fetchWithErrorHandling<TokenResponseDto>(
      AUTH_ENDPOINTS.REGISTER,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      },
      'Registration failed'
    );
  }

  /**
   * Refresh access token
   */
  async refreshToken(data: RefreshTokenRequest): Promise<TokenResponseDto> {
    return this.fetchWithErrorHandling<TokenResponseDto>(
      AUTH_ENDPOINTS.REFRESH,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      },
      'Token refresh failed'
    );
  }

  /**
   * Logout user
   */
  async logout(accessToken: string): Promise<void> {
    await this.fetchWithErrorHandling<void>(
      AUTH_ENDPOINTS.LOGOUT,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
      },
      'Logout failed'
    );
  }
}

export const authAPI = new AuthAPI();
