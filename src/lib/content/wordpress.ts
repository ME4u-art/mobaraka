/**
 * WordPressProvider — fetches programmes from a headless WordPress site.
 *
 * Server contract (see docs/wordpress/travel-cms.php, which registers it):
 *   - CPT `programme`, REST base `programmes`, ACF/SCF field group exposed in REST
 *     (`acf` object on each post), featured image via `_embed`.
 *   - Endpoint: {wpUrl}/wp-json/wp/v2/programmes?per_page=100&_embed&acf_format=standard
 *
 * OMRA programs are NOT served from WP in v1 — the composite provider in
 * ./index.ts keeps serving those from local data.
 */
import type {
  Tour,
  ItineraryDay,
  Lodging,
  PriceTable,
  ColumnRole,
  FlightSchedule,
} from "@/lib/tours";
import { monoT, monoTList } from "@/lib/tours";
import type { OmraProgram, PriceRow } from "@/lib/omra";
import type { GalleryPhoto } from "@/lib/gallery";
import type { Localized, LocalizedList } from "@/i18n/types";
import type { ContentProvider, HomeSections } from "./provider";
import { localProvider } from "./local";

type WpPost = {
  id?: number;
  slug: string;
  title: { rendered: string };
  acf?: Record<string, unknown>;
  _embedded?: { "wp:featuredmedia"?: { source_url?: string }[] };
};

// ——— small safe readers (WP/ACF returns false/null/"" for empty fields) ———
const NEWLINES = /\r?\n+/;
const str = (v: unknown): string => (typeof v === "string" ? v.trim() : "");
const rows = (v: unknown): Record<string, unknown>[] =>
  Array.isArray(v) ? (v as Record<string, unknown>[]) : [];
const strList = (v: unknown, key: string): string[] =>
  rows(v)
    .map((r) => str(r[key]))
    .filter(Boolean);

/**
 * Read one translatable value out of an ACF record.
 *
 * Blueprint 1.1 expands every translatable field into `<name>_fr`, `<name>_en`
 * and `<name>_ar`. Earlier installs kept French in the bare key, so read `_fr`
 * first and fall back — a fork still on 1.0 keeps working. Left blank, pick()
 * falls back to French, so a client who writes one language sees no change.
 */
const loc = (a: Record<string, unknown>, key: string): Localized => ({
  fr: str(a[`${key}_fr`]) || str(a[key]),
  ar: str(a[`${key}_ar`]),
  en: str(a[`${key}_en`]),
});

/**
 * Absent when the client filled in no language at all.
 *
 * Callers used to test the bare French key, which silently became "" the day
 * the blueprint renamed it, taking every optional field with it. Testing the
 * assembled value cannot drift from how the value is built.
 */
const filled = (l: Localized): Localized | undefined => (l.fr || l.en || l.ar ? l : undefined);

/** Same for a repeater column: one row, three language sub-fields. */
const locList = (v: unknown, key: string): LocalizedList => {
  const r = rows(v);
  return {
    fr: r.map((x) => str(x[key])).filter(Boolean),
    ar: r.map((x) => str(x[`${key}_ar`])).filter(Boolean),
    en: r.map((x) => str(x[`${key}_en`])).filter(Boolean),
  };
};

/**
 * WP returns post titles as `title.rendered`, i.e. HTML — the typographic
 * apostrophe a client types in wp-admin arrives as `&#8217;`. Decode the few
 * entities that actually show up in French/Arabic titles.
 */
