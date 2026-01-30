import { configSchema } from './schema';
import type { AppConfig } from '../types/config.types';

function loadConfig(): AppConfig {
  const result = configSchema.safeParse(process.env);

  if (!result.success) {
    const errors = result.error.errors
      .map((e) => `${e.path.join('.')}: ${e.message}`)
      .join('\n');
    throw new Error(`Configuration validation failed:\n${errors}`);
  }

  const env = result.data;

  return {
    nodeEnv: env.NODE_ENV,
    port: env.PORT,
    apiKey: env.API_KEY,
    apiVersion: env.API_VERSION,
    apiTimeoutMs: env.API_TIMEOUT_MS,
    rateLimitWindowMs: env.RATE_LIMIT_WINDOW_MS,
    rateLimitMaxRequests: env.RATE_LIMIT_MAX_REQUESTS,
    logLevel: env.LOG_LEVEL,
    logFormat: env.LOG_FORMAT,
  };
}

export const config = loadConfig();
