import * as dotenv from 'dotenv';
import path from 'path';
import { customerData } from './testData';

// Load .env file
dotenv.config({ path: path.join(process.cwd(), '.env') });

export interface User {
  username: string;
  password: string;
}

const requireEnv = (key: string): string => {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Environment variable ${key} is required.`);
  }
  return value;
};

/**
 * Test accounts must be provided through environment variables and should not be
 * hardcoded in source control.
 */
let cachedUsers: Record<string, User> | null = null;

export function getUsers(): Record<string, User> {
  if (cachedUsers !== null) return cachedUsers;

  cachedUsers = {
    standard: {
      username: requireEnv('TEST_USER_STANDARD'),
      password: requireEnv('TEST_PASSWORD_STANDARD'),
    },
    lockedOut: {
      username: requireEnv('TEST_USER_LOCKED_OUT'),
      password: requireEnv('TEST_PASSWORD_LOCKED_OUT'),
    },
    problem: {
      username: requireEnv('TEST_USER_PROBLEM'),
      password: requireEnv('TEST_PASSWORD_PROBLEM'),
    },
    performanceGlitch: {
      username: requireEnv('TEST_USER_PERFORMANCE_GLITCH'),
      password: requireEnv('TEST_PASSWORD_PERFORMANCE_GLITCH'),
    },
  };

  return cachedUsers;
}

// Default export for backwards compatibility - use getUsers() to load
export const users: Record<string, User> = Object.create(null) as Record<string, User>;

// Intentionally invalid — used to test the negative/rejection path, so this
// is test data (a deliberately wrong value), not a secret worth externalizing.
export const invalidUser: User = {
  username: 'invalid_user',
  password: 'wrong_password',
};

export interface Customer {
  firstName: string;
  lastName: string;
  postalCode: string;
}

// Not a credential — just checkout form data, so no need to source this from env.
export const customers: Record<string, Customer> = {
  default: customerData,
};
