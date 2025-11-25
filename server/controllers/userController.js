import Joi from 'joi';
import { query } from '../config/db.js';

export const userSchemas = {
  list: Joi.object({
    query: Joi.object({ role: Joi.string().valid('client', 'restaurant', 'livreur', 'admin').optional() }),
    params: Joi.object({}),
    body: Joi.object({}),
  }),
  updateStatus: Joi.object({
    params: Joi.object({ id: Joi.number().required() }),
    body: Joi.object({ is_active: Joi.boolean().required(), role: Joi.string().optional() }),
    query: Joi.object({}),
  }),
};

export const listUsers = async (req, res, next) => {
  try {
    const roleFilter = req.query.role;
    const [rows] = await query(
      `SELECT id, email, role, name, phone, is_active, is_verified, created_at FROM users ${roleFilter ? 'WHERE role = :role' : ''} ORDER BY created_at DESC`,
      roleFilter ? { role: roleFilter } : {}
    );
    res.json(rows);
  } catch (error) {
    next(error);
  }
};

export const updateUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { is_active, role } = req.body;
    await query('UPDATE users SET is_active = :is_active, role = COALESCE(:role, role) WHERE id = :id', {
      id,
      is_active: is_active ? 1 : 0,
      role,
    });
    res.json({ id: Number(id), is_active, role });
  } catch (error) {
    next(error);
  }
};
