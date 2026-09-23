# Les Archives du Professeur Chen

Site officiel — `archivesprofesseurchen.com`

## Stack

- React 18 · React Router 7 · Vite 6 · TypeScript strict
- CSS maison en couches (`src/styles/`, charte ARC v1.0.0) + utilitaires Tailwind 3
- Déploiement Netlify

## Design — charte ARC v1.0.0

- **Typographies** (auto-hébergées, `public/fonts/`) : Fraunces (titres), Space Grotesk (corps), Space Mono (intitulés, métadonnées)
- **Contextes** : clair par défaut ; `.acier` pour les bandes sombres (barre, pied, bandeaux)
- **Tokens** : `src/styles/01-…05-tokens-*.css` ; composants : `src/styles/30-composants.css`
- **Visuels** : déclarés une seule fois dans `src/data/visuels.ts` (AVIF/WebP/JPEG), dérivées produites par `outils/derivees-visuels.mjs` (nécessite `sharp`)

## Lancer en local

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # dist/
npm run preview
```

Node 20 ou plus.

## Ce que produit le build

`vite.config.ts` ajoute deux greffons :

- **Préchargement du héros** — script en ligne qui précharge la bonne dérivée AVIF sur `/`.
- **Pages statiques** — après le build, un HTML par route (`formation.html`, `cgv.html`…) avec son propre titre, sa description, sa canonique et ses `og:*` (pour les robots et les aperçus de lien, qui n'exécutent pas JavaScript), un `404.html` (`noindex`, servi par Netlify avec un vrai statut 404), `robots.txt`, `sitemap.xml`, et `_headers` avec les en-têtes de sécurité (CSP avec l'empreinte SHA-256 du script en ligne, calculée automatiquement).

Titres et descriptions : `meta` dans `src/data/site.ts`, lus à la fois par ce greffon et par `src/hooks/useMetaPage.ts`.

## Structure

```
src/
├── main.tsx · App.tsx      # entrée, routes
├── data/site.ts            # CONTENU ÉDITABLE — liens, textes, paliers, FAQ, mentions
├── data/visuels.ts         # déclaration des images
├── hooks/                  # useMetaPage, useRevelation, useMinecraftStatus, useDiscordWidget
├── components/             # accueil, brand, discord, formation, layout, minecraft, reseaux, ui
├── pages/                  # Home, Formation, Discord, Minecraft, Socials, Contact, LegalPage, NotFound
└── styles/                 # arc.css + couches 00 → 99
```

## Avant la mise en vente

Les pages légales affichent un encart « Page en cours d'établissement » tant que des champs manquent. À renseigner dans `src/data/site.ts` (`legal.pages.mentionsLegales`) et `src/pages/LegalPage.tsx` :

- [ ] Identité de l'éditeur : forme juridique, capital, siège, SIRET/RCS, TVA, e-mail, téléphone, directeur de la publication
- [ ] Médiateur de la consommation (nom, adresse, site)
- [ ] Rôles éditeur / Patreon, clause de responsabilité, date d'entrée en vigueur des CGV
- [ ] Faire relire CGV et politique de confidentialité par un juriste
- [ ] `discord.guildId` pour activer le compteur Discord (le widget doit être activé côté serveur)
