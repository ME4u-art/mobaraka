import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import type { PriceTable } from "@/lib/tours";
import { content } from "@/lib/content";
import { DetailSkeleton } from "@/components/site/Skeleton";
import {
  Calendar,
  Clock,
  MapPin,
  Check,
  X,
  ArrowRight,
  Star,
  Plane,
  Utensils,
  BedDouble,
  Phone,
  MessageCircle,
  ChevronRight,
  Info,
} from "lucide-react";
import { Reveal } from "@/components/motion/Reveal";
import { agency, isEnabled, whatsappDigits } from "@/config/agency";

const WHATSAPP = whatsappDigits();
const PHONE = agency.contact.phones[0];

// Intentional: fr-FR groups with a narrow no-break space; swap it for a regular
// NBSP so prices never wrap mid-number ("9 200 dh").
// eslint-disable-next-line no-irregular-whitespace
const fmt = (n: number) => n.toLocaleString("fr-FR").replace(/ /g, " ");
const parsePrice = (s: string): number | null => {
  if (!s || s.trim() === "—") return null;
  const n = Number(s.replace(/[^\d]/g, ""));
  return n > 0 ? n : null;
};

type Basis = "double" | "triple" | "single";

/** Interactive price estimator driven by a table's columnRoles. */
function PriceEstimator({ table }: { table: PriceTable }) {
  const roles = table.columnRoles;
  const [rowIdx, setRowIdx] = useState(0);
  const [basis, setBasis] = useState<Basis>("double");
  const [adults, setAdults] = useState(2);
  const [childAges, setChildAges] = useState<number[]>([]);

  const idxDouble = roles?.findIndex((r) => r.kind === "adultDouble") ?? -1;
  const idxTriple = roles?.findIndex((r) => r.kind === "adultTriple") ?? -1;
  const idxSingle = roles?.findIndex((r) => r.kind === "single") ?? -1;
  const hasTriple = idxTriple >= 0;
  const hasSingle = idxSingle >= 0;

  const row = table.rows[rowIdx];

  const result = useMemo(() => {
    if (!roles || !row) return null;
    const cell = (i: number) => (i >= 0 ? parsePrice(row.cells[i]) : null);

    // per-adult price for the chosen room basis
    let adultUnit: number | null = null;
    if (basis === "double") adultUnit = cell(idxDouble);
    else if (basis === "triple") adultUnit = cell(idxTriple);
    else if (basis === "single") {
      const sr = roles[idxSingle];
      const sv = cell(idxSingle);
      if (sr && sr.kind === "single")
        adultUnit =
          sr.mode === "total"
            ? sv
            : sv != null && cell(idxDouble) != null
              ? cell(idxDouble)! + sv
              : null;
    }

    // child columns, grouped by age band (maxAge)
    const childCols = roles
      .map((r, i) => ({ r, i }))
      .filter(
        (x): x is { r: Extract<typeof x.r, { kind: "child" }>; i: number } => x.r.kind === "child",
      );

    const lines: { label: string; total: number }[] = [];
    let unavailable = false;

    if (adultUnit == null) unavailable = true;
    else if (adults > 0)
      lines.push({
        label: `${adults} adulte${adults > 1 ? "s" : ""} (${basis === "double" ? "ch. double" : basis === "triple" ? "ch. triple" : "ch. single"})`,
        total: adultUnit * adults,
      });

    // assign each child to its band, counting ordinal within the band
    const bandCount: Record<number, number> = {};
    const sortedAges = [...childAges].sort((a, b) => a - b);
    for (const age of sortedAges) {
      const candidates = childCols.filter((c) => age <= c.r.maxAge);
      if (candidates.length === 0) {
        // older than any child band → counts as an adult at the room basis
        if (adultUnit != null)
          lines.push({ label: `1 enfant ${age} ans (tarif adulte)`, total: adultUnit });
        else unavailable = true;
        continue;
      }
      const bandMax = Math.min(...candidates.map((c) => c.r.maxAge));
      const bandCols = childCols
        .filter((c) => c.r.maxAge === bandMax)
        .sort((a, b) => (a.r.ordinal ?? 1) - (b.r.ordinal ?? 1));
      const n = (bandCount[bandMax] = (bandCount[bandMax] ?? 0) + 1);
      const col =
        bandCols.find((c) => c.r.ordinal === n) ?? bandCols[Math.min(n - 1, bandCols.length - 1)];
      const price = parsePrice(row.cells[col.i]);
      if (price == null) unavailable = true;
      else lines.push({ label: `1 enfant ${age} ans`, total: price });
    }

    if (unavailable) return { unavailable: true as const };
    const total = lines.reduce((s, l) => s + l.total, 0);
    return { unavailable: false as const, lines, total };
  }, [roles, row, basis, adults, childAges, idxDouble, idxTriple, idxSingle]);

  if (!roles) return null;

  const inputCls =
    "rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary";
  const stepBtn =
    "flex h-9 w-9 items-center justify-center rounded-lg border border-border text-lg font-medium hover:border-primary hover:text-primary disabled:opacity-40";

  return (
    <div className="mt-4 rounded-2xl border border-border bg-secondary/40 p-5">
      <div className="text-sm font-semibold text-primary">Estimer mon prix</div>

      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        {/* Formule / hôtel */}
        <label className="block">
          <span className="mb-1.5 block text-xs font-medium text-muted-foreground">
            Hôtel / formule
          </span>
          <select
            value={rowIdx}
            onChange={(e) => setRowIdx(Number(e.target.value))}
            className={`w-full ${inputCls}`}
          >
            {table.rows.map((r, i) => (
              <option key={r.label + i} value={i}>
                {r.label}
                {r.sub ? ` — ${r.sub}` : ""}
              </option>
            ))}
          </select>
        </label>

        {/* Chambre */}
        <div className="block">
          <span className="mb-1.5 block text-xs font-medium text-muted-foreground">
            Type de chambre
          </span>
          <div className="flex flex-wrap gap-2">
            {(
              [
                "double",
                ...(hasTriple ? ["triple"] : []),
                ...(hasSingle ? ["single"] : []),
              ] as Basis[]
            ).map((b) => (
              <button
                key={b}
                type="button"
                onClick={() => setBasis(b)}
                className={`rounded-full px-4 py-2 text-sm font-medium capitalize transition ${basis === b ? "bg-primary text-primary-foreground" : "border border-border bg-card hover:border-primary"}`}
              >
                {b === "double" ? "Double" : b === "triple" ? "Triple" : "Single"}
              </button>
            ))}
          </div>
        </div>

        {/* Adultes */}
        <div className="block">
          <span className="mb-1.5 block text-xs font-medium text-muted-foreground">Adultes</span>
          <div className="flex items-center gap-3">
            <button
              type="button"
              className={stepBtn}
              onClick={() => setAdults((a) => Math.max(1, a - 1))}
              disabled={adults <= 1}
            >
              −
            </button>
            <span className="w-6 text-center text-sm font-semibold">{adults}</span>
            <button
              type="button"
              className={stepBtn}
              onClick={() => setAdults((a) => Math.min(9, a + 1))}
            >
              +
            </button>
          </div>
        </div>

        {/* Enfants */}
        <div className="block">
          <span className="mb-1.5 block text-xs font-medium text-muted-foreground">
            Enfants (âge)
          </span>
          <div className="flex flex-wrap items-center gap-2">
            {childAges.map((age, i) => (
              <span
                key={i}
                className="inline-flex items-center gap-1 rounded-full border border-border bg-card py-1 pl-2 pr-1 text-sm"
              >
                <select
                  value={age}
                  onChange={(e) =>
                    setChildAges((prev) =>
                      prev.map((a, j) => (j === i ? Number(e.target.value) : a)),
                    )
                  }
                  className="bg-transparent text-sm outline-none"
                >
                  {Array.from({ length: 18 }, (_, k) => k).map((k) => (
                    <option key={k} value={k}>
                      {k} ans
                    </option>
                  ))}
                </select>
                <button
                  type="button"
                  onClick={() => setChildAges((prev) => prev.filter((_, j) => j !== i))}
                  className="flex h-5 w-5 items-center justify-center rounded-full text-muted-foreground hover:bg-muted hover:text-foreground"
                >
                  ×
                </button>
              </span>
            ))}
            <button
              type="button"
              onClick={() => setChildAges((prev) => [...prev, 6])}
              className="rounded-full border border-dashed border-primary/50 px-3 py-1.5 text-sm font-medium text-primary hover:bg-primary/5"
            >
              + Enfant
            </button>
          </div>
        </div>
      </div>

      {/* Résultat */}
      <div className="mt-5 rounded-xl bg-card p-4 shadow-[var(--shadow-soft)]">
        {result?.unavailable ? (
          <p className="text-sm text-muted-foreground">
            Cette combinaison n'est pas disponible pour la formule choisie. Contactez l'agence pour
            un devis.
          </p>
        ) : result ? (
          <>
            <ul className="space-y-1 text-sm">
              {result.lines.map((l, i) => (
                <li key={i} className="flex items-center justify-between gap-3">
                  <span className="text-muted-foreground">{l.label}</span>
                  <span className="font-medium">{fmt(l.total)} dh</span>
                </li>
              ))}
            </ul>
            <div className="mt-3 flex items-baseline justify-between border-t border-border pt-3">
              <span className="text-sm font-semibold">Total estimé</span>
              <span className="font-display text-2xl text-primary">{fmt(result.total)} dh</span>
            </div>
          </>
        ) : null}
        <p className="mt-3 text-[11px] leading-relaxed text-muted-foreground">
          Estimation indicative hors taxes, visa et suppléments éventuels. Le tarif définitif est
          confirmé par l'agence.
        </p>
      </div>
    </div>
  );
}

