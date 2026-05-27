import { useState } from "react";

type Status = "idle" | "sending" | "ok" | "error";

function encodeForm(data: Record<string, string>): string {
  return Object.entries(data)
    .map(([k, v]) => encodeURIComponent(k) + "=" + encodeURIComponent(v))
    .join("&");
}

export default function NewsletterForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus("sending");
    setErrorMsg("");

    const form = e.currentTarget;
    const formData = new FormData(form);
    const payload: Record<string, string> = { "form-name": "newsletter" };
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
    } catch (err) {
      setStatus("error");
      setErrorMsg(err instanceof Error ? err.message : "Erreur inconnue");
    }
  };

  if (status === "ok") {
    return (
      <div className="mt-6 max-w-md mx-auto p-5 rounded-xl bg-accent-grass/15 border border-accent-grass/40 text-accent-grass">
        <div className="font-display text-lg">Bienvenue au labo ! 🧪</div>
        <p className="text-sm mt-1 opacity-90">
          Ton email est enregistré. À très vite dans ta boîte de réception.
        </p>
      </div>
    );
  }

  return (
    <>
      <form
        name="newsletter"
        method="POST"
        data-netlify="true"
        data-netlify-honeypot="bot-field"
        onSubmit={onSubmit}
        className="mt-6 flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
      >
        <input type="hidden" name="form-name" value="newsletter" />
        <p className="hidden">
          <label>
            Ne pas remplir : <input name="bot-field" tabIndex={-1} autoComplete="off" />
          </label>
        </p>
        <input
          type="email"
          name="email"
          required
          placeholder="ton@email.com"
          disabled={status === "sending"}
          className="flex-1 px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-lab-400 focus:outline-none focus:border-pikachu-yellow disabled:opacity-60"
        />
        <button
          type="submit"
          disabled={status === "sending"}
          className="btn-yellow disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {status === "sending" ? "Envoi…" : "S'inscrire"}
        </button>
      </form>
      {status === "error" && (
        <p className="text-xs text-pokeball-red pt-2">
          Erreur ({errorMsg}). Réessaie ou écris-nous à contact@archivesprofesseurchen.com.
        </p>
      )}
      <p className="text-xs text-lab-400 pt-2">Pas de spam, désinscription en un clic.</p>
    </>
  );
}
