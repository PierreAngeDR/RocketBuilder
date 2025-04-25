
# Arborescence du projet RocketBuilder

Cette section présente l'organisation des dossiers et fichiers de l'application.

---

## 📂 Structure générale

```
RocketBuilder/
├── assets/                # Sources front-end (JS/CSS avant compilation)
├── bin/                   # Scripts Symfony (ex: console)
├── config/                # Configuration Symfony (routes, packages, etc.)
├── migrations/            # Fichiers de migration de la base de données
├── public/                # Racine web publique (CSS, JS compilé, entry point)
│   ├── js/                # Scripts JavaScript (modules, composants)
│   │   ├── Api/           # Classe d'authentification et appels API
│   │   ├── Component/     # Composants d'interface utilisateur (UI)
│   │   └── Pages/         # Pages de l'application (login, dashboard)
│   └── styles/            # Fichiers CSS / Tailwind
├── src/                   # Code PHP principal (controllers, entities, repositories)
│   ├── Controller/        # Contrôleurs Symfony (API, Pages)
│   ├── Entity/            # Entités Doctrine ORM (RocketModule, User, etc.)
│   ├── Repository/        # Repositories pour les requêtes personnalisées
├── templates/             # Templates Twig pour le rendu HTML
├── tests/                 # Tests unitaires et fonctionnels
├── translations/          # Fichiers de traduction
├── .env                   # Variables d'environnement par défaut
├── composer.json          # Dépendances PHP du projet
├── docker-compose.yaml    # Configuration Docker pour l'environnement
└── README.md              # Description rapide du projet
```

---

## 📑 Détail des dossiers importants

### `assets/`
Contient les fichiers source front-end : TailwindCSS, JavaScript avant transpilation.

### `public/`
Contient tous les fichiers accessibles directement par les navigateurs.

### `src/`
Code PHP principal (Controllers, Entities, Repositories).

### `templates/`
Fichiers Twig pour le rendu côté serveur.

### `config/`
Fichiers de configuration Symfony.

### `migrations/`
Scripts SQL pour la base de données.

### `tests/`
Tests unitaires et fonctionnels.

### `.env`
Variables d'environnement (BDD, JWT, etc.)

---

# 📢 Remarques

- API REST sécurisée par JWT.
- TailwindCSS compilé automatiquement.
- API exposée via API Platform.

---
