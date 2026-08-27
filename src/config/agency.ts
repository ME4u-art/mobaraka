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
//
// This is the TEMPLATE's neutral default — placeholder identity, no real
// agency. Copy the folder per client and rewrite this block; nothing else
// in the codebase should ever carry a client's name, colors or contacts.
//
// A filled-in example lives in docs/clients/tazi-travels.agency.ts.

export const agency: AgencyConfig = {
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
  },
  socials: {},
  features: {
    omra: true,
    voyagesOrganises: true,
    gallery: true,
    circuits: false,
    cruises: false,
    languageStays: false,
    greatDeals: false,
    visa: false,
    mice: false,
  },
  partners: ["ram"],
  seo: {
    title: "Mobaraka Tourisme & Voyage — Omra, Hajj et voyages organisés",
    description:
      "Agence de tourisme et de voyages à Témara : programmes Omra et Hajj encadrés, vols directs et voyages organisés.",
  },
  data: { source: "local" },
};
