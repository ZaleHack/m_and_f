import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';

export const signUser = (user) =>
  jwt.sign(
    { id: user.id, email: user.email, role: user.role, name: user.name },
    env.jwt.secret,
    { expiresIn: env.jwt.expiresIn }
  );
