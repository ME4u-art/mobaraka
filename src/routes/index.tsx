import { createFileRoute, Link } from "@tanstack/react-router";
import { useCallback, useMemo, useState, useEffect, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import useEmblaCarousel from "embla-carousel-react";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { TourCard } from "@/components/site/TourCard";
import { IMG, type Tour } from "@/lib/tours";
import { content } from "@/lib/content";
import { DetailSkeleton } from "@/components/site/Skeleton";
import type { OmraProgram } from "@/lib/omra";
import { agencyPartners } from "@/lib/partners";
import businessNewspaper from "@/assets/mice/business-newspaper.jpg";
import streetProfessionals from "@/assets/mice/street-professionals.jpg";
import skyscrapersBlue from "@/assets/mice/skyscrapers-blue.jpg";
import skyscrapersDusk from "@/assets/mice/skyscrapers-dusk.jpg";
import teamCoworking from "@/assets/mice/team-coworking.jpg";
import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Compass,
  Shield,
  Sparkles,
  Users,
} from "lucide-react";
import { Reveal } from "@/components/motion/Reveal";
import { StaggerGroup, StaggerItem } from "@/components/motion/Stagger";
import { HoverScale } from "@/components/motion/HoverScale";
import { agency, isEnabled } from "@/config/agency";

export const Route = createFileRoute("/")({
  // Hero pool = all programmes; strip pool = voyages organisés.
  // Both read the same cached WP fetch (30s TTL) — one request total.
  loader: async () => ({
    heroTours: await content.getTours(),
    voyages: await content.getVoyagesOrganises(),
    circuits: await content.getCircuits(),
    cruises: await content.getCruises(),
    languageStays: await content.getLanguageStays(),
    deals: await content.getGreatDeals(),
    omra: await content.getOmraPrograms(),
    home: await content.getHomeSections(),
  }),
  pendingComponent: DetailSkeleton,
  head: () => ({
    meta: [
      { title: agency.seo.title },
      { name: "description", content: agency.seo.description },
      { property: "og:title", content: agency.seo.title },
      { property: "og:description", content: agency.seo.description },
      { property: "og:type", content: "website" },
    ],
  }),
  component: HomePage,
});

function HomePage() {
  const { heroTours, voyages, circuits, cruises, languageStays, deals, omra, home } =
    Route.useLoaderData();
  // Section visibility = template feature (agency.ts, master switch) AND the
  // client's wp-admin « Page d'accueil » choice. Never configured → all shown.
  const wants = (k: keyof NonNullable<typeof home>) => home?.[k] ?? true;
  return (
    <div className="min-h-screen">
      <Header />
      <Hero tours={heroTours} voyages={voyages} omra={omra} />
      {/* pb: bottom breathing room lives on the wrapper, not on the last
          section — sections can be hidden from wp-admin in any combination */}
      <div className="pb-16 sm:pb-24">
        {isEnabled("omra") && wants("omra") && omra.length > 0 && <OmraTeaser programs={omra} />}
        {isEnabled("voyagesOrganises") && wants("voyages") && voyages.length > 0 && (
          <FeaturedTours tours={voyages} />
        )}
        {isEnabled("circuits") && wants("circuits") && circuits.length > 0 && (
          <CollectionSection
            eyebrow="Découvrir le Royaume"
            title="Circuit au Maroc"
            to="/circuits"
            linkLabel="Voir tous les circuits"
            tours={circuits}
          />
        )}
        {isEnabled("cruises") && wants("cruises") && cruises.length > 0 && (
          <CollectionSection
            eyebrow="Prendre le large"
            title="Croisières"
            to="/croisieres"
            linkLabel="Voir toutes les croisières"
            tours={cruises}
          />
        )}
        {isEnabled("languageStays") && wants("languageStays") && languageStays.length > 0 && (
          <CollectionSection
            eyebrow="Apprendre ailleurs"
            title="Séjours linguistiques"
            to="/sejours-linguistiques"
            linkLabel="Voir tous les séjours"
            tours={languageStays}
          />
        )}
        {isEnabled("greatDeals") && wants("greatDeals") && deals.length > 0 && (
          <CollectionSection
            eyebrow="Offres du moment"
            title="Bons plans"
            to="/bons-plans"
            linkLabel="Voir tous les bons plans"
            tours={deals}
          />
        )}
        <PillarStrip />
        {isEnabled("mice") && wants("mice") && <MICE />}
        {wants("partners") && agencyPartners(agency.partners).length > 0 && <Partners />}
      </div>
      <Footer />
    </div>
  );
}

