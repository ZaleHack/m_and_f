import bcrypt from 'bcryptjs';
import Joi from 'joi';
import { env } from '../config/env.js';
import { query } from '../config/db.js';

const mapUserStatus = (row) => {
  if (!row.is_active) return 'suspended';
  if (!row.is_verified) return 'invited';
  return 'active';
};

const toAdminUser = (row) => ({
  id: row.id,
  name: row.name,
  email: row.email,
  phone: row.phone,
  role: row.role,
  createdAt: row.created_at,
  status: mapUserStatus(row),
});

const mapRestaurantStatus = (row) => {
  if (!row.is_verified && !row.is_open) return 'suspended';
  if (row.is_verified) return 'active';
  return 'pending';
};

const toAdminRestaurant = (row) => ({
  id: row.id,
  name: row.name,
  owner: row.owner_name || 'Propriétaire inconnu',
  address: row.address,
  phone: row.phone,
  email: row.email,
  category: Array.isArray(row.cuisine_types)
    ? row.cuisine_types[0]
    : typeof row.cuisine_types === 'string'
      ? JSON.parse(row.cuisine_types || '[]')[0]
      : undefined,
  status: mapRestaurantStatus(row),
  isOpen: Boolean(row.is_open),
  createdAt: row.created_at,
});

const DEFAULT_USER_PASSWORD = env.defaultUserPassword || 'changeme';

export const adminSchemas = {
  listUsers: Joi.object({
    query: Joi.object({}),
    params: Joi.object({}),
    body: Joi.object({}),
  }),
  createUser: Joi.object({
    body: Joi.object({
      name: Joi.string().required(),
      email: Joi.string().email().required(),
      phone: Joi.string().required(),
      role: Joi.string().valid('admin', 'restaurant', 'livreur', 'client').required(),
      status: Joi.string().valid('active', 'invited', 'suspended').default('invited'),
    }),
    params: Joi.object({}),
    query: Joi.object({}),
  }),
  updateUser: Joi.object({
    params: Joi.object({ id: Joi.number().required() }),
    body: Joi.object({
      name: Joi.string().required(),
      email: Joi.string().email().required(),
      phone: Joi.string().required(),
      role: Joi.string().valid('admin', 'restaurant', 'livreur', 'client').required(),
      status: Joi.string().valid('active', 'invited', 'suspended').required(),
    }),
    query: Joi.object({}),
  }),
  userId: Joi.object({
    params: Joi.object({ id: Joi.number().required() }),
    body: Joi.object({}),
    query: Joi.object({}),
  }),
  listRestaurants: Joi.object({
    query: Joi.object({}),
    params: Joi.object({}),
    body: Joi.object({}),
  }),
  createRestaurant: Joi.object({
    body: Joi.object({
      name: Joi.string().required(),
      owner: Joi.string().required(),
      address: Joi.string().required(),
      phone: Joi.string().required(),
      email: Joi.string().email().required(),
      category: Joi.string().allow('', null),
      isOpen: Joi.boolean().default(false),
    }),
    params: Joi.object({}),
    query: Joi.object({}),
  }),
  restaurantId: Joi.object({
    params: Joi.object({ id: Joi.number().required() }),
    body: Joi.object({}),
    query: Joi.object({}),
  }),
  updateRestaurantStatus: Joi.object({
    params: Joi.object({ id: Joi.number().required() }),
    body: Joi.object({ status: Joi.string().valid('active', 'pending', 'suspended').required() }),
    query: Joi.object({}),
  }),
};

export const listAdminUsers = async (_req, res, next) => {
  try {
    const [rows] = await query(
      'SELECT id, email, name, phone, role, is_active, is_verified, created_at FROM users ORDER BY created_at DESC'
    );
    res.json(rows.map(toAdminUser));
  } catch (error) {
    next(error);
  }
};

export const createAdminUser = async (req, res, next) => {
  try {
    const { name, email, phone, role, status } = req.body;
    const hashed = await bcrypt.hash(DEFAULT_USER_PASSWORD, 10);
    const is_active = status !== 'suspended';
    const is_verified = status === 'active';

    const [result] = await query(
      `INSERT INTO users (email, password, name, phone, role, is_active, is_verified)
       VALUES (:email, :password, :name, :phone, :role, :is_active, :is_verified)`,
      { email, password: hashed, name, phone, role, is_active, is_verified }
    );

    const [rows] = await query(
      'SELECT id, email, name, phone, role, is_active, is_verified, created_at FROM users WHERE id = :id',
      { id: result.insertId }
    );

    res.status(201).json(toAdminUser(rows[0]));
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      res.status(409).json({ message: 'Email déjà utilisé' });
      return;
    }
    next(error);
  }
};

