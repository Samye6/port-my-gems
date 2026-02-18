
## Ajout de la connexion Google

### Ce qui va être fait

Intégration de Google OAuth via Lovable Cloud sur la page de connexion `/auth`.

Un bouton "Continuer avec Google" sera ajouté dans le formulaire, entre les champs et le bouton principal, avec le séparateur "ou" classique. Le style sera cohérent avec le design glassmorphism existant (fond transparent, bordure subtile).

### Étapes techniques

**Étape 1 — Configurer le module Lovable Cloud**
Utiliser l'outil `Configure Social Login` pour générer automatiquement le module `src/integrations/lovable/` avec le package `@lovable.dev/cloud-auth-js`. Google Auth est géré automatiquement par Lovable Cloud, aucune clé API n'est requise.

**Étape 2 — Modifier `src/pages/Auth.tsx`**
- Importer `lovable` depuis `@/integrations/lovable/index`
- Ajouter une fonction `handleGoogleAuth` qui appelle `lovable.auth.signInWithOAuth("google", { redirect_uri: window.location.origin })`
- Ajouter dans le formulaire :
  - Un séparateur "─── ou ───" sous le formulaire email/mot de passe
  - Un bouton Google avec l'icône SVG Google officielle et le style glassmorphism de la page

### Aperçu du bouton Google

```text
┌─────────────────────────────────────────────┐
│  [G]  Continuer avec Google                 │
└─────────────────────────────────────────────┘
```

Style : fond `rgba(255,255,255,0.08)`, bordure `rgba(255,255,255,0.15)`, texte blanc, icône Google colorée.

### Fichiers modifiés
1. **`src/integrations/lovable/`** — généré automatiquement par l'outil
2. **`src/pages/Auth.tsx`** — ajout de l'import, de la fonction et du bouton Google
