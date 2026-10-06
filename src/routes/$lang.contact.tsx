import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { Mail, Phone, MapPin } from "lucide-react";
import { Reveal } from "@/components/motion/Reveal";
import { addressFor, agency } from "@/config/agency";
import { useLocale, useT, tFor } from "@/i18n";
import { submitBooking } from "@/lib/booking";

export const Route = createFileRoute("/$lang/contact")({
  head: ({ params }) => ({
    meta: [
      { title: tFor(params.lang)("meta.contact.title") },
      {
        name: "description",
        content: tFor(params.lang)("meta.contact.desc"),
      },
      { property: "og:title", content: tFor(params.lang)("meta.contact.title") },
      { property: "og:description", content: tFor(params.lang)("meta.contact.desc") },
    ],
  }),
  component: ContactPage,
});

function ContactPage() {
  const t = useT();
  const [mapLive, setMapLive] = useState(false);

  // A "Share → Embed a map" URL wins when the client supplied one: it pins
  // their actual premises, and it carries the region Google uses to decide
  // how to draw disputed borders. The ?q= fallback carries no region, so it
  // splits Western Sahara off from Morocco with a dashed line — which is why
  // z=16 matters there: at street level no border is drawn at all.
  const mapSrc =
    agency.contact.mapEmbedUrl ??
    `https://www.google.com/maps?q=${encodeURIComponent(agency.contact.mapQuery)}&output=embed&z=16`;

  return (
    <div className="min-h-screen">
      <Header />
      <section className="pt-40 pb-16 container-page grid gap-12 md:grid-cols-2">
        <Reveal>
          <div className="text-xs font-semibold uppercase tracking-widest text-primary">
            {t("footer.contact")}
          </div>
          <h1 className="mt-2 font-display text-5xl">{t("contact.title")}</h1>
          <p className="mt-4 text-muted-foreground">{t("contact.lead")}</p>
          <ul className="mt-8 space-y-4 text-sm">
            <li className="flex items-center gap-3">
              <span className="grid h-10 w-10 place-items-center rounded-full bg-primary/15 text-primary">
                <Phone className="h-4 w-4" />
              </span>{" "}
              {/* Every line the agency published, not just the first, and
                  each dialable — these were plain text here while the header
                  already linked them. */}
              <bdi dir="ltr">
                {agency.contact.phones.map((phone, i) => (
                  <span key={phone}>
                    {i > 0 && " / "}
                    <a className="hover:text-primary" href={`tel:${phone.replace(/\s/g, "")}`}>
                      {phone}
                    </a>
                  </span>
                ))}
                {agency.contact.fax ? ` / ${agency.contact.fax}` : ""}
              </bdi>
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
              {addressFor(useLocale())}
            </li>
          </ul>
        </Reveal>
        <Reveal delay={0.1}>
          <form
            className="rounded-3xl border border-border bg-card p-8 shadow-[var(--shadow-soft)] space-y-4"
            onSubmit={(e) => {
              e.preventDefault();
              const f = new FormData(e.currentTarget);
              const value = (name: string) => String(f.get(name) ?? "");
              submitBooking({
                kind: "contact",
                subject: value("sujet") || t("nav.contact"),
                fields: [
                  [t("contact.firstName"), value("prenom")],
                  [t("contact.lastName"), value("nom")],
                  [t("contact.email"), value("email")],
                  [t("contact.subject"), value("sujet")],
                  [t("contact.message"), value("message")],
                ],
              });
            }}
          >
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block text-sm">
                {t("contact.firstName")}
                <input
                  name="prenom"
                  required
                  className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
                />
              </label>
              <label className="block text-sm">
                {t("contact.lastName")}
                <input
                  name="nom"
                  required
                  className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
                />
              </label>
            </div>
            <label className="block text-sm">
              {t("contact.email")}
              <input
                name="email"
                type="email"
                required
                className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
              />
            </label>
            <label className="block text-sm">
              {t("contact.subject")}
              <input
                name="sujet"
                className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
              />
            </label>
            <label className="block text-sm">
              {t("contact.message")}
              <textarea
                name="message"
                rows={5}
                required
                className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
              />
            </label>
            <button type="submit" className="btn-primary w-full">
              {t("contact.send")}
            </button>
            <a
              href={`https://wa.me/${agency.contact.whatsapp.replace(/[^0-9]/g, "")}`}
              target="_blank"
              rel="noreferrer"
              className="btn-ghost w-full justify-center"
            >
              {t("contact.whatsapp")}
            </a>
          </form>
        </Reveal>
      </section>

      {/* Carte — Google Maps sans clé API, la requête vient d'agency.ts */}
      <section className="container-page pb-20">
        <div className="relative overflow-hidden rounded-3xl border border-border shadow-[var(--shadow-soft)]">
          <iframe
            title={t("contact.mapTitle")}
            src={mapSrc}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className={`h-[320px] w-full border-0 sm:h-[420px] ${mapLive ? "" : "pointer-events-none"}`}
          />
          {/* No marker overlay here. The premise used to be that a `?q=` embed
              draws none of its own and needed one painting on top — untrue: any
              `?q=` Google can resolve, a business name or a bare lat/long, gets
              Google's own marker, and a place match brings its info card too.
              The overlay simply landed a second pin on the first, and being
              CSS-centred it drifted off the building the moment anyone panned. */}
          {/* The embed swallows the page's scroll wheel and turns it into a
              zoom, so scrolling past the contact page silently zooms the map
              out to a view of the whole region. One click hands control over
              deliberately. */}
          {!mapLive && (
            <button
              type="button"
              onClick={() => setMapLive(true)}
              aria-label={t("contact.mapActivate")}
              className="absolute inset-0 h-full w-full cursor-pointer bg-transparent"
            />
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}
