import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useLocale, useT, tFor, money } from "@/i18n";
import type { Localized, LocalizedList, TranslationKey } from "@/i18n";
import { useState } from "react";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import {
  agencyPhones,
  agencyAddresses,
  whatsappNumber,
  localizeProgram,
  localizeProgramFor,
} from "@/lib/omra";
import { submitBooking } from "@/lib/booking";
import { addLine, localizedAt, type CartDetail } from "@/lib/cart";
import { content } from "@/lib/content";
import { DetailSkeleton } from "@/components/site/Skeleton";
import { agency, isEnabled } from "@/config/agency";
import { Reveal } from "@/components/motion/Reveal";
import { StaggerGroup, StaggerItem } from "@/components/motion/Stagger";
import {
  Plane,
  Check,
  Phone,
  CalendarDays,
  Clock,
  ChevronLeft,
  MessageCircle,
  BadgeCheck,
} from "lucide-react";

export const Route = createFileRoute("/$lang/omra/$slug")({
  beforeLoad: () => {
    if (!isEnabled("omra")) throw notFound();
  },
  loader: async ({ params }) => {
    const program = await content.getOmraProgram(params.slug);
    if (!program) throw notFound();
    // Shared gallery (معرض الصور) — used when this programme has no photos of
    // its own, so the section shows real pictures instead of empty frames.
    const shared = isEnabled("gallery") ? await content.getGalleryPhotos() : [];
    return { program, shared };
  },
  head: ({ loaderData, params }) => {
    const p = loaderData ? localizeProgramFor(loaderData.program, params.lang) : null;
    return {
      meta: [
        {
          title: loaderData
            ? `${p!.title} — ${agency.identity.name}`
            : tFor(params.lang)("book.program"),
        },
        {
          name: "description",
          content: loaderData
            ? `${p!.description[0]} ${tFor(params.lang)("tour.from")} ${money(p!.priceFrom, tFor(params.lang))}.`
            : "",
        },
        {
          property: "og:title",
          content: loaderData ? `${p!.title} — ${agency.identity.name}` : "",
        },
        { property: "og:image", content: loaderData?.program.image ?? "" },
      ],
    };
  },
  component: ProgramDetail,
  pendingComponent: DetailSkeleton,
  notFoundComponent: function NotFoundComponent() {
    const lang = useLocale();
    const t = useT();
    return (
      <div className="min-h-screen">
        <Header />
        <div className="container-page py-40 text-center">
          <h1 className="font-display text-4xl">{t("hajj.notFound")}</h1>
          <Link to="/$lang/omra" params={{ lang }} className="btn-primary mt-6 inline-flex">
            {t("gallery.backToOmra")}
          </Link>
        </div>
        <Footer />
      </div>
    );
  },
});

