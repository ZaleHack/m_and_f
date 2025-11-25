import { Router } from 'express';
import { authenticate } from '../../middleware/authMiddleware.js';
import { validate } from '../../middleware/validate.js';
import { geoSchemas, latestLocation, pushLocation, routeHistory } from '../../controllers/geoController.js';

const router = Router();

router.post('/livreurs/:livreurId/locations', authenticate, validate(geoSchemas.pushLocation), pushLocation);
router.get('/livreurs/:livreurId/locations/latest', authenticate, latestLocation);
router.get('/orders/:orderId/locations', authenticate, routeHistory);
router.get('/livreurs/:livreurId/heatmap', authenticate, (_req, res) => res.json({ clusters: [] }));
router.post('/livreurs/:livreurId/status', authenticate, (_req, res) => res.json({ status: 'online' }));

export default router;
