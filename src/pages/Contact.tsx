import { useEffect, useRef, useState } from "react";
import type { FormEvent } from "react";
import { Link } from "react-router-dom";
import { accueil, contact, discord, meta, routes, site } from "../data/site";
import { Icone } from "../components/ui/Icones";
import { useRevelation } from "../hooks/useRevelation";

/* ═══════════════════════════════════════════════════════════════════════════
   ME JOINDRE — route `/contact` · maquette `#v-contact` (l. 1223-1243)
   Les Archives du Professeur Chen — charte v1.0.0, lot L4

   La page réunit deux surfaces de la maquette validée :
     · le panneau gauche du bloc `#b-contact` de l'accueil (l. 862-877) —
       le titre « Une question avant de vous lancer ? », la liste des trois
       motifs et le renvoi vers le Discord ;
     · la vue `#v-contact` elle-même — la tête « Écrivez-moi » et le
       formulaire en `.champ`.
   Les deux `.carte` du panneau droit de l'accueil (l. 878-889) suivent,
   en `.cartes` : sur une colonne de 880 px, deux cartes valent mieux qu'une
   carte coupée d'un `<hr>` en style en dur.

   ── UN SEUL `h1`, ET IL N'EST PAS CELUI DE LA MAQUETTE ────────────────────
   La maquette est un SPA à vues : elle ouvre toutes ses vues internes sur un
   `<h2 class="h2">`, le seul `h1` du document étant celui du hero. Avec une
   route par page, la page porte son propre `h1` — et `.h2` reste ce qu'elle
   est, une classe TYPOGRAPHIQUE, pas un niveau. D'où `<h1 class="h2">`, puis
   deux `<h2 class="h3 sous">` qui découpent la colonne sans saut de niveau.

   `.sous` pose son filet par `border-block-start`, et l'annule sur
   `:first-of-type`. Les deux `h2` sont donc des enfants DIRECTS de la
   colonne : enfermés chacun dans son `<div>`, chacun redeviendrait
   « premier de son type » et perdrait le filet qui les sépare.

   ── LE CONTRAT NETLIFY, INTÉGRALEMENT PRÉSERVÉ ────────────────────────────
   `index.html` déclare le formulaire caché qui sert de contrat à Netlify :

       <form name="contact" data-netlify="true" netlify-honeypot="bot-field" hidden>
         subject · name · email · object · message · bot-field

   Six champs. Tout ce qui suit doit donc rester identique, sinon les
   soumissions cassent en production sans erreur visible :
     · le nom exact du formulaire — `contact` ;
     · `<input type="hidden" name="form-name" value="contact">` ;
     · `data-netlify` et `data-netlify-honeypot="bot-field"` ;
     · le honeypot `bot-field`, dans un conteneur masqué ;
     · le `POST` vers `/` en `application/x-www-form-urlencoded` ;
     · les SIX noms de champ, tous envoyés.

   La maquette n'en dessine que trois (nom, adresse, message). Passer à trois
   imposerait de réécrire `index.html` dans le même lot ; ce fichier n'en est
   pas propriétaire. Les six sont donc tenus : `subject` devient un `<select>`
   dans un `.champ` — les cinq boutons à pictogrammes de l'ancienne page
   disparaissent avec `Pictogram` —, `object` reste une ligne de texte.

   La case de consentement ne porte PAS de `name` : elle n'est pas déclarée
   au contrat, et un champ non déclaré n'est pas enregistré. Elle reste une
   condition de validation côté navigateur, comme dans la page d'origine.

   ── CE QUE LE § 0.36 RETIRE DE CETTE PAGE ─────────────────────────────────
   Le délai de réponse annoncé — « ~ 48h », « en moins de 48 heures » — sort
   sans remplacement : aucune source ne le mesure. La carte « Presse /
   partenariats » et sa promesse de priorité sortent pour la même raison.
   Le tutoiement de l'ancienne page (« Raconte-nous tout… », « on revient
   vers toi ») est remplacé par le vouvoiement de la charte.

   ── L'ADRESSE DE REPLI ────────────────────────────────────────────────────
   L'ancienne page écrivait `contact@archivesprofesseurchen.com` en dur, deux
   fois. `site.ts` déclare `contact.email = null` et range le champ au
   registre `CONTRAT_OUVERT` : « adresse de contact publique, à fournir ». Le
   repli d'erreur est donc CONDITIONNEL — l'adresse dès qu'elle existe dans
   `site.ts`, le Discord tant qu'elle n'existe pas. Le mécanisme survit,
   aucune adresse n'est réécrite ici.
   ═══════════════════════════════════════════════════════════════════════════ */

