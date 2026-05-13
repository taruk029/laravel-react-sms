/**
 * Central API Configuration
 * 
 * This file manages the base URL for the backend APIs across different environments.
 * To change the environment, simply update the currentEnvironment variable.
 */

type Environment = 'development' | 'staging' | 'production';

interface Config {
  baseUrl: string;
}

const envValue = import.meta.env.VITE_APP_ENV as string;
const currentEnvironment: Environment = (['development', 'staging', 'production'].includes(envValue) ? envValue : 'development') as Environment;

const configs: Record<Environment, Config> = {
  development: {
    baseUrl: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api',
  },
  staging: {
    baseUrl: import.meta.env.VITE_API_BASE_URL || 'https://staging-api.smshub.example.com/api',
  },
  production: {
    baseUrl: import.meta.env.VITE_API_BASE_URL || 'https://api.smshub.example.com/api',
  },
};

export const API_CONFIG = configs[currentEnvironment] || configs.development;

export default API_CONFIG;
