// ─────────────────────────────────────────────────────────────────────────────
// Les Archives du Professeur Chen — source de contenu unique.
// Charte ARC v1.0.0, lot L5. Toute copie affichée sur le site sort d’ici.
//
// Six règles tenues dans ce fichier, et vérifiables :
//   1. Vouvoiement partout (01-fondations §6.1, règle 2).
//   2. Zéro émoji. Seuls signes admis : → · — ↺ › × (§6.1, règle 8).
//   3. Aucune affirmation invérifiable, aucun chiffre sans source (§6.1, règle 5).
//   4. Aucune valeur relevée sur un service tiers n’est écrite avant son relevé
//      daté (10-membre-addendum §10.17). Les champs concernés valent `null`.
//   5. Aucun marqueur de relevé en toutes lettres dans ce fichier : la porte 1
//      du §10.18 refuse la construction s’il en reste (voir CONTRAT_OUVERT).
//   6. Micro-typographie française appliquée à la source (04-typographie §4.7).
//
// ── Convention d’écriture des signes ────────────────────────────────────────
// Le §4.7 impose l’apostrophe typographique et les espaces insécables « écrites
// directement dans la source ». Deux formes, selon que le signe se voit ou non :
//
//   • signes VISIBLES, écrits en clair    ’ (U+2019)  ·  —  –  …  «  »
//   • espaces INVISIBLES, écrites en échappement, jamais en octet nu :
//           espace insécable  → avant  :  €  %  et dans les cotes ARC
//           espace fine insécable → avant  ;  !  ?
//
// L’échappement est la forme que la charte emploie elle-même pour les chaînes
// (§10.16 : « en chaîne : 20 h 30 »). Ne les remplacez pas par une
// espace ordinaire : le contrôle avant publication du §4.7 les vérifie.
// ─────────────────────────────────────────────────────────────────────────────

import { chemin, narrateurPortrait, plateauLarge, secours } from "./visuels";

/* ═══════════════════════ 0 · TYPES PARTAGÉS ═════════════════════════════ */

/** Un lien de navigation interne. */
export interface Lien {
  to: string;
  label: string;
}

/**
 * Une photo publiable. `null` sur un interrupteur = le panneau se compose sans
 * photo, et aucune page ne doit inventer de repli.
 */
export interface Photo {
  src: string;
  alt: string;
}

/**
 * Les cinq pictogrammes de section (06-iconographie §6.6). Un seul par section,
 * posé au-dessus du surtitre. `pic-embleme` n’en fait pas partie : c’est la
 * variante 48 de l’emblème, pas un pictogramme de section.
 */
export type Pictogramme =
  | "pic-microscope"
  | "pic-incubation"
  | "pic-vitrine"
  | "pic-paillasse"
  | "pic-carnet";

/** En-tête de section : pictogramme, surtitre, titre, chapeau. */
export interface EnTeteSection {
  surtitre: string;
  titre: string;
  lede: string;
  pictogramme: Pictogramme;
}

/* ═══════════════════════ 1 · IDENTITÉ ═══════════════════════════════════ */

export const site = {
  name: "Les Archives du Professeur Chen",
  domain: "archivesprofesseurchen.com",
  url: "https://archivesprofesseurchen.com",
  lang: "fr",
  editeur: "LHM Studio",
  themeColor: "#2A2F32",
  // Forme « mois seul » imposée pour une mise à jour de page (10.16).
  derniereMiseAJour: "septembre 2026",
  derniereMiseAJourMachine: "2026-09",
  baseline: "Une formation, un serveur, une communauté. Édité par LHM Studio.",
  description:
    "Une formation à la création vidéo par intelligence artificielle, un serveur Minecraft et une communauté Discord, réunis en un seul lieu.",
} as const;

/* ═══════════════════════ 2 · ROUTES ET MÉTADONNÉES ══════════════════════ */
/* Plan de site : socle §0.27. Patrons de titre et de description : §0.29.   */

export type RouteKey =
  | "accueil"
  | "formation"
  | "module01"
  | "paliers"
  | "minecraft"
  | "discord"
  | "reseaux"
  | "contact"
  | "mentionsLegales"
  | "cgv"
  | "confidentialite"
  | "introuvable";

export const routes: Record<RouteKey, string> = {
  accueil: "/",
  formation: "/formation",
  module01: "/formation/module-01",
  paliers: "/laboratoire/paliers",
  minecraft: "/minecraft",
  discord: "/discord",
  reseaux: "/reseaux",
  contact: "/contact",
  mentionsLegales: "/mentions-legales",
  cgv: "/cgv",
  confidentialite: "/confidentialite",
  introuvable: "/404",
};

export interface Redirection {
  de: string;
  vers: string;
}

// 301 depuis l’existant (socle §0.27). Aucune route n’est supprimée sans renvoi.
export const redirections: Redirection[] = [
  { de: "/paliers", vers: "/laboratoire/paliers" },
];

export interface Meta {
  titre: string;
  description: string;
  indexee: boolean;
}

