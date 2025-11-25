import { Router } from 'express';
import { authenticate, requireRoles } from '../../middleware/authMiddleware.js';
import { deliveryAnalytics, globalMetrics, restaurantAnalytics } from '../../controllers/analyticsController.js';

const router = Router();

router.get('/global', authenticate, requireRoles('admin'), globalMetrics);
router.get('/restaurants/:restaurantId', authenticate, requireRoles('admin', 'restaurant'), restaurantAnalytics);
router.get('/livreurs/:livreurId', authenticate, requireRoles('admin', 'livreur'), deliveryAnalytics);
router.get('/orders/status', authenticate, requireRoles('admin'), (_req, res) => res.json({ pending: 0, delivered: 0 }));
router.get('/revenue/providers', authenticate, requireRoles('admin'), (_req, res) => res.json({ wave: 0, orange_money: 0 }));

export default router;
