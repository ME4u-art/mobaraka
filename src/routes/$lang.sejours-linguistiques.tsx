import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useLocale, useT, tFor } from "@/i18n";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { TourCard } from "@/components/site/TourCard";
import { StaggerGroup, StaggerItem } from "@/components/motion/Stagger";
import { Reveal } from "@/components/motion/Reveal";
import { agency, isEnabled, notFoundHead } from "@/config/agency";
import { content } from "@/lib/content";
import { ListingSkeleton } from "@/components/site/Skeleton";

export const Route = createFileRoute("/$lang/sejours-linguistiques")({
  beforeLoad: () => {
    if (!isEnabled("languageStays")) throw notFound();
  },
  loader: async () => ({ stays: await content.getLanguageStays() }),
  head: ({ params }) =>
    !isEnabled("languageStays")
      ? notFoundHead(tFor(params.lang)("error.notFoundTitle"))
      : {
          meta: [
            { title: `${tFor(params.lang)("nav.languageStays")} — ${agency.identity.name}` },
            { name: "description", content: tFor(params.lang)("meta.stays.desc") },
            { property: "og:title", content: `${tFor(params.lang)("nav.languageStays")} — ${agency.identity.name}` },
            { property: "og:description", content: tFor(params.lang)("meta.stays.desc") },
          ],
        },
  component: LanguageStaysPage,
  pendingComponent: ListingPending,
});

function LanguageStaysPage() {
  const lang = useLocale();
  const t = useT();
  const { stays } = Route.useLoaderData();
  return (
    <div className="min-h-screen">
      <Header />
      <div className="pt-40 pb-16 bg-sand">
        <div className="container-page">
          <div className="text-xs font-semibold uppercase tracking-widest text-primary">{t("nav.languageStays")}</div>
          <h1 className="mt-2 font-display text-5xl sm:text-6xl">{t("nav.languageStays")}</h1>
          <p className="mt-4 max-w-2xl text-muted-foreground">{t("listing.staysLead")}</p>
        </div>
      </div>
      <div className="container-page py-12">
        {stays.length === 0 ? (
          <Reveal className="mx-auto max-w-xl rounded-3xl border border-border bg-sand px-8 py-16 text-center">
            <h2 className="font-display text-2xl sm:text-3xl">{t("listing.emptyTitle")}</h2>
            <p className="mt-3 text-muted-foreground">{t("listing.emptyBody")}</p>
            <Link to="/$lang/contact" params={{ lang }} className="btn-primary mt-6 inline-flex">{t("nav.contact")}</Link>
          </Reveal>
        ) : (
          <StaggerGroup className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {stays.map((t) => (
              <StaggerItem key={t.slug}>
                <TourCard tour={t} />
              </StaggerItem>
            ))}
          </StaggerGroup>
        )}
      </div>
      <Footer />
    </div>
  );
}

/** The skeleton shown while the loader runs — a component, so it can
 *  translate its own headings rather than take French ones as props. */
function ListingPending() {
  const t = useT();
  return <ListingSkeleton eyebrow={t("nav.languageStays")} title={t("nav.languageStays")} />;
}