// `titre` est le segment de gauche : le gabarit « {Titre} · Les Archives du
// Professeur Chen » est appliqué par la page, sauf sur l’accueil (§0.29).
export const meta: Record<RouteKey, Meta> = {
  accueil: {
    titre: "Les Archives du Professeur Chen",
    description: site.description,
    indexee: true,
  },
  formation: {
    titre: "La formation",
    description:
      "La chaîne complète qui fabrique les Archives\u00A0: quels outils, dans quel ordre, et pourquoi. Une méthode, pas une liste de liens.",
    indexee: true,
  },
  module01: {
    titre: "Module 01 — La boîte à outils",
    description:
      "Module 01 — La boîte à outils\u00A0: huit chapitres pour choisir ses instruments et savoir à quel moment on les sort de la boîte.",
    indexee: true,
  },
  paliers: {
    titre: "Les paliers",
    description:
      "Trois paliers d’accès à la formation, de 8,50\u00A0€ à 89,50\u00A0€ par mois sur Patreon, sans engagement et avec mise en pause à tout moment.",
    indexee: true,
  },
  minecraft: {
    titre: "L’Académie du Professeur Chen",
    description:
      "L’Académie du Professeur Chen\u00A0: un serveur Minecraft sous Cobblemon, avec ses régions, sa Ligue, ses cours et ses événements en jeu.",
    indexee: true,
  },
  discord: {
    titre: "Le Discord",
    description:
      "Le Discord des Archives\u00A0: les salons Cobblemon et Pokémon, le salon de la formation, les annonces et l’organisation des événements.",
    indexee: true,
  },
  reseaux: {
    titre: "Les réseaux",
    description:
      "Où l’on publie\u00A0: les séries longues et les analyses sur YouTube, les formats courts et les coulisses sur les autres réseaux.",
    indexee: true,
  },
  contact: {
    titre: "Me joindre",
    description:
      "Une question sur la formation, une proposition de partenariat, ou un souci d’accès à votre abonnement\u00A0: écrivez-moi, je réponds moi-même.",
    indexee: true,
  },
  mentionsLegales: {
    titre: "Mentions légales",
    description:
      "Les mentions légales du site des Archives du Professeur Chen\u00A0: éditeur, hébergeur, propriété intellectuelle et voies de contact.",
    indexee: true,
  },
  cgv: {
    titre: "Conditions de vente",
    description:
      "Les conditions applicables à l’abonnement Patreon qui ouvre l’accès à la formation des Archives du Professeur Chen.",
    indexee: true,
  },
  confidentialite: {
    titre: "Confidentialité",
    description:
      "Ce que ce site conserve, pour quoi faire, pendant combien de temps, et comment vous pouvez le faire effacer à tout moment.",
    indexee: true,
  },
  introuvable: {
    titre: "Page introuvable",
    description:
      "Cette page n’existe pas ou n’existe plus sur le site des Archives du Professeur Chen. Le plan au sol vous ramène aux quatre zones.",
    indexee: false,
  },
};

/* ═══════════════════════ 3 · NAVIGATION ═════════════════════════════════ */

export const navLinks: Lien[] = [
  { to: routes.accueil, label: "Accueil" },
  { to: routes.formation, label: "Formation" },
  { to: routes.paliers, label: "Paliers" },
  { to: routes.minecraft, label: "Minecraft" },
  { to: routes.discord, label: "Discord" },
  { to: routes.reseaux, label: "Réseaux" },
  { to: routes.contact, label: "Contact" },
];

export const navCta: Lien = { to: routes.paliers, label: "Rejoindre" };

export const lienEvitement = "Aller au contenu";

/** Une pièce du plan au sol : rang, nom de pièce, destination. */
export interface ZonePlan {
  rang: string;
  piece: string;
  libelle: string;
  ancre: string;
}

export interface PlanAuSol {
  titre: string;
  legende: string;
  zones: ZonePlan[];
}

// Le plan au sol EST la navigation de l’accueil (Amendement 1, A1.3).
// Une rangée de pastilles numérotées ne le remplace pas.
export const planAuSol: PlanAuSol = {
  titre: "Plan au sol",
  legende:
    "Quatre zones, une seule palette. Chaque bloc de cette page vient d’une pièce.",
  zones: [
    { rang: "01", piece: "Le plateau principal", libelle: "La formation", ancre: "#b-formation" },
    { rang: "02", piece: "La station de travail", libelle: "Le serveur", ancre: "#b-minecraft" },
    { rang: "03", piece: "La galerie d’archives", libelle: "Les réseaux", ancre: "#b-reseaux" },
    { rang: "04", piece: "La salle d’incubation", libelle: "Me joindre", ancre: "#b-contact" },
  ],
};

export interface ColonnePied {
  titre: string;
  liens: Lien[];
}

export interface Pied {
  colonnes: ColonnePied[];
  signature: string;
}

export const pied: Pied = {
  colonnes: [
    {
      titre: "Le lieu",
      liens: [
        { to: routes.formation, label: "La formation" },
        { to: routes.paliers, label: "Les paliers" },
        { to: routes.minecraft, label: "L’Académie" },
        { to: routes.discord, label: "Le Discord" },
        { to: routes.reseaux, label: "Les réseaux" },
      ],
    },
    {
      titre: "Informations",
      liens: [
        { to: routes.contact, label: "Contact" },
        { to: routes.mentionsLegales, label: "Mentions légales" },
        { to: routes.cgv, label: "Conditions de vente" },
        { to: routes.confidentialite, label: "Confidentialité" },
      ],
    },
  ],
  signature: "Les Archives du Professeur Chen · LHM Studio",
};

/* ═══════════════════════ 4 · LES RÉSEAUX ════════════════════════════════ */
/* Les URL, pseudonymes et channelId sont repris tels quels de l’ancien
   fichier : ce sont des données techniques réelles, jamais réécrites.       */

export type ReseauKey = "youtube" | "instagram" | "tiktok" | "facebook";

export interface Reseau {
  label: string;
  handle: string;
  url: string;
  /**
   * Fragment nominal court, sans point final. Les quatre libellés sont ceux de
   * la maquette validée par l’auteur — ils ne se réécrivent pas à la volée.
   */
  description: string;
  channelId?: string;
}

export const reseaux: Record<ReseauKey, Reseau> = {
  youtube: {
    label: "YouTube",
    handle: "@LesArchivesduProfChen",
    url: "https://www.youtube.com/channel/UC5pkQWvaRE0DyJPhN89yGDw",
    channelId: "UC5pkQWvaRE0DyJPhN89yGDw",
    description: "Séries, analyses et lives",
  },
  instagram: {
    label: "Instagram",
    handle: "@les_archives_du_prof_chen",
    url: "https://www.instagram.com/les_archives_du_prof_chen",
    description: "Photos et coulisses",
  },
  tiktok: {
    label: "TikTok",
    handle: "@lesarchivesduprofchen",
    url: "https://www.tiktok.com/@lesarchivesduprofchen",
    description: "Formats courts",
  },
  facebook: {
    label: "Facebook",
    handle: "Les Archives du Professeur Chen",
    url: "https://www.facebook.com/people/Les-Archives-du-Professeur-Chen/61582852092451/",
    description: "Annonces et événements",
  },
};

export const reseauxOrdre: ReseauKey[] = ["youtube", "instagram", "tiktok", "facebook"];

export const blocReseaux: EnTeteSection = {
  surtitre: "03 — Les réseaux",
  titre: "Où l’on publie",
  lede:
    "Les séries longues et les analyses sur YouTube, les formats courts et les coulisses ailleurs. Tout est produit avec la chaîne d’outils enseignée dans la formation.",
  pictogramme: "pic-vitrine",
};

/* ═══════════════════════ 5 · LE DISCORD ═════════════════════════════════ */

