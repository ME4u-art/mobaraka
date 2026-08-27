import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { TourCard } from "@/components/site/TourCard";
import { StaggerGroup, StaggerItem } from "@/components/motion/Stagger";
import { Reveal } from "@/components/motion/Reveal";
import { agency, isEnabled, notFoundHead } from "@/config/agency";
import { content } from "@/lib/content";
import { ListingSkeleton } from "@/components/site/Skeleton";

export const Route = createFileRoute("/circuits")({
  beforeLoad: () => {
    if (!isEnabled("circuits")) throw notFound();
  },
  loader: async () => ({ circuits: await content.getCircuits() }),
  head: () =>
    !isEnabled("circuits")
      ? notFoundHead()
      : {
          meta: [
            { title: `Circuit au Maroc — ${agency.identity.name}` },
            {
              name: "description",
              content:
                "Nos circuits au Maroc, à la découverte des villes impériales, du désert et des côtes.",
            },
            { property: "og:title", content: `Circuit au Maroc — ${agency.identity.name}` },
            { property: "og:description", content: "Nos circuits au Maroc." },
          ],
        },
  component: CircuitsPage,
  pendingComponent: () => <ListingSkeleton eyebrow="Circuit au Maroc" title="Circuit au Maroc" />,
});

function CircuitsPage() {
  const { circuits } = Route.useLoaderData();
  return (
    <div className="min-h-screen">
      <Header />
      <div className="pt-40 pb-16 bg-sand">
        <div className="container-page">
          <div className="text-xs font-semibold uppercase tracking-widest text-primary">
            Circuit au Maroc
          </div>
          <h1 className="mt-2 font-display text-5xl sm:text-6xl">Circuit au Maroc</h1>
          <p className="mt-4 max-w-2xl text-muted-foreground">
            Circuits au Maroc encadrés par nos guides : villes impériales, kasbahs du Sud, désert et
            côtes atlantiques.
          </p>
        </div>
      </div>
      <div className="container-page py-12">
        {circuits.length === 0 ? (
          <Reveal className="mx-auto max-w-xl rounded-3xl border border-border bg-sand px-8 py-16 text-center">
            <h2 className="font-display text-2xl sm:text-3xl">Programmes bientôt disponibles</h2>
            <p className="mt-3 text-muted-foreground">
              De nouveaux programmes seront publiés prochainement. Contactez-nous pour toute
              demande.
            </p>
            <Link to="/contact" className="btn-primary mt-6 inline-flex">
              Nous contacter
            </Link>
          </Reveal>
        ) : (
          <StaggerGroup className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {circuits.map((t) => (
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
