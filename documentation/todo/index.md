
# Idées d'amélioration pour la simulation de trajectoire de fusée

## 1. Ajout du mouvement 2D (ou 3D)
Ajout de l'axe **x** (et éventuellement **z**) :
- **x(t)** : déplacement horizontal.
- **z(t)** : (optionnel) pour simulation spatiale.
- Gestion de la vitesse horizontale et verticale.
- Séparation du vecteur vitesse en composantes (vx, vy).

---

## 2. Variation de l'angle de poussée (guidage actif)
Ajout de :
- **Angle d'orientation θ(t)** en fonction du temps ou de l'altitude.
- Programme de pitch : départ vertical puis inclinaison progressive.

Exemples :
- Inclinaison après une certaine altitude.
- Courbe d'inclinaison : `θ(t) = θ₀ + k·t`.

---

## 3. Modélisation du vent
Ajout d'une force supplémentaire :
- **Vent** = vitesse relative de l'air ≠ 0.
- **Vent variable selon l'altitude** : `wind_speed(y)`, `wind_direction(y)`.

Exemple de fonction :
```javascript
function getWindAtAltitude(y) {
    if (y < 500) return {speed: 5, direction: 90}; // Vent d'Est
    if (y < 1000) return {speed: 10, direction: 45}; // Vent Nord-Est
    return {speed: 20, direction: 0}; // Vent du Nord
}
```

---

## 4. Poussée variable (contrôle du moteur)
- Variation progressive de la poussée (throttle control).
- Simulation de coupure moteur (shutdown).

---

## 5. Effets aérodynamiques supplémentaires
- Traînée dépendante de la vitesse : 
  \[
  F_{drag} = \frac{1}{2} \rho v^2 C_d S
  \]
- Variation de \( C_d \) selon le Mach.
- Surface projetée \( S \) variable si orientation change.

---

## 6. Consommation de carburant (masse variable)
- Diminution de la masse au cours du temps :
  \[
  m(t) = m_0 - \dot{m} \times t
  \]
- Impact direct sur l'accélération.

---

## 7. Effet de la rotation de la Terre (Coriolis)
- Déviation vers l'Est due à la rotation terrestre.
- Peu critique sauf pour très grandes altitudes.

---

## 8. Simulation de la séparation des étages
- Perte de masse instantanée.
- Allumage d'un nouveau moteur.
- Modification de la poussée et de la traînée.

---

## 9. Température et pression atmosphérique variables
- Calcul amélioré de la pression dynamique :
  \[
  q = \frac{1}{2} \rho v^2
  \]
- Impact sur la stabilité et l'aérodynamisme.

---

# Résumé rapide

| Amélioration | Complexité | Intérêt pour le réalisme |
|:---|:---:|:---:|
| Mouvement 2D/3D (x,y) | 👍👍 | 👍👍👍👍 |
| Variation d'angle (pitch program) | 👍👍 | 👍👍👍👍 |
| Vent (variable en altitude) | 👍👍👍 | 👍👍👍👍 |
| Poussée variable | 👍👍👍 | 👍👍👍 |
| Masse variable | 👍👍👍 | 👍👍👍👍 |
| Traînée Mach dépendante | 👍👍👍👍 | 👍👍👍 |
| Rotation de la Terre (Coriolis) | 👍👍👍👍 | 👍👍 |
| Séparation d'étage | 👍👍👍👍 | 👍👍👍👍 |
| Température/pression détaillée | 👍👍 | 👍👍 |