export interface Discord extends EnTeteSection {
  nom: string;
  inviteUrl: string;
  /**
   * Identifiant numérique du serveur. Tant qu’il vaut null, le compteur de
   * membres n’est pas affiché : aucun effectif n’est annoncé sans source.
   */
  guildId: string | null;
  salons: string[];
  cta: string;
}

export const discord: Discord = {
  nom: "Le Discord des Archives",
  inviteUrl: "https://discord.com/invite/lesarchivesduprofchen",
  guildId: null,
  surtitre: "La communauté",
  titre: "Le Discord des Archives",
  lede:
    "C’est là que se passe le quotidien\u00A0: les questions, les retours sur vos vidéos, les annonces en avant-première et l’organisation des événements sur le serveur.",
  pictogramme: "pic-paillasse",
  salons: [
    "Des salons Cobblemon, TCG, JCC et discussions Pokémon",
    "Un salon dédié à la formation, réservé aux abonnés",
    "Les échanges, le dressage et les combats entre membres",
    "Les annonces en avant-première des contenus YouTube",
  ],
  cta: "Rejoindre le Discord",
};

/* ═══════════════════════ 6 · LE SERVEUR MINECRAFT ═══════════════════════ */

export interface CarteTexte {
  titre: string;
  texte: string;
}

export interface Minecraft extends EnTeteSection {
  nom: string;
  ip: string;
  edition: string;
  version: string;
  mod: string;
  /** Ligne technique affichée sous l’adresse. */
  releve: string;
  labelAdresse: string;
  cartes: CarteTexte[];
}

export const minecraft: Minecraft = {
  nom: "L’Académie du Professeur Chen",
  // Adresse affichée deux fois dans la maquette validée par l’auteur.
  // Aucun port : le serveur répond sur le port Java par défaut.
  ip: "play.archivesprofesseurchen.com",
  edition: "Java",
  version: "1.20.x",
  mod: "Cobblemon",
  releve: "Java · 1.20.x · Cobblemon",
  labelAdresse: "Adresse du serveur",
  surtitre: "02 — Le serveur",
  titre: "L’Académie du Professeur Chen",
  lede:
    "Un monde Minecraft inspiré de l’univers Pokémon. Vous rejoignez l’Académie, vous capturez avec Cobblemon, vous complétez votre Pokédex, et vous participez aux cours et aux événements.",
  pictogramme: "pic-microscope",
  cartes: [
    {
      titre: "Cobblemon",
      texte:
        "Le mod complet, avec capture, entraînement, échanges et combats entre membres.",
    },
    {
      titre: "Des régions",
      texte:
        "Des régions construites, inspirées des jeux officiels, avec leurs quêtes et leurs arènes.",
    },
    {
      titre: "La Ligue",
      texte: "Un système de Ligue avec champions d’arène, tournois et classement communautaire.",
    },
    {
      titre: "Des cours",
      texte:
        "Des cours et des événements en jeu, animés par l’équipe, annoncés sur le Discord.",
    },
  ],
};

/* ═══════════════════════ 7 · PATREON ET LES PALIERS ═════════════════════ */
/* Noms réels de l’auteur, conservés tels quels : Amendement 1, A1.4.
   Le §0.26 (Apprenti · Assistant de laboratoire · Archiviste) est SUSPENDU,
   pas appliqué, jusqu’à la validation juridique du nom « Professeur Chen ».
   Les codes ARC · MBR — NN, eux, sont arrêtés et s’appliquent.              */

export interface Patreon {
  url: string;
  /**
   * Libellé de repli, seul emploi autorisé tant que la fiche de relevé de
   * marque Patreon n’est pas remplie (10-membre-addendum §10.15).
   */
  boutonLibelle: string;
  /**
   * Aucun logo tant que le fichier officiel n’est pas relevé : un bouton sans
   * pictogramme est correct, un logo reconstitué est une faute (§10.15).
   */
  logo: string | null;
  mentionEngagement: string;
}

export const patreon: Patreon = {
  url: "https://patreon.com/LesArchivesduProfesseurChen",
  boutonLibelle: "Se connecter avec Patreon",
  logo: null,
  mentionEngagement: "Sans engagement · pause à tout moment",
};

export type PalierKey = "visiteur" | "dresseur" | "champion" | "maitre";

/** Une seule source de vérité pour l’ordre des paliers (10-membre §10.2). */
export const RANG: Record<PalierKey, number> = {
  visiteur: 0,
  dresseur: 1,
  champion: 2,
  maitre: 3,
};

/** Une chose que le palier ouvre, nommée puis expliquée. */
export interface OuverturePalier {
  titre: string;
  texte: string;
}

export interface Palier {
  code: string;
  rang: number;
  /** Nom long : fiche de membre et page des paliers. */
  nom: string;
  /** Nom court : badge et messages d’état. */
  court: string;
  classe: "p0" | "p1" | "p2" | "p3";
  /** Montant exact, affiché sur le hero, les cartes et le tableau (A1.1). */
  prix: string | null;
  periodicite: string | null;
  /** Une phrase, ce que le palier permet de faire. */
  accroche: string | null;
  /** Résumé court, employé sur les cartes de l’accueil. */
  court_texte: string | null;
  /** Texte long, employé sur la page des paliers. */
  description: string | null;
  ouvre: OuverturePalier[];
  phare: boolean;
  /** Nombre de places du palier sur Patreon, quand il est plafonné. */
  places: number | null;
  /** Identifiant de palier Patreon. Reste null tant qu’il n’est pas relevé. */
  patreonTierId: string | null;
}

