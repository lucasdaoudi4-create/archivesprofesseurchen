/* ═══════════════════════════════════════════════════════════════════════════
   VISUELS — déclaration unique des images du site

   Un seul endroit décrit chaque visuel : ses dérivées, son texte de
   remplacement, son ratio et son aplat de chargement. Les composants ne
   composent JAMAIS un chemin de fichier à la main.

   NOMMAGE — socle § 0.19, grammaire unique :
     arc-<domaine>-<sujet>[-<format>]-v<NN>.<ext>
   `domaine` vaut `dec` pour le décor, `nar` pour le narrateur et `og` pour
   les cartes de partage. Le numéro de version ne recule jamais : une image
   corrigée après publication passe en -v02 et le nom change, ce qui suffit
   à casser les caches.

   FORMATS — trois encodages par dérivée, du meilleur au plus compatible :
   AVIF (qualité 55), WebP (78), JPEG (82) — les trois valeurs du § 7.13.5.
   Le `<picture>` choisit ; aucun navigateur ne reste sans image.

   ÉCHELLE DE LARGEURS — § 7.13.5 : « srcset aux largeurs 640, 960, 1280,
   1600, 1920, 2560 ». Elle est reprise telle quelle pour les cadrages de
   scène. Le portrait garde en plus 320 et 480 : il est servi dans un cadre
   de 437 px au plus, et sans ces deux barreaux un téléphone en DPR 2
   téléchargerait 640 px pour en afficher 320.

   LES MASTERS sont hors dépôt (`visuels/`, 127 Mo de PNG jusqu'à 8192 px).
   La recette qui en tire ces dérivées — recadrages exacts, échelle,
   qualités — est `outils/derivees-visuels.mjs`, et c'est sa seule raison
   d'exister : sans elle, une v02 se referait à l'œil.

   BUDGET — socle § 0.30 : héros ≤ 260 ko, plafond 300 ko. La dérivée AVIF
   la plus lourde servie au héros (2560 × 1440) pèse 169 ko : on tient à
   65 % du budget, sur l'écran qui la demande et sur lui seul.

   LA CARTE DE PARTAGE ne figure pas dans ce fichier, et c'est voulu :
   `arc-og-accueil-1200x630-v01.jpg` n'est lue par aucun composant React —
   les aspirateurs de métadonnées sociales n'exécutent pas de JavaScript,
   donc elle est déclarée en dur dans `index.html`, là où ils la lisent.
   L'y déclarer ici créerait un export que rien n'importe.

   RÉSERVE JURIDIQUE — 07-imagerie § 7.14. Ces visuels portent l'enseigne
   circulaire du décor et, pour la planche du plateau, des créatures
   reconnaissables. La validation juridique n'est pas rendue. La décision
   de les publier appartient à l'auteur, qui l'a prise en connaissance de
   cause ; elle se révoque en remettant `plateau`/`portrait` à `null` dans
   `heroPhoto` et `portraitPhoto` de `site.ts`.
   ═══════════════════════════════════════════════════════════════════════════ */
var RACINE = "/img/";
/* ── LE PLAFOND DU JPEG ────────────────────────────────────────────────────
   Le JPEG est « le dernier recours » du § 7.13.5 : il n'atteint que le
   navigateur qui ne décode NI AVIF NI WebP. Ce navigateur-là est ancien —
   Safari 13 et antérieurs, les Edge d'avant Chromium — et il ne tourne sur
   aucun écran de 2560 px. Monter sa dérivée jusqu'en haut de l'échelle
   ajouterait 800 ko de fichiers que personne ne demande jamais, sur un
   dépôt public, et exposerait le budget du § 0.30 au seul navigateur
   incapable de le tenir. L'échelle JPEG s'arrête donc à 1600 px ; AVIF et
   WebP, eux, vont jusqu'au bout.                                          */
