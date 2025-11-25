import { Router } from 'express';
import { authenticate, requireRoles } from '../../middleware/authMiddleware.js';
import { validate } from '../../middleware/validate.js';
import {
  categorySummary,
  createRestaurant,
  listRestaurants,
  restaurantSchemas,
  toggleRestaurant,
  updateVerification,
} from '../../controllers/restaurantController.js';

const router = Router();

router.get('/', authenticate, listRestaurants);
router.get('/categories/summary', authenticate, categorySummary);
router.post('/', authenticate, requireRoles('admin'), validate(restaurantSchemas.create), createRestaurant);
router.patch('/:id/open', authenticate, requireRoles('admin', 'restaurant'), validate(restaurantSchemas.toggle), toggleRestaurant);
router.patch('/:id/verify', authenticate, requireRoles('admin'), validate(restaurantSchemas.toggle), updateVerification);

export default router;
