-- Schema MySQL pour l'application M&F Eats
-- Connectez-vous avec : mysql -u root -p

CREATE DATABASE IF NOT EXISTS mfeats_app CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE mfeats_app;

-- Table des utilisateurs principaux
CREATE TABLE IF NOT EXISTS users (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  email VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  phone VARCHAR(30) NOT NULL,
  role ENUM('client', 'restaurant', 'livreur', 'admin') NOT NULL,
  avatar_url VARCHAR(500),
  address TEXT,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id)
) ENGINE=InnoDB;

-- Table des restaurants
CREATE TABLE IF NOT EXISTS restaurants (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  owner_id BIGINT UNSIGNED NOT NULL,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  address TEXT NOT NULL,
  phone VARCHAR(30) NOT NULL,
  email VARCHAR(255) NOT NULL,
  image_url VARCHAR(500),
  is_open TINYINT(1) NOT NULL DEFAULT 1,
  rating DECIMAL(3,2) NOT NULL DEFAULT 0.00,
  delivery_time VARCHAR(50),
  delivery_fee DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  minimum_order DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  INDEX idx_restaurants_owner (owner_id),
  CONSTRAINT fk_restaurants_owner FOREIGN KEY (owner_id) REFERENCES users(id)
) ENGINE=InnoDB;

-- Table des livreurs (profil lié à un utilisateur)
CREATE TABLE IF NOT EXISTS livreurs (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  user_id BIGINT UNSIGNED NOT NULL,
  is_available TINYINT(1) NOT NULL DEFAULT 1,
  rating DECIMAL(3,2) NOT NULL DEFAULT 0.00,
  total_deliveries INT NOT NULL DEFAULT 0,
  vehicle_type ENUM('bike', 'moto', 'car') NOT NULL DEFAULT 'moto',
  partnered_restaurants JSON,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE INDEX uniq_livreur_user (user_id),
  CONSTRAINT fk_livreurs_user FOREIGN KEY (user_id) REFERENCES users(id)
) ENGINE=InnoDB;

-- Table des menus (plats) d'un restaurant
CREATE TABLE IF NOT EXISTS menu_items (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  restaurant_id BIGINT UNSIGNED NOT NULL,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  category VARCHAR(100),
  image_url VARCHAR(500),
  is_available TINYINT(1) NOT NULL DEFAULT 1,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  INDEX idx_menu_items_restaurant (restaurant_id),
  CONSTRAINT fk_menu_items_restaurant FOREIGN KEY (restaurant_id) REFERENCES restaurants(id)
) ENGINE=InnoDB;

-- Options par plat (sauces, tailles, extras)
CREATE TABLE IF NOT EXISTS menu_item_options (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  menu_item_id BIGINT UNSIGNED NOT NULL,
  name VARCHAR(255) NOT NULL,
  choices JSON NOT NULL,
  is_required TINYINT(1) NOT NULL DEFAULT 0,
  max_selections INT,
  PRIMARY KEY (id),
  INDEX idx_menu_options_item (menu_item_id),
  CONSTRAINT fk_menu_options_item FOREIGN KEY (menu_item_id) REFERENCES menu_items(id)
) ENGINE=InnoDB;

-- Table des commandes
CREATE TABLE IF NOT EXISTS orders (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  customer_id BIGINT UNSIGNED NOT NULL,
  restaurant_id BIGINT UNSIGNED NOT NULL,
  livreur_id BIGINT UNSIGNED,
  status ENUM('pending','accepted','preparing','ready','in_delivery','delivered','cancelled') NOT NULL DEFAULT 'pending',
  total DECIMAL(10,2) NOT NULL,
  delivery_fee DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  payment_method ENUM('cash','wave','orange_money') NOT NULL,
  payment_status ENUM('pending','paid') NOT NULL DEFAULT 'pending',
  delivery_address TEXT NOT NULL,
  customer_phone VARCHAR(30) NOT NULL,
  notes TEXT,
  estimated_delivery_time VARCHAR(50),
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  INDEX idx_orders_customer (customer_id),
  INDEX idx_orders_restaurant (restaurant_id),
  INDEX idx_orders_livreur (livreur_id),
  CONSTRAINT fk_orders_customer FOREIGN KEY (customer_id) REFERENCES users(id),
  CONSTRAINT fk_orders_restaurant FOREIGN KEY (restaurant_id) REFERENCES restaurants(id),
  CONSTRAINT fk_orders_livreur FOREIGN KEY (livreur_id) REFERENCES livreurs(id)
) ENGINE=InnoDB;

-- Détails des articles dans une commande
CREATE TABLE IF NOT EXISTS order_items (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  order_id BIGINT UNSIGNED NOT NULL,
  menu_item_id BIGINT UNSIGNED NOT NULL,
  name VARCHAR(255) NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  quantity INT NOT NULL DEFAULT 1,
  options JSON,
  PRIMARY KEY (id),
  INDEX idx_order_items_order (order_id),
  INDEX idx_order_items_menu_item (menu_item_id),
  CONSTRAINT fk_order_items_order FOREIGN KEY (order_id) REFERENCES orders(id),
  CONSTRAINT fk_order_items_menu_item FOREIGN KEY (menu_item_id) REFERENCES menu_items(id)
) ENGINE=InnoDB;

-- Notifications système liées aux utilisateurs
CREATE TABLE IF NOT EXISTS notifications (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  user_id BIGINT UNSIGNED NOT NULL,
  title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  type ENUM('order','delivery','payment','system') NOT NULL,
  is_read TINYINT(1) NOT NULL DEFAULT 0,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  INDEX idx_notifications_user (user_id),
  CONSTRAINT fk_notifications_user FOREIGN KEY (user_id) REFERENCES users(id)
) ENGINE=InnoDB;

-- Exemple d'utilisateurs de base (mots de passe à remplacer par des hash réels)
INSERT INTO users (email, password_hash, name, phone, role, address) VALUES
  ('admin@mfeats.com', 'changeme', 'Admin MF', '+221771234567', 'admin', NULL),
  ('restaurant@mfeats.com', 'changeme', 'Restaurant Dakar', '+221771234568', 'restaurant', 'Dakar, Sénégal'),
  ('livreur@mfeats.com', 'changeme', 'Livreur Pro', '+221771234569', 'livreur', 'Dakar, Sénégal'),
  ('client@mfeats.com', 'changeme', 'Client Test', '+221771234570', 'client', 'Dakar, Sénégal');
