import { defineConfig, type Plugin } from "vite";
import react from "@vitejs/plugin-react";
import {
  CADRAGE_COLONNE,
  TAILLES_SCENE,
  jeuSources,
  plateauHaut,
  plateauLarge,
} from "./src/data/visuels";

/* ═══════════════════════════════════════════════════════════════════════════
   PRÉCHARGEMENT DE L'IMAGE LCP — socle § 0.30 (LCP ≤ 1,8 s, plafond 2,5 s)

   ── LE PROBLÈME, ET POURQUOI `fetchpriority` NE LE RÉSOUT PAS ─────────────
   Le site est une application React montée par `src/main.tsx`. La photo du
   héros est l'élément LCP de l'accueil, et elle n'existe dans le DOM
   qu'APRÈS que le navigateur a téléchargé, analysé et exécuté le paquet
   (268 ko, 83 ko en gzip). L'analyseur de préchargement, lui, ne lit que le
   HTML initial : il ne peut pas voir une balise qu'un script n'a pas encore
   créée.

   `fetchpriority="high"` et `loading="eager"` sont posés sur l'image, et ils
   sont justes — mais ils n'agissent qu'une fois l'élément créé. Ils ne
   rattrapent pas le temps perdu à attendre le paquet. Sur un réseau 4G
   simulé, c'est plusieurs centaines de millisecondes prises directement sur
   le budget du § 0.30.

   ── CE QUE CE GREFFON POSE, ET CE QU'IL NE POSE PAS ───────────────────────
   Un `<link rel="preload" as="image">` dans le `<head>`, découvert à
   l'analyse du HTML, donc AVANT même que le paquet ne commence à arriver.

   Trois précautions, chacune pour une raison précise :

   1. IL EST CONDITIONNÉ À LA ROUTE. `netlify.toml` sert `index.html` pour
      TOUTES les URL du site : un lien de préchargement écrit en dur ferait
      télécharger la photo du plateau à un visiteur qui arrive sur
      `/formation`, `/contact` ou la 404, où elle ne paraît jamais. Le lien
      est donc créé par un script en ligne qui vérifie `location.pathname`.
      Ce script s'exécute à l'analyse du `<head>`, avant le paquet : on garde
      l'essentiel de l'avance sans facturer un octet aux autres routes.

   2. IL RESPECTE LA DIRECTION ARTISTIQUE. Le héros n'a pas une image mais
      DEUX cadrages, séparés par un `media` (§ A1.2, et `visuels.ts`) :
      colonne 4:3 au-dessus de `planche`, bande 16:9 en dessous. Un
      préchargement qui ignorerait ce `media` téléchargerait la mauvaise
      dérivée, et le `<picture>` en demanderait une seconde — deux images
      pour en afficher une. Le script lit donc la même requête média.

   3. IL LIT LES MÊMES PHRASES QUE LA PAGE. `CADRAGE_COLONNE`,
      `TAILLES_SCENE` et les `srcset` viennent de `src/data/visuels.ts`, pas
      d'une recopie. S'ils divergeaient d'un seul caractère, le candidat
      choisi par le préchargement et celui choisi par le `<picture>`
      pourraient différer, et le navigateur téléchargerait les deux.

   ── POURQUOI SEULEMENT L'AVIF ────────────────────────────────────────────
   Un lien de préchargement ne négocie pas le format : il en désigne un.
   `type="image/avif"` le fait ignorer par les navigateurs qui ne décodent
   pas l'AVIF — ils retombent alors sur la découverte normale et sur le
   repli WebP du `<picture>`, sans rien télécharger en trop. Précharger le
   WebP « au cas où » ferait, lui, deux téléchargements sur tout le parc
   moderne.
   ═══════════════════════════════════════════════════════════════════════════ */

function prechargementHeros(): Plugin {
  const script = [
    "(function(){",
    '  if (location.pathname !== "/") return;',
    "  var colonne = window.matchMedia(" + JSON.stringify(CADRAGE_COLONNE) + ").matches;",
    "  var l = document.createElement('link');",
    "  l.rel = 'preload';",
    "  l.as = 'image';",
    "  l.type = 'image/avif';",
    "  l.setAttribute('imagesrcset', colonne ? " +
      JSON.stringify(jeuSources(plateauHaut, "avif")) +
      " : " +
      JSON.stringify(jeuSources(plateauLarge, "avif")) +
      ");",
    "  l.setAttribute('imagesizes', " + JSON.stringify(TAILLES_SCENE) + ");",
    "  l.setAttribute('fetchpriority', 'high');",
    "  document.head.appendChild(l);",
    "})();",
  ].join("\n");

  return {
    name: "arc-prechargement-heros",
    transformIndexHtml() {
      return [{ tag: "script", injectTo: "head", children: script }];
    },
  };
}

export default defineConfig({
  plugins: [react(), prechargementHeros()],
});
