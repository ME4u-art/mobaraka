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
    name: "Votre Agence",
    tagline: "Agence de voyages",
    // Drop the client's file in public/ and point these at it. `logoOnDark`
    // is optional — remove it when one logo works on both surfaces.
    logo: "/logo-placeholder.svg",
    logoOnDark: "/logo-placeholder-dark.svg",
  },
  // Four seeds — every other colour on the site is derived from them
  // (see the top of styles.css). Change these and the whole site follows.
  theme: {
    brand: "#1a9cc0", // primary: buttons, links, active states
    accent: "#ef6b45", // hero accent words, badges
    highlight: "#e0a83b", // section eyebrows, decorative details
    navy: "#16232f", // body text, header pill, footer
  },
  contact: {
    phones: ["+212 500 000 000"],
    whatsapp: "+212 600 000 000",
    email: "contact@votre-agence.ma",
    addresses: {
      fr: "Adresse de l'agence, Ville",
      ar: "عنوان الوكالة، المدينة",
    },
    // Used for the Google Maps embed on /contact — the exact search string.
    mapQuery: "Votre Agence, Ville",
  },
  socials: {},
  // Unlisted keys default to OFF. The template ships with everything ON so a
  // demo shows the full catalogue — switch off whatever a client doesn't sell.
  features: {
    voyagesOrganises: true,
    circuits: true,
    cruises: true,
    languageStays: true,
    greatDeals: true,
    omra: true,
    visa: true,
    mice: true,
    gallery: true,
  },
  // Airline/partner logo ids from src/lib/partners.ts — [] hides the strip.
  partners: ["qatar", "airarabia", "etihad", "emirates", "ram", "turkish"],
  seo: {
    title: "Votre Agence — Agence de voyages",
    description:
      "Voyages organisés, circuits, OMRA & Hajj et voyages d'affaires — accompagnement complet du départ au retour.",
  },
  // "local" runs on the bundled demo content (no backend needed).
  // Switch to { source: "wordpress", url: "https://cms.client.ma" } once the
  // client's WordPress is up — see docs/wordpress/travel-cms.php.
  data: { source: "local" },
};
