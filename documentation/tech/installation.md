
# Installation de RocketBuilder

Cette section décrit comment installer et configurer l'application **RocketBuilder** sur votre machine locale.

---

## 📚 Prérequis

- PHP >= 8.2
- Composer
- Symfony CLI
- Docker et docker-compose (optionnel pour base de données)

---

## 🛠️ Étapes d'installation

### 1. Cloner le dépôt GitHub

```bash
git clone https://github.com/PierreAngeDR/RocketBuilder.git
cd RocketBuilder
```

---

### 2. Installer les dépendances PHP

```bash
composer install
```

---

### 3. Configurer l'environnement

Copier le fichier `.env` :

```bash
cp .env .env.local
```

Puis éditez `.env.local` pour configurer la connexion à votre base de données :

```dotenv
DATABASE_URL="mysql://db_user:db_password@127.0.0.1:3306/db_name?serverVersion=8.0"
```

---

### 4. Créer la base de données

```bash
php bin/console doctrine:database:create
```

---

### 5. Générer et exécuter les migrations

```bash
php bin/console make:migration
php bin/console doctrine:migrations:migrate
```

---

### 6. Initialiser les données par défaut

```bash
php bin/console app:init-defaults-db
```

---

### 7. Générer les assets CSS (TailwindCSS)

```bash
./build-tailwind.sh
```

---

### 8. Lancer le serveur de développement Symfony

```bash
symfony server:start
```

---

## 🚀 Accéder à l'application

Par défaut :

- Accès : [http://localhost:8000](http://localhost:8000)

---

# 💡 Conseils

- Utilisez `symfony server:start -d` pour lancer Symfony en arrière-plan.
- Vérifiez que votre base de données est bien accessible et configurée.
- Vous pouvez utiliser Docker pour la base de données si besoin.

---
