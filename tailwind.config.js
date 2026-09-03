/**
 * Les Archives du Professeur Chen — charte v1.0.0
 *
 * CONFIGURATION DE REMPLACEMENT. Elle remplace intégralement
 * `tailwind.config.js` à la racine, au lot L1 de la migration.
 * Elle n'est PAS encore en place : la poser maintenant casserait les
 * 59 classes `sm:` / `md:` / `lg:` du site actuel, qui disparaissent
 * avec la réécriture des pages (lot L4). Voir charte/README.md.
 *
 * `screens` est déclaré au niveau `theme`, pas dans `extend` :
 * sm / md / lg / xl disparaissent, et c'est voulu. Correspondance de
 * migration : sm: → planche: · md: → planche: · lg: → paillasse:
 *
 * Doctrine (socle §0.21), en trois lignes :
 *   1. Les composants de la charte sont du CSS en classes maison, dans
 *      @layer composants. Un composant n'est jamais assemblé en
 *      utilitaires : il doit rester identique dans une page React, dans
 *      un export HTML de module, et dans une maquette Figma.
 *   2. Tailwind sert la mise en page locale d'une page : grille de
 *      section, marges de bloc, ordre responsive. Rien d'autre.
 *   3. Les valeurs arbitraires sont interdites, SAUF pour les tokens
 *      sémantiques — bg-[var(--surface)], text-[var(--texte)],
 *      border-[var(--bordure)]. C'est la seule forme qui laisse .acier
 *      tout basculer d'un coup. text-[15.5px] ou p-[13px] sont des défauts.
 *
 * @type {import('tailwindcss').Config}
 */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],

  /* Ajout du lot L1, absent de charte/tailwind.config.js.
     Le preflight de Tailwind sort HORS COUCHE. Or une déclaration hors
     couche l'emporte sur toute déclaration en couche, quelle que soit la
     spécificité : `h1,h2,h3,h4,h5,h6{font-size:inherit;font-weight:inherit}`
     du preflight battrait donc `.h1{font-size:var(--fs-h1)}` de
     02-tokens-typo.css, et `blockquote,dl,dd,h1..h6,figure,p,pre{margin:0}`
     battrait le `p{margin-block-end:var(--sp-4)}` de 20-base.css. Toute
     l'échelle typographique serait muette.
     Le contrat CSS du lot tranche déjà : 00-reset.css « remplace le
     preflight de Tailwind ». On le coupe donc ici. */
  corePlugins: { preflight: false },

  theme: {
    screens: {
      poche:     "420px",
      planche:   "620px",
      paillasse: "980px",
      atelier:  "1280px",
      plateau:  "1440px",
    },
    extend: {
      colors: {
        blanc: { 0: "#FFFFFF", 50: "#F4F5F6", 100: "#E8EBEC", 200: "#DCE0E2",
                 300: "#C7CBCD", 400: "#A7ACAE", 500: "#828789" },
        encre: { DEFAULT: "#171A1C", 600: "#575E62", 700: "#3A4145",
                 800: "#262B2D", 900: "#171A1C", 950: "#0B0E0F" },
        bordeaux: { DEFAULT: "#6E212B", 50: "#FBF0F0", 100: "#F7E0E0", 200: "#EFC5C6",
                    300: "#E2A3A5", 400: "#CC767B", 500: "#AD4A53", 600: "#8B2C38",
                    700: "#6E212B", 800: "#53171F", 900: "#3A1118", 950: "#20080A" },
        acier: { DEFAULT: "#9EA5A9", 50: "#EDF1F3", 100: "#DBE0E4", 200: "#C9CFD2",
                 300: "#B3BABE", 400: "#9EA5A9", 500: "#848C90", 600: "#6C7378",
                 700: "#535B5F", 800: "#3E4549", 900: "#2A2F32", 950: "#191C1F" },
        verre:  { DEFAULT: "#C3DBDF", voile: "#EDF5F7", clair: "#D8E8EB",
                  chant: "#A8C4C8", ombre: "#819FA3", profond: "#3D585C" },
        papier: { DEFAULT: "#E4D6B8", voile: "#F7F3EA", clair: "#EFE5D2",
                  tranche: "#D9C9A8", ombre: "#A79774", profond: "#594B2E" },
        neon:   { DEFAULT: "#FFD3A0", voile: "#FFF3E5", clair: "#FFE5C7",
                  braise: "#DD9C46", profond: "#915C01" },
        vert:   { DEFAULT: "#2F6E5E", voile: "#E9F5F1", clair: "#C2DFD6",
                  ombre: "#205548", profond: "#0C3027" },
      },

      fontFamily: {
        display: ["Fraunces", "Fraunces repli", "Georgia", "Times New Roman", "serif"],
        sans:    ["Space Grotesk", "Grotesk repli", "system-ui", "Segoe UI", "Roboto",
                  "Helvetica", "Arial", "sans-serif"],
        mono:    ["Space Mono", "Mono repli", "ui-monospace", "SFMono-Regular",
                  "Menlo", "Consolas", "monospace"],
      },

      fontSize: {
        display:   ["clamp(2.5rem,1.425rem + 4.528vw,5.5rem)",   { lineHeight: ".95",  letterSpacing: "-.04em",  fontWeight: "900" }],
        h1:        ["clamp(2.375rem,1.613rem + 3.208vw,4.5rem)", { lineHeight: "1.05", letterSpacing: "-.035em", fontWeight: "900" }],
        h2:        ["clamp(1.875rem,1.427rem + 1.887vw,3.125rem)",{ lineHeight: "1.05", letterSpacing: "-.02em",  fontWeight: "600" }],
        h3:        ["clamp(1.375rem,1.196rem + .755vw,1.875rem)",{ lineHeight: "1.1",  letterSpacing: "-.015em", fontWeight: "600" }],
        h4:        ["clamp(1.25rem,1.116rem + .566vw,1.625rem)", { lineHeight: "1.15", letterSpacing: "-.01em",  fontWeight: "600" }],
        carte:     ["clamp(1.0625rem,.995rem + .283vw,1.25rem)", { lineHeight: "1.15", letterSpacing: "-.01em",  fontWeight: "600" }],
        lede:      ["clamp(1rem,.933rem + .283vw,1.1875rem)",    { lineHeight: "1.55", letterSpacing: "-.005em" }],
        corps:     ["clamp(1rem,.978rem + .094vw,1.0625rem)",    { lineHeight: "1.65" }],
        "corps-s": [".9375rem", { lineHeight: "1.55" }],
        "corps-xs":[".875rem",  { lineHeight: "1.5" }],
        citation:  ["clamp(1.25rem,1.071rem + .755vw,1.75rem)",  { lineHeight: "1.35", letterSpacing: "-.01em" }],
        "mono-l":  [".75rem",     { lineHeight: "1" }],
        "mono-m":  [".71875rem",  { lineHeight: "1.8" }],
        "mono-s":  [".6875rem",   { lineHeight: "1.2" }],
        "mono-xs": [".625rem",    { lineHeight: "1.2" }],
      },

      letterSpacing: { xl: ".22em", l: ".18em", m: ".16em", s: ".14em", xs: ".10em", xxs: ".04em" },

      maxWidth: {
        plateau: "1320px", standard: "1140px", etroit: "880px", fiche: "680px",
        "me-h1": "13ch", "me-h2": "22ch", "me-lede": "50ch", "me-corps": "65ch",
        "me-corps-s": "56ch", "me-meta": "52ch", "me-legal": "74ch", "me-citation": "34ch",
      },

      spacing: { page: "clamp(16px,4vw,56px)", 25: "6.25rem" },

      padding: {
        casier:      "clamp(14px,2vw,18px)",
        tiroir:      "clamp(18px,2.6vw,26px)",
        caisson:     "clamp(24px,3.4vw,34px)",
        vitrine:     "clamp(26px,4vw,40px)",
        paillasse:   "clamp(28px,4vw,44px)",
        mur:         "clamp(40px,6vw,76px)",
        "rythme-xs": "clamp(24px,3.5vw,40px)",
        "rythme-s":  "clamp(32px,5vw,56px)",
        "rythme-m":  "clamp(56px,8vw,100px)",
        "rythme-l":  "clamp(72px,10vw,128px)",
        "rythme-xl": "clamp(96px,12vw,160px)",
      },

      gap: {
        serre: "0.75rem", carte: "1rem", bloc: "1.5rem",
        colonne: "clamp(24px,3vw,40px)", split: "clamp(24px,4vw,48px)",
      },

      borderRadius: {
        none: "0", hair: "1px", pose: "2px", panneau: "3px",
        "logo-sm": "7px", "logo-md": "9px", logo: "10px", "logo-lg": "13px",
      },

      borderWidth: {
        hair: "1px", controle: "1.5px", marque: "2px",
        lisere: "3px", chant: "4px", pilier: "10px",
      },

      boxShadow: {
        contact:     "0 1px 0 rgba(23,26,28,.05)",
        piece:       "0 1px 3px rgba(23,26,28,.07)",
        souleve:     "0 14px 0 -6px #3A1118",
        "souleve-r": "0 10px 0 -6px #3A1118",
        "souleve-n": "0 14px 0 -6px #0B0E0F",
        encastre:    "0 20px 44px -30px rgba(23,26,28,.9)",
        flottant:    "0 28px 70px -40px rgba(23,26,28,.85)",
      },

      aspectRatio: {
        scene: "16 / 9", portrait: "1 / 1", planche: "21 / 9",
        vitrine: "4 / 3", vertical: "9 / 16",
      },

      transitionTimingFunction: {
        instrument: "cubic-bezier(.2,.7,.2,1)",
        retrait:    "cubic-bezier(.4,0,1,1)",
      },

      transitionDuration: {
        declic: "120ms", bascule: "180ms", reaction: "220ms", fondu: "300ms",
        apparition: "450ms", scene: "550ms", revelation: "700ms", remplissage: "900ms",
      },

      transitionDelay: { segment: "45ms", bloc: "80ms", amorce: "60ms", sommaire: "260ms" },

      keyframes: {
        apparition:    { "0%": { opacity: "0", transform: "translateY(8px)" },  "100%": { opacity: "1", transform: "none" } },
        "entree-page": { "0%": { opacity: "0", transform: "translateY(10px)" }, "100%": { opacity: "1", transform: "none" } },
        balayage:      { "0%": { transform: "translateX(-110%)" },              "100%": { transform: "translateX(420%)" } },
      },

      animation: {
        apparition:    "apparition 450ms cubic-bezier(.2,.7,.2,1) both",
        "entree-page": "entree-page 450ms cubic-bezier(.2,.7,.2,1) both",
        balayage:      "balayage 1100ms linear infinite",
      },
    },
  },
  plugins: [],   // pas de plugin container : le conteneur est .wrap
};
