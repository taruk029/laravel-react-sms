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

const currentEnvironment: Environment = (import.meta.env.VITE_APP_ENV as Environment) || 'development';

const configs: Record<Environment, Config> = {
  development: {
    baseUrl: 'http://localhost:8000/api',
  },
  staging: {
    baseUrl: 'https://staging-api.smshub.example.com/api',
  },
  production: {
    baseUrl: 'https://api.smshub.example.com/api',
  },
};

export const API_CONFIG = configs[currentEnvironment];

export default API_CONFIG;
