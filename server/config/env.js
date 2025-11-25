import dotenv from 'dotenv';

dotenv.config();

export const env = {
  port: Number(process.env.PORT) || 3000,
  nodeEnv: process.env.NODE_ENV || 'development',
  corsOrigin: process.env.CORS_ORIGIN || '*',
  db: {
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT) || 3306,
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    name: process.env.DB_NAME || 'mfeats_app',
  },
  jwt: {
    secret: process.env.JWT_SECRET || 'change-me-secret',
    expiresIn: process.env.JWT_EXPIRES_IN || '2h',
  },
  integrations: {
    waveApiKey: process.env.WAVE_API_KEY || 'demo-wave-key',
    orangeMoneyApiKey: process.env.ORANGE_MONEY_API_KEY || 'demo-orange-key',
  },
  redisUrl: process.env.REDIS_URL || '',
  uploadDir: process.env.UPLOAD_DIR || 'uploads',
  maxUploadSize: process.env.MAX_UPLOAD_SIZE || '5mb',
  socketOrigin: process.env.SOCKET_ALLOW_ORIGIN || '*',
};
