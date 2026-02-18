
## Suppression des étoiles/Sparkles dans tout le site

### Problème identifié

L'icône `Sparkles` (l'étoile scintillante de Lucide) est utilisée à plusieurs endroits et donne un effet générique "IA" que tu ne veux pas. Voici tous les emplacements :

1. **`src/pages/Scenarios.tsx`** — 3 usages :
   - Icône à côté du titre **"Fantasy"** dans le carousel → remplacé par `Flame` (la flamme, déjà utilisée dans les badges "Trending", cohérente avec l'érotisme/désir)
   - Icône par défaut pour les scénarios non mappés → remplacé par `MessageCircle`
   - Icône dans l'indice de contenu du dialog → remplacé par `Shield` (discrétion)

2. **`src/components/home/CharacterCard.tsx`** — 1 usage :
   - Icône de badge par défaut → remplacé par `Flame`

3. **`src/components/home/PremiumBanner.tsx`** — 1 usage :
   - Icône dans le bouton/bloc premium → remplacé par `Crown`

4. **`src/components/home/SuggestedCharacters.tsx`** — 1 usage :
   - Icône à côté du titre "Elles veulent te parler…" → remplacé par `Heart`

5. **`src/pages/Onboarding.tsx`** — 1 usage :
   - Grande icône centrale à l'étape "Choisissez votre style" → remplacé par `Heart`

6. **`src/pages/Profile.tsx`** — 2 usages :
   - Icône dans le bloc "Statistiques" → remplacé par `BarChart2` (ou `TrendingUp`)
   - Icône sur le bouton "Gérer mon abonnement" → remplacé par `Crown`

7. **`src/pages/Auth.tsx`** — 1 usage :
   - Le texte "Tu es prêt ? ✨" → l'emoji ✨ est simplement supprimé

8. **`src/components/ConversationSettings.tsx`** — 2 usages :
   - "✨ Style d'écriture" → remplacé par "— Style d'écriture" ou supprimé
   - "✨ Doux & détaillé" dans la liste → retiré

---

### Résumé des remplacements

| Fichier | Remplacement |
|---|---|
| Scenarios.tsx — "Fantasy" | `Sparkles` → `Flame` |
| Scenarios.tsx — scénario par défaut | `Sparkles` → `MessageCircle` |
| Scenarios.tsx — dialog hint | `Sparkles` → `Shield` |
| CharacterCard.tsx — badge default | `Sparkles` → `Flame` |
| PremiumBanner.tsx | `Sparkles` → `Crown` |
| SuggestedCharacters.tsx | `Sparkles` → `Heart` |
| Onboarding.tsx | `Sparkles` → `Heart` |
| Profile.tsx — Statistiques | `Sparkles` → `TrendingUp` |
| Profile.tsx — bouton abonnement | `Sparkles` → `Crown` |
| Auth.tsx | `✨` supprimé |
| ConversationSettings.tsx | `✨` supprimés |

### Fichiers modifiés
1. `src/pages/Scenarios.tsx`
2. `src/components/home/CharacterCard.tsx`
3. `src/components/home/PremiumBanner.tsx`
4. `src/components/home/SuggestedCharacters.tsx`
5. `src/pages/Onboarding.tsx`
6. `src/pages/Profile.tsx`
7. `src/pages/Auth.tsx`
8. `src/components/ConversationSettings.tsx`
