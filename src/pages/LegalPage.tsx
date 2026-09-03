import { useEffect, type ReactNode } from "react";
import { Link } from "react-router-dom";
import {
  site,
  routes,
  meta,
  legal,
  contact,
  patreon,
  paliers,
  paliersPayants,
  sas,
  minecraft,
  discord,
  type RouteKey,
} from "../data/site";

/* ═══════════════════════════════════════════════════════════════════════════
   LES TROIS PAGES LÉGALES — `/mentions-legales` · `/cgv` · `/confidentialite`
   Les Archives du Professeur Chen — charte v1.0.0

   Gabarit « Légal » du socle § 0.27 : `.wrap--etroit`, public, INDEXÉ.
   Contenu exigé par le § 0.32 (politique de sécurité, inventaire des
   traceurs, sous-traitants et transferts, durées de conservation).

   ── AUCUNE SECTION DE MAQUETTE ────────────────────────────────────────────

   La maquette ne dessine pas ces pages : ses quatre liens de pied pointent
   tous sur `#contact` (l. 1300-1305), ce sont des marque-places. Le gabarit
   est donc composé des seuls composants déjà déclarés dans `src/styles/` :

       section.bande > .wrap.wrap--etroit
         .tete        → .eyebrow + h1.h2 + .lede
         .encart      → l'avertissement d'incomplétude (voir plus bas)
         .prose       → n × ( h2.h3.sous + corps ) + .tableau
         .meta        → la date de dernière mise à jour

   Deux substitutions par rapport au plan de lot, imposées par le CSS réel
   du dépôt, qui a renommé deux classes de la maquette (§ 0.12) :
       `.affilie` → `.meta`     (déclaration identique au caractère près)
       `.tabl`    → `.tableau`  (ARC · CMP — 40)

   ── CE QUI N'EST PAS INVENTÉ ──────────────────────────────────────────────

   Le § 0.32 est catégorique : « Aucune mise en ligne tant que les pages
   légales restent des espaces réservés : éditeur, statut juridique, adresse,
   SIRET, directeur de la publication, hébergeur, tarifs, droit de
   rétractation, durées de conservation. La charte ne les invente pas ; elle
   interdit de publier sans. »

   Ce fichier écrit donc la STRUCTURE complète et exacte, et pose à chaque
   trou un `<AComplet>` — la pastille `.etat` « À compléter » suivie de ce
   qu'il faut y mettre. Les faits qui EXISTENT sont lus dans `src/data/site.ts`
   (`legal.pages.*`, `paliers`, `patreon`, `contact`, `minecraft`, `discord`,
   `sas`) et jamais recopiés ici.

   La marque employée est « À compléter », et jamais l'un des deux jetons
   d'outillage que la porte 1 du § 10.18 traque en clair dans `src/` : cette
   porte refuse la construction s'ils y traînent, et le § 10.17 interdit qu'un
   jeton d'outillage s'affiche à un lecteur. « À compléter » est une phrase de
   la page, écrite pour être lue — pas un marqueur de relevé.

   ── L'ENCART QUI DOIT DISPARAÎTRE ─────────────────────────────────────────

   L'ancien encart « Page à compléter avec ton avocat » tutoyait et n'était
   pas exécutoire. Celui qui le remplace vouvoie, dit exactement ce qui
   manque, et dit qu'il doit disparaître. Il tombe de lui-même quand les
   trois pages sont renseignées : son affichage est piloté par le nombre de
   trous restants, pas par une décision manuelle.

   ── POURQUOI PAS DE `.rv` ICI ─────────────────────────────────────────────

   Le plan de lot liste `.rv` parmi les composants de la page. Il n'est pas
   employé, pour trois raisons cumulées :
     1. `99-preferences.css` ne remet PAS `.rv` à `opacity:1` dans son bloc
        `@media print` — un bloc non révélé s'imprime blanc. Une page légale
        est la surface du site qu'on imprime ;
     2. `.entree-page`, posée par `Layout.tsx` sur `<main>` à chaque route
        (§ 0.28), anime déjà l'arrivée ; une seconde apparition ferait
        doublon sur une page qui n'a qu'un bloc au-dessus de la ligne de
        flottaison ;
     3. `04-tokens-motion.css` pose la règle en toutes lettres : « Le contenu
        est visible sans JavaScript : c'est la classe .rv qui masque, et elle
        n'est posée que si l'observateur existe. » Sur une page dont la
        lisibilité est une obligation légale, on ne masque pas.

   ── MÉTADONNÉES (§ 0.29) ──────────────────────────────────────────────────

   Le site n'a aucun mécanisme de titre par page et `Layout.tsx` LIT
   `document.title` pour son annonce `aria-live` (§ 0.28). La page le pose
   donc elle-même, avec sa description, son `canonical` et ses deux balises
   Open Graph. Les trois routes sont indexées : aucune balise `robots`.
   ═══════════════════════════════════════════════════════════════════════════ */

