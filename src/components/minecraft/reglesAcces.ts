import { minecraft } from "../../data/site";

/* ═══════════════════════════════════════════════════════════════════════════
   LES TROIS LIGNES D’ACCÈS AU SERVEUR — `.invitation__r` · ARC · CMP — 47

   Le socle § 0.25 termine le bandeau d’invitation par « les règles du
   serveur en trois lignes au plus ». L’audit a relevé que /minecraft ne
   disait plus NI comment se connecter, NI que le mod Cobblemon est requis :
   ces trois lignes sont la réparation de ce manque, et elles sont montées
   sur les deux pages qui mènent au serveur (/minecraft et /discord).

   TROIS LIGNES, PAS QUATRE. `.invitation__r` ne tronque rien — le
   commentaire de la section 24 est explicite : « On ne tronque pas une
   règle de serveur : on en écrit trois. » Toute ligne ajoutée ici est
   un défaut, pas une amélioration.

   AUCUNE VALEUR N’EST RECOPIÉE : l’édition, la version, le mod et l’adresse
   sont lus dans `src/data/site.ts`, la source de contenu unique. Si l’un
   d’eux change là-bas, ces lignes suivent. Ne remplacez jamais l’une de ces
   interpolations par la chaîne qu’elle rend aujourd’hui.

   CE QUI RESTE À DÉPLACER — voir « À signaler » du lot : les mots de
   liaison (« Mod … requis », « Multijoueur › Ajouter un serveur ») sont de
   la copie, et toute copie doit à terme vivre dans `src/data/site.ts`. Le
   champ à ouvrir est `minecraft.regles: string[]` ; ce fichier disparaîtra
   le jour où il existera. Il est ici et nulle part ailleurs en attendant.

   Le signe « › » fait partie des six signes admis par le § 6.1, règle 8
   (→ · — ↺ › ×) : il n’y a pas de flèche ni d’émoji dans ces lignes.
   ═══════════════════════════════════════════════════════════════════════════ */

export const reglesAcces: readonly string[] = [
  `Minecraft ${minecraft.edition} · version ${minecraft.version}`,
  `Mod ${minecraft.mod} requis`,
  `Multijoueur › Ajouter un serveur › ${minecraft.ip}`,
];