var PLAFOND_JPEG = 1600;
function echelle(v, ext) {
    return ext === "jpg" ? v.derivees.filter(function (d) { return d.l <= PLAFOND_JPEG; }) : v.derivees;
}
/** Construit le chemin d'une dérivée dans un encodage donné. */
export function chemin(v, d, ext) {
    return "".concat(RACINE).concat(v.base, "-").concat(d.l, "x").concat(d.h, "-v01.").concat(ext);
}
/** Construit l'attribut `srcset` complet d'un encodage. */
export function jeuSources(v, ext) {
    return echelle(v, ext)
        .map(function (d) { return "".concat(chemin(v, d, ext), " ").concat(d.l, "w"); })
        .join(", ");
}
/** La dérivée de tête : la plus grande, celle qui pose le rapport de forme. */
export function repli(v) {
    return v.derivees[v.derivees.length - 1];
}
/* ── LE REPLI DE L'ATTRIBUT `src` ──────────────────────────────────────────
   `src` n'est lu que par un navigateur qui ignore `srcset` — le même parc
   ancien que ci-dessus, sur de petits écrans. Lui servir `repli()` reviendrait
   à envoyer la dérivée de 2560 px (365 ko en JPEG) à la machine la moins
   capable de l'afficher, et à faire sauter le plafond de 300 ko du § 0.30
   sur l'image du héros. `secours()` prend la dérivée la plus proche de
   1280 px : 119 ko, la moitié du budget, et deux fois la densité d'un écran
   de l'époque.                                                             */
var CIBLE_SECOURS = 1280;
export function secours(v) {
    return v.derivees.reduce(function (meilleure, d) {
        return Math.abs(d.l - CIBLE_SECOURS) < Math.abs(meilleure.l - CIBLE_SECOURS) ? d : meilleure;
    });
}
/** Le ratio de la plus grande dérivée, à poser en CSS pour réserver la place. */
export function ratio(v) {
    var d = repli(v);
    return d.l / d.h;
}
/* ═══════════════════════════════════════════════════════════════════════════
   LES LARGEURS SERVIES — `media` et `sizes`, en un seul endroit

   Un attribut `media` ou `sizes` d'HTML ne lit PAS une propriété
   personnalisée : sa valeur doit y être littérale, il n'existe aucune autre
   forme. Ces phrases étaient donc écrites en clair dans quatre fichiers —
   `Home.tsx`, `Formation.tsx`, `NotFound.tsx`, `FluxYouTube.tsx` — dont
   deux se déclaraient « jumelles » par commentaire et se seraient tues le
   jour où l'une aurait bougé. Elles vivent ici, à côté des dérivées
   qu'elles servent, et la grammaire du § 0.19 vaut pour elles : un chemin
   d'image et la largeur à laquelle on le sert sont la même déclaration.

   La fabrique du préchargement (`vite.config.ts`) les lit ICI aussi : sans
   ce point unique, le lien de préchargement du héros et le `<picture>` de
   la page pourraient demander deux dérivées différentes, et le navigateur
   en téléchargerait deux.

   Les bornes sont celles de la charte et rien d'autre (§ 0.20, cinq
   paliers) : `planche` 620 et `paillasse` 980. Le troisième seuil, 1240 px,
   n'est pas un palier : c'est la fenêtre à partir de laquelle `.wrap`
   atteint son plafond et cesse de suivre le viewport — `min(1140px, 92vw)`
   plafonne à 1140 / 0,92 = 1239,1 px.
   ═══════════════════════════════════════════════════════════════════════════ */
/** Jumeau de `--bp-planche`. Au-dessus, la scène du héros est une colonne. */
export var BP_PLANCHE = "620px";
/** Jumeau de `--bp-paillasse`. Au-dessus, les splits sont dépliés. */
export var BP_PAILLASSE = "980px";
/** La fenêtre où `.wrap` atteint son plafond de 1140 px. Pas un palier. */
export var W_WRAP_PLEIN = "1240px";
/** La condition qui bascule le héros sur le cadrage en colonne (4:3). */
export var CADRAGE_COLONNE = "(min-width: ".concat(BP_PLANCHE, ")");
/* La scène du héros. `.hero` est plein cadre et partage 1.02fr / .98fr,
   d'où les 49vw — mais `.hero__v` porte aussi `min-block-size:
   min(72vh, 40rem)` et `aspect-ratio: 4/3`, qui lui imposent une largeur
   plancher de 4/3 × 40rem = 853,33 px. Tant que ce plancher dépasse la part
   en `fr`, c'est LUI que la piste adopte, et les deux se croisent à
   853,33 / 0,49 = 1741 px. Mesuré au navigateur : 768 px à 1280 × 800,
   853 px à 1440 × 900, puis 941 px à 1920 × 1080 où la part reprend la
   main. `max()` dit les deux régimes en une expression. */
export var TAILLES_SCENE = "(min-width: ".concat(BP_PAILLASSE, ") max(49vw, 853px), 100vw");
/* La planche de la notice, sur l'accueil comme sur `/formation` : `.notice`
   partage 1.05fr / .95fr dans un `.wrap` de min(1140px, 92vw). Une seule
   déclaration pour les deux pages — c'est la même grille et la même phrase. */
