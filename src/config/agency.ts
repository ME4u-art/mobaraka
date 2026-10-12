import type { Locale } from "@/i18n/types";

/**
 * AGENCY CONFIG — the single file to edit when onboarding a new client.
 *
 * Everything agency-specific lives here: identity, colors, contact info,
 * social links, enabled features (sections/pages), partners and SEO.
 * Components and routes read from this config — never hardcode agency
 * values anywhere else.
 *
 * Adding a NEW feature to the template later:
 *   1. Add its key to `KnownFeature` below.
 *   2. Build its route/section, guarded by `agency.features.<key>`.
 *   3. Older client configs that don't list the key default to OFF —
 *      nothing breaks.
 */

// ——— Types ———————————————————————————————————————————————

/** Features known to the template today. Extend this union over time. */
export type KnownFeature =
  | "voyagesOrganises" // listing + tour detail pages
  | "omra" // OMRA/Hajj section (Arabic RTL)
  | "circuits" // Circuits au Maroc listing
  | "cruises" // Croisières listing (tour collection)
  | "languageStays" // Séjours linguistiques listing (tour collection)
  | "greatDeals" // Bons plans — tours flagged `deal: true`
  | "visa" // Visa & formalités info page
  | "mice" // MICE / corporate page
  | "gallery"; // photo gallery page

/** Extensible: known keys are typed, future keys are tolerated. */
export type Features = Partial<Record<KnownFeature, boolean>> & Record<string, boolean | undefined>;

export type AgencyConfig = {
  /**
   * Languages the site is published in, best first. The first one is the
   * default a visitor lands on when their browser asks for nothing we speak,
   * and a single-entry list hides the switcher.
   */
  languages: Locale[];
  identity: {
    name: string; // "Votre Agence"
    tagline: string; // shown in the header top bar
    logo: string; // path under /public, e.g. "/logo-client.png"
    /** Variant for dark surfaces (header/footer). Falls back to `logo`. */
    logoOnDark?: string;
  };
  theme: {
    /** Primary brand color (buttons, links, headings accent) */
    brand: string;
    /** Secondary accent (badges, highlights) */
    accent: string;
    /** Warm highlight (eyebrows, price highlights) */
    highlight: string;
    /** Dark tone for header/footer surfaces */
    navy: string;
    /** Header pill surface: "dark" (navy, default) or "light" (white, color logo) */
    headerStyle?: "dark" | "light";
    /** Footer surface: "dark" (navy, default) or "light" (white, color logo) */
    footerStyle?: "dark" | "light";
  };
  contact: {
    phones: string[]; // first = main, shown in header; all shown on contact/OMRA pages
    whatsapp: string; // international format, e.g. "+212 661 99 01 77"
    fax?: string;
    email: string;
    addresses: { fr: string; ar?: string };
    /** Query string for the Google Maps embed on the contact page */
    mapQuery: string;
    /**
     * A full "Share -> Embed a map" URL from Google Maps, used verbatim in
     * place of `mapQuery`. Required in practice for a Moroccan client:
     * Google draws disputed borders from the region encoded in the embed,
     * and only this URL form carries one. Generated in Morocco it ends in
     * `!2sma` and shows the country whole; the plain ?q= form splits
     * Western Sahara off with a dashed line, and gl/region do not fix it.
     */
    mapEmbedUrl?: string;
  };
  socials: {
    facebook?: string;
    instagram?: string;
    tiktok?: string;
    youtube?: string;
  };
  features: Features;
  /** Partner/airline logo ids that exist in src/lib/partners.ts */
  partners?: string[];
  seo: {
    /** Absolute site origin, for canonical/hreflang/og:url. */
    url: string;
    title: string; // default <title>
    description: string; // default meta description
  };
  /**
   * Registry details for the legal notice. RC and ICE are public register
   * entries and may be published; nothing else belongs here — no CIN, no date
   * of birth, no identifiant fiscal, no patente, no CNSS.
   */
  legal?: {
    capital: string; // "100 000,00 MAD"
    rc: string; // "522321 — Casablanca"
    ice: string; // "002944697000007"
    manager: string; // the gérant(e) as the register spells it
  };
  data: { source: "local" } | { source: "wordpress"; url: string };
};

// ——— Helpers ——————————————————————————————————————————————

export const isEnabled = (f: KnownFeature | string): boolean => agency.features[f] === true;

/** The language a visitor lands on when we speak none of theirs. */
export const defaultLocale = (): Locale => agency.languages[0] ?? "fr";

/** One language means no switcher — a lone "FR" button is noise. */
export const isMultilingual = (): boolean => agency.languages.length > 1;

