import { createFileRoute, notFound } from "@tanstack/react-router";
import { useT, tFor } from "@/i18n";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { TourCard } from "@/components/site/TourCard";
import { StaggerGroup, StaggerItem } from "@/components/motion/Stagger";
import { agency, isEnabled, notFoundHead } from "@/config/agency";
import { content } from "@/lib/content";
import { ListingSkeleton } from "@/components/site/Skeleton";

export const Route = createFileRoute("/$lang/voyages-organises")({
  beforeLoad: () => {
    if (!isEnabled("voyagesOrganises")) throw notFound();
  },
  loader: async () => ({ tours: await content.getVoyagesOrganises() }),
  head: ({ params }) =>
    !isEnabled("voyagesOrganises")
      ? notFoundHead(tFor(params.lang)("error.notFoundTitle"))
      : {
          meta: [
            { title: `${tFor(params.lang)("listing.organisedTitle")} — ${agency.identity.name}` },
            { name: "description", content: tFor(params.lang)("meta.organised.desc") },
            { property: "og:title", content: `${tFor(params.lang)("listing.organisedTitle")} — ${agency.identity.name}` },
            { property: "og:description", content: tFor(params.lang)("meta.organised.desc") },
          ],
        },
  component: VoyagesOrganisesPage,
  pendingComponent: ListingPending,
});

function VoyagesOrganisesPage() {
  const t = useT();
  const { tours } = Route.useLoaderData();
  return (
    <div className="min-h-screen">
      <Header />
      <div className="pt-40 pb-16 bg-sand">
        <div className="container-page">
          <div className="text-xs font-semibold uppercase tracking-widest text-primary">{t("footer.organisedTrips")}</div>
          <h1 className="mt-2 font-display text-5xl sm:text-6xl">{t("listing.organisedTitle")}</h1>
          <p className="mt-4 max-w-2xl text-muted-foreground">{t("listing.organisedLead")}</p>
        </div>
      </div>
      <div className="container-page py-12">
        <StaggerGroup className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {tours.map((t) => (
            <StaggerItem key={t.slug}>
              <TourCard tour={t} />
            </StaggerItem>
          ))}
        </StaggerGroup>
      </div>
      <Footer />
    </div>
  );
}

/** The skeleton shown while the loader runs — a component, so it can
 *  translate its own headings rather than take French ones as props. */
function ListingPending() {
  const t = useT();
  return <ListingSkeleton eyebrow={t("footer.organisedTrips")} title={t("listing.organisedTitle")} />;
}