type HeroSlide = {
  kind: "tour" | "omra" | "welcome";
  slug: string;
  image: string;
  badge: string;
  title: string;
  accent: string; // optional italic tail of the headline ("" = title only)
  subtitle: string;
  price: string;
};

/**
 * Shown when the provider has no programmes at all — a fresh copy of the
 * template, or a client whose WordPress is still empty. It links to /contact
 * rather than a programme page, because there is no programme to link to.
 */
const welcomeSlide = (): HeroSlide => ({
  kind: "welcome",
  slug: "welcome",
  image: IMG.hero,
  badge: agency.identity.tagline,
  title: agency.identity.name,
  accent: "",
  subtitle: agency.seo.description,
  price: "Sur demande",
});

const omraToSlide = (p: OmraProgram): HeroSlide => ({
  kind: "omra",
  slug: p.slug,
  image: p.image || IMG.hajj,
  badge: "OMRA",
  title: "OMRA",
  accent: "un pèlerinage accompagné.",
  subtitle:
    "Hôtels proches du Haram, encadrement religieux complet et vol direct — plusieurs départs.",
  price: `À partir de ${p.priceFrom}`,
});

const tourToSlide = (t: Tour): HeroSlide => ({
  kind: "tour",
  slug: t.slug,
  image: t.image,
  badge: t.dates || "Nouveaux programmes",
  title: t.title,
  accent: "",
  subtitle: t.subtitle,
  price: t.price,
});

/**
 * Hero carousel content, in order of preference:
 *   1. programmes flagged « À la une (hero) » in wp-admin — any type, an
 *      explicit check is an explicit choice (a circuit CAN be featured)
 *   2. else the first 3 VOYAGES ORGANISÉS — circuits never reach the hero
 *      automatically, they live on their own page
 *   3. else (no programmes at all) the bundled demo slides
 * OMRA slide appends when the feature is on (OMRA content is local in v1).
 */
function buildSlides(all: Tour[], voyages: Tour[], omra: OmraProgram[]): HeroSlide[] {
  const flagged = all.filter((t) => t.featuredHero);
  const pool = flagged.length ? flagged : voyages.slice(0, 3);
  const tourSlides = pool.map(tourToSlide);
  const slides = [
    ...(isEnabled("voyagesOrganises") ? tourSlides : []),
    ...(isEnabled("omra") && omra.length ? [omraToSlide(omra[0])] : []),
  ];
  return slides.length ? slides : [welcomeSlide()];
}

