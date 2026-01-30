import { Router } from 'express';
import { validate } from '../middleware/validate';
import { disconnectSchema } from '../validators/auth.validator';
import * as sessionController from '../controllers/session.controller';

const router = Router();

router.post(
  '/disconnect',
  validate(disconnectSchema),
  sessionController.disconnect
);

export default router;
