
## Refonte du titre Hero + suppression du badge

### Ce qui pose problème

1. **Badge "Nouveau match disponible"** — le concept de "match" est trompeur (comme Tinder), il ne correspond pas à l'expérience réelle.
2. **Titre "Ton match du moment t'attend…"** — même problème + le mot "match" implique une réciprocité (deux personnes qui s'apprécient mutuellement) qui n'existe pas ici.

---

### Propositions de titres

Voici 5 directions, chacune avec un angle différent :

**Option A — L'intimité / le désir**
> Elle t'attendait.
> Depuis le début.

Sobre, mystérieux, crée une tension émotionnelle immédiate. Le "elle" implique déjà une personne réelle.

**Option B — Le fantasme / l'immersion**
> Tes fantasmes
> prennent vie
> ce soir.

Direct, percutant, promet une transformation. Le "ce soir" crée de l'urgence.

**Option C — La connexion / l'évasion**
> Une conversation
> qui change tout.

Minimaliste et introspectif. Fonctionne bien pour un public cherchant une expérience émotionnelle profonde.

**Option D — L'invitation / la complicité**
> Elle n'attend
> que toi.

Court, percutant, personnel. Le "elle" personnalise immédiatement l'expérience.

**Option E — Le désir / l'IA sexy**
> Dis-lui ce
> que tu veux
> vraiment.

Provocateur, libérateur. Joue sur l'idée que l'IA permet d'être soi sans jugement.

---

### Ma recommandation

**Option D "Elle n'attend que toi."** combinée avec le sous-titre existant légèrement retouché :

```
Elle n'attend         ← blanc
que toi.              ← gradient rose/violet
```

Sous-titre : *"Des personnalités uniques, des conversations intimes, une expérience faite pour toi."*

Simple, humain, sans mensonge sur le concept, et très accrocheur.

---

### Modifications techniques

**`src/components/home/HeroSection.tsx`**

1. **Supprimer** le bloc badge `<div className="inline-flex items-center gap-2...">` (lignes 165-168) + l'import `Sparkles` devenu inutile
2. **Remplacer** le H1 à 3 lignes par le nouveau titre choisi
3. **Retoucher** légèrement le sous-titre pour être cohérent avec le nouveau titre

---

### Question pour toi

Quelle option de titre tu préfères ? Ou tu veux qu'on mixe des éléments de plusieurs options ?
