import { Router } from 'express';
import { authenticate } from '../../middleware/authMiddleware.js';
import { validate } from '../../middleware/validate.js';
import { createIntent, paymentCallback, paymentSchemas, paymentStatus, refundPayment } from '../../controllers/paymentController.js';

const router = Router();

router.post('/intent', authenticate, validate(paymentSchemas.intent), createIntent);
router.post('/callback', validate(paymentSchemas.callback), paymentCallback);
router.get('/order/:orderId', authenticate, paymentStatus);
router.post('/:externalId/refund', authenticate, refundPayment);
router.get('/providers', (_req, res) => res.json(['wave', 'orange_money', 'cash']));
router.get('/fees', (_req, res) => res.json({ wave: 1.5, orange_money: 1.5 }));

export default router;
