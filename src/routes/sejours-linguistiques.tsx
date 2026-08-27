import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { TourCard } from "@/components/site/TourCard";
import { StaggerGroup, StaggerItem } from "@/components/motion/Stagger";
import { Reveal } from "@/components/motion/Reveal";
import { agency, isEnabled, notFoundHead } from "@/config/agency";
import { content } from "@/lib/content";
import { ListingSkeleton } from "@/components/site/Skeleton";

export const Route = createFileRoute("/sejours-linguistiques")({
  beforeLoad: () => {
    if (!isEnabled("languageStays")) throw notFound();
  },
  loader: async () => ({ stays: await content.getLanguageStays() }),
  head: () =>
    !isEnabled("languageStays")
      ? notFoundHead()
      : {
          meta: [
            { title: `Séjours linguistiques — ${agency.identity.name}` },
            {
              name: "description",
              content:
                "Séjours linguistiques et immersions culturelles à l'étranger, pour jeunes et adultes.",
            },
            { property: "og:title", content: `Séjours linguistiques — ${agency.identity.name}` },
            { property: "og:description", content: "Nos séjours linguistiques." },
          ],
        },
  component: LanguageStaysPage,
  pendingComponent: () => (
    <ListingSkeleton eyebrow="Séjours linguistiques" title="Séjours linguistiques" />
  ),
});

function LanguageStaysPage() {
  const { stays } = Route.useLoaderData();
  return (
    <div className="min-h-screen">
      <Header />
      <div className="pt-40 pb-16 bg-sand">
        <div className="container-page">
          <div className="text-xs font-semibold uppercase tracking-widest text-primary">
            Séjours linguistiques
          </div>
          <h1 className="mt-2 font-display text-5xl sm:text-6xl">Séjours linguistiques</h1>
          <p className="mt-4 max-w-2xl text-muted-foreground">
            Immersions linguistiques et culturelles à l'étranger — apprendre une langue tout en
            découvrant un pays.
          </p>
        </div>
      </div>
      <div className="container-page py-12">
        {stays.length === 0 ? (
          <Reveal className="mx-auto max-w-xl rounded-3xl border border-border bg-sand px-8 py-16 text-center">
            <h2 className="font-display text-2xl sm:text-3xl">Séjours bientôt disponibles</h2>
            <p className="mt-3 text-muted-foreground">
              De nouveaux séjours seront publiés prochainement. Contactez-nous pour toute demande.
            </p>
            <Link to="/contact" className="btn-primary mt-6 inline-flex">
              Nous contacter
            </Link>
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
