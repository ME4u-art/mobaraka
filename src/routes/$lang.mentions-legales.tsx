import { createFileRoute, notFound } from "@tanstack/react-router";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { Reveal } from "@/components/motion/Reveal";
import { addressFor, agency, notFoundHead } from "@/config/agency";
import { useLocale, useT, tFor, type TranslationKey } from "@/i18n";

/**
 * Legal notice — the page the footer's "Mentions légales" link points at.
 *
 * Gated on `agency.legal` exactly like a feature: no register data, no page,
 * and the footer drops the link to match. A legal notice is the one page that
 * must never carry a plausible-looking invention, and a template that shipped
 * a filled-in example would put the demo's registration on the first fork
 * whose owner did not read it.
 *
 * Everything rendered here is the PUBLIC subset of the RC extract (modèle 7):
 * dénomination, forme juridique, capital, RC, ICE, siège, gérant. The gérant's
 * CIN and date of birth are on that same extract and must stay off — so must
 * the identifiant fiscal, the patente and the CNSS number.
 */
export const Route = createFileRoute("/$lang/mentions-legales")({
  beforeLoad: () => {
    if (!agency.legal) throw notFound();
  },
  head: ({ params }) => {
    const t = tFor(params.lang);
    return !agency.legal
      ? notFoundHead(t("error.notFoundTitle"))
      : {
          meta: [
            { title: t("meta.legal.title") },
            { name: "description", content: t("meta.legal.desc") },
            { property: "og:title", content: t("meta.legal.title") },
            { property: "og:description", content: t("meta.legal.desc") },
            // A legal notice has no business competing in search results with
            // the pages that sell. "follow" so it still passes link equity.
            { name: "robots", content: "noindex, follow" },
          ],
        };
  },
  component: LegalPage,
});

/** One [label, value] row. The value is a literal already, not a key. */
function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="grid gap-1 border-b border-border py-3 last:border-0 sm:grid-cols-3 sm:gap-4">
      <dt className="text-sm text-muted-foreground">{label}</dt>
      <dd className="text-sm font-medium sm:col-span-2">{value}</dd>
    </div>
  );
}

function Section({ title, body }: { title: string; body: string[] }) {
  return (
    <div className="mt-10">
      <h2 className="font-display text-xl font-bold">{title}</h2>
      {body.map((p) => (
        <p key={p} className="mt-3 text-sm leading-relaxed text-muted-foreground">
          {p}
        </p>
      ))}
    </div>
  );
}

function LegalPage() {
  const lang = useLocale();
  const t = useT();
  const k = (key: TranslationKey) => t(key);
  const legal = agency.legal;
  if (!legal) return null;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container-page pb-20 pt-32 sm:pt-40">
        <Reveal>
          <p className="text-sm font-semibold uppercase tracking-wide text-primary">
            {k("legal.eyebrow")}
          </p>
          <h1 className="mt-2 font-display text-3xl font-bold sm:text-4xl">{k("legal.title")}</h1>
          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-muted-foreground">
            {k("legal.lead")}
          </p>
        </Reveal>

        <Reveal>
          <div className="mt-10 max-w-3xl rounded-2xl border border-border bg-card p-6">
            <h2 className="font-display text-xl font-bold">{k("legal.publisher")}</h2>
            <dl className="mt-4">
              <Row label={k("legal.name")} value={agency.identity.name} />
              <Row label={k("legal.form")} value={k("legal.formValue")} />
              <Row label={k("legal.capital")} value={legal.capital} />
              <Row label={k("legal.rc")} value={legal.rc} />
              <Row label={k("legal.ice")} value={legal.ice} />
              <Row label={k("legal.activity")} value={k("legal.activityValue")} />
              <Row label={k("legal.manager")} value={legal.manager} />
              <Row label={k("legal.address")} value={addressFor(lang)} />
              <Row label={k("legal.email")} value={agency.contact.email} />
              <Row label={k("legal.phone")} value={agency.contact.phones[0]} />
            </dl>
          </div>
        </Reveal>

        <Reveal>
          <div className="max-w-3xl">
            <Section title={k("legal.hostingTitle")} body={[k("legal.hostingBody")]} />
            <Section
              title={k("legal.dataTitle")}
              body={[k("legal.dataBody1"), k("legal.dataBody2")]}
            />
            <Section title={k("legal.cookiesTitle")} body={[k("legal.cookiesBody")]} />
            <Section title={k("legal.ipTitle")} body={[k("legal.ipBody")]} />
            <Section title={k("legal.pricesTitle")} body={[k("legal.pricesBody")]} />
          </div>
        </Reveal>
      </main>
      <Footer />
    </div>
  );
}