/** Les trois valeurs sont celles que `App.tsx` passe déjà : elles ne bougent pas. */
type Kind = "mentions" | "cgv" | "confidentialite";

/** Chaque variante lit sa fiche de métadonnées dans `meta` (§ 0.29). */
const CLE_META: Record<Kind, RouteKey> = {
  mentions: "mentionsLegales",
  cgv: "cgv",
  confidentialite: "confidentialite",
};

const PAGES: { kind: Kind; to: string; libelle: string }[] = [
  { kind: "mentions", to: routes.mentionsLegales, libelle: "Mentions légales" },
  { kind: "cgv", to: routes.cgv, libelle: "Conditions de vente" },
  { kind: "confidentialite", to: routes.confidentialite, libelle: "Confidentialité" },
];

/* ── Les faits disponibles, lus une fois ─────────────────────────────────── */

const IDENTITE = legal.pages.mentionsLegales;
const EMAIL_PUBLIC = IDENTITE.emailContact ?? contact.email;

/* ═════════════════════════ OUTILS D'ÉCRITURE ═════════════════════════════ */

/**
 * Un trou dans la page : une valeur que seul l'éditeur peut fournir.
 * La pastille est `.etat` sans modificateur — l'objet d'état partagé du
 * § 0.12, compensé par `99-preferences.css` en couleurs forcées. Le MOT
 * porte l'état, jamais la couleur seule (SC 1.4.1).
 */
function AComplet({ quoi }: { quoi: string }) {
  return (
    <>
      <span className="etat">À compléter</span>{" "}
      <span className="t-tertiaire">— {quoi}</span>
    </>
  );
}

type Fait = { terme: string; valeur: ReactNode };

/** Un relevé de faits. `<dl>` plutôt qu'un tableau : ce sont des paires. */
function Releve({ faits }: { faits: Fait[] }) {
  return (
    <dl className="grid gap-4 mt-6">
      {faits.map((f) => (
        <div key={f.terme}>
          <dt className="label">{f.terme}</dt>
          <dd className="mt-1">{f.valeur}</dd>
        </div>
      ))}
    </dl>
  );
}

/** Un lien sortant : `rel` complet et signe de sortie (§ 0.22). */
function LienSortant({ href, children }: { href: string; children: ReactNode }) {
  return (
    <a className="lien-externe" href={href} target="_blank" rel="noopener noreferrer">
      {children}
    </a>
  );
}

/**
 * Un tableau de relevé. `.tableau` porte `overflow-x:auto` : le conteneur
 * défilant doit être atteignable au clavier, d'où `tabIndex` et le rôle de
 * région nommée (WCAG 2.1.1).
 */
function Tableau({ legende, children }: { legende: string; children: ReactNode }) {
  return (
    <div className="tableau" role="region" aria-label={legende} tabIndex={0}>
      <table>
        <caption className="sr-only">{legende}</caption>
        {children}
      </table>
    </div>
  );
}

/* ═════════════════════════ MÉTADONNÉES DE PAGE ═══════════════════════════ */

function poserMetaNom(nom: string, contenu: string) {
  let balise = document.head.querySelector<HTMLMetaElement>(`meta[name="${nom}"]`);
  if (!balise) {
    balise = document.createElement("meta");
    balise.setAttribute("name", nom);
    document.head.appendChild(balise);
  }
  balise.setAttribute("content", contenu);
}

function poserMetaPropriete(propriete: string, contenu: string) {
  let balise = document.head.querySelector<HTMLMetaElement>(
    `meta[property="${propriete}"]`,
  );
  if (!balise) {
    balise = document.createElement("meta");
    balise.setAttribute("property", propriete);
    document.head.appendChild(balise);
  }
  balise.setAttribute("content", contenu);
}

function poserCanonical(href: string) {
  let balise = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
  if (!balise) {
    balise = document.createElement("link");
    balise.setAttribute("rel", "canonical");
    document.head.appendChild(balise);
  }
  balise.setAttribute("href", href);
}

/**
 * Pose le titre AVANT que `Layout.tsx` ne le lise : les effets d'un enfant
 * s'exécutent avant ceux de son parent (§ 0.28, règle 2).
 */
