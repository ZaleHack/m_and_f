# Cartographie MySQL et insertion des données

Cette page résume la base `mfeats_app`, les tables créées par `database/schema.sql` et la façon d'insérer les données de démonstration nécessaires à l'application.

## Schéma et relations principales
- **users** : comptes principaux (client, restaurant, livreur, admin) avec avatar, adresse et préférences.
- **restaurants** : restaurant lié à `users.owner_id`, avec informations de contact, ouverture/vérification, tarifs et types de cuisine.
- **livreurs** : profil livreur lié à `users.id`, disponibilité, type de véhicule et localisation.
- **menu_items** : plats d'un restaurant (`restaurant_id`), prix, catégorie, disponibilité et éventuelles informations nutritionnelles.
- **menu_item_options** : options/variantes d'un plat (`menu_item_id`) avec choix multiples.
- **orders** : commande d'un client (`customer_id`) auprès d'un restaurant, assignation livreur, frais de livraison et statut.
- **order_items** : lignes d'articles pour une commande (`order_id`), avec quantité et options choisies.
- **payments** : paiements liés aux commandes (`order_id`) avec provider et statut d'encaissement.
- **notifications** : messages système ou métier pour un utilisateur (`user_id`).
- **gps_events** : événements GPS capturés pour un livreur (et optionnellement une commande).
- **media_assets** : fichiers uploadés (menus, restaurants, avatars, preuves de livraison) rattachés à un utilisateur.
- **audit_logs** : journalisation générique des actions sur les entités.

Toutes les tables sont créées dans la base `mfeats_app` avec les index et clés étrangères listés dans `database/schema.sql`. Le serveur Express lit ce fichier au démarrage pour garantir la présence du schéma avant d'exposer les routes.

## Charger le schéma et les jeux de données
1. Ouvrir MySQL avec l'utilisateur `root` :
   ```bash
   mysql -u root
   ```
2. Importer le schéma et les données exemples :
   ```sql
   SOURCE database/schema.sql;
   ```
   Cette commande crée la base, toutes les tables et insère quatre utilisateurs de démonstration (`admin`, `restaurant`, `livreur`, `client`).
3. Vérifier la création :
   ```sql
   USE mfeats_app;
   SHOW TABLES;
   SELECT email, role FROM users;
   ```

## Ajouter d'autres données de test
Pour aligner l'application sur votre environnement, insérez vos propres comptes et restaurants dans les tables cibles :

```sql
-- Exemple d'utilisateur restaurant
INSERT INTO users (email, password, name, phone, role, address, is_verified)
VALUES ('nouveau-restaurant@mfeats.com', 'motdepasse', 'Mon Restaurant', '+221700000000', 'restaurant', 'Dakar', 1);

-- Exemple de restaurant rattaché à ce compte (remplacez 5 par l'ID du user ci-dessus)
INSERT INTO restaurants (owner_id, name, address, phone, email, delivery_fee, minimum_order)
VALUES (5, 'Mon Restaurant', 'Dakar Plateau', '+221700000001', 'contact@monresto.com', 1000, 5000);

-- Exemple de plat
INSERT INTO menu_items (restaurant_id, name, price, category)
VALUES (1, 'Yassa Poulet', 6500, 'Sénégalais');
```

Utilisez ces modèles pour insérer les données attendues par l'application dans les tables correspondantes (utilisateurs, restaurants, menus, commandes, etc.).
