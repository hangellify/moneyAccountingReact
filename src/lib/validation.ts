/**
 * Validation utilities
 */

/**
 * Validates email format
 */
export function validateEmail(email: string): string | null {
  if (!email) {
    return 'Email is required';
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return 'Please enter a valid email address';
  }

  return null;
}

/**
 * Validates first name (required, non-empty string)
 */
export function validateFirstName(firstName: string): string | null {
  if (!firstName || firstName.trim().length === 0) {
    return 'First name is required';
  }

  if (firstName.trim().length < 2) {
    return 'First name must be at least 2 characters';
  }

  return null;
}

/**
 * Validates password strength
 * Requirements:
 * - Minimum 8 characters
 * - At least one uppercase letter
 * - At least one lowercase letter
 * - At least one symbol
 */
export function validatePassword(password: string): string | null {
  if (!password) {
    return 'Password is required';
  }

  if (password.length < 8) {
    return 'Password must be at least 8 characters long';
  }

  if (!/[A-Z]/.test(password)) {
    return 'Password must contain at least one uppercase letter';
  }

  if (!/[a-z]/.test(password)) {
    return 'Password must contain at least one lowercase letter';
  }

  if (!/[!@#$%^&*()_+\-=\\[\]{};':"\\|,.<>\\/?]/.test(password)) {
    return 'Password must contain at least one symbol';
  }

  return null;
}
