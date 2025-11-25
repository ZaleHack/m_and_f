import rateLimit from 'express-rate-limit';

export const buildRateLimiter = ({ windowMs = 15 * 60 * 1000, max = 100, message }) =>
  rateLimit({
    windowMs,
    max,
    standardHeaders: true,
    legacyHeaders: false,
    message: message || 'Trop de requêtes, veuillez réessayer plus tard.'
  });
