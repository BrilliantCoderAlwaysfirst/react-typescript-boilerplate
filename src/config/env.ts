/**
 * Environment variables configuration
 *
 * This file centralizes all environment variable access.
 * Always use this instead of directly accessing import.meta.env
 */

interface EnvConfig {
  appName: string;
  apiBaseUrl: string;
  apiTimeout: number;
  authTokenKey: string;
  isDevelopment: boolean;
  isProduction: boolean;
}

const env: EnvConfig = {
  appName: import.meta.env.VITE_APP_NAME || "React TypeScript Boilerplate",
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL || "http://localhost:3000",
  apiTimeout: Number(import.meta.env.VITE_API_TIMEOUT) || 30000,
  authTokenKey: import.meta.env.VITE_AUTH_TOKEN_KEY || "token",
  isDevelopment: import.meta.env.MODE === "development",
  isProduction: import.meta.env.MODE === "production",
};

export default env;
