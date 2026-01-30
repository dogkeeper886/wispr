export interface AppConfig {
  nodeEnv: string;
  port: number;
  apiKey: string;
  apiVersion: string;
  apiTimeoutMs: number;
  rateLimitWindowMs: number;
  rateLimitMaxRequests: number;
  logLevel: string;
  logFormat: string;
}
