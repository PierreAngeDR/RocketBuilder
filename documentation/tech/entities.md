
# Documentation des Entités - RocketBuilder

Cette section décrit les entités principales utilisées dans RocketBuilder.

Chaque entité est mappée avec Doctrine ORM et représente une table SQL.

---

## 📑 Entités principales

---

### 1. 🧩 `User`

Représente un utilisateur de l'application.

| Champ | Type | Description |
|:---|:---|:---|
| id | int | Identifiant unique |
| username | string | Nom d'utilisateur (unique) |
| roles | array | Rôles Symfony (ex: ROLE_USER) |
| password | string | Mot de passe hashé (bcrypt) |

**Relation :**
- Un utilisateur possède plusieurs RocketModules, RocketSubModules et RocketMotionScripts.

---

### 2. 🧩 `RocketModule`

Représente un module principal de fusée.

| Champ | Type | Description |
|:---|:---|:---|
| id | int | Identifiant unique |
| title | string | Titre du module |
| content | JSON | Données JSON personnalisées |
| owner | User | Utilisateur propriétaire |

**Relation :**
- Un RocketModule peut avoir plusieurs RocketSubModules associés.

---

### 3. 🧩 `RocketSubModule`

Représente un sous-module pouvant appartenir à plusieurs modules.

| Champ | Type | Description |
|:---|:---|:---|
| id | int | Identifiant unique |
| title | string | Titre du sous-module |
| content | JSON | Données JSON personnalisées |
| owner | User | Utilisateur propriétaire |
| modules | ManyToMany(RocketModule) | Liste des modules liés |

**Relation :**
- Peut être lié à **plusieurs** RocketModules.

---

### 4. 🧩 `RocketMotionScript`

Contient des scripts de mouvement liés aux sous-modules.

| Champ | Type | Description |
|:---|:---|:---|
| id | int | Identifiant unique |
| title | string | Titre du script |
| script | text | Contenu du script (ex : instructions de mouvement) |
| owner | User | Utilisateur propriétaire |
| subModules | ManyToMany(RocketSubModule) | Sous-modules associés |

**Relation :**
- Peut être lié à **plusieurs** RocketSubModules.

---

# 📢 Remarques importantes

- Tous les objets sont **liés à un User** pour garantir l'isolement des données.
- Le champ `content` dans `RocketModule` et `RocketSubModule` est un **champ JSON** libre.
- Les relations ManyToMany sont gérées via des tables pivot automatiques par Doctrine.

---

# 🚀 Résumé

| Entité | Principale responsabilité |
|:---|:---|
| `User` | Gestion des utilisateurs |
| `RocketModule` | Gestion des modules de fusée |
| `RocketSubModule` | Gestion des sous-modules rattachables |
| `RocketMotionScript` | Gestion des scripts de mouvement |

---
