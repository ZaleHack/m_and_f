-- Schema MySQL pour l'application M&F Eats
-- Connectez-vous avec : mysql -u root -p

CREATE DATABASE IF NOT EXISTS mf_eats CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE mf_eats;

-- Table des utilisateurs principaux
CREATE TABLE IF NOT EXISTS users (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  email VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  phone VARCHAR(30) NOT NULL,
  role ENUM('client', 'restaurant', 'livreur', 'admin') NOT NULL,
  avatar_url VARCHAR(500),
  address TEXT,
  is_verified TINYINT(1) NOT NULL DEFAULT 0,
  is_active TINYINT(1) NOT NULL DEFAULT 1,
  preferences JSON,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id)
) ENGINE=InnoDB;

-- Table des restaurants
CREATE TABLE IF NOT EXISTS restaurants (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  utilisateur_id BIGINT UNSIGNED NOT NULL,
  nom VARCHAR(255) NOT NULL,
  adresse TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  INDEX idx_restaurants_utilisateur (utilisateur_id),
  CONSTRAINT fk_restaurants_utilisateur FOREIGN KEY (utilisateur_id) REFERENCES users(id)
) ENGINE=InnoDB;

-- Table des livreurs (profil lié à un utilisateur)
CREATE TABLE IF NOT EXISTS livreurs (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  user_id BIGINT UNSIGNED NOT NULL,
  zone VARCHAR(255),
  status ENUM('available','busy','inactive') NOT NULL DEFAULT 'available',
  is_available TINYINT(1) NOT NULL DEFAULT 1,
  rating DECIMAL(3,2) NOT NULL DEFAULT 0.00,
  total_deliveries INT NOT NULL DEFAULT 0,
  vehicle_type ENUM('bike', 'moto', 'car') NOT NULL DEFAULT 'moto',
  partnered_restaurants JSON,
  last_known_location JSON,
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
  nutrition_facts JSON,
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
  tracking_code VARCHAR(50),
  metadata JSON,
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

-- Table des paiements liés aux commandes
CREATE TABLE IF NOT EXISTS payments (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  order_id BIGINT UNSIGNED NOT NULL,
  provider ENUM('wave','orange_money','cash') NOT NULL,
  external_id VARCHAR(255),
  amount DECIMAL(10,2) NOT NULL,
  fees DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  status ENUM('pending','authorized','settled','failed','refunded') NOT NULL DEFAULT 'pending',
  metadata JSON,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uniq_payment_external (external_id),
  INDEX idx_payments_order (order_id),
  CONSTRAINT fk_payments_order FOREIGN KEY (order_id) REFERENCES orders(id)
) ENGINE=InnoDB;

-- Table des événements GPS pour le suivi temps réel
CREATE TABLE IF NOT EXISTS gps_events (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  livreur_id BIGINT UNSIGNED NOT NULL,
  order_id BIGINT UNSIGNED,
  latitude DECIMAL(10,8) NOT NULL,
  longitude DECIMAL(11,8) NOT NULL,
  accuracy DECIMAL(5,2),
  speed DECIMAL(6,2),
  heading DECIMAL(6,2),
  captured_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  metadata JSON,
  PRIMARY KEY (id),
  INDEX idx_gps_livreur (livreur_id, captured_at),
  INDEX idx_gps_order (order_id),
  CONSTRAINT fk_gps_livreur FOREIGN KEY (livreur_id) REFERENCES livreurs(id),
  CONSTRAINT fk_gps_order FOREIGN KEY (order_id) REFERENCES orders(id)
) ENGINE=InnoDB;

-- Table de stockage des fichiers médias
CREATE TABLE IF NOT EXISTS media_assets (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  user_id BIGINT UNSIGNED,
  scope ENUM('menu','restaurant','avatar','delivery_proof') NOT NULL,
  path VARCHAR(500) NOT NULL,
  mime_type VARCHAR(120) NOT NULL,
  size_bytes BIGINT UNSIGNED NOT NULL,
  metadata JSON,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  INDEX idx_media_user (user_id),
  CONSTRAINT fk_media_user FOREIGN KEY (user_id) REFERENCES users(id)
) ENGINE=InnoDB;

-- Table d'audit générique
CREATE TABLE IF NOT EXISTS audit_logs (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  user_id BIGINT UNSIGNED,
  action VARCHAR(150) NOT NULL,
  entity_type VARCHAR(100) NOT NULL,
  entity_id BIGINT UNSIGNED,
  payload JSON,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  INDEX idx_audit_user (user_id),
  CONSTRAINT fk_audit_user FOREIGN KEY (user_id) REFERENCES users(id)
) ENGINE=InnoDB;

-- Exemple d'utilisateurs de base (mots de passe stockés en clair pour la démo)
INSERT IGNORE INTO users (email, password, name, phone, role, address, is_verified) VALUES
  ('admin@mfeats.com', 'changeme', 'Admin MF', '+221771234567', 'admin', NULL, 1),
  ('restaurant@mfeats.com', 'changeme', 'Restaurant Dakar', '+221771234568', 'restaurant', 'Dakar, Sénégal', 1),
  ('livreur@mfeats.com', 'changeme', 'Livreur Pro', '+221771234569', 'livreur', 'Dakar, Sénégal', 1),
  ('client@mfeats.com', 'changeme', 'Client Test', '+221771234570', 'client', 'Dakar, Sénégal', 1);
