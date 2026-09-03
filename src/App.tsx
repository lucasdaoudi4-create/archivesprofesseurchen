import { Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/layout/Layout";
import Home from "./pages/Home";
import Formation from "./pages/Formation";
import Discord from "./pages/Discord";
import Minecraft from "./pages/Minecraft";
import Socials from "./pages/Socials";
import Contact from "./pages/Contact";
import LegalPage from "./pages/LegalPage";
import NotFound from "./pages/NotFound";

/* ═══════════════════════════════════════════════════════════════════════════
   LE ROUTEUR — socle § 0.27 · Plan de site, routes, slugs, redirections
   Les Archives du Professeur Chen — charte v1.0.0

   Les dix routes existantes sont conservées telles quelles : le § 0.27 pose
   qu'« aucune route n'est supprimée sans redirection », et aucune ne l'est
   ici.

   ── DEUX ROUTES QUE LE PLAN DE SITE EXIGE ET QUI N'EXISTENT PAS ENCORE ────

   La maquette dessine deux vues complètes qui n'ont aucune page React en
   face, et le § 0.27 les déclare toutes deux publiques et indexées :

     `/laboratoire/paliers`   ← maquette `#v-paliers` (l. 976-1142)
     `/formation/module-01`   ← maquette `#v-module`  (l. 950-974)

   La barre de navigation et le pied de page pointent DÉJÀ vers la première
   (entrée « Paliers », bouton « Rejoindre », colonne « Le lieu ») : c'est
   l'état de sortie de la migration, et la maquette ne connaît pas d'autre
   cible pour ces trois liens.

   ── CE QUE LA RECETTE A DÛ TRANCHER ──────────────────────────────────────

   Sans route en face, ces liens tombaient sur `NotFound` : le bouton
   « Rejoindre » de la barre — l'appel à l'action principal, présent sur les
   dix pages — renvoyait le visiteur sur une page introuvable. Ce n'est pas
   livrable, et la recette ne peut pas inventer deux pages.

   Les deux vues manquantes n'ont PAS de contenu manquant : `/formation`
   rend déjà, dans cet ordre, la notice du Module 01 avec son sommaire en
   huit chapitres (`SommaireModule`, ancre `#sommaire`) PUIS les trois
   paliers avec leur comparatif (`CartePalier`, `ComparatifPaliers`, ancre
   `#titre-paliers`). Les deux routes sont donc RENVOYÉES sur `/formation`,
   en attendant leurs pages propres.

   Le renvoi est TEMPORAIRE et se lit comme tel — `302` côté Netlify, jamais
   `301` : le § 0.27 déclare `/laboratoire/paliers` publique ET indexée, un
   permanent poisonnerait l'index et les caches le jour où la page existe.

   Aucune ancre n'est visée dans le `to` : `Layout.tsx` remonte en haut à
   chaque changement de chemin (§ 0.28, règle 4), un `#titre-paliers` serait
   donc annulé une image plus tard. Le visiteur arrive en haut de
   `/formation`, qui ouvre sur le module puis descend sur les paliers.

   À FAIRE dès que les deux pages existent — remplacer les deux renvois par :

     <Route path="/laboratoire/paliers" element={<Paliers />} />
     <Route path="/formation/module-01" element={<Module01 />} />

   et retirer les deux `302` de `netlify.toml` (le `301` de `/paliers`, lui,
   reste : c'est celui que le § 0.27 impose depuis l'existant).

   ── POURQUOI LES RENVOIS SONT ÉCRITS DEUX FOIS ───────────────────────────

   `netlify.toml` ne voit que les chargements de page complets. Une
   navigation interne (`<Link>`) ne sort jamais sur le réseau : elle est
   résolue ici, par le routeur. Sans les `<Navigate>` ci-dessous, le bouton
   « Rejoindre » retomberait sur `NotFound` en navigation interne, alors
   même que l'URL collée dans la barre d'adresse, elle, marcherait.

   ── LA PAGE INTROUVABLE A UN SLUG, EN PLUS DE L'ATTRAPE-TOUT ─────────────

   Le § 0.27 lui donne l'adresse `/404`. La route nommée est ajoutée à côté
   de `path="*"` pour que `netlify.toml` puisse la servir avec un vrai
   statut HTTP 404 : aujourd'hui le site répond 200 sur toute URL inconnue,
   ce qui fait indexer des pages fantômes malgré le `noindex` de la page.
   ═══════════════════════════════════════════════════════════════════════════ */

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/formation" element={<Formation />} />

        {/* Renvois temporaires — voir la note ci-dessus. Le doublon avec
            `netlify.toml` est voulu : ici pour la navigation interne, là
            pour les chargements de page complets. */}
        <Route
          path="/laboratoire/paliers"
          element={<Navigate to="/formation" replace />}
        />
        <Route
          path="/formation/module-01"
          element={<Navigate to="/formation" replace />}
        />
        {/* Le 301 du § 0.27 depuis l'existant. */}
        <Route
          path="/paliers"
          element={<Navigate to="/laboratoire/paliers" replace />}
        />

        <Route path="/discord" element={<Discord />} />
        <Route path="/minecraft" element={<Minecraft />} />
        <Route path="/reseaux" element={<Socials />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/mentions-legales" element={<LegalPage kind="mentions" />} />
        <Route path="/cgv" element={<LegalPage kind="cgv" />} />
        <Route path="/confidentialite" element={<LegalPage kind="confidentialite" />} />
        <Route path="/404" element={<NotFound />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}
