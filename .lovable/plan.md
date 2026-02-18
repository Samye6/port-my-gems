
# Correction : Photos éphémères ne s'affichent pas

## Diagnostic complet

### Problème 1 - Table `character_photos` vide (critique)
La table `character_photos` est complètement vide (aucune ligne). Le code dans `ChatConversation.tsx` fait :
```js
if (hasEphemeralPhotos && characterPhotos.length > 0) { ... }
```
Comme `characterPhotos` est vide, aucune photo n'est jamais envoyée. Les 10 photos fitgirl existent dans `src/assets/ephemeral-photos/` mais elles n'ont jamais été migrées vers le bucket cloud `character-photos`.

### Problème 2 - Affichage de l'image dans EphemeralPhoto (secondaire)
Le composant `EphemeralPhoto.tsx` affiche l'image avec :
```jsx
<img
  src={photoUrl}
  className="max-w-full max-h-full object-contain"
/>
```
Si le `photoUrl` est une URL externe ou longue, il peut y avoir un problème de rendu. De plus, le fond noir de la modal est correct mais l'image peut ne pas s'afficher si l'URL est invalide ou vide.

### Problème 3 - Regex de parsing fragile
Le code qui extrait l'URL depuis le contenu du message :
```js
const ephemeralPhotoMatch = message.text.match(/ephemeral_photo:(.+)/);
```
Le `.+` s'arrête à un saut de ligne. Si le contenu stocké a des espaces ou caractères spéciaux, l'URL peut être mal extraite.

---

## Solution

### Étape 1 - Insérer les URLs des photos fitgirl en base
Les photos locales sont dans `src/assets/ephemeral-photos/`. On va insérer leurs URLs publiques Supabase dans la table `character_photos` via une migration SQL.

Les photos seront référencées par le slug `fit-girl` (qui correspond au `fantasy_slug` utilisé dans le code, vérifié dans les logs : `slug: "fit-girl"`).

Pour l'instant, on utilisera les chemins d'assets locaux (bundled par Vite) en tant que `photo_url` dans la table, ET on corrigera le code pour qu'il puisse utiliser aussi bien des URLs de bucket que des assets locaux.

En fait, la meilleure approche est d'insérer directement les URLs publiques du bucket Supabase. On va créer un script SQL qui insère les 10 photos fitgirl avec les URLs publiques du bucket `character-photos` de Supabase. L'URL publique d'un fichier dans un bucket public Supabase suit ce format :
`https://[project-id].supabase.co/storage/v1/object/public/character-photos/fit-girl/fitgirl-1.jpg`

Mais les fichiers ne sont pas encore uploadés dans le bucket. Donc on va faire une approche hybride :

- Pour les photos fitgirl déjà dans le code, on va insérer les URL statiques des assets (les chemins Vite bundlés). Ces URLs seront les URLs publiques des assets.
- En parallèle, on corrige le code pour qu'il fonctionne avec les deux types d'URL.

La vraie solution propre : insérer les URLs d'assets comme chemins absolus dans la migration SQL, et utiliser les assets Vite déjà présents.

### Étape 1 - Migration SQL : insérer les photos fitgirl
On insère les 10 photos fitgirl dans `character_photos` avec leur URL d'asset statique (chemin absolu `/assets/ephemeral-photos/fitgirl-N.jpg` - Vite les place dans `/assets/`). 

En réalité, Vite hash les noms de fichiers lors du build. On ne peut pas prédire les noms après build. La bonne solution est donc d'uploader les photos dans le bucket Supabase et d'utiliser les URLs publiques.

La solution la plus simple et la plus robuste : **conserver les imports locaux ET mettre à jour la table** avec des identifiants spéciaux qu'on résout côté code. On crée un champ optionnel `asset_key` pour les photos locales.

Meilleure approche finale : On va modifier le code pour avoir un **fallback** - si la table est vide pour un personnage, on utilise les photos locales (pour fitgirl). Cela règle le problème immédiatement. Ensuite, pour les autres personnages, les photos viendront de la base.

### Correction finale choisie

**Étape 1** : Modifier `ChatConversation.tsx` pour avoir un fallback sur les photos locales de fitgirl si la table est vide.

**Étape 2** : Corriger la regex de parsing pour être plus robuste (capturer aussi les URLs avec caractères spéciaux).

**Étape 3** : Améliorer l'affichage dans `EphemeralPhoto.tsx` :
- Ajouter un état de chargement de l'image (`onLoad`, `onError`)
- Afficher un indicateur de chargement pendant que l'image charge
- Afficher un message d'erreur clair si l'image ne peut pas se charger
- S'assurer que l'image prend toute la place disponible sur mobile
- Ajouter `loading="eager"` pour forcer le chargement immédiat

**Étape 4** : Migration SQL pour pré-remplir la table avec les photos fitgirl via leurs URLs de storage (les photos seront uploadées manuellement par l'utilisateur ensuite via le backend, ou on insère des URLs d'assets si possible).

## Détails techniques

### Fichiers modifiés

1. **`src/components/EphemeralPhoto.tsx`** :
   - Ajouter un état `isLoading` et `hasError` pour l'image
   - Afficher un spinner pendant le chargement
   - Afficher un message si l'image ne charge pas
   - Améliorer le style mobile de la modal (safe area insets)
   - Corriger le z-index pour s'assurer que la modal s'affiche par-dessus tout

2. **`src/pages/ChatConversation.tsx`** :
   - Réintégrer le fallback avec les photos locales fitgirl si `characterPhotos` est vide pour ce personnage
   - Corriger la regex : `/ephemeral_photo:(.+?)(?:\s|$)/s` → utiliser `(.+)` avec le flag `s` (dotall)
   - Importer `fitgirlPhotos` depuis `src/utils/ephemeralPhotos.ts` comme fallback

3. **Migration SQL** : Insérer dans `character_photos` des entrées pour `fit-girl` avec un champ `asset_key` pour référencer les photos locales, ou laisser l'utilisateur les uploader via le backend.

La solution la plus propre et immédiate : **fallback dans le code + correction de l'affichage EphemeralPhoto**.