function PriceTable({
  rows,
}: {
  rows: {
    label: string;
    sub?: string;
    quad: string;
    triple: string;
    double: string;
    quint?: string;
  }[];
}) {
  const t = useT();
  // Only widen the grid when at least one row actually prices a 5-share room.
  const hasQuint = rows.some((r) => r.quint);
  return (
    <>
      {/* mobile — one card per hotel, no horizontal scrolling */}
      <div className="space-y-3 sm:hidden">
        {rows.map((r) => (
          <div key={r.label} className="overflow-hidden rounded-2xl border border-border bg-card">
            <div className="bg-accent px-4 py-3 text-accent-foreground">
              <div className="text-sm font-semibold">{r.label}</div>
              {r.sub && <div className="mt-0.5 text-xs opacity-80">{r.sub}</div>}
            </div>
            <div
              className={`grid ${hasQuint ? "grid-cols-4" : "grid-cols-3"} divide-x divide-x-reverse divide-border text-center`}
            >
              {[
                { room: "hajj.roomDouble" as const, price: money(r.double, t), highlight: true },
                { room: "hajj.roomTriple" as const, price: money(r.triple, t) },
                { room: "hajj.roomQuad" as const, price: money(r.quad, t) },
                ...(hasQuint
                  ? [{ room: "hajj.roomQuint" as const, price: money(r.quint || "—", t) }]
                  : []),
              ].map((c) => (
                <div key={c.room} className="px-2 py-3">
                  <div className="text-xs text-muted-foreground">{t(c.room)}</div>
                  <div
                    dir="ltr"
                    className={`mt-1 text-sm font-semibold ${c.highlight ? "text-primary" : ""}`}
                  >
                    {c.price}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* tablet & desktop — comparison table */}
      <div className="hidden overflow-hidden rounded-2xl border border-border sm:block">
        <div
          className={`grid ${hasQuint ? "grid-cols-5" : "grid-cols-4"} gap-2 bg-accent px-4 py-3 text-center text-sm font-semibold text-accent-foreground`}
        >
          <span className="text-right">{t("hajj.hotel")}</span>
          <span>{t("hajj.roomDouble")}</span>
          <span>{t("hajj.roomTriple")}</span>
          <span>{t("hajj.roomQuad")}</span>
          {hasQuint && <span>{t("hajj.roomQuint")}</span>}
        </div>
        {rows.map((r, i) => (
          <div
            key={r.label}
            className={`grid ${hasQuint ? "grid-cols-5" : "grid-cols-4"} items-center gap-2 border-b border-border px-4 py-3 text-center text-sm last:border-0 ${i % 2 ? "bg-sand" : "bg-card"}`}
          >
            <div className="text-right">
              <div className="font-medium">{r.label}</div>
              {r.sub && <div className="text-xs text-muted-foreground">{r.sub}</div>}
            </div>
            <div dir="ltr" className="font-semibold text-primary">
              {money(r.double, t)}
            </div>
            <div dir="ltr" className="font-semibold">
              {money(r.triple, t)}
            </div>
            <div dir="ltr" className="font-semibold">
              {money(r.quad, t)}
            </div>
            {hasQuint && (
              <div dir="ltr" className="font-semibold">
                {money(r.quint || "—", t)}
              </div>
            )}
          </div>
        ))}
      </div>
    </>
  );
}

function BookingForm({
  programTitle,
  rawTitle,
  rawDates,
  rawHotels,
  slug,
  hotels,
  dates,
  programs,
  hasQuint,
  priceFor,
}: {
  programTitle: string;
  /**
   * The programme's Localized title, NOT the rendered one. A cart filled
   * in French must still read correctly after a switch to Arabic, so the
   * line stores the Localized value and the cart page picks at render.
   */
  rawTitle: Localized;
  /** The departure list before a language was picked, for the same reason. */
  rawDates?: LocalizedList;
  /**
   * The hotel labels before a language was picked. The agency writes each
   * hotel in Arabic and in French, so storing the rendered one froze the
   * cart in the language it was filled in.
   */
  rawHotels?: Localized[];
  slug: string;
  hotels: string[];
  dates: string[];
  programs: string[];
  /** Per-person price for a hotel + room pair, or "" when unpriced. */
  priceFor: (hotel: string, room: "double" | "triple" | "quad" | "quint") => string;
  /** Only offer a 5-share room when the programme actually prices one. */
  hasQuint: boolean;
}) {
  const t = useT();
  const [sent, setSent] = useState(false);
  const [added, setAdded] = useState(false);

  /**
   * The room <select> carries the translated LABEL as its value, because
   * the booking record has to read back what the customer actually saw.
   * The price table is keyed by column, so map one to the other here
   * rather than changing what the form sends.
   */
  /** The price column, and the key that names that room in any language. */
  const ROOM_KEY: Record<"double" | "triple" | "quad" | "quint", TranslationKey> = {
    double: "hajj.roomDouble",
    triple: "hajj.roomTriple",
    quad: "hajj.roomQuad",
    quint: "hajj.roomQuint",
  };

  const roomColumn = (value: string): "double" | "triple" | "quad" | "quint" | null =>
    value === t("hajj.roomDouble")
      ? "double"
      : value === t("hajj.roomTriple")
        ? "triple"
        : value === t("hajj.roomQuad")
          ? "quad"
          : value === t("hajj.roomQuint")
            ? "quint"
            : null;

  if (sent) {
    return (
      <div className="rounded-3xl bg-card p-6 text-center shadow-[var(--shadow-soft)]">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary">
          <BadgeCheck className="h-8 w-8" />
        </div>
        <h3 className="mt-4 font-display text-xl">{t("book.sentTitle")}</h3>
        <p className="mt-2 text-sm text-muted-foreground">
          {t("book.sentBody").replace("{program}", programTitle)}
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-3xl bg-card shadow-[var(--shadow-soft)]">
      <div className="bg-accent px-6 py-4 text-center font-display text-xl font-semibold text-accent-foreground">
        {t("action.book")}
      </div>
      <form
        className="space-y-4 p-6"
        onSubmit={(e) => {
          e.preventDefault();
          const f = new FormData(e.currentTarget);
          const value = (name: string) => String(f.get(name) ?? "");
          // Room values stay Arabic on purpose: the agency reads the same
          // wording whichever language the visitor booked in.
          submitBooking({
            kind: "omra",
            subject: `${t("action.book")} — ${value("program") || programTitle}`,
            fields: [
              [t("book.program"), value("program") || programTitle],
              [t("book.date"), value("date")],
              [t("hajj.hotel"), value("hotel")],
              [t("book.room"), value("room")],
              [t("book.people"), value("people")],
              [t("book.fullName"), value("fullName")],
              [t("contact.email"), value("email")],
              [t("book.phone"), value("phone")],
            ],
          });
          setSent(true);
        }}
      >
        <p className="text-sm text-muted-foreground">{t("book.lead")}</p>
        {programs.length > 1 && (
          <label className="block">
            <span className="mb-1.5 block text-sm font-medium">
              {t("book.program")} <span className="text-primary">*</span>
            </span>
            <select
              name="program"
              required
              defaultValue=""
              className="w-full rounded-xl border border-border bg-white px-4 py-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
            >
              <option value="" disabled>
                {t("book.chooseProgram")}
              </option>
              {programs.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
          </label>
        )}
        {dates.length > 1 && (
          <label className="block">
            <span className="mb-1.5 block text-sm font-medium">
              {t("book.date")} <span className="text-primary">*</span>
            </span>
            <select
              name="date"
              required
              defaultValue=""
              className="w-full rounded-xl border border-border bg-white px-4 py-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
            >
              <option value="" disabled>
                {t("book.chooseDate")}
              </option>
              {dates.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </label>
        )}
        <label className="block">
          <span className="mb-1.5 block text-sm font-medium">
            {t("hajj.hotel")} <span className="text-primary">*</span>
          </span>
          <select
            name="hotel"
            required
            defaultValue=""
            className="w-full rounded-xl border border-border bg-white px-4 py-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
          >
            <option value="" disabled>
              {t("book.chooseHotel")}
            </option>
            {hotels.map((h) => (
              <option key={h} value={h}>
                {h}
              </option>
            ))}
          </select>
        </label>
        <label className="block">
          <span className="mb-1.5 block text-sm font-medium">
            {t("book.room")} <span className="text-primary">*</span>
          </span>
          <select
            name="room"
            required
            defaultValue=""
            className="w-full rounded-xl border border-border bg-white px-4 py-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
          >
            <option value="" disabled>
              {t("book.chooseRoom")}
            </option>
            {/* The value is the label, not a hardcoded Arabic constant: this
                select feeds the booking record verbatim, so a French visitor
                who picked "Double" was reaching the agency as « ثنائية ».
                Sending back what the customer actually saw is the only
                reading that cannot be misread at the other end. */}
            <option value={t("hajj.roomDouble")}>{t("hajj.roomDouble")}</option>
            <option value={t("hajj.roomTriple")}>{t("hajj.roomTriple")}</option>
            <option value={t("hajj.roomQuad")}>{t("hajj.roomQuad")}</option>
            {hasQuint && <option value={t("hajj.roomQuint")}>{t("hajj.roomQuint")}</option>}
          </select>
        </label>
        <label className="block">
          <span className="mb-1.5 block text-sm font-medium">
            {t("book.people")} <span className="text-primary">*</span>
          </span>
          <input
            name="people"
            type="number"
            min={1}
            defaultValue={1}
            required
            className="w-full rounded-xl border border-border bg-white px-4 py-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
          />
        </label>
        <label className="block">
          <span className="mb-1.5 block text-sm font-medium">
            {t("book.fullName")} <span className="text-primary">*</span>
          </span>
          <input
            name="fullName"
            required
            placeholder={t("book.fullName")}
            className="w-full rounded-xl border border-border bg-white px-4 py-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
          />
        </label>
        <label className="block">
          <span className="mb-1.5 block text-sm font-medium">{t("contact.email")}</span>
          <input
            name="email"
            type="email"
            dir="ltr"
            placeholder="yourname@example.com"
            className="w-full rounded-xl border border-border bg-white px-4 py-3 text-right text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
          />
        </label>
        <label className="block">
          <span className="mb-1.5 block text-sm font-medium">
            {t("book.phone")} <span className="text-primary">*</span>
          </span>
          <input
            name="phone"
            required
            dir="ltr"
            placeholder="+212 6 00 00 00 00"
            className="w-full rounded-xl border border-border bg-white px-4 py-3 text-right text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
          />
        </label>
        {/* Add to cart keeps the visitor on the page; submit sends one
            programme straight through. Both read the same fields. */}
        <button
          type="button"
          className="w-full rounded-full border border-primary px-4 py-3 text-sm font-semibold text-primary transition hover:bg-primary/5"
          onClick={(e) => {
            const form = e.currentTarget.form;
            if (!form) return;
            // Only the fields that describe the trip. form.reportValidity()
            // would also demand fullName and phone, which belong at checkout
            // on the cart page, not to putting a programme in the basket.
            const trip = ["program", "date", "hotel", "room", "people"];
            for (const name of trip) {
              const el = form.elements.namedItem(name);
              if (el instanceof HTMLInputElement || el instanceof HTMLSelectElement) {
                if (!el.checkValidity()) {
                  el.reportValidity();
                  return;
                }
              }
            }
            const f = new FormData(form);
            const value = (name: string) => String(f.get(name) ?? "");
            const hotel = value("hotel");
            const room = value("room");
            const column = roomColumn(room);
            // Labels are keys, and the room is a key too — those are our
            // words. The hotel name and the departure date are the agency's
            // own data and are stored as written.
            // The hotel is the agency's own data, but they wrote it in both
            // languages — so keep it Localized, found by its position in the
            // same list the <select> was built from.
            const atHotel = hotels.indexOf(hotel);
            const hotelLocalized = rawHotels && atHotel >= 0 ? rawHotels[atHotel] : undefined;
            const details: CartDetail[] = [
              hotelLocalized
                ? { label: "hajj.hotel", value: hotel, localized: hotelLocalized }
                : { label: "hajj.hotel", value: hotel },
              column
                ? { label: "book.room", value: ROOM_KEY[column], translate: true }
                : { label: "book.room", value: room },
            ];
            const chosen = value("program");
            if (chosen) details.push({ label: "book.program", value: chosen });
            const date = value("date");
            if (date) {
              // Store the departure Localized when we can still identify
              // which entry it is, so an Arabic reader does not get the
              // French line — and neither does the agency's WhatsApp.
              const at = dates.indexOf(date);
              details.push(
                rawDates && at >= 0
                  ? { label: "book.date", value: date, localized: localizedAt(rawDates, at) }
                  : { label: "book.date", value: date },
              );
            }
            addLine({
              slug,
              kind: "omra",
              title: rawTitle,
              details,
              people: Number(value("people")) || 1,
              unitPrice: column ? priceFor(hotel, column) : "",
            });
            setAdded(true);
          }}
        >
          {added ? t("cart.added") : t("cart.add")}
        </button>
        <button type="submit" className="btn-primary w-full hover:-translate-y-0.5">
          {t("book.submit")}
        </button>
        <p className="text-[11px] leading-relaxed text-muted-foreground">{t("book.privacy")}</p>
      </form>
    </div>
  );
}

function ProgramDetail() {
  const lang = useLocale();
  const t = useT();
  const { program: raw, shared } = Route.useLoaderData();
  // Resolved once, so everything below renders plain strings.
  const program = localizeProgram(raw, lang);
  // Programme photos win; otherwise borrow the shared gallery so the section
  // still shows something real. Neither → the section doesn't render at all.
  const usingShared = program.gallery.length === 0;
  const photos = usingShared ? shared.slice(0, 6).map((p) => p.image) : program.gallery;

  return (
    <div className="min-h-screen">
      <Header />

      <div>
        {/* البطل */}
        <section className="relative overflow-hidden">
          <img
            src={program.image}
            alt={program.title}
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/70 to-black/60" />
          <div className="relative z-10 pb-10 pt-36 sm:pt-40">
            <div className="container-page text-white">
              <h1 className="font-display text-3xl leading-tight sm:text-5xl">{program.title}</h1>
              <div className="mt-3 flex flex-wrap items-baseline gap-x-2 gap-y-1 text-base sm:text-lg">
                <span className="opacity-80">{t("tour.from")}</span>
                <span
                  dir="ltr"
                  className="font-display text-2xl sm:text-3xl"
                  style={{ color: "var(--brand-yellow)" }}
                >
                  {money(program.priceFrom, t)}
                </span>
                <span className="opacity-80">{t("tour.perPerson")}</span>
              </div>
              <div className="mt-5">
                <a
                  href="#booking"
                  onClick={(e) => {
                    e.preventDefault();
                    document.getElementById("booking")?.scrollIntoView({ behavior: "smooth" });
                  }}
                  className="btn-primary inline-flex"
                >
                  {t("action.book")}
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* مسار التنقل */}
        <div className="border-b border-border bg-sand">
          <div className="container-page flex items-center gap-1.5 py-3 text-sm text-muted-foreground">
            <Link to="/$lang" params={{ lang }} className="hover:text-primary">
              {t("nav.home")}
            </Link>
            <ChevronLeft className="h-3.5 w-3.5" />
            <Link to="/$lang/omra" params={{ lang }} className="hover:text-primary">
              {t("hajj.eyebrow")}
            </Link>
            <ChevronLeft className="h-3.5 w-3.5" />
            <span className="font-semibold text-foreground">{program.shortTitle}</span>
          </div>
        </div>

        {/* المحتوى بعمودين */}
        <section className="py-14">
          <div className="container-page grid gap-8 lg:grid-cols-[1fr_360px]">
            {/* العمود الرئيسي */}
            <Reveal className="min-w-0">
              {/* صندوق معلومات الرحلة */}
              <div className="rounded-3xl bg-primary p-6 text-white sm:p-8">
                <div className="text-lg font-semibold">
                  <span className="opacity-80">{t("hajj.via")} </span>
                  {program.flightRoute}
                </div>
                <div
                  className={`flex flex-wrap gap-3 ${
                    program.dates.length > 0 || program.duration || program.flight ? "mt-4" : ""
                  }`}
                >
                  {program.dates.map((d) => (
                    <span
                      key={d}
                      className="inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-2 text-sm backdrop-blur"
                    >
                      <CalendarDays className="h-4 w-4" /> {d}
                    </span>
                  ))}
                  {/* A programme the client never gave a duration or a carrier
                      for would otherwise render a pill holding just an icon. */}
                  {program.duration && (
                    <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-2 text-sm backdrop-blur">
                      <Clock className="h-4 w-4" /> {program.duration}
                    </span>
                  )}
                  {program.flight && (
                    <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-2 text-sm backdrop-blur">
                      <Plane className="h-4 w-4" /> {program.flight}
                    </span>
                  )}
                </div>
                {program.dates.length > 1 && (
                  <p className="mt-3 text-sm opacity-80">{t("hajj.multiDates")}</p>
                )}
              </div>

              {/* وصف الرحلة */}
              <h2 className="mt-10 font-display text-3xl text-primary">
                {t("hajj.tripDescription")}
              </h2>
              <div className="mt-4 space-y-3 leading-relaxed text-muted-foreground">
                {program.description.map((p) => (
                  <p key={p}>{p}</p>
                ))}
              </div>

              {/* الأسعار والفنادق */}
              <h2 className="mt-10 font-display text-3xl text-primary">{t("hajj.pricesTitle")}</h2>
              <div className="mt-4 space-y-8">
                {program.tables.map((t, i) => (
                  <div key={i}>
                    <div className="mb-3 flex items-center gap-3">
                      <span className="rounded-full bg-primary px-3 py-1 text-xs font-semibold text-white">
                        {t.tag}
                      </span>
                      <h3 className="font-display text-2xl">{t.name}</h3>
                    </div>
                    <PriceTable rows={t.rows} />
                  </div>
                ))}
                <p className="text-xs text-muted-foreground">{t("hajj.priceNote")}</p>
              </div>

              {/* الأسعار تشمل */}
              <h2 className="mt-10 font-display text-3xl text-primary">
                {t("hajj.pricesInclude")}
              </h2>
              <ul className="mt-4 space-y-2">
                {program.includes.map((item) => (
                  <li key={item} className="flex gap-3 text-sm leading-relaxed">
                    <Check className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>

              {/* ملاحظات */}
              {program.notes.length > 0 && (
                <div className="mt-8 rounded-2xl border border-border bg-card p-6">
                  <div className="font-semibold text-primary">{t("hajj.note")}</div>
                  <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
                    {program.notes.map((n) => (
                      <li key={n} className="flex gap-2">
                        <span className="text-primary">•</span> {n}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </Reveal>

            {/* الشريط الجانبي */}
            <aside className="min-w-0 lg:sticky lg:top-28 lg:h-fit">
              <Reveal className="space-y-5">
                {/* تواصل معنا */}
                <div className="overflow-hidden rounded-3xl bg-card shadow-[var(--shadow-soft)]">
                  <div className="bg-accent px-6 py-4 text-center font-display text-lg font-semibold text-accent-foreground">
                    {t("hajj.contactUs")}
                  </div>
                  <div className="space-y-2 p-5" dir="ltr">
                    {agencyPhones.slice(0, 2).map((tel) => (
                      <a
                        key={tel}
                        href={`tel:${tel.replace(/\s/g, "")}`}
                        className="flex items-center justify-center gap-2 rounded-xl border border-border px-4 py-2.5 text-sm font-medium hover:border-primary hover:text-primary"
                      >
                        <Phone className="h-4 w-4" /> {tel}
                      </a>
                    ))}
                  </div>
                </div>

                {/* واتساب */}
                <a
                  href={`https://wa.me/${whatsappNumber.replace(/[^0-9]/g, "")}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-center gap-3 rounded-3xl bg-[#25D366] px-6 py-4 font-semibold text-white shadow-[var(--shadow-soft)] hover:opacity-95"
                >
                  <MessageCircle className="h-6 w-6" />
                  <span className="text-center">
                    {t("hajj.whatsapp")}
                    <span className="block text-sm font-normal opacity-90" dir="ltr">
                      {whatsappNumber}
                    </span>
                  </span>
                </a>

                {/* نموذج الحجز */}
                <div id="booking" className="scroll-mt-28">
                  <BookingForm
                    programTitle={program.shortTitle}
                    rawTitle={raw.title}
                    rawDates={raw.dates}
                    rawHotels={raw.tables.flatMap((t) => t.rows.map((r) => r.label))}
                    slug={program.slug}
                    hotels={program.tables.flatMap((t) => t.rows.map((r) => r.label))}
                    priceFor={(hotel, room) =>
                      program.tables
                        .flatMap((tb) => tb.rows)
                        .find((r) => r.label === hotel)?.[room] ?? ""
                    }
                    dates={program.dates}
                    programs={program.tables.map((t) => t.name).filter(Boolean)}
                    hasQuint={program.tables.some((t) => t.rows.some((r) => r.quint))}
                  />
                </div>
              </Reveal>
            </aside>
          </div>
        </section>

        {/* معرض الصور — صور البرنامج، وإلا صور المعرض المشترك. لا شيء = القسم مخفي */}
        {photos.length > 0 && (
          <section className="bg-sand py-16">
            <div className="container-page">
              <div className="text-center">
                <div className="text-sm font-bold" style={{ color: "var(--brand-yellow)" }}>
                  {t("hajj.galleryEyebrow")}
                </div>
                <h2 className="mt-1 font-display text-3xl text-primary sm:text-4xl">
                  {t("gallery.title")}
                </h2>
              </div>
              <StaggerGroup className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3">
                {photos.map((src, i) => (
                  <StaggerItem
                    key={src}
                    className="group relative aspect-[4/3] overflow-hidden rounded-2xl skeleton shadow-[var(--shadow-soft)]"
                  >
                    <img
                      src={src}
                      alt={`${program.shortTitle} — ${i + 1}`}
                      loading="lazy"
                      className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                    />
                  </StaggerItem>
                ))}
              </StaggerGroup>
              {usingShared && (
                <p className="mt-6 text-center">
                  <Link
                    to="/$lang/gallery"
                    params={{ lang }}
                    className="text-sm font-semibold text-primary hover:underline"
                  >
                    {t("hajj.seeAllPhotos")}
                  </Link>
                </p>
              )}
            </div>
          </section>
        )}

        {/* العنوان */}
        <section className="py-16">
          <div className="container-page">
            <div className="rounded-3xl bg-sand px-8 py-8 text-center text-sm text-muted-foreground">
              {agencyAddresses(lang)[0]}
            </div>
          </div>
        </section>
      </div>

      <Footer />
    </div>
  );
}
