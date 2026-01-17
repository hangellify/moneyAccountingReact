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

  /**
   * Set user information
   * Serializes Date objects to ISO strings for storage
   */
  setUserInfo(userInfo: UserProfileDto | null): void {
    if (userInfo) {
      // Convert Date objects to ISO strings for storage
      const serialized = {
        ...userInfo,
        created_at:
          userInfo.created_at instanceof Date
            ? userInfo.created_at.toISOString()
            : userInfo.created_at,
        updated_at:
          userInfo.updated_at instanceof Date
            ? userInfo.updated_at.toISOString()
            : userInfo.updated_at,
      };
      this.storage.setItem(STORAGE_KEYS.USER_INFO, JSON.stringify(serialized));
    } else {
      this.storage.removeItem(STORAGE_KEYS.USER_INFO);
    }
  }

  /**
   * Get user information
   * Deserializes ISO strings back to Date objects
   */
  getUserInfo(): UserProfileDto | null {
    const data = this.storage.getItem(STORAGE_KEYS.USER_INFO);
    if (!data) return null;
    try {
      const parsed = JSON.parse(data) as UserProfileDto;
      // Convert ISO strings back to Date objects
      return {
        ...parsed,
        created_at: new Date(parsed.created_at),
        updated_at: new Date(parsed.updated_at),
      } as UserProfileDto;
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
