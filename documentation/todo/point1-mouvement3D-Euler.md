
# Méthode d'intégration d'Euler en 3D (JavaScript)

## 1. Objectif

Mettre à jour la **vitesse** et la **position** du sous-module dans un espace 3D à l'aide de la méthode d'Euler.

- La vitesse est représentée par `this.vx()`, `this.vy()`, `this.vz()`.
- La position est représentée par `this.x()`, `this.y()`, `this.z()`.
- L'accélération est un vecteur `{ x, y, z }` calculé avec `calculateAccelerationVector`.

---

## 2. Implémentation de `updateEuler`

```javascript
updateEuler(methodName, acceleration, drag) {
    const dt = this.commonParameters.getDt();

    // Mise à jour des vitesses
    const newVx = this.vx() + acceleration.x * dt;
    const newVy = this.vy() + acceleration.y * dt;
    const newVz = this.vz() + acceleration.z * dt;

    this.vx(newVx);
    this.vy(newVy);
    this.vz(newVz);

    // Mise à jour des positions
    const newX = this.x() + newVx * dt;
    const newY = this.y() + newVy * dt;
    const newZ = this.z() + newVz * dt;

    this.x(newX);
    this.y(newY);
    this.z(Constraints.alwaysPositive(newZ)); // empêche z < 0

    // Partage des données pour stockage ou affichage
    this.shareData(methodName, acceleration, drag);

    return this;
}
```

---

## 3. Remarques

- Cette méthode utilise la méthode d'Euler explicite : $$X_{n+1} = X_n + v \cdot dt$$.
- On applique `Constraints.alwaysPositive()` à `z` (altitude) pour éviter que la fusée passe sous le sol.
- Cette méthode doit être appelée à chaque itération de la simulation.

---
