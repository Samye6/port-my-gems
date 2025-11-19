# Photos éphémères

Ce dossier contient les photos éphémères que l'IA peut envoyer dans les conversations.

## Comment ajouter des photos

1. Ajoutez vos photos dans ce dossier (formats supportés: .jpg, .jpeg, .png, .webp)
2. Les photos seront disponibles pour être envoyées par l'IA

## Comment l'IA envoie une photo éphémère

L'IA peut envoyer une photo éphémère en envoyant un message avec le format:
```
ephemeral_photo:src/assets/ephemeral-photos/photo1.jpg
```

## Comportement des photos éphémères

- Les photos s'affichent avec une icône "Voir une fois" / "Photo vue"
- Quand l'utilisateur clique, la photo s'affiche en grand écran
- Après visualisation, la photo apparaît floutée avec "Photo vue"
- L'état "vue" est sauvegardé dans le localStorage du navigateur

## Exemple

Pour qu'une photo soit envoyée, le message de l'IA doit être formaté comme:
```typescript
await sendMessage('ephemeral_photo:src/assets/ephemeral-photos/exemple.jpg', 'ai');
```
