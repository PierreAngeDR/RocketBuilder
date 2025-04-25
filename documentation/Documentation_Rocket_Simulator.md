
# 🚀 Documentation du Projet Rocket Simulator

## 1. Présentation générale
- **Nom du projet** : Rocket Simulator
- **Description** : Application web de simulation de trajectoire de fusées basée sur des modèles physiques réels (poussée, gravité, traînée), avec gestion multi-utilisateurs via une API sécurisée.
- **Public cible** : élèves, enseignants en physique, développeurs curieux.
- **Technologies principales** :
  - Frontend : JavaScript (ES6+), Tailwind CSS
  - Backend : PHP (Symfony), API Platform
  - Base de données : MySQL
  - Conteneurisation : Docker

## 2. Fonctionnalités principales
- Authentification par login/password (JWT Token)
- Gestion de modèles de fusées personnalisés
- Simulation dynamique en Canvas
- Stockage et gestion des résultats de vol
- API REST complète pour toutes les opérations
- Interface utilisateur claire et responsive

## 3. Architecture du projet
- **Frontend**
  - Pages HTML (connexion, dashboard, simulation)
  - Classe `RocketAuthentication` pour la gestion des tokens
  - Appels `fetch()` sécurisés vers l’API
- **Backend**
  - Entités Symfony : `RocketModule`, `RocketSubModule`, `RocketMotionScript`
  - API Platform pour exposer les entités via REST
  - Authentification JWT (Lexik JWT Bundle)
- **Base de données**
  - Utilisation de Doctrine ORM
  - Relations ManyToMany entre modules et sous-modules
- **Conteneurisation**
  - Docker Compose : services `php-fpm`, `mysql`, `nginx-proxy`, `certbot` (éventuellement)

## 4. Installation locale (développeurs)
```bash
# Cloner le projet
git clone https://github.com/toncompte/ton-projet.git

# Aller dans le dossier
cd ton-projet

# Lancer l'environnement Docker
sudo docker compose up -d

# Accéder à l'interface sur localhost (ex: http://localhost/rocket)
```

- Variables d'environnement : `.env`
- Migration de la base de données : `php bin/console doctrine:migrations:migrate`
- Création d'un utilisateur via l'API POST `/api/register` (si prévu)

## 5. Utilisation de l'API
- Authentification : `POST /api/login`
- Endpoints principaux :
  - `GET /api/rocket_modules`
  - `POST /api/rocket_modules`
  - `GET /api/rocket_sub_modules`
- Nécessité de passer un header `Authorization: Bearer <token>` après connexion.

Exemple d’appel en JavaScript :
```javascript
await RocketAuthentication.fetchWithAuth('/api/rocket_modules', { method: 'GET' });
```

## 6. Structure des entités
| Entité | Description | Champs clés |
|:------:|:------------|:------------|
| `RocketModule` | Modèle de fusée | Nom, Masse, Poussée, Surface, Durée |
| `RocketSubModule` | Accessoire ou module secondaire | Nom, Masse additionnelle |
| `RocketMotionScript` | Script de trajectoire | Titre, Script brut |

## 7. Sécurité
- Authentification JWT avec durée limitée
- Accès aux données filtré par utilisateur connecté
- Protection des actions sensibles (`POST`, `PUT`, `DELETE`)

## 8. Déploiement
- Préparation des images Docker pour production
- Utilisation d'un reverse proxy nginx
- Let's Encrypt pour HTTPS
- Variables d'environnement spécifiques pour `.env.prod`

## 9. FAQ
- **Je n’arrive pas à me connecter.**
  → Vérifiez que l’API backend est bien accessible et que vous utilisez un token valide.
- **La simulation ne démarre pas.**
  → Assurez-vous d’avoir entré des paramètres physiques cohérents.
- **Comment modifier un modèle de fusée ?**
  → Connectez-vous, allez dans « Mes fusées », cliquez sur « Modifier ».

## 10. Auteurs / Crédits
- Développé par **[Ton Nom]** (projet CAS - IB 2024/2025)
- Merci à toutes les ressources pédagogiques utilisées : Planète Sciences, CNES, ESA, etc.
