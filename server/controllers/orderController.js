import Joi from 'joi';
import { query } from '../config/db.js';
import { notificationService } from '../services/notificationService.js';

export const orderSchemas = {
  create: Joi.object({
    body: Joi.object({
      customer_id: Joi.number().required(),
      restaurant_id: Joi.number().required(),
      livreur_id: Joi.number().optional(),
      payment_method: Joi.string().valid('cash', 'wave', 'orange_money').required(),
      delivery_address: Joi.string().required(),
      customer_phone: Joi.string().required(),
      notes: Joi.string().allow('', null),
      delivery_fee: Joi.number().default(0),
      items: Joi.array()
        .items(
          Joi.object({
            menu_item_id: Joi.number().required(),
            name: Joi.string().required(),
            price: Joi.number().required(),
            quantity: Joi.number().min(1).default(1),
            options: Joi.array().items(Joi.object()).default([]),
          })
        )
        .min(1)
        .required(),
    }),
    params: Joi.object({}),
    query: Joi.object({}),
  }),
  updateStatus: Joi.object({
    params: Joi.object({ id: Joi.number().required() }),
    body: Joi.object({ status: Joi.string().required() }),
    query: Joi.object({}),
  }),
  assignDriver: Joi.object({
    params: Joi.object({ id: Joi.number().required() }),
    body: Joi.object({ livreur_id: Joi.number().required() }),
    query: Joi.object({}),
  }),
};

export const listOrders = async (_req, res, next) => {
  try {
    const [rows] = await query(
      `SELECT o.*, r.name AS restaurant_name, u.name AS customer_name FROM orders o
       JOIN restaurants r ON r.id = o.restaurant_id
       JOIN users u ON u.id = o.customer_id
       ORDER BY o.created_at DESC LIMIT 200`
    );
    res.json(rows);
  } catch (error) {
    next(error);
  }
};

export const createOrder = async (req, res, next) => {
  try {
    const { customer_id, restaurant_id, livreur_id, payment_method, delivery_address, customer_phone, notes, delivery_fee, items } =
      req.body;
    const itemsTotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const total = itemsTotal + (delivery_fee || 0);
    const [result] = await query(
      `INSERT INTO orders (customer_id, restaurant_id, livreur_id, status, total, delivery_fee, payment_method, delivery_address, customer_phone, notes, tracking_code)
       VALUES (:customer_id, :restaurant_id, :livreur_id, 'pending', :total, :delivery_fee, :payment_method, :delivery_address, :customer_phone, :notes, :tracking_code)`,
      {
        customer_id,
        restaurant_id,
        livreur_id: livreur_id || null,
        total,
        delivery_fee: delivery_fee || 0,
        payment_method,
        delivery_address,
        customer_phone,
        notes,
        tracking_code: `MF-${Date.now()}`,
      }
    );

    for (const item of items) {
      await query(
        `INSERT INTO order_items (order_id, menu_item_id, name, price, quantity, options)
         VALUES (:order_id, :menu_item_id, :name, :price, :quantity, :options)`,
        { order_id: result.insertId, ...item, options: JSON.stringify(item.options || []) }
      );
    }

    notificationService.notifyUser(customer_id, { type: 'order', message: 'Commande créée', orderId: result.insertId });

    res.status(201).json({ id: result.insertId, total, status: 'pending' });
  } catch (error) {
    next(error);
  }
};

export const getOrder = async (req, res, next) => {
  try {
    const { id } = req.params;
    const [orders] = await query('SELECT * FROM orders WHERE id = :id', { id });
    if (!Array.isArray(orders) || orders.length === 0) {
      return res.status(404).json({ message: 'Commande introuvable' });
    }
    const [items] = await query('SELECT * FROM order_items WHERE order_id = :id', { id });
    res.json({ ...orders[0], items });
  } catch (error) {
    next(error);
  }
};

export const updateStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    await query('UPDATE orders SET status = :status WHERE id = :id', { id, status });
    notificationService.notifyUser(req.user?.id || 0, { type: 'order-status', status, orderId: Number(id) });
    res.json({ id: Number(id), status });
  } catch (error) {
    next(error);
  }
};

export const assignDriver = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { livreur_id } = req.body;
    await query('UPDATE orders SET livreur_id = :livreur_id WHERE id = :id', { id, livreur_id });
    notificationService.notifyUser(livreur_id, { type: 'delivery', message: 'Nouvelle course assignée', orderId: Number(id) });
    res.json({ id: Number(id), livreur_id });
  } catch (error) {
    next(error);
  }
};

export const cancelOrder = async (req, res, next) => {
  try {
    const { id } = req.params;
    await query('UPDATE orders SET status = "cancelled" WHERE id = :id', { id });
    res.json({ id: Number(id), status: 'cancelled' });
  } catch (error) {
    next(error);
  }
};

export const restaurantOrders = async (req, res, next) => {
  try {
    const { restaurantId } = req.params;
    const [rows] = await query('SELECT * FROM orders WHERE restaurant_id = :restaurantId ORDER BY created_at DESC', { restaurantId });
    res.json(rows);
  } catch (error) {
    next(error);
  }
};

export const driverOrders = async (req, res, next) => {
  try {
    const { livreurId } = req.params;
    const [rows] = await query('SELECT * FROM orders WHERE livreur_id = :livreurId ORDER BY created_at DESC', { livreurId });
    res.json(rows);
  } catch (error) {
    next(error);
  }
};

export const orderTimeline = async (req, res, next) => {
  try {
    const { id } = req.params;
    const [events] = await query('SELECT * FROM gps_events WHERE order_id = :id ORDER BY captured_at DESC', { id });
    res.json(events);
  } catch (error) {
    next(error);
  }
};