export const Route = createFileRoute("/voyages/$slug")({
  beforeLoad: () => {
    if (!isEnabled("voyagesOrganises")) throw notFound();
  },
  loader: async ({ params }) => {
    const tour = await content.getTour(params.slug);
    if (!tour) throw notFound();
    return { tour };
  },
  head: ({ loaderData }) => {
    if (!loaderData)
      return { meta: [{ title: "Voyage introuvable" }, { name: "robots", content: "noindex" }] };
    const t = loaderData.tour;
    return {
      meta: [
        { title: `${t.title} — ${agency.identity.name}` },
        {
          name: "description",
          content: `${t.subtitle}. ${t.duration}. ${t.dates}. Prix : ${t.price}.`,
        },
        { property: "og:title", content: `${t.title} — ${agency.identity.name}` },
        { property: "og:description", content: `${t.subtitle}. ${t.duration}.` },
        { property: "og:image", content: t.image },
        { name: "twitter:image", content: t.image },
      ],
    };
  },
  component: TourDetail,
  pendingComponent: DetailSkeleton,
  notFoundComponent: () => (
    <div className="min-h-screen">
      <Header />
      <div className="container-page py-40 text-center">
        <h1 className="font-display text-4xl">Voyage introuvable</h1>
        <Link to="/voyages-organises" className="btn-primary mt-6 inline-flex">
          Voir tous les voyages
        </Link>
      </div>
      <Footer />
    </div>
  ),
});