function Hero({ tours, voyages, omra }: { tours: Tour[]; voyages: Tour[]; omra: OmraProgram[] }) {
  const heroSlides = useMemo(() => buildSlides(tours, voyages, omra), [tours, voyages, omra]);
  const [i, setI] = useState(0);
  const paused = useRef(false);
  const touchX = useRef<number | null>(null);

  const goTo = useCallback(
    (idx: number) => {
      setI(((idx % heroSlides.length) + heroSlides.length) % heroSlides.length);
    },
    [heroSlides.length],
  );

  useEffect(() => {
    if (heroSlides.length < 2) return;
    const t = setInterval(() => {
      if (!paused.current && !document.hidden) setI((p) => (p + 1) % heroSlides.length);
    }, 6000);
    return () => clearInterval(t);
  }, [heroSlides.length]);

  if (!heroSlides.length) return null;
  const slide = heroSlides[Math.min(i, heroSlides.length - 1)];

  return (
    <section
      className="relative min-h-[92svh] w-full overflow-hidden"
      onMouseEnter={() => (paused.current = true)}
      onMouseLeave={() => (paused.current = false)}
      onTouchStart={(e) => {
        paused.current = true;
        touchX.current = e.touches[0].clientX;
      }}
      onTouchEnd={(e) => {
        paused.current = false;
        if (touchX.current === null) return;
        const dx = e.changedTouches[0].clientX - touchX.current;
        touchX.current = null;
        if (Math.abs(dx) > 48) goTo(dx < 0 ? i + 1 : i - 1);
      }}
    >
      {/* cross-fading programme photos with a slow Ken Burns drift */}
      {heroSlides.map((s, idx) => (
        <img
          key={s.slug}
          src={s.image}
          alt={s.title}
          loading={idx === 0 ? "eager" : "lazy"}
          fetchPriority={idx === 0 ? "high" : "low"}
          className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-1000 ${idx === i ? "hero-kenburns opacity-100" : "opacity-0"}`}
        />
      ))}
      <div className="absolute inset-0 bg-black/40" />
      <div className="absolute inset-0 bg-gradient-to-t from-background via-black/10 to-black/30" />

      {/* centered slide content */}
      <div className="relative z-10 flex min-h-[92svh] items-center justify-center px-14 pb-24 pt-36 sm:px-20 sm:pt-40">
        <div className="w-full max-w-4xl">
          <AnimatePresence mode="wait">
            <motion.div
              key={slide.slug}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="flex flex-col items-center text-center"
            >
              <span className="inline-flex items-center gap-2 rounded-full border border-white/40 bg-white/15 px-4 py-1.5 text-[11px] font-medium uppercase tracking-widest text-white backdrop-blur sm:text-xs">
                <Sparkles className="h-3.5 w-3.5" /> {slide.badge}
              </span>
              <h1 className="mt-5 font-display text-[2.5rem] leading-[1.05] text-white drop-shadow-md sm:mt-6 sm:text-5xl sm:leading-[1.05] md:text-6xl lg:text-7xl">
                {slide.accent ? (
                  <>
                    {slide.title}, <em className="not-italic text-accent">{slide.accent}</em>
                  </>
                ) : (
                  slide.title
                )}
              </h1>
              <p className="mt-4 max-w-2xl text-[15px] text-white/90 drop-shadow sm:mt-5 sm:text-xl">
                {slide.subtitle}
              </p>
              {slide.kind !== "welcome" && (
                <div className="mt-7 inline-flex items-baseline gap-2 rounded-full border border-white/60 bg-white/10 px-7 py-2.5 text-white backdrop-blur sm:mt-8">
                  {slide.price !== "Sur demande" && (
                    <span className="text-sm opacity-80">À partir de</span>
                  )}
                  <span className="font-display text-2xl font-semibold sm:text-3xl">
                    {slide.price.replace("À partir de ", "")}
                  </span>
                </div>
              )}
              <HoverScale className="mt-6">
                {slide.kind === "welcome" ? (
                  <Link to="/contact" className="btn-primary">
                    Nous contacter <ArrowRight className="h-4 w-4" />
                  </Link>
                ) : slide.kind === "omra" ? (
                  <Link to="/omra/$slug" params={{ slug: slide.slug }} className="btn-primary">
                    Découvrir notre offre <ArrowRight className="h-4 w-4" />
                  </Link>
                ) : (
                  <Link to="/voyages/$slug" params={{ slug: slide.slug }} className="btn-primary">
                    Découvrir notre offre <ArrowRight className="h-4 w-4" />
                  </Link>
                )}
              </HoverScale>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* side arrows — vertically centered on the edges */}
      <button
        onClick={() => goTo(i - 1)}
        aria-label="Programme précédent"
        className="absolute left-2 top-1/2 z-20 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/40 bg-white/10 text-white backdrop-blur transition hover:bg-white/25 sm:left-6 sm:h-12 sm:w-12"
      >
        <ChevronLeft className="h-6 w-6" />
      </button>
      <button
        onClick={() => goTo(i + 1)}
        aria-label="Programme suivant"
        className="absolute right-2 top-1/2 z-20 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/40 bg-white/10 text-white backdrop-blur transition hover:bg-white/25 sm:right-6 sm:h-12 sm:w-12"
      >
        <ChevronRight className="h-6 w-6" />
      </button>

      {/* dots — centered at the bottom */}
      <div className="absolute inset-x-0 bottom-6 z-20 flex justify-center sm:bottom-8">
        {heroSlides.map((s, idx) => (
          <button
            key={s.slug}
            onClick={() => goTo(idx)}
            aria-label={`Aller au programme ${idx + 1}`}
            className="group flex h-9 items-center px-2"
          >
            <span
              className={`h-2 rounded-full transition-all duration-300 ${idx === i ? "w-8 bg-white" : "w-2 bg-white/50 group-hover:bg-white/80"}`}
            />
          </button>
        ))}
      </div>
    </section>
  );
}

function FeaturedTours({ tours }: { tours: Tour[] }) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ align: "center", loop: true });
  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  // « Programme vedette » picks win, else every voyage in the collection.
  const flagged = tours.filter((t) => t.featuredHome);
  const shown = flagged.length ? flagged : tours;

  return (
    <section className="relative mt-16 overflow-hidden py-4 sm:mt-20">
      {/* centered header + pill */}
      <Reveal className="container-page mb-8 flex flex-col items-center text-center sm:mb-10">
        <div className="eyebrow-hand">Envie d'ailleurs ?</div>
        <h2 className="mt-1 font-display text-3xl sm:text-4xl md:text-5xl">Voyages organisés</h2>
        <span className="mt-4 inline-flex items-center gap-2 rounded-full bg-secondary px-5 py-2 text-sm font-semibold text-primary">
          <span aria-hidden>•</span> Tarif avec billet d'avion <span aria-hidden>•</span>
        </span>
      </Reveal>

      {/* decorative yellow arc (echoes terratour's drawn line) */}
      <svg
        className="pointer-events-none absolute left-0 right-0 top-24 -z-0 mx-auto hidden h-64 w-full max-w-[1300px] md:block"
        viewBox="0 0 1300 260"
        fill="none"
        preserveAspectRatio="none"
        aria-hidden
      >
        <path
          d="M-20 240 C 250 40, 520 40, 650 120 S 1050 240, 1320 40"
          stroke="var(--brand-yellow)"
          strokeWidth="6"
          strokeLinecap="round"
        />
      </svg>

      <div className="relative">
        <div className="container-page">
          <div className="overflow-visible" ref={emblaRef}>
            <div className="-ml-6 flex">
              {shown.map((t) => (
                <div
                  key={t.slug}
                  className="min-w-0 shrink-0 grow-0 basis-[82%] pl-6 sm:basis-[46%] lg:basis-[33.333%]"
                >
                  <TourCard tour={t} />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* yellow circular nav arrows */}
        <button
          onClick={scrollPrev}
          aria-label="Précédent"
          className="absolute left-2 top-1/2 z-20 hidden h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-brand-yellow text-white shadow-lg transition hover:brightness-105 sm:flex md:left-6 md:h-14 md:w-14"
        >
          <ChevronLeft className="h-6 w-6" />
        </button>
        <button
          onClick={scrollNext}
          aria-label="Suivant"
          className="absolute right-2 top-1/2 z-20 hidden h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-brand-yellow text-white shadow-lg transition hover:brightness-105 sm:flex md:right-6 md:h-14 md:w-14"
        >
          <ChevronRight className="h-6 w-6" />
        </button>
      </div>

      <div className="container-page mt-10 text-center">
        <Link
          to="/voyages-organises"
          className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:gap-3 transition-all"
        >
          Voir tous les voyages <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </section>
  );
}

/**
 * Home « Circuit au Maroc » — only rendered when circuits exist (feature on
 * + at least one circuit programme). « Programme vedette » picks come first;
 * capped at 3 so the home stays tidy — the full list lives on /circuits.
 */
/**
 * One home section per tour collection (circuits, croisières, séjours,
 * bons plans). Programmes flagged « Programme vedette » in wp-admin win;
 * otherwise the first three of the collection stand in.
 */
function CollectionSection({
  eyebrow,
  title,
  to,
  linkLabel,
  tours,
}: {
  eyebrow: string;
  title: string;
  to: string;
  linkLabel: string;
  tours: Tour[];
}) {
  const flagged = tours.filter((t) => t.featuredHome);
  const shown = (flagged.length ? flagged : tours).slice(0, 3);
  return (
    <section className="mt-16 sm:mt-24">
      <Reveal className="container-page mb-8 flex flex-col items-center text-center sm:mb-10">
        <div className="eyebrow-hand">{eyebrow}</div>
        <h2 className="mt-1 font-display text-3xl sm:text-4xl md:text-5xl">{title}</h2>
      </Reveal>
      <div className="container-page">
        <StaggerGroup className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {shown.map((t) => (
            <StaggerItem key={t.slug}>
              <TourCard tour={t} />
            </StaggerItem>
          ))}
        </StaggerGroup>
      </div>
      <div className="container-page mt-10 text-center">
        <Link
          to={to}
          className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:gap-3 transition-all"
        >
          {linkLabel} <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </section>
  );
}

const pillars = [
  {
    icon: Compass,
    title: "20+ destinations",
    desc: "Asie, Europe, Amériques, Afrique — la planète à portée de main.",
  },
  {
    icon: Users,
    title: "Voyages en groupe",
    desc: "Guides francophones, ambiance conviviale, moments partagés.",
  },
  {
    icon: Shield,
    title: "Agence de confiance",
    desc: "Une équipe à votre écoute avant, pendant et après votre voyage.",
  },
  {
    icon: Sparkles,
    title: "Sur mesure",
    desc: "Chaque voyage se compose autour de vous, selon vos envies.",
  },
];

function PillarStrip() {
  return (
    <section className="mt-16 sm:mt-24">
      <div className="container-page">
        <StaggerGroup className="grid gap-5 rounded-3xl border border-border bg-sand p-6 sm:grid-cols-2 sm:p-8 lg:grid-cols-4 lg:p-10">
          {pillars.map(({ icon: Icon, title, desc }) => (
            <StaggerItem key={title} className="flex gap-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-primary/15 text-primary">
                <Icon className="h-5 w-5" />
              </div>
              <div>
                <div className="font-display text-lg">{title}</div>
                <p className="mt-1 text-sm text-muted-foreground">{desc}</p>
              </div>
            </StaggerItem>
          ))}
        </StaggerGroup>
      </div>
    </section>
  );
}

function OmraTeaser({ programs }: { programs: OmraProgram[] }) {
  return (
    <section className="mt-16 sm:mt-24">
      <Reveal className="container-page mb-6 flex flex-col items-center text-center sm:mb-8">
        <div className="eyebrow-hand">Terres saintes</div>
        <h2 className="mt-1 font-display text-3xl sm:text-4xl">OMRA &amp; Hajj</h2>
      </Reveal>
      <div className="container-page grid gap-4 sm:gap-6 md:grid-cols-2">
        {programs.slice(0, 2).map((p, i) => (
          <Reveal key={p.slug} delay={i * 0.1}>
            <Link
              to="/omra/$slug"
              params={{ slug: p.slug }}
              className="group relative overflow-hidden rounded-3xl block"
            >
              <img
                src={p.image}
                alt={p.title}
                loading="lazy"
                width={1200}
                height={800}
                className="h-72 w-full object-cover transition duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-7 text-white">
                <span className="rounded-full bg-accent px-3 py-1 text-xs font-bold text-accent-foreground">
                  OMRA
                </span>
                <h3 className="mt-3 font-display text-3xl">{p.title}</h3>
                <p className="mt-2 text-sm opacity-90">À partir de {p.priceFrom}</p>
              </div>
            </Link>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

function MICE() {
  return (
    <section className="mt-16 sm:mt-24">
      <Reveal className="container-page grid gap-8 rounded-3xl bg-foreground p-6 text-background sm:p-8 md:grid-cols-2 md:p-14">
        <div>
          <div className="eyebrow-hand">MICE</div>
          <h2 className="mt-1 font-display text-4xl sm:text-5xl">
            Meetings, Incentives, Conferences &amp; Exhibitions
          </h2>
          <p className="mt-4 opacity-80">
            {agency.identity.name} vous accompagne dans l'organisation de séminaires, conférences,
            congrès et voyages incentives. De la conception à la logistique, nous créons des
            expériences professionnelles mémorables.
          </p>
          <Link to="/mice" className="btn-primary mt-6 hover:-translate-y-0.5">
            En savoir plus <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 sm:gap-3">
          {[
            businessNewspaper,
            skyscrapersBlue,
            streetProfessionals,
            teamCoworking,
            skyscrapersDusk,
          ].map((src, i) => (
            <div
              key={i}
              className={`overflow-hidden rounded-2xl ${i % 4 === 0 ? "row-span-2 aspect-[3/5]" : "aspect-square"}`}
            >
              <img src={src} alt="" loading="lazy" className="h-full w-full object-cover" />
            </div>
          ))}
        </div>
      </Reveal>
    </section>
  );
}

function Partners() {
  // Which logos this client shows comes from agency.ts; tripled so the
  // marquee can scroll seamlessly.
  const shown = agencyPartners(agency.partners);
  const loop = [...shown, ...shown, ...shown];
  return (
    <section className="mt-16 sm:mt-24">
      <div className="container-page">
        <Reveal>
          <div className="text-center eyebrow-hand">Ils nous font confiance</div>
          <h2 className="mt-1 text-center font-display text-3xl sm:text-4xl">Nos partenaires</h2>
          <div className="mt-8 overflow-hidden rounded-3xl border border-border">
            <div className="partners-track">
              {loop.map((p, i) => (
                <div
                  key={`${p.name}-${i}`}
                  className="flex h-28 w-48 shrink-0 items-center justify-center border-l border-border py-6 first:border-l-0"
                >
                  <img
                    src={p.logo}
                    alt={p.name}
                    className={`${p.tall ? "max-h-16" : "max-h-10"} max-w-[75%] object-contain`}
                  />
                </div>
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
