import type { TokenResponseDto } from '@/types/auth';

const REFRESH_KEY = 'accounting_app_refresh_token';

let accessToken: string | null = null;
let accessTokenExpiresAt: number | null = null;

export const tokenStorage = {
  getAccessToken: (): string | null => accessToken,
  getAccessTokenExpiresAt: (): number | null => accessTokenExpiresAt,
  setAccessToken(token: string, expiresInSeconds: number): void {
    accessToken = token;
    accessTokenExpiresAt = Date.now() + expiresInSeconds * 1000;
  },
  clearAccessToken(): void {
    accessToken = null;
    accessTokenExpiresAt = null;
  },
  getRefreshToken: (): string | null => localStorage.getItem(REFRESH_KEY),
  setRefreshToken(token: string): void {
    localStorage.setItem(REFRESH_KEY, token);
  },
  clearRefreshToken(): void {
    localStorage.removeItem(REFRESH_KEY);
  },
  setTokenResponse(res: TokenResponseDto): void {
    this.setAccessToken(res.access_token, res.expires_in);
    this.setRefreshToken(res.refresh_token);
  },
  clear(): void {
    this.clearAccessToken();
    this.clearRefreshToken();
  },
};
