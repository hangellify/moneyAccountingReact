import { z } from 'zod';

/**
 * Email validation schema
 */
export const emailSchema = z
  .string()
  .min(1, 'Email is required')
  .email('Please enter a valid email address');

/**
 * Strict password schema (for registration)
 * Requirements:
 * - Minimum 8 characters
 * - At least one uppercase letter
 * - At least one lowercase letter
 * - At least one symbol
 */
const strictPasswordSchema = z
  .string()
  .min(1, 'Password is required')
  .min(8, 'Password must be at least 8 characters long')
  .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
  .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
  .regex(
    /[!@#$%^&*()_+\-=\\[\]{};':"\\|,.<>\\/?]/,
    'Password must contain at least one symbol'
  );

const loginPasswordSchema = z.string().min(1, 'Password is required');

/**
 * First name validation schema
 */
export const firstNameSchema = z
  .string()
  .min(1, 'First name is required')
  .min(2, 'First name must be at least 2 characters');

/**
 * Login form schema
 */
export const loginSchema = z.object({
  email: emailSchema,
  password: loginPasswordSchema,
});

/**
 * Register form schema
 */
export const registerSchema = z.object({
  email: emailSchema,
  password: strictPasswordSchema,
  first_name: firstNameSchema,
  last_name: z.string().optional(),
  username: z.string().optional(),
});

export type LoginFormData = z.infer<typeof loginSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;
