
## Refonte visuelle de la page Abonnements

### Problème actuel

Le Premium (19,99€) utilise les couleurs or — ce qui le positionne visuellement comme "le meilleur" alors qu'il est moins cher que le Premium+. Le Premium+ a un style anthracite/gris qui le fait paraître fade et peu désirable.

### Stratégie visuelle

- **Découverte** : gris discret, inchangé
- **Premium** : rose/magenta chaud + badge "Best Seller" accrocheur → conversion principale
- **Premium+** : violet/or — couleur "exclusive" qui le distingue clairement du Premium sans voler toute l'attention

---

### Ce qui change

**1. Premium — la star de la conversion**

- Fond : gradient rose/magenta profond (en cohérence avec l'identité Lydia)
- Bordure : rose vif avec glow
- Badge en haut : `🔥 Best Seller` (ou `⚡ Le plus populaire`) — couleur rose/blanc, bien visible
- Prix : gradient blanc → rose clair
- Bouton CTA : rose vif, glow fort — l'appel à l'action principal
- Logo : gold avec glow rose

**2. Premium+ — l'exclusif désirable**

- Fond : gradient violet profond → indigo
- Bordure : violet avec glow violet/or
- Badge en haut : `✦ Exclusif` — ton plus premium/élitiste
- Prix : gradient or → amber (justifie le prix supérieur)
- Bouton CTA : gradient violet → rose, très premium
- Logo : platinum avec glow violet

**3. Ajustements mineurs**

- Le badge "Recommandé" existant sur le Premium+ est remplacé par "Exclusif"
- La fonction `getCardStyles` est mise à jour pour refléter ces nouvelles couleurs
- Les check icons et feature texts adaptés aux nouvelles couleurs de chaque plan

---

### Fichiers modifiés

1. **`src/pages/Subscriptions.tsx`** — uniquement les styles visuels (couleurs, badges, glows) sans toucher à la structure ni au contenu texte
