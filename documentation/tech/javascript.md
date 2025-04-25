
# Documentation JavaScript - RocketBuilder

Cette section décrit l'organisation et le rôle des différents scripts JavaScript de l'application.

---

## 📂 Dossier `public/js/`

Le JavaScript est organisé en trois sous-dossiers principaux :

---

### 1. 📚 `Api/`

Contient des classes utilitaires pour communiquer avec l'API.

| Fichier | Rôle |
|:---|:---|
| `RocketAuthentication.js` | Gère l'authentification via JWT, stockage du token et headers d'authentification. |

**Extrait :**

```javascript
static async login(username, password) {
    const response = await fetch('/api/login', {
        method: 'POST',
        body: JSON.stringify({ username, password }),
        headers: { 'Content-Type': 'application/json' }
    });
    const data = await response.json();
    this.token = data.token;
}
```

---

### 2. 📚 `Component/`

Composants d'interface utilisateur.

| Fichier | Rôle |
|:---|:---|
| `NavBar.js` | Composant de barre de navigation dynamique. |
| `RocketForm.js` | Formulaire de création de module/sous-module avec validation des champs.|

**Extrait :**

```javascript
export default function NavBar() {
    return `
        <nav class="bg-gray-800 p-2 text-white">
            RocketBuilder Navigation
        </nav>
    `;
}
```

---

### 3. 📚 `Pages/`

Pages de l'application accessibles aux utilisateurs.

| Fichier | Rôle |
|:---|:---|
| `LoginPage.js` | Gère l'affichage du formulaire de connexion utilisateur. |
| `DashboardPage.js` | Affiche les modules et sous-modules existants après connexion.|

**Extrait :**

```javascript
export default function LoginPage() {
    return `
        <form id="login-form">
            <input type="text" id="username" placeholder="Nom d'utilisateur">
            <input type="password" id="password" placeholder="Mot de passe">
            <button type="submit">Connexion</button>
        </form>
    `;
}
```

---

# 📢 Remarques

- Tout est codé en **ES6+** (import/export, arrow functions).
- Les appels API utilisent **fetch** nativement avec `Authorization: Bearer` automatiquement ajouté.
- Les composants sont **purs** (pas de framework type React ou Vue).

---

# 🚀 À retenir

- **Api/** ➔ communication avec l'API
- **Component/** ➔ composants réutilisables d'interface
- **Pages/** ➔ pages principales

---