export const updateAdminUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, email, phone, role, status } = req.body;
    const is_active = status !== 'suspended';
    const is_verified = status === 'active';

    await query(
      `UPDATE users SET name = :name, email = :email, phone = :phone, role = :role,
        is_active = :is_active, is_verified = :is_verified WHERE id = :id`,
      { id, name, email, phone, role, is_active, is_verified }
    );

    const [rows] = await query(
      'SELECT id, email, name, phone, role, is_active, is_verified, created_at FROM users WHERE id = :id',
      { id }
    );

    if (!Array.isArray(rows) || rows.length === 0) {
      res.status(404).json({ message: 'Utilisateur introuvable' });
      return;
    }

    res.json(toAdminUser(rows[0]));
  } catch (error) {
    next(error);
  }
};

export const deleteAdminUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    await query('DELETE FROM users WHERE id = :id', { id });
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

const getOrCreateOwner = async ({ owner, email, phone }) => {
  const hashed = await bcrypt.hash(DEFAULT_USER_PASSWORD, 10);
  try {
    const [result] = await query(
      `INSERT INTO users (email, password, name, phone, role, is_active, is_verified)
       VALUES (:email, :password, :name, :phone, 'restaurant', 1, 0)`,
      { email, password: hashed, name: owner, phone }
    );
    return result.insertId;
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      const [rows] = await query('SELECT id FROM users WHERE email = :email', { email });
      if (Array.isArray(rows) && rows.length > 0) return rows[0].id;
    }
    throw error;
  }
};

export const listAdminRestaurants = async (_req, res, next) => {
  try {
    const [rows] = await query(
      `SELECT r.id, r.name, r.address, r.phone, r.email, r.is_open, r.is_verified, r.cuisine_types, r.created_at, u.name AS owner_name
       FROM restaurants r
       LEFT JOIN users u ON u.id = r.owner_id
       ORDER BY r.created_at DESC`
    );

    res.json(rows.map(toAdminRestaurant));
  } catch (error) {
    next(error);
  }
};

export const createAdminRestaurant = async (req, res, next) => {
  try {
    const { name, owner, address, phone, email, category, isOpen } = req.body;
    const ownerId = await getOrCreateOwner({ owner, email, phone });

    const [result] = await query(
      `INSERT INTO restaurants (owner_id, name, address, phone, email, cuisine_types, is_open, is_verified)
       VALUES (:owner_id, :name, :address, :phone, :email, :cuisine_types, :is_open, 0)`,
      {
        owner_id: ownerId,
        name,
        address,
        phone,
        email,
        cuisine_types: category ? JSON.stringify([category]) : null,
        is_open: isOpen ? 1 : 0,
      }
    );

    res.status(201).json(
      toAdminRestaurant({
        id: result.insertId,
        name,
        owner_name: owner,
        address,
        phone,
        email,
        cuisine_types: category ? [category] : null,
        is_open: isOpen ? 1 : 0,
        is_verified: 0,
        created_at: new Date().toISOString(),
      })
    );
  } catch (error) {
    next(error);
  }
};

export const toggleAdminRestaurantOpen = async (req, res, next) => {
  try {
    const { id } = req.params;
    const [rows] = await query('SELECT is_open FROM restaurants WHERE id = :id', { id });
    if (!Array.isArray(rows) || rows.length === 0) {
      res.status(404).json({ message: 'Restaurant introuvable' });
      return;
    }

    const current = Boolean(rows[0].is_open);
    const newState = current ? 0 : 1;
    await query('UPDATE restaurants SET is_open = :is_open WHERE id = :id', { id, is_open: newState });
    res.json({ id: Number(id), isOpen: Boolean(newState) });
  } catch (error) {
    next(error);
  }
};

export const updateAdminRestaurantStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const is_verified = status === 'active' ? 1 : 0;
    const is_open = status === 'suspended' ? 0 : undefined;

    if (is_open !== undefined) {
      await query('UPDATE restaurants SET is_verified = :is_verified, is_open = :is_open WHERE id = :id', {
        id,
        is_verified,
        is_open,
      });
    } else {
      await query('UPDATE restaurants SET is_verified = :is_verified WHERE id = :id', { id, is_verified });
    }

    res.json({ id: Number(id), status });
  } catch (error) {
    next(error);
  }
};