function useMetaPage(cle: RouteKey) {
  useEffect(() => {
    const fiche = meta[cle];
    const titre = `${fiche.titre} · ${site.name}`;
    document.title = titre;
    poserMetaNom("description", fiche.description);
    poserMetaPropriete("og:title", titre);
    poserMetaPropriete("og:description", fiche.description);
    poserCanonical(`${site.url}${routes[cle]}`);
  }, [cle]);
}

/* ═════════════════════════ 1 · MENTIONS LÉGALES ══════════════════════════ */

function MentionsLegales() {
  return (
    <>
      <h2 className="h3 sous">L’éditeur du site</h2>
      <p>
        Le site {site.domain} est édité par {IDENTITE.editeur}.
      </p>
      <Releve
        faits={[
          { terme: "Raison sociale", valeur: IDENTITE.editeur },
          {
            terme: "Forme juridique",
            valeur:
              IDENTITE.formeJuridique ??
              (
                <AComplet quoi="forme juridique de l’éditeur (entreprise individuelle, SASU, SARL ou autre)." />
              ),
          },
          {
            terme: "Capital social",
            valeur: (
              <AComplet quoi="montant du capital social, lorsque la forme juridique en comporte un." />
            ),
          },
          {
            terme: "Siège social",
            valeur:
              IDENTITE.adresse ??
              <AComplet quoi="adresse postale complète du siège de l’éditeur." />,
          },
          {
            terme: "Immatriculation",
            valeur:
              IDENTITE.siret ??
              (
                <AComplet quoi="numéro SIRET, et ville du greffe d’immatriculation au registre du commerce et des sociétés." />
              ),
          },
          {
            terme: "TVA intracommunautaire",
            valeur: (
              <AComplet quoi="numéro de TVA intracommunautaire, ou mention de la franchise en base de TVA." />
            ),
          },
          {
            terme: "Adresse électronique",
            valeur: EMAIL_PUBLIC ?? (
              <AComplet quoi="adresse électronique de contact, affichée publiquement." />
            ),
          },
          {
            terme: "Téléphone",
            valeur: (
              <AComplet quoi="numéro de téléphone, exigé de tout éditeur professionnel par l’article 19 de la LCEN." />
            ),
          },
        ]}
      />

      <h2 className="h3 sous">Le directeur de la publication</h2>
      <p>
        Le directeur de la publication répond du contenu éditorial publié sur ce
        site.
      </p>
      <Releve
        faits={[
          {
            terme: "Directeur de la publication",
            valeur:
              IDENTITE.directeurPublication ??
              (
                <AComplet quoi="nom et prénom de la personne physique qui dirige la publication." />
              ),
          },
        ]}
      />

      <h2 className="h3 sous">L’hébergeur</h2>
      <p>Le site est hébergé par {IDENTITE.hebergeur}.</p>
      <Releve
        faits={[
          { terme: "Hébergeur", valeur: IDENTITE.hebergeur },
          {
            terme: "Dénomination et coordonnées",
            valeur:
              IDENTITE.hebergeurAdresse ??
              (
                <AComplet quoi="dénomination sociale exacte, adresse postale et numéro de téléphone de l’hébergeur, relevés sur son propre site." />
              ),
          },
        ]}
      />

      <h2 className="h3 sous">Me joindre</h2>
      <p>
        Le formulaire de la page Contact est la voie la plus directe. Pour une
        question courte, le Discord des Archives va souvent plus vite.
      </p>
      <ul>
        <li>
          <Link to={routes.contact}>Le formulaire de contact</Link>
        </li>
        <li>
          <LienSortant href={discord.inviteUrl}>{discord.nom}</LienSortant>
        </li>
        <li>
          Adresse électronique&nbsp;:{" "}
          {EMAIL_PUBLIC ?? (
            <AComplet quoi="adresse électronique de contact, affichée publiquement." />
          )}
        </li>
      </ul>

      <h2 className="h3 sous">Propriété intellectuelle</h2>
      <p>
        L’ensemble des contenus publiés sur ce site — textes, visuels, vidéos,
        sons, mise en page et code — est protégé par le droit d’auteur. Sauf
        mention contraire, ils sont la propriété de l’éditeur.
      </p>
      <p>
        Toute reproduction, représentation, adaptation ou diffusion, totale ou
        partielle, sur quelque support que ce soit, est soumise à l’autorisation
        écrite préalable de l’éditeur. La citation courte reste possible dans les
        conditions prévues par la loi, à la condition d’indiquer la source et le
        nom de l’auteur.
      </p>
      <p>
        Les marques, noms et logos cités appartiennent à leurs titulaires
        respectifs. Site non affilié à The Pokémon Company. Pokémon™ et les noms
        associés sont des marques de leurs ayants droit.
      </p>

      <h2 className="h3 sous">Les visuels de ce site</h2>
      <p>{legal.piedGeneration}</p>
      <p>
        Aucun décor n’est construit, aucune équipe n’est employée, aucun studio
        n’est loué&nbsp;: ce que vous voyez sur ce site est produit avec la
        chaîne d’outils que la formation enseigne. La mention complète figure au
        pied de chaque page.
      </p>

      <h2 className="h3 sous">Les liens affiliés</h2>
      <p>{legal.piedAffiliation}</p>
      <p>
        Un lien affilié est signalé avant le clic, jamais après. Il ne change
        rien au prix que vous payez.
      </p>

      <h2 className="h3 sous">Signaler un contenu</h2>
      <p>
        Si un contenu publié ici vous paraît illicite, écrivez-moi par le{" "}
        <Link to={routes.contact}>formulaire de contact</Link> en indiquant
        l’adresse exacte de la page concernée, la description des faits et les
        motifs pour lesquels le contenu devrait être retiré. Une demande précise
        est traitée plus vite qu’une demande générale.
      </p>

      <h2 className="h3 sous">Droit applicable</h2>
      <p>
        Le site et les présentes mentions sont soumis au droit français. Les
        conditions d’accès payant à la formation figurent sur la page{" "}
        <Link to={routes.cgv}>Conditions de vente</Link>&#8239;; le traitement de
        vos données personnelles est décrit sur la page{" "}
        <Link to={routes.confidentialite}>Confidentialité</Link>.
      </p>
    </>
  );
}

