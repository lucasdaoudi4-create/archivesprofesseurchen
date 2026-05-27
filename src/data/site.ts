// Centralised site data — edit here to change content across the site.

export const site = {
  name: "Les Archives du Professeur Chen",
  shortName: "Archives Prof. Chen",
  tagline: "Bienvenue au laboratoire.",
  domain: "archivesprofesseurchen.com",
  description:
    "Formation, communauté Discord, serveur Minecraft L'Académie du Professeur Chen, et contenus Pokémon sur YouTube, Instagram, TikTok et Facebook.",
};

export type SocialKey = "youtube" | "instagram" | "tiktok" | "facebook";

export const socials: Record<
  SocialKey,
  {
    label: string;
    handle: string;
    url: string;
    color: string;
    bg: string;
    description: string;
  }
> = {
  youtube: {
    label: "YouTube",
    handle: "@LesArchivesduProfChen",
    url: "https://www.youtube.com/channel/UC5pkQWvaRE0DyJPhN89yGDw",
    color: "text-red-400",
    bg: "from-red-600/30 to-red-900/10",
    description: "Vidéos longues, analyses, lives et séries Pokémon.",
  },
  instagram: {
    label: "Instagram",
    handle: "@les_archives_du_prof_chen",
    url: "https://www.instagram.com/les_archives_du_prof_chen",
    color: "text-pink-400",
    bg: "from-pink-500/30 to-fuchsia-900/10",
    description: "Photos, behind-the-scenes et stories au quotidien.",
  },
  tiktok: {
    label: "TikTok",
    handle: "@lesarchivesduprofchen",
    url: "https://www.tiktok.com/@lesarchivesduprofchen",
    color: "text-white",
    bg: "from-cyan-400/30 to-pink-500/10",
    description: "Formats courts, astuces et moments cultes Pokémon.",
  },
  facebook: {
    label: "Facebook",
    handle: "Les Archives du Professeur Chen",
    url: "https://www.facebook.com/people/Les-Archives-du-Professeur-Chen/61582852092451/",
    color: "text-blue-400",
    bg: "from-blue-500/30 to-blue-900/10",
    description: "Communauté, annonces officielles et événements.",
  },
};

export const discord = {
  name: "Discord — Les Archives",
  inviteUrl: "https://discord.com/invite/lesarchivesduprofchen",
  memberCountApprox: "1 000+",
  features: [
    "Salons thématiques par génération Pokémon",
    "Échanges, dressage et combats compétitifs",
    "Annonces en avant-première des contenus",
    "Salon dédié à la formation et au serveur Minecraft",
    "Événements communautaires réguliers",
  ],
};

export const minecraft = {
  name: "L'Académie du Professeur Chen",
  ip: "play.archivesprofesseurchen.com", // TODO
  version: "1.20.x",
  gamemode: "Pixelmon / Survival éducatif",
  description:
    "Le serveur Minecraft officiel : un monde inspiré de l'univers Pokémon où tu rejoins l'Académie, capture des Pokémon, complète ton Pokédex et participe à des cours et événements.",
  features: [
    "Mod Pixelmon avec tous les Pokémon",
    "Cours et événements en jeu animés par l'équipe",
    "Régions custom inspirées des jeux officiels",
    "Système de Ligue avec champions d'arène",
    "Échanges, GTS et tournois communautaires",
  ],
};

