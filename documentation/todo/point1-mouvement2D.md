
# Objectif : Passage du mouvement 1D (y uniquement) à un mouvement 2D (x, y)

## Ce que cela change :

**Avant** :
- Position : `y(t)`
- Vitesse : `v(t)`
- Accélération : `a(t)`

**Après** :
- Position : `(x(t), y(t))`
- Vitesse : `(vx(t), vy(t))`
- Accélération : `(ax(t), ay(t))`

La poussée, la gravité, la traînée, etc., doivent être **projetées** sur **x** et **y** en utilisant l'**angle d'orientation** de la fusée.

---

## Modifications concrètes à faire :

### 1. Définir de nouveaux états
```javascript
let x = 0;
let y = 0;
let vx = 0;
let vy = 0;
```

### 2. Ajouter un angle d'orientation
```javascript
let angle = Math.PI / 2; // 90 degrés = vertical
```

### 3. Calculer les forces

#### 3.1 Poussée
```javascript
const fx_thrust = thrust * Math.cos(angle);
const fy_thrust = thrust * Math.sin(angle);
```

#### 3.2 Gravité
```javascript
const fy_gravity = -mass * g;
```

#### 3.3 Traînée (Drag)
```javascript
const v = Math.sqrt(vx*vx + vy*vy);
const drag = 0.5 * rho * v * v * dragCoefficient * area;
const fx_drag = -drag * (vx / v);
const fy_drag = -drag * (vy / v);
```

### 4. Calculer les accélérations
```javascript
const ax = (fx_thrust + fx_drag) / mass;
const ay = (fy_thrust + fy_gravity + fy_drag) / mass;
```

### 5. Mettre à jour les vitesses et positions
```javascript
vx += ax * dt;
vy += ay * dt;

x += vx * dt;
y += vy * dt;
```

### 6. Stopper la simulation si la fusée touche le sol
```javascript
if (y < 0) {
    y = 0;
    vy = 0;
    vx = 0; // Optionnel
}
```

---

# Résumé du schéma des forces

- **Poussée** : suit l'angle de la fusée.
- **Gravité** : toujours verticale vers le bas.
- **Traînée** : opposée au vecteur vitesse.

---

# Checklist de ce que l'on doit coder :
- [x] Ajouter `x`, `vx`, `ax`.
- [x] Projeter la poussée selon l'angle.
- [x] Ajouter une force de traînée directionnelle.
- [x] Adapter les équations de mouvement à 2D.
