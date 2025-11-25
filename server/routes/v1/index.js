import { Router } from 'express';
import analyticsRoutes from './analyticsRoutes.js';
import authRoutes from './authRoutes.js';
import adminRoutes from './adminRoutes.js';
import geoRoutes from './geoRoutes.js';
import menuRoutes from './menuRoutes.js';
import notificationRoutes from './notificationRoutes.js';
import orderRoutes from './orderRoutes.js';
import paymentRoutes from './paymentRoutes.js';
import restaurantRoutes from './restaurantRoutes.js';
import uploadRoutes from './uploadRoutes.js';
import userRoutes from './userRoutes.js';

const router = Router();

router.use('/auth', authRoutes);
router.use('/admin', adminRoutes);
router.use('/users', userRoutes);
router.use('/restaurants', restaurantRoutes);
router.use('/menus', menuRoutes);
router.use('/orders', orderRoutes);
router.use('/payments', paymentRoutes);
router.use('/geo', geoRoutes);
router.use('/notifications', notificationRoutes);
router.use('/uploads', uploadRoutes);
router.use('/analytics', analyticsRoutes);

export default router;