export const formation = {
  title: "La Formation",
  subtitle: "Deviens créateur Pokémon — du zéro à la publication",
  pitch:
    "Une formation complète pour lancer ta chaîne, créer du contenu Pokémon de qualité, fédérer une communauté et en vivre. Méthode testée, accompagnement réel.",
  highlights: [
    { icon: "🎯", title: "Stratégie de contenu", text: "Trouve ton angle unique, construis ton univers et ta ligne éditoriale." },
    { icon: "🎬", title: "Production vidéo", text: "Tournage, montage, miniatures, sound design : la chaîne complète." },
    { icon: "📈", title: "Croissance & SEO", text: "Algorithmes YouTube, TikTok, Instagram — comprends et exploite." },
    { icon: "💬", title: "Communauté", text: "Construis et anime ton Discord, fidélise ton audience sur la durée." },
    { icon: "💼", title: "Monétisation", text: "Sponsoring, AdSense, Patreon, prestations — diversifie tes revenus." },
    { icon: "🧪", title: "Accompagnement", text: "Sessions live, retours personnalisés, communauté privée d'élèves." },
  ],
  modules: [
    "Module 1 — Trouver ton positionnement unique",
    "Module 2 — Maîtriser les outils de production",
    "Module 3 — Storytelling et écriture pour la vidéo",
    "Module 4 — Algorithmes & growth multi-plateformes",
    "Module 5 — Construire et animer une communauté",
    "Module 6 — Monétiser sans perdre l'authenticité",
    "Module 7 — Cas pratiques & mises en situation",
    "Bonus — Modèles, presets et templates prêts à l'emploi",
  ],
  testimonials: [
    {
      name: "Sacha L.",
      role: "Élève promotion 2025",
      avatar: "🧒",
      quote:
        "En 4 mois j'ai dépassé les 10k abonnés. La méthode est claire, applicable, et le suivi fait toute la différence.",
    },
    {
      name: "Ondine R.",
      role: "Créatrice Pokémon TCG",
      avatar: "👧",
      quote:
        "J'ai enfin trouvé mon angle et structuré ma chaîne. Les retours en live valent l'investissement à eux seuls.",
    },
    {
      name: "Pierre F.",
      role: "Streamer Pixelmon",
      avatar: "🧑",
      quote:
        "La partie communauté m'a permis de transformer mes viewers en vrais fans. Le Discord est devenu mon hub.",
    },
  ],
  faq: [
    { q: "À qui s'adresse la formation ?", a: "Aux passionnés Pokémon qui veulent créer du contenu sérieusement, débutants ou créateurs déjà lancés qui veulent passer un cap." },
    { q: "Comment ça marche concrètement ?", a: "La formation est accessible via Patreon. Tu choisis un palier d'abonnement mensuel, et tu accèdes immédiatement aux modules, à la communauté privée et aux sessions live tant que tu es abonné(e). Sans engagement, tu peux mettre en pause à tout moment." },
    { q: "Y a-t-il un accompagnement ?", a: "Oui : sessions live régulières, Discord privé des membres Patreon, retours personnalisés sur tes contenus selon le palier." },
    { q: "Quels sont les paliers Patreon ?", a: "Plusieurs niveaux d'abonnement mensuels, à partir de quelques euros par mois. Chaque palier débloque des bonus supplémentaires (sessions privées, retours sur tes vidéos, accès anticipé aux contenus). Détails sur la page Patreon." },
    { q: "Est-ce que je peux vraiment en vivre ?", a: "Plusieurs membres ont franchi le seuil. Ça demande du travail, mais la méthode est conçue pour viser cet objectif." },
  ],
  ctaUrl: "https://patreon.com/LesArchivesduProfesseurChen?utm_medium=unknown&utm_source=join_link&utm_campaign=creatorshare_creator&utm_content=copyLink",
};

export const navLinks = [
  { to: "/", label: "Accueil" },
  { to: "/formation", label: "Formation" },
  { to: "/minecraft", label: "Minecraft" },
  { to: "/discord", label: "Discord" },
  { to: "/reseaux", label: "Réseaux" },
  { to: "/contact", label: "Contact" },
];

export const news = [
  {
    date: "2026-05-20",
    tag: "Patreon",
    title: "La formation est disponible sur Patreon",
    excerpt:
      "Rejoins les Archives sur Patreon pour accéder aux modules, à la communauté privée et aux sessions live exclusives.",
  },
  {
    date: "2026-05-10",
    tag: "Minecraft",
    title: "Nouvelle région débloquée sur L'Académie",
    excerpt:
      "Une région inspirée de Sinnoh ouvre ses portes, avec quêtes, arènes et Pokémon exclusifs.",
  },
  {
    date: "2026-05-02",
    tag: "YouTube",
    title: "Nouvelle série : Pokédex d'un débutant",
    excerpt:
      "Une série pédagogique pour découvrir l'univers Pokémon, conçue avec les abonnés du Discord.",
  },
];
