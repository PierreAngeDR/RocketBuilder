
# Documentation PHP - RocketBuilder

Cette section décrit l'organisation du code PHP du projet, en particulier les contrôleurs, entités, et repositories.

---

## 📂 Dossier `src/`

Le dossier `src/` contient tout le code backend du projet, organisé en sous-dossiers.

---

### 1. 📚 `Controller/`

Contient les contrôleurs principaux du projet.

| Fichier | Rôle |
|:---|:---|
| `RocketModuleController.php` | Gère les endpoints liés aux **modules** de fusée (CRUD API). |
| `RocketSubModuleController.php` | Gère les endpoints liés aux **sous-modules**. |
| `AuthenticationController.php` | Gère l'authentification des utilisateurs (login via JWT). |

**Extrait :**

```php
#[Route('/api/rocket/modules')]
class RocketModuleController extends AbstractController {
    #[Route('/', methods: ['GET'])]
    public function index(): JsonResponse {
        // Retourne tous les modules de l'utilisateur connecté
    }
}
```

---

### 2. 📚 `Entity/`

Contient les entités Doctrine (tables de base de données).

| Fichier | Description |
|:---|:---|
| `RocketModule.php` | Entité représentant un module principal de fusée (JSON embedded) |
| `RocketSubModule.php` | Entité représentant un sous-module pouvant être lié à plusieurs modules |
| `RocketMotionScript.php` | Scripts de mouvements pour les sous-modules |
| `User.php` | Utilisateurs de l'application (avec login, password hashé, rôle) |

**Extrait :**

```php
#[ORM\Entity]
class RocketModule {
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(type: 'json')]
    private array $content = [];
}
```

---

### 3. 📚 `Repository/`

Contient les classes personnalisées d'accès aux données.

| Fichier | Rôle |
|:---|:---|
| `RocketModuleRepository.php` | Requêtes personnalisées sur les modules |
| `RocketSubModuleRepository.php` | Requêtes personnalisées sur les sous-modules |
| `RocketMotionScriptRepository.php` | Requêtes personnalisées sur les scripts de mouvement |

**Extrait :**

```php
public function findByUser(User $user): array {
    return $this->createQueryBuilder('r')
        ->andWhere('r.owner = :user')
        ->setParameter('user', $user)
        ->getQuery()
        ->getResult();
}
```

---

# 📢 Remarques importantes

- Chaque entité est liée à un `User` pour garantir l'isolation des données.
- Doctrine est utilisé avec **annotations** (Attributes PHP 8+).
- Toutes les API REST passent par des contrôleurs dédiés.

---

# 🚀 À retenir

- **Controller/** ➔ Définition des routes et actions.
- **Entity/** ➔ Modèles de données pour Doctrine.
- **Repository/** ➔ Accès personnalisé aux données.

---
