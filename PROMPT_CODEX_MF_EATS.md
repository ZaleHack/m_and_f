# Prompt Complet - M&F Eats Backend & API

## Contexte du Projet
Développer une API REST complète pour M&F Eats, une plateforme de livraison de repas connectant restaurants, livreurs, clients et administrateurs. L'API doit gérer toutes les fonctionnalités métier avec une base de données MySQL.

## Configuration Base de Données
- **SGBD** : MySQL 8.x
- **Host** : localhost
- **Port** : 3306
- **Utilisateur** : root
- **Mot de passe** : (vide)
- **Base de données** : mfeats_app

## Architecture Technique Requise

### Stack Technologique
- **Backend** : Node.js + Express.js
- **ORM** : Sequelize ou Prisma
- **Base de données** : MySQL
- **Authentification** : JWT + bcrypt
- **Validation** : Joi ou Yup
- **Upload fichiers** : Multer
- **Documentation API** : Swagger/OpenAPI
- **Tests** : Jest + Supertest
- **Logs** : Winston
- **Variables d'environnement** : dotenv

### Structure du Projet
```
src/
├── config/
│   ├── database.js
│   ├── jwt.js
│   └── upload.js
├── controllers/
│   ├── authController.js
│   ├── userController.js
│   ├── restaurantController.js
│   ├── menuController.js
│   ├── orderController.js
│   ├── livreurController.js
│   └── adminController.js
├── middleware/
│   ├── auth.js
│   ├── validation.js
│   ├── upload.js
│   └── errorHandler.js
├── models/
│   ├── User.js
│   ├── Restaurant.js
│   ├── MenuItem.js
│   ├── Order.js
│   ├── OrderItem.js
│   ├── Livreur.js
│   └── Notification.js
├── routes/
│   ├── auth.js
│   ├── users.js
│   ├── restaurants.js
│   ├── menu.js
│   ├── orders.js
│   ├── livreurs.js
│   └── admin.js
├── services/
│   ├── authService.js
│   ├── emailService.js
│   ├── paymentService.js
│   └── notificationService.js
├── utils/
│   ├── helpers.js
│   ├── constants.js
│   └── validators.js
└── app.js
```

## Modèles de Données (MySQL)

