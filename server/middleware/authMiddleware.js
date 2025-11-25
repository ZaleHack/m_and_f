import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';

export const authenticate = (req, res, next) => {
  const token = req.headers.authorization?.replace('Bearer ', '') || req.cookies?.token;
  if (!token) {
    return res.status(401).json({ message: 'Token manquant' });
  }

  try {
    const payload = jwt.verify(token, env.jwt.secret);
    req.user = payload;
    return next();
  } catch (error) {
    return res.status(401).json({ message: 'Token invalide ou expiré' });
  }
};

export const requireRoles = (...roles) => (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ message: 'Authentification requise' });
  }
  if (!roles.includes(req.user.role)) {
    return res.status(403).json({ message: 'Accès refusé' });
  }
  return next();
};
