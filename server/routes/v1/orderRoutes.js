import { Router } from 'express';
import { authenticate, requireRoles } from '../../middleware/authMiddleware.js';
import { validate } from '../../middleware/validate.js';
import {
  assignDriver,
  cancelOrder,
  createOrder,
  driverOrders,
  getOrder,
  listOrders,
  orderSchemas,
  orderTimeline,
  restaurantOrders,
  updateStatus,
} from '../../controllers/orderController.js';

const router = Router();

router.get('/', authenticate, listOrders);
router.post('/', authenticate, validate(orderSchemas.create), createOrder);
router.get('/:id', authenticate, getOrder);
router.patch('/:id/status', authenticate, validate(orderSchemas.updateStatus), updateStatus);
router.patch('/:id/assign-driver', authenticate, requireRoles('admin', 'restaurant'), validate(orderSchemas.assignDriver), assignDriver);
router.delete('/:id', authenticate, cancelOrder);
router.get('/:id/timeline', authenticate, orderTimeline);
router.get('/restaurants/:restaurantId/orders', authenticate, restaurantOrders);
router.get('/livreurs/:livreurId/orders', authenticate, driverOrders);
router.get('/:id/payment', authenticate, getOrder);
router.post('/:id/rating', authenticate, (_req, res) => res.status(202).json({ message: 'Notation enregistrée (stub)' }));
router.post('/:id/reopen', authenticate, requireRoles('admin'), (_req, res) => res.json({ status: 'reopened' }));
router.post('/:id/dispatch', authenticate, requireRoles('admin', 'restaurant'), (_req, res) => res.json({ status: 'dispatched' }));
router.get('/:id/events', authenticate, orderTimeline);

export default router;
