import { Router } from 'express';
import { authenticate, requireRoles } from '../../middleware/authMiddleware.js';
import { validate } from '../../middleware/validate.js';
import {
  addMenuOption,
  createMenuItem,
  listMenuByRestaurant,
  menuSchemas,
  toggleAvailability,
  updateMenuItem,
} from '../../controllers/menuController.js';

const router = Router();

router.get('/restaurants/:restaurantId/menus', authenticate, listMenuByRestaurant);
router.get('/restaurants/:restaurantId/menus/:id', authenticate, listMenuByRestaurant);
router.post('/restaurants/:restaurantId/menus', authenticate, requireRoles('restaurant', 'admin'), validate(menuSchemas.createItem), createMenuItem);
router.put('/menus/:id', authenticate, requireRoles('restaurant', 'admin'), updateMenuItem);
router.patch('/menus/:id/availability', authenticate, requireRoles('restaurant', 'admin'), validate(menuSchemas.toggleAvailability), toggleAvailability);
router.post('/menus/:menuItemId/options', authenticate, requireRoles('restaurant', 'admin'), addMenuOption);

export default router;
