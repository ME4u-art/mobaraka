import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useLocale, useT, tFor, money } from "@/i18n";
import { useRef, useState } from "react";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { IMG } from "@/lib/tours";
import { agencyPhones, agencyAddresses, localizeProgram } from "@/lib/omra";
import { agency, isEnabled, notFoundHead } from "@/config/agency";
import { content } from "@/lib/content";
import { DetailSkeleton } from "@/components/site/Skeleton";
import { Reveal } from "@/components/motion/Reveal";
import { StaggerGroup, StaggerItem } from "@/components/motion/Stagger";
import {
  Plane,
  Building2,
  Bus,
  MapPin,
  UserCheck,
  BadgeCheck,
  Check,
  Phone,
  CalendarDays,
  ArrowLeft,
} from "lucide-react";

export const Route = createFileRoute("/$lang/omra/")({
  beforeLoad: () => {
    if (!isEnabled("omra")) throw notFound();
  },
  loader: async () => ({
    omraPrograms: await content.getOmraPrograms(),
    photos: isEnabled("gallery") ? await content.getGalleryPhotos() : [],
  }),
  head: ({ params }) =>
    !isEnabled("omra")
      ? notFoundHead(tFor(params.lang)("error.notFoundTitle"))
      : {
          meta: [
            { title: tFor(params.lang)("meta.hajj.title") },
            {
              name: "description",
              content: tFor(params.lang)("meta.hajj.desc"),
            },
            { property: "og:title", content: tFor(params.lang)("meta.hajj.title") },
            {
              property: "og:description",
              content: tFor(params.lang)("meta.hajj.ogDesc"),
            },
            { property: "og:image", content: IMG.hajj },
          ],
        },
  component: OmraIndex,
  pendingComponent: DetailSkeleton,
});

/**
 * The two halves of the section. A card is only shown once the agency has a
 * programme of that kind: an empty one reads "coming soon", which is a
 * promise the agency never made — and Hajj in particular is not something a
 * Moroccan agency can simply decide to sell.
 */
const CATEGORY_CARDS = [
  { key: "omra" as const, title: "hajj.omra", image: "/Hajj.jpg", desc: "hajj.omraCardDesc" },
  { key: "hajj" as const, title: "hajj.hajj", image: IMG.hajj, desc: "hajj.hajjCardDesc" },
] as const;

const services = [
  { icon: Plane, label: "hajj.svcFlight" },
  { icon: Building2, label: "hajj.svcHotel" },
  { icon: Bus, label: "hajj.svcTransfers" },
  { icon: MapPin, label: "hajj.svcVisits" },
  { icon: UserCheck, label: "hajj.svcGuide" },
  { icon: BadgeCheck, label: "hajj.svcVisa" },
] as const;

const whyUs = [
  "hajj.why1",
  "hajj.why2",
  "hajj.why3",
  "hajj.why4",
  "hajj.why5",
  "hajj.why6",
] as const;

function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <div className="text-sm font-bold" style={{ color: "var(--brand-yellow)" }}>
      {children}
    </div>
  );
}

