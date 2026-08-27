import { createFileRoute } from "@tanstack/react-router";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { Reveal } from "@/components/motion/Reveal";
import { StaggerGroup, StaggerItem } from "@/components/motion/Stagger";
import { agency } from "@/config/agency";

export const Route = createFileRoute("/a-propos")({
  head: () => ({
    meta: [
      { title: `Qui sommes-nous ? — ${agency.identity.name}` },
      {
        name: "description",
        content: `${agency.identity.name}, agence de voyages marocaine passionnée : circuits, OMRA et MICE.`,
      },
      { property: "og:title", content: `Qui sommes-nous ? — ${agency.identity.name}` },
      { property: "og:description", content: "Notre histoire, notre équipe et notre engagement." },
    ],
  }),
  component: () => (
    <div className="min-h-screen">
      <Header />
      <section className="pt-40 pb-16 container-page max-w-3xl">
        <Reveal>
          <div className="text-xs font-semibold uppercase tracking-widest text-primary">
            À propos
          </div>
          <h1 className="mt-2 font-display text-5xl">Voyager, avec le cœur.</h1>
          <p className="mt-6 text-lg text-muted-foreground">
            {agency.identity.name} est une agence de voyages marocaine qui compose depuis des années
            des expériences soigneusement conçues : circuits au Maroc, voyages organisés, Omra &
            Hajj et voyages d'affaires.
          </p>
          <p className="mt-4 text-muted-foreground">
            Notre force : une équipe passionnée, un réseau international de partenaires triés sur le
            volet et un suivi personnalisé avant, pendant et après votre voyage.
          </p>
        </Reveal>
        <StaggerGroup className="mt-12 grid gap-6 sm:grid-cols-3">
          {[
            ["15+", "années d'expérience"],
            ["10k", "voyageurs conquis"],
            ["50+", "destinations couvertes"],
          ].map(([n, t]) => (
            <StaggerItem key={t} className="rounded-3xl bg-sand p-6 text-center">
              <div className="font-display text-4xl text-primary">{n}</div>
              <div className="mt-1 text-sm text-muted-foreground">{t}</div>
            </StaggerItem>
          ))}
        </StaggerGroup>
      </section>
      <Footer />
    </div>
  ),
});