/* ═════════════════════════ 2 · CONDITIONS DE VENTE ═══════════════════════ */

function ConditionsDeVente() {
  return (
    <>
      <h2 className="h3 sous">Objet</h2>
      <p>
        Les présentes conditions régissent l’accès aux contenus de formation
        publiés par {IDENTITE.editeur} sous le nom {site.name}, ainsi que
        l’usage du site {site.domain}.
      </p>
      <p>
        Ce site n’encaisse aucun paiement et n’héberge aucun moyen de paiement.
        L’accès aux modules est ouvert par un abonnement souscrit sur Patreon.
      </p>

      <h2 className="h3 sous">L’éditeur et le vendeur</h2>
      <p>
        L’éditeur du site est {IDENTITE.editeur}. Son identité complète, son
        immatriculation et ses coordonnées figurent sur la page{" "}
        <Link to={routes.mentionsLegales}>Mentions légales</Link>.
      </p>
      <p>
        <AComplet quoi="répartition exacte des rôles entre l’éditeur et Patreon (vendeur, prestataire de paiement, hébergeur du contenu payant), et articulation des présentes conditions avec celles de Patreon. À faire valider par un conseil juridique avant la mise en ligne." />
      </p>

      <h2 className="h3 sous">Les paliers et leurs montants</h2>
      <p>
        Trois paliers d’abonnement ouvrent l’accès. Les montants ci-dessous sont
        ceux de la page Patreon des Archives.
      </p>
      <Tableau legende="Les trois paliers d’abonnement, leur montant mensuel et ce qu’ils ouvrent">
        <thead>
          <tr>
            <th scope="col">Palier</th>
            <th scope="col">Montant</th>
            <th scope="col">Périodicité</th>
            <th scope="col">Ce qu’il ouvre</th>
          </tr>
        </thead>
        <tbody>
          {paliersPayants.map((cle) => {
            const palier = paliers[cle];
            return (
              <tr key={cle}>
                <th scope="row">{palier.nom}</th>
                <td>
                  {palier.prix ?? (
                    <AComplet quoi="montant du palier, relevé sur la page Patreon." />
                  )}
                </td>
                <td>{palier.periodicite ?? "—"}</td>
                <td>{palier.court_texte ?? "—"}</td>
              </tr>
            );
          })}
        </tbody>
      </Tableau>
      <p className="meta mt-4">{patreon.mentionEngagement}</p>
      <p className="mt-6">
        <AComplet quoi="régime de TVA applicable, et mention « TTC » ou « HT » à porter à côté de chaque montant." />
      </p>
      <p>
        Le détail de ce que chaque palier ouvre est présenté sur la page{" "}
        <Link to={routes.paliers}>Les paliers</Link>. Les montants peuvent être
        modifiés&#8239;; une modification ne s’applique jamais rétroactivement à
        une période déjà réglée.
      </p>

      <h2 className="h3 sous">Souscription et paiement</h2>
      <p>
        La souscription se fait sur{" "}
        <LienSortant href={patreon.url}>la page Patreon des Archives</LienSortant>
        . L’encaissement, la facturation et le renouvellement sont assurés par
        Patreon, selon les conditions propres à ce service. Aucun mot de passe et
        aucun moyen de paiement ne transitent par ce site, et je n’en crée aucun.
      </p>
      <p>
        L’abonnement vous est personnel&nbsp;: l’accès est lié au compte Patreon
        avec lequel vous vous connectez.
      </p>

      <h2 className="h3 sous">Ce que l’abonnement ouvre</h2>
      <p>
        L’accès aux modules suit votre palier Patreon. Un module ouvert à votre
        palier le reste tant que votre abonnement est actif. Un module publié
        après votre adhésion s’ouvre à votre palier sans démarche de votre part.
      </p>
      <p>
        Aucun volume de publication n’est garanti sur une période donnée. Ce qui
        est ouvert aujourd’hui est écrit sur la page{" "}
        <Link to={routes.formation}>La formation</Link>, et sur elle seule.
      </p>

      <h2 className="h3 sous">Durée, renouvellement et résiliation</h2>
      <p>
        L’abonnement est mensuel et se reconduit par Patreon. Vous pouvez le
        mettre en pause ou y mettre fin à tout moment depuis votre compte
        Patreon, sans avoir à m’en avertir&nbsp;:{" "}
        {patreon.mentionEngagement.toLowerCase()}.
      </p>
      <p>
        L’accès reste ouvert jusqu’au terme de la période déjà réglée. Ensuite,
        votre fiche de membre revient à l’état de visiteur&#8239;; vos relevés de
        progression sont conservés et ne sont supprimés que si vous le demandez.
      </p>

      <h2 className="h3 sous">Droit de rétractation</h2>
      <p>
        Un abonnement à un contenu numérique fourni sans support matériel relève
        d’un régime particulier&nbsp;: le délai de rétractation de quatorze jours
        s’applique, sauf renoncement exprès du consommateur au moment de la
        souscription, dans les formes prévues par le code de la consommation.
      </p>
      <p>
        <AComplet quoi="régime de rétractation effectivement retenu, formulaire type de rétractation, et texte exact du renoncement recueilli lors de la souscription. À faire valider par un conseil juridique." />
      </p>

      <h2 className="h3 sous">Réclamation et médiation de la consommation</h2>
      <p>
        Adressez d’abord votre réclamation par le{" "}
        <Link to={routes.contact}>formulaire de contact</Link>. Je réponds
        moi-même. Si la réponse ne vous satisfait pas, vous pouvez saisir
        gratuitement un médiateur de la consommation.
      </p>
      <p>
        <AComplet quoi="nom, adresse postale et adresse du site du médiateur de la consommation auquel l’éditeur adhère. L’adhésion à un dispositif de médiation est obligatoire pour tout professionnel qui vend à des consommateurs." />
      </p>

      <h2 className="h3 sous">Responsabilité</h2>
      <p>
        Le site est fourni en l’état. Son accès peut être interrompu pour une
        maintenance, une panne d’un service tiers ou une cause extérieure. Les
        outils présentés dans la formation appartiennent à des éditeurs tiers,
        évoluent vite, et leurs conditions ne dépendent pas de moi.
      </p>
      <p>
        <AComplet quoi="clause de limitation de responsabilité, adaptée à la qualité des membres (consommateurs ou professionnels). À faire valider par un conseil juridique." />
      </p>

      <h2 className="h3 sous">Vos données personnelles</h2>
      <p>
        Ce que ce site conserve, pourquoi, pendant combien de temps et comment le
        faire effacer sont décrits sur la page{" "}
        <Link to={routes.confidentialite}>Confidentialité</Link>.
      </p>

      <h2 className="h3 sous">Droit applicable et litiges</h2>
      <p>
        Les présentes conditions sont soumises au droit français. À défaut
        d’accord amiable et de médiation aboutie, le litige relève des
        juridictions compétentes selon les règles de droit commun. Le
        consommateur peut saisir, à son choix, la juridiction du lieu où il
        demeurait au moment de la conclusion du contrat.
      </p>

      <h2 className="h3 sous">Version et modification</h2>
      <p>
        Les présentes conditions peuvent être modifiées. La version applicable à
        votre abonnement est celle en vigueur au jour de votre souscription ou de
        sa reconduction.
      </p>
      <p>
        <AComplet quoi="date d’entrée en vigueur de la présente version des conditions." />
      </p>
    </>
  );
}

