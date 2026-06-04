import { useState } from "react";
import Seal from "../components/brand/Seal";
import Spark from "../components/brand/Spark";
import Pictogram from "../components/brand/Pictogram";
import type { PictoName } from "../components/brand/Pictogram";
import TypeBadge from "../components/ui/TypeBadge";

type Subject = "formation" | "partenariat" | "minecraft" | "presse" | "autre";

const SUBJECTS: { key: Subject; label: string; picto: PictoName }[] = [
  { key: "formation", label: "Formation", picto: "savoir" },
  { key: "partenariat", label: "Partenariat", picto: "collection" },
  { key: "minecraft", label: "Minecraft", picto: "nature" },
  { key: "presse", label: "Presse", picto: "chroniques" },
  { key: "autre", label: "Autre", picto: "decouverte" },
];

const SUBJECT_LABELS: Record<Subject, string> = Object.fromEntries(
  SUBJECTS.map((s) => [s.key, s.label]),
) as Record<Subject, string>;

type Status = "idle" | "sending" | "ok" | "error";

function encodeForm(data: Record<string, string>): string {
  return Object.entries(data)
    .map(([k, v]) => encodeURIComponent(k) + "=" + encodeURIComponent(v))
    .join("&");
}

export default function Contact() {
  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState<string>("");
  const [subject, setSubject] = useState<Subject>("formation");

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus("sending");
    setErrorMsg("");

    const form = e.currentTarget;
    const formData = new FormData(form);

    const payload: Record<string, string> = {
      "form-name": "contact",
      subject: SUBJECT_LABELS[subject],
    };
    formData.forEach((value, key) => {
      if (typeof value === "string") payload[key] = value;
    });

    try {
      const res = await fetch("/", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: encodeForm(payload),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      setStatus("ok");
      form.reset();
      setSubject("formation");
    } catch (err) {
      setStatus("error");
      setErrorMsg(err instanceof Error ? err.message : "Erreur inconnue");
    }
  };

  return (
    <>
      <section className="container-narrow pt-20 pb-12 text-center">
        <TypeBadge variant="rouge">Contact</TypeBadge>
        <h1 className="display text-encre mt-4">Écris au laboratoire.</h1>
        <p className="text-lg text-encre-500 max-w-xl mx-auto mt-4 leading-relaxed">
          Une question, une proposition, une demande presse ? Le Professeur lit tout, et répond
          généralement en moins de 48 heures.
        </p>
      </section>

      <section className="section pt-4">
        <div className="container-narrow grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 card !p-8">
            {status === "ok" ? (
              <div className="text-center py-12 space-y-4">
                <div className="flex justify-center">
                  <Seal size={72} variant="simple" tone="vert" />
                </div>
                <h3 className="heading-2 text-encre">Message envoyé.</h3>
                <p className="text-encre-500 max-w-sm mx-auto">
                  Merci, on revient vers toi dès que possible. En attendant, fais un tour sur le Discord
                  ou découvre la formation.
                </p>
                <button onClick={() => setStatus("idle")} className="btn-outline mt-2">
                  Envoyer un autre message
                </button>
              </div>
            ) : (
              <form
                onSubmit={onSubmit}
                name="contact"
                method="POST"
                data-netlify="true"
                data-netlify-honeypot="bot-field"
                className="space-y-6"
              >
                <input type="hidden" name="form-name" value="contact" />
                <p className="hidden">
                  <label>
                    Ne pas remplir : <input name="bot-field" tabIndex={-1} autoComplete="off" />
                  </label>
                </p>
                <input type="hidden" name="subject" value={SUBJECT_LABELS[subject]} />

                <div>
                  <span className="label block mb-2.5">Sujet</span>
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                    {SUBJECTS.map((s) => (
                      <button
                        type="button"
                        key={s.key}
                        onClick={() => setSubject(s.key)}
                        className={`p-3 rounded-lg border text-sm font-medium transition-all flex flex-col items-center gap-1.5 ${
                          subject === s.key
                            ? "bg-rouge-50 border-rouge text-rouge-700"
                            : "bg-creme border-encre/15 text-encre-600 hover:border-encre/40"
                        }`}
                      >
                        <Pictogram name={s.picto} size={20} />
                        {s.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <Field label="Nom / Pseudo" name="name" required />
                  <Field label="Email" name="email" type="email" required />
                </div>

                <Field label="Objet (résumé court)" name="object" required />

                <div>
                  <label htmlFor="message" className="label block mb-2.5">Message</label>
                  <textarea
                    id="message"
                    name="message"
                    rows={6}
                    required
                    className="w-full px-4 py-3 rounded-lg bg-creme border border-encre/20 text-encre placeholder-encre-400 focus:outline-none focus:border-rouge"
                    placeholder="Raconte-nous tout…"
                  />
                </div>

                <label className="flex items-start gap-3 text-sm text-encre-500">
                  <input type="checkbox" required className="mt-1 accent-rouge" />
                  <span>
                    J'accepte que mes données soient utilisées pour me recontacter, conformément à la
                    politique de confidentialité.
                  </span>
                </label>

                {status === "error" && (
                  <div className="rounded-lg bg-rouge-50 border border-rouge/30 text-rouge-700 text-sm px-4 py-3">
                    L'envoi a échoué ({errorMsg}). Réessaie, ou écris directement à{" "}
                    <a href="mailto:contact@archivesprofesseurchen.com" className="underline font-semibold">
                      contact@archivesprofesseurchen.com
                    </a>
                    .
                  </div>
                )}

                <button
                  type="submit"
                  disabled={status === "sending"}
                  className="btn-primary w-full sm:w-auto disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {status === "sending" ? "Envoi en cours…" : "Envoyer le message"}
                  {status !== "sending" && <Spark size="0.8em" />}
                </button>
              </form>
            )}
          </div>

          <aside className="space-y-4">
            <div className="card">
              <div className="label text-rouge mb-2">Email direct</div>
              <a
                href="mailto:contact@archivesprofesseurchen.com"
                className="font-mono text-sm text-encre hover:text-rouge break-all"
              >
                contact@archivesprofesseurchen.com
              </a>
            </div>
            <div className="card">
              <div className="label text-rouge mb-2">Délai de réponse</div>
              <div className="font-display font-extrabold text-3xl text-encre">~ 48h</div>
              <p className="text-sm text-encre-500 mt-1">Hors week-ends et événements communautaires.</p>
            </div>
            <div className="card">
              <div className="label text-rouge mb-2">Le plus rapide ?</div>
              <p className="text-sm text-encre-500">
                Pose ta question sur le{" "}
                <a href="/discord" className="text-rouge underline-laiton">Discord</a> — souvent un membre
                te répond avant nous.
              </p>
            </div>
            <div className="card card-parch">
              <div className="label text-rouge mb-2">Presse / partenariats</div>
              <p className="text-sm text-encre-600">
                Choisis <span className="text-encre font-medium">« Presse »</span> ou{" "}
                <span className="text-encre font-medium">« Partenariat »</span> comme sujet pour être prioritaire.
              </p>
            </div>
          </aside>
        </div>
      </section>
    </>
  );
}

function Field({
  label,
  name,
  type = "text",
  required = false,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
}) {
  return (
    <div>
      <label htmlFor={name} className="label block mb-2.5">{label}</label>
      <input
        id={name}
        name={name}
        type={type}
        required={required}
        className="w-full px-4 py-3 rounded-lg bg-creme border border-encre/20 text-encre placeholder-encre-400 focus:outline-none focus:border-rouge"
      />
    </div>
  );
}
