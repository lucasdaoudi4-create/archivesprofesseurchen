import { site } from "../data/site";
import Spark from "../components/brand/Spark";

type Kind = "mentions" | "cgv" | "confidentialite";

const CONTENT: Record<Kind, { title: string; intro: string; sections: { h: string; p: string }[] }> = {
  mentions: {
    title: "Mentions légales",
    intro:
      "Conformément à la loi pour la confiance dans l'économie numérique, voici les informations légales de l'éditeur du site.",
    sections: [
      { h: "Éditeur", p: "À compléter : nom, statut juridique, adresse, SIRET, capital social." },
      { h: "Directeur de la publication", p: "À compléter." },
      { h: "Hébergeur", p: "À compléter (ex. Netlify, Inc. — 44 Montgomery St, San Francisco, CA 94104, USA)." },
      { h: "Propriété intellectuelle", p: "L'ensemble des contenus est protégé. Toute reproduction non autorisée est interdite." },
    ],
  },
  cgv: {
    title: "Conditions générales",
    intro: "Conditions générales d'utilisation du site et de vente de la formation.",
    sections: [
      { h: "Objet", p: "À compléter : description de la formation, du contenu, des services." },
      { h: "Tarifs", p: "À compléter : prix, modalités de paiement, durée d'accès." },
      { h: "Droit de rétractation", p: "À compléter selon le cadre légal applicable (formation en ligne, B2C)." },
      { h: "Litiges", p: "Médiation puis juridictions françaises compétentes." },
    ],
  },
  confidentialite: {
    title: "Politique de confidentialité",
    intro: "Comment nous traitons tes données personnelles, dans le respect du RGPD.",
    sections: [
      { h: "Données collectées", p: "Nom, email, messages envoyés via le formulaire de contact, données de navigation anonymisées." },
      { h: "Finalités", p: "Te recontacter, t'envoyer la newsletter si tu y consens, améliorer le site." },
      { h: "Durée de conservation", p: "À compléter selon les traitements (3 ans pour les contacts commerciaux par défaut)." },
      { h: "Tes droits", p: "Accès, rectification, suppression, opposition — écris à l'adresse contact du site." },
    ],
  },
};

export default function LegalPage({ kind }: { kind: Kind }) {
  const data = CONTENT[kind];
  return (
    <section className="container-narrow pt-20 pb-20 max-w-3xl">
      <div className="label text-rouge">{site.name}</div>
      <h1 className="display text-encre mt-3 mb-4 text-[2.4rem] sm:text-5xl">{data.title}</h1>
      <p className="text-encre-500 text-lg leading-relaxed">{data.intro}</p>
      <div className="mt-10 divide-y divide-encre/10 border-t border-encre/10">
        {data.sections.map((s) => (
          <section key={s.h} className="py-7 grid sm:grid-cols-[14rem_1fr] gap-x-6 gap-y-2">
            <h2 className="font-display font-bold text-lg text-encre">{s.h}</h2>
            <p className="text-encre-500 leading-relaxed">{s.p}</p>
          </section>
        ))}
      </div>
      <div className="mt-10 flex items-start gap-3 p-5 rounded-xl bg-laiton-50 border border-laiton/30">
        <Spark size="1em" className="text-laiton-700 mt-0.5 shrink-0" />
        <p className="text-sm text-laiton-700 leading-relaxed">
          Page à compléter avec ton avocat et les informations réelles avant la mise en ligne publique.
        </p>
      </div>
    </section>
  );
}