function OmraIndex() {
  const lang = useLocale();
  const t = useT();
  const { omraPrograms: rawPrograms, photos } = Route.useLoaderData();
  const omraPrograms = rawPrograms.map((p) => localizeProgram(p, lang));
  const categories = CATEGORY_CARDS.filter((c) => omraPrograms.some((p) => p.category === c.key));
  // اختر أولاً: عمرة أم حج — ثم تظهر برامج النوع المختار.
  // One category is not a choice, so it is made for the visitor and the
  // chooser below never renders.
  const [cat, setCat] = useState<"omra" | "hajj" | null>(
    categories.length === 1 ? categories[0].key : null,
  );
  const programsRef = useRef<HTMLElement>(null);
  const shown = cat ? omraPrograms.filter((p) => p.category === cat) : [];
  const chooseCat = (c: "omra" | "hajj") => {
    setCat(c);
    // wait for the section to mount, then scroll to it
    setTimeout(
      () => programsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }),
      60,
    );
  };
  return (
    <div className="min-h-screen">
      <Header />

      <div>
        {/* البطل */}
        <section className="relative min-h-[70vh] overflow-hidden">
          <img
            src={IMG.hajj}
            alt={t("hajj.kaabaAlt")}
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/55 to-black/30" />
          <div className="relative z-10 flex min-h-[70vh] items-end pb-12 pt-32 sm:pb-16 sm:pt-40">
            <div className="container-page text-white">
              <Eyebrow>{t("hajj.eyebrow")}</Eyebrow>
              <h1 className="mt-2 font-display text-3xl leading-tight sm:text-6xl">
                {t("hajj.heroTitle")}
              </h1>
              <p className="mt-4 max-w-2xl text-base opacity-90 sm:text-lg">
                {t("hajj.heroLeadTemplate")}
              </p>
              <div className="mt-8 flex flex-wrap gap-3 sm:gap-4">
                {omraPrograms.map((p) => (
                  <Link
                    key={p.slug}
                    to="/$lang/omra/$slug"
                    params={{ lang, slug: p.slug }}
                    className="btn-primary hover:-translate-y-0.5"
                  >
                    {p.shortTitle} <ArrowLeft className="h-4 w-4" />
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* أولاً: اختر النوع — عمرة أم حج */}
        {categories.length > 1 && (
          <section className="py-16">
            <div className="container-page">
              <Reveal className="text-center">
                <Eyebrow>{t("hajj.ourPrograms")}</Eyebrow>
                <h2 className="mt-1 font-display text-4xl sm:text-5xl">{t("hajj.heroTitle")}</h2>
                <p className="mt-3 text-muted-foreground">{t("hajj.chooseType")}</p>
              </Reveal>

              <div className="mt-10 grid gap-6 md:grid-cols-2">
                {categories.map((c) => {
                  const count = omraPrograms.filter((p) => p.category === c.key).length;
                  const active = cat === c.key;
                  return (
                    <button
                      key={c.key}
                      onClick={() => chooseCat(c.key)}
                      className={`group relative block h-[420px] overflow-hidden rounded-3xl text-right shadow-[var(--shadow-soft)] transition hover:shadow-[var(--shadow-lift)] ${active ? "ring-4 ring-primary ring-offset-2" : ""}`}
                      aria-pressed={active}
                    >
                      <img
                        src={c.image}
                        alt={t(c.title)}
                        className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-navy/95 via-navy/45 to-primary/25" />
                      <div className="absolute inset-x-0 bottom-0 p-7 text-white sm:p-9">
                        <h3
                          className="font-display text-4xl sm:text-5xl"
                          style={{ color: "var(--brand-yellow)" }}
                        >
                          {t(c.title)}
                        </h3>
                        <p className="mt-3 text-sm leading-relaxed opacity-90 sm:text-base">
                          {t(c.desc)}
                        </p>
                        <span className="mt-4 inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-1.5 text-sm font-semibold backdrop-blur">
                          {`${count} ${t(count === 1 ? "hajj.oneProgram" : "hajj.manyPrograms")}`}{" "}
                          <ArrowLeft className="h-4 w-4 transition group-hover:-translate-x-1" />
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </section>
        )}

        {/* ثم: برامج النوع المختار */}
        {cat && (
          <section ref={programsRef} className="pb-16 pt-2 scroll-mt-24">
            <div className="container-page">
              <Reveal animateOnMount className="text-center">
                <h2 className="mt-1 font-display text-4xl sm:text-5xl">
                  {t(cat === "hajj" ? "hajj.hajjPrograms" : "hajj.omraPrograms")}
                </h2>
                <p className="mt-3 text-muted-foreground">{t("hajj.chooseLead")}</p>
              </Reveal>

              {shown.length === 0 && (
                <Reveal
                  animateOnMount
                  className="mx-auto mt-10 max-w-xl rounded-3xl border border-border bg-sand px-8 py-14 text-center"
                >
                  <h3 className="font-display text-2xl">{t("hajj.soonTitle")}</h3>
                  <p className="mt-3 text-muted-foreground">{t("hajj.soonBody")}</p>
                </Reveal>
              )}

              {/* Direct per-card animation (keyed by cat+slug) — reliably fires on
                every category switch, unlike the scroll-reveal variant which can
                leave cards mounted mid-scroll stuck at opacity 0. */}
              <div className="mt-10 grid gap-6 md:grid-cols-2">
                {shown.map((p, idx) => (
                  <div
                    key={`${cat}-${p.slug}`}
                    className="card-rise"
                    style={{ animationDelay: `${idx * 0.08}s` }}
                  >
                    <Link
                      to="/$lang/omra/$slug"
                      params={{ lang, slug: p.slug }}
                      className="group relative block h-80 overflow-hidden rounded-3xl shadow-[var(--shadow-soft)] transition hover:shadow-[var(--shadow-lift)]"
                    >
                      <img
                        src={p.image}
                        alt={p.title}
                        className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent" />
                      <div className="absolute inset-x-0 bottom-0 p-7 text-white">
                        <span className="rounded-full bg-accent px-3 py-1 text-xs font-bold text-accent-foreground">
                          {p.shortTitle}
                        </span>
                        <h3 className="mt-3 font-display text-3xl">{p.title}</h3>
                        <div className="mt-3 flex flex-wrap items-center gap-3">
                          <span className="font-semibold" style={{ color: "var(--brand-yellow)" }}>
                            {t("home.fromPrice")} <bdi dir="ltr">{money(p.priceFrom, t)}</bdi>
                          </span>
                          <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-xs backdrop-blur">
                            <CalendarDays className="h-3.5 w-3.5" /> {p.duration}
                          </span>
                        </div>
                        <span className="mt-4 inline-flex items-center gap-2 text-sm font-semibold underline-offset-4 group-hover:underline">
                          {t("hajj.seeDetails")}{" "}
                          <ArrowLeft className="h-4 w-4 transition group-hover:-translate-x-1" />
                        </span>
                      </div>
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* الخدمات المشمولة */}
        <section className="bg-sand py-16">
          <div className="container-page">
            <Reveal className="text-center">
              <Eyebrow>{t("hajj.allIncluded")}</Eyebrow>
              <h2 className="mt-1 font-display text-3xl sm:text-4xl">{t("hajj.ourServices")}</h2>
            </Reveal>
            <StaggerGroup className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
              {services.map(({ icon: Icon, label }) => (
                <StaggerItem
                  key={label}
                  className="flex flex-col items-center gap-3 rounded-2xl bg-card p-5 text-center shadow-[var(--shadow-soft)]"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <Icon className="h-6 w-6" />
                  </div>
                  <span className="text-sm font-medium">{t(label)}</span>
                </StaggerItem>
              ))}
            </StaggerGroup>
          </div>
        </section>

        {/* لماذا نحن */}
        <section className="py-16">
          <div className="container-page grid gap-10 md:grid-cols-2 md:items-center">
            <Reveal>
              <Eyebrow>{t("hajj.whyUs")}</Eyebrow>
              <h2 className="mt-1 font-display text-3xl sm:text-4xl">{t("hajj.whyTitle")}</h2>
              <ul className="mt-6 grid gap-3 sm:grid-cols-2">
                {whyUs.map((w) => (
                  <li
                    key={w}
                    className="flex items-center gap-2 rounded-xl bg-sand px-4 py-3 text-sm"
                  >
                    <Check className="h-4 w-4 shrink-0 text-primary" /> {t(w)}
                  </li>
                ))}
              </ul>
            </Reveal>
            <div className="overflow-hidden rounded-3xl">
              <img src={IMG.hajj} alt={t("nav.hajjOmra")} className="h-80 w-full object-cover" />
            </div>
          </div>
        </section>

        {/* معرض الصور — يظهر فقط إذا كانت الصور متاحة */}
        {isEnabled("gallery") && photos.length > 0 && (
          <section className="bg-sand py-16">
            <div className="container-page">
              <Reveal>
                <Eyebrow>{t("gallery.eyebrow")}</Eyebrow>
                <div className="mt-1 flex flex-wrap items-end justify-between gap-4">
                  <h2 className="font-display text-3xl sm:text-4xl">{t("gallery.title")}</h2>
                  <Link
                    to="/$lang/gallery"
                    params={{ lang }}
                    className="text-sm font-semibold text-primary hover:underline"
                  >
                    {t("hajj.seeAllPhotos")}
                  </Link>
                </div>
              </Reveal>
              <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-4">
                {photos.slice(0, 4).map((photo) => (
                  <Link
                    key={photo.id}
                    to="/$lang/gallery"
                    params={{ lang }}
                    className="group aspect-square overflow-hidden rounded-2xl skeleton shadow-[var(--shadow-soft)]"
                  >
                    <img
                      src={photo.image}
                      alt={photo.caption || t("gallery.alt")}
                      loading="lazy"
                      className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                    />
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* التواصل */}
        <section className="pb-20">
          <div className="container-page">
            <Reveal className="rounded-3xl bg-primary px-8 py-12 text-center text-white">
              <h2 className="font-display text-3xl sm:text-4xl">{t("hajj.bookNow")}</h2>
              <p className="mx-auto mt-3 max-w-xl opacity-90">{t("hajj.bookLead")}</p>
              <div className="mt-6 flex flex-wrap justify-center gap-3" dir="ltr">
                {agencyPhones.map((tel) => (
                  <a
                    key={tel}
                    href={`tel:${tel.replace(/\s/g, "")}`}
                    className="inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-2 text-sm font-medium backdrop-blur hover:bg-white/25"
                  >
                    <Phone className="h-4 w-4" /> {tel}
                  </a>
                ))}
              </div>
              <p className="mt-6 text-sm opacity-90">{agencyAddresses(lang)[0]}</p>
              {/* Only when they actually have a page: this used to print
                  "Facebook: <agency>" for every client, naming a page that
                  may not exist and not linking anywhere either way. */}
              {agency.socials.facebook && (
                <a
                  href={agency.socials.facebook}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-2 block text-sm opacity-80 hover:opacity-100"
                >
                  {t("hajj.facebook")}: {agency.identity.name}
                </a>
              )}
            </Reveal>
          </div>
        </section>
      </div>

      <Footer />
    </div>
  );
}