function TourDetail() {
  const { tour } = Route.useLoaderData();
  const departures = tour.departures ?? [tour.dates];

  return (
    <div className="min-h-screen">
      <Header />

      {/* Hero */}
      <section className="relative h-[70vh] w-full overflow-hidden">
        <img
          src={tour.image}
          alt={tour.title}
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-black/20" />
        <div className="relative z-10 flex h-full items-end pb-16 pt-40">
          <div className="container-page text-white">
            <span className="inline-flex items-center gap-2 rounded-full bg-accent px-3 py-1 text-xs font-bold text-accent-foreground">
              <MapPin className="h-3 w-3" /> {tour.region}
            </span>
            <h1 className="mt-4 max-w-3xl font-display text-4xl leading-tight sm:text-5xl md:text-6xl">
              {tour.title}
            </h1>
            <p className="mt-3 max-w-2xl text-lg opacity-90">{tour.subtitle}</p>
            <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm">
              <span className="inline-flex items-center gap-2">
                <Clock className="h-4 w-4" /> {tour.duration}
              </span>
              <span className="inline-flex items-center gap-2">
                <Calendar className="h-4 w-4" /> {tour.dates}
              </span>
              <span className="inline-flex items-baseline gap-2 rounded-full bg-white/15 px-4 py-1.5 backdrop-blur">
                <span className="opacity-80">À partir de</span>
                <span className="font-display text-lg font-semibold">{tour.price}</span>
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Route strip */}
      {tour.route && (
        <div className="border-b border-border bg-sand">
          <div className="container-page flex flex-wrap items-center gap-x-2 gap-y-1 py-4 text-sm font-medium">
            <Plane className="h-4 w-4 shrink-0 text-primary" />
            {tour.route.map((city, i) => (
              <span key={`${city}-${i}`} className="inline-flex items-center gap-2">
                <span>{city}</span>
                {i < tour.route!.length - 1 && (
                  <ChevronRight className="h-3.5 w-3.5 text-muted-foreground" />
                )}
              </span>
            ))}
            {tour.airline && (
              <span className="ml-auto inline-flex items-center gap-1.5 text-muted-foreground">
                <Plane className="h-3.5 w-3.5" /> {tour.airline}
              </span>
            )}
          </div>
        </div>
      )}

      <section className="container-page grid gap-10 py-16 lg:grid-cols-3">
        {/* Left: content */}
        <div className="lg:col-span-2">
          <Reveal>
            <h2 className="font-display text-3xl">Aperçu du programme</h2>
            <p className="mt-4 leading-relaxed text-muted-foreground">
              {tour.overview ??
                `${tour.subtitle}. Un programme organisé par ${agency.identity.name} et encadré par nos équipes, du départ au retour.`}
            </p>
          </Reveal>

          {tour.highlights && (
            <Reveal>
              <h3 className="mt-10 font-display text-2xl">Points forts</h3>
              <ul className="mt-4 grid gap-2 sm:grid-cols-2">
                {tour.highlights.map((h) => (
                  <li
                    key={h}
                    className="flex items-start gap-2 rounded-xl bg-secondary px-4 py-3 text-sm font-medium text-primary"
                  >
                    <Star className="mt-0.5 h-4 w-4 shrink-0" /> {h}
                  </li>
                ))}
              </ul>
            </Reveal>
          )}

          {/* Day-by-day itinerary */}
          {tour.itinerary && (
            <Reveal>
              <h3 className="mt-12 font-display text-2xl">Programme jour par jour</h3>
              <ol className="mt-6 space-y-4">
                {tour.itinerary.map((it) => (
                  <li
                    key={it.day}
                    className="overflow-hidden rounded-2xl border border-border bg-card shadow-[var(--shadow-soft)]"
                  >
                    {it.image && (
                      <img
                        src={it.image}
                        alt={it.title}
                        loading="lazy"
                        className="h-44 w-full object-cover"
                      />
                    )}
                    <div className="p-5">
                      <div className="flex items-center gap-3">
                        <span className="inline-flex shrink-0 items-center rounded-full bg-primary px-3 py-1 text-xs font-bold text-primary-foreground">
                          {it.day}
                        </span>
                        <h4 className="font-display text-lg">{it.title}</h4>
                      </div>
                      <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                        {it.description}
                      </p>
                      {it.meals && it.meals.length > 0 && (
                        <div className="mt-3 flex flex-wrap gap-2">
                          {it.meals.map((m) => (
                            <span
                              key={m}
                              className="inline-flex items-center gap-1.5 rounded-full bg-sand px-3 py-1 text-xs font-medium text-foreground"
                            >
                              <Utensils className="h-3 w-3 text-primary" /> {m}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </li>
                ))}
              </ol>
            </Reveal>
          )}

          {/* Included / not included */}
          <Reveal>
            <div className="mt-12 grid gap-8 sm:grid-cols-2">
              <div>
                <h3 className="font-display text-2xl">Le prix comprend</h3>
                <ul className="mt-4 space-y-2">
                  {(
                    tour.included ?? [
                      "Vols internationaux",
                      "Hébergement",
                      "Transferts",
                      "Encadrement",
                    ]
                  ).map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" /> {f}
                    </li>
                  ))}
                </ul>
              </div>
              {tour.notIncluded && (
                <div>
                  <h3 className="font-display text-2xl">Ne comprend pas</h3>
                  <ul className="mt-4 space-y-2">
                    {tour.notIncluded.map((f) => (
                      <li key={f} className="flex items-start gap-2 text-sm text-muted-foreground">
                        <X className="mt-0.5 h-4 w-4 shrink-0" /> {f}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </Reveal>

          {/* Hébergement table */}
          {tour.hebergement && (
            <Reveal>
              <h3 className="mt-12 font-display text-2xl">Hébergement</h3>
              <div className="mt-4 overflow-hidden rounded-2xl border border-border">
                <div className="grid grid-cols-[1fr_auto_2fr] gap-2 bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground">
                  <span>Ville</span>
                  <span className="text-center">Nuits</span>
                  <span>Hôtels</span>
                </div>
                {tour.hebergement.map((h, i) => (
                  <div
                    key={h.city}
                    className={`grid grid-cols-[1fr_auto_2fr] items-center gap-2 border-b border-border px-4 py-3 text-sm last:border-0 ${i % 2 ? "bg-sand" : "bg-card"}`}
                  >
                    <span className="inline-flex items-center gap-2 font-medium">
                      <BedDouble className="h-4 w-4 shrink-0 text-primary" /> {h.city}
                    </span>
                    <span className="text-center font-semibold text-primary">{h.nights}</span>
                    <span className="text-muted-foreground">{h.hotels}</span>
                  </div>
                ))}
              </div>
            </Reveal>
          )}

          {/* Tarifs par hôtel / formule */}
          {tour.priceTables &&
            tour.priceTables.map((t, ti) => (
              <Reveal key={ti}>
                <h3 className="mt-12 font-display text-2xl">Tarifs &amp; formules</h3>
                {(t.title || t.dates) && (
                  <div className="mt-2 flex flex-wrap items-baseline gap-x-3 text-sm">
                    {t.title && <span className="font-semibold text-primary">{t.title}</span>}
                    {t.dates && <span className="text-muted-foreground">{t.dates}</span>}
                  </div>
                )}

                {/* Interactive price estimator */}
                {t.columnRoles && <PriceEstimator table={t} />}

                {/* mobile — one card per row, no horizontal scroll */}
                <div className="mt-4 space-y-3 md:hidden">
                  {t.rows.map((r) => (
                    <div
                      key={r.label}
                      className="overflow-hidden rounded-2xl border border-border bg-card"
                    >
                      <div className="bg-accent px-4 py-3 text-accent-foreground">
                        <div className="text-sm font-semibold">{r.label}</div>
                        {r.sub && <div className="mt-0.5 text-xs opacity-80">{r.sub}</div>}
                      </div>
                      <dl className="divide-y divide-border">
                        {r.cells.map((c, ci) => (
                          <div
                            key={ci}
                            className="flex items-center justify-between gap-3 px-4 py-2"
                          >
                            <dt className="text-xs text-muted-foreground">{t.columns[ci + 1]}</dt>
                            <dd
                              className={`text-sm font-semibold ${ci === 0 ? "text-primary" : ""}`}
                            >
                              {c}
                            </dd>
                          </div>
                        ))}
                      </dl>
                    </div>
                  ))}
                </div>

                {/* tablet & desktop — comparison table */}
                <div className="mt-4 hidden overflow-x-auto rounded-2xl border border-border md:block">
                  <table className="w-full border-collapse text-sm">
                    <thead>
                      <tr className="bg-primary text-left text-primary-foreground">
                        {t.columns.map((c, ci) => (
                          <th
                            key={c}
                            className={`px-4 py-3 font-semibold ${ci === 0 ? "" : "text-center"}`}
                          >
                            {c}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {t.rows.map((r, ri) => (
                        <tr
                          key={r.label}
                          className={`border-t border-border ${ri % 2 ? "bg-sand" : "bg-card"}`}
                        >
                          <td className="px-4 py-3">
                            <div className="font-medium">{r.label}</div>
                            {r.sub && <div className="text-xs text-muted-foreground">{r.sub}</div>}
                          </td>
                          {r.cells.map((c, ci) => (
                            <td
                              key={ci}
                              className={`px-4 py-3 text-center font-semibold ${ci === 0 ? "text-primary" : ""}`}
                            >
                              {c}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Reveal>
            ))}

          {/* Détails des vols */}
          {tour.flights && tour.flights.length > 0 && (
            <Reveal>
              <h3 className="mt-12 font-display text-2xl">Détails des vols</h3>
              <div className="mt-4 space-y-6">
                {tour.flights.map((fs, fi) => (
                  <div key={fi}>
                    {fs.title && (
                      <div className="mb-2 text-sm font-semibold text-primary">{fs.title}</div>
                    )}

                    {/* mobile — one card per vol */}
                    <div className="space-y-3 md:hidden">
                      {fs.legs.map((l, li) => (
                        <div key={li} className="rounded-2xl border border-border bg-card p-4">
                          <div className="flex items-center gap-2 font-medium">
                            <Plane className="h-4 w-4 shrink-0 text-primary" /> {l.route}
                          </div>
                          <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
                            <span>{l.date}</span>
                            <span className="font-semibold text-foreground">{l.flightNo}</span>
                            <span>
                              Départ{" "}
                              <span className="font-medium text-foreground">{l.departure}</span>
                            </span>
                            <span>
                              Arrivée{" "}
                              <span className="font-medium text-foreground">{l.arrival}</span>
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* tablet & desktop — table */}
                    <div className="hidden overflow-x-auto rounded-2xl border border-border md:block">
                      <table className="w-full border-collapse text-sm">
                        <thead>
                          <tr className="bg-primary text-left text-primary-foreground">
                            <th className="px-4 py-3 font-semibold">Vol</th>
                            <th className="px-4 py-3 font-semibold">Date</th>
                            <th className="px-4 py-3 text-center font-semibold">N° de vol</th>
                            <th className="px-4 py-3 text-center font-semibold">Départ</th>
                            <th className="px-4 py-3 text-center font-semibold">Arrivée</th>
                          </tr>
                        </thead>
                        <tbody>
                          {fs.legs.map((l, li) => (
                            <tr
                              key={li}
                              className={`border-t border-border ${li % 2 ? "bg-sand" : "bg-card"}`}
                            >
                              <td className="px-4 py-3 font-medium">{l.route}</td>
                              <td className="px-4 py-3 text-muted-foreground">{l.date}</td>
                              <td className="px-4 py-3 text-center font-semibold">{l.flightNo}</td>
                              <td className="px-4 py-3 text-center">{l.departure}</td>
                              <td className="px-4 py-3 text-center">{l.arrival}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                ))}
              </div>
            </Reveal>
          )}

          {/* Excursions en option */}
          {tour.options && tour.options.length > 0 && (
            <Reveal>
              <h3 className="mt-12 font-display text-2xl">En option</h3>
              <ul className="mt-4 space-y-2">
                {tour.options.map((o) => (
                  <li
                    key={o}
                    className="flex items-start gap-2 rounded-xl bg-secondary px-4 py-3 text-sm font-medium text-primary"
                  >
                    <Star className="mt-0.5 h-4 w-4 shrink-0" /> {o}
                  </li>
                ))}
              </ul>
            </Reveal>
          )}

          {/* Bon à savoir */}
          {tour.notes && tour.notes.length > 0 && (
            <Reveal>
              <h3 className="mt-12 font-display text-2xl">Bon à savoir</h3>
              <ul className="mt-4 space-y-2 rounded-2xl border border-border bg-card p-5">
                {tour.notes.map((n) => (
                  <li key={n} className="flex gap-2 text-sm leading-relaxed text-muted-foreground">
                    <Info className="mt-0.5 h-4 w-4 shrink-0 text-primary" /> {n}
                  </li>
                ))}
              </ul>
            </Reveal>
          )}
        </div>

        {/* Right: sticky booking sidebar */}
        <Reveal delay={0.1} className="lg:sticky lg:top-32 h-fit">
          <aside className="rounded-3xl border border-border bg-card p-6 shadow-[var(--shadow-soft)]">
            <div className="text-xs uppercase tracking-widest text-muted-foreground">
              Prix par personne
            </div>
            <div className="mt-2 font-display text-4xl text-primary">{tour.price}</div>
            <p className="mt-2 text-xs text-muted-foreground">
              {tour.priceNote ?? "Base chambre double, sous réserve de disponibilité."}
            </p>

            {tour.bookingUrl && (
              <a
                href={tour.bookingUrl}
                target="_blank"
                rel="noreferrer"
                className="btn-primary mt-5 w-full justify-center hover:-translate-y-0.5"
              >
                Réserver en ligne <ArrowRight className="h-4 w-4" />
              </a>
            )}

            <form
              className="mt-5 space-y-3"
              onSubmit={(e) => {
                e.preventDefault();
                const f = new FormData(e.currentTarget);
                const body = `Programme : ${tour.title}\nDépart : ${f.get("depart")}\nNom : ${f.get("prenom")} ${f.get("nom")}\nEmail : ${f.get("email")}\nTéléphone : ${f.get("tel")}`;
                window.location.href = `mailto:${agency.contact.email}?subject=${encodeURIComponent("Réservation — " + tour.title)}&body=${encodeURIComponent(body)}`;
              }}
            >
              <div className="grid grid-cols-2 gap-2">
                <input
                  name="prenom"
                  required
                  placeholder="Prénom"
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
                />
                <input
                  name="nom"
                  required
                  placeholder="Nom"
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
                />
              </div>
              <input
                name="email"
                type="email"
                required
                placeholder="Email"
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
              />
              <input
                name="tel"
                required
                placeholder="Téléphone"
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
              />
              <select
                name="depart"
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
              >
                {departures.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
              <button
                type="submit"
                className="btn-primary w-full justify-center hover:-translate-y-0.5"
              >
                Réserver <ArrowRight className="h-4 w-4" />
              </button>
            </form>

            <a
              href={`https://wa.me/${WHATSAPP}`}
              target="_blank"
              rel="noreferrer"
              className="mt-3 flex items-center justify-center gap-2 rounded-full bg-[#25D366] px-4 py-2.5 text-sm font-semibold text-white hover:opacity-95"
            >
              <MessageCircle className="h-4 w-4" /> Réserver sur WhatsApp
            </a>
            <a
              href={`tel:${PHONE.replace(/\s/g, "")}`}
              className="mt-3 flex items-center justify-center gap-2 text-sm font-medium text-primary"
            >
              <Phone className="h-4 w-4" /> {PHONE}
            </a>
            <Link
              to="/voyages-organises"
              className="mt-4 block text-center text-sm text-muted-foreground underline"
            >
              Voir tous les voyages
            </Link>
          </aside>
        </Reveal>
      </section>
      <Footer />
    </div>
  );
}
