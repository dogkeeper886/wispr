import { Router } from 'express';
import { validate } from '../middleware/validate';
import { encryptSchema, decryptSchema } from '../validators/crypto.validator';
import * as cryptoController from '../controllers/crypto.controller';

const router = Router();

router.post('/encrypt', validate(encryptSchema), cryptoController.encrypt);

router.post('/decrypt', validate(decryptSchema), cryptoController.decrypt);

export default router;
