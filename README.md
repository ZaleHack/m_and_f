# M&F Eats

Ce projet utilise Vite + React (TypeScript). Les sections ci-dessous expliquent comment initialiser la base de données MySQL pour travailler en local avec un utilisateur `root` sans mot de passe.

## Pré-requis
- MySQL 8.x installé en local
- Compte MySQL `root` sans mot de passe (comme demandé)

## Initialiser la base de données
1. Ouvrir un terminal MySQL :
   ```bash
   mysql -u root
   ```

2. Exécuter le script de création du schéma :
   ```sql
   SOURCE database/schema.sql;
   ```
   Le script crée la base `mfeats_app`, toutes les tables nécessaires (utilisateurs, restaurants, menus, commandes, livreurs, notifications) et insère quelques comptes exemples.

3. Adapter les mots de passe :
   - Les valeurs de colonne `password` fournies sont des placeholders (`changeme`). Remplacez-les par les mots de passe souhaités avant d'autoriser une authentification réelle.
   - Configurez l'environnement frontend pour que le mot de passe proposé dans l'écran de connexion corresponde à celui stocké en base (variable `VITE_DEMO_PASSWORD`).

4. (Optionnel) Vérifier le contenu :
   ```sql
   USE mfeats_app;
   SHOW TABLES;
   SELECT email, role FROM users;
   ```

Ces étapes suffisent pour disposer d'un schéma de base cohérent avec les types utilisés dans l'application React.

## Synchronisation avec l'application
- Copiez le fichier `.env.example` en `.env` et ajustez les variables :
  - `VITE_API_BASE_URL` pour pointer vers votre backend.
  - `VITE_DEMO_PASSWORD` pour refléter le mot de passe en clair stocké dans la table `users`.
- L'interface consomme désormais les routes d'authentification exposées par l'API (login, register, profile, logout) via `VITE_API_BASE_URL` (défaut : `http://localhost:3000`).
- Les emails d'exemple insérés dans la table `users` (`admin@mfeats.com`, `restaurant@mfeats.com`, `livreur@mfeats.com`, `client@mfeats.com`) sont repris par l'écran de connexion. Mettez à jour leurs mots de passe dans MySQL pour refléter les credentials réels attendus.
- Stockez le token retourné par l'API côté navigateur dans `mf-eats-token` afin que chaque rôle retrouve sa session après rechargement.

## API Node.js/Express

- Les endpoints REST sont exposés via l'entrée `npm run server` (fichier `server/server.js`).
- Un ensemble de plus de 50 routes couvre l'authentification JWT multi-rôles, la gestion des restaurants/menus/commandes, les paiements Wave/Orange Money (intents simulés), les notifications temps réel via Socket.IO, le suivi GPS et l'upload d'images.
- Le schéma MySQL est automatiquement appliqué au démarrage (lecture de `database/schema.sql`) afin de garantir la présence des tables, index, colonnes JSON et jeux de données de base.
