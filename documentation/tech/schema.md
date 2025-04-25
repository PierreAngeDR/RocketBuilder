
# Schéma global du projet - RocketBuilder

Cette section décrit l'organisation fonctionnelle et technique du projet **RocketBuilder** sous forme de schéma textuel.

---

## 📚 Vue d'ensemble

```
Utilisateur
   │
   ├── Authentification via API JWT
   │     └── /api/login
   │
   └── Accès aux modules / sous-modules
         │
         ├── RocketModule
         │     ├── title: string
         │     ├── content: JSON (modèle dynamique)
         │     └── Relations ManyToMany ➔ RocketSubModule
         │
         ├── RocketSubModule
         │     ├── title: string
         │     ├── content: JSON (modèle dynamique)
         │     └── Relations ManyToMany ➔ RocketModule + RocketMotionScript
         │
         └── RocketMotionScript
               ├── title: string
               ├── script: text (instructions mouvement)
               └── Relations ManyToMany ➔ RocketSubModule
```

---

## 🔥 Fonctionnement technique résumé

- 🔐 **Connexion** ➔ `POST /api/login`
- 📥 **Récupération des modules** ➔ `GET /api/rocket/modules`
- 📥 **Récupération des sous-modules** ➔ `GET /api/rocket/submodules`
- 📥 **Récupération des scripts** ➔ `GET /api/rocket/scripts`
- ✏️ **Création/Modification** ➔ `POST` et `PUT` sur les mêmes endpoints
- ❌ **Suppression** ➔ `DELETE` sur chaque ressource

---

## 🛠️ Technologies utilisées

| Technologie | Utilisation |
|:---|:---|
| Symfony 7.2^ | Backend API REST |
| Doctrine ORM | Modèle de données |
| JWT Authentication | Sécurité API |
| JavaScript Vanilla | Frontend application |
| TailwindCSS | Style de l'application |

---

## 🚀 Schéma API - Accès aux routes principales

```
/api
 ├── /login                   # Authentification
 └── /rocket
      ├── /modules             # CRUD sur RocketModule
      ├── /submodules          # CRUD sur RocketSubModule
      └── /scripts             # CRUD sur RocketMotionScript
```

---

# 📢 Remarque

- Toutes les entités appartiennent à un utilisateur précis.
- Aucun accès n'est possible sans JWT valide.

---
