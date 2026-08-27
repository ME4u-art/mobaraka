import { createFileRoute, notFound } from "@tanstack/react-router";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { TourCard } from "@/components/site/TourCard";
import { StaggerGroup, StaggerItem } from "@/components/motion/Stagger";
import { agency, isEnabled, notFoundHead } from "@/config/agency";
import { content } from "@/lib/content";
import { ListingSkeleton } from "@/components/site/Skeleton";

export const Route = createFileRoute("/voyages-organises")({
  beforeLoad: () => {
    if (!isEnabled("voyagesOrganises")) throw notFound();
  },
  loader: async () => ({ tours: await content.getVoyagesOrganises() }),
  head: () =>
    !isEnabled("voyagesOrganises")
      ? notFoundHead()
      : {
          meta: [
            { title: `Voyages organisés — ${agency.identity.name}` },
            {
              name: "description",
              content:
                "Découvrez tous nos voyages organisés en groupe avec billet d'avion : Asie, Europe, Afrique et plus.",
            },
            { property: "og:title", content: `Voyages organisés — ${agency.identity.name}` },
            {
              property: "og:description",
              content: "Voyages organisés en groupe au départ du Maroc.",
            },
          ],
        },
  component: VoyagesOrganisesPage,
  pendingComponent: () => (
    <ListingSkeleton eyebrow="Voyages organisés" title="Toutes nos destinations" />
  ),
});

function VoyagesOrganisesPage() {
  const { tours } = Route.useLoaderData();
  return (
    <div className="min-h-screen">
      <Header />
      <div className="pt-40 pb-16 bg-sand">
        <div className="container-page">
          <div className="text-xs font-semibold uppercase tracking-widest text-primary">
            Voyages organisés
          </div>
          <h1 className="mt-2 font-display text-5xl sm:text-6xl">Toutes nos destinations</h1>
          <p className="mt-4 max-w-2xl text-muted-foreground">
            Circuits en groupe avec billet d'avion au départ du Maroc, encadrés par nos guides
            francophones.
          </p>
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
