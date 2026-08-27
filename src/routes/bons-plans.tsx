import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { TourCard } from "@/components/site/TourCard";
import { StaggerGroup, StaggerItem } from "@/components/motion/Stagger";
import { Reveal } from "@/components/motion/Reveal";
import { agency, isEnabled, notFoundHead } from "@/config/agency";
import { content } from "@/lib/content";
import { ListingSkeleton } from "@/components/site/Skeleton";

export const Route = createFileRoute("/bons-plans")({
  beforeLoad: () => {
    if (!isEnabled("greatDeals")) throw notFound();
  },
  loader: async () => ({ deals: await content.getGreatDeals() }),
  head: () =>
    !isEnabled("greatDeals")
      ? notFoundHead()
      : {
          meta: [
            { title: `Bons plans — ${agency.identity.name}` },
            {
              name: "description",
              content:
                "Nos offres et promotions du moment — voyages à prix réduit, places limitées.",
            },
            { property: "og:title", content: `Bons plans — ${agency.identity.name}` },
            { property: "og:description", content: "Nos offres et promotions du moment." },
          ],
        },
  component: GreatDealsPage,
  pendingComponent: () => <ListingSkeleton eyebrow="Bons plans" title="Bons plans" />,
});

function GreatDealsPage() {
  const { deals } = Route.useLoaderData();
  return (
    <div className="min-h-screen">
      <Header />
      <div className="pt-40 pb-16 bg-sand">
        <div className="container-page">
          <div className="text-xs font-semibold uppercase tracking-widest text-primary">
            Bons plans
          </div>
          <h1 className="mt-2 font-display text-5xl sm:text-6xl">Nos offres du moment</h1>
          <p className="mt-4 max-w-2xl text-muted-foreground">
            Promotions et départs à prix réduit — places limitées, premiers arrivés, premiers
            servis.
          </p>
        </div>
      </div>
      <div className="container-page py-12">
        {deals.length === 0 ? (
          <Reveal className="mx-auto max-w-xl rounded-3xl border border-border bg-sand px-8 py-16 text-center">
            <h2 className="font-display text-2xl sm:text-3xl">Aucune offre en ce moment</h2>
            <p className="mt-3 text-muted-foreground">
              Revenez bientôt, ou contactez-nous pour connaître nos meilleures dates.
            </p>
            <Link to="/contact" className="btn-primary mt-6 inline-flex">
              Nous contacter
            </Link>
          </Reveal>
        ) : (
          <StaggerGroup className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {deals.map((t) => (
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
