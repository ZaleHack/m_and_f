import { query } from '../config/db.js';

export const globalMetrics = async (_req, res, next) => {
  try {
    const [[users]] = await query('SELECT COUNT(*) AS total_users FROM users');
    const [[orders]] = await query('SELECT COUNT(*) AS total_orders, SUM(total) AS revenue FROM orders');
    const [[restaurants]] = await query('SELECT COUNT(*) AS total_restaurants FROM restaurants');
    res.json({
      users: users.total_users,
      orders: orders.total_orders,
      revenue: Number(orders.revenue || 0),
      restaurants: restaurants.total_restaurants,
    });
  } catch (error) {
    next(error);
  }
};

export const restaurantAnalytics = async (req, res, next) => {
  try {
    const { restaurantId } = req.params;
    const [[orders]] = await query('SELECT COUNT(*) AS total_orders, SUM(total) AS revenue FROM orders WHERE restaurant_id = :restaurantId', {
      restaurantId,
    });
    res.json({ restaurantId: Number(restaurantId), ...orders });
  } catch (error) {
    next(error);
  }
};

export const deliveryAnalytics = async (req, res, next) => {
  try {
    const { livreurId } = req.params;
    const [[orders]] = await query(
      "SELECT COUNT(*) AS deliveries, SUM(total) AS revenue FROM orders WHERE livreur_id = :livreurId AND status = 'delivered'",
      { livreurId }
    );
    res.json({ livreurId: Number(livreurId), ...orders });
  } catch (error) {
    next(error);
  }
};
