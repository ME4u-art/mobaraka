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
import type { OmraProgram, PriceRow } from "@/lib/omra";
import type { GalleryPhoto } from "@/lib/gallery";
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
const str = (v: unknown): string => (typeof v === "string" ? v.trim() : "");
const rows = (v: unknown): Record<string, unknown>[] =>
  Array.isArray(v) ? (v as Record<string, unknown>[]) : [];
const strList = (v: unknown, key: string): string[] =>
  rows(v)
    .map((r) => str(r[key]))
    .filter(Boolean);

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
};
const decodeEntities = (s: string): string =>
  s.replace(
    /&(?:amp|#038|quot|#039|#8217|#8216|#8211|#8212|#8230|nbsp|lt|gt);/g,
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
      day: str(r.day),
      title: str(r.title),
      description: str(r.description),
      meals: (Array.isArray(r.meals) ? (r.meals as string[]) : []).map((m) => MEAL_LABELS[m] ?? m),
    }))
    .filter((d) => d.day && d.title);
  return out.length ? out : undefined;
}

function mapHebergement(v: unknown): Lodging[] | undefined {
  const out = rows(v)
    .map((r) => ({
      city: str(r.city),
      nights: str(r.nights),
      hotels: str(r.hotels),
    }))
    .filter((h) => h.city);
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
      const columns = [str(t.first_column_label) || "Formule", ...cols.map((c) => str(c.label))];
      const roles = cols.map(mapColumnRole);
      const columnRoles =
        roles.every((r) => r !== null) && roles.length > 0 ? (roles as ColumnRole[]) : undefined;
      return {
        title: str(t.title) || undefined,
        dates: str(t.dates) || undefined,
        columns,
        columnRoles,
        rows: rows(t.rows)
          .map((r) => ({
            label: str(r.label),
            sub: str(r.sub_label) || undefined,
            cells: rows(r.cells).map((c) => str(c.value) || "—"),
          }))
          .filter((r) => r.label),
      };
    })
    .filter((t) => t.rows.length);
  return out.length ? out : undefined;
}

function mapFlights(v: unknown): FlightSchedule[] | undefined {
  const out = rows(v)
    .map((f) => ({
      title: str(f.title) || undefined,
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

/** Decode "&amp;" etc. from WP rendered titles (SSR-safe, no DOM). */
const decode = (s: string) =>
  s
    .replace(/&amp;/g, "&")
    .replace(/&#8211;/g, "–")
    .replace(/&#8217;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"');

function mapPost(p: WpPost): Tour {
  const a = p.acf ?? {};
  const featured = p._embedded?.["wp:featuredmedia"]?.[0]?.source_url;
  return {
    slug: p.slug,
    title: decode(p.title?.rendered ?? p.slug),
    subtitle: str(a.subtitle),
    duration: str(a.duration),
    dates: str(a.dates_label),
    price: str(a.price) || "Sur demande",
    priceNote: str(a.price_note) || undefined,
    image: featured || "/placeholder.svg",
    region: str(a.region) || "—",
    airline: str(a.airline) || undefined,
    overview: str(a.overview) || undefined,
    route: strList(a.route, "city").length ? strList(a.route, "city") : undefined,
    highlights: strList(a.highlights, "text").length ? strList(a.highlights, "text") : undefined,
    included: strList(a.included, "text").length ? strList(a.included, "text") : undefined,
    notIncluded: strList(a.not_included, "text").length
      ? strList(a.not_included, "text")
      : undefined,
    options: strList(a.options, "text").length ? strList(a.options, "text") : undefined,
    notes: strList(a.notes, "text").length ? strList(a.notes, "text") : undefined,
    departures: strList(a.departures, "label").length ? strList(a.departures, "label") : undefined,
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

// ——— OMRA & Hajj (CPT `omra`, Arabic RTL content) ———————————————

function mapOmraRow(r: Record<string, unknown>): PriceRow {
  return {
    label: str(r.label),
    sub: str(r.sub_label) || undefined,
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
    title: decode(p.title?.rendered ?? p.slug),
    shortTitle: str(a.short_title) || decode(p.title?.rendered ?? p.slug),
    image: featured || "/Hajj.jpg",
    priceFrom: str(a.price_from),
    flightRoute: str(a.flight_route),
    dates: strList(a.dates, "label"),
    duration: str(a.duration),
    flight: str(a.flight),
    // one paragraph per line in the wp-admin textarea
    description: str(a.description)
      .split(/\r?\n+/)
      .map((s) => s.trim())
      .filter(Boolean),
    tables: rows(a.tables)
      .map((t) => ({
        name: str(t.name),
        tag: str(t.tag),
        rows: rows(t.rows)
          .map(mapOmraRow)
          .filter((r) => r.label),
      }))
      .filter((t) => t.rows.length),
    includes: strList(a.includes, "text"),
    notes: strList(a.notes, "text"),
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
