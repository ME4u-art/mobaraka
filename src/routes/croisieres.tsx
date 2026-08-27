import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { TourCard } from "@/components/site/TourCard";
import { StaggerGroup, StaggerItem } from "@/components/motion/Stagger";
import { Reveal } from "@/components/motion/Reveal";
import { agency, isEnabled, notFoundHead } from "@/config/agency";
import { content } from "@/lib/content";
import { ListingSkeleton } from "@/components/site/Skeleton";

export const Route = createFileRoute("/croisieres")({
  beforeLoad: () => {
    if (!isEnabled("cruises")) throw notFound();
  },
  loader: async () => ({ cruises: await content.getCruises() }),
  head: () =>
    !isEnabled("cruises")
      ? notFoundHead()
      : {
          meta: [
            { title: `Croisières — ${agency.identity.name}` },
            {
              name: "description",
              content:
                "Nos croisières en Méditerranée, mer Rouge et au-delà — cabines, escales et départs.",
            },
            { property: "og:title", content: `Croisières — ${agency.identity.name}` },
            { property: "og:description", content: "Nos croisières." },
          ],
        },
  component: CruisesPage,
  pendingComponent: () => <ListingSkeleton eyebrow="Croisières" title="Croisières" />,
});

function CruisesPage() {
  const { cruises } = Route.useLoaderData();
  return (
    <div className="min-h-screen">
      <Header />
      <div className="pt-40 pb-16 bg-sand">
        <div className="container-page">
          <div className="text-xs font-semibold uppercase tracking-widest text-primary">
            Croisières
          </div>
          <h1 className="mt-2 font-display text-5xl sm:text-6xl">Croisières</h1>
          <p className="mt-4 max-w-2xl text-muted-foreground">
            Croisières en Méditerranée, mer Rouge et au-delà — escales de rêve, pension complète à
            bord et départs réguliers.
          </p>
        </div>
      </div>
      <div className="container-page py-12">
        {cruises.length === 0 ? (
          <Reveal className="mx-auto max-w-xl rounded-3xl border border-border bg-sand px-8 py-16 text-center">
            <h2 className="font-display text-2xl sm:text-3xl">Croisières bientôt disponibles</h2>
            <p className="mt-3 text-muted-foreground">
              De nouvelles croisières seront publiées prochainement. Contactez-nous pour toute
              demande.
            </p>
            <Link to="/contact" className="btn-primary mt-6 inline-flex">
              Nous contacter
            </Link>
          </Reveal>
        ) : (
          <StaggerGroup className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {cruises.map((t) => (
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
