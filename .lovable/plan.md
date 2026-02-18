
## Suppression du bouton flottant "Nouvelle conversation"

### Ce qui doit être fait

Supprimer le bloc `<FloatingChatButton ... />` (lignes 444-453) dans `src/pages/Scenarios.tsx`, ainsi que son import en ligne 24.

Le fichier `src/components/home/FloatingChatButton.tsx` peut également être supprimé puisqu'il ne sera plus utilisé nulle part.

### Fichiers modifiés

1. **`src/pages/Scenarios.tsx`** :
   - Supprimer l'import `FloatingChatButton` (ligne 24)
   - Supprimer le bloc `{/* Floating Chat Button */}` et le composant `<FloatingChatButton ... />` (lignes 444-453)

2. **`src/components/home/FloatingChatButton.tsx`** :
   - Supprimer le fichier (il ne sera plus utilisé)
