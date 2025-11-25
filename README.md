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
   - Les valeurs `password_hash` fournies sont des placeholders (`changeme`). Remplacez-les par des hash réels (bcrypt/argon2) avant d'autoriser une authentification réelle.

4. (Optionnel) Vérifier le contenu :
   ```sql
   USE mfeats_app;
   SHOW TABLES;
   SELECT email, role FROM users;
   ```

Ces étapes suffisent pour disposer d'un schéma de base cohérent avec les types utilisés dans l'application React.
