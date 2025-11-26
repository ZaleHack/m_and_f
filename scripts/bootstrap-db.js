import fs from 'fs';
import path from 'path';
import mysql from 'mysql2/promise';
import { fileURLToPath } from 'url';
import { env } from '../server/config/env.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const schemaPath = path.resolve(__dirname, '../database/schema.sql');

const readSchemaFile = () => fs.readFileSync(schemaPath, 'utf8');

const normalizeSchema = (sql) =>
  sql
    .split('\n')
    .filter((line) => !line.trim().startsWith('--'))
    .join('\n');

const bootstrapDatabase = async () => {
  const bootstrapConnection = await mysql.createConnection({
    host: env.db.host,
    port: env.db.port,
    user: env.db.user,
    password: env.db.password,
    multipleStatements: true,
  });

  await bootstrapConnection.query(`CREATE DATABASE IF NOT EXISTS \`${env.db.name}\``);
  await bootstrapConnection.query(`USE \`${env.db.name}\``);

  const schemaSql = normalizeSchema(readSchemaFile());
  await bootstrapConnection.query(schemaSql);

  await bootstrapConnection.end();
};

bootstrapDatabase()
  .then(() => {
    console.log(`Base de données \`${env.db.name}\` créée et initialisée avec le schéma.`);
  })
  .catch((error) => {
    console.error('Erreur pendant la création/initialisation de la base MySQL:', error.message);
    process.exit(1);
  });
