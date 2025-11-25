import { Router } from 'express';
import { authenticate, requireRoles } from '../../middleware/authMiddleware.js';
import { validate } from '../../middleware/validate.js';
import { listNotifications, markNotificationRead, notificationSchemas, sendBroadcast } from '../../controllers/notificationController.js';

const router = Router();

router.get('/', authenticate, listNotifications);
router.patch('/:id/read', authenticate, validate(notificationSchemas.markRead), markNotificationRead);
router.post('/broadcast', authenticate, requireRoles('admin'), sendBroadcast);
router.post('/push-test', authenticate, (_req, res) => res.json({ message: 'push envoyé (stub)' }));

export default router;
