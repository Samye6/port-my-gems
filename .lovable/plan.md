

# Plan : Photos par personnage en base de donnees

## Probleme actuel
- Les photos sont stockees en dur dans le code (`src/assets/ephemeral-photos/fitgirl-*.jpg`)
- Seul le personnage "fit-girl" peut envoyer des photos
- Les autres personnages (Clara, Lea, Eva, Nathalie) n'ont aucune photo

## Solution proposee

### 1. Creer un bucket de stockage pour les photos de personnages
- Creer un bucket `character-photos` dans le stockage backend (public en lecture)
- Organiser les photos par personnage : `character-photos/fit-girl/photo1.jpg`, `character-photos/collegue/photo1.jpg`, etc.

### 2. Creer une table `character_photos` en base de donnees
- Lier chaque photo a un personnage via son `slug`
- Stocker l'URL de la photo et des metadonnees (description, ordre, etc.)

Structure de la table :

```text
character_photos
+------------------+----------+---------------------------------------+
| Colonne          | Type     | Description                           |
+------------------+----------+---------------------------------------+
| id               | uuid     | Identifiant unique                    |
| fantasy_slug     | text     | Slug du personnage (ex: "fit-girl")   |
| photo_url        | text     | URL vers le fichier dans le bucket    |
| description      | text     | Description optionnelle de la photo   |
| sort_order       | integer  | Ordre d'affichage                     |
| created_at       | timestamp| Date de creation                      |
+------------------+----------+---------------------------------------+
```

### 3. Modifier le code d'envoi de photos
- Supprimer le code hardcode `fitgirlPhotos` et les imports locaux
- Au lieu de verifier `scenarioId === 'fitgirl'`, verifier si le personnage a des photos en base
- Charger les photos depuis la base de donnees au debut de la conversation
- Quand l'IA envoie `[SEND_EPHEMERAL_PHOTO]`, piocher une photo aleatoire parmi celles du personnage actuel

### 4. Mettre a jour l'edge function IA
- Ajouter l'instruction "photos ephemeres" a TOUS les personnages qui ont des photos (pas seulement fit-girl)
- Le systeme verifiera dynamiquement si des photos existent pour le personnage

### 5. Uploader vos photos
- Vous pourrez uploader des photos pour chaque personnage via le backend Cloud
- Chaque personnage aura son propre ensemble de photos

## Etapes techniques

1. Migration SQL : creer la table `character_photos` + bucket `character-photos`
2. Modifier `ChatConversation.tsx` : charger les photos depuis la base au lieu du code local
3. Modifier `chat-ai-response/index.ts` : activer les photos pour tous les personnages qui en ont
4. Supprimer les fichiers locaux `src/assets/ephemeral-photos/` et `src/utils/ephemeralPhotos.ts` (optionnel, apres migration)

## Resultat final
- Chaque personnage a ses propres photos en base de donnees
- Quand un client demande une photo, l'IA envoie une photo du BON personnage
- Vous pouvez ajouter/supprimer des photos par personnage sans toucher au code
