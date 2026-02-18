
## Refonte du hover CTA : supprimer le bouton pill encombrant

### Problème identifié sur la capture

Le bouton "Viens me parler 😘" est un `div` avec `left-0 right-0` — il prend **toute la largeur de la carte**. Avec le padding `px-5`, il reste large mais surtout il se superpose au tagline qui s'ouvre aussi en bas au hover. On a donc deux éléments qui se battent dans la même zone bas de carte.

### La solution : supprimer le bouton pill, garder uniquement le tagline

Le tagline (ex : `"Regards complices..."`) est déjà un bon indicateur d'action — il suffit d'en faire le seul élément hover en bas, sans bouton pill en plus. Le clic sur la carte entière fait déjà l'action.

**Ce qu'on supprime :**
- Le bloc "Hover CTA" entier (lignes 197–217) — le bouton pill `left-0 right-0` encombrant

**Ce qu'on garde et améliore :**
- Le tagline qui s'ouvre déjà au hover en bas — on le rend juste un peu plus visible avec une petite icône

**Alternative minimaliste** — si on veut garder un bouton, le rendre vraiment petit et `w-auto` centré :
- `px-3 py-1.5` au lieu de `px-5 py-2`
- `text-[10px]` au lieu de `text-xs`
- Pas de `left-0 right-0` — juste `w-auto` centré
- Le repositionner **par-dessus** le gradient existant, intégré au bloc content en bas

### Changement technique dans `src/components/home/CharacterCard.tsx`

**Option retenue : supprimer le bouton pill, améliorer le tagline**

```tsx
// SUPPRIMER complètement le bloc Hover CTA (lignes 197–217)

// AMÉLIORER le tagline au hover — déjà en place, juste le rendre plus visible
<div
  className="overflow-hidden transition-all duration-300"
  style={{ maxHeight: isHovered && !isLocked ? '48px' : '0px', opacity: isHovered && !isLocked ? 1 : 0 }}
>
  <p className="text-white/80 text-[11px] pt-1.5 flex items-center gap-1 italic">
    <MessageCircle className="w-3 h-3 text-primary flex-shrink-0" />
    "{sexyTagline}"
  </p>
</div>
```

Le résultat : au hover, la carte se soulève légèrement avec le glow, l'image zoome subtil, et le tagline apparaît en douceur en bas. Propre, premium, sans bouton qui déborde.

### Fichier modifié

1. **`src/components/home/CharacterCard.tsx`** — suppression du bloc "Hover CTA" pill (lignes 197–217), légère amélioration du tagline