/* ═════════════════════════ 3 · CONFIDENTIALITÉ ═══════════════════════════ */

function Confidentialite() {
  return (
    <>
      <h2 className="h3 sous">Le responsable du traitement</h2>
      <p>
        Le responsable du traitement des données collectées sur ce site est{" "}
        {IDENTITE.editeur}. Son identité complète et ses coordonnées figurent sur
        la page <Link to={routes.mentionsLegales}>Mentions légales</Link>.
      </p>
      <p>
        <AComplet quoi="coordonnées postales du responsable du traitement, et désignation d’un délégué à la protection des données si l’activité en impose un." />
      </p>

      <h2 className="h3 sous">Ce que vous m’envoyez vous-même</h2>
      <p>
        Le formulaire de la page <Link to={routes.contact}>Contact</Link>{" "}
        recueille votre nom, votre adresse électronique, l’objet de votre message
        et le message lui-même. Ces données servent uniquement à vous répondre,
        et la base légale est votre consentement, que vous donnez en envoyant le
        message. Les envois sont reçus par le service de formulaires de
        l’hébergeur, {IDENTITE.hebergeur}.
      </p>
      <p>
        Le formulaire d’inscription à la lettre d’information ne recueille que
        votre adresse électronique, sur la base de votre consentement. Vous
        pouvez le retirer à tout moment, et le lien de désinscription figure dans
        chaque envoi.
      </p>
      <p>
        Un champ caché sert à écarter les envois automatisés. Il n’est jamais
        rempli par une personne, et son contenu n’est pas conservé.
      </p>

      <h2 className="h3 sous">Les traceurs déposés sur votre appareil</h2>
      <p>
        Aucun cookie non essentiel n’est déposé avant votre clic. Il n’y a sur ce
        site ni mesure d’audience, ni régie publicitaire, ni bouton de partage
        qui vous suivrait d’un site à l’autre.
      </p>
      <Tableau legende="Inventaire des traceurs déposés par le site, leur finalité, leur base légale et leur durée">
        <thead>
          <tr>
            <th scope="col">Nom</th>
            <th scope="col">Finalité</th>
            <th scope="col">Base légale</th>
            <th scope="col">Durée</th>
            <th scope="col">Catégorie</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <th scope="row">
              <code>arc_session</code>
            </th>
            <td>Session de connexion Patreon</td>
            <td>Exécution du contrat</td>
            <td>Session, puis 30&nbsp;jours</td>
            <td>Strictement nécessaire</td>
          </tr>
          <tr>
            <th scope="row">
              <code>arc_consent</code>
            </th>
            <td>Mémoriser votre choix de consentement</td>
            <td>Obligation légale</td>
            <td>6&nbsp;mois</td>
            <td>Strictement nécessaire</td>
          </tr>
          <tr>
            <th scope="row">
              <code>arc_progression</code>
            </th>
            <td>Chapitres lus, cases cochées</td>
            <td>Exécution du contrat</td>
            <td>Compte actif, puis 12&nbsp;mois</td>
            <td>Strictement nécessaire</td>
          </tr>
          <tr>
            <th scope="row">Cookies YouTube</th>
            <td>Lecture d’une vidéo intégrée</td>
            <td>Votre consentement</td>
            <td>Fixée par YouTube</td>
            <td>Soumis au consentement</td>
          </tr>
        </tbody>
      </Tableau>
      <p className="mt-6">
        <code>arc_session</code> et <code>arc_progression</code> ne sont posés
        que si vous vous connectez avec Patreon&#8239;; <code>arc_consent</code>{" "}
        n’est posé qu’au moment où vous exprimez votre choix. Tant que vous
        restez visiteur et que vous ne choisissez rien, ce site ne dépose rien
        sur votre appareil.
      </p>
      <p>
        Les vidéos sont servies par le domaine sans cookie de YouTube et ne sont
        chargées qu’après votre consentement. Tant que vous ne l’avez pas donné,
        aucune requête ne part vers YouTube.
      </p>

      <h2 className="h3 sous">Les appels vers des services tiers</h2>
      <p>
        Deux pages du site interrogent un service extérieur pour afficher un état
        en direct. Ces appels partent de votre navigateur, ce qui expose votre
        adresse IP au service interrogé.
      </p>
      <ul>
        <li>
          L’état du serveur Minecraft — {minecraft.nom} — est relevé auprès du
          service <code>api.mcsrvstat.us</code>, qui renvoie le nombre de
          joueurs connectés. Aucune donnée personnelle ne lui est transmise.
        </li>
        <li>
          Le compteur de membres du Discord est fourni par le widget de Discord.
          Il reste désactivé tant que l’identifiant du serveur n’est pas
          renseigné, et aucun chiffre n’est affiché sans source branchée.
        </li>
      </ul>

      <h2 className="h3 sous">L’espace membre et Patreon</h2>
      <p>
        La connexion se fait sur le site de Patreon. Aucun mot de passe ne
        transite par ce site, et je n’en crée aucun.
      </p>
      <p>
        {sas.enonceDonnees ?? (
          <AComplet quoi="énoncé unique des données conservées pour un membre. Il ne peut être écrit qu’après le relevé des portées OAuth de Patreon, et le même texte doit être repris mot pour mot sur l’écran de connexion, sur la fiche de membre et ici." />
        )}
      </p>
      <p>
        En l’état des décisions de la charte, les données conservées pour un
        membre sont son identifiant Patreon, son pseudonyme, l’adresse de son
        avatar, le palier calculé, le statut de l’abonnement, la date de fin de
        période, la date de la dernière synchronisation et la progression dans
        les modules. Aucune adresse électronique n’est conservée, sauf pour une
        fonction qui en dépend.
      </p>
      <p>
        Vous pouvez demander l’effacement de ces données depuis votre fiche de
        membre. Il est exécuté sous trente jours et reste sans effet sur votre
        abonnement Patreon, que vous seul pouvez résilier.
      </p>

      <h2 className="h3 sous">Les sous-traitants et les transferts hors Union européenne</h2>
      <ul>
        <li>
          <b>{IDENTITE.hebergeur}</b> — hébergement du site et réception des
          formulaires. États-Unis, sur clauses contractuelles types.
        </li>
        <li>
          <b>Patreon</b> — authentification et lecture du palier. États-Unis, sur
          clauses contractuelles types.
        </li>
        <li>
          <b>Google Ireland / YouTube</b> — lecture des vidéos intégrées, après
          votre consentement seulement.
        </li>
        <li>
          <b>api.mcsrvstat.us</b> — état du serveur Minecraft. Aucune donnée
          personnelle transmise&#8239;; l’appel expose votre adresse IP au
          service.
        </li>
        <li>
          <b>Discord</b> — widget de la communauté. Même remarque, et désactivé
          tant que l’identifiant du serveur n’est pas renseigné.
        </li>
      </ul>
      <p className="mt-6">
        <AComplet quoi="dénominations sociales exactes et pays d’établissement des cinq sous-traitants, avec la date du relevé et le fondement du transfert retenu pour chacun." />
      </p>

      <h2 className="h3 sous">Combien de temps les données sont conservées</h2>
      <ul>
        <li>
          Messages reçus par le formulaire de contact&nbsp;:{" "}
          <AComplet quoi="durée de conservation des messages, à fixer et à écrire ici." />
        </li>
        <li>
          Adresse inscrite à la lettre d’information&nbsp;: jusqu’à votre
          désinscription.
        </li>
        <li>Session de connexion&nbsp;: la session, puis trente jours.</li>
        <li>Choix de consentement&nbsp;: six mois.</li>
        <li>
          Progression dans les modules&nbsp;: tant que le compte est actif, puis
          douze mois.
        </li>
      </ul>

      <h2 className="h3 sous">Vos droits</h2>
      <p>
        Vous disposez d’un droit d’accès, de rectification, d’effacement, de
        limitation, d’opposition et de portabilité sur vos données, ainsi que du
        droit de retirer votre consentement à tout moment lorsque le traitement
        repose sur lui. Vous pouvez également définir des directives sur le sort
        de vos données après votre décès.
      </p>
      <p>
        Pour les exercer, écrivez-moi par le{" "}
        <Link to={routes.contact}>formulaire de contact</Link>
        {EMAIL_PUBLIC ? `, ou à ${EMAIL_PUBLIC}` : null}. Je réponds dans un
        délai d’un mois. Si la réponse ne vous convient pas, vous pouvez
        introduire une réclamation auprès de la Commission nationale de
        l’informatique et des libertés (
        <LienSortant href="https://www.cnil.fr">cnil.fr</LienSortant>).
      </p>

      <h2 className="h3 sous">La sécurité du site</h2>
      <p>
        Le site est servi en HTTPS et impose une politique de sécurité du contenu
        qui n’autorise que ses propres ressources&nbsp;: les fontes sont
        hébergées ici, aucune icône n’est appelée à un tiers, et les seules
        connexions sortantes autorisées sont celles de Patreon, de Discord et du
        relevé du serveur Minecraft. Le cadre vidéo de YouTube n’est autorisé
        qu’après votre consentement.
      </p>

      <h2 className="h3 sous">Les modifications de cette page</h2>
      <p>
        Cette page évolue avec le site. La date de dernière mise à jour figure
        ci-dessous. Une modification substantielle du traitement de vos données
        vous sera signalée avant qu’elle ne prenne effet.
      </p>
    </>
  );
}

