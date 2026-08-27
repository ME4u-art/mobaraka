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
  identity: {
    name: string; // "Tazi Travels"
    tagline: string; // shown in the header top bar
    logo: string; // path under /public, e.g. "/logo-tazi-travels.png"
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
    title: string; // default <title>
    description: string; // default meta description
  };
  data: { source: "local" } | { source: "wordpress"; url: string };
};

// ——— Helpers ——————————————————————————————————————————————

export const isEnabled = (f: KnownFeature | string): boolean => agency.features[f] === true;

/** Digits-only WhatsApp number for wa.me links */
export const whatsappDigits = () => agency.contact.whatsapp.replace(/[^0-9]/g, "");

/**
 * head() meta for a feature-disabled route — otherwise the disabled page's
 * real title would still show on the 404 the route renders.
 */
export const notFoundHead = () => ({
  meta: [
    { title: `Page introuvable — ${agency.identity.name}` },
    { name: "robots", content: "noindex" },
  ],
});

// ——— Active agency (EDIT THIS PER CLIENT) ————————————————————

export const agency: AgencyConfig = {
  identity: {
    name: "Tazi Travels",
    tagline: "Agence de voyages à Meknès",
    logo: "/logo-tazi-travels.png",
  },
  theme: {
    brand: "#1a9cc0", // cyan from the Tazi calligraphy logo
    accent: "#ef6b45", // warm coral — hero accent words, OMRA badges
    highlight: "#e0a83b", // gold — handwritten eyebrows, decorative arc
    navy: "#16232f", // deep navy from the logo background
  },
  contact: {
    phones: [
      "+212 535 513 737",
      "0661 86 34 38",
      "0661 99 01 77",
      "0663 42 78 70",
      "0663 44 12 99",
    ],
    whatsapp: "+212 661 99 01 77",
    fax: "+212 535 513 333",
    email: "contact@tazitravels.com",
    addresses: {
      fr: "13, Résidence Al Madina 3, Avenue des F.A.R (V.N), Meknès",
      ar: "16 إقامة المدينة 3، شارع الجيش الملكي، المدينة الجديدة، مكناس",
    },
    mapQuery: "Tazi Travels, Avenue des FAR, Meknès",
  },
  socials: {
    facebook: "https://www.facebook.com/tazitravels",
    instagram: "https://www.instagram.com/tazitravels",
  },
  features: {
    voyagesOrganises: true,
    omra: true,
    circuits: true,
    mice: true,
    gallery: true,
  },
  partners: ["qatar", "airarabia", "etihad", "emirates", "ram", "turkish"],
  seo: {
    title: "Tazi Travels — Agence de voyages à Meknès",
    description:
      "Tazi Travels, agence de voyages à Meknès : voyages organisés, OMRA & Hajj, circuits, MICE. Dream it. Live it. Explore it.",
  },
  data: { source: "wordpress", url: "http://travel-cms.local" },
};