export const paliers: Record<PalierKey, Palier> = {
  visiteur: {
    code: "ARC\u00A0·\u00A0MBR\u00A0—\u00A000",
    rang: RANG.visiteur,
    nom: "Visiteur",
    court: "Visiteur",
    classe: "p0",
    prix: null,
    periodicite: null,
    accroche: null,
    court_texte: null,
    description: null,
    ouvre: [],
    phare: false,
    places: null,
    patreonTierId: null,
  },

  dresseur: {
    code: "ARC\u00A0·\u00A0MBR\u00A0—\u00A001",
    rang: RANG.dresseur,
    nom: "Jeune Dresseur",
    court: "Jeune Dresseur",
    classe: "p1",
    prix: "8,50\u00A0€",
    periodicite: "par mois",
    accroche:
      "Découvrez les logiciels, comprenez les bases et réalisez vos premiers formats.",
    court_texte:
      "Le Module 01 en entier, les conseils de logiciels, les tutoriels de format simple et le Discord.",
    description:
      "Vous souhaitez vous lancer dans la création vidéo par intelligence artificielle, mais vous ne savez pas encore quels logiciels choisir ni comment commencer\u202F? Ce premier palier vous permet de découvrir mon environnement de création et de progresser avec des contenus simples et accessibles.",
    ouvre: [
      {
        titre: "Le choix des logiciels",
        texte:
          "Des présentations, tests et conseils pour choisir les logiciels adaptés à vos besoins et à votre budget.",
      },
      {
        titre: "Les tutoriels de format simple",
        texte:
          "Des tutoriels basés sur certains formats des Archives, notamment les vidéos courtes.",
      },
      {
        titre: "Le Discord communautaire",
        texte: "L’accès aux salons de la communauté et au salon dédié à la formation.",
      },
    ],
    phare: false,
    places: null,
    patreonTierId: null,
  },

  champion: {
    code: "ARC\u00A0·\u00A0MBR\u00A0—\u00A002",
    rang: RANG.champion,
    nom: "Champion d’Arène",
    court: "Champion",
    classe: "p2",
    prix: "18\u00A0€",
    periodicite: "par mois",
    accroche: "Maîtrisez la méthode complète et donnez vie à vos propres histoires.",
    court_texte:
      "Tout le palier précédent, plus les tutoriels complets de conception et de réalisation — en production.",
    description:
      "Ce second palier s’adresse à celles et ceux qui souhaitent dépasser les formats simples et apprendre à construire une vidéo narrative complète, cohérente et immersive, de la première idée jusqu’à sa publication.",
    ouvre: [
      {
        titre: "Tout le palier Jeune Dresseur",
        texte:
          "Les conseils sur les logiciels, les tutoriels de format simple, les ressources pratiques et le Discord.",
      },
      {
        titre: "Les tutoriels complets de conception et de réalisation",
        texte:
          "Toutes les étapes nécessaires pour créer une vidéo, de l’idée à la publication.",
      },
    ],
    phare: true,
    places: null,
    patreonTierId: null,
  },

  maitre: {
    code: "ARC\u00A0·\u00A0MBR\u00A0—\u00A003",
    rang: RANG.maitre,
    nom: "Maître de la Ligue",
    court: "Maître",
    classe: "p3",
    prix: "89,50\u00A0€",
    periodicite: "par mois",
    accroche:
      "Développez votre projet avec un accompagnement adapté à vos objectifs.",
    court_texte:
      "Tout des paliers précédents, plus une analyse de votre projet et un accompagnement personnalisé.",
    description:
      "Ce dernier palier s’adresse aux créateurs qui souhaitent aller au-delà de la formation et bénéficier d’un regard extérieur expérimenté sur leur propre travail. Ici, il ne s’agit plus seulement d’appliquer ma méthode\u00A0: je l’adapte avec vous à votre univers, votre niveau, vos contraintes et vos ambitions.",
    ouvre: [
      {
        titre: "Tout des paliers précédents",
        texte:
          "L’intégralité des tutoriels, études de cas, dossiers de production, ressources et publications à venir.",
      },
      {
        titre: "Une analyse préalable de votre projet",
        texte: "Un point de départ construit ensemble, sur votre univers et vos contraintes.",
      },
      {
        titre: "Un accompagnement personnalisé",
        texte: "Un suivi adapté à vos objectifs, à votre niveau et à votre rythme.",
      },
    ],
    phare: false,
    // Le palier est plafonné sur Patreon. Le nombre est un fait vérifiable sur
    // la page du palier ; son affichage sur le site reste à décider.
    places: 15,
    patreonTierId: null,
  },
};

export const paliersPayants: PalierKey[] = ["dresseur", "champion", "maitre"];

export interface BlocPaliers extends EnTeteSection {
  /** Variante longue du chapeau, employée sur l’accueil. */
  ledeAccueil: string;
  ctaCarte: string;
  ctaComparer: string;
  titreComparatif: string;
  legendeComparatif: string;
}

export const blocPaliers: BlocPaliers = {
  surtitre: "Rejoindre les Archives",
  titre: "Trois paliers, une progression",
  lede:
    "On entre en Jeune Dresseur, on apprend la méthode complète en Champion d’Arène, et on fait relire son propre travail en Maître de la Ligue. L’accès passe par Patreon, sans engagement.",
  ledeAccueil:
    "On entre en Jeune Dresseur, on apprend la méthode complète en Champion d’Arène, et on fait relire son propre travail en Maître de la Ligue. L’accès passe par Patreon, sans engagement — vous pouvez mettre en pause à tout moment.",
  pictogramme: "pic-incubation",
  ctaCarte: "Rejoindre ce palier",
  ctaComparer: "Comparer les trois paliers",
  titreComparatif: "Ce que chaque palier ouvre",
  legendeComparatif: "Comparaison des trois paliers d’abonnement",
};

/* Le tableau comparatif. Une ligne = une chose que le membre peut faire,
   jamais un argument de vente (10-membre §10.2).                            */

export type EtatAcces = "ouvert" | "production" | "ferme";

/** Les trois paliers payants — les seules colonnes du tableau comparatif. */
export type PalierPayantKey = Exclude<PalierKey, "visiteur">;

export const libelleAcces: Record<EtatAcces, string> = {
  ouvert: "Ouvert",
  production: "En production",
  // « Fermé » s’écrit en toutes lettres : le mot reste porteur de l’état
  // (socle §0.31, forced-colors). Jamais de croix rouge.
  ferme: "Fermé",
};

export interface LigneComparatif {
  ligne: string;
  precision?: string;
  etats: Record<PalierPayantKey, EtatAcces>;
}

export const comparatif: LigneComparatif[] = [
  {
    ligne: "Module 01 — La boîte à outils",
    precision: "(8 chapitres)",
    etats: { dresseur: "ouvert", champion: "ouvert", maitre: "ouvert" },
  },
  {
    ligne: "Conseils et tests de logiciels",
    etats: { dresseur: "ouvert", champion: "ouvert", maitre: "ouvert" },
  },
  {
    ligne: "Tutoriels de format simple",
    etats: { dresseur: "ouvert", champion: "ouvert", maitre: "ouvert" },
  },
  {
    ligne: "Discord communautaire",
    etats: { dresseur: "ouvert", champion: "ouvert", maitre: "ouvert" },
  },
  {
    ligne: "Tutoriels complets de conception et de réalisation",
    etats: { dresseur: "ferme", champion: "production", maitre: "production" },
  },
  {
    ligne: "Études de cas et dossiers de production",
    etats: { dresseur: "ferme", champion: "ouvert", maitre: "ouvert" },
  },
  {
    ligne: "Analyse préalable de votre projet",
    etats: { dresseur: "ferme", champion: "ferme", maitre: "ouvert" },
  },
  {
    ligne: "Accompagnement personnalisé",
    etats: { dresseur: "ferme", champion: "ferme", maitre: "ouvert" },
  },
];