/* ═════════════════════════ LE GABARIT COMMUN ═════════════════════════════ */

const LEDES: Record<Kind, string> = {
  mentions:
    "Qui édite ce site, qui l’héberge, et comment me joindre. Ces informations sont exigées par la loi pour la confiance dans l’économie numérique.",
  cgv: "L’accès à la formation passe par un abonnement Patreon. Voici ce qu’il ouvre, à quel montant, et comment vous y mettez fin.",
  confidentialite:
    "Ce que ce site conserve, pour quoi faire, pendant combien de temps, et comment vous pouvez le faire effacer.",
};

const CORPS: Record<Kind, () => JSX.Element> = {
  mentions: MentionsLegales,
  cgv: ConditionsDeVente,
  confidentialite: Confidentialite,
};

/**
 * Nombre de trous restants sur la variante affichée. Il pilote l'encart
 * d'incomplétude : le jour où `src/data/site.ts` est renseigné et où les
 * `<AComplet>` de rédaction juridique sont retirés, l'encart tombe seul.
 */
const TROUS: Record<Kind, number> = {
  mentions: [
    IDENTITE.formeJuridique,
    null /* capital social */,
    IDENTITE.adresse,
    IDENTITE.siret,
    null /* TVA */,
    EMAIL_PUBLIC,
    null /* téléphone */,
    IDENTITE.directeurPublication,
    IDENTITE.hebergeurAdresse,
    EMAIL_PUBLIC,
  ].filter((v) => v === null).length,
  /* Rôles éditeur/Patreon · TVA · rétractation · médiateur · responsabilité ·
     date d'entrée en vigueur. Six rédactions juridiques, aucune donnée. */
  cgv: 6,
  /* Coordonnées et DPO · sous-traitants relevés · durée des messages reçus,
     plus l'énoncé unique des données tant que `sas.enonceDonnees` est vide. */
  confidentialite: 3 + (sas.enonceDonnees === null ? 1 : 0),
};

