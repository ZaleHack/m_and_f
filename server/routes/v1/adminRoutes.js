import { Router } from 'express';
import { authenticate, requireRoles } from '../../middleware/authMiddleware.js';
import { validate } from '../../middleware/validate.js';
import {
  adminSchemas,
  createAdminLivreur,
  createAdminRestaurant,
  createAdminUser,
  deleteAdminUser,
  listAdminLivreurs,
  listAdminRestaurants,
  listAdminUsers,
  updateAdminLivreurStatus,
  toggleAdminRestaurantOpen,
  updateAdminRestaurantStatus,
  updateAdminUser,
} from '../../controllers/adminController.js';

const router = Router();
router.use(authenticate, requireRoles('admin'));

router.get('/users', validate(adminSchemas.listUsers), listAdminUsers);
router.post('/users', validate(adminSchemas.createUser), createAdminUser);
router.put('/users/:id', validate(adminSchemas.updateUser), updateAdminUser);
router.delete('/users/:id', validate(adminSchemas.userId), deleteAdminUser);

router.get('/livreurs', validate(adminSchemas.listLivreurs), listAdminLivreurs);
router.post('/livreurs', validate(adminSchemas.createLivreur), createAdminLivreur);
router.patch('/livreurs/:id/status', validate(adminSchemas.updateLivreurStatus), updateAdminLivreurStatus);

router.get('/restaurants', validate(adminSchemas.listRestaurants), listAdminRestaurants);
router.post('/restaurants', validate(adminSchemas.createRestaurant), createAdminRestaurant);
router.patch('/restaurants/:id/toggle-open', validate(adminSchemas.restaurantId), toggleAdminRestaurantOpen);
router.patch('/restaurants/:id/status', validate(adminSchemas.updateRestaurantStatus), updateAdminRestaurantStatus);

export default router;
