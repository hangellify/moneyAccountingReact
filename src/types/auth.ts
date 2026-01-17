import type { Currency } from '@/const/currency';
import type { LanguageCode } from '@/const/language';

/**
 * Auth API Request Types
 */
export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  first_name: string;
  last_name?: string;
  username?: string;
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

/**
 * Auth API Response Types
 */
export interface TokenResponseDto {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  token_type: string;
}

export interface UserProfileDto {
  id: string;
  email: string;
  first_name: string;
  last_name?: string;
  username?: string;
  currency: Currency;
  language_code?: LanguageCode;
  created_at: Date;
  updated_at: Date;
}

export interface ErrorResponse {
  message: string;
  errors?: Record<string, string[]>;
}
