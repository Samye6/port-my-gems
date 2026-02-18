
## Suppression du badge "Exclusif" sur la carte Premium+

### Ce qui est concerné

Dans `src/pages/Subscriptions.tsx`, la carte Premium+ a la propriété `isExclusive: true` dans l'objet `plans`. Cette propriété déclenche deux choses :

1. **Le badge "✦ Exclusif"** affiché en haut de la carte (ligne 178) — via la fonction `getBadge()`
2. Des **styles visuels spécifiques** (fond violet, glow, shimmer) appliqués via `getCardStyles()` — ceux-là on les garde

### Modification unique

**`src/pages/Subscriptions.tsx`** — dans la fonction `getBadge()`, supprimer simplement le bloc `if (plan.isExclusive)` qui retourne le badge "✦ Exclusif" :

```ts
// Avant — retourne le badge violet "✦ Exclusif"
if (plan.isExclusive) {
  return {
    label: "✦ Exclusif",
    background: "...",
    ...
  };
}

// Après — ce bloc est supprimé → getBadge() retourne null pour Premium+
// La carte n'affiche plus de badge
```

Le style visuel de la carte (fond violet/or, glow, shimmer) reste intact — seul le badge "✦ Exclusif" disparaît.

### Fichier modifié
1. **`src/pages/Subscriptions.tsx`** — suppression du bloc `if (plan.isExclusive)` dans `getBadge()`
