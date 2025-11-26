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

const toAdminRestaurant = (row) => ({
  id: row.id,
  nom: row.nom,
  utilisateur_id: row.utilisateur_id,
  adresse: row.adresse,
  description: row.description,
  createdAt: row.created_at,
});

const mapLivreurStatus = (row) => {
  if (row.status) return row.status;
  if (!row.is_available) return 'inactive';
  return 'available';
};

const toAdminLivreur = (row) => ({
  id: row.id,
  userId: row.user_id,
  name: row.name,
  email: row.email,
  phone: row.phone,
  vehicle: row.vehicle_type,
  zone: row.zone || '',
  status: mapLivreurStatus(row),
  deliveries: row.total_deliveries || 0,
  rating: Number(row.rating || 0),
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
      nom: Joi.string().required(),
      adresse: Joi.string().required(),
      description: Joi.string().allow('', null),
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
  listLivreurs: Joi.object({
    query: Joi.object({}),
    params: Joi.object({}),
    body: Joi.object({}),
  }),
  createLivreur: Joi.object({
    body: Joi.object({
      name: Joi.string().required(),
      email: Joi.string().email().required(),
      phone: Joi.string().required(),
      vehicle: Joi.string().valid('bike', 'moto', 'car').required(),
      zone: Joi.string().required(),
      status: Joi.string().valid('available', 'busy', 'inactive').default('available'),
    }),
    params: Joi.object({}),
    query: Joi.object({}),
  }),
  updateLivreurStatus: Joi.object({
    params: Joi.object({ id: Joi.number().required() }),
    body: Joi.object({ status: Joi.string().valid('available', 'busy', 'inactive').required() }),
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
    if (error.code === 'ER_DUP_ENTRY') {
      res.status(409).json({ message: 'Email déjà utilisé' });
      return;
    }
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
      `SELECT id, utilisateur_id, nom, adresse, description, created_at
       FROM restaurants
       ORDER BY created_at DESC`
    );

    res.json(rows.map(toAdminRestaurant));
  } catch (error) {
    next(error);
  }
};

export const createAdminRestaurant = async (req, res, next) => {
  try {
    const { nom, adresse, description } = req.body;
    const utilisateurId = req.user?.id;

    if (!utilisateurId) {
      return res.status(400).json({ message: 'Utilisateur requis pour créer un restaurant.' });
    }

    const [result] = await query(
      `INSERT INTO restaurants (utilisateur_id, nom, adresse, description)
       VALUES (:utilisateur_id, :nom, :adresse, :description)`,
      { utilisateur_id: utilisateurId, nom, adresse, description }
    );

    res.status(201).json(
      toAdminRestaurant({
        id: result.insertId,
        utilisateur_id: utilisateurId,
        nom,
        adresse,
        description,
        created_at: new Date().toISOString(),
      })
    );
  } catch (error) {
    next(error);
  }
};

const fetchLivreurById = async (id) => {
  const [rows] = await query(
    `SELECT l.*, u.name, u.email, u.phone
     FROM livreurs l
     JOIN users u ON u.id = l.user_id
     WHERE l.id = :id`,
    { id }
  );
  if (!Array.isArray(rows) || rows.length === 0) return null;
  return toAdminLivreur(rows[0]);
};

export const listAdminLivreurs = async (_req, res, next) => {
  try {
    const [rows] = await query(
      `SELECT l.*, u.name, u.email, u.phone
       FROM livreurs l
       JOIN users u ON u.id = l.user_id
       ORDER BY l.created_at DESC`
    );
    res.json(rows.map(toAdminLivreur));
  } catch (error) {
    next(error);
  }
};

export const createAdminLivreur = async (req, res, next) => {
  try {
    const { name, email, phone, vehicle, zone, status } = req.body;
    const hashed = await bcrypt.hash(DEFAULT_USER_PASSWORD, 10);

    const [userResult] = await query(
      `INSERT INTO users (email, password, name, phone, role, is_active, is_verified)
       VALUES (:email, :password, :name, :phone, 'livreur', 1, 1)`,
      { email, password: hashed, name, phone }
    );

    const [result] = await query(
      `INSERT INTO livreurs (user_id, vehicle_type, zone, status, is_available)
       VALUES (:user_id, :vehicle_type, :zone, :status, :is_available)`,
      {
        user_id: userResult.insertId,
        vehicle_type: vehicle,
        zone,
        status,
        is_available: status === 'available' ? 1 : 0,
      }
    );

    const livreur = await fetchLivreurById(result.insertId);
    res.status(201).json(livreur);
  } catch (error) {
    next(error);
  }
};

export const updateAdminLivreurStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    await query('UPDATE livreurs SET status = :status, is_available = :is_available WHERE id = :id', {
      id,
      status,
      is_available: status === 'available' ? 1 : 0,
    });

    const livreur = await fetchLivreurById(id);
    if (!livreur) {
      res.status(404).json({ message: 'Livreur introuvable' });
      return;
    }

    res.json(livreur);
  } catch (error) {
    next(error);
  }
};

export const toggleAdminRestaurantOpen = async (req, res, next) => {
  res.status(400).json({ message: "Le champ 'is_open' n'existe plus sur la table restaurants." });
};

export const updateAdminRestaurantStatus = async (req, res, next) => {
  res.status(400).json({ message: "Les statuts ne sont plus gérés sur la table restaurants." });
};