/* ── Métadonnées de page — socle § 0.29 ──────────────────────────────────────
   Le site n'a aucun mécanisme de titre par page : `index.html` porte un
   `<title>` unique. Or `Layout.tsx` (§ 0.28) ANNONCE `document.title` au
   changement de route, et lit donc ce que la page a posé. Les effets d'un
   enfant s'exécutent avant ceux de son parent : l'effet ci-dessous a écrit
   le titre quand la coquille vient le lire.                                */

const TITRE = `${meta.contact.titre} · ${site.name}`;
const CANONIQUE = `${site.url}${routes.contact}`;

function poseMeta(attribut: "name" | "property", cle: string, valeur: string) {
  const selecteur = `meta[${attribut}="${cle}"]`;
  let balise = document.head.querySelector<HTMLMetaElement>(selecteur);
  if (!balise) {
    balise = document.createElement("meta");
    balise.setAttribute(attribut, cle);
    document.head.appendChild(balise);
  }
  balise.setAttribute("content", valeur);
}

function poseCanonique(href: string) {
  let balise = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
  if (!balise) {
    balise = document.createElement("link");
    balise.setAttribute("rel", "canonical");
    document.head.appendChild(balise);
  }
  balise.setAttribute("href", href);
}

/* La page est indexée (§ 0.27). On retire donc le `robots` qu'une page
   non indexée — la page introuvable — aurait pu laisser derrière elle. */
function poseIndexation(indexee: boolean) {
  const balise = document.head.querySelector<HTMLMetaElement>('meta[name="robots"]');
  if (indexee) {
    balise?.remove();
    return;
  }
  poseMeta("name", "robots", "noindex, nofollow");
}

/* ── Révélation au défilement — `src/hooks/useRevelation.ts` ────────────────
   Les blocs portent `data-rv`, et JAMAIS la classe de révélation en dur : la
   feuille de mouvement veut que le masque soit posé par le JavaScript, et par
   lui seul. C'est ce qui a mis cette page en défaut. Le formulaire portait
   cette classe dans son `className`, ce qui écrivait le masque
   en dur ; l'observateur, monté une seule fois au montage de la route, ne
   voyait pas le formulaire REVENIR après le message de confirmation. Le
   formulaire renaissait donc masqué, et plus personne ne posait `.on` : il
   devenait définitivement invisible.

   Deux verrous le rendent impossible aujourd'hui. Le formulaire ne porte plus
   que `data-rv` : s'il n'est pris en charge par personne, il est simplement
   VISIBLE. Et le crochet suit désormais les arrivées de nœuds, donc il le
   reprend et le révèle sur place.                                          */

/* ── Le formulaire ──────────────────────────────────────────────────────── */

const NOM_FORMULAIRE = "contact";

type Etat = "repos" | "envoi" | "envoye" | "echec";

/* `site.ts` ne déclare que trois intitulés de champ — ceux de la maquette.
   Les deux suivants n'y sont pas parce que la maquette ne les dessine pas ;
   le contrat Netlify, lui, les exige. Ils restent donc ici, et ici seulement. */
const LIBELLE_MOTIF = "Le motif de votre message";
const LIBELLE_OBJET = "L’objet, en une ligne";
const MOTIF_VIDE = "Choisissez un motif";
const MOTIF_AUTRE = "Un autre motif";

/* L'intitulé du message de confirmation. Il sert DEUX fois — à l'écran, et
   dans la région vive qui l'annonce — et c'est bien la même phrase : la
   région ne doit rien dire d'autre que ce que le lecteur voit. */
const TITRE_CONFIRMATION = "Message envoyé";

const MOTIFS = [...contact.motifs, MOTIF_AUTRE];

function encodeForm(donnees: Record<string, string>): string {
  return Object.entries(donnees)
    .map(([cle, valeur]) => encodeURIComponent(cle) + "=" + encodeURIComponent(valeur))
    .join("&");
}

