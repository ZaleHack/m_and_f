import Joi from 'joi';
import { query } from '../config/db.js';

export const restaurantSchemas = {
  create: Joi.object({
    body: Joi.object({
      utilisateur_id: Joi.number().optional(),
      nom: Joi.string().required(),
      description: Joi.string().allow('', null),
      adresse: Joi.string().required(),
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

const mapRestaurantRow = (row) => ({
  id: row.id,
  utilisateur_id: row.utilisateur_id,
  nom: row.nom,
  adresse: row.adresse,
  description: row.description,
  created_at: row.created_at,
  updated_at: row.updated_at,
});

export const listRestaurants = async (_req, res, next) => {
  try {
    const [rows] = await query(
      `SELECT id, utilisateur_id, nom, adresse, description, created_at, updated_at
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
    const { utilisateur_id, nom, description, adresse } = req.body;

    const utilisateurId = utilisateur_id ?? req.user?.id;
    if (!utilisateurId) {
      return res.status(400).json({ message: "L'utilisateur lié au restaurant est requis." });
    }

    if (req.user?.role !== 'admin' && Number(utilisateurId) !== Number(req.user?.id)) {
      return res
        .status(403)
        .json({ message: "Vous ne pouvez créer qu'un restaurant pour votre propre compte." });
    }

    const [result] = await query(
      `INSERT INTO restaurants (utilisateur_id, nom, adresse, description)
       VALUES (:utilisateur_id, :nom, :adresse, :description)`,
      {
        utilisateur_id: utilisateurId,
        nom,
        adresse,
        description,
      }
    );
    const now = new Date().toISOString();
    res.status(201).json(
      mapRestaurantRow({
        id: result.insertId,
        utilisateur_id: utilisateurId,
        nom,
        description,
        adresse,
        created_at: now,
        updated_at: now,
      })
    );
  } catch (error) {
    next(error);
  }
};

export const toggleRestaurant = async (req, res, next) => {
  res.status(400).json({ message: "Le champ 'is_open' n'existe plus sur la table restaurants." });
};

export const updateVerification = async (req, res, next) => {
  res.status(400).json({ message: "Le champ 'is_verified' n'existe plus sur la table restaurants." });
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
