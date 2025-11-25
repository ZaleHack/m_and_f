import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import path from 'path';
import { env } from './config/env.js';
import { getPool } from './config/db.js';
import { buildRateLimiter } from './middleware/rateLimiter.js';
import { errorHandler } from './middleware/errorHandler.js';
import routesV1 from './routes/v1/index.js';

const app = express();

app.use(helmet());
app.use(cors({ origin: env.corsOrigin === '*' ? true : env.corsOrigin.split(','), credentials: true }));
app.use(express.json({ limit: env.maxUploadSize }));
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));
app.use(buildRateLimiter({ windowMs: 15 * 60 * 1000, max: 300 }));
app.use('/uploads', express.static(path.resolve(env.uploadDir)));

app.get('/health', async (_req, res) => {
  try {
    const pool = await getPool();
    await pool.query('SELECT 1');
    res.json({ status: 'ok' });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});

app.use('/api/v1', routesV1);
app.use(errorHandler);

export default app;