export default function Contact() {
  useRevelation();
  const [etat, setEtat] = useState<Etat>("repos");
  const [detail, setDetail] = useState("");

  /* Le texte de la région vive. Il reste VIDE tant qu'il n'y a rien à dire :
     la région, elle, est rendue en permanence — voir plus bas. */
  const [annonce, setAnnonce] = useState("");
  const confirmation = useRef<HTMLDivElement>(null);

  /* ── Ce que devient le focus après l'envoi — socle § 0.28 ────────────────
     Le formulaire disparaît, et avec lui le bouton qui portait le focus :
     sans rien, le focus retombe sur `<body>` et le lecteur d'écran est
     renvoyé en tête de document, loin de la réponse qu'il attendait. Il est
     donc posé sur le conteneur du message, `tabIndex={-1}`, exactement comme
     le § 0.28 le fait pour `<main>` au changement de route.

     L'annonce passe, elle, par la région `role="status"` — et seulement une
     fois le message rendu : une région vive insérée dans le DOM en même
     temps que son texte n'est pas annoncée de façon fiable.              */
  useEffect(() => {
    if (etat !== "envoye") {
      setAnnonce("");
      return;
    }
    confirmation.current?.focus();
    setAnnonce(TITRE_CONFIRMATION);
  }, [etat]);

  useEffect(() => {
    document.title = TITRE;
    poseMeta("name", "description", meta.contact.description);
    poseMeta("property", "og:title", TITRE);
    poseMeta("property", "og:description", meta.contact.description);
    poseMeta("property", "og:url", CANONIQUE);
    poseCanonique(CANONIQUE);
    poseIndexation(meta.contact.indexee);
  }, []);

  const envoyer = async (evenement: FormEvent<HTMLFormElement>) => {
    evenement.preventDefault();

    // Capturé AVANT le premier `await` : React remet `currentTarget` à null
    // dès que le gestionnaire a rendu la main.
    const formulaire = evenement.currentTarget;

    setEtat("envoi");
    setDetail("");

    const donnees = new FormData(formulaire);
    const charge: Record<string, string> = { "form-name": NOM_FORMULAIRE };
    donnees.forEach((valeur, cle) => {
      if (typeof valeur === "string") charge[cle] = valeur;
    });

    try {
      const reponse = await fetch("/", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: encodeForm(charge),
      });
      if (!reponse.ok) throw new Error(`HTTP ${reponse.status}`);
      formulaire.reset();
      setEtat("envoye");
    } catch (erreur) {
      setEtat("echec");
      setDetail(erreur instanceof Error ? erreur.message : "");
    }
  };

  return (
    <section className="bande">
      <div className="wrap wrap--etroit">

        {/* ── Tête de page ────────────────────────────────────────────── */}
        <div className="tete" data-rv>
          <p className="eyebrow">{contact.surtitre}</p>
          <h1 className="h2">{contact.titre}</h1>
          <p className="lede">{contact.lede}</p>
        </div>

        {/* ── Ce qui vaut la peine d'être écrit ───────────────────────── */}
        <h2 className="h3 sous" data-rv>
          {accueil.contact.titre}
        </h2>

        {/* `accueil.contact.lede` n'est PAS repris ici : à un mot près, c'est
            déjà `contact.lede`, posé quatre lignes plus haut dans la tête. */}
        <ul className="liste" data-rv>
          {contact.motifs.map((motif) => (
            <li key={motif}>
              <Icone nom="coche" taille={16} ton="action" />
              <span>{motif}</span>
            </li>
          ))}
        </ul>

        <div className="hero__b" data-rv>
          <a
            className="btn btn--fantome"
            href={discord.inviteUrl}
            target="_blank"
            rel="noopener"
          >
            {contact.ctaDiscord} <span className="btn__f" aria-hidden="true">→</span>
          </a>
        </div>

        {/* ── Les deux repères du panneau droit de l'accueil ──────────── */}
        <div className="cartes mt-[var(--rythme-xs)]" data-rv>
          {contact.cartes.map((carte) => (
            <div className="carte" key={carte.titre}>
              <h3 className="carte-titre">{carte.titre}</h3>
              <p className="carte__d mt-[var(--sp-2)]">{carte.texte}</p>
            </div>
          ))}
        </div>

        {/* ── Le formulaire ──────────────────────────────────────────── */}
        <h2 className="h3 sous" data-rv>
          {contact.ctaEcrire}
        </h2>

        {/* La région vive, RENDUE EN PERMANENCE et hors du ternaire : c'est
            la condition pour qu'elle soit annoncée. Elle reste vide tant
            qu'il n'y a rien à dire. */}
        <p className="sr-only" role="status">
          {annonce}
        </p>

        {etat === "envoye" ? (
          <div className="encart" ref={confirmation} tabIndex={-1}>
            <p className="encart__t">{TITRE_CONFIRMATION}</p>
            <p className="corps">
              Il est bien arrivé. Je vous réponds moi-même, à l’adresse que vous venez
              d’indiquer.
            </p>
            <div className="hero__b">
              <button
                type="button"
                className="btn btn--fantome"
                onClick={() => setEtat("repos")}
              >
                {contact.ctaEcrire} <span className="btn__f" aria-hidden="true">→</span>
              </button>
            </div>
          </div>
        ) : (
          <form
            name={NOM_FORMULAIRE}
            method="POST"
            onSubmit={envoyer}
            data-netlify="true"
            data-netlify-honeypot="bot-field"
            aria-describedby="c-necessaires"
            data-rv
          >
            {/* Contrat Netlify — ne pas retirer, ne pas renommer. */}
            <input type="hidden" name="form-name" value={NOM_FORMULAIRE} />
            <p className="hidden">
              <label>
                Ne pas remplir :{" "}
                <input name="bot-field" tabIndex={-1} autoComplete="off" />
              </label>
            </p>

            {/* `.meta` est hors du `p:not(…)` de 20-base.css : il n'hérite
                d'aucune marge basse, elle est posée ici. */}
            <p className="meta mb-[var(--sp-6)]" id="c-necessaires">
              Tous les champs sont nécessaires.
            </p>

            <div className="champ">
              <label htmlFor="c-motif">{LIBELLE_MOTIF}</label>
              <select id="c-motif" name="subject" required defaultValue="">
                <option value="" disabled>
                  {MOTIF_VIDE}
                </option>
                {MOTIFS.map((motif) => (
                  <option key={motif} value={motif}>
                    {motif}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid gap-[var(--gap-3)] planche:grid-cols-2">
              <div className="champ">
                <label htmlFor="c-nom">{contact.champs.nom}</label>
                <input id="c-nom" name="name" type="text" autoComplete="name" required />
              </div>
              <div className="champ">
                <label htmlFor="c-mail">{contact.champs.email}</label>
                <input
                  id="c-mail"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                />
              </div>
            </div>

            <div className="champ">
              <label htmlFor="c-objet">{LIBELLE_OBJET}</label>
              <input id="c-objet" name="object" type="text" required />
            </div>

            <div className="champ">
              <label htmlFor="c-msg">{contact.champs.message}</label>
              <textarea id="c-msg" name="message" required />
            </div>

            {/* Sans `name` : le champ n'est pas déclaré au contrat Netlify,
                il ne part donc pas. C'est une condition de validation, pas
                une donnée à conserver. */}
            <label className="flex items-start gap-[var(--sp-3)]">
              <input
                type="checkbox"
                required
                className="mt-[var(--sp-2)] h-5 w-5 shrink-0 accent-[var(--accent)]"
              />
              {/* `.corps`, et non `.corps-s` : le soulignement des liens (CMP — 44)
                  n'est déclaré que sur `.corps a`, `.lede a` et `.prose a`. Sous
                  `.corps-s`, le lien ne serait plus qu'une couleur (SC 1.4.1). */}
              <span className="corps t-secondaire">
                J’accepte que ces informations servent à me répondre, dans les conditions
                décrites par la{" "}
                <Link to={routes.confidentialite}>politique de confidentialité</Link>.
              </span>
            </label>

            {etat === "echec" && (
              <div className="encart mt-[var(--sp-6)]" role="alert">
                <p className="encart__t">L’envoi a échoué</p>
                <p className="corps">
                  Le message n’est pas parti{detail ? ` (${detail})` : ""}. Réessayez dans
                  un instant,{" "}
                  {contact.email ? (
                    <>
                      ou écrivez directement à{" "}
                      <a href={`mailto:${contact.email}`}>{contact.email}</a>.
                    </>
                  ) : (
                    <>
                      ou passez par{" "}
                      <a
                        className="lien-externe"
                        href={discord.inviteUrl}
                        target="_blank"
                        rel="noopener"
                      >
                        {discord.nom}
                      </a>
                      .
                    </>
                  )}
                </p>
              </div>
            )}

            <div className="hero__b">
              <button className="btn" type="submit" disabled={etat === "envoi"}>
                {etat === "envoi" ? "Envoi en cours…" : contact.champs.envoyer}{" "}
                <span className="btn__f" aria-hidden="true">→</span>
              </button>
            </div>
          </form>
        )}

      </div>
    </section>
  );
}
