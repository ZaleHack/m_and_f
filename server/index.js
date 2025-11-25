import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mysql from 'mysql2/promise';

dotenv.config();

const PORT = process.env.PORT || 3000;
const DB_HOST = process.env.DB_HOST || 'localhost';
const DB_USER = process.env.DB_USER || 'root';
const DB_PASSWORD = process.env.DB_PASSWORD || '';
const DB_NAME = process.env.DB_NAME || 'mfeats_app';

const createDatabaseIfNeeded = async () => {
  const connection = await mysql.createConnection({ host: DB_HOST, user: DB_USER, password: DB_PASSWORD });
  await connection.query(`CREATE DATABASE IF NOT EXISTS \`${DB_NAME}\``);
  await connection.end();
};

const poolPromise = (async () => {
  await createDatabaseIfNeeded();
  const pool = mysql.createPool({
    host: DB_HOST,
    user: DB_USER,
    password: DB_PASSWORD,
    database: DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    namedPlaceholders: true,
  });

  await pool.query(`CREATE TABLE IF NOT EXISTS admin_restaurants (
    id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    owner VARCHAR(255) NOT NULL,
    address TEXT NOT NULL,
    phone VARCHAR(30) NOT NULL,
    email VARCHAR(255) NOT NULL,
    category VARCHAR(150),
    status ENUM('active','pending','suspended') NOT NULL DEFAULT 'pending',
    is_open TINYINT(1) NOT NULL DEFAULT 1,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id)
  ) ENGINE=InnoDB;`);

  await pool.query(`CREATE TABLE IF NOT EXISTS admin_users (
    id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(30) NOT NULL,
    role ENUM('admin','restaurant','livreur','client') NOT NULL,
    status ENUM('active','invited','suspended') NOT NULL DEFAULT 'invited',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    UNIQUE KEY uniq_email (email)
  ) ENGINE=InnoDB;`);

  return pool;
})();

const app = express();
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());

app.get('/health', async (_req, res) => {
  try {
    const pool = await poolPromise;
    await pool.query('SELECT 1');
    res.json({ status: 'ok' });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});

app.get('/admin/restaurants', async (_req, res) => {
  try {
    const pool = await poolPromise;
    const [rows] = await pool.query('SELECT * FROM admin_restaurants ORDER BY created_at DESC');
    const formatted = rows.map((row) => ({
      id: row.id,
      name: row.name,
      owner: row.owner,
      address: row.address,
      phone: row.phone,
      email: row.email,
      category: row.category || 'Non spécifiée',
      status: row.status,
      isOpen: Boolean(row.is_open),
      createdAt: row.created_at,
    }));
    res.json(formatted);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.post('/admin/restaurants', async (req, res) => {
  const { name, owner, address, phone, email, category, isOpen } = req.body;
  if (!name || !owner || !email || !phone || !address) {
    return res.status(400).json({ message: 'Nom, propriétaire, email, téléphone et adresse sont requis.' });
  }

  try {
    const pool = await poolPromise;
    const [result] = await pool.query(
      `INSERT INTO admin_restaurants (name, owner, address, phone, email, category, status, is_open)
       VALUES (:name, :owner, :address, :phone, :email, :category, 'pending', :isOpen)`,
      { name, owner, address, phone, email, category: category || null, isOpen: isOpen ? 1 : 0 }
    );

    const newRestaurant = {
      id: result.insertId,
      name,
      owner,
      address,
      phone,
      email,
      category: category || 'Non spécifiée',
      status: 'pending',
      isOpen: Boolean(isOpen),
      createdAt: new Date().toISOString().slice(0, 19).replace('T', ' '),
    };

    res.status(201).json(newRestaurant);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.patch('/admin/restaurants/:id/toggle-open', async (req, res) => {
  const { id } = req.params;
  try {
    const pool = await poolPromise;
    const [rows] = await pool.query('SELECT is_open FROM admin_restaurants WHERE id = :id', { id });
    if (!Array.isArray(rows) || rows.length === 0) {
      return res.status(404).json({ message: 'Restaurant introuvable' });
    }
    const current = rows[0].is_open === 1;
    await pool.query('UPDATE admin_restaurants SET is_open = :value WHERE id = :id', { id, value: current ? 0 : 1 });
    res.json({ id: Number(id), isOpen: !current });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.patch('/admin/restaurants/:id/status', async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  if (!['active', 'pending', 'suspended'].includes(status)) {
    return res.status(400).json({ message: 'Statut invalide' });
  }

  try {
    const pool = await poolPromise;
    await pool.query('UPDATE admin_restaurants SET status = :status WHERE id = :id', { id, status });
    res.json({ id: Number(id), status });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.get('/admin/users', async (_req, res) => {
  try {
    const pool = await poolPromise;
    const [rows] = await pool.query('SELECT * FROM admin_users ORDER BY created_at DESC');
    const formatted = rows.map((row) => ({
      id: row.id,
      name: row.name,
      email: row.email,
      phone: row.phone,
      role: row.role,
      status: row.status,
      createdAt: row.created_at,
    }));
    res.json(formatted);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.post('/admin/users', async (req, res) => {
  const { name, email, phone, role } = req.body;
  if (!name || !email || !phone || !role) {
    return res.status(400).json({ message: 'Nom, email, téléphone et rôle sont requis.' });
  }

  try {
    const pool = await poolPromise;
    const [result] = await pool.query(
      `INSERT INTO admin_users (name, email, phone, role, status)
       VALUES (:name, :email, :phone, :role, 'invited')`,
      { name, email, phone, role }
    );

    const newUser = {
      id: result.insertId,
      name,
      email,
      phone,
      role,
      status: 'invited',
      createdAt: new Date().toISOString().slice(0, 19).replace('T', ' '),
    };

    res.status(201).json(newUser);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.put('/admin/users/:id', async (req, res) => {
  const { id } = req.params;
  const { name, email, phone, role, status } = req.body;
  if (!['active', 'invited', 'suspended'].includes(status)) {
    return res.status(400).json({ message: 'Statut invalide' });
  }

  try {
    const pool = await poolPromise;
    await pool.query(
      `UPDATE admin_users SET name = :name, email = :email, phone = :phone, role = :role, status = :status WHERE id = :id`,
      { id, name, email, phone, role, status }
    );

    res.json({ id: Number(id), name, email, phone, role, status });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.delete('/admin/users/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const pool = await poolPromise;
    await pool.query('DELETE FROM admin_users WHERE id = :id', { id });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`API admin démarrée sur http://localhost:${PORT}`);
});
