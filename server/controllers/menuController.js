import Joi from 'joi';
import { query } from '../config/db.js';

export const menuSchemas = {
  createItem: Joi.object({
    params: Joi.object({ restaurantId: Joi.number().required() }),
    body: Joi.object({
      name: Joi.string().required(),
      description: Joi.string().allow('', null),
      price: Joi.number().required(),
      category: Joi.string().allow('', null),
      image_url: Joi.string().allow('', null),
      is_available: Joi.boolean().default(true),
    }),
    query: Joi.object({}),
  }),
  toggleAvailability: Joi.object({
    params: Joi.object({ id: Joi.number().required() }),
    body: Joi.object({ is_available: Joi.boolean().required() }),
    query: Joi.object({}),
  }),
};

export const listMenuByRestaurant = async (req, res, next) => {
  try {
    const { restaurantId } = req.params;
    const [rows] = await query('SELECT * FROM menu_items WHERE restaurant_id = :restaurantId', { restaurantId });
    res.json(rows);
  } catch (error) {
    next(error);
  }
};

export const createMenuItem = async (req, res, next) => {
  try {
    const { restaurantId } = req.params;
    const { name, description, price, category, image_url, is_available } = req.body;
    const [result] = await query(
      `INSERT INTO menu_items (restaurant_id, name, description, price, category, image_url, is_available)
       VALUES (:restaurant_id, :name, :description, :price, :category, :image_url, :is_available)`,
      { restaurant_id: restaurantId, name, description, price, category, image_url, is_available: is_available ? 1 : 0 }
    );
    res.status(201).json({ id: result.insertId, restaurant_id: Number(restaurantId), name, price, category });
  } catch (error) {
    next(error);
  }
};

export const updateMenuItem = async (req, res, next) => {
  try {
    const { id } = req.params;
    const fields = req.body;
    await query(
      `UPDATE menu_items SET name = COALESCE(:name, name), description = COALESCE(:description, description), price = COALESCE(:price, price),
        category = COALESCE(:category, category), image_url = COALESCE(:image_url, image_url), is_available = COALESCE(:is_available, is_available)
       WHERE id = :id`,
      { id, ...fields }
    );
    res.json({ id: Number(id), ...fields });
  } catch (error) {
    next(error);
  }
};

export const toggleAvailability = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { is_available } = req.body;
    await query('UPDATE menu_items SET is_available = :is_available WHERE id = :id', { id, is_available: is_available ? 1 : 0 });
    res.json({ id: Number(id), is_available });
  } catch (error) {
    next(error);
  }
};

export const addMenuOption = async (req, res, next) => {
  try {
    const { menuItemId } = req.params;
    const { name, choices, is_required, max_selections } = req.body;
    const [result] = await query(
      `INSERT INTO menu_item_options (menu_item_id, name, choices, is_required, max_selections)
       VALUES (:menu_item_id, :name, :choices, :is_required, :max_selections)`,
      {
        menu_item_id: menuItemId,
        name,
        choices: JSON.stringify(choices || []),
        is_required: is_required ? 1 : 0,
        max_selections: max_selections || null,
      }
    );
    res.status(201).json({ id: result.insertId, menu_item_id: Number(menuItemId), name });
  } catch (error) {
    next(error);
  }
};
