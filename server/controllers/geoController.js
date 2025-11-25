import Joi from 'joi';
import { query } from '../config/db.js';

export const geoSchemas = {
  pushLocation: Joi.object({
    params: Joi.object({ livreurId: Joi.number().required() }),
    body: Joi.object({
      order_id: Joi.number().optional(),
      latitude: Joi.number().required(),
      longitude: Joi.number().required(),
      accuracy: Joi.number().optional(),
      speed: Joi.number().optional(),
      heading: Joi.number().optional(),
    }),
    query: Joi.object({}),
  }),
};

export const pushLocation = async (req, res, next) => {
  try {
    const { livreurId } = req.params;
    const { order_id, latitude, longitude, accuracy, speed, heading } = req.body;
    const [result] = await query(
      `INSERT INTO gps_events (livreur_id, order_id, latitude, longitude, accuracy, speed, heading)
       VALUES (:livreur_id, :order_id, :latitude, :longitude, :accuracy, :speed, :heading)`,
      { livreur_id: livreurId, order_id: order_id || null, latitude, longitude, accuracy, speed, heading }
    );
    res.status(201).json({ id: result.insertId, livreur_id: Number(livreurId) });
  } catch (error) {
    next(error);
  }
};

export const latestLocation = async (req, res, next) => {
  try {
    const { livreurId } = req.params;
    const [rows] = await query(
      `SELECT * FROM gps_events WHERE livreur_id = :livreurId ORDER BY captured_at DESC LIMIT 1`,
      { livreurId }
    );
    res.json(rows[0] || null);
  } catch (error) {
    next(error);
  }
};

export const routeHistory = async (req, res, next) => {
  try {
    const { orderId } = req.params;
    const [rows] = await query('SELECT * FROM gps_events WHERE order_id = :orderId ORDER BY captured_at DESC', { orderId });
    res.json(rows);
  } catch (error) {
    next(error);
  }
};