export interface EncartProduction {
  /** Sur l’accueil : un seul paragraphe. */
  accueil: CarteTexte;
  /** Sur la page des paliers : deux paragraphes, l’aveu en entier. */
  paliers: { titre: string; paragraphes: string[] };
}

/** L’aveu, dit avant l’abonnement et pas après. */
export const encartProduction: EncartProduction = {
  accueil: {
    titre: "Ce que chaque palier ouvre aujourd’hui",
    texte:
      "Le Module 01 est ouvert en entier dès le Jeune Dresseur\u00A0: ses huit chapitres, sans exception. Ce que le Champion d’Arène ouvre en plus — les tutoriels complets de conception et de réalisation — est en production. Je le dis avant l’abonnement, pas après.",
  },
  paliers: {
    titre: "Ce que le Champion d’Arène ajoute aujourd’hui",
    paragraphes: [
      "Le Module 01 est ouvert en entier, dès le Jeune Dresseur\u00A0: ses huit chapitres, sans exception. Ce que le Champion d’Arène ouvre en plus — les tutoriels complets de conception et de réalisation — est en production.",
      "Je le dis ici plutôt que de le laisser découvrir\u00A0: à cette date, un abonné Champion d’Arène accède aux mêmes modules qu’un Jeune Dresseur. Ce qu’il paie, c’est l’accès à ce qui arrive, au prix d’aujourd’hui. Ça se dit avant l’abonnement, pas après.",
    ],
  },
};

/* Le sas de connexion. Texte normatif du 10-membre-addendum §10.17, qui
   écrase la copie du §10.6 et celle de la maquette (voir points durs).      */

export interface Sas {
  titre: string;
  texte: string;
  bouton: string;
  relance: string;
  relanceLien: string;
  relanceSuite: string;
  lienDonnees: string;
  /**
   * L’énoncé unique des données conservées. Il ne peut être écrit qu’après le
   * relevé des portées OAuth et le premier échange réel avec l’API (§10.17).
   * Tant qu’il vaut null, aucun engagement sur les données ne s’affiche.
   */
  enonceDonnees: string | null;
}

export const sas: Sas = {
  titre: "Prenez votre badge.",
  texte:
    "Les modules sont ouverts aux membres Patreon des Archives. La connexion se fait sur le site de Patreon\u00A0: aucun mot de passe ne transite par ce site, et je n’en crée aucun.",
  bouton: patreon.boutonLibelle,
  relance: "Pas encore membre\u202F?",
  relanceLien: "Voir ce que chaque badge ouvre",
  relanceSuite: "ou passer directement par la page Patreon des Archives.",
  lienDonnees: "Ce que je conserve sur ce site, et pour quoi faire.",
  enonceDonnees: null,
};

/* ═══════════════════════ 8 · LA FORMATION ═══════════════════════════════ */

export interface Formation extends EnTeteSection {
  sousTitreModules: string;
  introModules: string;
  /** La preuve avant la promesse (01-fondations §2.3). */
  atelier: {
    titre: string;
    signature: string;
    paragraphes: string[];
  };
  encartSuite: CarteTexte;
  ctaPaliers: string;
  ctaModule: string;
  ctaContenu: string;
}

export const formation: Formation = {
  surtitre: "01 — La formation",
  titre: "Créer avec l’IA, sans y perdre votre univers",
  lede:
    "Je vous montre la chaîne complète, celle qui fait tourner les Archives\u00A0: quels outils, dans quel ordre, et pourquoi. Vous repartez avec une méthode, pas avec une liste de liens.",
  pictogramme: "pic-vitrine",

  sousTitreModules: "Le module ouvert aujourd’hui",
  introModules:
    "Les suivants s’ajoutent au fil de leur production. Vous ne payez pas un catalogue promis\u00A0: vous accédez à ce qui existe, et à tout ce qui viendra tant que vous êtes abonné.",

  atelier: {
    titre: "La preuve, avant la promesse",
    signature: "Le narrateur · Les Archives",
    paragraphes: [
      "Le plateau, le narrateur, les vitrines, la salle d’incubation\u00A0: tout sort de la chaîne enseignée dans le module. Aucun décor construit, aucune équipe, aucun studio loué.",
      "Et ce qui fait tenir l’ensemble, ce n’est pas le modèle. C’est la direction artistique, décidée avant la première génération\u00A0: une palette fermée, des matières choisies une fois pour toutes, le même vocabulaire de lumière d’un plan à l’autre.",
      "Les outils changent tous les six mois. Ça, non. C’est exactement l’ordre dans lequel la formation vous fait travailler.",
    ],
  },

  encartSuite: {
    titre: "Ce qui arrive ensuite",
    texte:
      "Les modules suivants sont en production. En attendant, l’abonnement donne accès à ce qui existe déjà à côté des modules\u00A0: les études de cas, les dossiers de production, les ressources pratiques, et les publications à venir. Je n’annonce pas de calendrier que je ne peux pas tenir.",
  },

  ctaPaliers: "Rejoindre les Archives — dès 8,50\u00A0€",
  ctaModule: "Ouvrir le module",
  ctaContenu: "Ce que contient la formation",
};

/** Un chapitre du module. `palierRequis` porte le rang minimal qui l’ouvre. */
export interface ChapitreModule {
  rang: string;
  titre: string;
  glose: string;
  palierRequis: number;
}

export interface Module {
  code: string;
  numero: string;
  titre: string;
  sousTitre: string;
  chapo: string;
  chapoOuvert: string;
  duree: string;
  resume: string;
  outils: string[];
  composants: string[];
  chapitres: ChapitreModule[];
}

