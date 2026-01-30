import { Router } from 'express';
import { validate } from '../middleware/validate';
import { loginRateLimiter } from '../middleware/rate-limiter';
import {
  loginSchema,
  loginAsyncSchema,
  statusSchema,
  logoutSchema,
} from '../validators/auth.validator';
import * as authController from '../controllers/auth.controller';

const router = Router();

router.post(
  '/login',
  loginRateLimiter,
  validate(loginSchema),
  authController.login
);

router.post(
  '/login-async',
  loginRateLimiter,
  validate(loginAsyncSchema),
  authController.loginAsync
);

router.post('/status', validate(statusSchema), authController.status);

router.post('/logout', validate(logoutSchema), authController.logout);

export default router;
