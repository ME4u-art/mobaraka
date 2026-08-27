import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { IMG } from "@/lib/tours";
import { Users, Mic, Building2, Sparkles } from "lucide-react";
import { Reveal } from "@/components/motion/Reveal";
import { StaggerGroup, StaggerItem } from "@/components/motion/Stagger";
import businessNewspaper from "@/assets/mice/business-newspaper.jpg";
import streetProfessionals from "@/assets/mice/street-professionals.jpg";
import skyscrapersBlue from "@/assets/mice/skyscrapers-blue.jpg";
import skyscrapersDusk from "@/assets/mice/skyscrapers-dusk.jpg";
import teamCoworking from "@/assets/mice/team-coworking.jpg";
import { agency, isEnabled, notFoundHead } from "@/config/agency";

const miceGallery = [
  businessNewspaper,
  streetProfessionals,
  skyscrapersBlue,
  skyscrapersDusk,
  teamCoworking,
];

export const Route = createFileRoute("/mice")({
  beforeLoad: () => {
    if (!isEnabled("mice")) throw notFound();
  },
  head: () =>
    !isEnabled("mice")
      ? notFoundHead()
      : {
          meta: [
            { title: `MICE — Séminaires, congrès & incentives | ${agency.identity.name}` },
            {
              name: "description",
              content: `Organisation de séminaires, conférences, congrès et voyages incentives. ${agency.identity.name} MICE.`,
            },
            { property: "og:title", content: `MICE — ${agency.identity.name}` },
            {
              property: "og:description",
              content: "Séminaires, conférences, congrès et voyages incentives.",
            },
            { property: "og:image", content: IMG.marrakech },
          ],
        },
  component: () => (
    <div className="min-h-screen">
      <Header />
      <section className="pt-40 pb-16 bg-sand">
        <div className="container-page grid items-center gap-10 md:grid-cols-2">
          <Reveal>
            <div className="text-xs font-semibold uppercase tracking-widest text-primary">MICE</div>
            <h1 className="mt-2 font-display text-5xl sm:text-6xl">
              Meetings, Incentives, Conferences & Exhibitions
            </h1>
            <p className="mt-4 text-muted-foreground">
              De la conception à la logistique, nous imaginons et produisons des événements
              professionnels sur mesure, au Maroc et à l'international.
            </p>
            <Link to="/contact" className="btn-primary mt-6 hover:-translate-y-0.5">
              Demander un devis
            </Link>
          </Reveal>
          <div className="grid grid-cols-2 gap-3">
            <img
              src={businessNewspaper}
              alt=""
              className="aspect-square rounded-2xl object-cover"
            />
            <img
              src={skyscrapersBlue}
              alt=""
              className="aspect-square rounded-2xl object-cover mt-8"
            />
            <img
              src={streetProfessionals}
              alt=""
              className="aspect-square rounded-2xl object-cover"
            />
            <img
              src={skyscrapersDusk}
              alt=""
              className="aspect-square rounded-2xl object-cover mt-8"
            />
          </div>
        </div>
      </section>
      <StaggerGroup className="container-page py-16 grid gap-6 md:grid-cols-4">
        {[
          { icon: Users, t: "Meetings", d: "Réunions d'entreprise clé en main." },
          { icon: Sparkles, t: "Incentives", d: "Voyages de motivation & récompenses." },
          { icon: Mic, t: "Conferences", d: "Congrès professionnels & scientifiques." },
          { icon: Building2, t: "Exhibitions", d: "Salons et événements grand format." },
        ].map(({ icon: I, t, d }) => (
          <StaggerItem key={t} className="rounded-3xl border border-border p-6">
            <I className="h-6 w-6 text-primary" />
            <h3 className="mt-4 font-display text-xl">{t}</h3>
            <p className="mt-2 text-sm text-muted-foreground">{d}</p>
          </StaggerItem>
        ))}
      </StaggerGroup>
      <section className="container-page pb-16">
        <Reveal>
          <h2 className="font-display text-3xl sm:text-4xl">Nos événements en images</h2>
        </Reveal>
        <StaggerGroup className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-3">
          {miceGallery.map((src, i) => (
            <StaggerItem
              key={i}
              className={`overflow-hidden rounded-2xl ${i === 0 ? "col-span-2 aspect-[16/9] md:col-span-1 md:aspect-square" : "aspect-square"}`}
            >
              <img src={src} alt="" loading="lazy" className="h-full w-full object-cover" />
            </StaggerItem>
          ))}
        </StaggerGroup>
      </section>
      <Footer />
    </div>
  ),
});
