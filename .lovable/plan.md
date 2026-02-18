
## Envoi de photos éphémères par l'utilisateur

### Ce que ça change

Aujourd'hui, seule l'IA peut envoyer des photos éphémères (via le marqueur `ephemeral_photo:` dans les messages). L'utilisateur va pouvoir faire la même chose : sélectionner une photo depuis son appareil, qui s'affiche comme une photo éphémère dans la bulle de message côté utilisateur — la destinataire (l'IA) ne peut la voir qu'une fois, pendant 10 secondes.

---

### Architecture choisie

**Upload vers le stockage cloud** (bucket `character-photos` déjà public, ou nouveau bucket `user-uploads`) → URL stockée dans le message avec le préfixe `ephemeral_photo:` → rendu identique au système existant.

**Flux complet :**
1. L'utilisateur clique sur le bouton 📎 (Paperclip) dans la barre de saisie
2. Un `input[type=file]` s'ouvre — sélection d'une photo
3. La photo est uploadée dans le bucket Lovable Cloud `user-photos` (nouveau bucket privé)
4. Un message `ephemeral_photo:<url>` est inséré en base avec `sender: 'user'`
5. La photo s'affiche dans le chat côté utilisateur avec le composant `EphemeralPhoto` existant
6. L'état "vue" reste géré en localStorage comme pour les photos de l'IA

---

### Modifications techniques

**Base de données (migration SQL)**
- Créer un nouveau bucket `user-photos` public pour les photos uploadées par les utilisateurs
- Ajouter une RLS policy : les utilisateurs authentifiés peuvent uploader dans leur propre dossier

**`src/pages/ChatConversation.tsx`**
- Remplacer le bouton `<Paperclip>` décoratif (actuellement sans action) par un vrai bouton qui déclenche un `<input type="file" accept="image/*">`
- Ajouter une ref `fileInputRef` pour l'input caché
- Ajouter une fonction `handlePhotoSelect` :
  1. Récupère le fichier sélectionné
  2. Upload vers le bucket `user-photos` avec le chemin `<userId>/<timestamp>.<ext>`
  3. Récupère l'URL publique
  4. Appelle `sendMessage('ephemeral_photo:<url>', 'user')` ou ajoute localement si non authentifié
- Ajouter un état `isUploadingPhoto` pour afficher un spinner sur le bouton pendant l'upload
- Importer `Camera` de lucide-react pour remplacer l'icône Paperclip (plus cohérent visuellement)

**Rendu des messages existants (lignes 783-854)**
- Le système de rendu actuel détecte déjà `ephemeral_photo:` dans tous les messages quel que soit le sender — ça fonctionne donc automatiquement pour les messages utilisateur aussi
- Aucune modification du rendu nécessaire ✓

**`EphemeralPhoto.tsx`**
- Pas de modification nécessaire — le composant est agnostique au sender ✓

---

### Gestion des états

```
isUploadingPhoto = false  →  bouton 📷 normal, cliquable
isUploadingPhoto = true   →  bouton affiche Loader2 animé, désactivé
```

---

### Expérience utilisateur

- Bouton 📷 dans la barre de saisie (remplace le Paperclip décoratif)
- Preview rapide : avant d'envoyer, une petite préview de l'image sélectionnée s'affiche au-dessus de la barre de saisie avec un bouton "Envoyer" pour confirmer et "Annuler"
- Après envoi : la bulle apparaît côté utilisateur avec l'icône éphémère verte (même rendu que les photos de l'IA)
- Toast d'erreur si l'upload échoue

---

### Fichiers modifiés

1. **Migration SQL** — création bucket `user-photos` avec RLS
2. **`src/pages/ChatConversation.tsx`** — bouton photo fonctionnel + logique d'upload + préview avant envoi