/** Le seul module attesté (socle §0.36 et §0.38). */
export const module01: Module = {
  code: "ARC\u00A0·\u00A0MOD\u00A0—\u00A001",
  numero: "01",
  titre: "La boîte à outils",
  sousTitre: "Choisir ses instruments",
  chapo: "ARC\u00A0·\u00A0MOD\u00A0—\u00A001 · huit chapitres",
  chapoOuvert: "ARC\u00A0·\u00A0MOD\u00A0—\u00A001 · huit chapitres · ouvert",
  duree:
    "Huit chapitres. Comptez deux heures pour tout traverser une première fois, et revenez-y au moment de produire.",
  resume:
    "Il existe des centaines de plateformes. Six outils suffisent. Je vous montre ceux qui font tourner les Archives, ce que chacun sait vraiment faire, et le moment précis où on le sort de la boîte.",
  outils: [
    "Higgsfield",
    "Nano Banana 2",
    "Seedream",
    "Kling",
    "ElevenLabs",
    "Suno",
    "CapCut",
  ],
  composants: ["Banc d’essai", "Clé de détermination", "Travaux pratiques"],
  chapitres: [
    { rang: "Chapitre 01", titre: "La station de travail", glose: "Plateforme et modèles", palierRequis: RANG.dresseur },
    { rang: "Chapitre 02", titre: "La génération d’image", glose: "Trois modèles et un banc d’essai", palierRequis: RANG.dresseur },
    { rang: "Chapitre 03", titre: "La clé de détermination", glose: "Quel modèle pour votre plan", palierRequis: RANG.dresseur },
    { rang: "Chapitre 04", titre: "L’animation", glose: "Kling ou Seedance", palierRequis: RANG.dresseur },
    { rang: "Chapitre 05", titre: "Le son et l’assemblage", glose: "ElevenLabs · Suno · CapCut", palierRequis: RANG.dresseur },
    { rang: "Intermède", titre: "L’atelier", glose: "Ce que la chaîne produit", palierRequis: RANG.dresseur },
    { rang: "Chapitre 06", titre: "Les chaînes de production", glose: "Débutant ou qualité", palierRequis: RANG.dresseur },
    { rang: "Chapitre 07", titre: "Travaux pratiques", glose: "Votre première séquence", palierRequis: RANG.dresseur },
  ],
};

/** Un outil du kit. `url` reste null tant que l’adresse exacte n’est pas fournie. */
export interface OutilKit {
  nom: string;
  url: string | null;
}

export interface Kit {
  titre: string;
  mention: string;
  rappel: string;
  /** Étiquette obligatoire à côté de chaque action rémunérée (§10.1 ①). */
  etiquette: string;
  /** Attributs imposés sur un lien rémunéré (§10.3). */
  relAffilie: string;
  outils: OutilKit[];
}

/* Le kit de la formation. Les quatre partenaires sont attestés ; les adresses
   exactes suivent le motif link.lhm-studio.com/<outil> et restent à fournir. */
export const kit: Kit = {
  titre: "Le kit de la formation",
  mention:
    "Communication commerciale — quatre des liens de ce module sont affiliés. Si vous passez par eux, je touche une commission et vous payez exactement le même prix. Je ne mets ici que des outils qui tournent sur mes propres vidéos.",
  rappel: "Higgsfield · ElevenLabs · Kling · CapCut — liens affiliés",
  etiquette: "lien affilié",
  relAffilie: "sponsored noopener",
  outils: [
    { nom: "Higgsfield", url: null },
    { nom: "ElevenLabs", url: null },
    { nom: "Kling", url: null },
    { nom: "CapCut", url: null },
  ],
};

export interface QuestionReponse {
  q: string;
  a: string;
}

/* La FAQ, réécrite au vouvoiement. Chaque réponse est adossée à un fait
   présent dans la maquette validée ou dans la charte. Aucune promesse de
   résultat, aucun délai que je n’ai pas mesuré (10-addendum §10.17).         */
export const faq: QuestionReponse[] = [
  {
    q: "À qui s’adresse la formation\u202F?",
    a: "Aux passionnés qui veulent créer de la vidéo avec l’intelligence artificielle\u00A0: à celles et ceux qui ne savent pas encore quels logiciels choisir, comme à celles et ceux qui produisent déjà et veulent structurer une vidéo narrative complète.",
  },
  {
    q: "Comment l’accès fonctionne-t-il\u202F?",
    a: "L’accès passe par Patreon. Vous choisissez un palier mensuel, et l’accès aux modules suit votre palier Patreon. Sans engagement\u00A0: vous pouvez mettre en pause à tout moment.",
  },
  {
    q: "Qu’est-ce qui est ouvert aujourd’hui\u202F?",
    a: "Le Module 01 — La boîte à outils, en entier, ses huit chapitres, dès le palier Jeune Dresseur. Les tutoriels complets de conception et de réalisation, que le Champion d’Arène ouvre en plus, sont en production. Je n’annonce pas de calendrier que je ne peux pas tenir.",
  },
  {
    q: "Y a-t-il un accompagnement\u202F?",
    a: "Le Discord communautaire et son salon dédié à la formation sont ouverts à tous les paliers. L’analyse préalable de votre projet et l’accompagnement personnalisé sont ouverts au palier Maître de la Ligue.",
  },
  {
    q: "Est-ce que la formation permet d’en vivre\u202F?",
    a: "Je ne promets pas de résultat, et je n’en publie aucun que je ne puisse montrer. Ce que la formation enseigne, c’est la chaîne de production qui fait tourner les Archives\u00A0: les outils, leur ordre, et la direction artistique qui tient l’ensemble. Ce que vous en faites vous appartient.",
  },
];

/* ═══════════════════════ 9 · L’ACCUEIL ══════════════════════════════════ */

export interface CtaAncre {
  label: string;
  ancre: string;
}

/**
 * Le hero est un split : panneau clair à gauche, photo à droite, à pleine
 * lumière. Jamais de texte long posé sur la photo (Amendement 1, A1.2).
 */
export interface Hero {
  titre: string;
  sousTitre: string;
  texte: string;
  ctaPrimaire: CtaAncre;
  ctaSecondaire: CtaAncre;
  /** Légende de sujet : 56 caractères au maximum, sans point final (§7.13.3). */
  legendePhoto: string;
}

export interface Accueil {
  hero: Hero;
  contact: { surtitre: string; titre: string; lede: string };
}

