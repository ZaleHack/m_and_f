import { Router } from 'express';
import { authenticate } from '../../middleware/authMiddleware.js';
import { validate } from '../../middleware/validate.js';
import { authSchemas, login, me, register } from '../../controllers/authController.js';

const router = Router();

router.post('/register', validate(authSchemas.register), register);
router.post('/login', validate(authSchemas.login), login);
router.get('/me', authenticate, me);

export default router;
