import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { Mail, Phone, MapPin } from "lucide-react";
import { Reveal } from "@/components/motion/Reveal";
import { agency } from "@/config/agency";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: `Contact — ${agency.identity.name}` },
      {
        name: "description",
        content: "Contactez notre équipe pour un devis, une réservation ou un renseignement.",
      },
      { property: "og:title", content: `Contact — ${agency.identity.name}` },
      { property: "og:description", content: "Contactez notre équipe." },
    ],
  }),
  component: () => (
    <div className="min-h-screen">
      <Header />
      <section className="pt-40 pb-16 container-page grid gap-12 md:grid-cols-2">
        <Reveal>
          <div className="text-xs font-semibold uppercase tracking-widest text-primary">
            Contact
          </div>
          <h1 className="mt-2 font-display text-5xl">Parlons de votre prochain voyage.</h1>
          <p className="mt-4 text-muted-foreground">Notre équipe vous répond sous 24h ouvrées.</p>
          <ul className="mt-8 space-y-4 text-sm">
            <li className="flex items-center gap-3">
              <span className="grid h-10 w-10 place-items-center rounded-full bg-primary/15 text-primary">
                <Phone className="h-4 w-4" />
              </span>{" "}
              {agency.contact.phones[0]}
              {agency.contact.fax ? ` / ${agency.contact.fax}` : ""}
            </li>
            <li className="flex items-center gap-3">
              <span className="grid h-10 w-10 place-items-center rounded-full bg-primary/15 text-primary">
                <Mail className="h-4 w-4" />
              </span>{" "}
              {agency.contact.email}
            </li>
            <li className="flex items-center gap-3">
              <span className="grid h-10 w-10 place-items-center rounded-full bg-primary/15 text-primary">
                <MapPin className="h-4 w-4" />
              </span>{" "}
              {agency.contact.addresses.fr}
            </li>
          </ul>
        </Reveal>
        <Reveal delay={0.1}>
          <form
            className="rounded-3xl border border-border bg-card p-8 shadow-[var(--shadow-soft)] space-y-4"
            onSubmit={(e) => {
              e.preventDefault();
              const f = new FormData(e.currentTarget);
              const prenom = f.get("prenom"),
                nom = f.get("nom"),
                email = f.get("email");
              const sujet = f.get("sujet") || "Demande de renseignement";
              const message = f.get("message");
              const body = `Nom : ${prenom} ${nom}\nEmail : ${email}\n\n${message}`;
              window.location.href = `mailto:${agency.contact.email}?subject=${encodeURIComponent(String(sujet))}&body=${encodeURIComponent(body)}`;
            }}
          >
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block text-sm">
                Prénom
                <input
                  name="prenom"
                  required
                  className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
                />
              </label>
              <label className="block text-sm">
                Nom
                <input
                  name="nom"
                  required
                  className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
                />
              </label>
            </div>
            <label className="block text-sm">
              Email
              <input
                name="email"
                type="email"
                required
                className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
              />
            </label>
            <label className="block text-sm">
              Sujet
              <input
                name="sujet"
                className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
              />
            </label>
            <label className="block text-sm">
              Message
              <textarea
                name="message"
                rows={5}
                required
                className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
              />
            </label>
            <button type="submit" className="btn-primary w-full">
              Envoyer
            </button>
            <a
              href={`https://wa.me/${agency.contact.whatsapp.replace(/[^0-9]/g, "")}`}
              target="_blank"
              rel="noreferrer"
              className="btn-ghost w-full justify-center"
            >
              Ou contactez-nous sur WhatsApp
            </a>
          </form>
        </Reveal>
      </section>

      {/* Carte — Google Maps sans clé API, la requête vient d'agency.ts */}
      <section className="container-page pb-20">
        <ContactMap />
      </section>

      <Footer />
    </div>
  ),
});


/**
 * Own component only so it can hold a hook: the contact route is an inline
 * arrow with no body.
 *
 * Google draws disputed borders from the region encoded in the embed. The
 * ?q= form carries none, so it splits Western Sahara off Morocco with a
 * dashed line - hence z=16, where no national border is drawn, and hence
 * mapEmbedUrl for a "Share -> Embed a map" URL ending in !2sma.
 *
 * The embed also turns the page's scroll wheel into a zoom, so scrolling
 * past the contact section used to zoom the map out to that country view.
 * One click hands control over deliberately.
 */
function ContactMap() {
  const [live, setLive] = useState(false);
  const src =
    agency.contact.mapEmbedUrl ??
    `https://www.google.com/maps?q=${encodeURIComponent(agency.contact.mapQuery)}&output=embed&z=16`;

  return (
    <div className="relative overflow-hidden rounded-3xl border border-border shadow-[var(--shadow-soft)]">
      <iframe
        title={`Localisation de ${agency.identity.name}`}
        src={src}
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        className={`h-[320px] w-full border-0 sm:h-[420px] ${live ? "" : "pointer-events-none"}`}
      />
      {!live && (
        <button
          type="button"
          onClick={() => setLive(true)}
          aria-label="Activer la carte"
          className="absolute inset-0 h-full w-full cursor-pointer bg-transparent"
        />
      )}
    </div>
  );
}
