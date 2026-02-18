
## Correction du hover sur les cartes Fantasy

### Problème diagnostiqué

En regardant la capture d'écran, la carte "La Fit Girl" (locked) affiche simultanément :
1. L'**overlay locked** (cadenas + "Connecte-toi") avec son backdrop-blur
2. Le **hover CTA** ("Viens me parler 😘") avec son propre backdrop-blur noir
3. Le **tagline** qui s'ouvre en bas

Ces trois couches se superposent et créent un effet visuel chaotique. Le problème vient du fait que le hover CTA s'affiche même quand `isLocked = true` — le check `isHovered && !isLocked` est correct pour les `pointerEvents` mais l'opacity est aussi conditionnée, pourtant l'overlay locked se superpose par-dessus et les deux blurs se combinent mal.

### Corrections

**`src/components/home/CharacterCard.tsx`** — 3 ajustements précis :

**1. Hover CTA** — déjà conditionné par `!isLocked` pour l'opacity, mais le backdrop-blur se combine avec celui du locked overlay. Remplacer le div CTA par un rendu conditionnel qui ne monte pas du tout dans le DOM si `isLocked` :

```tsx
// Avant — toujours dans le DOM, juste opacity:0
<div style={{ opacity: isHovered && !isLocked ? 1 : 0, pointerEvents: ... }}>

// Après — ne monte pas du tout si locked
{!isLocked && (
  <div style={{ opacity: isHovered ? 1 : 0, ... }}>
)}
```

**2. Tagline on hover** — également s'ouvre même sur les cartes locked. Conditionner aussi par `!isLocked` :

```tsx
// Avant
style={{ maxHeight: isHovered ? '80px' : '0px', opacity: isHovered ? 1 : 0 }}

// Après
style={{ maxHeight: isHovered && !isLocked ? '80px' : '0px', opacity: isHovered && !isLocked ? 1 : 0 }}
```

**3. Inner hover tint** — le gradient violet interne apparaît aussi sur les locked cards au hover, ce qui est visible sous l'overlay. Conditionner son opacity :

```tsx
// Avant
style={{ opacity: isHovered ? 1 : 0 }}

// Après
style={{ opacity: isHovered && !isLocked ? 1 : 0 }}
```

**4. Image zoom** — l'image zoome aussi au hover même sur locked. Supprimer l'effet de zoom sur les cartes locked :

```tsx
// Avant
transform: isHovered ? 'scale(1.08)' : 'scale(1)'

// Après
transform: isHovered && !isLocked ? 'scale(1.05)' : 'scale(1)'
```

**5. translateY** — La carte locked ne devrait pas "se soulever" non plus puisque c'est non-cliquable. Conditionner la translation :

```tsx
// Avant
transform: isHovered ? 'translateY(-6px)' : 'translateY(0)'

// Après
transform: isHovered && !isLocked ? 'translateY(-6px)' : 'translateY(0)'
```

**6. Glow externe** — idem, conditionner l'opacity du halo :

```tsx
// Avant
opacity: isHovered ? 1 : 0

// Après
opacity: isHovered && !isLocked ? 1 : 0
```

### Résultat attendu

- Carte **unlocked** : hover fluide avec élévation, zoom image subtil, glow rose/violet, CTA "Viens me parler 😘" → parfait
- Carte **locked** : aucun effet hover, l'overlay cadenas reste propre et seul, pas de superposition bizarre

### Fichier modifié

1. **`src/components/home/CharacterCard.tsx`** — 6 lignes modifiées, aucune refonte structurelle
