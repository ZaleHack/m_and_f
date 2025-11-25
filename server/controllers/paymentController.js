import Joi from 'joi';
import { query } from '../config/db.js';
import { createPaymentIntent, verifyPayment } from '../services/paymentService.js';

export const paymentSchemas = {
  intent: Joi.object({
    body: Joi.object({ order_id: Joi.number().required(), provider: Joi.string().valid('wave', 'orange_money', 'cash').required(), amount: Joi.number().required() }),
    params: Joi.object({}),
    query: Joi.object({}),
  }),
  callback: Joi.object({
    body: Joi.object({ external_id: Joi.string().required(), provider: Joi.string().required(), status: Joi.string().required() }),
    params: Joi.object({}),
    query: Joi.object({}),
  }),
};

export const createIntent = async (req, res, next) => {
  try {
    const { order_id, provider, amount } = req.body;
    const intent = await createPaymentIntent({ provider, amount, orderId: order_id });
    await query(
      `INSERT INTO payments (order_id, provider, external_id, amount, fees, status, metadata)
       VALUES (:order_id, :provider, :external_id, :amount, :fees, 'pending', :metadata)
       ON DUPLICATE KEY UPDATE amount = VALUES(amount), provider = VALUES(provider)`,
      { order_id, provider, external_id: intent.externalId, amount, fees: intent.fees, metadata: JSON.stringify({ redirectUrl: intent.redirectUrl }) }
    );
    res.status(201).json(intent);
  } catch (error) {
    next(error);
  }
};

export const paymentCallback = async (req, res, next) => {
  try {
    const { external_id, provider, status } = req.body;
    await query('UPDATE payments SET status = :status WHERE external_id = :external_id', { external_id, status });
    const verification = await verifyPayment({ provider, externalId: external_id });
    res.json({ status: verification.status, external_id });
  } catch (error) {
    next(error);
  }
};

export const paymentStatus = async (req, res, next) => {
  try {
    const { orderId } = req.params;
    const [rows] = await query('SELECT * FROM payments WHERE order_id = :orderId', { orderId });
    res.json(rows);
  } catch (error) {
    next(error);
  }
};

export const refundPayment = async (req, res, next) => {
  try {
    const { externalId } = req.params;
    await query('UPDATE payments SET status = "refunded" WHERE external_id = :externalId', { externalId });
    res.json({ externalId, status: 'refunded' });
  } catch (error) {
    next(error);
  }
};