/**
 * The agency's address in the reader's script.
 *
 * Arabic falls back to the French line when a client has not supplied one —
 * an address is still useful in the wrong script, where a blank is not.
 */
export const addressFor = (locale: Locale): string =>
  (locale === "ar" && agency.contact.addresses.ar) || agency.contact.addresses.fr;

/**
 * Absolute URL for a root-relative path.
 *
 * Canonical, hreflang and og:url all need one: Google silently ignores a
 * relative alternate, which leaves the language trees competing with each
 * other as duplicates instead of being understood as translations.
 */
export const absoluteUrl = (path: string) =>
  `${agency.seo.url.replace(/\/$/, "")}${path.startsWith("/") ? path : `/${path}`}`;

/** Digits-only WhatsApp number for wa.me links */
export const whatsappDigits = () => agency.contact.whatsapp.replace(/[^0-9]/g, "");

/**
 * head() meta for a feature-disabled route — otherwise the disabled page's
 * real title would still show on the 404 the route renders.
 */
export const notFoundHead = (title: string) => ({
  meta: [
    { title: `${title} — ${agency.identity.name}` },
    { name: "robots", content: "noindex" },
  ],
});

// ——— Active agency (EDIT THIS PER CLIENT) ————————————————————
//
// This is the TEMPLATE's neutral default — placeholder identity, no real
// agency. Copy the folder per client and rewrite this block; nothing else
// in the codebase should ever carry a client's name, colors or contacts.
//
// A filled-in example lives in docs/clients/tazi-travels.agency.ts.

export const agency: AgencyConfig = {
  // Omra sells in Arabic, the agency corresponds in French, and English is
  // there for the diaspora. French first: it is what the flyers are written in.
  languages: ["fr", "ar", "en"],
  identity: {
    name: "Mobaraka Tourisme & Voyage",
    tagline: "Agence de tourisme et de voyages — Témara",
    logo: "/logo-mobaraka.png",
    // No on-dark variant: the mark is black + red, so the header and footer
    // run in their "light" mode below and the colour logo is used everywhere.
  },
  // Sampled from the logo: the red is #e10d0d, the kufic mark is near-black.
  theme: {
    brand: "#e10d0d", // logo red — buttons, links, active states
    accent: "#c9a227", // gold, echoing the agency's own Omra flyers
    highlight: "#e0b64a", // lighter gold — section eyebrows
    navy: "#121010", // logo black, softened a touch for large surfaces
    headerStyle: "light",
    footerStyle: "light",
  },
  contact: {
    phones: [
      "05 37 64 52 65",
      "06 61 74 74 73",
      "06 61 74 94 16",
      "06 11 89 70 91",
      "06 71 95 64 18",
    ],
    whatsapp: "+212 661 74 74 73",
    email: "contact@mobaraka.ma",
    addresses: {
      fr: "N°3471, Magasin n°1, Quartier Al Wifaq, RDC, Témara",
      ar: "رقم 3471، المحل رقم 1، حي الوفاق، تمارة",
    },
    mapQuery: "Mobaraka Tourisme et Voyage, Al Wifaq, Témara",
    // Coordinates rather than a search string, so the embed can carry !2sma -
    // the region field Google uses for disputed borders. Without it the map
    // splits Western Sahara off Morocco with a dashed line, and a ?q= embed
    // cannot carry the field at all.
    //
    // 33.9235395, -6.9316651 = Bd Dr Abdelkrim El Khatteb, Temara. Geocoded,
    // not confirmed: it centres on their boulevard, not their door.
    mapEmbedUrl:
      "https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d3000!2d-6.9316651!3d33.9235395!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1sfr!2sma!4v1758000000000!5m2!1sfr!2sma",
  },
  socials: {},
  features: {
    omra: true,
    voyagesOrganises: true,
    gallery: true,
    // On for the demo so the client sees every section the site offers;
    // the catalogue has no circuit yet, so the page shows its empty state.
    circuits: true,
    cruises: true,
    languageStays: true,
    greatDeals: true,
    visa: true,
    mice: true,
  },
  partners: [],
  seo: {
    // No domain of its own yet — update this the day it gets one, or
    // canonical and hreflang will point at the wrong host.
    url: "https://mobaraka.vercel.app",
    title: "Mobaraka Tourisme & Voyage — Omra, Hajj et voyages organisés",
    description:
      "Agence de tourisme et de voyages à Témara : programmes Omra et Hajj encadrés, vols directs et voyages organisés.",
  },
  data: { source: "local" },
};
