# Les Archives du Professeur Chen

Site officiel — `archivesprofesseurchen.com`

## Stack

- React 18 + Vite + TypeScript
- Tailwind CSS 3
- React Router 6
- Déploiement Netlify (config incluse)

## Design — Charte graphique 2026

Identité éditoriale archivistique « Les Archives du Professeur Chen » (marque sœur de CMAY Collections, vocabulaire typographique partagé).

- **Typographies** : DM Sans (titres / corps) + DM Mono (intitulés, légendes, métadonnées)
- **Palette** : Encre `#16130D`, Crème `#FAF4E7`, Parchemin `#F0E6CC`, Rouge Sceau `#C73B2B`, Vert Herbier `#5E7A48`, Laiton `#C2922F`
- **Signes** : le sceau d'archiviste (étincelle + livre ouvert), l'étincelle à quatre branches en motif, pictogrammes en ligne
- Mode clair par défaut ; sections sombres « Encre » en ponctuation (hero, bandeaux, footer) avec motif d'étincelles
- Tokens dans `tailwind.config.js`, classes éditoriales (`.display`, `.heading-1/2`, `.eyebrow`, `.label`, `.tag`, `.card`…) dans `src/index.css`

## Lancer en local

```bash
npm install
npm run dev
```

Site dispo sur `http://localhost:5173`.

## Build de production

```bash
npm run build
npm run preview
```

## Structure

```
src/
├── main.tsx          # entrée Vite
├── App.tsx           # routes
├── index.css         # styles globaux + Tailwind
├── data/site.ts      # CONTENU ÉDITABLE — liens, textes, modules, FAQ
├── components/
│   ├── brand/        # Seal, Spark, SparkField, Wordmark, Pictogram (identité charte)
│   ├── layout/       # Navbar, Footer, Layout
│   └── ui/           # SectionHeading, TypeBadge, LiveDot, SocialIcon, DiscordLiveStats
└── pages/
    ├── Home.tsx
    ├── Formation.tsx
    ├── Discord.tsx
    ├── Minecraft.tsx
    ├── Socials.tsx
    ├── Contact.tsx
    ├── LegalPage.tsx
    └── NotFound.tsx
```

## À personnaliser avant mise en ligne

Tout est centralisé dans `src/data/site.ts` :

- [ ] URLs réelles des réseaux (YouTube, Instagram, TikTok, Facebook)
- [ ] Lien d'invitation Discord
- [ ] IP réelle du serveur Minecraft
- [ ] Lien d'inscription à la formation (`formation.ctaUrl`)
- [ ] Témoignages réels d'élèves
- [ ] News du carnet de bord
- [ ] Pages légales (`src/pages/LegalPage.tsx`) — à compléter avec un avocat

## Idées d'évolutions

- Statut live du serveur Minecraft (API Pixelmon/mcstatus.io)
- Indicateur "En live" YouTube (YouTube Data API)
- Connexion newsletter à Brevo/Mailchimp/Supabase
- Formulaire de contact branché à Netlify Forms ou Supabase
- Blog/CMS (Sanity, Contentful, ou Markdown)
- Calendrier d'événements avec inscription
- Page "Hall of Fame" pour les meilleures créations Minecraft
- Pokédex interactif des membres du Discord
- Mode sombre intégral (variante « Encre » de la charte ; le site est clair-first)
- i18n (anglais, espagnol — d'après les fichiers SACD multilingues)

## Déploiement

Push sur le repo Git connecté à Netlify :
- Build command : `npm run build`
- Publish directory : `dist`
- Le fichier `netlify.toml` configure déjà le SPA fallback
