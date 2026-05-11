import { STORAGE_KEYS } from '@/const/auth';
import type { UserProfileDto } from '@/types/auth';

export { STORAGE_KEYS };

/**
 * Storage utility for managing authentication data
 */
class StorageService {
  private storage: Storage;

  constructor() {
    this.storage = localStorage;
  }

  setUserInfo(userInfo: UserProfileDto | null): void {
    if (userInfo) {
      this.storage.setItem(STORAGE_KEYS.USER_INFO, JSON.stringify(userInfo));
    } else {
      this.storage.removeItem(STORAGE_KEYS.USER_INFO);
    }
  }

  getUserInfo(): UserProfileDto | null {
    const data = this.storage.getItem(STORAGE_KEYS.USER_INFO);
    if (!data) return null;
    try {
      return JSON.parse(data) as UserProfileDto;
    } catch {
      return null;
    }
  }

  /**
   * Set access token
   */
  setAccessToken(token: string | null): void {
    if (token) {
      this.storage.setItem(STORAGE_KEYS.ACCESS_TOKEN, token);
    } else {
      this.storage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
    }
  }

  /**
   * Get access token
   */
  getAccessToken(): string | null {
    return this.storage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
  }

  /**
   * Set refresh token
   */
  setRefreshToken(token: string | null): void {
    if (token) {
      this.storage.setItem(STORAGE_KEYS.REFRESH_TOKEN, token);
    } else {
      this.storage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
    }
  }

  /**
   * Get refresh token
   */
  getRefreshToken(): string | null {
    return this.storage.getItem(STORAGE_KEYS.REFRESH_TOKEN);
  }

  /**
   * Clear all authentication data
   */
  clearAuth(): void {
    this.storage.removeItem(STORAGE_KEYS.USER_INFO);
    this.storage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
    this.storage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    return !!(this.getAccessToken() && this.getUserInfo());
  }
}

export const storageService = new StorageService();
