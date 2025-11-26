# Prompt final M&F Eats

M&F Eats est une application web et mobile de commande et livraison de repas articulée autour de quatre rôles utilisateurs : restaurants, livreurs, clients et administrateur général. Le projet doit proposer une expérience fluide, sécurisée et moderne, avec une base de données MySQL (`root` sans mot de passe) provisionnée automatiquement.

## Rôles et fonctionnalités

### Restaurants
- Création et gestion complète du profil établissement (informations, images, horaires, cuisines).
- Gestion intégrale du menu : ajout, modification, suppression, catégories, descriptions, photos, prix, options et allergènes.
- Dashboard temps réel pour suivre et traiter les commandes entrantes.
- Association et gestion des livreurs liés au restaurant.
- Validation des commandes pour déclencher la livraison.

### Livreurs
- Inscription et candidature pour rejoindre des restaurants partenaires.
- Dashboard personnel listant les missions assignées avec possibilité d’accepter ou refuser.
- Suivi des livraisons en cours et historique des courses réalisées.
- Paiement par livraison effectuée.
- Position GPS en temps réel visible par les clients.

### Clients
- Création et gestion de compte personnel.
- Sélection de restaurant et consultation des menus à jour.
- Commande avec options personnalisables et instructions spéciales.
- Suivi en temps réel de l’état de la commande (acceptée, préparation, livraison, livrée).
- Visualisation GPS du livreur en direct.
- Paiements en espèces à la livraison, Wave ou Orange Money Sénégal.
- Historique complet des commandes.

### Administrateur général
- Supervision centralisée via un tableau de bord complet.
- Vue globale des commandes, utilisateurs, restaurants, livreurs et transactions.
- Gestion des commissions sur chaque commande et des règles métier.
- Administration des accès, support et conformité.

## Base de données MySQL
- SGBD : MySQL 8.x, utilisateur `root`, mot de passe vide.
- Création automatique de la base principale et de toutes les tables (utilisateurs, restaurants, menus, commandes, livreurs, transactions, notifications, etc.).
- Schéma relationnel garantissant cohérence, intégrité, indexation appropriée et colonnes JSON pour les éléments dynamiques (options, géolocalisation, préférences).
- Optimisation orientée sécurité, performance et scalabilité.

## Exigences techniques et UX/UI
- Interface moderne, épurée et attrayante, responsive web & mobile.
- Dashboards personnalisés selon le rôle (restaurant, livreur, client, admin).
- Notifications en temps réel : nouvelle commande, changement de statut, attribution de mission.
- Suivi GPS précis et mis à jour en continu.
- Intégration des paiements locaux Wave et Orange Money Sénégal, plus espèces à la livraison.
- Sécurité renforcée (authentification multi-rôle, gestion des accès, conformité des données sensibles).
- Architecture pensée pour la scalabilité (services modulaires, files d’événements, cache pour menus et suivi temps réel).

## Objectif global
Livrer une application prête à l’emploi qui aligne UX moderne, couverture fonctionnelle complète et base de données MySQL préconfigurée (`root` sans mot de passe), afin de simplifier la mise en production et l’évolution future de M&F Eats.
