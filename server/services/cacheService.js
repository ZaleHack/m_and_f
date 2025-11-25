import Redis from 'ioredis';

let client;
let memoryCache = new Map();

export const initializeCache = (redisUrl) => {
  if (redisUrl) {
    client = new Redis(redisUrl);
    client.on('error', (err) => console.warn('[CACHE] Redis indisponible', err.message));
  }
};

export const setCache = async (key, value, ttlSeconds = 300) => {
  if (client) {
    await client.set(key, JSON.stringify(value), 'EX', ttlSeconds);
  } else {
    memoryCache.set(key, { value, expiresAt: Date.now() + ttlSeconds * 1000 });
  }
};

export const getCache = async (key) => {
  if (client) {
    const cached = await client.get(key);
    return cached ? JSON.parse(cached) : null;
  }

  const record = memoryCache.get(key);
  if (!record) return null;
  if (record.expiresAt < Date.now()) {
    memoryCache.delete(key);
    return null;
  }
  return record.value;
};