export const accueil: Accueil = {
  hero: {
    titre: "La formation",
    sousTitre: "Créer avec l’IA, sans y perdre votre univers",
    texte:
      "Huit chapitres, six outils, la chaîne complète — de la première image jusqu’à la publication. Tout ce que vous voyez ici en sort\u00A0: aucun décor construit, aucune équipe, aucun studio loué. L’accès passe par Patreon, à partir de 8,50\u00A0€ par mois, sans engagement.",
    ctaPrimaire: { label: "Rejoindre les Archives — dès 8,50\u00A0€", ancre: "#b-paliers" },
    ctaSecondaire: { label: "Ce que contient la formation", ancre: "#b-formation" },
    legendePhoto: "Les Archives du Professeur Chen · plateau principal",
  },
  contact: {
    surtitre: "04 — Me joindre",
    titre: "Une question avant de vous lancer\u202F?",
    lede:
      "Pour une question sur la formation, une proposition de partenariat, ou un souci d’accès à votre abonnement. Je réponds moi-même.",
  },
};

/* ── Les photos, et l’interrupteur qui décide de leur publication ────────── */

/**
 * Photo du plateau pour le hero (A1.2). `null` = panneau sans photo.
 *
 * L’auteur a tranché : la réserve juridique de 07-imagerie §7.14 lui
 * appartient, il l’a levée en connaissance de cause (voir l’en-tête de
 * `visuels.ts`). L’interrupteur reste un interrupteur — le type est toujours
 * `Photo | null`, et remettre `null` ici suffit à dépublier les deux images
 * sans toucher à une seule page : l’accueil retombe sur `PanneauMatiere`,
 * `/formation` retire sa colonne d’image.
 *
 * Ce que porte `Photo`, et ce qu’il ne porte pas : le couple `src`/`alt` est
 * le REPLI, celui que reçoit un navigateur sans `srcset`. Les dérivées, les
 * encodages et l’aplat de chargement ne sont PAS recopiés ici — ils vivent dans
 * `visuels.ts`, seule source autorisée, et l’accueil les lit là-bas pour
 * composer son `<picture>`. Aucun chemin n’est écrit à la main, des deux
 * côtés : `chemin()` et `repli()` les construisent.
 */
export const heroPhoto: Photo | null = {
  src: chemin(plateauLarge, secours(plateauLarge), "jpg"),
  alt: plateauLarge.alt,
};

/**
 * Portrait du narrateur. Même interrupteur, même réserve levée.
 * Le texte de remplacement vient de `visuels.ts` et n’est jamais réécrit :
 * §0.38 laisse le statut du narrateur ouvert, donc l’alt ne nomme personne.
 */
export const portraitPhoto: Photo | null = {
  src: chemin(narrateurPortrait, secours(narrateurPortrait), "jpg"),
  alt: narrateurPortrait.alt,
};

/* ═══════════════════════ 10 · ME JOINDRE ════════════════════════════════ */

export interface Contact extends EnTeteSection {
  motifs: string[];
  champs: {
    nom: string;
    email: string;
    message: string;
    envoyer: string;
  };
  cartes: CarteTexte[];
  ctaEcrire: string;
  ctaDiscord: string;
  /**
   * Adresse de contact publique : à fournir, ou le formulaire reste le seul
   * canal avec le Discord.
   */
  email: string | null;
}

export const contact: Contact = {
  surtitre: "Contact",
  titre: "Écrivez-moi",
  lede:
    "Pour une question sur la formation, une proposition de partenariat, ou un souci d’accès à votre abonnement.",
  pictogramme: "pic-carnet",
  motifs: [
    "Une question sur ce que la formation couvre",
    "Un problème d’accès à votre abonnement Patreon",
    "Une proposition de partenariat ou de sponsoring",
  ],
  champs: {
    nom: "Votre nom",
    email: "Votre adresse e-mail",
    message: "Votre message",
    envoyer: "Envoyer",
  },
  cartes: [
    {
      titre: "Le plus rapide",
      texte:
        "Pour une question courte, le Discord va plus vite que le formulaire\u00A0: la communauté répond souvent avant moi.",
    },
    {
      titre: "Pour un souci d’abonnement",
      texte:
        "Précisez l’adresse e-mail de votre compte Patreon\u00A0: c’est ce qui me permet de retrouver votre adhésion.",
    },
  ],
  ctaEcrire: "Écrire un message",
  ctaDiscord: "Passer par le Discord",
  email: null,
};

/* ═══════════════════════ 11 · MENTIONS ET PAGES LÉGALES ═════════════════ */
/* Les trois mentions de pied sont obligatoires et ne se retirent pas
   (01-fondations §10.1 ③, socle §0.36 lot L3).                              */

/** Une page légale dont le corps reste à rédiger par un conseil juridique. */
export interface PageLegale {
  titre: string;
  corps: string | null;
}

/** Faits d’entreprise. Aucun n’est deviné : ils viennent tous de LHM Studio. */
export interface PageMentionsLegales {
  titre: string;
  editeur: string;
  formeJuridique: string | null;
  siret: string | null;
  adresse: string | null;
  directeurPublication: string | null;
  emailContact: string | null;
  hebergeur: string;
  hebergeurAdresse: string | null;
}

export interface Legal {
  piedAffiliation: string;
  piedGeneration: string;
  piedGenerationDecor: string;
  piedNonAffiliation: string;
  labelReleve: string;
  mentionBrut: string;
  pages: {
    mentionsLegales: PageMentionsLegales;
    cgv: PageLegale;
    confidentialite: PageLegale;
  };
}

