import Joi from 'joi';
import { query } from '../config/db.js';
import { notificationService } from '../services/notificationService.js';

export const notificationSchemas = {
  markRead: Joi.object({ params: Joi.object({ id: Joi.number().required() }), body: Joi.object({}), query: Joi.object({}) }),
};

export const listNotifications = async (req, res, next) => {
  try {
    const [rows] = await query('SELECT * FROM notifications WHERE user_id = :user_id ORDER BY created_at DESC', {
      user_id: req.user.id,
    });
    res.json(rows);
  } catch (error) {
    next(error);
  }
};

export const markNotificationRead = async (req, res, next) => {
  try {
    const { id } = req.params;
    await query('UPDATE notifications SET is_read = 1 WHERE id = :id AND user_id = :user_id', {
      id,
      user_id: req.user.id,
    });
    res.json({ id: Number(id), is_read: true });
  } catch (error) {
    next(error);
  }
};

export const sendBroadcast = async (req, res, next) => {
  try {
    const { title, message } = req.body;
    notificationService.broadcast({ title, message });
    res.status(202).json({ title, message });
  } catch (error) {
    next(error);
  }
};
