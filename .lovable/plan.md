
## Refonte du hover : supprimer l'overlay opaque, garder un effet subtil

### Le vrai problème

Le "bloc derrière l'image" est le **Hover CTA** (ligne 203–218) : un `div` qui couvre **toute la carte** avec `bg-black/40 backdrop-blur-sm`. Quand on survole, toute la photo devient sombre et floue — c'est ça qui fait "bug".

La combinaison actuelle au hover :
1. `bg-black/40 backdrop-blur-sm` sur toute la carte → assombrit tout, flou visible
2. `bg-gradient-to-t from-violet-900/30` (inner tint) → couche violette en plus
3. `0 20px 60px rgba(0,0,0,0.5)` (box-shadow) → ombre noire lourde

Trois couches semi-transparentes = effet lourd et "buggy".

### Ce qu'on garde / supprime

**Supprimé :**
- L'overlay `bg-black/40 backdrop-blur-sm` couvrant toute la carte
- L'inner tint violet `from-violet-900/30` (redondant avec le gradient de base)
- La `box-shadow` lourde `0 20px 60px rgba(0,0,0,0.5)` au hover

**Gardé et affiné :**
- Le léger soulèvement `translateY(-6px)` → subtil, élégant
- Le zoom image `scale(1.05)` → dynamique
- Le glow externe rose/violet autour de la carte → signature visuelle
- Le tagline qui s'ouvre en bas → informatif

**Nouveau — le bouton "Viens me parler" :**
Au lieu d'un overlay noir qui écrase la photo, le bouton apparaît **directement en bas de la carte**, glissant depuis le bas par-dessus le gradient existant. Pas d'overlay, pas de blur — juste le bouton pill qui monte proprement :

```tsx
// Avant — overlay noir sur toute la carte
<div className="absolute inset-0 bg-black/40 backdrop-blur-sm ...">
  <div>Viens me parler 😘</div>
</div>

// Après — bouton pill qui monte depuis le bas, sans overlay
<div
  className="absolute bottom-4 left-0 right-0 flex justify-center transition-all duration-300"
  style={{ 
    opacity: isHovered ? 1 : 0,
    transform: isHovered ? 'translateY(0)' : 'translateY(12px)'
  }}
>
  <div className="px-5 py-2.5 rounded-full text-white font-semibold text-sm ...">
    Viens me parler 😘
  </div>
</div>
```

### Résultat attendu

- Hover : la photo reste **visible et belle**, la carte se soulève légèrement, le glow rose apparaît autour, le bouton monte depuis le bas
- Aucun bloc sombre qui "vient derrière l'image"
- Effet fluide, premium, non intrusif

### Fichier modifié

1. **`src/components/home/CharacterCard.tsx`** — suppression de l'overlay `inset-0 bg-black/40`, remplacement par un bouton positionné en bas, suppression de l'inner tint et allègement du box-shadow