export default function LegalPage({ kind }: { kind: Kind }) {
  useMetaPage(CLE_META[kind]);

  const fiche = meta[CLE_META[kind]];
  const Corps = CORPS[kind];
  const trous = TROUS[kind];

  return (
    <section className="bande">
      <div className="wrap wrap--etroit">
        <div className="tete">
          <p className="eyebrow">{site.name}</p>
          <h1 className="h2">{fiche.titre}</h1>
          <p className="lede">{LEDES[kind]}</p>
        </div>

        {trous > 0 && (
          <div className="encart">
            <div className="encart__t">Page en cours d’établissement</div>
            <p>
              Cette page n’est pas complète. Les informations que seul l’éditeur
              peut fournir — identité de l’entreprise, immatriculation, adresse,
              directeur de la publication, rédaction juridique — sont signalées
              en clair par la marque «&nbsp;À compléter&nbsp;». Il en reste{" "}
              {trous} sur cette page. Elles doivent toutes être renseignées, et
              cet avertissement doit disparaître, avant la mise en ligne
              publique du site.
            </p>
          </div>
        )}

        <div className="prose max-w-me-legal mt-8">
          <Corps />

          <h2 className="h3 sous">Les autres pages légales</h2>
          <ul>
            {PAGES.filter((p) => p.kind !== kind).map((p) => (
              <li key={p.kind}>
                <Link to={p.to}>{p.libelle}</Link>
              </li>
            ))}
            <li>
              <Link to={routes.contact}>Me joindre</Link>
            </li>
          </ul>
        </div>

        <p className="meta mt-12">
          Dernière mise à jour&nbsp;:{" "}
          <time dateTime={site.derniereMiseAJourMachine}>
            {site.derniereMiseAJour}
          </time>
        </p>
      </div>
    </section>
  );
}
