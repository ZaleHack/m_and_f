import { Router } from 'express';
import { authenticate, requireRoles } from '../../middleware/authMiddleware.js';
import { validate } from '../../middleware/validate.js';
import { listUsers, updateUser, userSchemas } from '../../controllers/userController.js';

const router = Router();

router.get('/', authenticate, requireRoles('admin'), validate(userSchemas.list), listUsers);
router.patch('/:id', authenticate, requireRoles('admin'), validate(userSchemas.updateStatus), updateUser);

export default router;