export const legal: Legal = {
  piedAffiliation:
    "Communication commerciale — certains liens de ce site sont des liens affiliés. Leur utilisation peut me permettre de percevoir une commission, sans coût supplémentaire pour vous. Les appréciations de qualité, de facilité d’usage et de modération correspondent à mon expérience personnelle au moment de la publication\u202F; les modèles et leurs règles évoluent vite. Dernière mise à jour\u00A0: " +
    `${site.derniereMiseAJour}.`,
  /** Mention générale, portée par le pied de toutes les pages. */
  piedGeneration:
    "Les visuels de ce site sont générés avec la chaîne d’outils enseignée dans la formation.",
  /**
   * Formulation imposée mot pour mot par le §7.14, à porter par toute page qui
   * présente le décor ou le narrateur. Elle remplace `piedGeneration` sur ces
   * pages-là — elle ne s’y ajoute pas.
   */
  piedGenerationDecor:
    "Les visuels de cette page — le laboratoire, le narrateur, les planches de décor — sont générés par intelligence artificielle avec les outils présentés dans la formation. Aucun décor construit, aucune équipe, aucun studio loué.",
  piedNonAffiliation:
    "Site non affilié à Nintendo, Game Freak ou The Pokémon Company.",
  /** Label obligatoire au-dessus de toute jauge (§10.1 ④). */
  labelReleve: "Relevé — appréciation personnelle",
  /** Mention obligatoire sur toute image servant de preuve (§10.1 ⑤). */
  mentionBrut: "brut de génération",

  pages: {
    mentionsLegales: {
      titre: "Mentions légales",
      editeur: "LHM Studio",
      // Faits d’entreprise. Aucun n’est deviné : ils viennent de LHM Studio.
      formeJuridique: null,
      siret: null,
      adresse: null,
      directeurPublication: null,
      emailContact: null,
      hebergeur: "Netlify",
      hebergeurAdresse: null,
    },
    cgv: {
      titre: "Conditions de vente",
      // L’abonnement est vendu par Patreon, pas par ce site : le périmètre
      // exact des conditions applicables relève d’un conseil juridique.
      corps: null,
    },
    confidentialite: {
      titre: "Confidentialité",
      // Reprend mot pour mot `sas.enonceDonnees` quand il existera (§10.18,
      // contrôle 11 : un énoncé unique, identique sur les trois surfaces).
      corps: null,
    },
  },
};

/* ═══════════════════════ 12 · MESSAGES DE L’ESPACE MEMBRE ═══════════════ */
/* Textes exacts du chapitre 10 §10.8, corrigés par l’addendum §10.17 et
   transposés sur les noms de paliers réels (Amendement 1, A1.4).            */

export type CodeErreurMembre =
  | "MBR-000"
  | "MBR-401"
  | "MBR-403"
  | "MBR-404"
  | "MBR-409"
  | "MBR-429"
  | "MBR-500"
  | "MBR-503";

export interface EtatsMembre {
  verrouVisiteur: string;
  verrouPastille: string;
  ouvertCta: string;
  reprendreCta: string;
  revoirCta: string;
  moduleArchive: string;
  aVenirPastille: string;
  aVenirTexte: string;
  pause: string;
  relecture: string;
  syncBouton: string;
  gererAbonnement: string;
}

export interface Messages {
  etats: EtatsMembre;
  erreurs: Record<CodeErreurMembre, string>;
}

export const messages: Messages = {
  etats: {
    verrouVisiteur:
      "Ce module demande un badge. Les modules sont ouverts aux membres Patreon des Archives. Prenez votre badge, revenez ici\u00A0: le module s’ouvre.",
    verrouPastille: "Verrouillé · badge Champion d’Arène",
    ouvertCta: "Ouvrir le module",
    reprendreCta: "Reprendre au chapitre 04",
    revoirCta: "Revoir le module",
    moduleArchive:
      "Module archivé. Vos huit chapitres sont relevés. Le tampon est posé sur votre fiche de membre.",
    aVenirPastille: "En préparation",
    aVenirTexte:
      "Ce module n’est pas encore publié. Il s’ouvrira à votre palier sans rien à faire de votre part.",
    pause:
      "Votre abonnement est en pause. Vos relevés vous attendent. Rien n’est supprimé tant que vous ne le demandez pas.",
    relecture:
      "Votre badge est relu à chaque chargement d’une page de module. Votre palier est relu au maximum une fois par minute\u202F; le bouton «\u00A0Rafraîchir mon palier\u00A0» force la relecture.",
    syncBouton: "Rafraîchir mon palier",
    gererAbonnement: "Gérer mon abonnement",
  },
  erreurs: {
    "MBR-000":
      "Connexion annulée. Vous n’avez rien validé sur Patreon, et rien n’a été enregistré ici.",
    "MBR-401":
      "Votre session s’est terminée. Reconnectez-vous\u00A0: vous reviendrez exactement à cette page.",
    "MBR-403":
      "Ce module demande le badge Champion d’Arène. Votre badge actuel est Jeune Dresseur.",
    "MBR-404":
      "Compte Patreon trouvé, mais aucun abonnement actif aux Archives n’a été lu. Si vous venez de vous abonner, rafraîchissez votre palier.",
    "MBR-409":
      "Votre abonnement est actif, mais je n’arrive pas à lire votre palier. C’est un problème de mon côté. Écrivez-moi avec ce code, je l’ouvre à la main.",
    "MBR-429": "Trop de tentatives de connexion. Patientez une minute avant de réessayer.",
    "MBR-500":
      "Quelque chose a cassé de mon côté. Ce n’est pas votre abonnement. Réessayez dans quelques minutes.",
    "MBR-503":
      "Patreon ne répond pas pour l’instant. Ce n’est pas vous, et votre abonnement n’est pas en cause. Réessayez dans quelques minutes.",
  },
};

/* ═══════════════════════ 13 · CE QUI RESTE OUVERT ═══════════════════════ */
/* Registre des champs volontairement à `null`. Il n’affiche rien : il sert de
   liste de contrôle avant mise en ligne. La porte 1 du §10.18 refuse la
   construction si un marqueur de relevé traîne en clair dans src/ — d’où
   cette forme, qui ne contient aucun marqueur.                              */

export interface ChampOuvert {
  champ: string;
  motif: string;
}

export const CONTRAT_OUVERT: ChampOuvert[] = [
  { champ: "discord.guildId", motif: "Identifiant du serveur, à relever avant tout compteur de membres." },
  { champ: "paliers.*.patreonTierId", motif: "Identifiants de palier, à relever sur la page Patreon." },
  { champ: "patreon.logo", motif: "Fichier officiel du logo, à relever. Aucune reconstitution." },
  { champ: "sas.enonceDonnees", motif: "Énoncé unique des données, écrit après le relevé des portées OAuth." },
  { champ: "kit.outils[].url", motif: "Adresses affiliées exactes, à fournir par LHM Studio." },
  { champ: "contact.email", motif: "Adresse de contact publique, à fournir." },
  { champ: "legal.pages.*", motif: "Faits d’entreprise et rédaction juridique, à fournir par LHM Studio." },
];

/* `heroPhoto` et `portraitPhoto` ne figurent plus dans ce registre : l’auteur
   a tranché, les deux visuels sont publiés et déclarés dans `visuels.ts`. Le
   registre liste ce qui MANQUE, pas ce qui est révocable — et la révocation
   reste possible d’un mot (remettre les deux constantes à `null`), ce que la
   réserve de 07-imagerie §7.14 exige et que le typage `Photo | null` garantit. */
