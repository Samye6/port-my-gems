
## Correction du login Google : redirection après OAuth + listener de session

### Le problème exact

Le flow Google OAuth fonctionne techniquement (les logs auth montrent une connexion réussie de "Papi Molière"), mais l'expérience utilisateur est cassée pour deux raisons :

**1. Mauvais redirect_uri**
Le `redirect_uri` pointe vers `window.location.origin` soit la racine `/` qui charge `<Scenarios />`. Après le retour OAuth, l'utilisateur arrive sur la page d'accueil sans jamais être redirigé vers `/profile`.

**2. Absence d'écouteur de session**
Le `useEffect` dans `Auth.tsx` ne vérifie la session qu'une seule fois au montage. Quand Google OAuth redirige l'utilisateur vers `/auth` avec les tokens dans l'URL, il n'y a aucun listener `onAuthStateChange` pour détecter l'arrivée de la session et déclencher la navigation.

### La solution

**Dans `Auth.tsx` :**

1. Remplacer le `redirect_uri` par `${window.location.origin}/auth` — pour que Google redirige vers la page Auth après authentification, et pas vers Scenarios

2. Ajouter un listener `onAuthStateChange` dans le `useEffect` — il détecte en temps réel quand la session est établie (que ce soit via email/password ou Google) et redirige vers `/profile`

```tsx
useEffect(() => {
  setIsVisible(true);

  // Écoute en temps réel les changements de session (email + Google OAuth)
  const { data: { subscription } } = supabase.auth.onAuthStateChange(
    (event, session) => {
      if (session) {
        navigate("/profile");
      }
    }
  );

  // Vérification initiale au montage (cas où la session existe déjà)
  supabase.auth.getSession().then(({ data: { session } }) => {
    if (session) {
      navigate("/profile");
    }
  });

  return () => subscription.unsubscribe();
}, [navigate]);
```

3. Changer le `redirect_uri` :
```tsx
const { error } = await lovable.auth.signInWithOAuth("google", {
  redirect_uri: `${window.location.origin}/auth`,  // redirige vers /auth, pas /
});
```

### Résultat attendu

- L'utilisateur clique "Continuer avec Google"
- Google authentifie l'utilisateur
- Google redirige vers `/auth` (avec les tokens dans l'URL)
- `onAuthStateChange` détecte la session et redirige automatiquement vers `/profile`
- L'expérience est fluide et correcte

### Fichier modifié

1. **`src/pages/Auth.tsx`** — `useEffect` avec `onAuthStateChange` + `redirect_uri` corrigé vers `/auth`
