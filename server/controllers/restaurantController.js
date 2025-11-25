import Joi from 'joi';
import { query } from '../config/db.js';

export const restaurantSchemas = {
  create: Joi.object({
    body: Joi.object({
      owner_id: Joi.number().required(),
      name: Joi.string().required(),
      description: Joi.string().allow('', null),
      address: Joi.string().required(),
      phone: Joi.string().required(),
      email: Joi.string().email().required(),
      category: Joi.string().allow('', null),
      delivery_fee: Joi.number().default(0),
      minimum_order: Joi.number().default(0),
    }),
    params: Joi.object({}),
    query: Joi.object({}),
  }),
  toggle: Joi.object({
    params: Joi.object({ id: Joi.number().required() }),
    body: Joi.object({ is_open: Joi.boolean().required() }),
    query: Joi.object({}),
  }),
};

export const listRestaurants = async (_req, res, next) => {
  try {
    const [rows] = await query(
      `SELECT id, name, owner_id, phone, email, address, rating, delivery_fee, minimum_order, is_open, is_verified, commission_rate FROM restaurants ORDER BY created_at DESC`
    );
    res.json(rows);
  } catch (error) {
    next(error);
  }
};

export const createRestaurant = async (req, res, next) => {
  try {
    const { owner_id, name, description, address, phone, email, category, delivery_fee, minimum_order } = req.body;
    const [result] = await query(
      `INSERT INTO restaurants (owner_id, name, description, address, phone, email, cuisine_types, delivery_fee, minimum_order)
       VALUES (:owner_id, :name, :description, :address, :phone, :email, :cuisine_types, :delivery_fee, :minimum_order)`,
      {
        owner_id,
        name,
        description,
        address,
        phone,
        email,
        cuisine_types: category ? JSON.stringify([category]) : null,
        delivery_fee,
        minimum_order,
      }
    );
    res.status(201).json({ id: result.insertId, name, owner_id, category });
  } catch (error) {
    next(error);
  }
};

export const toggleRestaurant = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { is_open } = req.body;
    await query('UPDATE restaurants SET is_open = :is_open WHERE id = :id', { id, is_open: is_open ? 1 : 0 });
    res.json({ id: Number(id), is_open });
  } catch (error) {
    next(error);
  }
};

export const updateVerification = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { is_verified } = req.body;
    await query('UPDATE restaurants SET is_verified = :is_verified WHERE id = :id', {
      id,
      is_verified: is_verified ? 1 : 0,
    });
    res.json({ id: Number(id), is_verified });
  } catch (error) {
    next(error);
  }
};

export const categorySummary = async (_req, res, next) => {
  try {
    const [rows] = await query(
      `SELECT JSON_EXTRACT(cuisine_types, '$') as cuisines, COUNT(*) as restaurants FROM restaurants GROUP BY cuisine_types`
    );
    res.json(rows);
  } catch (error) {
    next(error);
  }
};
