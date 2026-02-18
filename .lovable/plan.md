
## Correction du hover des cartes Fantasy

### Cause du problème

La classe `micro-parallax` (dans `src/index.css`) applique ceci au hover :
```css
transform: perspective(1000px) rotateX(2deg) rotateY(-2deg) translateY(-8px);
```

Quand un `transform` 3D est combiné avec `overflow-hidden` et `border-radius`, le navigateur perd l'anti-aliasing du clip — le bord carré de l'image "perce" à travers le `rounded-2xl`. C'est un bug connu des moteurs de rendu Webkit/Blink.

De plus, le halo rose/violet (`.absolute -inset-2 ... -z-10`) est à l'intérieur du conteneur `overflow-hidden`, donc il est clippé et ne peut pas rayonner vers l'extérieur correctement.

### Solution en deux parties

**1. Remplacer `micro-parallax` sur les cartes** — au lieu du transform 3D qui casse le border-radius, utiliser uniquement `translateY(-6px)` + transition douce. L'effet d'élévation reste, sans artefact visuel.

**2. Wrapper externe pour le glow** — encapsuler la carte dans un `div` wrapper qui :
- Porte le glow extérieur (le halo rose/violet diffus)
- Laisse la carte elle-même gérer son `overflow-hidden` proprement
- Le glow rayonne en dehors de la carte sans être clippé

### Modifications techniques

**`src/components/home/CharacterCard.tsx`** :

```tsx
// Avant : un seul div avec overflow-hidden + micro-parallax + boxShadow glow
<div className="relative w-52 h-72 rounded-2xl overflow-hidden cursor-pointer group micro-parallax" style={{ boxShadow: ... }}>
  {/* halo -inset-2 -z-10 CLIPPÉ par overflow-hidden */}
  ...
</div>

// Après : wrapper externe pour le glow + carte interne propre
<div className="relative flex-shrink-0" style={{ /* padding pour laisser place au glow */ }}>
  {/* Glow externe — rayonne AUTOUR de la carte, pas dedans */}
  <div className={`absolute inset-0 rounded-2xl blur-2xl transition-opacity duration-500 ${isHovered ? 'opacity-100' : 'opacity-0'}`}
       style={{ background: 'gradient rose/violet', transform: 'scale(1.15)' }} />
  
  {/* Carte principale — overflow-hidden sans transform 3D */}
  <div className="relative w-52 h-72 rounded-2xl overflow-hidden cursor-pointer"
       style={{ 
         transform: isHovered ? 'translateY(-6px)' : 'translateY(0)',
         transition: 'transform 0.35s cubic-bezier(0.34, 1.2, 0.64, 1), box-shadow 0.35s ease',
         boxShadow: isHovered ? '0 20px 60px rgba(0,0,0,0.5)' : '0 10px 40px rgba(0,0,0,0.4)',
         willChange: 'transform',
       }}>
    {/* Contenu inchangé */}
  </div>
</div>
```

La classe `micro-parallax` dans `index.css` est conservée telle quelle car elle peut servir ailleurs — on arrête simplement de l'utiliser sur les `CharacterCard`.

### Résultat attendu

- Hover fluide avec légère élévation
- Aucun carré visible — le `border-radius` reste parfaitement net
- Glow rose/violet diffus qui rayonne proprement autour de la carte
- Transition douce avec un cubic-bezier légèrement rebondissant

### Fichier modifié

1. **`src/components/home/CharacterCard.tsx`** — wrapper externe + suppression du `micro-parallax` sur la carte
