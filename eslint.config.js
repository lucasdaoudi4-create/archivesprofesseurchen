import js from "@eslint/js";
import globals from "globals";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import tseslint from "typescript-eslint";

/* ═══════════════════════════════════════════════════════════════════════════
   LA RÈGLE DU DÉPÔT — ce qu'un outil peut vérifier, et lui seul

   POURQUOI MAINTENANT. `src/hooks/useMetaPage.ts` portait un
   `// eslint-disable-next-line react-hooks/exhaustive-deps` alors qu'ESLint
   n'était pas installé : un commentaire qui faisait taire un avertissement
   que rien n'émettait, et qui masquait une invariante réelle. Un dépôt qui
   écrit des directives pour un outil absent a déjà choisi d'avoir cet outil.

   CE QUE CETTE CONFIGURATION NE FAIT PAS. Aucune règle de style : pas de
   guillemets, pas de points-virgules, pas de largeur de ligne. Ce dépôt est
   écrit à la main, avec des pavés de commentaires qui sont sa documentation ;
   un formateur les mettrait en pièces, et une discussion sur les guillemets
   ne vaut pas une minute. Ne restent que les règles qui attrapent des BUGS.

   `react-hooks` est le cœur : c'est la seule famille de défauts de ce dépôt
   qu'aucune relecture humaine n'attrape de façon fiable — une dépendance
   manquante ne casse pas, elle sert une valeur périmée, parfois.
   ═══════════════════════════════════════════════════════════════════════════ */

export default tseslint.config(
  {
    // Ni le produit du build, ni les dépendances, ni la feuille parquée.
    ignores: ["dist/**", "node_modules/**", "coverage/**"],
  },

  /* ── Le code de l'application ──────────────────────────────────────────── */
  {
    files: ["src/**/*.{ts,tsx}"],
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    languageOptions: {
      ecmaVersion: 2022,
      globals: globals.browser,
    },
    plugins: {
      "react-hooks": reactHooks,
      "react-refresh": reactRefresh,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      "react-refresh/only-export-components": ["warn", { allowConstantExport: true }],

      /* ── LES INSÉCABLES SONT DE LA TYPOGRAPHIE, PAS DES FAUTES ─────────
         Le français exige une espace insécable avant les deux-points et une
         FINE insécable avant « ? », « ! » et « ; ». Le dépôt les écrit en
         clair (U+00A0, U+202F) là où un échappement   nuirait à la
         lecture — dans un commentaire, dans un gabarit de date « 20 h 30 ».
         La règle les prend pour des caractères égarés ; elle a raison dans
         du code, tort partout ailleurs. On la garde pour le code seul. */
      "no-irregular-whitespace": [
        "error",
        { skipStrings: true, skipTemplates: true, skipComments: true, skipJSXText: true },
      ],

      /* ── `set-state-in-effect` EST DÉSACTIVÉE, ET VOICI POURQUOI ────────
         Règle neuve d'eslint-plugin-react-hooks v6, venue avec le
         compilateur : elle signale tout `setState` synchrone dans un effet
         comme un rendu en cascade. Elle vise la PERFORMANCE, pas la
         correction — aucun des huit cas de ce dépôt n'est un défaut :

           · `Navbar` referme son menu quand la route change ;
           · `EtatServeur` remet son état d'attente à zéro quand une requête
             repart, et arme ses deux minuteurs ;
           · `FicheServeur` horodate un relevé réussi ;
           · `Contact` vide son annonce quand le formulaire quitte l'état
             envoyé.

         Tous synchronisent un état React sur un événement extérieur, tous
         sont commentés sur place, et plusieurs touchent au focus ou à la
         région d'annonce — les réécrire pour satisfaire une règle de
         performance reviendrait à risquer l'accessibilité pour un rendu.

         À ROUVRIR le jour où le compilateur React est activé : la règle
         devient alors un prérequis de mémoïsation, et non plus un conseil. */
      "react-hooks/set-state-in-effect": "off",

      /* Une variable inutilisée est presque toujours le reste d'une coupe
         oubliée. Le préfixe `_` reste la porte de sortie explicite. */
      "@typescript-eslint/no-unused-vars": [
        "error",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
      ],
    },
  },

  /* ── Les outils de build et les tests : contexte Node ──────────────────── */
  {
    files: ["outils/**/*.{ts,mjs}", "tests/**/*.ts", "vite.config.ts", "eslint.config.js"],
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    languageOptions: {
      ecmaVersion: 2022,
      globals: globals.node,
    },
    rules: {
      "@typescript-eslint/no-unused-vars": [
        "error",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
      ],
      /* Même raison que côté application : ces fichiers-ci documentent la
         typographie française, donc ils l'écrivent. */
      "no-irregular-whitespace": [
        "error",
        { skipStrings: true, skipTemplates: true, skipComments: true },
      ],
    },
  },
);
