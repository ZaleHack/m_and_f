import { env } from '../config/env.js';

const providers = {
  wave: env.integrations.waveApiKey,
  orange_money: env.integrations.orangeMoneyApiKey,
};

export const createPaymentIntent = async ({ provider, amount, orderId }) => {
  if (!providers[provider]) {
    throw new Error('Fournisseur de paiement non configuré');
  }
  return {
    provider,
    orderId,
    amount,
    fees: amount * 0.015,
    externalId: `${provider}-${orderId}-${Date.now()}`,
    redirectUrl: `https://pay.${provider}.sen/checkout/${orderId}`,
  };
};

export const verifyPayment = async ({ provider, externalId }) => ({
  provider,
  externalId,
  status: 'authorized',
  receivedAt: new Date().toISOString(),
});
