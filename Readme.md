# 🚀 Rocket Simulator Project Documentation

## 1. General Overview
- **Project Name**: Rocket Simulator
- **Description**: A web application for rocket trajectory simulation based on real physical models (thrust, gravity, drag), with multi-user management via a secured API.
- **Target Audience**: Students, physics teachers, curious developers.
- **Main Technologies**:
  - Frontend: JavaScript (ES6+), Tailwind CSS
  - Backend: PHP (Symfony), API Platform
  - Database: MySQL
  - Containerization: Docker

![Home Screen](./documentation/_static/ecran-d-accueil.png "Application home screen :)")

## 2. Main Features
- Authentication via login/password (JWT Token)
- Management of custom rocket models
- Dynamic simulation on Canvas
- Storage and management of flight results
- Full REST API for all operations
- Clear and responsive user interface

## 3. Project Architecture
- **Frontend**
  - HTML pages (login, dashboard, simulation)
  - `RocketAuthentication` class for token management
  - Secure `fetch()` API calls
- **Backend**
  - Symfony Entities: `RocketModule`, `RocketSubModule`, `RocketMotionScript`
  - API Platform to expose entities via REST
  - JWT Authentication (Lexik JWT Bundle)
- **Database**
  - Doctrine ORM usage
  - ManyToMany relationships between modules and submodules
- **Containerization**
  - Docker Compose: `php-fpm`, `mysql`, `nginx-proxy`, `certbot` (optional) services

## 4. Local Installation (Developers)

### Initialization

Edit the `.env.dev` or `.env.prod` file and configure the database connection:

```bash
DATABASE_URL="mysql://root:password@127.0.0.1:3306/rocket?serverVersion=8.0"
```

Then run:

```bash
composer install
./build-tailwind.sh
bin/console cache:clear
```

Optionally configure the `ROUTE_PREFIX` key in `.env.prod` or `.env.dev`, and regenerate it for `services.yaml`:

```bash
php bin/console update:route-prefix
```

### Regenerate JWT keys

```bash
php bin/console lexik:jwt:generate-keypair
```

### Regenerate asset mapper

```bash
php bin/console asset-map:compile
```

### Create the database

```bash
php bin/console doctrine:database:create
php bin/console make:migration
php bin/console doctrine:migrations:migrate
```

- Environment variables: `.env`
- Database migration: `php bin/console doctrine:migrations:migrate`
- User creation via the API: POST `/api/register` (if implemented)

## 5. Using the API
- Authentication: `POST /api/login`
- Main endpoints:
  - `GET /api/rocket_modules`
  - `POST /api/rocket_modules`
  - `GET /api/rocket_sub_modules`
- You must include the header `Authorization: Bearer <token>` after login.

Example API call in JavaScript:

```javascript
await RocketAuthentication.fetchWithAuth('/api/rocket_modules', { method: 'GET' });
```

## 6. Entity Structure
| Entity               | Description                    | Key Fields                         |
| -------------------- | ------------------------------ | ---------------------------------- |
| `RocketModule`       | Rocket model                   | Name, Mass, Thrust, Surface, Duration |
| `RocketSubModule`    | Accessory or secondary module  | Name, Additional Mass             |
| `RocketMotionScript` | Motion script                  | Title, Raw Script                 |

## 7. Security
- JWT authentication with expiration time
- Data access filtered by the connected user
- Protection of sensitive actions (`POST`, `PUT`, `DELETE`)

## 8. Deployment
- Prepare Docker images for production
- Use nginx reverse proxy
- Let's Encrypt for HTTPS
- Specific environment variables for `.env.prod`

## 9. FAQ
- **Full documentation**
  → Available [here](https://pierre-ange.delbary-rouille.net/rocket/doc).
- **I can't log in.**
  → Make sure the backend API is reachable and you are using a valid token.
- **The simulation doesn't start.**
  → Make sure you entered coherent physical parameters.
- **How can I edit a rocket model?**
  → Log in, go to "My Rockets," and click on "Edit."

## 10. Authors / Credits
- Developed by **Pierre-Ange Delbary Rouillé** (CAS Project - IB 2023/2025)
- Thanks to all the educational resources used: Planète Sciences, CNES, ESA, etc.
