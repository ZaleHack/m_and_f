import fs from 'fs';
import path from 'path';
import mysql from 'mysql2/promise';
import { fileURLToPath } from 'url';
import { env } from './env.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
let pool;

const readSchemaFile = () => {
  const schemaPath = path.resolve(__dirname, '../../database/schema.sql');
  return fs.readFileSync(schemaPath, 'utf8');
};

const normalizeSchema = (sql) =>
  sql
    .split('\n')
    .filter((line) => !line.trim().startsWith('--'))
    .join('\n');

const createPool = async () => {
  const bootstrapConnection = await mysql.createConnection({
    host: env.db.host,
    user: env.db.user,
    password: env.db.password,
    port: env.db.port,
    multipleStatements: true,
  });

  await bootstrapConnection.query(`CREATE DATABASE IF NOT EXISTS \`${env.db.name}\``);
  await bootstrapConnection.end();

  const schemaSql = normalizeSchema(readSchemaFile());
  const newPool = mysql.createPool({
    host: env.db.host,
    user: env.db.user,
    password: env.db.password,
    database: env.db.name,
    port: env.db.port,
    waitForConnections: true,
    connectionLimit: 15,
    namedPlaceholders: true,
    multipleStatements: true,
  });

  await newPool.query(schemaSql);
  return newPool;
};

export const getPool = async () => {
  if (!pool) {
    pool = await createPool();
  }
  return pool;
};

export const query = async (sql, params = {}) => {
  const db = await getPool();
  return db.query(sql, params);
};