const ENTITIES: Record<string, string> = {
  "&amp;": "&",
  "&#038;": "&",
  "&quot;": '"',
  "&#039;": "'",
  "&#8217;": "’",
  "&#8216;": "‘",
  "&#8211;": "–",
  "&#8212;": "—",
  "&#8230;": "…",
  "&nbsp;": " ",
  "&lt;": "<",
  "&gt;": ">",
  // WordPress emits the named forms too — a French title typed with a real
  // apostrophe comes back as d&rsquo;Agafay, not d&#8217;Agafay.
  "&rsquo;": "’",
  "&lsquo;": "‘",
  "&ldquo;": "“",
  "&rdquo;": "”",
  "&laquo;": "«",
  "&raquo;": "»",
  "&ndash;": "–",
  "&mdash;": "—",
  "&hellip;": "…",
  "&apos;": "'",
};
const decodeEntities = (s: string): string =>
  s.replace(
    /&(?:amp|#038|quot|#039|apos|#8217|#8216|#8211|#8212|#8230|nbsp|lt|gt|rsquo|lsquo|ldquo|rdquo|laquo|raquo|ndash|mdash|hellip);/g,
    (m) => ENTITIES[m] ?? m,
  );

const MEAL_LABELS: Record<string, string> = {
  pdj: "Petit déjeuner",
  dej: "Déjeuner",
  diner: "Dîner",
};

function mapItinerary(v: unknown): ItineraryDay[] | undefined {
  const out = rows(v)
    .map((r) => ({
      day: loc(r, "day"),
      title: loc(r, "title"),
      description: loc(r, "description"),
      meals: monoTList(
        (Array.isArray(r.meals) ? (r.meals as string[]) : []).map((m) => MEAL_LABELS[m] ?? m),
      ),
      image: str(r.image) || undefined,
    }))
    .filter((d) => d.day.fr && d.title.fr);
  return out.length ? out : undefined;
}

function mapHebergement(v: unknown): Lodging[] | undefined {
  const out = rows(v)
    .map((r) => ({
      city: loc(r, "city"),
      nights: loc(r, "nights"),
      hotels: str(r.hotels),
    }))
    .filter((h) => h.city.fr);
  return out.length ? out : undefined;
}

function mapColumnRole(r: Record<string, unknown>): ColumnRole | null {
  const maxAge = Number(r.child_max_age) || 12;
  const ordinal = Number(r.child_ordinal) || undefined;
  switch (str(r.role)) {
    case "adultDouble":
      return { kind: "adultDouble" };
    case "adultTriple":
      return { kind: "adultTriple" };
    case "suppSingle":
      return { kind: "single", mode: "supp" };
    case "totalSingle":
      return { kind: "single", mode: "total" };
    case "child":
      return { kind: "child", maxAge, ordinal };
    default:
      return null;
  }
}

function mapPriceTables(v: unknown): PriceTable[] | undefined {
  const out = rows(v)
    .map((t) => {
      const cols = rows(t.columns);
      const columns: LocalizedList = {
        fr: [str(t.first_column_label) || "Formule", ...cols.map((c) => str(c.label))],
        ar: [str(t.first_column_label_ar), ...cols.map((c) => str(c.label_ar))],
        en: [str(t.first_column_label_en), ...cols.map((c) => str(c.label_en))],
      };
      const roles = cols.map(mapColumnRole);
      const columnRoles =
        roles.every((r) => r !== null) && roles.length > 0 ? (roles as ColumnRole[]) : undefined;
      return {
        title: str(t.title) ? loc(t, "title") : undefined,
        dates: str(t.dates) ? loc(t, "dates") : undefined,
        columns,
        columnRoles,
        rows: rows(t.rows)
          .map((r) => ({
            label: loc(r, "label"),
            sub: str(r.sub_label) ? loc(r, "sub_label") : undefined,
            cells: rows(r.cells).map((c) => str(c.value) || "—"),
          }))
          .filter((r) => r.label.fr),
      };
    })
    .filter((t) => t.rows.length);
  return out.length ? out : undefined;
}

function mapFlights(v: unknown): FlightSchedule[] | undefined {
  const out = rows(v)
    .map((f) => ({
      title: str(f.title) ? loc(f, "title") : undefined,
      legs: rows(f.legs)
        .map((l) => ({
          route: str(l.route),
          date: str(l.date),
          flightNo: str(l.flight_no),
          departure: str(l.departure),
          arrival: str(l.arrival),
        }))
        .filter((l) => l.route),
    }))
    .filter((f) => f.legs.length);
  return out.length ? out : undefined;
}

function mapPost(p: WpPost): Tour {
  const a = p.acf ?? {};
  const featured = p._embedded?.["wp:featuredmedia"]?.[0]?.source_url;
  return {
    slug: p.slug,
    // The post title is French; title_ar / title_en override it per language.
    title: {
      fr: decodeEntities(p.title?.rendered ?? p.slug),
      ar: str(a.title_ar),
      en: str(a.title_en),
    },
    subtitle: loc(a, "subtitle"),
    duration: loc(a, "duration"),
    dates: loc(a, "dates_label"),
    price: str(a.price),
    priceNote: filled(loc(a, "price_note")),
    image: featured || "/placeholder.svg",
    region: filled(loc(a, "region")) ?? monoT("—"),
    airline: str(a.airline) || undefined,
    overview: filled(loc(a, "overview")),
    route: strList(a.route, "city").length ? locList(a.route, "city") : undefined,
    highlights: strList(a.highlights, "text").length ? locList(a.highlights, "text") : undefined,
    included: strList(a.included, "text").length ? locList(a.included, "text") : undefined,
    notIncluded: strList(a.not_included, "text").length
      ? locList(a.not_included, "text")
      : undefined,
    options: strList(a.options, "text").length ? locList(a.options, "text") : undefined,
    notes: strList(a.notes, "text").length ? locList(a.notes, "text") : undefined,
    departures: strList(a.departures, "label").length ? locList(a.departures, "label") : undefined,
    hebergement: mapHebergement(a.hebergement),
    itinerary: mapItinerary(a.itinerary),
    priceTables: mapPriceTables(a.price_tables),
    flights: mapFlights(a.flights),
    deal: truthy(a.deal) || undefined,
    oldPrice: str(a.old_price) || undefined,
    // wp-admin home-page checkboxes (SCF true_false → true/false/"1"/undefined)
    featuredHero:
      a.featured_hero === true || a.featured_hero === "1" || a.featured_hero === 1 || undefined,
    featuredHome:
      a.featured_home === true || a.featured_home === "1" || a.featured_home === 1 || undefined,
  };
}

// Collection routing via the ACF `type` field on each `programme`:
//   "circuit" | "cruise" | "language" | (anything else / empty) → voyage organisé
const collectionType = (p: WpPost) => str(p.acf?.type);
const isCircuit = (p: WpPost) => collectionType(p) === "circuit";
const isCruise = (p: WpPost) => collectionType(p) === "cruise";
const isLanguage = (p: WpPost) => collectionType(p) === "language";
const isVoyage = (p: WpPost) => !isCircuit(p) && !isCruise(p) && !isLanguage(p);
const truthy = (v: unknown) => v === true || v === "1" || v === 1;

/** A textarea where the client puts one paragraph per line. */
const paragraphs = (v: unknown): string[] =>
  str(v)
    .split(NEWLINES)
    .map((x) => x.trim())
    .filter(Boolean);

/** Omra posts are titled in Arabic; the ACF fields carry the other two. */
const omraTitle = (p: WpPost, a: Record<string, unknown>): Localized => ({
  ar: decodeEntities(p.title?.rendered ?? p.slug),
  fr: str(a.title_fr),
  en: str(a.title_en),
});

// ——— OMRA & Hajj (CPT `omra`, Arabic RTL content) ———————————————

function mapOmraRow(r: Record<string, unknown>): PriceRow {
  return {
    label: loc(r, "label"),
    sub: str(r.sub_label) ? loc(r, "sub_label") : undefined,
    quad: str(r.quad),
    triple: str(r.triple),
    double: str(r.double),
    quint: str(r.quint) || undefined,
  };
}

function mapOmraPost(p: WpPost): OmraProgram {
  const a = p.acf ?? {};
  const featured = p._embedded?.["wp:featuredmedia"]?.[0]?.source_url;
  return {
    slug: p.slug,
    category: str(a.category) === "hajj" ? "hajj" : "omra",
    // The Omra post title is Arabic; title_fr / title_en override per language.
    title: omraTitle(p, a),
    shortTitle: filled(loc(a, "short_title")) ?? omraTitle(p, a),
    image: featured || "/Hajj.jpg",
    priceFrom: str(a.price_from),
    flightRoute: loc(a, "flight_route"),
    dates: locList(a.dates, "label"),
    duration: loc(a, "duration"),
    flight: loc(a, "flight"),
    // one paragraph per line in the wp-admin textarea
    // one paragraph per line, in each language's own textarea
    description: {
      fr: paragraphs(a.description),
      ar: paragraphs(a.description_ar),
      en: paragraphs(a.description_en),
    },
    tables: rows(a.tables)
      .map((t) => ({
        name: loc(t, "name"),
        tag: loc(t, "tag"),
        rows: rows(t.rows)
          .map(mapOmraRow)
          .filter((r) => r.label),
      }))
      .filter((t) => t.rows.length),
    includes: locList(a.includes, "text"),
    notes: locList(a.notes, "text"),
    // Repeater of image sub-fields, returned as plain URLs (return_format=url).
    // Older ACF setups hand back the whole attachment object — accept both.
    gallery: rows(a.gallery)
      .map((r) => {
        const img = r.image;
        if (typeof img === "string") return img.trim();
        if (img && typeof img === "object") return str((img as Record<string, unknown>).url);
        return "";
      })
      .filter(Boolean),
  };
}

async function fetchProgrammes(wpUrl: string): Promise<WpPost[]> {
  const url = `${wpUrl.replace(/\/$/, "")}/wp-json/wp/v2/programmes?per_page=100&_embed&acf_format=standard`;
  // 8s cap: an unreachable/hung WordPress must never hang page loads
  const res = await fetch(url, {
    headers: { Accept: "application/json" },
    signal: AbortSignal.timeout(8000),
  });
  if (!res.ok) throw new Error(`WordPress fetch failed: ${res.status} ${res.statusText} (${url})`);
  return (await res.json()) as WpPost[];
}

/**
 * Gallery photo: the featured image IS the photo, the post title is the
 * caption. A post with no featured image is dropped — an empty frame in the
 * grid looks broken, and the client can just re-upload.
 */
function mapPhotoPost(p: WpPost): GalleryPhoto | null {
  const image = p._embedded?.["wp:featuredmedia"]?.[0]?.source_url;
  if (!image) return null;
  const place = str(p.acf?.lieu);
  return {
    id: String(p.id ?? p.slug),
    image,
    caption: decodeEntities(str(p.title?.rendered)),
    place: place || undefined,
  };
}

/** Create a provider bound to a WordPress base URL. OMRA falls back to local data. */
export function createWordPressProvider(wpUrl: string): ContentProvider {
  // simple per-request memo so one page render = one WP call
  let cache: { at: number; posts: WpPost[] } | null = null;
  let omraCache: { at: number; posts: WpPost[] } | null = null;
  let photoCache: { at: number; posts: WpPost[] } | null = null;
  let homeCache: { at: number; sections: HomeSections | null } | null = null;
  const TTL_MS = 30_000;
  // Negative cache. All four getters hit the same host, so once one fetch fails
  // the rest will too — and each would burn its own 8s timeout, turning a dead
  // WordPress into a 60s page load. Remember the failure and skip the wait.
  // Self-healing: the gate simply expires, no reset needed.
  // ponytail: one request per cooldown still pays the full timeout. If that
  // matters, serve stale immediately and refresh in the background instead.
  const DOWN_MS = 10_000;
  let downUntil = 0;

  /**
   * Resilience: if WordPress is down, serve the last successful fetch (even
   * expired); with no cache at all, return null so getters fall back to the
   * bundled local data — the site never shows an error page because WP blinked.
   */
  const posts = async (): Promise<WpPost[] | null> => {
    if (cache && Date.now() - cache.at < TTL_MS) return cache.posts;
    if (Date.now() < downUntil) return cache?.posts ?? null;
    try {
      const fetched = await fetchProgrammes(wpUrl);
      cache = { at: Date.now(), posts: fetched };
      return fetched;
    } catch (err) {
      console.warn(
        `[content] WordPress unreachable (${wpUrl}) — ${cache ? "serving last known content" : "falling back to local data"}`,
        err,
      );
      downUntil = Date.now() + DOWN_MS;
      return cache?.posts ?? null;
    }
  };

  /** Same resilience pattern for the omra CPT. */
  const omraPosts = async (): Promise<WpPost[] | null> => {
    if (omraCache && Date.now() - omraCache.at < TTL_MS) return omraCache.posts;
    if (Date.now() < downUntil) return omraCache?.posts ?? null;
    try {
      // oldest-first: the first program created stays first (hero slide, teaser order)
      const url = `${wpUrl.replace(/\/$/, "")}/wp-json/wp/v2/omra-programmes?per_page=100&_embed&acf_format=standard&orderby=date&order=asc`;
      const res = await fetch(url, {
        headers: { Accept: "application/json" },
        signal: AbortSignal.timeout(8000),
      });
      if (!res.ok) throw new Error(`omra fetch failed: ${res.status} ${res.statusText}`);
      const fetched = (await res.json()) as WpPost[];
      omraCache = { at: Date.now(), posts: fetched };
      return fetched;
    } catch (err) {
      console.warn(
        `[content] omra WP unreachable (${wpUrl}) — ${omraCache ? "serving last known content" : "falling back to local data"}`,
        err,
      );
      downUntil = Date.now() + DOWN_MS;
      return omraCache?.posts ?? null;
    }
  };

  /** Same resilience pattern for the gallery `photo` CPT. */
  const photoPosts = async (): Promise<WpPost[] | null> => {
    if (photoCache && Date.now() - photoCache.at < TTL_MS) return photoCache.posts;
    if (Date.now() < downUntil) return photoCache?.posts ?? null;
    try {
      // menu_order first so the client can drag photos into the order they want
      // (Attributs de la page → Ordre); ties fall back to newest first.
      const url = `${wpUrl.replace(/\/$/, "")}/wp-json/wp/v2/galerie-photos?per_page=100&_embed&acf_format=standard&orderby=menu_order&order=asc`;
      const res = await fetch(url, {
        headers: { Accept: "application/json" },
        signal: AbortSignal.timeout(8000),
      });
      if (!res.ok) throw new Error(`gallery fetch failed: ${res.status} ${res.statusText}`);
      const fetched = (await res.json()) as WpPost[];
      photoCache = { at: Date.now(), posts: fetched };
      return fetched;
    } catch (err) {
      console.warn(
        `[content] gallery WP unreachable (${wpUrl}) — ${photoCache ? "serving last known content" : "falling back to demo photos"}`,
        err,
      );
      downUntil = Date.now() + DOWN_MS;
      return photoCache?.posts ?? null;
    }
  };

  return {
    getTours: async () => {
      const p = await posts();
      return p === null ? localProvider.getTours() : p.map(mapPost);
    },
    getTour: async (slug) => {
      const p = await posts();
      if (p === null) return localProvider.getTour(slug);
      const post = p.find((x) => x.slug === slug);
      return post ? mapPost(post) : undefined;
    },
    getCircuits: async () => {
      const p = await posts();
      return p === null ? localProvider.getCircuits() : p.filter(isCircuit).map(mapPost);
    },
    getVoyagesOrganises: async () => {
      const p = await posts();
      return p === null ? localProvider.getVoyagesOrganises() : p.filter(isVoyage).map(mapPost);
    },
    getCruises: async () => {
      const p = await posts();
      return p === null ? localProvider.getCruises() : p.filter(isCruise).map(mapPost);
    },
    getLanguageStays: async () => {
      const p = await posts();
      return p === null ? localProvider.getLanguageStays() : p.filter(isLanguage).map(mapPost);
    },
    getGreatDeals: async () => {
      const p = await posts();
      return p === null ? localProvider.getGreatDeals() : p.map(mapPost).filter((t) => t.deal);
    },
    // OMRA & Hajj from the `omra` CPT. WP down OR zero omra posts → bundled
    // local programs (demo content until the client creates their own).
    getOmraPrograms: async () => {
      const p = await omraPosts();
      return p === null || p.length === 0 ? localProvider.getOmraPrograms() : p.map(mapOmraPost);
    },
    getOmraProgram: async (slug) => {
      const p = await omraPosts();
      if (p === null || p.length === 0) return localProvider.getOmraProgram(slug);
      const post = p.find((x) => x.slug === slug);
      return post ? mapOmraPost(post) : undefined;
    },
    // WP down OR no photo published yet → bundled demo photos, so the page is
    // never an empty grid.
    getGalleryPhotos: async () => {
      const p = await photoPosts();
      if (p === null) return localProvider.getGalleryPhotos();
      const photos = p.map(mapPhotoPost).filter((x): x is GalleryPhoto => x !== null);
      return photos.length ? photos : localProvider.getGalleryPhotos();
    },
    getHomeSections: async () => {
      if (homeCache && Date.now() - homeCache.at < TTL_MS) return homeCache.sections;
      if (Date.now() < downUntil) return homeCache?.sections ?? null;
      try {
        const url = `${wpUrl.replace(/\/$/, "")}/wp-json/travel-cms/v1/home`;
        const res = await fetch(url, {
          headers: { Accept: "application/json" },
          signal: AbortSignal.timeout(8000),
        });
        if (!res.ok) throw new Error(`home settings fetch failed: ${res.status}`);
        const data = (await res.json()) as { configured: boolean; sections: HomeSections | null };
        const sections = data.configured && data.sections ? data.sections : null;
        homeCache = { at: Date.now(), sections };
        return sections;
      } catch (err) {
        console.warn(
          `[content] home settings unreachable (${wpUrl}) — using automatic home layout`,
          err,
        );
        downUntil = Date.now() + DOWN_MS;
        return homeCache?.sections ?? null;
      }
    },
  };
}
