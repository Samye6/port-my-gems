

# Corrections de navigation et scroll

## Probleme 1 : Le bouton "Decouvrir Premium" du Hero redirige vers la mauvaise page
Dans `src/components/home/HeroSection.tsx` (ligne 206), le bouton navigue vers `/premium` au lieu de `/subscriptions`. La page `/subscriptions` est la vraie page tarifaire avec les 3 offres (Decouverte, Premium, Premium+).

**Correction** : Changer `navigate("/premium")` en `navigate("/subscriptions")`.

## Probleme 2 : La page ne remonte pas en haut lors d'un changement de page
Aucun composant `ScrollToTop` n'existe dans le projet. Quand on navigue entre les pages, le scroll reste a la position precedente.

**Correction** : Creer un composant `ScrollToTop` qui ecoute les changements de route et fait `window.scrollTo(0, 0)` a chaque navigation. L'ajouter dans `App.tsx` a l'interieur du `BrowserRouter`.

## Details techniques

### Fichiers modifies

1. **`src/components/home/HeroSection.tsx`** - Ligne 206 : remplacer `/premium` par `/subscriptions`

2. **`src/components/ScrollToTop.tsx`** (nouveau fichier) - Composant qui utilise `useLocation` de react-router-dom et un `useEffect` pour scroller en haut a chaque changement de `pathname`

3. **`src/App.tsx`** - Ajouter `<ScrollToTop />` juste apres `<BrowserRouter>` pour que toutes les pages beneficient du scroll automatique en haut