export var TAILLES_NOTICE = "(min-width: ".concat(W_WRAP_PLEIN, ") 542px, (min-width: ").concat(BP_PAILLASSE, ") 44vw, 92vw");
/* Le portrait de l'atelier : `.atelier` partage .8fr / 1.2fr avec `--gap-5`
   dans le même `.wrap`. Sous paillasse, la colonne est plafonnée à 24rem. */
export var TAILLES_PORTRAIT = "(min-width: ".concat(W_WRAP_PLEIN, ") 437px, (min-width: ").concat(BP_PAILLASSE, ") 36vw, 24rem");
/* La planche de la 404 : la moitié de la fenêtre au-dessus de paillasse,
   et elle n'est pas servie en dessous. Une seule borne la décrit. */
export var TAILLES_PLANCHE_404 = "50vw";
/* L'affiche du lecteur vidéo : toute la largeur du `.wrap`. */
export var TAILLES_AFFICHE = "(min-width: ".concat(W_WRAP_PLEIN, ") 1140px, 92vw");
/* ── Le plateau principal, en deux cadrages ────────────────────────────────
   Amendement A1.2 : le héros de l'accueil est un split, la photo occupe le
   côté droit À PLEINE LUMIÈRE. Deux cadrages, parce qu'un seul ne peut pas
   servir une colonne haute en grand écran et une bande large sur téléphone :
   `plateauLarge` (16:9) pour l'empilement mobile et les usages en bandeau,
   `plateauHaut` (4:3) pour la colonne du split. C'est de la direction
   artistique, pas une optimisation.

   LE 4:3 EST RECADRÉ SUR L'ENSEIGNE, pas sur le bord du master. Le master
   fait 5440 px de large et le 4:3 en prend 4096 : 1344 px partent. Les
   prendre au bord gauche posait l'enseigne au néon à 64 % de la largeur et
   tranchait le pilier d'émail bordeaux de droite — § 7.13.1 : « un
   recadrage ne coupe jamais un visage, une enseigne néon lisible ou un
   pilier bordeaux dans sa largeur ». Le recadrage part maintenant de 580 px,
   ce qui pose l'enseigne au milieu du cadre — le point focal `50 %` de la
   table du § 7.13.1 pour `ARC · DEC — 01` — et rend au plan la symétrie
   latérale qui en fait la valeur (§ 7.6, `ARC · CAM — 01`).               */
export var plateauLarge = {
    base: "arc-dec-plateau-principal",
    derivees: [
        { l: 640, h: 360 },
        { l: 960, h: 540 },
        { l: 1280, h: 720 },
        { l: 1600, h: 900 },
        { l: 1920, h: 1080 },
        { l: 2560, h: 1440 },
    ],
    alt: "Le narrateur, de dos, travaille à la paillasse ovale du laboratoire, " +
        "sous l'enseigne au néon des Archives.",
    aplat: "var(--lqip-dec01)",
};
export var plateauHaut = {
    base: "arc-dec-plateau-principal",
    derivees: [
        { l: 640, h: 480 },
        { l: 960, h: 720 },
        { l: 1280, h: 960 },
        { l: 1600, h: 1200 },
        { l: 1920, h: 1440 },
        { l: 2560, h: 1920 },
    ],
    alt: plateauLarge.alt,
    aplat: plateauLarge.aplat,
};
/* ── Le narrateur ──────────────────────────────────────────────────────────
   § 0.38 relève que le statut du narrateur n'est pas tranché — est-il le
   Professeur Chen, ou l'archiviste qui tient ses Archives ? Tant que la
   question n'est pas arbitrée, le texte de remplacement dit ce qu'on voit
   et rien de plus : il ne nomme personne.                                  */
export var narrateurPortrait = {
    base: "arc-nar-portrait",
    derivees: [
        { l: 320, h: 320 },
        { l: 480, h: 480 },
        { l: 640, h: 640 },
        { l: 960, h: 960 },
        { l: 1280, h: 1280 },
        { l: 1440, h: 1440 },
    ],
    alt: "Le narrateur en blouse blanche, de trois quarts, dans le laboratoire, " +
        "l'enseigne au néon derrière lui.",
    aplat: "var(--lqip-nar)",
};
export var narrateurPlanDeFace = {
    base: "arc-nar-plan-de-face",
    derivees: [
        { l: 640, h: 640 },
        { l: 960, h: 960 },
        { l: 1280, h: 1280 },
        { l: 1600, h: 1600 },
    ],
    alt: "Le narrateur, de face derrière la paillasse ovale, un carnet ouvert " +
        "devant lui et l'enseigne au néon au mur du fond.",
    aplat: narrateurPortrait.aplat,
};
