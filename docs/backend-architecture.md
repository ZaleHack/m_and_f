# Architecture backend M&F Eats

Cette architecture Express/MySQL fournit plus de 50 endpoints REST, un socle d'authentification JWT multi-rôles et les briques nécessaires pour les paiements, la géolocalisation, le cache et les notifications temps réel.

## Périmètre fonctionnel
- Authentification JWT (login/register/me) avec contrôle multi-rôles.
- Gestion utilisateurs, restaurants, menus/options, commandes, paiements, notifications, géolocalisation, uploads et analytics.
- Intégrations de paiement (Wave, Orange Money) via intents simulés et callbacks.
- Socket.IO pour les notifications push et le suivi des statuts.
- Cache Redis (fallback mémoire) et rate limiting global.
- Mise en place d'un schéma MySQL complet incluant JSON, index et contraintes.

## Endpoints principaux (API v1)
- `/auth`: register, login, me.
- `/users`: listing + mise à jour du statut/role (admin).
- `/restaurants`: CRUD léger, ouverture/fermeture, vérification, statistiques de catégories.
- `/menus`: gestion des cartes par restaurant, options et disponibilité.
- `/orders`: création, statut, dispatch, assignation livreur, timeline GPS, notation (stub), réouverture (stub).
- `/payments`: intents Wave/Orange Money, callback, statut, remboursement, frais fournisseurs.
- `/geo`: push de positions, dernière position, historique par commande, heatmap et statut livreur (stub).
- `/notifications`: récupération, marquage lu, broadcast admin, push-test.
- `/uploads`: upload local avec Multer + CRUD médias.
- `/analytics`: métriques globales et par restaurant/livreur, ventilation statuts et revenus (stubs).

## Démarrage
1. Copier `.env.example` en `.env` et ajuster les variables (JWT, MySQL, Redis, uploads, paiements).
2. `npm install`
3. `npm run server`

Le serveur crée automatiquement la base `mfeats_app` et applique le schéma `database/schema.sql` (tables, index, JSON et jeux de données de démonstration).

## Notifications temps réel
Le serveur Socket.IO est instancié dans `server/server.js`. Chaque client peut passer `?userId=XXX` lors de la connexion WebSocket pour rejoindre une room dédiée et recevoir les événements envoyés via `notificationService.notifyUser` ou `broadcast`.