### Table users
```sql
CREATE TABLE users (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  phone VARCHAR(30) NOT NULL,
  role ENUM('client', 'restaurant', 'livreur', 'admin') NOT NULL,
  avatar_url VARCHAR(500),
  address TEXT,
  is_verified BOOLEAN DEFAULT FALSE,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

### Table restaurants
```sql
CREATE TABLE restaurants (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  owner_id BIGINT UNSIGNED NOT NULL,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  address TEXT NOT NULL,
  phone VARCHAR(30) NOT NULL,
  email VARCHAR(255) NOT NULL,
  image_url VARCHAR(500),
  cover_image_url VARCHAR(500),
  is_open BOOLEAN DEFAULT TRUE,
  is_verified BOOLEAN DEFAULT FALSE,
  rating DECIMAL(3,2) DEFAULT 0.00,
  total_reviews INT DEFAULT 0,
  delivery_time VARCHAR(50),
  delivery_fee DECIMAL(10,2) DEFAULT 0.00,
  minimum_order DECIMAL(10,2) DEFAULT 0.00,
  commission_rate DECIMAL(5,2) DEFAULT 10.00,
  opening_hours JSON,
  cuisine_types JSON,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (owner_id) REFERENCES users(id) ON DELETE CASCADE
);
```

### Table menu_items
```sql
CREATE TABLE menu_items (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  restaurant_id BIGINT UNSIGNED NOT NULL,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  category VARCHAR(100),
  image_url VARCHAR(500),
  is_available BOOLEAN DEFAULT TRUE,
  preparation_time INT DEFAULT 15,
  ingredients JSON,
  allergens JSON,
  nutritional_info JSON,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (restaurant_id) REFERENCES restaurants(id) ON DELETE CASCADE
);
```

### Table orders
```sql
CREATE TABLE orders (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  order_number VARCHAR(50) UNIQUE NOT NULL,
  customer_id BIGINT UNSIGNED NOT NULL,
  restaurant_id BIGINT UNSIGNED NOT NULL,
  livreur_id BIGINT UNSIGNED NULL,
  status ENUM('pending','accepted','preparing','ready','picked_up','in_delivery','delivered','cancelled','refunded') DEFAULT 'pending',
  subtotal DECIMAL(10,2) NOT NULL,
  delivery_fee DECIMAL(10,2) DEFAULT 0.00,
  tax_amount DECIMAL(10,2) DEFAULT 0.00,
  commission_amount DECIMAL(10,2) DEFAULT 0.00,
  total DECIMAL(10,2) NOT NULL,
  payment_method ENUM('cash','wave','orange_money','card') NOT NULL,
  payment_status ENUM('pending','paid','failed','refunded') DEFAULT 'pending',
  payment_reference VARCHAR(255),
  delivery_address JSON NOT NULL,
  customer_phone VARCHAR(30) NOT NULL,
  special_instructions TEXT,
  estimated_delivery_time TIMESTAMP,
  actual_delivery_time TIMESTAMP,
  rating INT CHECK (rating >= 1 AND rating <= 5),
  review TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (customer_id) REFERENCES users(id),
  FOREIGN KEY (restaurant_id) REFERENCES restaurants(id),
  FOREIGN KEY (livreur_id) REFERENCES users(id)
);
```

### Table order_items
```sql
CREATE TABLE order_items (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  order_id BIGINT UNSIGNED NOT NULL,
  menu_item_id BIGINT UNSIGNED NOT NULL,
  name VARCHAR(255) NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  quantity INT NOT NULL DEFAULT 1,
  customizations JSON,
  special_requests TEXT,
  FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
  FOREIGN KEY (menu_item_id) REFERENCES menu_items(id)
);
```

### Table livreurs
```sql
CREATE TABLE livreurs (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id BIGINT UNSIGNED UNIQUE NOT NULL,
  is_available BOOLEAN DEFAULT TRUE,
  is_verified BOOLEAN DEFAULT FALSE,
  current_location JSON,
  rating DECIMAL(3,2) DEFAULT 0.00,
  total_deliveries INT DEFAULT 0,
  total_earnings DECIMAL(10,2) DEFAULT 0.00,
  vehicle_type ENUM('bike','moto','car') DEFAULT 'moto',
  vehicle_details JSON,
  delivery_zones JSON,
  documents JSON,
  bank_details JSON,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
```

### Table notifications
```sql
CREATE TABLE notifications (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id BIGINT UNSIGNED NOT NULL,
  title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  type ENUM('order','delivery','payment','system','promotion') NOT NULL,
  data JSON,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
```

## API Endpoints Requis

### Authentification (/api/auth)
```
POST   /register          - Inscription utilisateur
POST   /login             - Connexion
POST   /logout            - Déconnexion
POST   /refresh           - Renouveler token
POST   /forgot-password   - Mot de passe oublié
POST   /reset-password    - Réinitialiser mot de passe
GET    /me                - Profil utilisateur connecté
PUT    /me                - Modifier profil
POST   /verify-email      - Vérifier email
POST   /resend-verification - Renvoyer email de vérification
```

### Utilisateurs (/api/users)
```
GET    /                  - Liste utilisateurs (admin)
GET    /:id               - Détails utilisateur
PUT    /:id               - Modifier utilisateur
DELETE /:id               - Supprimer utilisateur
POST   /:id/avatar        - Upload avatar
GET    /:id/orders        - Commandes utilisateur
GET    /:id/notifications - Notifications utilisateur
PUT    /notifications/:notifId/read - Marquer notification lue
```

### Restaurants (/api/restaurants)
```
GET    /                  - Liste restaurants avec filtres
POST   /                  - Créer restaurant (admin/restaurant)
GET    /:id               - Détails restaurant
PUT    /:id               - Modifier restaurant
DELETE /:id               - Supprimer restaurant
POST   /:id/images        - Upload images restaurant
GET    /:id/menu          - Menu complet restaurant
GET    /:id/orders        - Commandes restaurant
GET    /:id/analytics     - Statistiques restaurant
PUT    /:id/status        - Changer statut (ouvert/fermé)
POST   /:id/reviews       - Ajouter avis
GET    /:id/reviews       - Liste avis
```

### Menu (/api/menu)
```
GET    /restaurant/:id    - Menu par restaurant
POST   /items             - Ajouter plat
GET    /items/:id         - Détails plat
PUT    /items/:id         - Modifier plat
DELETE /items/:id         - Supprimer plat
POST   /items/:id/image   - Upload image plat
PUT    /items/:id/availability - Changer disponibilité
GET    /categories        - Catégories disponibles
```

### Commandes (/api/orders)
```
GET    /                  - Liste commandes avec filtres
POST   /                  - Créer commande
GET    /:id               - Détails commande
PUT    /:id/status        - Changer statut commande
POST   /:id/cancel        - Annuler commande
POST   /:id/payment       - Traiter paiement
GET    /:id/tracking      - Suivi commande
POST   /:id/review        - Ajouter avis commande
GET    /customer/:userId  - Commandes client
GET    /restaurant/:restaurantId - Commandes restaurant
GET    /livreur/:livreurId - Commandes livreur
```

### Livreurs (/api/livreurs)
```
GET    /                  - Liste livreurs
POST   /register          - Inscription livreur
GET    /:id               - Profil livreur
PUT    /:id               - Modifier profil livreur
POST   /:id/documents     - Upload documents
PUT    /:id/location      - Mettre à jour position
PUT    /:id/availability  - Changer disponibilité
GET    /:id/deliveries    - Historique livraisons
GET    /:id/earnings      - Gains livreur
POST   /:id/verify        - Vérifier livreur (admin)
GET    /available         - Livreurs disponibles
POST   /assign-order      - Assigner commande
```

### Administration (/api/admin)
```
GET    /dashboard         - Données tableau de bord
GET    /users             - Gestion utilisateurs
GET    /restaurants       - Gestion restaurants
GET    /orders            - Gestion commandes
GET    /livreurs          - Gestion livreurs
GET    /analytics         - Analyses et rapports
PUT    /settings          - Paramètres plateforme
GET    /transactions      - Historique transactions
POST   /notifications/broadcast - Notification générale
GET    /reports/sales     - Rapport ventes
GET    /reports/users     - Rapport utilisateurs
```

### Paiements (/api/payments)
```
POST   /wave              - Paiement Wave
POST   /orange-money      - Paiement Orange Money
POST   /card              - Paiement carte
GET    /methods           - Méthodes disponibles
POST   /webhook/wave      - Webhook Wave
POST   /webhook/orange    - Webhook Orange Money
GET    /transaction/:id   - Détails transaction
POST   /refund/:id        - Remboursement
```

## Fonctionnalités Spécifiques à Implémenter

### 1. Système d'Authentification JWT
- Tokens d'accès (15 min) et de rafraîchissement (7 jours)
- Middleware de vérification des rôles
- Hashage bcrypt des mots de passe
- Limitation des tentatives de connexion

### 2. Gestion des Fichiers
- Upload d'images (avatars, restaurants, plats)
- Redimensionnement automatique
- Stockage local ou cloud (AWS S3)
- Validation des types de fichiers

### 3. Système de Notifications
- Notifications en temps réel (WebSocket/Socket.io)
- Notifications push (Firebase)
- Emails transactionnels
- Notifications in-app

### 4. Intégration Paiements Sénégalais
- API Wave Money
- API Orange Money Sénégal
- Gestion des webhooks
- Réconciliation des paiements

### 5. Système de Géolocalisation
- Calcul de distance entre restaurant et client
- Suivi en temps réel des livreurs
- Zones de livraison
- Estimation des temps de livraison

### 6. Analytics et Rapports
- Statistiques de vente par restaurant
- Performance des livreurs
- Comportement des clients
- Revenus et commissions

### 7. Système de Reviews et Ratings
- Avis clients sur restaurants
- Notation des livreurs
- Modération des commentaires
- Calcul des moyennes

## Configuration et Variables d'Environnement

```env
# Base de données
DB_HOST=localhost
DB_PORT=3306
DB_NAME=mfeats_app
DB_USER=root
DB_PASSWORD=

# JWT
JWT_SECRET=your-super-secret-jwt-key
JWT_REFRESH_SECRET=your-refresh-secret-key
JWT_EXPIRE=15m
JWT_REFRESH_EXPIRE=7d

# Upload
UPLOAD_PATH=./uploads
MAX_FILE_SIZE=5242880
ALLOWED_FILE_TYPES=jpg,jpeg,png,gif

# Email
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password

# Paiements
WAVE_API_KEY=your-wave-api-key
WAVE_SECRET=your-wave-secret
ORANGE_API_KEY=your-orange-api-key
ORANGE_SECRET=your-orange-secret

# Autres
PORT=3000
NODE_ENV=development
CORS_ORIGIN=http://localhost:5173
```

## Middleware Requis

### 1. Authentification
```javascript
const authenticateToken = (req, res, next) => {
  // Vérifier JWT token
  // Ajouter user à req.user
};

const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    // Vérifier si user.role est autorisé
  };
};
```

### 2. Validation
```javascript
const validateRequest = (schema) => {
  return (req, res, next) => {
    // Valider req.body avec Joi/Yup
  };
};
```

### 3. Gestion d'Erreurs
```javascript
const errorHandler = (err, req, res, next) => {
  // Logger l'erreur
  // Retourner réponse formatée
};
```

## Tests à Implémenter

### Tests Unitaires
- Modèles Sequelize/Prisma
- Services métier
- Utilitaires et helpers

### Tests d'Intégration
- Endpoints API
- Authentification
- Paiements
- Upload de fichiers

### Tests End-to-End
- Parcours utilisateur complet
- Processus de commande
- Système de livraison

## Sécurité

### Mesures de Sécurité
- Validation et sanitisation des entrées
- Protection CSRF
- Rate limiting
- Chiffrement des données sensibles
- Logs de sécurité
- Headers de sécurité (helmet.js)

### Conformité RGPD
- Consentement utilisateur
- Droit à l'oubli
- Portabilité des données
- Chiffrement des données personnelles

## Performance et Scalabilité

### Optimisations
- Mise en cache Redis
- Pagination des résultats
- Indexation base de données
- Compression des réponses
- CDN pour les images

### Monitoring
- Logs structurés (Winston)
- Métriques de performance
- Alertes système
- Health checks

## Documentation

### Documentation API
- Swagger/OpenAPI 3.0
- Exemples de requêtes/réponses
- Codes d'erreur détaillés
- Guide d'authentification

### Documentation Technique
- Architecture du système
- Guide de déploiement
- Procédures de maintenance
- Troubleshooting

## Livrables Attendus

1. **API REST complète** avec tous les endpoints
2. **Base de données MySQL** avec schéma complet
3. **Documentation Swagger** interactive
4. **Tests automatisés** (couverture > 80%)
5. **Scripts de déploiement** et migration
6. **Guide d'installation** et configuration
7. **Postman Collection** pour tests manuels

## Critères de Qualité

- Code propre et bien documenté
- Architecture modulaire et maintenable
- Gestion d'erreurs robuste
- Performance optimisée
- Sécurité renforcée
- Tests complets
- Documentation claire

Ce prompt couvre tous les aspects nécessaires pour développer une API complète et professionnelle pour M&F Eats avec MySQL et les spécificités du marché sénégalais.