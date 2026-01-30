import rateLimit from 'express-rate-limit';
import { config } from '../config';
import { HTTP_STATUS } from '../utils/constants';
import type { APIResponse } from '../types/wispr.types';

export const rateLimiter = rateLimit({
  windowMs: config.rateLimitWindowMs,
  max: config.rateLimitMaxRequests,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    code: HTTP_STATUS.FORBIDDEN,
    message: 'Too many requests, please try again later',
  } as APIResponse,
  keyGenerator: (req) => {
    return req.ip || req.headers['x-forwarded-for']?.toString() || 'unknown';
  },
});

export const loginRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20, // 20 login attempts per 15 minutes
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    code: HTTP_STATUS.FORBIDDEN,
    message: 'Too many login attempts, please try again later',
  } as APIResponse,
  keyGenerator: (req) => {
    return req.ip || req.headers['x-forwarded-for']?.toString() || 'unknown';
  },
});
