
## Blocage du scroll vertical dans le carousel Fantasy

### Cause racine

Deux problèmes combinés causent le scroll vertical indésirable :

**1. `overflow-y` non bloqué** — Le conteneur scrollable (ligne 125) a `overflow-x-auto` mais sans `overflow-y: hidden`. Le navigateur permet donc le scroll vertical dans le carousel quand l'utilisateur swipe en diagonale.

**2. `translateY(-6px)` sur les cartes** — Quand une carte se soulève au hover, elle dépasse légèrement la hauteur du conteneur parent. Comme `overflow-y` n'est pas bloqué, le navigateur crée un espace scrollable vertical pour accommoder ce débordement.

**3. `py-4` sur le conteneur** — Le padding vertical donne de l'espace au débordement, ce qui empire le problème.

### Correction

**`src/components/home/CharacterCarousel.tsx`** — Une seule ligne à modifier sur le conteneur scrollable :

```tsx
// Avant
className="flex gap-5 overflow-x-auto scrollbar-hide px-6 py-4"

// Après
className="flex gap-5 overflow-x-auto overflow-y-hidden scrollbar-hide px-6 py-4"
```

`overflow-y: hidden` bloque tout scroll vertical dans le carousel — seul le scroll horizontal reste possible.

Le `translateY` des cartes au hover sera toujours visible visuellement (il remonte légèrement vers le haut dans l'espace du `py-4`), mais ne créera plus de scroll vertical.

### Fichier modifié
1. **`src/components/home/CharacterCarousel.tsx`** — ajout de `overflow-y-hidden` sur la div scrollable (ligne 125)
