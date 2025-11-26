import bcrypt from 'bcryptjs';
import Joi from 'joi';
import { query } from '../config/db.js';
import { signUser } from '../utils/jwt.js';

export const authSchemas = {
  register: Joi.object({
    body: Joi.object({
      email: Joi.string().email().required(),
      password: Joi.string().min(6).required(),
      name: Joi.string().required(),
      phone: Joi.string().required(),
      role: Joi.string().valid('client', 'restaurant', 'livreur', 'admin').required(),
      address: Joi.string().allow('', null),
    }),
    params: Joi.object({}),
    query: Joi.object({}),
  }),
  login: Joi.object({
    body: Joi.object({
      email: Joi.string().email().required(),
      password: Joi.string().required(),
    }),
    params: Joi.object({}),
    query: Joi.object({}),
  }),
};

export const register = async (req, res, next) => {
  try {
    const { email, password, name, phone, role, address } = req.body;
    const hashed = await bcrypt.hash(password, 10);
    const [result] = await query(
      `INSERT INTO users (email, password, name, phone, role, address, is_verified) VALUES (:email, :password, :name, :phone, :role, :address, 1)`,
      { email, password: hashed, name, phone, role, address }
    );
    const token = signUser({ id: result.insertId, email, role, name });
    res.status(201).json({ token, user: { id: result.insertId, email, role, name } });
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      res.status(409).json({ message: 'Email déjà utilisé' });
      return;
    }
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const [rows] = await query('SELECT * FROM users WHERE email = :email', { email });
    if (!Array.isArray(rows) || rows.length === 0) {
      return res.status(401).json({ message: 'Identifiants invalides' });
    }
    const user = rows[0];
    const passwordsMatch = (await bcrypt.compare(password, user.password)) || user.password === password;
    if (!passwordsMatch) {
      return res.status(401).json({ message: 'Identifiants invalides' });
    }
    const token = signUser(user);
    res.json({ token, user: { id: user.id, email: user.email, role: user.role, name: user.name } });
  } catch (error) {
    next(error);
  }
};

export const logout = async (_req, res, next) => {
  try {
    res.json({ message: 'Déconnexion réussie' });
  } catch (error) {
    next(error);
  }
};

export const me = async (req, res, next) => {
  try {
    const [rows] = await query('SELECT id, email, role, name, phone, address, avatar_url FROM users WHERE id = :id', {
      id: req.user.id,
    });
    if (!Array.isArray(rows) || rows.length === 0) {
      return res.status(404).json({ message: 'Utilisateur introuvable' });
    }
    res.json(rows[0]);
  } catch (error) {
    next(error);
  }
};
