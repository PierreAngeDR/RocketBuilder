
# Documentation de l'API - RocketBuilder

Cette section décrit les principales routes API exposées par RocketBuilder.

Toutes les routes sont sécurisées par **JWT Authentication**.  
Chaque appel doit inclure un header :

```http
Authorization: Bearer <votre_token_jwt>
```

---

## 🔒 Authentification

| Méthode | URL | Description |
|:---|:---|:---|
| POST | `/api/login` | Authentifie l'utilisateur et retourne un token JWT. |

**Exemple de requête :**

```bash
curl -X POST https://your-domain.com/api/login \
  -H "Content-Type: application/json" \
  -d '{"username":"user", "password":"pass"}'
```

Réponse :

```json
{ "token": "xxx.yyy.zzz" }
```

---

## 🚀 Gestion des Modules (`RocketModule`)

| Méthode | URL | Description |
|:---|:---|:---|
| GET | `/api/rocket/modules` | Liste tous les modules de l'utilisateur connecté. |
| POST | `/api/rocket/modules` | Crée un nouveau module de fusée. |
| GET | `/api/rocket/modules/{id}` | Détaille un module spécifique. |
| PUT | `/api/rocket/modules/{id}` | Met à jour un module existant. |
| DELETE | `/api/rocket/modules/{id}` | Supprime un module existant. |

---

## 🚀 Gestion des Sous-Modules (`RocketSubModule`)

| Méthode | URL | Description |
|:---|:---|:---|
| GET | `/api/rocket/submodules` | Liste tous les sous-modules de l'utilisateur. |
| POST | `/api/rocket/submodules` | Crée un nouveau sous-module. |
| GET | `/api/rocket/submodules/{id}` | Détaille un sous-module. |
| PUT | `/api/rocket/submodules/{id}` | Met à jour un sous-module. |
| DELETE | `/api/rocket/submodules/{id}` | Supprime un sous-module. |

---

## 🚀 Gestion des Scripts de Mouvement (`RocketMotionScript`)

| Méthode | URL | Description |
|:---|:---|:---|
| GET | `/api/rocket/scripts` | Liste tous les scripts de mouvement liés à l'utilisateur. |
| POST | `/api/rocket/scripts` | Crée un nouveau script. |
| GET | `/api/rocket/scripts/{id}` | Détaille un script spécifique. |
| PUT | `/api/rocket/scripts/{id}` | Met à jour un script. |
| DELETE | `/api/rocket/scripts/{id}` | Supprime un script.

---

# 📢 Remarques

- Les URLs `/api/rocket/*` nécessitent un utilisateur authentifié via JWT.
- L'API respecte le standard **RESTful** :
  - `GET` ➔ lecture
  - `POST` ➔ création
  - `PUT` ➔ mise à jour
  - `DELETE` ➔ suppression
- Les erreurs retournent du JSON standardisé (`400`, `401`, `403`, `404`).

---

# 🚀 Exemple global

Créer un module :

```bash
curl -X POST https://your-domain.com/api/rocket/modules \
  -H "Authorization: Bearer <votre_token>" \
  -H "Content-Type: application/json" \
  -d '{"title":"Mon premier module","content":{"data":"example"}}'
```

---
