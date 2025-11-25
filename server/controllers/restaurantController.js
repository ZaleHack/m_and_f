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
      cuisine_types: Joi.array().items(Joi.string()).optional(),
      image_url: Joi.string().uri().allow('', null),
      cover_image_url: Joi.string().uri().allow('', null),
      delivery_time: Joi.string().allow('', null),
      delivery_fee: Joi.number().default(0),
      minimum_order: Joi.number().default(0),
      commission_rate: Joi.number().default(10),
      opening_hours: Joi.object().unknown(true).optional(),
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

const parseJsonField = (value) => {
  if (!value) return null;
  if (typeof value === 'object') return value;
  try {
    return JSON.parse(value);
  } catch (_err) {
    return null;
  }
};

const mapRestaurantRow = (row) => ({
  id: row.id,
  owner_id: row.owner_id,
  name: row.name,
  description: row.description,
  address: row.address,
  phone: row.phone,
  email: row.email,
  image_url: row.image_url,
  cover_image_url: row.cover_image_url,
  is_open: Boolean(row.is_open),
  is_verified: Boolean(row.is_verified),
  rating: Number(row.rating ?? 0),
  total_reviews: row.total_reviews ?? 0,
  delivery_time: row.delivery_time,
  delivery_fee: Number(row.delivery_fee ?? 0),
  minimum_order: Number(row.minimum_order ?? 0),
  commission_rate: Number(row.commission_rate ?? 0),
  opening_hours: parseJsonField(row.opening_hours),
  cuisine_types: parseJsonField(row.cuisine_types),
  created_at: row.created_at,
  updated_at: row.updated_at,
});

export const listRestaurants = async (_req, res, next) => {
  try {
    const [rows] = await query(
      `SELECT id, owner_id, name, description, address, phone, email, image_url, cover_image_url, is_open, is_verified,
              rating, total_reviews, delivery_time, delivery_fee, minimum_order, commission_rate,
              opening_hours, cuisine_types, created_at, updated_at
       FROM restaurants
       ORDER BY created_at DESC`
    );
    res.json(rows.map(mapRestaurantRow));
  } catch (error) {
    next(error);
  }
};

export const createRestaurant = async (req, res, next) => {
  try {
    const {
      owner_id,
      name,
      description,
      address,
      phone,
      email,
      category,
      cuisine_types,
      image_url,
      cover_image_url,
      delivery_time,
      delivery_fee = 0,
      minimum_order = 0,
      commission_rate = 10,
      opening_hours,
    } = req.body;

    const cuisines = Array.isArray(cuisine_types) ? cuisine_types : category ? [category] : null;
    const [result] = await query(
      `INSERT INTO restaurants (owner_id, name, description, address, phone, email, image_url, cover_image_url, delivery_time, cuisine_types, opening_hours, delivery_fee, minimum_order, commission_rate)
       VALUES (:owner_id, :name, :description, :address, :phone, :email, :image_url, :cover_image_url, :delivery_time, :cuisine_types, :opening_hours, :delivery_fee, :minimum_order, :commission_rate)`,
      {
        owner_id,
        name,
        description,
        address,
        phone,
        email,
        image_url,
        cover_image_url,
        delivery_time,
        cuisine_types: cuisines ? JSON.stringify(cuisines) : null,
        opening_hours: opening_hours ? JSON.stringify(opening_hours) : null,
        delivery_fee,
        minimum_order,
        commission_rate,
      }
    );
    const now = new Date().toISOString();
    res.status(201).json(
      mapRestaurantRow({
        id: result.insertId,
        owner_id,
        name,
        description,
        address,
        phone,
        email,
        image_url,
        cover_image_url,
        delivery_time,
        cuisine_types: cuisines,
        opening_hours,
        delivery_fee,
        minimum_order,
        commission_rate,
        is_open: 1,
        is_verified: 0,
        rating: 0,
        total_reviews: 0,
        created_at: now,
        updated_at: now,
      })
    );
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
