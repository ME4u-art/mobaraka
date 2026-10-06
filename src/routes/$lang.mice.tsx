import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useLocale, useT, tFor } from "@/i18n";
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

export const Route = createFileRoute("/$lang/mice")({
  beforeLoad: () => {
    if (!isEnabled("mice")) throw notFound();
  },
  head: ({ params }) =>
    !isEnabled("mice")
      ? notFoundHead(tFor(params.lang)("error.notFoundTitle"))
      : {
          meta: [
            { title: tFor(params.lang)("meta.mice.title") },
            { name: "description", content: tFor(params.lang)("meta.mice.desc") },
            { property: "og:title", content: tFor(params.lang)("meta.mice.title") },
            { property: "og:description", content: tFor(params.lang)("meta.mice.desc") },
            { property: "og:image", content: IMG.marrakech },
          ],
        },
  component: function RouteComponent() {
    const lang = useLocale();
    const t = useT();
    return (
    <div className="min-h-screen">
      <Header />
      <section className="pt-40 pb-16 bg-sand">
        <div className="container-page grid items-center gap-10 md:grid-cols-2">
          <Reveal>
            <div className="text-xs font-semibold uppercase tracking-widest text-primary">{t("home.miceEyebrow")}</div>
            <h1 className="mt-2 font-display text-5xl sm:text-6xl">{t("mice.title")}</h1>
            <p className="mt-4 text-muted-foreground">{t("mice.leadTemplate")}</p>
            <Link to="/$lang/contact" params={{ lang }} className="btn-primary mt-6 hover:-translate-y-0.5">
              {t("mice.quote")}
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
        {([
          { icon: Users, t: "mice.meetings", d: "mice.meetingsDesc" },
          { icon: Sparkles, t: "mice.incentives", d: "mice.incentivesDesc" },
          { icon: Mic, t: "mice.conferences", d: "mice.conferencesDesc" },
          { icon: Building2, t: "mice.exhibitions", d: "mice.exhibitionsDesc" },
        ] as const).map(({ icon: I, t: titleKey, d: descKey }) => (
          <StaggerItem key={titleKey} className="rounded-3xl border border-border p-6">
            <I className="h-6 w-6 text-primary" />
            <h3 className="mt-4 font-display text-xl">{t(titleKey)}</h3>
            <p className="mt-2 text-sm text-muted-foreground">{t(descKey)}</p>
          </StaggerItem>
        ))}
      </StaggerGroup>
      <section className="container-page pb-16">
        <Reveal>
          <h2 className="font-display text-3xl sm:text-4xl">{t("mice.gallery")}</h2>
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
    );
  },
});
