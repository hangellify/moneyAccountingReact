import type { Currency } from '@/const/currency';
import type { LanguageCode } from '@/const/language';

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
  refresh_token: string;
}

export interface LogoutRequest {
  refresh_token?: string;
}

export interface TokenResponseDto {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  token_type: 'Bearer';
}

export interface UserProfileDto {
  id: string;
  email: string;
  first_name: string;
  last_name?: string;
  username?: string;
  currency: Currency;
  language_code?: LanguageCode;
  created_at: string;
  updated_at: string;
}

export interface ErrorResponse {
  message: string;
  code?: string;
  errors?: Record<string, string[]>;
}
