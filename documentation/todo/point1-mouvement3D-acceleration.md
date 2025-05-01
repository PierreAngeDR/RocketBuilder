
# Calcul vectoriel de l'accélération dans un modèle 3D

## 1. Contexte

En 1D verticale, l'accélération est calculée simplement comme :

$$
a = \frac{F - F_g - F_d}{m}
$$

où :
- $F$ est la poussée,
- $F_g$ la force gravitationnelle,
- $F_d$ la traînée,
- $m$ la masse.

Mais en 2D/3D, les forces sont des vecteurs et doivent être sommées composante par composante.

---

## 2. Calcul vectoriel en 3D

### Données :
- Vitesse $\vec{v} = (v_x, v_y, v_z)$
- Norme : $v = \|\vec{v}\| = \sqrt{v_x^2 + v_y^2 + v_z^2}$

---

### 2.1 Vecteur traînée

La traînée s'oppose à la direction du vecteur vitesse :

$$
\vec{F}_d = - D \cdot \frac{\vec{v}}{\|\vec{v}\|} = -\frac{1}{2} C_d \rho A v \vec{v}
$$

---

### 2.2 Vecteur poussée

La poussée suit les angles d'azimut ($\phi$) et d'élévation ($\theta$) :

$$
\vec{F}_T = F \cdot (\cos\theta \cos\phi, \cos\theta \sin\phi, \sin\theta)
$$

---

### 2.3 Vecteur gravité

Toujours vers le bas :

$$
\vec{F}_g = (0, 0, -m \cdot g)
$$

---

### 2.4 Accélération totale

$$
\vec{a} = \frac{\vec{F}_T + \vec{F}_d + \vec{F}_g}{m}
$$

---

## 3. Implémentation JS (exemple)

```javascript
calculateAccelerationVector(drag) {
    const vx = this.vx();
    const vy = this.vy();
    const vz = this.vz();

    const v = Math.sqrt(vx * vx + vy * vy + vz * vz);

    let dragVector = { x: 0, y: 0, z: 0 };

    if (v > 0) {
        dragVector = {
            x: -drag * (vx / v),
            y: -drag * (vy / v),
            z: -drag * (vz / v)
        };
    }

    const angleAzimuth = this.azimutAngle();
    const angleElevation = this.elevationAngle();

    const thrust = this.F();
    const thrustVector = {
        x: thrust * Math.cos(angleElevation) * Math.cos(angleAzimuth),
        y: thrust * Math.cos(angleElevation) * Math.sin(angleAzimuth),
        z: thrust * Math.sin(angleElevation)
    };

    const gravityVector = { x: 0, y: 0, z: -this.m() * this.g() };

    return {
        x: (thrustVector.x + dragVector.x + gravityVector.x) / this.m(),
        y: (thrustVector.y + dragVector.y + gravityVector.y) / this.m(),
        z: (thrustVector.z + dragVector.z + gravityVector.z) / this.m()
    };
}
```

---

## 4. Remarques
- Le vecteur vitesse doit être **non nul** pour éviter une division par zéro dans la traînée.
- On suppose que les angles $\theta$ et $\phi$ sont connus et mis à jour à chaque instant.
- Le calcul est **stateless** (pas de dépendance à l’état précédent).

---
