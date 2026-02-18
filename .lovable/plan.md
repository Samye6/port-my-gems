
## Correction du glow et du gradient bas : effet propre et non intrusif

### Ce qu'on voit sur le screenshot

Deux problèmes distincts :

1. **Haut** : le glow externe (div avec `inset: '-8px'`) rayonne avec des couleurs vives (rose/violet) qui sont visibles comme une bande colorée derrière le haut de la carte. L'effet est trop saturé et trop proche de l'image — ça semble "collé" et carré.

2. **Bas** : `bg-gradient-to-t from-black/95 via-black/50 to-transparent` — le `from-black/95` est quasi-opaque et couvre ~50% de la carte en bas. C'est ce qui crée la zone noire trop sombre sous le personnage.

### Corrections précises

**Glow externe (haut) :**
- Réduire l'opacité max de `0.5/0.4/0.3` à `0.25/0.2/0.15` — moins saturé
- Augmenter le `blur` de `20px` à `30px` — plus diffus, moins visible comme un bloc
- Réduire l'`inset` de `-8px` à `-4px` — colle moins à la carte

**Gradient bas :**
- Changer `from-black/95` → `from-black/80` — moins opaque
- Changer `via-black/50` → `via-black/20` — transition plus douce
- Le gradient ne couvre que le bas, pas toute la moitié de la carte

```tsx
// AVANT
background: 'linear-gradient(135deg, hsl(338 100% 55% / 0.5), hsl(270 60% 50% / 0.4), hsl(20 100% 75% / 0.3))'
filter: 'blur(20px)'
inset: '-8px'

// APRÈS — plus subtil, plus diffus
background: 'linear-gradient(135deg, hsl(338 100% 55% / 0.25), hsl(270 60% 50% / 0.18), hsl(20 100% 75% / 0.12))'
filter: 'blur(30px)'
inset: '-4px'
```

```tsx
// AVANT
<div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/50 to-transparent" />

// APRÈS — gradient doux, naturel
<div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
```

### Résultat attendu

- Le glow reste visible comme une "aura" subtile autour de la carte au hover, pas comme un bloc coloré
- La photo est bien visible sur toute sa hauteur, le bas est lisible sans être noirci
- Effet premium et naturel

### Fichier modifié

1. **`src/components/home/CharacterCard.tsx`** — ligne 84 (couleurs glow), ligne 85 (blur), ligne 83 (inset), ligne 135 (gradient bas)
