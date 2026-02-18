
## Correction du gradient derrière l'image : supprimer la vignette carrée

### Le vrai coupable

Ligne 120 dans `CharacterCard.tsx` :

```tsx
<div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_30%,rgba(139,92,246,0.2)_70%,rgba(0,0,0,0.6)_100%)]" />
```

Ce radial-gradient crée une **ellipse sombre** qui vignette les 4 côtés de la carte avec du noir à 60%. Comme l'ellipse ne suit pas les coins arrondis de la carte, on voit les bords tranchés — surtout à droite et à gauche. Au hover avec `scale(1.05)`, les bords de l'image glissent et le gradient semble "carré" et mal découpé.

### Ce qu'on supprime

- Le `radial-gradient` ellipse avec noir à 60% sur les bords (ligne 120) — c'est lui qui crée l'effet carré visible

### Ce qu'on garde et améliore

- Le gradient du bas `bg-gradient-to-t from-black/95 via-black/50 to-transparent` (ligne 132) — c'est lui qui assure la lisibilité du texte, il fonctionne bien
- On ajoute à la place un **vignette douce uniquement sur les bords** via un `box-shadow inset` — ça suit parfaitement le `border-radius` de la carte sans jamais déborder

### Changement technique

```tsx
// AVANT — ligne 120 — vignette radial carrée
<div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_30%,rgba(139,92,246,0.2)_70%,rgba(0,0,0,0.6)_100%)]" />

// APRÈS — box-shadow inset qui suit le border-radius
<div 
  className="absolute inset-0 rounded-2xl pointer-events-none"
  style={{ boxShadow: 'inset 0 0 40px rgba(0,0,0,0.3)' }}
/>
```

Un `box-shadow inset` respecte toujours le `border-radius` du parent — donc la vignette suit parfaitement les coins arrondis, sans jamais créer d'effet carré ou de coupure visible.

### Résultat attendu

- Aucun carré sombre visible sur les bords de l'image
- La vignette est douce, arrondie, naturelle
- Le texte en bas reste parfaitement lisible grâce au gradient du bas (inchangé)
- Le hover reste smooth : zoom image + soulèvement + glow externe

### Fichier modifié

1. **`src/components/home/CharacterCard.tsx`** — remplacement ligne 120 : suppression du `radial-gradient` carré, remplacement par un `box-shadow inset` qui suit le border-radius
