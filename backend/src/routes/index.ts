import { Router } from 'express';
import authRoutes from './auth.routes';
import sessionRoutes from './session.routes';
import cryptoRoutes from './crypto.routes';
import healthRoutes from './health.routes';

const router = Router();

router.use('/api/v1/auth', authRoutes);
router.use('/api/v1/session', sessionRoutes);
router.use('/api/v1/crypto', cryptoRoutes);
router.use('/health', healthRoutes);

export default router;
